// lib/supabase/admin.ts
// This client uses the SERVICE_ROLE_KEY for admin-level operations.
// NEVER expose this client or the key to the browser.
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export const createAdminClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase URL or Service Role Key is missing from environment variables.')
  }
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}