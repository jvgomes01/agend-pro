/**
 * Session Provider
 * 
 * Componente que envolve a aplicação e fornece contexto de autenticação.
 * Necessário para o NextAuth funcionar no client-side.
 * 
 * Como usar:
 * Envolver a aplicação no layout root.
 */

'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export function SessionProvider({ children, session }) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
}
