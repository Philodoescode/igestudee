// app/forgot-password/actions.ts
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

  // Best practice: To prevent email enumeration attacks, we don't reveal if a user exists.
  // We will attempt the reset and return a generic success message regardless.
  // The check for the profile is removed to enhance security.

  // The redirectTo URL must be an absolute URL and match one of the URLs in your Supabase Auth settings.
  const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`;
  
  const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  
  if (resetError) {
      console.error("Supabase Password Reset Error:", resetError.message);
      // Don't expose specific errors to the client to prevent user enumeration.
      // However, you can handle specific cases like rate-limiting if desired.
      if (resetError.message.includes("rate limit")) {
        return { message: "Rate limit exceeded. Please wait a minute before trying again.", error: 'server' };
      }
      // For any other error, we still return the generic success message.
  }

  // Always return a generic success message to prevent leaking information about which emails are registered.
  return {
    message: "If an account with that email exists, a password reset link has been sent.",
  }
}