/**
 * API Route: Criação de agendamento público
 *
 * Fluxo usado quando o cliente acessa o link público do estabelecimento.
 * - Autenticação do cliente via telefone (busca ou cria Client)
 * - Criação do Appointment
 * - Disparo de confirmação (email + WhatsApp)
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitizePublicAppointmentData } from '@/lib/security/sanitize'
import { validatePublicAppointmentServer } from '@/lib/validators/server'
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants/app'
import { sendAppointmentConfirmation } from '@/lib/notifications/appointments'

export async function POST(request, { params }) {
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

    const rawData = await request.json()

    // 1. Sanitização dos dados
    const sanitizedData = sanitizePublicAppointmentData(rawData)

    // 2. Validação no servidor
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

    // 3. Buscar estabelecimento pelo slug
    const establishment = await prisma.establishment.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!establishment) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.NOT_FOUND },
        { status: HTTP_STATUS.NOT_FOUND },
      )
    }

    // 4. Buscar ou criar cliente por (phone, establishmentId)
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

    // 5. Criar agendamento
    const appointmentDate = new Date(date)

    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        startTime,
        endTime,
        status: 'scheduled',
        totalPrice: 0, // pode ser calculado com base no Service no futuro
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

    // 6. Enviar confirmação (email + WhatsApp)
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
    console.error('[PUBLIC_APPOINTMENT_ERROR]', {
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
