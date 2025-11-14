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
import Input from '@/components/ui/Input'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useEstablishment } from '@/hooks/useEstablishment'
import { useAppointments } from '@/hooks/useAppointments'
import { useServices } from '@/hooks/useServices'
import { useProfessionals } from '@/hooks/useProfessionals'
import { 
  Calendar, 
  Users, 
  Scissors, 
  Clock, 
  Plus,
  LayoutDashboard,
  Settings,
  LogOut,
  Link as LinkIcon
} from 'lucide-react'

function DashboardContent() {
  const [selectedMenu, setSelectedMenu] = useState('overview')
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    durationMinutes: '',
    price: '',
  })
  const [serviceFormError, setServiceFormError] = useState(null)
  const [professionalForm, setProfessionalForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
  })
  const [professionalFormError, setProfessionalFormError] = useState(null)

  const { user, logout } = useAuth()
  const {
    establishment,
    loading: loadingEstablishment,
    saving: savingEstablishment,
    createEstablishment,
    getPublicBookingLink,
  } = useEstablishment()
  const {
    appointments,
    loading: loadingAppointments,
    error: appointmentsError,
  } = useAppointments()
  const {
    services,
    loading: loadingServices,
    error: servicesError,
    saving: savingService,
    createService,
    updateService,
  } = useServices()
  const {
    professionals,
    loading: loadingProfessionals,
    error: professionalsError,
    saving: savingProfessional,
    createProfessional,
    updateProfessional,
  } = useProfessionals()
  
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

            <button
              onClick={() => setSelectedMenu('professionals')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedMenu === 'professionals' 
                  ? 'bg-neutral-100 text-neutral-900 font-medium' 
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Profissionais</span>
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

              {/* Link público de agendamento */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Link de agendamento</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingEstablishment ? (
                    <p className="text-sm text-neutral-600">Carregando informações do estabelecimento...</p>
                  ) : establishment ? (
                    <div className="space-y-3">
                      <p className="text-sm text-neutral-600">
                        Compartilhe este link com seus clientes para que eles possam agendar online.
                      </p>
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex-1 px-3 py-2 border border-neutral-200 rounded-md bg-neutral-50 text-xs md:text-sm text-neutral-800 break-all">
                          {getPublicBookingLink()}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            const link = getPublicBookingLink()
                            if (link && navigator?.clipboard) {
                              navigator.clipboard.writeText(link)
                            }
                          }}
                        >
                          <LinkIcon className="w-4 h-4" />
                          Copiar link
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-neutral-600">
                        Configure seu primeiro estabelecimento para gerar um link de agendamento.
                      </p>
                      <form
                        className="grid grid-cols-1 md:grid-cols-3 gap-3"
                        onSubmit={async (e) => {
                          e.preventDefault()
                          const formData = new FormData(e.currentTarget)
                          const name = formData.get('name')?.toString() || ''
                          const address = formData.get('address')?.toString() || ''
                          const phone = formData.get('phone')?.toString() || ''

                          if (!name || !address || !phone) {
                            alert('Preencha nome, endereço e telefone do estabelecimento.')
                            return
                          }

                          const result = await createEstablishment({
                            name,
                            address,
                            phone,
                          })

                          if (!result.success) {
                            alert(result.error || 'Erro ao criar estabelecimento')
                          }
                        }}
                      >
                        <input
                          name="name"
                          placeholder="Nome do estabelecimento"
                          className="px-3 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                        />
                        <input
                          name="address"
                          placeholder="Endereço"
                          className="px-3 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                        />
                        <div className="flex gap-2">
                          <input
                            name="phone"
                            placeholder="Telefone"
                            className="flex-1 px-3 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                          />
                          <Button
                            type="submit"
                            size="sm"
                            className="whitespace-nowrap"
                            disabled={savingEstablishment}
                          >
                            {savingEstablishment ? 'Salvando...' : 'Salvar'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ações rápidas */}
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
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-1">Agendamentos</h1>
                  <p className="text-neutral-600 text-sm">Gerencie todos os agendamentos (públicos e manuais)</p>
                </div>
                <Button size="sm" className="gap-2" type="button" onClick={() => {
                  alert('Em breve: criação de agendamentos manuais diretamente pelo dashboard.')
                }}>
                  <Plus className="w-4 h-4" />
                  Criar agendamento
                </Button>
              </div>

              <Card>
                <CardContent>
                  {loadingAppointments && (
                    <div className="py-10 text-center text-sm text-neutral-600">
                      Carregando agendamentos...
                    </div>
                  )}

                  {!loadingAppointments && appointmentsError && (
                    <div className="py-4 text-sm text-red-600">
                      {appointmentsError}
                    </div>
                  )}

                  {!loadingAppointments && !appointmentsError && appointments.length === 0 && (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto">
                        <Calendar className="w-6 h-6 text-neutral-400" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 mb-1">Nenhum agendamento encontrado</p>
                        <p className="text-sm text-neutral-600">Quando clientes e atendentes criarem agendamentos, eles aparecerão aqui.</p>
                      </div>
                    </div>
                  )}

                  {!loadingAppointments && !appointmentsError && appointments.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                            <th className="py-2 pr-4">Data</th>
                            <th className="py-2 pr-4">Horário</th>
                            <th className="py-2 pr-4">Cliente</th>
                            <th className="py-2 pr-4">Serviço</th>
                            <th className="py-2 pr-4">Profissional</th>
                            <th className="py-2 pr-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((appt) => {
                            const dateObj = new Date(appt.date)
                            const dateLabel = dateObj.toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                            const timeLabel = `${appt.startTime} - ${appt.endTime}`
                            const statusLabel = {
                              scheduled: 'Agendado',
                              confirmed: 'Confirmado',
                              in_progress: 'Em andamento',
                              completed: 'Concluído',
                              cancelled: 'Cancelado',
                              no_show: 'Não compareceu',
                            }[appt.status] || appt.status

                            return (
                              <tr key={appt.id} className="border-b border-neutral-100 last:border-0">
                                <td className="py-2 pr-4 text-neutral-900 text-xs md:text-sm">{dateLabel}</td>
                                <td className="py-2 pr-4 text-neutral-700 text-xs md:text-sm">{timeLabel}</td>
                                <td className="py-2 pr-4 text-neutral-900 text-xs md:text-sm">
                                  {appt.client?.name || '—'}
                                  {appt.client?.phone && (
                                    <span className="block text-[11px] text-neutral-500">{appt.client.phone}</span>
                                  )}
                                </td>
                                <td className="py-2 pr-4 text-neutral-700 text-xs md:text-sm">{appt.service?.name || '—'}</td>
                                <td className="py-2 pr-4 text-neutral-700 text-xs md:text-sm">{appt.professional?.name || '—'}</td>
                                <td className="py-2 pr-4 text-xs md:text-sm">
                                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                                    {statusLabel}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
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
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-1">Serviços</h1>
                  <p className="text-neutral-600 text-sm">Gerencie os serviços oferecidos, sua duração e preço.</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-[2fr,1.2fr] gap-6">
                {/* Lista de serviços */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Serviços cadastrados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingServices && (
                      <div className="py-8 text-center text-sm text-neutral-600">
                        Carregando serviços...
                      </div>
                    )}

                    {!loadingServices && servicesError && (
                      <div className="py-4 text-sm text-red-600">
                        {servicesError}
                      </div>
                    )}

                    {!loadingServices && !servicesError && services.length === 0 && (
                      <div className="py-10 text-center space-y-3">
                        <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto">
                          <Scissors className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 mb-1">Nenhum serviço cadastrado</p>
                          <p className="text-sm text-neutral-600">Cadastre seu primeiro serviço ao lado.</p>
                        </div>
                      </div>
                    )}

                    {!loadingServices && !servicesError && services.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                              <th className="py-2 pr-4">Serviço</th>
                              <th className="py-2 pr-4">Duração</th>
                              <th className="py-2 pr-4">Preço</th>
                              <th className="py-2 pr-4">Status</th>
                              <th className="py-2 pr-4 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {services.map((service) => {
                              const priceLabel = new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(service.price || 0)

                              return (
                                <tr key={service.id} className="border-b border-neutral-100 last:border-0">
                                  <td className="py-2 pr-4 text-neutral-900 text-xs md:text-sm">
                                    <div className="font-medium">{service.name}</div>
                                    {service.description && (
                                      <div className="text-[11px] text-neutral-500 line-clamp-2">{service.description}</div>
                                    )}
                                  </td>
                                  <td className="py-2 pr-4 text-neutral-700 text-xs md:text-sm">
                                    {service.duration} min
                                  </td>
                                  <td className="py-2 pr-4 text-neutral-700 text-xs md:text-sm">
                                    {priceLabel}
                                  </td>
                                  <td className="py-2 pr-4 text-xs md:text-sm">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                      service.active
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-neutral-100 text-neutral-600'
                                    }`}>
                                      {service.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                  </td>
                                  <td className="py-2 pr-0 text-right">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2 text-xs"
                                      disabled={savingService}
                                      onClick={async () => {
                                        await updateService(service.id, { active: !service.active })
                                      }}
                                    >
                                      {service.active ? 'Desativar' : 'Ativar'}
                                    </Button>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Formulário de criação de serviço */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Novo serviço</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      className="space-y-4"
                      onSubmit={async (e) => {
                        e.preventDefault()
                        setServiceFormError(null)

                        const { name, durationMinutes, price } = serviceForm
                        if (!name || !durationMinutes || !price) {
                          setServiceFormError('Preencha nome, duração e preço do serviço.')
                          return
                        }

                        const result = await createService({
                          name: serviceForm.name,
                          description: serviceForm.description,
                          durationMinutes: serviceForm.durationMinutes,
                          price: serviceForm.price,
                        })

                        if (!result.success) {
                          setServiceFormError(result.error || 'Erro ao criar serviço')
                          return
                        }

                        setServiceForm({ name: '', description: '', durationMinutes: '', price: '' })
                      }}
                    >
                      <Input
                        label="Nome do serviço"
                        name="name"
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Corte de cabelo, Barba + cabelo..."
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          label="Duração (minutos)"
                          name="durationMinutes"
                          type="number"
                          min="1"
                          value={serviceForm.durationMinutes}
                          onChange={(e) => setServiceForm((prev) => ({ ...prev, durationMinutes: e.target.value }))}
                          placeholder="30"
                          required
                        />
                        <Input
                          label="Preço (R$)"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={serviceForm.price}
                          onChange={(e) => setServiceForm((prev) => ({ ...prev, price: e.target.value }))}
                          placeholder="50,00"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-1">
                          Descrição (opcional)
                        </label>
                        <textarea
                          className="w-full min-h-[80px] rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
                          value={serviceForm.description}
                          onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Explique rapidamente o que está incluído no serviço."
                        />
                      </div>

                      {serviceFormError && (
                        <div className="text-sm text-red-600">
                          {serviceFormError}
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={savingService}
                      >
                        {savingService ? 'Salvando serviço...' : 'Salvar serviço'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedMenu === 'professionals' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-1">Profissionais</h1>
                  <p className="text-neutral-600 text-sm">
                    Cadastre e gerencie os profissionais do seu estabelecimento.
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-[2fr,1.2fr] gap-6">
                {/* Lista de profissionais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profissionais cadastrados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingProfessionals && (
                      <div className="py-8 text-center text-sm text-neutral-600">
                        Carregando profissionais...
                      </div>
                    )}

                    {!loadingProfessionals && professionalsError && (
                      <div className="py-4 text-sm text-red-600">
                        {professionalsError}
                      </div>
                    )}

                    {!loadingProfessionals && !professionalsError && professionals.length === 0 && (
                      <div className="py-10 text-center space-y-3">
                        <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto">
                          <Users className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 mb-1">Nenhum profissional cadastrado</p>
                          <p className="text-sm text-neutral-600">Cadastre seu primeiro profissional ao lado.</p>
                        </div>
                      </div>
                    )}

                    {!loadingProfessionals && !professionalsError && professionals.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                              <th className="py-2 pr-4">Nome</th>
                              <th className="py-2 pr-4">Contato</th>
                              <th className="py-2 pr-4">Especialidade</th>
                              <th className="py-2 pr-4 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {professionals.map((pro) => (
                              <tr key={pro.id} className="border-b border-neutral-100 last:border-0">
                                <td className="py-2 pr-4 text-neutral-900 text-xs md:text-sm">
                                  <div className="font-medium">{pro.name}</div>
                                </td>
                                <td className="py-2 pr-4 text-neutral-700 text-xs md:text-sm">
                                  {pro.phone && (
                                    <div>{pro.phone}</div>
                                  )}
                                  {pro.email && (
                                    <div className="text-[11px] text-neutral-500">{pro.email}</div>
                                  )}
                                </td>
                                <td className="py-2 pr-4 text-neutral-700 text-xs md:text-sm">
                                  {pro.specialty || '—'}
                                </td>
                                <td className="py-2 pr-0 text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2 text-xs"
                                    disabled={savingProfessional}
                                    onClick={async () => {
                                      // Espaço para futuras ações (editar, desativar, etc.)
                                      alert('Em breve: ações de edição para profissionais.')
                                    }}
                                  >
                                    Ações
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Formulário de criação de profissional */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Novo profissional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      className="space-y-4"
                      onSubmit={async (e) => {
                        e.preventDefault()
                        setProfessionalFormError(null)

                        const { name, phone } = professionalForm
                        if (!name || !phone) {
                          setProfessionalFormError('Preencha pelo menos nome e telefone do profissional.')
                          return
                        }

                        const result = await createProfessional({
                          name: professionalForm.name,
                          email: professionalForm.email,
                          phone: professionalForm.phone,
                          specialty: professionalForm.specialty,
                        })

                        if (!result.success) {
                          setProfessionalFormError(result.error || 'Erro ao criar profissional')
                          return
                        }

                        setProfessionalForm({ name: '', email: '', phone: '', specialty: '' })
                      }}
                    >
                      <Input
                        label="Nome do profissional"
                        name="name"
                        value={professionalForm.name}
                        onChange={(e) => setProfessionalForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: João Silva"
                        required
                      />

                      <Input
                        label="Telefone"
                        name="phone"
                        value={professionalForm.phone}
                        onChange={(e) => setProfessionalForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="(00) 00000-0000"
                        required
                      />

                      <Input
                        label="Email (opcional)"
                        name="email"
                        type="email"
                        value={professionalForm.email}
                        onChange={(e) => setProfessionalForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="profissional@exemplo.com"
                      />

                      <Input
                        label="Especialidade (opcional)"
                        name="specialty"
                        value={professionalForm.specialty}
                        onChange={(e) => setProfessionalForm((prev) => ({ ...prev, specialty: e.target.value }))}
                        placeholder="Barbeiro, Cabeleireira..."
                      />

                      {professionalFormError && (
                        <div className="text-sm text-red-600">
                          {professionalFormError}
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={savingProfessional}
                      >
                        {savingProfessional ? 'Salvando profissional...' : 'Salvar profissional'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
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
