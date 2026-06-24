---
name: LoadUp
description: Tracker de treino para atletas — preciso, silencioso, premium.
colors:
  # Light theme (default)
  primary: "#6750A4"
  primary-container: "#EDE7F6"
  primary-strong: "#4A148C"
  surface: "#FFFBFE"
  background: "#F6F0FA"
  on-primary: "#FFFFFF"
  on-surface: "#1C1B1F"
  on-surface-muted: "#49454F"
  on-surface-subtle: "#79747E"
  outline: "#79747E"
  outline-variant: "#CAC4D0"
  error: "#B3261E"
  error-container: "#F9DEDC"
  success: "#386A20"
  success-container: "#D3E8D0"
  # Dark theme tokens (used when isDark = true)
  dark-primary: "#D0BCFF"
  dark-primary-container: "#4F378B"
  dark-surface: "#2B2930"
  dark-background: "#1C1B1F"
  dark-on-surface: "#E6E1E5"
  dark-on-surface-muted: "#CAC4D0"
  dark-outline-variant: "#49454F"
  dark-success: "#A5D6A7"
  dark-success-container: "#1B5E20"
typography:
  display:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.4
  title-sm:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.3
  label-sm:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.2
rounded:
  chip: "20px"
  inner: "36px"
  card: "48px"
  pill: "1200px"
  avatar: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  series-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.chip}"
    padding: "{spacing.sm}"
  series-card-logged:
    backgroundColor: "{colors.success-container}"
    rounded: "{rounded.chip}"
    padding: "{spacing.sm}"
  chip-type:
    rounded: "{rounded.pill}"
    padding: "3px 8px"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.chip}"
  input-rest:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.primary}"
    rounded: "{rounded.chip}"
---

# Design System: LoadUp

## 1. Overview

**Creative North Star: "The Obsidian Log"**

LoadUp é o caderno preto do atleta em formato digital. O design parte de um princípio absoluto: o atleta está com 100kg na barra e não pode perder atenção para a interface. Cada pixel que não carrega informação é um pixel que compete com o treino. A estética é a consequência da disciplina funcional — superfícies limpas, hierarquia clara, feedback imediato. Nada ornamental.

O sistema suporta modo claro e escuro por preferência do usuário. A ambição visual é o modo escuro: superfícies em `#1C1B1F` com roxo índigo como único acento, onde a cor aparece apenas em momentos de significado (ação confirmada, série concluída, treino finalizado). O modo claro segue os mesmos princípios com fundo levemente tintado de roxo (`#F6F0FA`).

O sistema rejeita explicitamente: neon e gradientes estilo suplemento esportivo; cards informativos decorativos sem dados reais; a estética enterprise cinza sem personalidade; qualquer elemento visual que exija atenção sem retorno informacional.

**Key Characteristics:**

- Mobile-first, touch-optimized — targets mínimos 44px
- Dual theme (light default, dark via toggle persistido em localStorage)
- Um acento cromático (índigo) usado com restrição máxima
- Tipografia monoescala em Roboto — hierarquia por peso e tamanho, nunca por família
- Sombras tintadas de roxo, não sombras neutras
- Border radius generoso (48px em cards, pill em botões) — orgânico, não corporativo

---

## 2. Colors: A Paleta Índigo

Um único acento. Todo o resto é neutro tintado de roxo para preservar a identidade sem saturar o ambiente.

### Primary

- **Índigo Atlético** (`#6750A4` light / `#D0BCFF` dark): A cor da marca. Aparece em CTAs primários, indicadores de progresso, badges ativos, e nos inputs de descanso (rest time) para diferenciá-los visualmente das entradas de reps/peso. No dark mode, aparece mais claro (`#D0BCFF`) para manter contraste sobre os fundos escuros.
- **Índigo Container** (`#EDE7F6` light / `#4F378B` dark): Fundo suave para elementos que precisam de destaque sem cor sólida — chips de tipo de série inativo, inputs de rest time, badges de estado.

### Neutral

- **Fundo Base** (`#F6F0FA` light / `#1C1B1F` dark): O background principal. No light mode tem uma tinta levíssima de roxo que ancora a identidade sem ser uma cor. No dark mode é praticamente preto.
- **Superfície** (`#FFFBFE` light / `#2B2930` dark): Superfície de cards e modais — um passo acima do background. A diferença sutil entre background e surface cria profundidade tonal.
- **Texto Principal** (`#1C1B1F` light / `#E6E1E5` dark): Near-black / near-white. Alta legibilidade, nunca puro preto ou branco.
- **Texto Muted** (`#49454F` light / `#CAC4D0` dark): Labels de campo, metadados, informação secundária.
- **Texto Subtle** (`#79747E` light / `#938F99` dark): Terceiro nível — data de referência, placeholders.
- **Divider Variant** (`#CAC4D0` light / `#49454F` dark): Bordas de inputs, separadores entre elementos.

