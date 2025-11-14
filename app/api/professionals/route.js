/**
 * API Route: Professionals (Dashboard)
 *
 * Lista e cria profissionais vinculados aos estabelecimentos do usuário logado.
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants/app'
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeHTML } from '@/lib/security/sanitize'
import { validateRequired, validateOptionalEmail, validateMultiple } from '@/lib/validators'

async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

function validateProfessionalPayload(data) {
  const { name, email, phone } = data

  return validateMultiple({
    name: () => validateRequired(name, 'Nome do profissional'),
    email: () => validateOptionalEmail(email),
    phone: () => validateRequired(phone, 'Telefone'),
  })
}

/**
 * GET /api/professionals
 *
 * Lista profissionais dos estabelecimentos do usuário logado.
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

    const professionals = await prisma.professional.findMany({
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
        email: true,
        phone: true,
        specialty: true,
        imageUrl: true,
        establishment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, professionals },
      { status: HTTP_STATUS.OK },
    )
  } catch (error) {
    console.error('[PROFESSIONALS_GET_ERROR]', {
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
 * POST /api/professionals
 *
 * Cria um novo profissional vinculado ao primeiro estabelecimento do usuário.
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
        { success: false, error: 'Crie um estabelecimento antes de cadastrar profissionais.' },
        { status: HTTP_STATUS.BAD_REQUEST },
      )
    }

    const rawData = await request.json()

    const data = {
      name: sanitizeHTML(sanitizeString(rawData.name || '')),
      email: sanitizeEmail(rawData.email || ''),
      phone: sanitizePhone(rawData.phone || ''),
      specialty: sanitizeHTML(sanitizeString(rawData.specialty || '')),
    }

    const validation = validateProfessionalPayload(data)

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

    const professional = await prisma.professional.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        specialty: data.specialty || null,
        imageUrl: null,
        establishmentId: establishment.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        specialty: true,
      },
    })

    return NextResponse.json(
      { success: true, professional },
      { status: HTTP_STATUS.CREATED },
    )
  } catch (error) {
    console.error('[PROFESSIONALS_POST_ERROR]', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    )
  }
}
