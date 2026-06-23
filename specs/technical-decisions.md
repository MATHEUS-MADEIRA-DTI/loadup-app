# LoadUp — Technical Decisions & Lessons Learned

> **Escopo**: Este documento é transversal a **todas as specs e stacks** (frontend e backend).
> O agente de implementação (`speckit.implement`) DEVE ler este arquivo antes de executar qualquer tarefa.
> Qualquer novo bug ou decisão relevante DEVE ser registrado aqui imediatamente.

---

## Como usar este documento

- **Antes de implementar**: leia as seções de Arquitetura, Padrões de Código e Bugs Conhecidos
- **Durante a implementação**: se encontrar um comportamento inesperado, cheque os Bugs Conhecidos
- **Após resolver um novo bug**: adicione uma entrada na seção correspondente com data e contexto

---

## [Frontend] 1. Arquitetura de Páginas (OBRIGATÓRIO)

### Regra de separação de arquivos

Toda página e componente DEVE seguir esta estrutura:

```
src/app/(app)/[page]/
├── page.tsx          ← máximo 80 linhas. Apenas: hooks de dados + composição de layout + lógica de navegação.
│                        PROIBIDO: styled components, declarações inline de componentes.
├── styles.ts         ← TODOS os styled components da página. Nenhum styled component dentro de page.tsx.
└── components/
    └── [ComponentName]/
        ├── index.tsx ← máximo 150 linhas. Apenas JSX + props + lógica local.
        └── styles.ts ← styled components do componente.
```

**STOP CONDITION**: Se qualquer arquivo exceder 150 linhas → dividir antes de continuar para a próxima tarefa.

### Validação de arquitetura (Phase 10 — T070–T076)

Após toda implementação, auditar cada pasta de tela:

- `src/app/(auth)/login/` — T070
- `src/app/(app)/home/` — T071
- `src/app/(app)/training-plan/` — T072
- `src/app/(app)/training-plan/[dayOfWeek]/` — T073
- `src/app/(app)/train/` — T074
- `src/app/(app)/progress/` — T075
- `npx tsc --noEmit` com zero erros — T076

Critérios de auditoria para cada pasta:

1. `page.tsx` ≤ 80 linhas, sem styled components, sem componentes inline
2. `styles.ts` existe com todos os styled components da página
3. Cada sub-componente tem pasta própria em `components/` com `index.tsx` + `styles.ts`
4. Cada `index.tsx` de componente ≤ 150 linhas

---

## [Frontend] 2. Sistema de Temas e Tokens

### Regra de tokens (INVIOLÁVEL)

**NUNCA** escrever hex, pixel size ou font-size diretamente em um componente styled.
**SEMPRE** usar `theme.colors.*`, `theme.spacing.*`, `theme.typography.*`.

```ts
// ❌ ERRADO
background: #6750A4;
color: #FFFFFF;

// ✅ CORRETO
background: ${({ theme }) => theme.colors.primary};
color: ${({ theme }) => theme.colors.onPrimary};
```

### Tokens de tema — valores de referência

| Token                     | Light                    | Dark                     | Notas                           |
| ------------------------- | ------------------------ | ------------------------ | ------------------------------- |
| `colors.primary`          | `#6750A4`                | `#D0BCFF`                | Roxo de marca                   |
| `colors.onPrimary`        | `#FFFFFF`                | `#FFFFFF`                | ⚠️ ver decisão #D002            |
| `colors.surface`          | `#FFFBFE`                | `#2B2930`                | Fundo de cards e botões neutros |
| `colors.onSurface`        | `#1C1B1F`                | `#E6E1E5`                | Texto e ícones sobre surface    |
| `colors.background`       | `#F6F0FA`                | `#1C1B1F`                | Fundo global da página          |
| `colors.glassOverlay`     | `rgba(255,255,255,0.15)` | `rgba(255,255,255,0.08)` | ⚠️ ver decisão #D003            |
| `colors.outlineVariant`   | `#CAC4D0`                | `#49454F`                | Bordas sutis                    |
| `colors.primaryContainer` | `#EDE7F6`                | `#4F378B`                | Fundo de chips e badges         |
| `borderRadius.card`       | `48px`                   | —                        | Cartões grandes                 |
| `borderRadius.inner`      | `36px`                   | —                        | Cartões internos                |
| `borderRadius.pill`       | `1200px`                 | —                        | Botões pill                     |
| `borderRadius.chip`       | `20px`                   | —                        | Chips e badges                  |

