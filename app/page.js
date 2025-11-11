import Link from "next/link";
import { Calendar, Clock, Users, Scissors } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neutral-900 rounded-md flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-neutral-900">AgendPro</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/cadastro">
                <Button>Começar</Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight">
            Agendamentos
            <br />
            <span className="text-neutral-500">simplificados</span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Sistema minimalista de agendamento para barbearias e salões.
            <br />
            Gerencie clientes, serviços e horários com simplicidade.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/cadastro">
              <Button size="lg">Começar gratuitamente</Button>
            </Link>
            <Link href="#recursos">
              <Button variant="outline" size="lg">Conhecer recursos</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-3">
              Recursos essenciais
            </h2>
            <p className="text-neutral-600">Tudo que você precisa, nada que você não precisa</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-neutral-200 rounded-lg p-8 space-y-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center">
                <Calendar className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Calendário</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Visualize e gerencie agendamentos em interface intuitiva
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg p-8 space-y-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center">
                <Users className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Clientes</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Cadastro completo com histórico de atendimentos
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg p-8 space-y-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center">
                <Scissors className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Serviços</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Configure serviços, preços e duração facilmente
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg p-8 space-y-3">
              <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center">
                <Clock className="w-5 h-5 text-neutral-700" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Disponibilidade</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Defina horários e disponibilidade dos profissionais
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
          <h2 className="text-3xl font-bold text-neutral-900">
            Começe hoje
          </h2>
          <p className="text-lg text-neutral-600">
            Crie sua conta gratuitamente. Sem cartão de crédito necessário.
          </p>
          <div>
            <Link href="/cadastro">
              <Button size="lg">Criar conta gratuita</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-600">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-neutral-900 rounded flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-neutral-900">AgendPro</span>
            </div>
            <p>© 2025 AgendPro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
