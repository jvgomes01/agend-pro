/**
 * API Route: Dados públicos do Estabelecimento
 *
 * Retorna informações necessárias para o fluxo de agendamento via link público.
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { HTTP_STATUS, ERROR_MESSAGES } from '@/lib/constants/app'

export async function GET(_request, { params }) {
  try {
    // `params` é assíncrono em rotas dinâmicas no Next 16
    const { slug } = await params

    // Validação defensiva: garante que o slug foi informado
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Estabelecimento não encontrado (slug inválido).' },
        { status: HTTP_STATUS.BAD_REQUEST },
      )
    }

    const establishment = await prisma.establishment.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        type: true,
        imageUrl: true,
        services: {
          where: { active: true },
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
          },
        },
        professionals: {
          select: {
            id: true,
            name: true,
            specialty: true,
          },
        },
      },
    })

    if (!establishment) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND },
      )
    }

    return NextResponse.json(
      { success: true, establishment },
      { status: HTTP_STATUS.OK },
    )
  } catch (error) {
    console.error('[PUBLIC_ESTABLISHMENT_ERROR]', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    )
  }
}