### Decisão #D001 — `surface` vs `glassOverlay` para elementos com contraste garantido

Use `theme.colors.surface` (cor sólida) para qualquer elemento que precise de contraste legível.
`glassOverlay` é quase transparente — use apenas para efeito visual sobre fundos conhecidos (ex: cards sobrepostos ao gradiente do header).

**Contexto**: ThemeToggle usava `glassOverlay` como background → ícone de lua invisible em dark mode.
**Solução**: trocado para `surface` + borda `outlineVariant` + `shadows.card`.

### Decisão #D002 — `onPrimary` no dark theme é `#FFFFFF` (não `#381E72`)

O Material You define `onPrimary` dark como `#381E72` (roxo escuro) para contrastar com `primary: #D0BCFF` (roxo claro) quando o elemento é um botão sólido. Porém, o header usa `primaryGradient` (gradiente escuro) — e `#381E72` é invisível sobre fundo escuro.

**Decisão**: `darkTheme.colors.onPrimary = "#FFFFFF"` (branco) para garantir legibilidade em todos os contextos onde `onPrimary` é usado (headers, botões de submit, textos sobre gradiente).

**Impacto**: StatCard value text, botão submit do login, textos de header — todos ficam brancos em dark mode. ✅

### Decisão #D003 — `glassOverlay` não é adequado para backgrounds de botões/controles

`rgba(255,255,255,0.15)` (light) e `rgba(255,255,255,0.08)` (dark) são quase transparentes. Em dark mode, `rgba(255,255,255,0.08)` sobre fundo escuro resulta em contraste praticamente nulo.

**Regra**: Use `glassOverlay` apenas como overlay decorativo sobre o `primaryGradient`. Para botões, use `surface`.

---

## [Frontend] 3. Responsividade

### Decisão #D004 — Sem max-width em layouts de app

**Bug**: Layout `(app)/layout.tsx` tinha `max-width: 430px; margin: 0 auto` → no desktop, a interface ficava comprimida em coluna estreita central.

**Solução**: Removido qualquer `max-width` do wrapper de layout. O app é mobile-first mas deve ser fluido em qualquer largura via media queries `min-width`.

**Regra**: Nunca adicionar `max-width` em wrappers de layout de página. Se precisar limitar conteúdo em desktop, usar media queries explícitas e documentar o motivo.

### Decisão #D005 — Usar `100dvh` em vez de `100vh`

Em iOS Safari, `100vh` inclui a barra de endereço, causando overflow. Usar `min-height: 100dvh` em todos os wrappers de altura full-screen.

```ts
// ❌
min-height: 100vh;

// ✅
min-height: 100dvh;
```

### Decisão #D006 — BottomNavBar: `position: fixed; left: 0; right: 0` (full width)

O nav bar DEVE ocupar 100% da largura da viewport. Nunca usar `max-width` ou `margin: auto` no `StyledNav`. Isso garante que o nav bar cobre o conteúdo abaixo em todos os tamanhos de tela.

### Decisão #D007 — Padrão de media queries: "mobile-first" com constraints consistentes

**REGRA INVIOLÁVEL**: Nunca use `max-width: none` em media queries. Componentes modais/drawers devem manter limite de largura máxima em TODOS os tamanhos de tela.

```ts
// ❌ ERRADO — remove a restrição de largura em mobile
export const StyledModal = styled.div`
  max-width: 500px;
  width: 90%;

  @media (max-width: 768px) {
    width: 95%;
    max-width: none; // ← BUG! Remove o limite de largura
  }
