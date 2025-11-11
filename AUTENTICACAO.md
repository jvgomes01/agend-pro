# 🔐 Sistema de Autenticação - AgendPro

## 📚 Guia de Autenticação para Desenvolvedores

Este documento explica como a autenticação funciona no projeto.

---

## 🎯 Visão Geral

### Tecnologia Utilizada
**NextAuth.js v5** - Biblioteca completa de autenticação para Next.js

### Fluxo de Autenticação
```
1. Usuário acessa /login
2. Preenche email e senha
3. Dados são validados no cliente
4. Enviados para NextAuth
5. NextAuth valida com banco de dados
6. Gera JWT token seguro
7. Token armazenado em cookie httpOnly
8. Usuário redirecionado para /dashboard
```

---

## 🔒 Segurança Implementada

### 1. **Validação em Múltiplas Camadas**

```js
// ✅ Validação no cliente (UX)
const validation = validateLoginCredentials(formData)

// ✅ Validação no servidor (Segurança)
const validation = validateLoginCredentials(credentials)
```

### 2. **Sanitização de Dados**

```js
// Limpa email antes de buscar no banco
const email = sanitizeEmail(credentials.email)
```

### 3. **Comparação Segura de Senhas**

```js
// NUNCA comparar senhas em texto puro
// ❌ ERRADO: password === user.password

// ✅ CORRETO: Usar bcrypt
const isValid = await bcrypt.compare(password, user.password)
```

### 4. **Mensagens Genéricas de Erro**

```js
// ❌ ERRADO: Expor detalhes
if (!user) return 'Email não encontrado'
if (!isValid) return 'Senha incorreta'

// ✅ CORRETO: Mensagem genérica
return ERROR_MESSAGES.INVALID_CREDENTIALS // "Email ou senha incorretos"
```

**Por quê?** Não permitir que atacantes descubram quais emails estão cadastrados.

### 5. **JWT Seguro**

- Token assinado com secret
- HttpOnly cookie (não acessível via JavaScript)
- Tempo de expiração configurável
- Não armazena dados sensíveis

---

## 📁 Arquitetura

### Arquivos Principais

```
lib/auth/
└── config.js              # Configuração centralizada do NextAuth

app/api/auth/
└── [...nextauth]/
    └── route.js          # Endpoint de autenticação

components/
├── providers/
│   └── SessionProvider.js # Provider React
└── auth/
    └── ProtectedRoute.js  # Proteção de rotas

hooks/
├── useAuth.js            # Hook principal de autenticação
└── useLogin.js           # Hook do formulário de login

app/login/
└── page.js               # Página de login
```

---

## 💻 Como Usar

### 1. Login (Cliente)

```jsx
import { useLogin } from '@/hooks/useLogin'

function LoginPage() {
  const { formData, errors, loading, handleChange, handleSubmit } = useLogin()
  
  return (
    <form onSubmit={handleSubmit}>
      <Input 
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input 
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Button disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
```

### 2. Acessar Usuário Logado

```jsx
import { useAuth } from '@/hooks/useAuth'

function MeuComponente() {
  const { user, loading, isAuthenticated } = useAuth()
  
  if (loading) return <Loading />
  if (!isAuthenticated) return <Login />
  
  return <p>Olá, {user.name}!</p>
}
```

### 3. Proteger Rotas

```jsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}
```

### 4. Logout

```jsx
import { useAuth } from '@/hooks/useAuth'

function LogoutButton() {
  const { logout } = useAuth()
  
  return (
    <button onClick={logout}>
      Sair
    </button>
  )
}
```

---

## 🔑 Dados Disponíveis na Sessão

```js
{
  user: {
    id: "123",
    email: "usuario@email.com",
    name: "João Silva",
    phone: "11999999999"
  }
}
```

**IMPORTANTE:** Senha NUNCA é incluída na sessão!

---

## 🛡️ Proteção de Rotas

### Client-Side Protection (React)

