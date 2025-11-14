/**
 * Página pública de agendamento
 *
 * URL: /b/[slug]
 *
 * Permite que clientes escolham serviço, profissional, data/horário
 * e informem seus dados (nome, telefone, email) para criar um agendamento.
 */

'use client'

import { useParams } from 'next/navigation'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Calendar, Users, Scissors } from 'lucide-react'
import { usePublicBooking } from '@/hooks/usePublicBooking'

export default function PublicBookingPage() {
  const params = useParams()
  const slug = params?.slug

  const {
    establishment,
    loading,
    submitting,
    errors,
    successMessage,
    formData,
    handleChange,
    handleSubmit,
  } = usePublicBooking(slug)

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-900 rounded-md flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">Agendamento online</p>
            <h1 className="text-2xl font-semibold text-neutral-900">
              {establishment?.name || 'Carregando estabelecimento...'}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados do agendamento</CardTitle>
              </CardHeader>
              <CardContent>
                {errors.root && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm">
                    {errors.root}
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Serviço
                      </label>
                      <select
                        name="serviceId"
                        value={formData.serviceId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                        disabled={loading}
                      >
                        <option value="">Selecione um serviço</option>
                        {establishment?.services?.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name} ({service.duration} min)
                          </option>
                        ))}
                      </select>
                      {errors.serviceId && (
                        <p className="mt-1 text-xs text-red-600">{errors.serviceId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Profissional
                      </label>
                      <select
                        name="professionalId"
                        value={formData.professionalId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                        disabled={loading}
                      >
                        <option value="">Selecione um profissional</option>
                        {establishment?.professionals?.map((pro) => (
                          <option key={pro.id} value={pro.id}>
                            {pro.name}
                          </option>
                        ))}
                      </select>
                      {errors.professionalId && (
                        <p className="mt-1 text-xs text-red-600">{errors.professionalId}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Data
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                      {errors.date && (
                        <p className="mt-1 text-xs text-red-600">{errors.date}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Hora início
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                      {errors.startTime && (
                        <p className="mt-1 text-xs text-red-600">{errors.startTime}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Hora fim (opcional)
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-4 mt-2">
                    <h3 className="text-sm font-medium text-neutral-900 mb-3">Seus dados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nome completo"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                      />
                      <Input
                        label="Telefone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        required
                      />
                      <Input
                        label="Email (opcional)"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                      />
                    </div>

                    <div className="mt-4 space-y-2">
                      <label className="flex items-start gap-2 text-xs text-neutral-700">
                        <input
                          type="checkbox"
                          name="appointmentReminderOptIn"
                          checked={formData.appointmentReminderOptIn}
                          onChange={handleChange}
                          className="mt-0.5"
                        />
                        <span>Quero receber lembretes deste agendamento por WhatsApp/email.</span>
                      </label>
                      <label className="flex items-start gap-2 text-xs text-neutral-700">
                        <input
                          type="checkbox"
                          name="reengagementOptIn"
                          checked={formData.reengagementOptIn}
                          onChange={handleChange}
                          className="mt-0.5"
                        />
                        <span>Quero receber lembretes para marcar novos horários no futuro.</span>
                      </label>
                    </div>
                  </div>

                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md text-sm">
                      {successMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={submitting || loading}
                  >
                    {submitting ? 'Enviando...' : 'Confirmar agendamento'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sobre o estabelecimento</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-neutral-600">Carregando...</p>
                ) : (
                  <div className="space-y-2 text-sm text-neutral-700">
                    <p className="font-medium text-neutral-900">{establishment?.name}</p>
                    {establishment?.description && (
                      <p className="text-xs text-neutral-600">{establishment.description}</p>
                    )}
                    {establishment?.address && (
                      <p className="flex items-start gap-2 text-xs text-neutral-600">
                        <span className="mt-0.5">
                          <Calendar className="w-3 h-3" />
                        </span>
                        <span>{establishment.address}</span>
                      </p>
                    )}
                    {establishment?.phone && (
                      <p className="flex items-start gap-2 text-xs text-neutral-600">
                        <span className="mt-0.5">
                          <Users className="w-3 h-3" />
                        </span>
                        <span>{establishment.phone}</span>
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Serviços disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                {establishment?.services?.length ? (
                  <ul className="space-y-2 text-sm text-neutral-700">
                    {establishment.services.map((service) => (
                      <li key={service.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Scissors className="w-4 h-4 text-neutral-400" />
                          <span>{service.name}</span>
                        </div>
                        <span className="text-xs text-neutral-600">
                          {service.duration} min
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-neutral-600">Nenhum serviço cadastrado.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