`;

// ✅ CORRETO — mantém max-width em todos os breakpoints
export const StyledModal = styled.div`
  max-width: 500px;
  width: 100%;
  max-height: 80vh;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
    max-height: min(85vh, calc(100vh - 16px));
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.md};
    max-height: min(90vh, calc(100vh - 12px));
  }
`;
```

### Breakpoints padrão para LoadUp

```ts
const BREAKPOINTS = {
  mobile: "480px", // Smartphones (< 480px)
  tablet: "768px", // Tablets e landscape (< 768px)
  desktop: "1024px", // Desktop e acima (≥ 1024px)
};
```

### Checklist para novos componentes modais/drawers

- [ ] `width: 100%` + `max-width: [LIMIT]px` (não `width: 90%` sem max-width)
- [ ] Overlay com `padding: theme.spacing.sm` em mobile
- [ ] `max-height: min(Xvh, calc(100vh - Ypx))` para respeitar teclado virtual
- [ ] Media queries: `@media (max-width: 768px)` e `@media (max-width: 480px)`
- [ ] Manter `max-width` idêntico em TODOS os breakpoints

---

## [Frontend] 4. ThemeToggle — Posicionamento e Visibilidade

### Decisão #D008 — ThemeToggle: posição `bottom: 96px; right: 16px`

**Bug**: ThemeToggle estava em `top: 16px; right: 16px` → sobrepunha o botão de logout do header da Home.

**Solução**: Movido para `bottom: 96px; right: 16px` (acima do BottomNavBar de 80px + 16px de margem).

### Decisão #D009 — ThemeToggle: tokens corretos para visibilidade em ambos os temas

```ts
background: ${({ theme }) => theme.colors.surface};
color: ${({ theme }) => theme.colors.onSurface};
border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
box-shadow: ${({ theme }) => theme.shadows.card};
```

**Regra geral**: Para qualquer controle flutuante (FAB, toggle, tooltip), use `surface`/`onSurface` como cores base, nunca `glassOverlay`/`onPrimary`.

---

## [Frontend] 5. Sistema de Ícones (lucide-react)

### Decisão #D010 — lucide-react como biblioteca de ícones

**Instalação**: `npm install lucide-react`
**Import**: sempre individual — `import { Flame, Dumbbell } from "lucide-react"` (nunca barrel import)

### Regras de uso de ícones

1. **Tamanho mínimo de tap target**: 44×44px. Se o ícone em si for menor, envolver em container com `min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center`.
2. **Cor**: sempre via prop `color` ligada a token de tema ou via CSS `color` herdado do pai.
3. **Ícones em texto inline**: usar `style={{ flexShrink: 0 }}` para evitar compressão.
4. **Nenhum emoji** no código — substituir por componente Lucide correspondente.

### Mapeamento emoji → ícone (referência)

| Emoji   | Ícone Lucide       | Contexto                                                    |
| ------- | ------------------ | ----------------------------------------------------------- |
| 🔥      | `<Flame />`        | Streak, atividade semanal                                   |
| 💪 / 🏋️ | `<Dumbbell />`     | Treino, exercícios                                          |
| 🌙      | `<MoonStar />`     | Dia de descanso                                             |
| ✅      | `<CheckCircle2 />` | Sessão concluída                                            |
| ⏭️      | `<MinusCircle />`  | Sessão pulada                                               |
| 🏆      | `<Trophy />`       | Recordes pessoais                                           |
| ☀️      | `<Sun />`          | ThemeToggle (modo claro → exibe sol para mudar para dark)   |
| 🌙      | `<Moon />`         | ThemeToggle (modo escuro → exibe lua para mudar para light) |
| 📈      | `<TrendingUp />`   | Progressão de carga                                         |

---

## [Frontend] 6. Padrões de API e Serviços

### Decisão #D011 — Camada de serviços isolada obrigatória

Todos os `fetch`/HTTP calls DEVEM passar por `src/services/`. Nenhuma página ou componente chama `fetch` diretamente.

### Decisão #D012 — React Query para todo estado de servidor

Nenhum `useEffect + fetch` para buscar dados. **Sempre** `useQuery` / `useMutation` de `@tanstack/react-query`.

