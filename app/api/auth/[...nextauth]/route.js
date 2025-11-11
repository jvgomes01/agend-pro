/**
 * NextAuth Route Handler
 * 
 * Este é o endpoint principal de autenticação.
 * Todas as rotas de auth (/api/auth/*) passam por aqui.
 * 
 * Rotas disponíveis automaticamente:
 * - POST /api/auth/signin - Login
 * - POST /api/auth/signout - Logout
 * - GET /api/auth/session - Verificar sessão
 * - GET /api/auth/csrf - Token CSRF
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/config'

// Handler para GET e POST
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
