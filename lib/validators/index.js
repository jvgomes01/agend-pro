/**
 * Validadores da aplicação
 * 
 * Este arquivo contém funções de validação reutilizáveis.
 * Cada função retorna um objeto com { isValid: boolean, error: string }
 * 
 * Exemplo de uso:
 * const result = validateEmail(email)
 * if (!result.isValid) {
 *   console.error(result.error)
 * }
 */

import { VALIDATION_RULES, ERROR_MESSAGES, REGEX_PATTERNS } from '@/lib/constants/app'

/**
 * Valida se um valor está presente (não vazio)
 * @param {any} value - Valor a ser validado
 * @param {string} fieldName - Nome do campo (para mensagem de erro)
 * @returns {Object} { isValid, error }
 */
export function validateRequired(value, fieldName = 'Campo') {
  const isValid = value !== null && value !== undefined && value.toString().trim() !== ''
  
  return {
    isValid,
    error: isValid ? null : `${fieldName} ${ERROR_MESSAGES.REQUIRED_FIELD.toLowerCase()}`,
  }
}

/**
 * Valida formato de email
 * @param {string} email - Email a ser validado
 * @returns {Object} { isValid, error }
 */
export function validateEmail(email) {
  // Primeiro verifica se foi fornecido
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELD,
    }
  }

  // Remove espaços
  const trimmedEmail = email.trim()

  // Verifica tamanho máximo
  if (trimmedEmail.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Email muito longo (máximo ${VALIDATION_RULES.EMAIL.MAX_LENGTH} caracteres)`,
    }
  }

  // Valida formato
  const isValid = REGEX_PATTERNS.EMAIL.test(trimmedEmail)

  return {
    isValid,
    error: isValid ? null : ERROR_MESSAGES.INVALID_EMAIL,
  }
}

/**
 * Valida senha
 * @param {string} password - Senha a ser validada
 * @returns {Object} { isValid, error }
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELD,
    }
  }

  // Verifica tamanho mínimo
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.PASSWORD_TOO_SHORT,
    }
  }

  // Verifica tamanho máximo (segurança contra ataques DoS)
  if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Senha muito longa (máximo ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} caracteres)`,
    }
  }

  return {
    isValid: true,
    error: null,
  }
}

/**
 * Valida se duas senhas são iguais
 * @param {string} password - Senha
 * @param {string} confirmPassword - Confirmação da senha
 * @returns {Object} { isValid, error }
 */
export function validatePasswordMatch(password, confirmPassword) {
  const isValid = password === confirmPassword

  return {
    isValid,
    error: isValid ? null : ERROR_MESSAGES.PASSWORDS_DONT_MATCH,
  }
}

/**
 * Valida nome
 * @param {string} name - Nome a ser validado
 * @returns {Object} { isValid, error }
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return {
      isValid: false,
      error: ERROR_MESSAGES.REQUIRED_FIELD,
    }
  }

  const trimmedName = name.trim()

  // Verifica tamanho mínimo
  if (trimmedName.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.NAME_TOO_SHORT,
    }
  }

  // Verifica tamanho máximo
  if (trimmedName.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Nome muito longo (máximo ${VALIDATION_RULES.NAME.MAX_LENGTH} caracteres)`,
    }
  }

  return {
    isValid: true,
    error: null,
  }
}

/**
 * Valida telefone (opcional)
 * @param {string} phone - Telefone a ser validado
 * @returns {Object} { isValid, error }
 */
export function validatePhone(phone) {
  // Telefone é opcional, então vazio é válido
  if (!phone || phone.trim() === '') {
    return {
      isValid: true,
      error: null,
    }
  }

  if (typeof phone !== 'string') {
    return {
      isValid: false,
      error: 'Telefone inválido',
    }
  }

  // Remove caracteres especiais para validação
  const cleanPhone = phone.replace(/\D/g, '')

  // Verifica tamanho
  if (cleanPhone.length < VALIDATION_RULES.PHONE.MIN_LENGTH || 
      cleanPhone.length > VALIDATION_RULES.PHONE.MAX_LENGTH) {
    return {
      isValid: false,
      error: 'Telefone deve ter entre 10 e 15 dígitos',
    }
  }

  return {
    isValid: true,
    error: null,
  }
}

/**
 * Valida telefone obrigatório (usado no fluxo público de cliente)
 * @param {string} phone - Telefone a ser validado
 * @returns {Object} { isValid, error }
 */
export function validateRequiredPhone(phone) {
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      error: 'Telefone é obrigatório',
    }
  }

  return validatePhone(phone)
}

/**
 * Valida email opcional (quando o campo não é obrigatório)
 * @param {string} email - Email a ser validado
 * @returns {Object} { isValid, error }
 */
export function validateOptionalEmail(email) {
  if (!email || email.trim() === '') {
    return {
      isValid: true,
      error: null,
    }
  }

  return validateEmail(email)
}

/**
 * Valida múltiplos campos de uma vez
 * @param {Object} validations - Objeto com campo: função de validação
 * @returns {Object} { isValid, errors }
 * 
 * Exemplo:
 * const result = validateMultiple({
 *   email: () => validateEmail(email),
 *   password: () => validatePassword(password)
 * })
 */
export function validateMultiple(validations) {
  const errors = {}
  let isValid = true

  for (const [field, validationFn] of Object.entries(validations)) {
    const result = validationFn()
    if (!result.isValid) {
      errors[field] = result.error
      isValid = false
    }
  }

  return {
    isValid,
    errors,
  }
}

/**
 * Valida dados de registro de usuário
 * @param {Object} data - { name, email, password, confirmPassword, phone }
 * @returns {Object} { isValid, errors }
 */
export function validateUserRegistration(data) {
  const { name, email, password, confirmPassword, phone } = data

  return validateMultiple({
    name: () => validateName(name),
    email: () => validateEmail(email),
    password: () => validatePassword(password),
    confirmPassword: () => validatePasswordMatch(password, confirmPassword),
    phone: () => validatePhone(phone),
  })
}

/**
 * Valida credenciais de login
 * @param {Object} data - { email, password }
 * @returns {Object} { isValid, errors }
 */
export function validateLoginCredentials(data) {
  const { email, password } = data

  return validateMultiple({
    email: () => validateEmail(email),
    password: () => validateRequired(password, 'Senha'),
  })
}
