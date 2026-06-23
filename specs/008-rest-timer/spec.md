# Feature Specification: Rest Timer

**Feature Branch**: `008-rest-timer`  
**Created**: 2026-06-23  
**Status**: Draft  
**Stacks afetadas**: Frontend (Next.js) + Backend (NestJS)

---

## Visão Geral

Permitir que o usuário configure um tempo de descanso ao criar ou editar um exercício na sua ficha de treino, e que durante a execução do treino ele possa acionar manualmente um cronômetro regressivo que conta o descanso configurado, notificando visual, sonora e tatilmente quando o tempo encerrar.

---

## User Scenarios & Testing

### User Story 1 — Configurar tempo de descanso ao criar exercício (Priority: P1)

Ao adicionar um exercício à ficha de treino, o usuário define quantos segundos/minutos quer descansar entre séries. Essa configuração é salva junto ao exercício e persiste entre sessões.

**Why this priority**: Sem essa configuração, o cronômetro durante o treino não tem valor para usar. É o pré-requisito de tudo.

**Independent Test**: Acessar o modal de adicionar exercício, preencher todos os campos incluindo o tempo de descanso, salvar e reabrir o exercício — o tempo configurado deve aparecer.

**Acceptance Scenarios**:

1. **Given** o modal de adicionar exercício está aberto, **When** o usuário preenche o campo "Tempo de descanso" com 90 segundos e salva, **Then** o exercício é criado com `restTime: 90` persistido no backend.
2. **Given** o campo de tempo de descanso não é preenchido, **When** o usuário salva o exercício, **Then** o exercício é salvo sem `restTime` e nenhum cronômetro é exibido durante o treino para esse exercício.
3. **Given** um exercício já existe na ficha, **When** o usuário acessa editar exercício e altera o tempo de descanso, **Then** o novo valor é persistido e refletido no cronômetro do próximo treino.

---

### User Story 2 — Acionar cronômetro regressivo durante o treino (Priority: P1)

Durante a execução do treino (tela de treino ativo), após completar uma série, o usuário visualiza um botão "Descanso" para o exercício em questão. Ao tocar nesse botão, um cronômetro regressivo inicia contando o tempo configurado naquele exercício.

**Why this priority**: É o core da feature — sem o cronômetro em si, todo o restante perde sentido.

**Independent Test**: Durante o treino, tocar o botão "Descanso" em um exercício com `restTime` configurado — o cronômetro deve aparecer e contar regressivamente.

**Acceptance Scenarios**:

1. **Given** o treino está em andamento e um exercício tem `restTime: 120`, **When** o usuário toca "Descanso", **Then** um cronômetro regressivo exibe `2:00` e começa a contar.
2. **Given** o cronômetro está rodando, **When** o usuário toca no botão novamente (ou em um botão "Cancelar"), **Then** o cronômetro é interrompido e o botão volta ao estado inicial.
3. **Given** o exercício não tem `restTime` configurado, **When** o usuário visualiza o card do exercício no treino, **Then** o botão "Descanso" não aparece para esse exercício.

---

### User Story 3 — Notificação ao fim do descanso (Priority: P2)

Quando o cronômetro regressivo chega a zero, o app notifica o usuário de forma visual, sonora e tátil para que ele possa retomar o treino mesmo que não esteja olhando para a tela.

**Why this priority**: Aumenta a utilidade do cronômetro, mas o fluxo básico já funciona sem isso.

**Independent Test**: Configurar tempo de descanso de 5 segundos, acionar o cronômetro durante o treino e aguardar — ao chegar a zero deve haver feedback visual (mudança de cor/estado), sonoro (beep) e vibração.

**Acceptance Scenarios**:

1. **Given** o cronômetro está em contagem regressiva, **When** chega a zero, **Then** o display exibe "Pode continuar!" (ou equivalente), o dispositivo emite som de alerta e vibra (se permitido pelo dispositivo/SO).
2. **Given** o cronômetro chegou a zero, **When** o usuário toca no botão de descanso novamente, **Then** o cronômetro reinicia com o mesmo tempo configurado.
3. **Given** o dispositivo está no modo silencioso, **When** o cronômetro chega a zero, **Then** apenas o feedback visual e a vibração são acionados (sem som).

