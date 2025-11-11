/**
 * Protected Route Component
 * 
 * Componente que protege rotas privadas.
 * Redireciona para login se usuário não estiver autenticado.
 * 
 * Como usar:
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/lib/constants/app'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Aguarda carregar para verificar
    if (!loading && !user) {
      // Usuário não autenticado, redireciona para login
      router.push(ROUTES.LOGIN)
    }
  }, [user, loading, router])

  // Enquanto carrega, mostra loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-neutral-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não tem usuário, não renderiza nada (está redirecionando)
  if (!user) {
    return null
  }

  // Usuário autenticado, renderiza o conteúdo
  return <>{children}</>
}
