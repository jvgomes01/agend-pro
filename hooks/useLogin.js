/**
 * Custom Hook: useLogin
 * 
 * Hook para gerenciar o formulário de login.
 * Separa lógica de apresentação (Clean Code).
 * 
 * Como usar:
 * const { formData, errors, loading, handleChange, handleSubmit } = useLogin()
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'
import { validateLoginCredentials } from '@/lib/validators'
import { ROUTES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants/app'

export function useLogin() {
  const router = useRouter()
  const { login } = useAuth()
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  // Estado dos erros
  const [errors, setErrors] = useState({})
  
  // Estado de loading
  const [loading, setLoading] = useState(false)

  /**
   * Manipula mudança nos campos
   * @param {Event} e - Evento de mudança
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpa erro do campo quando usuário digita
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  /**
   * Valida o formulário
   * @returns {boolean} true se válido
   */
  const validateForm = () => {
    const validation = validateLoginCredentials(formData)
    
    if (!validation.isValid) {
      setErrors(validation.errors)
      return false
    }
    
    return true
  }

  /**
   * Manipula submit do formulário
   * @param {Event} e - Evento de submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 1. VALIDAR
    if (!validateForm()) {
      return
    }

    // 2. INICIAR loading
    setLoading(true)
    
    try {
      // 3. FAZER login
      const result = await login(formData)

      if (!result.success) {
        // Mostrar erro
        setErrors({
          submit: result.error || ERROR_MESSAGES.INVALID_CREDENTIALS
        })
        return
      }

      // 4. SUCESSO - Redirecionar para dashboard
      // Pequeno delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push(ROUTES.DASHBOARD)
      
    } catch (error) {
      console.error('[LOGIN_SUBMIT_ERROR]', error)
      setErrors({
        submit: ERROR_MESSAGES.CONNECTION_ERROR
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
  }
}
