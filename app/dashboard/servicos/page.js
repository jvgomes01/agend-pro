/**
 * Página de Serviços
 * 
 * Gerenciamento dos serviços oferecidos pelo estabelecimento.
 * Estrutura base com estado vazio e seções bem definidas para o CRUD futuro.
 */

'use client'

import Card, { CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Scissors, Plus } from 'lucide-react'

function ServicesContent() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">Serviços</h1>
          <p className="text-sm text-neutral-600">
            Cadastre e organize os serviços, preços e duração oferecidos.
          </p>
        </header>

        <section className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Lista de serviços</CardTitle>
                  <CardDescription>
                    Em versões futuras, esta seção exibirá todos os serviços com preço, duração e status.
                  </CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Novo serviço</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Scissors className="w-6 h-6 text-neutral-400" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-neutral-900">Nenhum serviço cadastrado</p>
                  <p className="text-sm text-neutral-600">
                    Cadastre seu primeiro serviço para começar a organizar sua agenda.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <ProtectedRoute>
      <ServicesContent />
    </ProtectedRoute>
  )
}
