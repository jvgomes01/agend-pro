/**
 * Página do Dashboard
 * 
 * Dashboard principal do sistema, protegida por autenticação.
 * Exibe estatísticas e permite navegar entre seções.
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { 
  Calendar, 
  Users, 
  Scissors, 
  Clock, 
  Plus,
  LayoutDashboard,
  Settings,
  LogOut
} from 'lucide-react'

function DashboardContent() {
  const [selectedMenu, setSelectedMenu] = useState('overview')
  const { user, logout } = useAuth()
  
  // Função para fazer logout
  const handleLogout = async () => {
    if (confirm('Deseja realmente sair?')) {
      await logout()
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neutral-900 rounded-md flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-neutral-900">AgendPro</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-600">
                Olá, <span className="font-medium text-neutral-900">{user?.name}</span>
              </span>
              <Button variant="ghost" size="icon" title="Configurações">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 border-r border-neutral-200 bg-white min-h-[calc(100vh-57px)]">
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setSelectedMenu('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedMenu === 'overview' 
                  ? 'bg-neutral-100 text-neutral-900 font-medium' 
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Visão Geral</span>
            </button>
            
            <button
              onClick={() => setSelectedMenu('appointments')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedMenu === 'appointments' 
                  ? 'bg-neutral-100 text-neutral-900 font-medium' 
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Agendamentos</span>
            </button>

            <button
              onClick={() => setSelectedMenu('clients')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedMenu === 'clients' 
                  ? 'bg-neutral-100 text-neutral-900 font-medium' 
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes</span>
            </button>

            <button
              onClick={() => setSelectedMenu('services')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedMenu === 'services' 
                  ? 'bg-neutral-100 text-neutral-900 font-medium' 
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>Serviços</span>
            </button>

            <div className="border-t border-neutral-200 my-3" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {selectedMenu === 'overview' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-1">Dashboard</h1>
                <p className="text-neutral-600 text-sm">Visão geral do seu negócio</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-neutral-500">Hoje</p>
                      <Calendar className="w-4 h-4 text-neutral-400" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">0</p>
                    <p className="text-xs text-neutral-600">Agendamentos</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-neutral-500">Total</p>
                      <Users className="w-4 h-4 text-neutral-400" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">0</p>
                    <p className="text-xs text-neutral-600">Clientes</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-neutral-500">Ativos</p>
                      <Scissors className="w-4 h-4 text-neutral-400" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">0</p>
                    <p className="text-xs text-neutral-600">Serviços</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-neutral-500">Próximos 7 dias</p>
                      <Clock className="w-4 h-4 text-neutral-400" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">0</p>
                    <p className="text-xs text-neutral-600">Agendamentos</p>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Agendamento</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Cliente</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Serviço</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Getting Started */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Primeiros passos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">1</div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-neutral-900">Configure seu estabelecimento</p>
                        <p className="text-xs text-neutral-600">Adicione informações básicas sobre seu negócio</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">2</div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-neutral-900">Cadastre seus serviços</p>
                        <p className="text-xs text-neutral-600">Defina serviços, preços e duração</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">3</div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-neutral-900">Comece a agendar</p>
                        <p className="text-xs text-neutral-600">Adicione clientes e crie agendamentos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {selectedMenu === 'appointments' && (
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-neutral-900 mb-1">Agendamentos</h1>
                <p className="text-neutral-600 text-sm">Gerencie todos os agendamentos</p>
              </div>
              <Card>
                <CardContent className="py-16">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto">
                      <Calendar className="w-6 h-6 text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 mb-1">Nenhum agendamento</p>
                      <p className="text-sm text-neutral-600">Comece criando seu primeiro agendamento</p>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Criar agendamento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedMenu === 'clients' && (
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-neutral-900 mb-1">Clientes</h1>
                <p className="text-neutral-600 text-sm">Cadastro e histórico de clientes</p>
              </div>
              <Card>
                <CardContent className="py-16">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6 text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 mb-1">Nenhum cliente</p>
                      <p className="text-sm text-neutral-600">Adicione seu primeiro cliente</p>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Adicionar cliente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedMenu === 'services' && (
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-neutral-900 mb-1">Serviços</h1>
                <p className="text-neutral-600 text-sm">Gerencie seus serviços e preços</p>
              </div>
              <Card>
                <CardContent className="py-16">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto">
                      <Scissors className="w-6 h-6 text-neutral-400" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 mb-1">Nenhum serviço</p>
                      <p className="text-sm text-neutral-600">Cadastre os serviços que você oferece</p>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Criar serviço
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Exporta o dashboard protegido por autenticação
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
