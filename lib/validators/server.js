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
