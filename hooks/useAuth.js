/**
 * Custom Hook: useAuth
 * 
 * Hook para gerenciar autenticação e sessão do usuário.
 * Abstrai a complexidade do NextAuth e fornece interface simples.
 * 
 * Como usar:
 * const { user, loading, login, logout } = useAuth()
 * 
 * if (loading) return <Loading />
 * if (!user) return <Login />
 * return <Dashboard user={user} />
 */

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants/app'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Estado de carregamento
  const loading = status === 'loading'

  // Usuário atual (ou null se não logado)
  const user = session?.user || null

  // Se está autenticado
  const isAuthenticated = !!user

  /**
   * Faz login do usuário
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Resultado do login
   */
  const login = async (credentials) => {
    try {
      const result = await signIn('credentials', {
        redirect: false, // Não redirecionar automaticamente
        email: credentials.email,
        password: credentials.password,
      })

      // Se houver erro
      if (result?.error) {
        return {
          success: false,
          error: result.error
        }
      }

      // Sucesso!
      return {
        success: true
      }
    } catch (error) {
      console.error('[LOGIN_ERROR]', error)
      return {
        success: false,
        error: 'Erro ao fazer login'
      }
    }
  }

  /**
   * Faz logout do usuário
   */
  const logout = async () => {
    try {
      await signOut({ 
        redirect: false // Não redirecionar automaticamente
      })
      
      // Redireciona manualmente
      router.push(ROUTES.HOME)
    } catch (error) {
      console.error('[LOGOUT_ERROR]', error)
    }
  }

  /**
   * Redireciona para login se não autenticado
   */
  const requireAuth = () => {
    if (!loading && !isAuthenticated) {
      router.push(ROUTES.LOGIN)
    }
  }

  return {
    // Estado
    user,
    loading,
    isAuthenticated,
    
    // Funções
    login,
    logout,
    requireAuth,
  }
}
