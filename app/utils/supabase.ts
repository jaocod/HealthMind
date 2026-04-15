
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

function getEnv() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  return { url, key }
}

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase

  const { url, key } = getEnv()

  if (!url || !key) {
    // Do not throw here to avoid breaking the router scanning step.
    // Return a minimal stub that will error when used if env not configured.
    console.warn('Supabase env vars missing: EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_KEY/ANON_KEY')
    console.warn('URL:', url, 'Key:', key)
    // Create a lightweight stub object to avoid runtime crashes on import.
    const stub: any = {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not initialized') }),
        signUp: async () => ({ data: null, error: new Error('Supabase not initialized') }),
        signOut: async () => ({ error: new Error('Supabase not initialized') }),
        resetPasswordForEmail: async () => ({ data: null, error: new Error('Supabase not initialized') }),
      },
      from: () => ({ select: async () => ({ data: null, error: new Error('Supabase not initialized') }) }),
    }
    _supabase = stub
    return _supabase as SupabaseClient
  }

  _supabase = createClient(url, key, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  })

  return _supabase
}

export function clearSupabase() {
  _supabase = null
}

export default getSupabase