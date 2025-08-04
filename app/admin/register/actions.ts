'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const FormSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  role: z.enum(['instructor'], { required_error: 'Role is required.' }),
  gender: z.enum(['Male', 'Female'], { required_error: 'Gender is required.' }),
  dateOfBirth: z.string().min(1, 'Date of birth is required.'),
  phoneNumber: z.string().optional(),
})

export type State = {
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    password?: string[]
    role?: string[]
    gender?: string[]
    dateOfBirth?: string[]
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
    gender: formData.get('gender'),
    dateOfBirth: formData.get('dateOfBirth'),
    phoneNumber: formData.get('phoneNumber'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to register user. Please check the fields.',
    }
  }

  const {
    email,
    password,
    role,
    firstName,
    lastName,
    gender,
    dateOfBirth,
    phoneNumber,
  } = validatedFields.data

  const supabaseAdmin = createAdminClient()
  
  // NEW: Step 0 - Check if a profile with this email already exists
  const { data: existingProfile, error: existingProfileError } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (existingProfile) {
    return {
      errors: { email: ['A user profile with this email already exists.'] },
      message: 'Registration failed.',
    }
  }

  // Step 1: Create the user in auth.users
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
  })

  if (authError) {
    console.error('Supabase Auth Error:', authError)
    if (authError.message.includes('User already registered')) {
      return {
        errors: { email: ['A user with this email already exists in the authentication system. Please clean up the user records.'] },
        message: 'Registration failed.',
      }
    }
    return {
      errors: { server: ['Failed to create authentication user.'] },
      message: 'Registration failed.',
    }
  }

  if (!authData.user) {
    return {
      errors: { server: ['Could not retrieve user after creation.'] },
      message: 'Registration failed.',
    }
  }
  
  // Step 2: Create the user's profile in public.profiles
  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: authData.user.id,
    first_name: firstName,
    last_name: lastName,
    email: email,
    role: role,
    gender: gender,
    date_of_birth: dateOfBirth,
    phone_number: phoneNumber,
  })

  if (profileError) {
    console.error('Supabase Profile Error:', profileError)
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
    return {
      errors: { server: ['Failed to create user profile.'] },
      message: 'Registration failed. User was rolled back.',
    }
  }

  return { message: `Successfully registered ${role}: ${firstName} ${lastName}` }
}