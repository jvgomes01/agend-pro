/**
 * Custom Hook: useRegistration
 * 
 * Hook para gerenciar o estado e lógica do formulário de registro.
 * Separa a lógica de negócio da apresentação (Clean Code).
 * 
 * Como usar:
 * const { formData, errors, loading, handleChange, handleSubmit } = useRegistration()
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateUserRegistration } from '@/lib/validators'
import { API_ROUTES, ROUTES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants/app'

export function useRegistration() {
  const router = useRouter()
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })
  
  // Estado dos erros de validação
  const [errors, setErrors] = useState({})
  
  // Estado de loading durante o submit
  const [loading, setLoading] = useState(false)

  /**
   * Manipula mudança nos campos do formulário
   * @param {Event} e - Evento de mudança
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Atualiza o valor do campo
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpa o erro do campo quando o usuário começa a digitar
    // Melhora a UX evitando erros "grudados"
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  /**
   * Valida os dados do formulário
   * @returns {boolean} true se válido, false se inválido
   */
  const validateForm = () => {
    const validation = validateUserRegistration(formData)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      return false
    }
    
    return true
  }

  /**
   * Envia os dados para a API
   * @param {Object} data - Dados do usuário
   * @returns {Promise<Object>} Resposta da API
   */
  const submitToAPI = async (data) => {
    try {
      const response = await fetch(API_ROUTES.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      // Tenta fazer parse do JSON
      let result
      try {
        result = await response.json()
      } catch (jsonError) {
        console.error('[JSON_PARSE_ERROR]', jsonError)
        throw new Error('Erro ao processar resposta do servidor')
      }

      // Se a resposta não for ok, lança erro com a mensagem
      if (!response.ok) {
        throw new Error(result.error || result.details || ERROR_MESSAGES.SERVER_ERROR)
      }

      return result
    } catch (error) {
      // Se for erro de rede
      if (error.message === 'Failed to fetch' || !navigator.onLine) {
        throw new Error(ERROR_MESSAGES.CONNECTION_ERROR)
      }
      // Propaga o erro original
      throw error
    }
  }

  /**
   * Manipula o submit do formulário
   * @param {Event} e - Evento de submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 1. VALIDAR dados localmente
    if (!validateForm()) {
      console.log('[VALIDATION_FAILED]', 'Formulário inválido')
      return
    }

    // 2. INICIAR loading
    setLoading(true)
    
    try {
      // 3. ENVIAR para API
      const { name, email, password, phone } = formData
      
      console.log('[SUBMIT_START]', 'Enviando dados para API...')
      
      const result = await submitToAPI({
        name,
        email,
        password,
        phone,
      })
      
      console.log('[SUBMIT_SUCCESS]', 'Usuário criado com sucesso')

      // 4. MOSTRAR mensagem de sucesso
      // TODO: Substituir alert por um toast/notification component
      alert(SUCCESS_MESSAGES.REGISTER_SUCCESS)
      
      // 5. REDIRECIONAR para login
      router.push(ROUTES.LOGIN)
      
    } catch (error) {
      // 6. TRATAR erros
      console.error('[REGISTRATION_ERROR]', error)
      
      // Mostra erro específico ou genérico
      setErrors({
        submit: error.message || ERROR_MESSAGES.CONNECTION_ERROR
      })
      
    } finally {
      // 7. FINALIZAR loading
      setLoading(false)
    }
  }

  // Retorna estado e funções para o componente
  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
  }
}
