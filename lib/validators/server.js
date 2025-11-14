/**
 * Validadores para uso no servidor (API)
 * 
 * Estes validadores são específicos para o backend e não incluem
 * campos que são apenas para UX do cliente (como confirmPassword)
 */

import { 
  validateName, 
  validateEmail, 
  validatePassword, 
  validatePhone,
  validateRequiredPhone,
  validateOptionalEmail,
  validateRequired,
  validateMultiple 
} from './index.js'

/**
 * Valida dados de registro no servidor
 * NÃO valida confirmPassword (isso é apenas cliente)
 * 
 * @param {Object} data - { name, email, password, phone }
 * @returns {Object} { isValid, errors }
 */
export function validateUserRegistrationServer(data) {
  const { name, email, password, phone } = data

  return validateMultiple({
    name: () => validateName(name),
    email: () => validateEmail(email),
    password: () => validatePassword(password),
    phone: () => validatePhone(phone),
  })
}

/**
 * Valida dados de agendamento público (fluxo via link do estabelecimento)
 * @param {Object} data - { name, phone, email?, serviceId, professionalId, date, startTime, endTime, appointmentReminderOptIn, reengagementOptIn }
 * @returns {Object} { isValid, errors }
 */
export function validatePublicAppointmentServer(data) {
  const { 
    name,
    phone,
    email,
    serviceId,
    professionalId,
    date,
    startTime,
    endTime,
  } = data

  return validateMultiple({
    name: () => validateName(name),
    phone: () => validateRequiredPhone(phone),
    email: () => validateOptionalEmail(email),
    serviceId: () => validateRequired(serviceId, 'Serviço'),
    professionalId: () => validateRequired(professionalId, 'Profissional'),
    date: () => validateRequired(date, 'Data'),
    startTime: () => validateRequired(startTime, 'Horário inicial'),
    // endTime é opcional no formulário público; só valida se vier preenchido
    endTime: () => {
      if (!endTime) {
        return { isValid: true, error: null }
      }
      return validateRequired(endTime, 'Horário final')
    },
  })
}
