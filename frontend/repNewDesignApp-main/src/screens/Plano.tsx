import { ChevronRight } from 'lucide-react';
import { Card, Tag } from '../components/ui';
import { plan, type DayPlan } from '../data';

export function PlanoScreen({ onSelectDay }: { onSelectDay: (id: string) => void }) {
  const trainingDays = plan.filter((d) => !d.isRest).length;
  const restDays = plan.filter((d) => d.isRest).length;

  return (
    <div className="pb-28">
      <div className="px-5 pt-4">
        <h1 className="text-[22px] font-semibold tracking-tight text-ink">Meu Plano de Treino</h1>
        <p className="mt-1 text-sm font-medium text-ink-muted">
          {trainingDays} dias de treino · {restDays} descanso
        </p>
      </div>

      <div className="mt-5 space-y-3 px-5">
        {plan.map((day) => (
          <DayCard key={day.id} day={day} onClick={() => !day.isRest && onSelectDay(day.id)} />
        ))}
      </div>
    </div>
  );
}

function DayCard({ day, onClick }: { day: DayPlan; onClick: () => void }) {
  const isToday = day.isToday;
  const isRest = day.isRest;

  return (
    <Card
      onClick={onClick}
      glass={!isToday}
      className={`p-4 ${isToday ? 'border-primary bg-primary-soft' : ''} ${isRest ? 'opacity-55' : ''}`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${
            isToday ? 'bg-primary text-white shadow-glow' : isRest ? 'bg-surface text-ink-muted' : 'bg-surface text-ink'
          }`}
        >
          {day.abbr}
        </div>

        <div className="min-w-0 flex-1">
          <p className={`text-[16px] font-condensed tracking-tight ${isRest ? 'text-ink-muted' : 'text-ink'}`}>
            {day.name}
          </p>
          {isRest ? (
            <p className="mt-1 text-xs font-label text-ink-muted">Descanso</p>
          ) : (
            <>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {day.muscles.map((m) => (
                  <Tag key={m}>{m}</Tag>
                ))}
              </div>
              <p className="mt-1.5 text-xs font-medium text-ink-muted">
                {day.exercises.length} exercícios · {day.exercises.reduce((a, e) => a + e.totalSeries, 0)} séries
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          {isRest ? (
            <span className="text-[10px] font-label text-ink-muted">Descanso</span>
          ) : (
            <>
              <span className="text-[10px] font-label text-primary">Treino</span>
              <ChevronRight size={18} className="text-ink-muted" />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
