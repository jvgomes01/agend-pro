/**
 * Constantes da aplicação
 * 
 * Este arquivo centraliza todos os valores constantes usados na aplicação.
 * Isso facilita manutenção e evita "magic numbers/strings" espalhados pelo código.
 */

// === CONFIGURAÇÕES DE VALIDAÇÃO ===
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
}

// === MENSAGENS DE ERRO ===
// Centralizando mensagens para facilitar tradução futura
export const ERROR_MESSAGES = {
  // Validação
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  PASSWORD_TOO_SHORT: `Senha deve ter no mínimo ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} caracteres`,
  PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
  NAME_TOO_SHORT: `Nome deve ter no mínimo ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres`,
  
  // Autenticação
  EMAIL_ALREADY_EXISTS: 'Este email já está cadastrado',
  INVALID_CREDENTIALS: 'Email ou senha incorretos',
  UNAUTHORIZED: 'Não autorizado',
  
  // Server
  SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
  CONNECTION_ERROR: 'Erro ao conectar com o servidor',
  
  // Recursos
  NOT_FOUND: 'Recurso não encontrado',
}

// === MENSAGENS DE SUCESSO ===
export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: 'Cadastro realizado com sucesso!',
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  UPDATE_SUCCESS: 'Atualização realizada com sucesso!',
  DELETE_SUCCESS: 'Exclusão realizada com sucesso!',
}

// === STATUS HTTP ===
// Usando constantes nomeadas ao invés de números mágicos
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
}

// === ROTAS DA APLICAÇÃO ===
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/cadastro',
  DASHBOARD: '/dashboard',
  APPOINTMENTS: '/dashboard/agendamentos',
  CLIENTS: '/dashboard/clientes',
  SERVICES: '/dashboard/servicos',
}

// === ROTAS DA API ===
export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
  },
  ESTABLISHMENTS: '/api/establishments',
  SERVICES: '/api/services',
  CLIENTS: '/api/clients',
  APPOINTMENTS: '/api/appointments',
}

// === REGEX PATTERNS ===
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/,
  // Senha deve conter pelo menos uma letra e um número
  STRONG_PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
}

// === CONFIGURAÇÕES DE SEGURANÇA ===
export const SECURITY_CONFIG = {
  // Número de rounds para bcrypt (10-12 é recomendado)
  BCRYPT_ROUNDS: 10,
  
  // Tempo de expiração de tokens (em segundos)
  TOKEN_EXPIRY: 60 * 60 * 24 * 7, // 7 dias
  
  // Limite de tentativas de login
  MAX_LOGIN_ATTEMPTS: 5,
  
  // Tempo de bloqueio após múltiplas tentativas (em minutos)
  LOCKOUT_TIME: 15,
}

// === TIPOS DE ESTABELECIMENTO ===
export const ESTABLISHMENT_TYPES = {
  BARBERSHOP: 'barbershop',
  SALON: 'salon',
  MANICURE: 'manicure',
  SPA: 'spa',
  OTHER: 'other',
}

// === STATUS DE AGENDAMENTO ===
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
}

// === CONFIGURAÇÕES DE PAGINAÇÃO ===
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
}
