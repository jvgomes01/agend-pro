# 🧹 Clean Code & Segurança - AgendPro

## 📚 Guia para Desenvolvedores Junior

Este documento explica as práticas de clean code e segurança implementadas no projeto.

---

## 🎯 Princípios Fundamentais

### 1. **DRY** (Don't Repeat Yourself)
❌ **Ruim:**
```js
if (email.length > 255) return 'Email muito longo'
if (name.length > 100) return 'Nome muito longo'
```

✅ **Bom:**
```js
import { VALIDATION_RULES } from '@/lib/constants/app'

if (email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
  return 'Email muito longo'
}
```

**Por quê?** Se precisar mudar o limite, muda em um único lugar.

---

### 2. **Separation of Concerns** (Separação de Responsabilidades)

❌ **Ruim:** Tudo no componente
```js
function CadastroPage() {
  // 100 linhas de lógica + JSX misturados
}
```

✅ **Bom:** Lógica separada em hook
```js
// Hook (lógica)
export function useRegistration() {
  // Toda lógica aqui
}

// Componente (apresentação)
function CadastroPage() {
  const { formData, handleSubmit } = useRegistration()
  return <form onSubmit={handleSubmit}>...</form>
}
```

**Por quê?** Facilita testes, manutenção e reutilização.

---

### 3. **Single Responsibility** (Responsabilidade Única)

Cada função deve fazer UMA coisa apenas.

❌ **Ruim:**
```js
function validateAndSaveUser(data) {
  // valida
  // sanitiza
  // salva no banco
  // envia email
}
```

✅ **Bom:**
```js
function validateUser(data) { /* apenas valida */ }
function sanitizeUser(data) { /* apenas limpa */ }
function saveUser(data) { /* apenas salva */ }
function sendWelcomeEmail(user) { /* apenas envia email */ }
```

---

## 🔒 Segurança Implementada

### 1. **Validação de Entrada**

**SEMPRE** valide dados do usuário.

```js
// ❌ NUNCA faça isso:
const user = await prisma.user.create({ data: request.body })

// ✅ SEMPRE faça isso:
const validation = validateUserRegistration(data)
if (!validation.isValid) {
  return error(validation.errors)
}
```

**Arquivo:** `lib/validators/index.js`

---

### 2. **Sanitização de Dados**

Limpe dados antes de processar (previne XSS).

```js
// ❌ NUNCA faça isso:
const name = request.body.name

// ✅ SEMPRE faça isso:
const sanitizedData = sanitizeUserRegistrationData(request.body)
const name = sanitizedData.name
```

**Arquivo:** `lib/security/sanitize.js`

**O que é XSS?** Cross-Site Scripting - quando alguém injeta código malicioso:
```js
// Ataque XSS
name: "<script>alert('hacked')</script>"

// Depois de sanitizar
name: "alert('hacked')" // tags removidas
```

---

### 3. **Hash de Senhas**

**NUNCA** armazene senhas em texto puro!

```js
// ❌ PERIGO! Senha em texto puro
password: "123456"

// ✅ CORRETO: Senha com hash
import bcrypt from 'bcryptjs'
const hashedPassword = await bcrypt.hash(password, 10)
password: "$2a$10$N9qo8uLOickgx2ZMRZoMy..."
```

**Por quê?** Se o banco vazar, as senhas originais não são expostas.

---

### 4. **Constantes em vez de Magic Numbers**

❌ **Ruim:**
```js
if (password.length < 6) { }
if (status === 401) { }
```

✅ **Bom:**
```js
import { VALIDATION_RULES, HTTP_STATUS } from '@/lib/constants/app'

if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) { }
if (status === HTTP_STATUS.UNAUTHORIZED) { }
```

**Benefícios:**
- Código mais legível
- Fácil de alterar valores
- Evita typos (erros de digitação)

---

### 5. **Tratamento de Erros**

**NUNCA** exponha erros internos ao usuário.

❌ **PERIGO:**
```js
catch (error) {
  return { error: error.message } 
  // Pode expor: "Table 'users' doesn't exist"
}
```

✅ **SEGURO:**
```js
catch (error) {
  // Loga internamente (apenas devs veem)
  console.error('[ERROR]', error)
  
  // Mensagem genérica pro usuário
  return { error: ERROR_MESSAGES.SERVER_ERROR }
}
```

