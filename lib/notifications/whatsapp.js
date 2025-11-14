/**
 * Serviço de envio de mensagens via WhatsApp
 *
 * Este módulo encapsula a integração com a API de WhatsApp.
 * Mantém a lógica isolada para facilitar troca de provedor no futuro.
 */

import { WHATSAPP_CONFIG } from '@/lib/constants/app'

/**
 * Envia uma mensagem simples de texto via WhatsApp
 * @param {Object} params
 * @param {string} params.to - Telefone do destinatário (apenas números)
 * @param {string} params.body - Corpo da mensagem
 */
export async function sendWhatsAppMessage({ to, body }) {
  if (!WHATSAPP_CONFIG.ENABLED) {
    console.log('[WHATSAPP_DISABLED] Mensagem não enviada (serviço desativado)', { to })
    return
  }

  if (!to || !body) {
    console.warn('[WHATSAPP_WARNING] Telefone ou mensagem vazios, ignorando envio')
    return
  }

  try {
    // Implementação genérica. Substitua pela API real (Meta, Twilio, etc.)
    const response = await fetch(WHATSAPP_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WHATSAPP_CONFIG.API_TOKEN}`,
      },
      body: JSON.stringify({
        to,
        message: body,
      }),
    })

    if (!response.ok) {
      console.error('[WHATSAPP_ERROR] Falha ao enviar mensagem', {
        status: response.status,
        statusText: response.statusText,
      })
    }
  } catch (error) {
    console.error('[WHATSAPP_EXCEPTION]', {
      message: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}