### Decisão #D013 — Token via `tokenStorage` singleton

Nunca ler `localStorage.getItem('loadup_token')` diretamente em services ou hooks.
**Sempre**: `import { tokenStorage } from "@/lib/tokenStorage"; tokenStorage.get()`.

### Decisão #D014 — Tratamento de 401

`apiClient.ts` trata 401 automaticamente: limpa token + redireciona para `/login`.
Services e hooks **não** precisam tratar 401 — confiar no apiClient.

### Decisão #D015 — DELETE retorna `void`, não JSON

`exerciseService.deleteExercise()` retorna `Promise<void>` — a API retorna 204 sem body.
Não tentar parsear `res.json()` em deletes.

### Decisão #D016 — Rota da home é `/home`, não `/`

O arquivo está em `src/app/(app)/home/page.tsx`. A rota de redirecionamento pós-login é `/home`, não `/`.

---

## [Frontend] 7. Strings e Internacionalização

### Decisão #D017 — Strings centralizadas em `src/constants/strings.ts`

Nenhuma string de UI hardcoded em JSX. Toda string visível ao usuário DEVE estar em `strings.ts` e importada via `strings.[namespace].[key]`.

### Decisão #D018 — Funções para strings com pluralização

```ts
// ✅ Correto — função para pluralização dinâmica
summaryTrainingDays: (n: number) => `${n} dia${n !== 1 ? "s" : ""} de treino`,
summaryRestDays: (n: number) => `${n} dia${n !== 1 ? "s" : ""} de descanso`,
```

---

## [Frontend] 8. Acessibilidade

### Decisão #D019 — `aria-label` obrigatório em botões icon-only

Todo botão que contém apenas um ícone (sem texto visível) DEVE ter `aria-label` apontando para uma string de `strings.common.*`.

```tsx
// ✅
<button aria-label={strings.common.ariaLogout}>
  <LogOut size={20} />
</button>
```

---

## [Frontend] 9. CSS Global e Animações

