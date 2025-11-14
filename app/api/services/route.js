/**
 * API Route: Services (Dashboard)
 *
 * Responsável por listar e criar serviços vinculados aos estabelecimentos
 * do usuário logado. Todos os serviços são ligados ao modelo Service do Prisma.
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants/app'
import { sanitizeString, sanitizeHTML } from '@/lib/security/sanitize'
import { validateRequired, validateMultiple } from '@/lib/validators'

async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

function validateServicePayload(data) {
  const { name, durationMinutes, price } = data

  return validateMultiple({
    name: () => validateRequired(name, 'Nome do serviço'),
    durationMinutes: () => {
      const duration = Number(durationMinutes)
      const isValid = Number.isFinite(duration) && duration > 0
      return {
        isValid,
        error: isValid ? null : 'Duração deve ser um número maior que zero (em minutos)',
      }
    },
    price: () => {
      const priceNumber = Number(price)
      const isValid = Number.isFinite(priceNumber) && priceNumber >= 0
      return {
        isValid,
        error: isValid ? null : 'Preço deve ser um número maior ou igual a zero',
      }
    },
  })
}

/**
 * GET /api/services
 *
 * Lista serviços de todos os estabelecimentos do usuário logado.
 */
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED },
      )
    }

    const services = await prisma.service.findMany({
      where: {
        establishment: {
          userId: user.id,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true,
        active: true,
        establishment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, services },
      { status: HTTP_STATUS.OK },
    )
  } catch (error) {
    console.error('[SERVICES_GET_ERROR]', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    )
  }
}

/**
 * POST /api/services
 *
 * Cria um novo serviço vinculado ao primeiro estabelecimento do usuário.
 * (MVP: no futuro podemos permitir escolher o estabelecimento).
 */
export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED },
      )
    }

    const establishment = await prisma.establishment.findFirst({
      where: { userId: user.id },
      select: { id: true },
    })

    if (!establishment) {
      return NextResponse.json(
        { success: false, error: 'Crie um estabelecimento antes de cadastrar serviços.' },
        { status: HTTP_STATUS.BAD_REQUEST },
      )
    }

    const rawData = await request.json()

    const data = {
      name: sanitizeHTML(sanitizeString(rawData.name || '')),
      description: sanitizeHTML(sanitizeString(rawData.description || '')),
      durationMinutes: rawData.durationMinutes,
      price: rawData.price,
    }

    const validation = validateServicePayload(data)

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          details: validation.errors,
        },
        { status: HTTP_STATUS.BAD_REQUEST },
      )
    }

    const duration = Number(data.durationMinutes)
    const priceNumber = Number(data.price)

    const service = await prisma.service.create({
      data: {
        name: data.name,
        description: data.description || null,
        duration: duration,
        price: priceNumber,
        active: true,
        establishmentId: establishment.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true,
        active: true,
      },
    })

    return NextResponse.json(
      { success: true, service },
      { status: HTTP_STATUS.CREATED },
    )
  } catch (error) {
    console.error('[SERVICES_POST_ERROR]', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    )
  }
}
