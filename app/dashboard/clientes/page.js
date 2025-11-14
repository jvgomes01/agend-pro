/**
 * Página de Clientes
 * 
 * Listagem e gerenciamento de clientes do estabelecimento.
 * Esta primeira versão contém apenas um layout base e estado vazio,
 * preparado para receber o CRUD completo no futuro.
 */

'use client'

import Card, { CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Users, Plus } from 'lucide-react'

function ClientsContent() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">Clientes</h1>
          <p className="text-sm text-neutral-600">
            Cadastre novos clientes e acompanhe o histórico de atendimentos.
          </p>
        </header>

        <section className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Lista de clientes</CardTitle>
                  <CardDescription>
                    Em breve você poderá buscar, filtrar e visualizar os dados dos seus clientes aqui.
                  </CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Adicionar cliente</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-neutral-400" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-neutral-900">Nenhum cliente cadastrado</p>
                  <p className="text-sm text-neutral-600">
                    Clique em &quot;Adicionar cliente&quot; para cadastrar seu primeiro cliente.
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

export default function ClientsPage() {
  return (
    <ProtectedRoute>
      <ClientsContent />
    </ProtectedRoute>
  )
}