### Semantic

- **Erro** (`#B3261E` light / `#F2B8B5` dark) + Container (`#F9DEDC` / `#8C1D18`): Estados de validação e ações destrutivas.
- **Sucesso** (`#386A20` light / `#A5D6A7` dark) + Container (`#D3E8D0` / `#1B5E20`): Série logada, treino concluído. O verde aparece apenas quando algo foi concretizado — nunca decorativamente.

### Named Rules

**A Regra do Acento Único.** O índigo (`primary`) aparece em ≤15% de qualquer tela. Nos estados padrão, a interface é neutra. A cor reservada para ação, confirmação e identidade — não como decoração de fundo ou separadores.

**A Regra do Verde Conquistado.** O verde (`success` / `successContainer`) não aparece em estados default. Aparece exclusivamente quando o usuário completou algo: série registrada, treino finalizado, timer concluído. Seu valor semântico depende da escassez.

---

## 3. Typography

**Display / Body Font:** Roboto (400, 500, 700 — Google Fonts)
**Label/Mono Font:** Roboto (mesma família, peso 500)

**Character:** Sistema monoescala. Hierarquia 100% por peso e tamanho, nunca por família tipográfica. Roboto lido na academia tem o caráter correto: neutro o suficiente para não distrair, com densidade adequada para telas compactas. Sem display serif, sem font pairing decorativo.

### Hierarchy

- **Display** (700, 22px, lh 1.2): Títulos de seção principais. Nome do treino, cabeçalho do dia. Máximo uma ocorrência por tela.
- **Headline** (700, 17px, lh 1.3): Subtítulos de exercício, cabeçalhos de modal. Âncora visual para grupos de conteúdo.
- **Title** (600, 16px, lh 1.4): Título de card, nome de exercício inline, labels de ação. O nível mais frequente de destaque textual.
- **Title SM** (600, 15px, lh 1.4): Variante menor para contextos comprimidos (linhas de série, chips de tipo).
- **Body** (400, 13px, lh 1.5): Texto corrido, instruções, dicas de exercício. Sempre sobre fundo com contraste ≥4.5:1.
- **Label** (500, 12px, lh 1.3): Labels de campo (kg, reps, s), badges de tipo de série, metadata de exercício.
- **Label SM** (400, 10px, lh 1.2): Micro-informações — número de ordem em chips, contadores de progresso.

### Named Rules

**A Regra da Escala Única.** Nenhum elemento usa fonte diferente de Roboto. Diferenças de personalidade são expressas por peso (400/500/600/700) e tamanho — nunca por família adicional. Peso 700 é reservado para Display e Headline; nunca em Body.

---

## 4. Elevation

O sistema usa **sombras estruturais tintadas de roxo** — não sombras neutras cinza. A tinta de roxo nas sombras conecta a profundidade visual à identidade da marca, especialmente no modo claro. Superfícies flutuam sobre o fundo com clareza; o usuário lê imediatamente o que é interativo.

No dark mode, a elevação é resolvida predominantemente por **contraste tonal**: `surface` (`#2B2930`) sobre `background` (`#1C1B1F`) já cria separação sem sombra. Sombras no dark mode são mais escuras e discretas.

### Shadow Vocabulary

- **Card** (`0px 2px 8px 0px rgba(103,80,164,0.15)`): Sombra padrão para cards de exercício, modais, painéis. Eleva levemente sem chamar atenção para si mesma.
- **Primary** (`0px 4px 16px 0px rgba(103,80,164,0.30)`): Sombra acentuada para CTAs primários, botões de ação flutuantes, estados de foco elevado. Usada com parcimônia.

### Named Rules

**A Regra da Sombra Roxa.** Sombras `rgba(0,0,0,...)` são proibidas no sistema. Toda sombra leva a tinta `rgba(103,80,164,...)`. Isso diferencia o LoadUp de qualquer sistema genérico e mantém o espaço visual coeso.

**A Regra Flat-por-Padrão no Dark.** No modo escuro, cards não usam sombra por padrão — a diferença tonal entre background e surface é suficiente. Sombra no dark mode é reservada para modais e overlays que precisam de separação explícita de contexto.

---

## 5. Components

### Buttons

Pastilhas completas. O pill radius (`1200px`) comunica fluidez e organicidade — distancia do corporativo retangular sem ser ingênuo. Targets de toque mínimos de 44px de altura.

