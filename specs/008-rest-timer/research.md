# Research: Rest Timer (008)

**Status**: Complete — nenhum NEEDS CLARIFICATION restante  
**Date**: 2026-06-23

---

## 1. Cronômetro regressivo no browser

### Decisão

Usar `setInterval` com tick de 1 segundo, gerenciado via `useRef` para o ID do interval. Estado mantido com `useState` local ao componente `RestTimerButton`.

### Rationale

- Não requer bibliotecas externas
- `useRef` para o interval ID evita re-renders desnecessários
- `useEffect` com cleanup garante que o interval é limpo ao desmontar o componente ou ao cancelar

### Alternativas consideradas

- `requestAnimationFrame`: mais preciso, mas excessivamente complexo para um timer de segundos inteiros
- Biblioteca `react-timer-hook`: adiciona dependência desnecessária para uma lógica simples
- `setTimeout` recursivo: funciona, mas menos idiomático que `setInterval` para ticks regulares

### Padrão de implementação

```tsx
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
const [remaining, setRemaining] = useState(restTime);
const [isRunning, setIsRunning] = useState(false);

const start = () => {
  setRemaining(restTime);
  setIsRunning(true);
  intervalRef.current = setInterval(() => {
    setRemaining((prev) => {
      if (prev <= 1) {
        clearInterval(intervalRef.current!);
        setIsRunning(false);
        triggerNotification();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};

const cancel = () => {
  if (intervalRef.current) clearInterval(intervalRef.current);
  setIsRunning(false);
  setRemaining(restTime);
};

useEffect(
  () => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  },
  [],
);
```

---

## 2. Som de alerta — Web Audio API

### Decisão

Gerar um beep sintético via `AudioContext` + `OscillatorNode`. Sem assets externos (nenhum arquivo `.mp3`/`.wav`).

### Rationale

- Zero dependências externas
- Funciona em iOS Safari (desde que dentro de user gesture — o beep é acionado pelo fim do timer que foi iniciado por gesture do usuário)
- Tom breve (200ms, 880Hz) é suficiente e não intrusivo

### Padrão de implementação

```ts
// src/lib/restTimerNotification.ts
export function playAlertSound(): void {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Silently fail if AudioContext not supported
  }
}
```

### Alternativas consideradas

- `<audio>` HTML element com arquivo estático: requer asset, mais difícil de controlar volume
- `Howler.js`: overhead desnecessário para um único som

---

## 3. Vibração — Vibration API

### Decisão

Usar `navigator.vibrate([200, 100, 200])` — dois pulsos de 200ms com pausa de 100ms. Guardado em try/catch para compatibilidade.

### Rationale

- API nativa, zero dependências
- Padrão de dois pulsos é mais notável que vibração única
- iOS Safari não suporta Vibration API — falha silenciosa, sem degradar a UX

### Padrão de implementação

```ts
export function vibrateAlert(): void {
  try {
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  } catch {
    // Silently fail
  }
}
```

---

## 4. Campo `restTime` no formulário

### Decisão

Input numérico com hint em `MM:SS` ao lado. Valor interno em segundos. Range: 1–5999.

### Rationale

- Segundos como unidade de storage simplifica toda a lógica de countdown
- Hint visual `MM:SS` ajuda o usuário a entender o tempo sem precisar fazer contas
- Limitar a 5999s (≈99:59) evita displays impossíveis no formato `MM:SS`

### UX do input

```
[Tempo de descanso]
[  90  ] segundos  →  1:30
```

O hint é calculado dinamicamente via função pura `formatMMSS(seconds: number): string`.

---

## 5. Integração com exercícios existentes — sem breaking changes

### Decisão

`restTime` é campo opcional no schema Mongoose (`required: false`) e no DTO (`@IsOptional()`). Exercícios existentes sem `restTime` continuam funcionando normalmente — nenhum botão "Descanso" é exibido para eles.

### Rationale

- Compatibilidade retroativa total — dados existentes no MongoDB não precisam de migration
- Mongoose retorna `undefined` para campos ausentes, o que é tratado no frontend com `exercise.restTime && ...`

---

## 6. Posicionamento do botão "Descanso" no treino

### Decisão

Botão "Descanso" posicionado dentro do `StyledExerciseSection`, abaixo da lista de séries (`StyledSeriesList`), antes do próximo exercício. Ao ativar, o botão se transforma no display do timer (MM:SS + botão cancelar), expandindo in-place.

### Rationale

- Posicionamento contextual: logo após as séries do exercício, onde o usuário naturalmente descansa
- In-place expansion evita modais ou overlays que bloqueiam a visualização do progresso
- Padrão já usado por VideoTipsSection no ExerciseCard (collapse/expand in-place)

---

## Resoluções de NEEDS CLARIFICATION

| Item                                     | Resolução                                                                     |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| Timer scope (por série vs por exercício) | Por **exercício** — um `restTime` por exercício, aplicado após qualquer série |
| Início                                   | **Manual** — botão "Descanso" no card do exercício durante treino             |
| Notificação                              | Visual (mudança de estado) + Som (Web Audio API) + Vibração (Vibration API)   |
| Background timer                         | **Fora do escopo** — timer para se usuário navegar para outra tela            |
| Formato de display                       | `MM:SS` — ex: 90s → `1:30`                                                    |
| Formato de input                         | Número em segundos (1–5999) com hint MM:SS ao lado                            |
