/**
 * API Route: Service (Update)
 *
 * Permite atualizar campos básicos de um serviço (nome, descrição, duração,
 * preço, ativo). Garante que o serviço pertença a um estabelecimento do
 * usuário logado.
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants/app'
import { sanitizeString, sanitizeHTML } from '@/lib/security/sanitize'

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

    const existing = await prisma.service.findUnique({
      where: { id },
      select: {
        id: true,
        establishment: {
          select: {
            userId: true,
          },
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

    if (rawData.description !== undefined) {
      updates.description = sanitizeHTML(sanitizeString(rawData.description))
    }

    if (rawData.durationMinutes !== undefined) {
      const duration = Number(rawData.durationMinutes)
      if (!Number.isFinite(duration) || duration <= 0) {
        return NextResponse.json(
          { success: false, error: 'Duração inválida' },
          { status: HTTP_STATUS.BAD_REQUEST },
        )
      }
      updates.duration = duration
    }

    if (rawData.price !== undefined) {
      const priceNumber = Number(rawData.price)
      if (!Number.isFinite(priceNumber) || priceNumber < 0) {
        return NextResponse.json(
          { success: false, error: 'Preço inválido' },
          { status: HTTP_STATUS.BAD_REQUEST },
        )
      }
      updates.price = priceNumber
    }

    if (rawData.active !== undefined) {
      updates.active = Boolean(rawData.active)
    }

    const service = await prisma.service.update({
      where: { id },
      data: updates,
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
      { status: HTTP_STATUS.OK },
    )
  } catch (error) {
    console.error('[SERVICE_PATCH_ERROR]', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    )
  }
}
