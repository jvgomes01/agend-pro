/**
 * Página de Cadastro
 * 
 * Permite que novos usuários se registrem no sistema.
 * A lógica de negócio está separada no hook useRegistration.
 */

'use client'

import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Calendar } from 'lucide-react'
import { useRegistration } from '@/hooks/useRegistration'

export default function CadastroPage() {
  // Hook customizado que contém toda a lógica do formulário
  const { formData, errors, loading, handleChange, handleSubmit } = useRegistration()

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-neutral-900 rounded-md flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-neutral-900">AgendPro</span>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Criar conta
          </h2>
          <p className="text-sm text-neutral-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-neutral-900 underline underline-offset-4 hover:text-neutral-700">
              Fazer login
            </Link>
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
            <Input
              label="Nome completo"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Telefone (opcional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
            />

            <Input
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Input
              label="Confirmar senha"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
          </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
