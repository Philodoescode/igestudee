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
      // THIS IS THE FIX: Explicitly specify the db schema to use.
      // For RPC calls from the server, 'public' ensures it routes through the public API gateway.
      db: {
        schema: 'public',
      }
    }
  )
}