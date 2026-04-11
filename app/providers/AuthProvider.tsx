import React, { createContext, useContext } from 'react'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

export interface AuthContextType {
  isSignedIn: boolean
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, metadata?: any) => Promise<any>
  resetPassword: (email: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const AuthProviderContent = ({ children }: { children: React.ReactNode }) => {
  const {
    user: supabaseUser,
    loading: supabaseLoading,
    signIn: supabaseSignIn,
    signUp: supabaseSignUp,
    signOut: supabaseSignOut,
    resetPassword: supabaseResetPassword,
  } = useSupabaseAuth()

  const signOut = async () => {
    try {
      const { error } = await supabaseSignOut()
      if (error) throw error
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseSignIn(email, password)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      return { data: null, error }
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabaseSignUp(email, password, metadata)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao registrar:', error)
      return { data: null, error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabaseResetPassword(email)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Erro ao resetar senha:', error)
      return { data: null, error }
    }
  }

  const value: AuthContextType = {
    isSignedIn: Boolean(supabaseUser),
    user: supabaseUser
      ? {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          full_name:
            supabaseUser.user_metadata?.full_name ||
            supabaseUser.user_metadata?.name,
          avatar_url: supabaseUser.user_metadata?.avatar_url,
        }
      : null,
    loading: supabaseLoading,
    signOut,
    signIn,
    signUp,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProviderContent>
      {children}
    </AuthProviderContent>
  )
}

export default AuthProvider