---

### Edge Cases

- O que acontece se o usuário navegar para outra tela enquanto o cronômetro está rodando? → O cronômetro para (não há background timer neste escopo).
- O que acontece se o `restTime` salvo for 0 ou negativo? → Tratar como ausente; não exibir o botão "Descanso".
- O que acontece se o usuário configurar um tempo muito longo (ex: 60 minutos)? → Aceitar, mas limitar a UI a exibir no formato `MM:SS` (máximo `99:59`).
- O que acontece se o dispositivo não suportar vibração? → Apenas som e visual são acionados; nenhuma mensagem de erro ao usuário.
- O que acontece se o usuário estiver com o volume zerado? → Apenas visual e vibração são acionados.

---

## Requirements

### Functional Requirements

- **FR-001**: O sistema DEVE permitir que o usuário configure um `restTime` (tempo de descanso em segundos) ao criar um exercício.
- **FR-002**: O sistema DEVE permitir que o usuário edite o `restTime` de um exercício existente na ficha.
- **FR-003**: O campo `restTime` DEVE ser opcional — exercícios sem `restTime` funcionam normalmente sem cronômetro.
- **FR-004**: O backend DEVE persistir o campo `restTime` no subdocumento de exercício dentro da training sheet.
- **FR-005**: O frontend DEVE exibir um botão "Descanso" no card do exercício durante o treino ativo, apenas quando `restTime > 0`.
- **FR-006**: Ao tocar em "Descanso", um cronômetro regressivo DEVE ser exibido contando do `restTime` configurado até zero.
- **FR-007**: O cronômetro DEVE poder ser cancelado/interrompido manualmente pelo usuário a qualquer momento.
- **FR-008**: Ao atingir zero, o cronômetro DEVE emitir feedback visual (mudança de estado), sonoro (Web Audio API) e tátil (Vibration API, se disponível).
- **FR-009**: O input de `restTime` no modal DEVE aceitar valores entre 1 e 5999 segundos (até ~99 minutos).
- **FR-010**: O cronômetro DEVE exibir o tempo no formato `MM:SS`.

### Key Entities

- **Exercise** (subdocumento existente, estendido): representa um exercício na ficha de treino. Passa a incluir o campo opcional `restTime: number` (em segundos).
- **RestTimer** (componente de UI, novo): estado local na tela de treino que gerencia contagem regressiva, notificações e o ciclo de vida do cronômetro para um exercício específico.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: O usuário consegue configurar e salvar um tempo de descanso em menos de 10 segundos ao criar um exercício.
- **SC-002**: O cronômetro inicia em menos de 200ms após o toque no botão "Descanso".
- **SC-003**: O feedback (visual + sonoro + vibração) ocorre no instante exato em que o contador chega a zero, sem atraso perceptível.
- **SC-004**: Exercícios sem `restTime` configurado não apresentam nenhum elemento de UI relacionado ao cronômetro (zero poluição visual).
- **SC-005**: O campo `restTime` é persistido corretamente ao criar e ao editar um exercício (verificável via GET na API).

---

## Assumptions

- O cronômetro é local à sessão de treino — não persiste em background se o usuário sair da tela.
- O som de alerta será gerado via **Web Audio API** (sem assets externos necessários).
- A vibração será solicitada via **Vibration API** do navegador; a permissão é concedida implicitamente em dispositivos que suportam.
- O formato de input do `restTime` no modal será um seletor ou campo numérico em segundos, com visualização auxiliar em `MM:SS`.
- O campo `restTime` será adicionado ao schema de exercício no backend como campo raiz do subdocumento (não dentro de cada série).
- A tela de treino ativo referenciada é `src/app/(app)/train/`.
- O modal de adicionar exercício referenciado é `AddExerciseModal` em `training-plan/[dayOfWeek]/`.
- Compatibilidade de browsers: Chrome/Safari mobile modernos (iOS 13+, Android 8+).
