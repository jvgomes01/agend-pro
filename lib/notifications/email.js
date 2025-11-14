/**
 * Serviço de envio de emails
 *
 * Este módulo encapsula o envio de emails (confirmação, lembretes, etc.).
 */

import { EMAIL_CONFIG } from '@/lib/constants/app'

/**
 * Envia um email simples
 * @param {Object} params
 * @param {string} params.to - Destinatário
 * @param {string} params.subject - Assunto
 * @param {string} params.body - Corpo do email (texto simples ou HTML)
 */
export async function sendEmail({ to, subject, body }) {
  if (!EMAIL_CONFIG.ENABLED) {
    console.log('[EMAIL_DISABLED] Email não enviado (serviço desativado)', { to, subject })
    return
  }

  if (!to || !subject || !body) {
    console.warn('[EMAIL_WARNING] Parâmetros insuficientes para envio de email')
    return
  }

  try {
    // Implementação genérica. Substitua pela API real (Resend, SES, etc.)
    // Mantemos apenas log para não quebrar o fluxo enquanto não há provider real.
    console.log('[EMAIL_SEND] Enviando email', { to, subject })
  } catch (error) {
    console.error('[EMAIL_EXCEPTION]', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Atalho específico para email de confirmação de agendamento
 */
export async function sendAppointmentConfirmationEmail({ to, establishmentName, appointmentDateTime, bodyOverride }) {
  if (!to) return

  const subject = `Confirmação de agendamento - ${establishmentName}`

  const body = bodyOverride || `Seu agendamento em ${establishmentName} foi confirmado para ${appointmentDateTime}.`

  await sendEmail({ to, subject, body })
}
