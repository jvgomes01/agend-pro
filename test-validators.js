// Teste simples dos validadores
import { validateUserRegistration } from './lib/validators/index.js'

const testData = {
  name: 'João Silva',
  email: 'joao@teste.com',
  password: '123456',
  confirmPassword: '123456',
  phone: '11999999999'
}

console.log('Testando validadores...')
const result = validateUserRegistration(testData)
console.log('Resultado:', result)

if (result.isValid) {
  console.log('✅ Validação passou!')
} else {
  console.log('❌ Validação falhou:', result.errors)
}
