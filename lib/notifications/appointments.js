/**
 * Notificações relacionadas a agendamentos
 */

import { prisma } from '@/lib/prisma'
import { sendWhatsAppMessage } from '@/lib/notifications/whatsapp'
import { sendAppointmentConfirmationEmail } from '@/lib/notifications/email'

/**
 * Envia confirmação de agendamento (email + WhatsApp)
 * e atualiza o registro do agendamento com a data do envio.
 *
 * @param {Object} params
 * @param {string} params.appointmentId - ID do agendamento
 */
export async function sendAppointmentConfirmation({ appointmentId }) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      client: true,
      establishment: true,
      service: true,
      professional: true,
    },
  })

  if (!appointment) {
    console.warn('[APPOINTMENT_CONFIRMATION] Agendamento não encontrado', { appointmentId })
    return
  }

  const { client, establishment, service, professional, date, startTime } = appointment

  // Monta data/hora em string simples (pode ser refinado com date-fns depois)
  const dateTimeString = `${date.toISOString().split('T')[0]} às ${startTime}`

  // Usa template customizado se existir, senão usa uma mensagem padrão
  const messageTemplate =
    establishment.confirmationMessageTemplate ||
    `Seu agendamento em ${establishment.name} foi confirmado para ${dateTimeString} com ${professional.name} para o serviço ${service.name}.`

  // Email de confirmação (se cliente tiver email)
  if (client.email) {
    await sendAppointmentConfirmationEmail({
      to: client.email,
      establishmentName: establishment.name,
      appointmentDateTime: dateTimeString,
      bodyOverride: messageTemplate,
    })
  }

  // WhatsApp de confirmação (se cliente tiver telefone e opt-in para lembretes)
  if (client.phone && client.appointmentReminderOptIn) {
    await sendWhatsAppMessage({
      to: client.phone,
      body: messageTemplate,
    })
  }

  // Marca no banco que a confirmação foi enviada
  await prisma.appointment.update({
    where: { id: appointment.id },
    data: {
      confirmationSentAt: new Date(),
    },
  })
}
