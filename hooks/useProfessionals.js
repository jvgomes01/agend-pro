/**
 * Custom Hook: useProfessionals
 *
 * Gerencia o estado de profissionais no dashboard:
 * - Lista profissionais do(s) estabelecimento(s) do usuário logado
 * - Permite criar novos profissionais
 * - Permite atualizar dados básicos
 */

'use client'

import { useCallback, useEffect, useState } from 'react'
import { API_ROUTES } from '@/lib/constants/app'

export function useProfessionals() {
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadProfessionals = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ROUTES.PROFESSIONALS, {
        method: 'GET',
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao carregar profissionais')
      }

      setProfessionals(result.professionals || [])
    } catch (err) {
      console.error('[USE_PROFESSIONALS_LOAD_ERROR]', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfessionals()
  }, [loadProfessionals])

  const createProfessional = useCallback(async (data) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch(API_ROUTES.PROFESSIONALS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao criar profissional')
      }

      await loadProfessionals()

      return { success: true, professional: result.professional }
    } catch (err) {
      console.error('[USE_PROFESSIONALS_CREATE_ERROR]', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setSaving(false)
    }
  }, [loadProfessionals])

  const updateProfessional = useCallback(async (id, data) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch(`${API_ROUTES.PROFESSIONALS}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao atualizar profissional')
      }

      await loadProfessionals()

      return { success: true, professional: result.professional }
    } catch (err) {
      console.error('[USE_PROFESSIONALS_UPDATE_ERROR]', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setSaving(false)
    }
  }, [loadProfessionals])

  return {
    professionals,
    loading,
    error,
    saving,
    loadProfessionals,
    createProfessional,
    updateProfessional,
  }
}