```jsx
// Componente ProtectedRoute
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

**Como funciona:**
1. Verifica se há sessão
2. Se não houver, redireciona para /login
3. Mostra loading enquanto verifica
4. Só renderiza conteúdo se autenticado

---

## 🧪 Testando Autenticação

### Cenário 1: Usuário Novo
```
1. Acesse /cadastro
2. Preencha os dados
3. Clique em "Criar conta"
4. Será redirecionado para /login
5. Faça login com as credenciais
6. Será redirecionado para /dashboard
```

### Cenário 2: Acesso Direto ao Dashboard
```
1. Tente acessar /dashboard sem estar logado
2. Será redirecionado automaticamente para /login
3. Após login, volta para /dashboard
```

### Cenário 3: Logout
```
1. No dashboard, clique em "Sair"
2. Sessão é encerrada
3. Redireciona para página inicial
4. Tentativa de acessar /dashboard redireciona para login
```

---

## 🐛 Troubleshooting

### "Session not found"
**Problema:** NEXTAUTH_SECRET não configurado
**Solução:** Verificar arquivo .env

### "Invalid credentials"
**Problema:** Email ou senha incorretos
**Solução:** Verificar se usuário existe e senha está correta

### "Redirect loop"
**Problema:** Rota de login também protegida
**Solução:** NÃO envolver /login com ProtectedRoute

### "User is null"
**Problema:** Token expirado ou inválido
**Solução:** Fazer logout e login novamente

---

## 🔧 Configurações

### Tempo de Sessão

```js
// lib/constants/app.js
export const SECURITY_CONFIG = {
  TOKEN_EXPIRY: 60 * 60 * 24 * 7, // 7 dias
}
```

### Páginas Customizadas

```js
// lib/auth/config.js
pages: {
  signIn: '/login',      // Página de login
  error: '/login',       // Página de erro
}
```

---

## 📊 Fluxo Completo Ilustrado

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. POST /api/auth/signin
       ▼
┌─────────────────┐
│   NextAuth.js   │
└──────┬──────────┘
       │
       │ 2. Valida credenciais
       ▼
┌─────────────────┐
│ authenticateUser│ ◄── Sanitiza dados
└──────┬──────────┘      Valida formato
       │                 Busca no banco
       │                 Compara senha
       │
       │ 3. Gera JWT
       ▼
┌─────────────────┐
│   JWT Token     │
└──────┬──────────┘
       │
       │ 4. Cookie HttpOnly
       ▼
┌─────────────────┐
│   Navegador     │
└──────┬──────────┘
       │
       │ 5. Requisições futuras
       │    incluem token automaticamente
       ▼
┌─────────────────┐
│  Rotas Protegidas│
└─────────────────┘
```

---

## 🚀 Melhorias Futuras

- [ ] Autenticação com Google/GitHub
- [ ] Two-Factor Authentication (2FA)
- [ ] Rate limiting (limite de tentativas)
- [ ] Password reset por email
- [ ] Lembrde-me (remember me)
- [ ] Logs de atividade de login
- [ ] Sessões múltiplas

---

## 📖 Recursos Adicionais

- [NextAuth.js Docs](https://next-auth.js.org/)
- [JWT.io](https://jwt.io/) - Decoder de JWT
- [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## ❓ FAQ

**P: Posso usar localStorage para armazenar o token?**
R: NÃO! Use cookies httpOnly (NextAuth faz isso automaticamente). LocalStorage é vulnerável a XSS.

**P: Como adicionar mais campos ao usuário na sessão?**
R: Edite os callbacks jwt() e session() em `lib/auth/config.js`

**P: A senha é enviada em texto puro?**
R: Sim, mas APENAS via HTTPS. Em produção, sempre use HTTPS.

**P: Posso ter múltiplos providers?**
R: Sim! Adicione mais providers no array em `lib/auth/config.js`

---

**Lembre-se:** Autenticação é CRÍTICA para segurança. Sempre teste bem! 🔐