---

## 📁 Estrutura de Arquivos

```
agend-pro/
├── app/                    # Páginas Next.js
│   ├── api/               # API Routes
│   └── cadastro/          # Página de cadastro
├── components/            # Componentes React
│   └── ui/               # Componentes de UI
├── hooks/                # Custom Hooks
│   └── useRegistration.js
├── lib/                  # Bibliotecas e utilitários
│   ├── constants/        # Constantes da aplicação
│   ├── validators/       # Funções de validação
│   ├── security/         # Utilitários de segurança
│   └── prisma.js        # Cliente Prisma
└── prisma/              # Schema do banco
```

---

## 🔍 Checklist de Segurança

Ao criar uma nova feature, verifique:

- [ ] ✅ Validei todos os inputs do usuário?
- [ ] ✅ Sanitizei os dados antes de processar?
- [ ] ✅ Usei constantes ao invés de magic numbers?
- [ ] ✅ Tratei erros sem expor informações internas?
- [ ] ✅ Senhas estão sendo hasheadas?
- [ ] ✅ Não estou retornando senhas nas respostas?
- [ ] ✅ Logs não contêm dados sensíveis?
- [ ] ✅ Código está comentado para outros entenderem?

---

## 💡 Padrões de Nomenclatura

### Funções
- Verbos que descrevem a ação
- camelCase

```js
// ✅ Bom
validateEmail()
sanitizeUserData()
handleSubmit()

// ❌ Ruim
email()
data()
submit()
```

### Constantes
- UPPER_SNAKE_CASE
- Descritivas

```js
// ✅ Bom
const MAX_LOGIN_ATTEMPTS = 5
const API_ROUTES = { ... }

// ❌ Ruim
const max = 5
const routes = { ... }
```

### Componentes
- PascalCase
- Substantivos

```js
// ✅ Bom
<UserProfile />
<RegistrationForm />

// ❌ Ruim
<profile />
<form />
```

---

## 📝 Comentários Úteis

### Quando comentar?

✅ **SEMPRE comente:**
- Por que algo foi feito de determinada forma
- Explicações de lógica complexa
- Avisos de segurança
- TODOs para melhorias futuras

❌ **NÃO comente:**
- O óbvio
```js
// ❌ Ruim
const name = user.name // pega o nome do usuário

// ✅ Bom
// Sanitiza o nome para prevenir XSS
const name = sanitizeHTML(user.name)
```

### Padrão de Comentários

```js
/**
 * Valida email do usuário
 * 
 * @param {string} email - Email a ser validado
 * @returns {Object} { isValid, error }
 * 
 * Exemplo:
 * const result = validateEmail('teste@email.com')
 * if (!result.isValid) {
 *   console.error(result.error)
 * }
 */
export function validateEmail(email) {
  // implementação
}
```

---

## 🚀 Próximas Melhorias

- [ ] Implementar rate limiting (limitar tentativas de login)
- [ ] Adicionar logs estruturados
- [ ] Implementar CSRF protection
- [ ] Adicionar testes automatizados
- [ ] Implementar auditoria de segurança

---

## 📖 Recursos para Aprender Mais

- **Clean Code** - Livro de Robert C. Martin
- **OWASP Top 10** - Lista de vulnerabilidades mais comuns
- **MDN Web Security** - Documentação sobre segurança web
- **React Docs** - Documentação oficial do React

---

## ❓ Dúvidas Comuns

**P: Por que usar custom hooks?**
R: Separa lógica de apresentação, facilitando testes e reutilização.

**P: Por que não usar inline validation?**
R: Centralizar validações facilita manutenção e garante consistência.

**P: Preciso sanitizar TODOS os inputs?**
R: Sim! Nunca confie em dados vindos do usuário.

**P: Por que usar TypeScript não é obrigatório aqui?**
R: Para simplificar para devs junior, mas é altamente recomendado para produção.

---

## 🆘 Como Reportar Problemas de Segurança

Se encontrar uma vulnerabilidade de segurança:
1. **NÃO** abra uma issue pública
2. Entre em contato com a equipe de segurança
3. Descreva o problema em detalhes
4. Aguarde resposta antes de divulgar

---

**Lembre-se:** Código limpo não é sobre ser "bonito", é sobre ser **fácil de entender, manter e seguro**! 🎯