- **Shape:** Full pill (`border-radius: 1200px`)
- **Primary:** Fundo `#6750A4`, texto branco, padding `12px 24px`. Sombra `primary` em hover.
- **Ghost:** Fundo transparente, texto e borda `#6750A4`. Para ações secundárias dentro de modais.
- **Destructive:** Fundo `#B3261E`, texto branco. Apenas para ações irreversíveis.
- **Add Series (dashed):** Borda tracejada `1.5px` em `outlineVariant`, texto `primary`. Comunica "adicionar" sem peso de botão sólido.
- **Estados:** hover escurece `primary` → `#4A148C`. disabled → `opacity: 0.38`. Focus → `box-shadow: 0 0 0 2px primary`.

### Cards de Série (SeriesInputRow)

O componente central do fluxo de treino. Dois estados visuais distintos:

- **Shape:** `border-radius: 20px` (chip). Padding interno `8px`.
- **Default:** Fundo `surface`, sem sombra. Contém top row (badge de tipo + nome + meta de reps) e bottom row (inputs de peso, reps, descanso).
- **Logged:** Fundo `successContainer` (`#D3E8D0` light / `#1B5E20` dark). Transição `background 200ms ease`. O verde aparece no momento exato da confirmação — reforço visual imediato.
- **Input de Rest Time:** Distingue-se dos outros inputs com fundo `primaryContainer` e texto `primary`. Sem borda — a cor é o marcador de identidade.

### Inputs

- **Shape:** `border-radius: 20px`. Altura 44px (padrão), 32px (compacto em cards).
- **Default:** Fundo `surface`, borda 1px `outlineVariant`. Focus → borda `primary`, sem outline nativo.
- **Rest Input (compacto):** Fundo `primaryContainer`, sem borda, texto `primary`. Focus → `box-shadow: 0 0 0 1.5px primary`.
- **Todos os inputs numéricos:** `inputMode="decimal"` (peso) ou `inputMode="numeric"` (reps, rest) para teclado numérico no mobile.

### Segmented Type Selector

Seletor de tipo de série (warm-up / adjustment / working):

- **Shape:** `border-radius: 20px` externo com `overflow: hidden`. Botões sem borda individual.
- **Inactive:** Fundo transparente, texto `onSurfaceMuted`.
- **Active:** Fundo `primary`, texto branco, `font-weight: 600`.
- **Borda:** 1px `outlineVariant` no container.

### Muscle Group Chips (MuscleChip)

Chips de grupo muscular com paleta própria de 11 cores — cada grupo tem par `bg/text` calibrado para contraste em ambos os temas. Shape `border-radius: pill`.

### Rest Timer (RestTimerButton)

Três estados com progressão visual clara:

- **Idle:** Botão pill, borda `1.5px outlineVariant`, texto muted. Label: "Descanso · MM:SS".
- **Running:** Container pill, borda `1.5px primary`, fundo `primaryContainer`. Display de tempo em 22px tabular, `font-variant-numeric: tabular-nums`, `letter-spacing: 2px`.
- **Finished:** Container pill, fundo `successContainer`, texto e ícone `success`. Clicável para reiniciar.

### Navigation (Bottom Bar)

Barra de navegação inferior com tabs. Item ativo em `primary`, inativo em `onSurfaceMuted`.

---

## 6. Do's and Don'ts

**Do:** Use `successContainer` como único fundo verde. Ele aparece exclusivamente em estados concluídos.

**Don't:** Use verde decorativamente — como cor de fundo de seção, separador, ou destaque de conteúdo não-concluído.

---

**Do:** Mantenha targets de toque ≥44px em todo componente interativo. O usuário está na academia, possivelmente com luvas ou mãos suadas.

**Don't:** Crie botões compactos abaixo de 36px de altura em qualquer contexto do fluxo de treino.

---

**Do:** Use `primary` para identificar a ação de maior peso na tela. Máximo um CTA primary por viewport.

**Don't:** Use `primary` em mais de 15% da área visível. Quando tudo é acento, nada é acento.

---

**Do:** Preserve o índigo roxo como única cor de identidade. Mesmo que evolua o shade, mantenha o hue na faixa 270–300°.

**Don't:** Introduza uma segunda cor de acento (teal, laranja, verde como acento) — o sistema é monoacento por princípio.

---

**Do:** Use sombra `rgba(103,80,164,...)` (roxo) para todos os `box-shadow`. Nunca cinza neutro.

**Don't:** Copie sombras de outros sistemas (`0 4px 6px rgba(0,0,0,0.1)`) — elas rompem a coesão tonal do sistema.

---

**Do:** No dark mode, confie no contraste tonal surface/background para separar elementos. Sombra é reservada para modais e overlays.

**Don't:** Adicione sombras em todos os cards no dark mode por reflexo — fica pesado e perde o premium.
