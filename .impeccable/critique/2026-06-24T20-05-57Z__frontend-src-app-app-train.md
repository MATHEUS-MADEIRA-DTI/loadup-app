---
target: train
total_score: 21
p0_count: 0
p1_count: 2
timestamp: 2026-06-24T20-05-57Z
slug: frontend-src-app-app-train
---
## Design Health Score

| # | Heurística | Score | Issue Principal |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Barra + contador bons. Falta toast de erro de rede. |
| 2 | Match System / Real World | 3 | Vocabulário correto. WU/ADJ/W sem legenda. |
| 3 | User Control and Freedom | 2 | Pular treino sem confirmação é destrutivo. |
| 4 | Consistency and Standards | 2 | #FDECEA hardcoded, border-radius 32px/2px fora do scale, uppercase eyebrow proibido. |
| 5 | Error Prevention | 2 | Sem confirmação antes de pular treino. |
| 6 | Recognition Rather Than Recall | 2 | Dados da sessão anterior não exibidos. |
| 7 | Flexibility and Efficiency | 1 | Sem repetir última série. 3 inputs manuais por série. |
| 8 | Aesthetic and Minimalist Design | 3 | Cards limpos. ReadOnlyNotice redundante. |
| 9 | Error Recovery | 2 | Sem toast de erro em falha de rede. |
| 10 | Help and Documentation | 1 | WU/ADJ/W sem legenda. Tip inacessível. |
| **Total** | | **21/40** | Funcional — lacunas de alto impacto |

## Priority Issues
- [P1] Sem dados da sessão anterior
- [P1] Pular treino sem confirmação
- [P2] Sem feedback de rede no log
- [P2] Back button 36px abaixo do mínimo 44px
- [P3] #FDECEA hardcoded sem dark mode
