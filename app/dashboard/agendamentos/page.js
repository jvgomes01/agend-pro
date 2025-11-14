/**
 * Página de Agendamentos
 * 
 * Esta página faz parte do dashboard e será responsável por listar e gerenciar
 * agendamentos. Neste primeiro momento exibe apenas um estado vazio bem
 * documentado, servindo de base para o CRUD futuro.
 */

'use client'

import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Calendar, Plus, Clock } from 'lucide-react'

function AppointmentsContent() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">Agendamentos</h1>
          <p className="text-sm text-neutral-600">
            Visualize e gerencie todos os agendamentos do seu estabelecimento.
          </p>
        </header>

        <section className="space-y-6">
          {/* Estado vazio inicial */}
          <Card>
            <CardContent className="py-16">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-neutral-400" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-neutral-900">Nenhum agendamento ainda</p>
                  <p className="text-sm text-neutral-600">
                    Quando você começar a criar agendamentos, eles aparecerão aqui.
                  </p>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Novo agendamento</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resumo da agenda (placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-500" />
                Próximos horários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600">
                Em versões futuras, esta seção exibirá um resumo dos próximos horários do dia.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

export default function AppointmentsPage() {
  return (
    <ProtectedRoute>
      <AppointmentsContent />
    </ProtectedRoute>
  )
}
