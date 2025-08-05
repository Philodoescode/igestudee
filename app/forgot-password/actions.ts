'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const FormSchema = z.object({
  email: z.string().email('Invalid email address.'),
})

export type State = {
  message: string | null
  error?: string
}

export async function requestPasswordReset(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return {
      message: 'Invalid email address provided.',
      error: 'validation',
    }
  }
  
  const email = validatedFields.data.email
  const supabaseAdmin = createAdminClient()

  // --- SECURITY FIX: VERIFY USER EXISTS BEFORE SENDING RESET LINK ---
  // We use the admin client to securely query our database, bypassing RLS.
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  // If a profile exists, we proceed to send the password reset email.
  if (profile && !profileError) {
    const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`;
    
    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    
    if (resetError) {
        console.error("Supabase Password Reset Error:", resetError.message);
        // Do not expose detailed errors to the user
        return { message: "Could not send reset email. Please try again later.", error: 'server' };
    }
  } 
  // If the profile does NOT exist (or there was a db error), we do NOTHING.
  // We still return a generic success message to prevent attackers from
  // figuring out which emails are registered in our system (email enumeration).

  return {
    message: "If an account with that email exists, a password reset link has been sent.",
  }
}