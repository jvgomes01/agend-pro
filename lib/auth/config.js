/**
 * Configuração do NextAuth
 * 
 * Este arquivo centraliza toda a configuração de autenticação.
 * Seguindo clean code, separamos a configuração da implementação.
 * 
 * Segurança implementada:
 * - Passwords nunca expostos
 * - Sessions com JWT seguro
 * - Callbacks para controle de acesso
 * - Timeouts configuráveis
 */

import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { validateLoginCredentials } from '@/lib/validators'
import { sanitizeEmail } from '@/lib/security/sanitize'
import { ERROR_MESSAGES, SECURITY_CONFIG } from '@/lib/constants/app'

/**
 * Autentica usuário com email e senha
 * @param {Object} credentials - { email, password }
 * @returns {Object|null} Dados do usuário ou null se falhar
 */
async function authenticateUser(credentials) {
  // 1. VALIDAR credenciais
  const validation = validateLoginCredentials(credentials)
  
  if (!validation.isValid) {
    throw new Error('Credenciais inválidas')
  }

  // 2. SANITIZAR email
  const email = sanitizeEmail(credentials.email)
  const password = credentials.password

  // 3. BUSCAR usuário no banco
  // IMPORTANTE: Não expor se o email existe ou não (segurança)
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true, // Precisamos para comparar
      phone: true,
    }
  })

  // Se usuário não existe, retorna null sem detalhes
  if (!user) {
    return null
  }

  // 4. VERIFICAR senha
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return null
  }

  // 5. RETORNAR dados do usuário (SEM a senha!)
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
  }
}

/**
 * Configuração do NextAuth
 */
export const authOptions = {
  // === PROVIDERS ===
  // Define como os usuários podem fazer login
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const user = await authenticateUser(credentials)
          
          if (!user) {
            // Mensagem genérica por segurança
            throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS)
          }

          return user
        } catch (error) {
          console.error('[AUTH_ERROR]', {
            message: error.message,
            timestamp: new Date().toISOString(),
          })
          
          // Sempre retorna mensagem genérica
          throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS)
        }
      }
    })
  ],

  // === PAGES ===
  // Customizar páginas de autenticação
  pages: {
    signIn: '/login',
    error: '/login',
  },

  // === SESSION ===
  // Configuração de sessão
  session: {
    strategy: 'jwt', // Usando JWT (stateless)
    maxAge: SECURITY_CONFIG.TOKEN_EXPIRY, // 7 dias
  },

  // === CALLBACKS ===
  // Callbacks para customizar comportamento
  callbacks: {
    /**
     * Callback executado ao criar JWT
     * Aqui definimos o que vai no token
     */
    async jwt({ token, user }) {
      // Ao fazer login, user é passado
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.phone = user.phone
      }
      
      return token
    },

    /**
     * Callback executado ao criar sessão
     * Define o que fica disponível no cliente
     */
    async session({ session, token }) {
      // Transfere dados do token para a sessão
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
        session.user.phone = token.phone
      }
      
      return session
    }
  },

  // === SEGURANÇA ===
  secret: process.env.NEXTAUTH_SECRET,
  
  // Debug apenas em desenvolvimento
  debug: process.env.NODE_ENV === 'development',
}
