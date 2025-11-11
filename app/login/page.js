/**
 * Página de Login
 * 
 * Permite que usuários façam login no sistema.
 * A lógica está separada no hook useLogin (Clean Code).
 */

'use client'

import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Calendar } from 'lucide-react'
import { useLogin } from '@/hooks/useLogin'

export default function LoginPage() {
  // Hook customizado com toda a lógica
  const { formData, errors, loading, handleChange, handleSubmit } = useLogin()

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-neutral-900 rounded-md flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-neutral-900">AgendPro</span>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900">
            Entrar na sua conta
          </h2>
          <p className="text-sm text-neutral-600">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="text-neutral-900 underline underline-offset-4 hover:text-neutral-700">
              Criar conta
            </Link>
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white border border-neutral-200 rounded-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />

              <Input
                label="Senha"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {/* Link esqueceu senha */}
            <div className="flex items-center justify-end">
              <Link 
                href="/recuperar-senha" 
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Erro geral */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm">
                {errors.submit}
              </div>
            )}

            {/* Botão */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>

        {/* Link para home */}
        <div className="text-center">
          <Link 
            href="/" 
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}
