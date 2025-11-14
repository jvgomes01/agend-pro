/**
 * Custom Hook: useEstablishment
 *
 * Gerencia o estabelecimento principal do usuário (dono).
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { API_ROUTES } from '@/lib/constants/app'

export function useEstablishment() {
  const [establishment, setEstablishment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadEstablishment = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_ROUTES.ESTABLISHMENTS, {
        method: 'GET',
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao carregar estabelecimento')
      }

      // Por ora consideramos apenas o primeiro estabelecimento do usuário
      setEstablishment(result.establishments?.[0] || null)
    } catch (err) {
      console.error('[USE_ESTABLISHMENT_LOAD_ERROR]', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEstablishment()
  }, [loadEstablishment])

  const createEstablishment = useCallback(async (data) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch(API_ROUTES.ESTABLISHMENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao criar estabelecimento')
      }

      setEstablishment(result.establishment)
      return { success: true, establishment: result.establishment }
    } catch (err) {
      console.error('[USE_ESTABLISHMENT_CREATE_ERROR]', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setSaving(false)
    }
  }, [])

  const updateEstablishment = useCallback(async (id, data) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch(`${API_ROUTES.ESTABLISHMENTS}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao atualizar estabelecimento')
      }

      setEstablishment(result.establishment)
      return { success: true, establishment: result.establishment }
    } catch (err) {
      console.error('[USE_ESTABLISHMENT_UPDATE_ERROR]', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setSaving(false)
    }
  }, [])

  const getPublicBookingLink = () => {
    if (!establishment?.slug) return null

    if (typeof window === 'undefined') {
      return `/b/${establishment.slug}`
    }

    return `${window.location.origin}/b/${establishment.slug}`
  }

  return {
    establishment,
    loading,
    error,
    saving,
    createEstablishment,
    updateEstablishment,
    reload: loadEstablishment,
    getPublicBookingLink,
  }
}
