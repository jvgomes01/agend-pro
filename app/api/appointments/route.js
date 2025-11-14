/**
 * API Route: Appointments (Dashboard)
 *
 * Esta rota interna é usada pelo dashboard do dono do estabelecimento para:
 * - Listar agendamentos (independente de serem públicos ou manuais)
 * - Criar novos agendamentos manualmente (MVP)
 *
 * Importante: todos os agendamentos, tanto públicos quanto manuais,
 * são persistidos na mesma tabela `Appointment` do Prisma. Assim,
 * a listagem do dashboard sempre mostra tudo integrado.
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants/app'
import { sanitizePublicAppointmentData } from '@/lib/security/sanitize'
import { validatePublicAppointmentServer } from '@/lib/validators/server'
import { sendAppointmentConfirmation } from '@/lib/notifications/appointments'

async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}

/**
 * GET /api/appointments
 *
 * Lista agendamentos do(s) estabelecimento(s) do usuário logado.
 * Retorna dados já prontos para exibição no dashboard.
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

    const appointments = await prisma.appointment.findMany({
      where: {
        // Filtra por estabelecimentos pertencentes ao usuário logado
        establishment: {
          userId: user.id,
        },
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
        },
        professional: {
          select: {
            id: true,
            name: true,
          },
        },
        establishment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 100, // Limite inicial simples (pode evoluir para paginação futuramente)
    })

    return NextResponse.json(
      { success: true, appointments },
      { status: HTTP_STATUS.OK },
    )
  } catch (error) {
    console.error('[APPOINTMENTS_GET_ERROR]', {
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
 * POST /api/appointments
 *
 * Cria um agendamento manual a partir do dashboard.
 * Reaproveita a mesma validação/sanitização da rota pública para garantir
 * consistência entre agendamentos criados pelo cliente e pelo dono.
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

    // Garante que o usuário tenha pelo menos um estabelecimento
    const establishment = await prisma.establishment.findFirst({
      where: { userId: user.id },
      select: { id: true },
    })

    if (!establishment) {
      return NextResponse.json(
        { success: false, error: 'Crie um estabelecimento antes de criar agendamentos.' },
        { status: HTTP_STATUS.BAD_REQUEST },
      )
    }

    const rawData = await request.json()

    // Reutiliza sanitização e validação do fluxo público
    const sanitizedData = sanitizePublicAppointmentData(rawData)
    const validation = validatePublicAppointmentServer(sanitizedData)

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

    const {
      name,
      phone,
      email,
      serviceId,
      professionalId,
      date,
      startTime,
      endTime,
      appointmentReminderOptIn,
      reengagementOptIn,
    } = sanitizedData

    // Busca ou cria cliente por (phone, establishmentId)
    const client = await prisma.client.upsert({
      where: {
        phone_establishmentId: {
          phone,
          establishmentId: establishment.id,
        },
      },
      update: {
        name,
        email: email || null,
        appointmentReminderOptIn,
        reengagementOptIn,
      },
      create: {
        name,
        email: email || null,
        phone,
        appointmentReminderOptIn,
        reengagementOptIn,
        establishmentId: establishment.id,
      },
    })

    const appointmentDate = new Date(date)

    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        startTime,
        endTime,
        status: 'scheduled',
        totalPrice: 0,
        clientId: client.id,
        serviceId,
        professionalId,
        establishmentId: establishment.id,
      },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        status: true,
      },
    })

    // Atualiza lastAppointmentAt do cliente
    await prisma.client.update({
      where: { id: client.id },
      data: {
        lastAppointmentAt: appointmentDate,
      },
    })

    // Reutiliza o mesmo fluxo de notificação configurado para o público
    await sendAppointmentConfirmation({ appointmentId: appointment.id })

    return NextResponse.json(
      {
        success: true,
        message: SUCCESS_MESSAGES.APPOINTMENT_CREATED,
        appointment,
      },
      { status: HTTP_STATUS.CREATED },
    )
  } catch (error) {
    console.error('[APPOINTMENTS_POST_ERROR]', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: false,
        error: ERROR_MESSAGES.SERVER_ERROR,
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    )
  }
}
