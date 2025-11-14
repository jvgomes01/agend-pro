/**
 * Custom Hook: useAppointments
 *
 * Fornece uma interface simples para o dashboard trabalhar com agendamentos:
 * - Lista agendamentos do(s) estabelecimento(s) do usuário logado
 * - Permite criar agendamentos manuais (MVP)
 *
 * Como usar:
 * const {
 *   appointments,
 *   loading,
 *   error,
 *   creating,
 *   loadAppointments,
 *   createAppointment,
 * } = useAppointments()
 */

'use client'

import { useCallback, useEffect, useState } from 'react'
import { API_ROUTES } from '@/lib/constants/app'

export function useAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [creating, setCreating] = useState(false)

  /**
   * Carrega a lista de agendamentos do servidor.
   */
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ROUTES.APPOINTMENTS, {
        method: 'GET',
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao carregar agendamentos')
      }

      setAppointments(result.appointments || [])
    } catch (err) {
      console.error('[USE_APPOINTMENTS_LOAD_ERROR]', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  /**
   * Cria um agendamento manual.
   *
   * Espera os mesmos campos básicos da API pública:
   * { name, phone, email, serviceId, professionalId, date, startTime, endTime,
   *   appointmentReminderOptIn, reengagementOptIn }
   */
  const createAppointment = useCallback(async (data) => {
    try {
      setCreating(true)
      setError(null)

      const response = await fetch(API_ROUTES.APPOINTMENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao criar agendamento')
      }

      // Recarrega lista após criar
      await loadAppointments()

      return { success: true, appointment: result.appointment }
    } catch (err) {
      console.error('[USE_APPOINTMENTS_CREATE_ERROR]', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setCreating(false)
    }
  }, [loadAppointments])

  return {
    appointments,
    loading,
    error,
    creating,
    loadAppointments,
    createAppointment,
  }
}