### Decisão #D020 — `globals.css` mínimo, com box-sizing e tap highlight

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-tap-highlight-color: transparent;
}
```

### Decisão #D021 — `keyframes` centralizados em `src/lib/animations.ts`

Quatro keyframes exportados:

- `pageEnter`: fade-in + translateY 12px→0, 300ms ease — toda página `(app)/*`
- `tabEnter`: fade-in + translateX 8px→0, 200ms ease-out — conteúdo de tabs
- `modalEnter`: fade-in + scale 0.95→1, 200ms ease-out — modais
- `modalOverlay`: opacity 0→0.5, 150ms linear — overlay de modais

---

## [Backend] 10. Stack e Configuração

| Camada       | Escolha                                 | Notas                                                        |
| ------------ | --------------------------------------- | ------------------------------------------------------------ |
| Framework    | NestJS                                  | Modular, DI nativa, decorators                               |
| Linguagem    | TypeScript `strict: true`               | `noImplicitAny`, `strictNullChecks`                          |
| ODM          | Mongoose via `@nestjs/mongoose`         | Schema-first, tipagem forte                                  |
| Autenticação | `@nestjs/jwt` + `@nestjs/passport`      | JWT HS256, 24h de expiração                                  |
| Validação    | `class-validator` + `class-transformer` | DTOs com `ValidationPipe` global                             |
| Timezone     | `America/Sao_Paulo` (UTC-3)             | Todas as datas convertidas antes de persistir/retornar       |
| Testes       | **Nenhum**                              | Fora do escopo — confiança vem do sistema de tipos           |
| Porta        | `3000`                                  | Frontend consome `NEXT_PUBLIC_API_URL=http://localhost:3000` |

---

## [Backend] 11. Arquitetura de Módulos (OBRIGATÓRIO)

### Estrutura de pastas por domínio

```
src/[domain]/
├── schemas/
│   └── [entity].schema.ts   ← Mongoose schema + TypeScript interface
├── dto/
│   ├── create-[entity].dto.ts
│   └── update-[entity].dto.ts
├── [domain].module.ts
├── [domain].service.ts       ← lógica de negócio, sem HTTP
└── [domain].controller.ts    ← apenas routing + transformação de req/res
```

### Regra de responsabilidade única

- **Controller**: recebe request, extrai dados, chama service, retorna response. Sem lógica de negócio.
- **Service**: contém toda a lógica de negócio. Nunca acessa `req`/`res` diretamente.
- **Schema**: define estrutura MongoDB + índices. Nunca contém lógica de negócio.

### Domínios existentes

`auth` · `users` · `training-sheet` · `exercises` · `training-session` · `calendar` · `progression`

---

## [Shared] 12. TypeScript

### Decisão #D022 — `strict: true` inviolável em ambas as stacks

`tsconfig.json` DEVE ter `"strict": true`. Nunca usar `any` sem type-narrowing justificado.
Após qualquer mudança: `npx tsc --noEmit` deve retornar sem output (zero erros).

### Padrões de tipagem — Frontend

```ts
// Props de styled component com tema
interface StyledProps {
  $isActive?: boolean; // prefixo $ para props que não vazam para o DOM
}
```

### Padrões de tipagem — Backend

```ts
// Tipos de retorno explícitos em services e controllers
// ❌ ERRADO
async createUser(dto: CreateUserDto) { ... }

// ✅ CORRETO
async createUser(dto: CreateUserDto): Promise<UserDocument> { ... }
```

### Decisão #D023 — `@nestjs/mapped-types` para DTOs de update (Backend)

```ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateExerciseDto } from "./create-exercise.dto";
export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {}
```

---

## [Backend] 13. Timezone e Datas

### Decisão #D024 — Todas as datas em `America/Sao_Paulo` (UTC-3)

- MongoDB armazena datas em UTC internamente — isso é correto e não deve ser alterado.
- **Ao retornar datas para o cliente**: converter para ISO 8601 com offset `-03:00` via `src/common/utils/timezone.util.ts`.
- **Regra de "hoje"**: calcular o dia atual com base no timezone de SP, não UTC.

```ts
// Utilitário obrigatório — nunca usar new Date() diretamente para "hoje"
import {
  toSaoPauloDate,
  getTodayInSaoPaulo,
} from "@/common/utils/timezone.util";
```

### Decisão #D025 — Formato de data de sessão: `YYYY-MM-DD`

O campo `date` de `TrainingSession` é uma string `YYYY-MM-DD` no timezone de SP — não um objeto Date ou timestamp.

---

## [Backend] 14. Autenticação e Segurança

### Decisão #D026 — JWT HS256, 24h, secret via `.env`

```
JWT_SECRET=<string aleatória de 64+ caracteres>
JWT_EXPIRES_IN=24h
```

`JWT_SECRET` NUNCA deve aparecer no código-fonte. Sempre via `ConfigService`.

### Decisão #D027 — Bcrypt rounds = 10

### Decisão #D028 — Guards aplicados no controller, não no módulo

Aplicar `JwtAuthGuard` no nível do controller (não globalmente) para que `/auth/register` e `/auth/login` permaneçam públicos.

### Decisão #D029 — Senha nunca retornada em responses

```ts
@Prop({ required: true, select: false })
password: string;
```

Usar `.select('+password')` explicitamente apenas onde necessário.

---

## [Backend] 15. Mongoose e MongoDB

### Decisão #D030 — Uma training sheet ativa por usuário

`createTrainingSheet()` DEVE verificar se já existe sheet para o usuário antes de criar:

```ts
const existing = await this.model.findOne({ userId });
if (existing) throw new ConflictException("Training sheet already exists");
```

### Decisão #D031 — Exercícios como subdocumentos embedded na TrainingDay

Exercícios são subdocumentos dentro de `TrainingDay`, não uma collection separada. Updates usam `findOneAndUpdate` com `arrayFilters`.

### Decisão #D032 — Índices obrigatórios

| Collection          | Índice                        | Motivo                         |
| ------------------- | ----------------------------- | ------------------------------ |
| `users`             | `email: 1` (unique)           | Login e unicidade              |
| `training-sheets`   | `userId: 1` (unique)          | Uma sheet por usuário          |
| `training-sessions` | `userId: 1, date: 1` (unique) | Uma sessão por dia por usuário |

---

## [Backend] 16. Rotas e Contratos da API

### Decisão #D033 — DELETE retorna 204 sem body

```ts
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async deleteExercise(...): Promise<void> { ... }
```

Frontend DEVE tratar delete como `Promise<void>` — nunca chamar `.json()` na resposta.

### Decisão #D034 — PATCH para updates parciais, não PUT

### Decisão #D035 — `dayOfWeek` como parâmetro de rota usa nomes completos em inglês

Valores válidos: `monday` · `tuesday` · `wednesday` · `thursday` · `friday` · `saturday` · `sunday`

---

## [Backend] 17. Tratamento de Erros

### Decisão #D036 — Usar exceções NestJS nativas, não `throw new Error()`

```ts
throw new NotFoundException("Training sheet not found");
throw new ConflictException("Email already registered");
throw new UnauthorizedException("Invalid credentials");
```

### Formato padrão de error response

```json
{
  "statusCode": 404,
  "message": "Training sheet not found",
  "error": "Not Found",
  "timestamp": "2026-05-12T20:00:00.000-03:00"
}
```

### Formato padrão de success response (via `TransformInterceptor`)

```json
{
  "data": { ... },
  "timestamp": "2026-05-12T20:00:00.000-03:00"
}
```

---

## [Backend] 18. Validação com DTOs

### Decisão #D037 — `ValidationPipe` global com `whitelist` e `forbidNonWhitelisted`

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

---

## [Backend] 19. Spec 005 — Exercise Database (Mai/2026)

**Decisão**: Spec 005 foi transformada de Translation Service para **Exercise Database**.

- Elimina dependência externa (API Ninjas da spec 003)
- Banco de dados local JSON com 50+ exercícios em português
- Expande MuscleGroup enum de 8 para 11 grupos (Trapézio, Antebraço, Panturrilha)
- Busca local substituindo `/exercises/search`
- Adiciona `videoUrl` e `tip` aos exercícios
- Introduz importação via CSV

**Impacto**: `src/translation/` não é mais necessário. `src/exercises-api/` (spec 003) foi substituído por `ExerciseDatabaseService`.

---

## Registro de Bugs

> Adicionar aqui todo bug resolvido com: data, sintoma, causa-raiz, solução.

### Frontend

| #       | Data     | Sintoma                                                                                         | Causa-Raiz                                                                                                                                                                                               | Solução                                                                                                                                                                       |
| ------- | -------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FE-B001 | Mai/2026 | Ícone de lua do ThemeToggle invisível em dark mode                                              | `background: glassOverlay` (quase transparente) + `color: onPrimary` (branco em light, roxo escuro em dark)                                                                                              | Trocado para `background: surface` + `color: onSurface` + border `outlineVariant`                                                                                             |
| FE-B002 | Mai/2026 | Texto do header da Home aparece roxo escuro sobre fundo escuro em dark mode                     | `darkTheme.colors.onPrimary = "#381E72"` é invisível sobre `primaryGradient` escuro                                                                                                                      | Alterado `onPrimary` dark para `#FFFFFF`                                                                                                                                      |
| FE-B003 | Mai/2026 | Layout comprimido em desktop (coluna de 430px centralizada)                                     | `(app)/layout.tsx` tinha `max-width: 430px; margin: 0 auto`                                                                                                                                              | Removido completamente o max-width; layout agora é fluido                                                                                                                     |
| FE-B004 | Mai/2026 | ThemeToggle sobrepondo botão de logout do header na Home                                        | ThemeToggle em `top: 16px; right: 16px` colide com botões do header                                                                                                                                      | Movido para `bottom: 96px; right: 16px` (acima do BottomNavBar)                                                                                                               |
| FE-B005 | Mai/2026 | BottomNavBar não cobre conteúdo abaixo em telas largas                                          | `StyledNav` tinha `max-width`                                                                                                                                                                            | Removido; `left: 0; right: 0` garante 100% de largura                                                                                                                         |
| FE-B006 | Mai/2026 | PlateauAlertsModal não 100% responsivo em mobile, width máxima mal configurada                  | Media query removia `max-width: 500px` em mobile (`max-width: none`), causando modal muito largo em telas pequenas                                                                                       | Mantém `max-width: 500px` em TODOS os breakpoints; adapta padding, altura, overlay                                                                                            |
| FE-B007 | Mai/2026 | `videoUrl` e `tip` selecionados na busca não apareciam na seção "Vídeo e Dicas" do ExerciseCard | `handleExerciseSelect` em `AddExerciseModal` só capturava `name` e `muscleGroup`; `videoUrl` e `tip` eram descartados antes do submit                                                                    | Adicionados estados `videoUrl` e `tip` no modal; `handleExerciseSelect` agora chama `setVideoUrl`/`setTip`; `handleSubmit` inclui os campos no payload via spread condicional |
| FE-B008 | Mai/2026 | Exercício excluído não desaparecia da lista sem F5                                              | Backend retornava `HTTP 200` com body vazio no DELETE; `apiClient` tentava `response.json()` em body vazio e lançava erro de parse; `onSuccess` do React Query nunca disparava, cache não era invalidado | Corrigido no backend com `@HttpCode(204)` no endpoint DELETE (ver BE-B003). No frontend, o fluxo de invalidação já estava correto em `useDeleteExercise`                      |

### Backend

| #       | Data     | Sintoma                                                                                      | Causa-Raiz                                                                                                                                                                                               | Solução                                                                                                                                                 |
| ------- | -------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BE-B001 | Mai/2026 | Senha retornada em response de login                                                         | Campo `password` sem `select: false` no schema                                                                                                                                                           | Adicionado `select: false` + `.select('+password')` apenas onde necessário                                                                              |
| BE-B002 | Mai/2026 | Usuário consegue criar múltiplas training sheets                                             | Sem verificação de unicidade em `createTrainingSheet`                                                                                                                                                    | Adicionado `findOne({ userId })` + `ConflictException` antes de criar                                                                                   |
| BE-B003 | Mai/2026 | DELETE de exercício retornava body JSON vazio em vez de 204                                  | `@HttpCode` não aplicado no handler                                                                                                                                                                      | Adicionado `@HttpCode(HttpStatus.NO_CONTENT)` no controller                                                                                             |
| BE-B004 | Mai/2026 | Bootstrap falhava com `EXERCISES_API_KEY is required` mesmo com a key no `.env`              | Variável nomeada `EXERCISE_API_KEY` (sem "S") no `.env`, divergindo do config                                                                                                                            | Renomeado para `EXERCISES_API_KEY` no `.env`                                                                                                            |
| BE-B005 | Mai/2026 | HTTP 429 rate limit errors ao traduzir exercícios (40+ simultaneous API calls)               | `Promise.all()` traduzindo todos os exercícios concorrentemente                                                                                                                                          | Mudado para loop sequencial com `300ms` delay entre traduções (spec 005)                                                                                |
| BE-B006 | Mai/2026 | `videoUrl` e `tip` enviados no POST de exercício eram ignorados e não persistidos no MongoDB | `addExerciseToDay` no service tipava o payload sem `videoUrl`/`tip` e o objeto salvo era construído manualmente sem esses campos                                                                         | Adicionados `videoUrl?` e `tip?` ao tipo do payload; objeto `exercise` usa spread condicional `...(payload.videoUrl && { videoUrl: payload.videoUrl })` |
| BE-B007 | Mai/2026 | DELETE de exercício retornava `200` com body vazio; UI não atualizava sem F5                 | Nenhum `@HttpCode(204)` no handler DELETE; NestJS devolvia `200` com body vazio; `apiClient` chamava `response.json()` no body vazio e lançava `SyntaxError`; `onSuccess` do React Query nunca disparava | Adicionado `@HttpCode(204)` ao `deleteExercise` handler em `exercises.controller.ts`                                                                    |
