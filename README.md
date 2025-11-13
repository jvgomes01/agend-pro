## 📋 Sobre o Projeto

AgendPro é um MVP de SaaS para gestão de agendamentos voltado para barbearias, salões de beleza, manicures e estabelecimentos similares.

## 🚀 Funcionalidades Implementadas

### ✅ Estrutura Base

- ✅ Configuração do Next.js 16 com App Router
- ✅ Banco de dados SQLite com Prisma ORM
- ✅ Sistema de componentes UI reutilizáveis
- ✅ Design responsivo com Tailwind CSS

### ✅ Páginas

- ✅ Landing Page moderna e atrativa
- ✅ Página de Cadastro com validação
- ✅ Dashboard com menu lateral e estatísticas
- ✅ Seções para Agendamentos, Clientes e Serviços

### ✅ Backend

- ✅ API de registro de usuários
- ✅ Hash de senhas com bcryptjs
- ✅ Modelos de banco de dados completos:
  - User (Usuários/Donos)
  - Establishment (Estabelecimentos)
  - Professional (Profissionais)
  - Service (Serviços)
  - Client (Clientes)
  - Appointment (Agendamentos)
  - Availability (Disponibilidade)

## 🛠️ Tecnologias Utilizadas

- **Next.js 16** - Framework React
- **React 19** - Biblioteca UI
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **Tailwind CSS 4** - Estilização
- **bcryptjs** - Hash de senhas
- **lucide-react** - Ícones
- **date-fns** - Manipulação de datas
- **zod** - Validação de schemas
- **react-hook-form** - Gerenciamento de formulários

## 📦 Instalação e Execução

```bash
# As dependências já foram instaladas!

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

## 🌐 Acessar a Aplicação

Após executar `npm run dev`, acesse:

- **Landing Page**: http://localhost:3000
- **Cadastro**: http://localhost:3000/cadastro
- **Dashboard**: http://localhost:3000/dashboard

## 📁 Estrutura do Projeto

```
agend-pro/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── register/    # API de cadastro
│   ├── cadastro/            # Página de cadastro
│   ├── login/               # Página de login (a implementar)
│   ├── dashboard/           # Dashboard principal
│   ├── layout.js            # Layout global
│   └── page.js              # Landing page
├── components/
│   └── ui/                  # Componentes reutilizáveis
│       ├── Button.js
│       ├── Card.js
│       └── Input.js
├── lib/
│   └── prisma.js           # Cliente Prisma
├── prisma/
│   └── schema.prisma       # Schema do banco de dados
└── package.json
```

## 🗄️ Modelos do Banco de Dados

### User

Usuário/Dono do estabelecimento com email, senha, nome e telefone.

### Establishment

Estabelecimento com nome, endereço, tipo, horários de funcionamento.

### Professional

Profissionais (barbeiros, cabeleireiras) vinculados ao estabelecimento.

### Service

Serviços oferecidos com nome, descrição, duração e preço.

### Client

Clientes do estabelecimento com informações de contato.

### Appointment

Agendamentos com data, horário, status, cliente, serviço e profissional.

### Availability

Disponibilidade dos profissionais por dia da semana e horário.

## 🎨 Componentes UI

### Button

Botão com variantes: primary, secondary, danger, outline

### Card

Card container com subcomponentes: CardHeader, CardTitle, CardContent

### Input

Input com label e mensagens de erro

## 🔜 Próximos Passos

### CRUD de Estabelecimentos

- [ ] Criar estabelecimento após cadastro
- [ ] Editar informações do estabelecimento
- [ ] Upload de imagens

### CRUD de Serviços

- [ ] Criar serviços
- [ ] Editar e excluir serviços
- [ ] Ativar/desativar serviços

### CRUD de Clientes

- [ ] Adicionar clientes
- [ ] Editar informações de clientes
- [ ] Histórico de agendamentos

### CRUD de Profissionais

- [ ] Adicionar profissionais
- [ ] Definir disponibilidade
- [ ] Vincular serviços

### Sistema de Agendamentos

- [ ] Calendário visual
- [ ] Criar agendamentos
- [ ] Editar e cancelar agendamentos
- [ ] Notificações

### Melhorias

- [ ] Confirmação de agendamento por WhatsApp/SMS
- [ ] Dashboard com métricas reais
- [ ] Relatórios financeiros
- [ ] Sistema de notificações
- [ ] App mobile (React Native)

## 🔐 Variáveis de Ambiente

Arquivo `.env` já configurado com:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui-mude-em-producao"
```

## 📝 Como Usar

1. **Acesse a landing page** em http://localhost:3000
2. **Clique em "Começar Grátis"** ou acesse /cadastro
3. **Preencha o formulário** de cadastro
4. **Após cadastro**, será redirecionado para login
5. **Acesse o dashboard** em /dashboard

## 🤝 Contribuindo

Este é um MVP inicial. Sinta-se livre para expandir as funcionalidades!

## 📄 Licença

Este projeto é um MVP para fins de demonstração.
