// FILE: app/admin/register/actions.ts
'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation' // It's good practice to invalidate or redirect on success

const FormSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  role: z.enum(['instructor'], { required_error: 'Role is required.' }),
  phoneNumber: z.string().optional(),
})

export type State = {
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    password?: string[]
    role?: string[]
    phoneNumber?: string[]
    server?: string[]
  }
  message?: string | null
}

export async function registerStaff(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
    phoneNumber: formData.get('phoneNumber'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to register user. Please check the fields.',
    }
  }

  const { email, password, role, firstName, lastName, phoneNumber } = validatedFields.data
  const supabaseAdmin = createAdminClient()

  // Step 1: Create the user in auth.users using the Admin API
  const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Auto-confirm the user's email
  });

  if (authError || !user) {
    console.error('Supabase Auth Error:', authError)
    if (authError?.message.includes('User already registered')) {
      return {
        errors: { email: ['A user with this email already exists.'] },
        message: 'Registration failed.',
      }
    }
    return {
      errors: { server: ['Failed to create authentication user.'] },
      message: 'Registration failed.',
    }
  }

  // Step 2: Now insert into your public tables.
  try {
    // Insert into the primary public.users table
    const { error: userError } = await supabaseAdmin.from('users').insert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      role: role,
    })

    if (userError) throw userError;

    // If the role is instructor, insert into the details table
    if (role === 'instructor' && phoneNumber) {
      const { error: detailsError } = await supabaseAdmin.from('instructor_details').insert({
        user_id: user.id,
        phone_number: phoneNumber,
      })
      if (detailsError) throw detailsError;
    }
  } catch (error: any) {
    console.error('Error inserting user profile:', error)
    // CRITICAL: If profile insert fails, delete the auth user to prevent orphans.
    await supabaseAdmin.auth.admin.deleteUser(user.id)
    return {
      errors: { server: [`Failed to create user profile in public tables: ${error.message}`] },
      message: 'Registration failed. The operation was rolled back.',
    }
  }

  // If everything succeeded
  return { message: `Successfully registered ${role}: ${firstName} ${lastName}` }
}