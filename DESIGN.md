# 🎨 Design System - AgendPro

## Filosofia do Design

O AgendPro utiliza um design **minimalista e funcional**, focado em:

- **Simplicidade**: Interface limpa sem distrações
- **Clareza**: Hierarquia visual clara e intuitiva
- **Consistência**: Padrões visuais uniformes em todo o sistema
- **Acessibilidade**: Contraste adequado e foco em usabilidade

## Paleta de Cores

### Cores Principais
- **Neutral 900** (`#171717`) - Textos principais e elementos de destaque
- **Neutral 600** (`#525252`) - Textos secundários
- **Neutral 500** (`#737373`) - Textos terciários e placeholders
- **Neutral 400** (`#a3a3a3`) - Ícones desabilitados
- **Neutral 200** (`#e5e5e5`) - Bordas
- **Neutral 100** (`#f5f5f5`) - Backgrounds sutis
- **Neutral 50** (`#fafafa`) - Background da página
- **White** (`#ffffff`) - Cards e elementos principais

### Cores de Status
- **Red 500/50** - Erros e alertas
- **Green 500/50** - Sucesso
- **Blue 500/50** - Informações

## Tipografia

### Font Family
- Sistema operacional padrão (sans-serif)
- Fallback: Inter, system-ui, -apple-system, BlinkMacSystemFont

### Tamanhos
- **3xl** (30px) - Títulos de página
- **2xl** (24px) - Títulos de cards
- **lg** (18px) - Subtítulos
- **base** (16px) - Texto padrão
- **sm** (14px) - Texto secundário
- **xs** (12px) - Labels e hints

### Pesos
- **Bold** (700) - Títulos principais
- **Semibold** (600) - Títulos secundários e botões
- **Medium** (500) - Labels e destaques
- **Regular** (400) - Texto padrão

## Componentes

### Button

```jsx
// Variantes
<Button variant="default">Padrão</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="default">Padrão</Button>
<Button size="lg">Grande</Button>
<Button size="icon">Ícone</Button>
```

**Características:**
- Background neutro escuro (default)
- Bordas arredondadas (6px)
- Transições suaves
- Estados hover e focus bem definidos

### Card

```jsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
</Card>
```

**Características:**
- Borda sutil (1px neutral-200)
- Background branco
- Padding consistente (24px)
- Border radius (8px)

### Input

```jsx
<Input 
  label="Nome" 
  placeholder="Digite seu nome"
  error="Mensagem de erro"
/>
```

**Características:**
- Altura fixa (40px)
- Borda neutral-300
- Focus ring neutral-400
- Estados de erro em vermelho

## Espaçamento

### Sistema de Grid
- **Gap padrão**: 16px (gap-4)
- **Gap pequeno**: 12px (gap-3)
- **Gap grande**: 24px (gap-6)

### Padding
- **Cards**: 24px (p-6)
- **Inputs**: 12px horizontal, 8px vertical
- **Buttons**: 16px horizontal, 8px vertical

### Margens
- Entre seções: 32px (mb-8)
- Entre elementos: 16px (mb-4)
- Entre títulos e conteúdo: 8px (mb-2)

## Iconografia

**Biblioteca**: Lucide React

**Tamanhos padrão:**
- **w-4 h-4** (16px) - Ícones em botões e menu
- **w-5 h-5** (20px) - Ícones standalone
- **w-6 h-6** (24px) - Ícones em headers

**Cor padrão:** neutral-600 ou neutral-400 (desabilitado)

## Layout

### Estrutura de Páginas

#### Landing Page
- Header fixo com logo e navegação
- Hero section centralizado
- Features em grid 2 colunas
- Footer minimalista

#### Dashboard
- Header global fixo
- Sidebar lateral (224px)
- Conteúdo principal fluido
- Background neutral-50

#### Formulários
- Centralizado verticalmente
- Max-width: 448px (md)
- Card branco sobre fundo neutral-50

## Estados Vazios

Seguem o padrão:
1. Ícone em container neutral-100 (48x48px)
2. Título em negrito
3. Descrição em texto menor
4. Call-to-action com botão

```jsx
<div className="text-center space-y-4">
  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto">
    <Icon className="w-6 h-6 text-neutral-400" />
  </div>
  <div>
    <p className="font-medium text-neutral-900">Título</p>
    <p className="text-sm text-neutral-600">Descrição</p>
  </div>
  <Button size="sm">Ação</Button>
</div>
```

## Animações

- **Transições**: 150ms ease-in-out
- **Hover states**: Mudança sutil de cor
- **Focus states**: Ring de 2px

## Responsividade

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Comportamento
- Mobile-first approach
- Sidebar se torna menu hamburguer em mobile
- Grid de features: 1 coluna (mobile) → 2 colunas (md+)
- Stats cards: 1 coluna (mobile) → 4 colunas (lg+)

## Acessibilidade

- ✅ Contraste mínimo WCAG AA (4.5:1)
- ✅ Focus states visíveis
- ✅ Labels em todos os inputs
- ✅ Botões com textos descritivos
- ✅ Hierarchy semântica (h1, h2, etc)

## Princípios de Design

1. **Menos é mais**: Remover elementos desnecessários
2. **Consistência**: Usar os mesmos padrões em todo o app
3. **Feedback visual**: Estados claros de hover, active, disabled
4. **Hierarquia**: Tamanhos e pesos tipográficos bem definidos
5. **Espaçamento**: Usar o sistema de espaçamento consistentemente

## Utilidades CSS

O projeto usa **Tailwind CSS** com as seguintes extensões:

```js
// lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

Permite combinar classes condicionalmente:
```jsx
className={cn(
  "base-classes",
  condition && "conditional-classes",
  customClassName
)}
```

## Próximos Passos

- [ ] Adicionar modo escuro (dark mode)
- [ ] Implementar componente de Toast/Notification
- [ ] Criar componente de Modal/Dialog
- [ ] Adicionar animações de transição entre páginas
- [ ] Implementar skeleton loaders
