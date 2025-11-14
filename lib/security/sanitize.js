/**
 * Utilitários de Sanitização
 * 
 * Funções para limpar e sanitizar dados de entrada
 * IMPORTANTE: Sempre sanitize dados vindos do usuário antes de usar/armazenar
 */

/**
 * Remove espaços em branco do início e fim de uma string
 * @param {string} value - Valor a ser sanitizado
 * @returns {string} Valor limpo
 */
export function sanitizeString(value) {
  if (typeof value !== 'string') {
    return ''
  }
  return value.trim()
}

/**
 * Sanitiza email: lowercase e remove espaços
 * @param {string} email - Email a ser sanitizado
 * @returns {string} Email limpo
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') {
    return ''
  }
  return email.trim().toLowerCase()
}

/**
 * Remove caracteres não numéricos de telefone
 * @param {string} phone - Telefone a ser sanitizado
 * @returns {string} Apenas números
 */
export function sanitizePhone(phone) {
  if (typeof phone !== 'string') {
    return ''
  }
  return phone.replace(/\D/g, '')
}

/**
 * Remove tags HTML e scripts de uma string (previne XSS)
 * @param {string} value - Valor a ser sanitizado
 * @returns {string} Valor sem tags HTML
 */
export function sanitizeHTML(value) {
  if (typeof value !== 'string') {
    return ''
  }
  
  // Remove tags HTML
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

/**
 * Sanitiza objeto de dados do usuário para registro
 * @param {Object} data - Dados do usuário
 * @returns {Object} Dados sanitizados
 */
export function sanitizeUserRegistrationData(data) {
  return {
    name: sanitizeHTML(sanitizeString(data.name || '')),
    email: sanitizeEmail(data.email || ''),
    password: data.password || '', // Senha não deve ser modificada
    phone: sanitizePhone(data.phone || ''),
  }
}

/**
 * Sanitiza dados de agendamento público (fluxo via link do estabelecimento)
 * @param {Object} data - Dados enviados pelo cliente
 * @returns {Object} Dados sanitizados
 */
export function sanitizePublicAppointmentData(data) {
  return {
    name: sanitizeHTML(sanitizeString(data.name || '')),
    phone: sanitizePhone(data.phone || ''),
    email: sanitizeEmail(data.email || ''),
    serviceId: sanitizeString(data.serviceId || ''),
    professionalId: sanitizeString(data.professionalId || ''),
    date: sanitizeString(data.date || ''),
    startTime: sanitizeString(data.startTime || ''),
    endTime: sanitizeString(data.endTime || ''),
    appointmentReminderOptIn: Boolean(data.appointmentReminderOptIn),
    reengagementOptIn: Boolean(data.reengagementOptIn),
  }
}

/**
 * Escapa caracteres especiais para prevenir injeção SQL
 * Nota: Prisma já faz isso automaticamente, mas é bom ter como referência
 * @param {string} value - Valor a ser escapado
 * @returns {string} Valor escapado
 */
export function escapeSQL(value) {
  if (typeof value !== 'string') {
    return ''
  }
  
  return value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x00/g, '\\x00')
    .replace(/\x1a/g, '\\x1a')
}

/**
 * Remove propriedades perigosas de um objeto
 * @param {Object} obj - Objeto a ser limpo
 * @param {Array} dangerousProps - Lista de propriedades a remover
 * @returns {Object} Objeto limpo
 */
export function removeDangerousProperties(obj, dangerousProps = ['__proto__', 'constructor', 'prototype']) {
  const cleaned = { ...obj }
  
  dangerousProps.forEach(prop => {
    delete cleaned[prop]
  })
  
  return cleaned
}

/**
 * Limita tamanho de string (prevenção de DoS)
 * @param {string} value - String a ser limitada
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} String limitada
 */
export function limitStringLength(value, maxLength) {
  if (typeof value !== 'string') {
    return ''
  }
  
  return value.slice(0, maxLength)
}
