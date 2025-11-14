/**
 * API Route: Professional (Update)
 *
 * Atualiza dados básicos do profissional (nome, email, telefone, especialidade)
 * garantindo que ele pertença a um estabelecimento do usuário logado.
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants/app'
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeHTML } from '@/lib/security/sanitize'

async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED },
      )
    }

    const { id } = params

    const existing = await prisma.professional.findUnique({
      where: { id },
      select: {
        id: true,
        establishment: {
          select: { userId: true },
        },
      },
    })

    if (!existing || existing.establishment.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND },
      )
    }

    const rawData = await request.json()
    const updates = {}

    if (rawData.name !== undefined) {
      updates.name = sanitizeHTML(sanitizeString(rawData.name))
    }
    if (rawData.email !== undefined) {
      updates.email = sanitizeEmail(rawData.email || '') || null
    }
    if (rawData.phone !== undefined) {
      updates.phone = sanitizePhone(rawData.phone || '')
    }
    if (rawData.specialty !== undefined) {
      updates.specialty = sanitizeHTML(sanitizeString(rawData.specialty || '')) || null
    }

    const professional = await prisma.professional.update({
      where: { id },
      data: updates,
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
      { status: HTTP_STATUS.OK },
    )
  } catch (error) {
    console.error('[PROFESSIONAL_PATCH_ERROR]', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    )
  }
}
