/**
 * Custom Hook: useServices
 *
 * Gerencia o estado de serviços no dashboard:
 * - Lista serviços do(s) estabelecimento(s) do usuário logado
 * - Permite criar novos serviços
 * - Permite atualizar campos (ex: ativar/desativar)
 */

'use client'

import { useCallback, useEffect, useState } from 'react'
import { API_ROUTES } from '@/lib/constants/app'

export function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadServices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ROUTES.SERVICES, {
        method: 'GET',
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao carregar serviços')
      }

      setServices(result.services || [])
    } catch (err) {
      console.error('[USE_SERVICES_LOAD_ERROR]', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  const createService = useCallback(async (data) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch(API_ROUTES.SERVICES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao criar serviço')
      }

      await loadServices()

      return { success: true, service: result.service }
    } catch (err) {
      console.error('[USE_SERVICES_CREATE_ERROR]', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setSaving(false)
    }
  }, [loadServices])

  const updateService = useCallback(async (id, data) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch(`${API_ROUTES.SERVICES}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao atualizar serviço')
      }

      await loadServices()

      return { success: true, service: result.service }
    } catch (err) {
      console.error('[USE_SERVICES_UPDATE_ERROR]', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setSaving(false)
    }
  }, [loadServices])

  return {
    services,
    loading,
    error,
    saving,
    loadServices,
    createService,
    updateService,
  }
}
