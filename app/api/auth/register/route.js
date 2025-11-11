/**
 * API Route: Registro de Usuário
 * 
 * Este endpoint permite criar novos usuários no sistema.
 * 
 * Segurança implementada:
 * - Validação de entrada com funções dedicadas
 * - Sanitização de dados antes de processar
 * - Hash seguro de senha com bcrypt
 * - Proteção contra duplicação de email
 * - Logs seguros (sem expor dados sensíveis)
 * - Tratamento adequado de erros
 */

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { validateUserRegistrationServer } from '@/lib/validators/server'
import { sanitizeUserRegistrationData } from '@/lib/security/sanitize'
import { 
  HTTP_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  SECURITY_CONFIG 
} from '@/lib/constants/app'

/**
 * Cria um novo usuário no sistema
 * @param {Request} request - Request do Next.js
 * @returns {Response} JSON com resultado da operação
 */
export async function POST(request) {
  try {
    console.log('[REGISTER_API] Iniciando registro...')
    
    // 1. PARSE dos dados da requisição
    const rawData = await request.json()
    console.log('[REGISTER_API] Dados recebidos:', { ...rawData, password: '[HIDDEN]' })

    // 2. SANITIZAÇÃO dos dados (previne XSS e outros ataques)
    const sanitizedData = sanitizeUserRegistrationData(rawData)
    console.log('[REGISTER_API] Dados sanitizados')

    // 3. VALIDAÇÃO dos dados (apenas campos que vêm do servidor)
    const validation = validateUserRegistrationServer(sanitizedData)
    console.log('[REGISTER_API] Validação:', validation.isValid ? 'OK' : 'FALHOU', validation.isValid ? '' : validation.errors)
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Dados inválidos',
          details: validation.errors 
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    const { name, email, password, phone } = sanitizedData

    // 4. VERIFICAR se email já existe no banco
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true } // Apenas o necessário
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          error: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS 
        },
        { status: HTTP_STATUS.CONFLICT }
      )
    }

    // 5. HASH da senha (usando rounds configurados)
    const hashedPassword = await bcrypt.hash(password, SECURITY_CONFIG.BCRYPT_ROUNDS)

    // 6. CRIAR usuário no banco
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
      },
      // Nunca retornar a senha, mesmo que hasheada
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      }
    })

    // 7. RETORNAR sucesso
    return NextResponse.json(
      { 
        success: true,
        message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
        user 
      },
      { status: HTTP_STATUS.CREATED }
    )

  } catch (error) {
    // IMPORTANTE: Nunca expor detalhes do erro para o cliente
    // Apenas logar internamente
    console.error('[REGISTER_ERROR]', {
      message: error.message,
      // Não logar dados sensíveis como senhas
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { 
        success: false,
        error: ERROR_MESSAGES.SERVER_ERROR 
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }
}
