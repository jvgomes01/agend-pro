# 📦 Dependências do Projeto - AgendPro

## 📋 Visão Geral

Este documento lista todas as dependências do projeto, explicando o propósito de cada uma.

---

## 🚀 Dependências de Produção

### Framework & Core

#### **Next.js** `16.0.1`
```json
"next": "16.0.1"
```
**O que faz:** Framework React para aplicações web com SSR, rotas, API routes, etc.  
**Por que usamos:** Base do projeto, fornece estrutura completa para aplicação full-stack.  
**Documentação:** https://nextjs.org/docs

#### **React** `19.2.0`
```json
"react": "19.2.0",
"react-dom": "19.2.0"
```
**O que faz:** Biblioteca JavaScript para construir interfaces de usuário.  
**Por que usamos:** Core para componentes e UI.  
**Documentação:** https://react.dev

---

### Autenticação

#### **NextAuth.js** `^4.24.13`
```json
"next-auth": "^4.24.13"
```
**O que faz:** Biblioteca completa de autenticação para Next.js.  
**Por que usamos:** Gerencia login, logout, sessões, JWT tokens de forma segura.  
**Usado em:** Login, proteção de rotas, gerenciamento de sessão.  
**Documentação:** https://next-auth.js.org

#### **bcryptjs** `^3.0.3`
```json
"bcryptjs": "^3.0.3"
```
**O que faz:** Biblioteca para hash de senhas.  
**Por que usamos:** Criptografa senhas antes de armazenar no banco (segurança).  
**Usado em:** Registro e autenticação de usuários.  
**Documentação:** https://github.com/dcodeIO/bcrypt.js

---

### Banco de Dados

#### **Prisma Client** `^6.19.0`
```json
"@prisma/client": "^6.19.0"
```
**O que faz:** ORM (Object-Relational Mapping) para Node.js e TypeScript.  
**Por que usamos:** Facilita interação com banco de dados com segurança contra SQL injection.  
**Usado em:** Todas as operações de banco de dados.  
**Documentação:** https://www.prisma.io/docs

---

### Validação & Formulários

#### **Zod** `^4.1.12`
```json
"zod": "^4.1.12"
```
**O que faz:** Biblioteca de validação de schemas TypeScript-first.  
**Por que usamos:** Validação de dados de forma type-safe.  
**Usado em:** Validações (preparado para uso futuro).  
**Documentação:** https://zod.dev

#### **React Hook Form** `^7.66.0`
```json
"react-hook-form": "^7.66.0"
```
**O que faz:** Biblioteca para gerenciar formulários em React.  
**Por que usamos:** Facilita validação e gerenciamento de estado de formulários.  
**Usado em:** Preparado para formulários futuros.  
**Documentação:** https://react-hook-form.com

#### **@hookform/resolvers** `^5.2.2`
```json
"@hookform/resolvers": "^5.2.2"
```
**O que faz:** Integrações de validação para React Hook Form (Zod, Yup, etc).  
**Por que usamos:** Conecta Zod com React Hook Form.  
**Usado em:** Preparado para uso futuro.  
**Documentação:** https://github.com/react-hook-form/resolvers

---

### Estado & Gerenciamento

#### **Zustand** `^5.0.8`
```json
"zustand": "^5.0.8"
```
**O que faz:** Biblioteca minimalista de gerenciamento de estado.  
**Por que usamos:** Gerenciamento de estado global quando necessário.  
**Usado em:** Preparado para estado global futuro.  
**Documentação:** https://docs.pmnd.rs/zustand

---

### UI & Estilização

#### **Tailwind CSS** (via postcss) `^4`
```json
"@tailwindcss/postcss": "^4"
```
**O que faz:** Framework CSS utility-first.  
**Por que usamos:** Estilização rápida e consistente com classes utilitárias.  
**Usado em:** Todo o projeto (estilização).  
**Documentação:** https://tailwindcss.com

#### **class-variance-authority** `^0.7.1`
```json
"class-variance-authority": "^0.7.1"
```
**O que faz:** Cria variantes de componentes com TypeScript.  
**Por que usamos:** Gerencia variantes de botões e componentes UI.  
**Usado em:** Componentes com múltiplas variantes (Button, etc).  
**Documentação:** https://cva.style

#### **clsx** `^2.1.1`
```json
"clsx": "^2.1.1"
```
**O que faz:** Utilitário para construir strings de className condicionalmente.  
**Por que usamos:** Facilita classes CSS condicionais.  
**Usado em:** Função `cn()` em utils.  
**Documentação:** https://github.com/lukeed/clsx

#### **tailwind-merge** `^3.4.0`
```json
"tailwind-merge": "^3.4.0"
```
**O que faz:** Merge inteligente de classes Tailwind.  
**Por que usamos:** Evita conflitos de classes CSS do Tailwind.  
**Usado em:** Função `cn()` em utils.  
**Documentação:** https://github.com/dcastil/tailwind-merge

#### **Lucide React** `^0.553.0`
```json
"lucide-react": "^0.553.0"
```
**O que faz:** Biblioteca de ícones SVG para React.  
**Por que usamos:** Ícones minimalistas e leves em todo o projeto.  
**Usado em:** Todo o projeto (Calendar, Users, Settings, etc).  
**Documentação:** https://lucide.dev

---

### Utilitários

