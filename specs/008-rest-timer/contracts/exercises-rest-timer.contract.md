# API Contract: Exercises — Rest Timer Extension (008)

**Date**: 2026-06-23  
**Base path**: `/training-sheet/days/:dayOfWeek/exercises`  
**Auth**: Bearer JWT (header `Authorization`)

---

## Campos adicionados

O campo `restTime` (inteiro, segundos, opcional) é adicionado ao corpo de request e ao objeto de resposta dos endpoints de criação e edição de exercícios.

---

## POST `/training-sheet/days/:dayOfWeek/exercises`

Cria um exercício em um dia da ficha.

### Request Body (mudança)

```json
{
  "name": "Supino Reto",
  "muscleGroup": "Peito",
  "series": [
    { "type": "working", "reps": 10 },
    { "type": "working", "reps": 10 }
  ],
  "videoUrl": "https://youtu.be/abc123",
  "tip": "Mantenha as escápulas retraídas",
  "restTime": 90
}
```

| Campo         | Tipo    | Obrigatório | Validação           |
| ------------- | ------- | ----------- | ------------------- |
| `name`        | string  | Sim         | não vazio           |
| `muscleGroup` | string  | Sim         | não vazio           |
| `series`      | array   | Sim         | 1–10 itens          |
| `videoUrl`    | string  | Não         | —                   |
| `tip`         | string  | Não         | —                   |
| `restTime`    | integer | **Não**     | 1 ≤ restTime ≤ 5999 |

### Response `201 Created`

```json
{
  "data": {
    "_id": "664f...",
    "name": "Supino Reto",
    "muscleGroup": "Peito",
    "series": [...],
    "order": 1,
    "videoUrl": "https://youtu.be/abc123",
    "tip": "Mantenha as escápulas retraídas",
    "restTime": 90,
    "database": false
  },
  "timestamp": "2026-06-23T14:00:00.000-03:00"
}
```

> Se `restTime` não for enviado, o campo **não aparece** na resposta (campo ausente, não `null`).

---

## PATCH `/training-sheet/days/:dayOfWeek/exercises/:exerciseId`

Atualiza campos de um exercício existente.

### Request Body (mudança)

Todos os campos são opcionais. Para atualizar somente o `restTime`:

```json
{
  "restTime": 120
}
```

Para remover o `restTime` (voltar a "sem cronômetro") enviar `restTime: null` não é suportado — enviar o PATCH sem o campo `restTime` deixa o valor existente intacto. Para zerar, o frontend deve **não incluir** `restTime` no payload (o campo é ignorado se ausente).

> **Nota**: Não há suporte a exclusão de `restTime` por PATCH nesta versão. Se necessário no futuro, adicionar endpoint específico ou aceitar `null` explicitamente.

### Response `200 OK`

```json
{
  "data": {
    "_id": "664f...",
    "name": "Supino Reto",
    "muscleGroup": "Peito",
    "series": [...],
    "order": 1,
    "restTime": 120,
    "database": false
  },
  "timestamp": "2026-06-23T14:00:00.000-03:00"
}
```

---

## GET `/training-sheet/days/:dayOfWeek/exercises`

Sem mudança de contrato. O campo `restTime` passa a aparecer nos exercícios que o possuem.

### Response `200 OK` (exemplo com restTime)

```json
{
  "data": [
    {
      "_id": "664f...",
      "name": "Supino Reto",
      "muscleGroup": "Peito",
      "series": [...],
      "order": 1,
      "restTime": 90
    },
    {
      "_id": "665a...",
      "name": "Crucifixo",
      "muscleGroup": "Peito",
      "series": [...],
      "order": 2
    }
  ],
  "timestamp": "2026-06-23T14:00:00.000-03:00"
}
```

---

## Erros

| Código | Cenário                                     |
| ------ | ------------------------------------------- |
| `400`  | `restTime` enviado mas fora do range 1–5999 |
| `400`  | `restTime` enviado como float (não inteiro) |
| `404`  | Dia ou exercício não encontrado             |
| `401`  | Token ausente ou inválido                   |
