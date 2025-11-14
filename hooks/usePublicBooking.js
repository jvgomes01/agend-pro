/**
 * Custom Hook: usePublicBooking
 *
 * Gerencia o fluxo de agendamento público (página /b/[slug]).
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { validateName, validateOptionalEmail } from '@/lib/validators'
import { validateRequiredPhone } from '@/lib/validators'

export function usePublicBooking(slug) {
  const [establishment, setEstablishment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const [formData, setFormData] = useState({
    serviceId: '',
    professionalId: '',
    date: '',
    startTime: '',
    endTime: '',
    name: '',
    phone: '',
    email: '',
    appointmentReminderOptIn: true,
    reengagementOptIn: false,
  })

  const loadEstablishment = useCallback(async () => {
    if (!slug) return

    try {
      setLoading(true)
      setErrors({})

      const response = await fetch(`/api/public/establishments/${slug}`)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Estabelecimento não encontrado')
      }

      setEstablishment(result.establishment)
    } catch (err) {
      console.error('[PUBLIC_BOOKING_LOAD_ERROR]', err)
      setErrors((prev) => ({
        ...prev,
        root: err.message,
      }))
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    loadEstablishment()
  }, [loadEstablishment])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    const nameValidation = validateName(formData.name)
    if (!nameValidation.isValid) newErrors.name = nameValidation.error

    const phoneValidation = validateRequiredPhone(formData.phone)
    if (!phoneValidation.isValid) newErrors.phone = phoneValidation.error

    const emailValidation = validateOptionalEmail(formData.email)
    if (!emailValidation.isValid) newErrors.email = emailValidation.error

    if (!formData.serviceId) newErrors.serviceId = 'Selecione um serviço'
    if (!formData.professionalId) newErrors.professionalId = 'Selecione um profissional'
    if (!formData.date) newErrors.date = 'Informe a data'
    if (!formData.startTime) newErrors.startTime = 'Informe o horário'

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setSubmitting(true)
      setSuccessMessage('')

      const response = await fetch(`/api/public/establishments/${slug}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao criar agendamento')
      }

      setSuccessMessage('Agendamento criado com sucesso! Você receberá uma confirmação em breve.')
      // Opcional: limpar horários, mas manter dados do cliente para facilitar novo agendamento
      setFormData((prev) => ({
        ...prev,
        date: '',
        startTime: '',
        endTime: '',
      }))
    } catch (err) {
      console.error('[PUBLIC_BOOKING_SUBMIT_ERROR]', err)
      setErrors((prev) => ({
        ...prev,
        root: err.message,
      }))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    establishment,
    loading,
    submitting,
    errors,
    successMessage,
    formData,
    handleChange,
    handleSubmit,
  }
}