#### **date-fns** `^4.1.0`
```json
"date-fns": "^4.1.0"
```
**O que faz:** Biblioteca moderna para manipulação de datas.  
**Por que usamos:** Formatação e manipulação de datas de agendamentos.  
**Usado em:** Sistema de agendamentos (preparado).  
**Documentação:** https://date-fns.org

#### **dotenv** `^17.2.3`
```json
"dotenv": "^17.2.3"
```
**O que faz:** Carrega variáveis de ambiente de arquivo .env.  
**Por que usamos:** Gerencia configurações sensíveis (secrets, URLs, etc).  
**Usado em:** Configuração do Prisma.  
**Documentação:** https://github.com/motdotla/dotenv

---

## 🛠️ Dependências de Desenvolvimento

### Build & Compilação

#### **Prisma** `^6.19.0`
```json
"prisma": "^6.19.0"
```
**O que faz:** CLI do Prisma para migrations, generate, etc.  
**Por que usamos:** Gera cliente Prisma e gerencia migrações.  
**Usado em:** Development e build.  
**Documentação:** https://www.prisma.io/docs

#### **Tailwind CSS** `^4`
```json
"tailwindcss": "^4"
```
**O que faz:** Core do Tailwind CSS.  
**Por que usamos:** Processa classes CSS em build time.  
**Usado em:** Build do projeto.  
**Documentação:** https://tailwindcss.com

---

### Linting & Code Quality

#### **ESLint** `^9`
```json
"eslint": "^9"
```
**O que faz:** Ferramenta de análise estática de código.  
**Por que usamos:** Mantém qualidade e consistência do código.  
**Usado em:** `npm run lint`.  
**Documentação:** https://eslint.org

#### **eslint-config-next** `16.0.1`
```json
"eslint-config-next": "16.0.1"
```
**O que faz:** Configuração ESLint otimizada para Next.js.  
**Por que usamos:** Regras específicas para Next.js.  
**Usado em:** Configuração do ESLint.  
**Documentação:** https://nextjs.org/docs/app/building-your-application/configuring/eslint

---

### Otimização

#### **babel-plugin-react-compiler** `1.0.0`
```json
"babel-plugin-react-compiler": "1.0.0"
```
**O que faz:** Compilador experimental do React para otimizações.  
**Por que usamos:** Melhora performance em runtime.  
**Usado em:** Build do projeto.  
**Documentação:** https://react.dev/learn/react-compiler

---

## 📊 Resumo por Categoria

| Categoria | Quantidade | Exemplos |
|-----------|------------|----------|
| 🚀 Framework | 3 | Next.js, React |
| 🔐 Autenticação | 2 | NextAuth, bcryptjs |
| 🗄️ Banco de Dados | 2 | Prisma Client/CLI |
| ✅ Validação | 3 | Zod, React Hook Form |
| 🎨 UI/Estilização | 5 | Tailwind, Lucide, clsx |
| 🛠️ Utilitários | 3 | date-fns, dotenv, zustand |
| 🔧 Dev Tools | 3 | ESLint, Babel |

**Total:** 21 pacotes

---

## 🚀 Como Instalar

### Instalação Completa
```bash
npm install
```

### Instalar Apenas Produção
```bash
npm install --production
```

### Instalar Dependência Específica
```bash
# Produção
npm install <pacote>

# Desenvolvimento
npm install -D <pacote>
```

---

## 📝 Comandos Importantes

### Desenvolvimento
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Verifica código com ESLint
```

### Prisma
```bash
npx prisma generate  # Gera Prisma Client
npx prisma db push   # Atualiza banco de dados
npx prisma studio    # Abre interface visual do banco
```

---

## 🔄 Atualizando Dependências

### Verificar Outdated
```bash
npm outdated
```

### Atualizar Todas
```bash
npm update
```

### Atualizar para Latest
```bash
npm install <pacote>@latest
```

### Atualizar Majors (cuidado!)
```bash
npx npm-check-updates -u
npm install
```

---

## ⚠️ Dependências Críticas para Segurança

Estas dependências DEVEM ser mantidas atualizadas:

- ✅ `next-auth` - Vulnerabilidades de autenticação
- ✅ `bcryptjs` - Segurança de senhas
- ✅ `@prisma/client` - SQL injection protection
- ✅ `next` - Framework security patches

### Verificar Vulnerabilidades
```bash
npm audit
npm audit fix
```

---

## 📦 Tamanho das Dependências

### Ver Tamanho do node_modules
```bash
# PowerShell
(Get-ChildItem node_modules -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
```

### Analisar Bundle Size
```bash
npm run build
# Veja o output para ver tamanho dos bundles
```

---

## 🆘 Problemas Comuns

### "Module not found"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### "Prisma Client not generated"
```bash
npx prisma generate
```

### "ESLint errors"
```bash
npm run lint
# Consertar automaticamente
npm run lint -- --fix
```

---

## 📖 Recursos Adicionais

- [npm Documentation](https://docs.npmjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Keep dependencies updated](https://renovatebot.com/)

---

## 🔐 Segurança

### Verificar Vulnerabilidades Regularmente
```bash
# Semanalmente
npm audit

# Automatizar com GitHub Dependabot
# ou Snyk
```

### Não Commitar node_modules
Já está no `.gitignore` ✅

### Usar package-lock.json
Sempre commitar `package-lock.json` para garantir versões consistentes ✅

---

**Última atualização:** 2025-01-11  
**Versão do Node recomendada:** >= 18.17.0  
**Versão do npm recomendada:** >= 9.6.7
