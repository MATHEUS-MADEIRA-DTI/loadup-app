import { Flame, CalendarDays, Trophy, Bell, LogOut, Check, Play } from 'lucide-react';
import { Card, Tag, Button, SectionTitle } from '../components/ui';
import { user, stats, weeklyCalendar, todayMuscles, todayExercises, recentSessions } from '../data';
import type { TabId } from '../components/ui';

export function HomeScreen({ onNavigate }: { onNavigate: (t: TabId) => void }) {
  return (
    <div className="pb-28">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-primary text-sm font-extrabold text-white shadow-glow">
            {user.initials}
          </div>
          <div>
            <p className="text-xs font-medium text-ink-muted">Bem-vindo de volta</p>
            <h1 className="text-[22px] font-semibold tracking-tight text-ink">Olá, {user.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-muted active:scale-90 transition-transform">
            <Bell size={18} />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-muted active:scale-90 transition-transform">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 px-5 pt-5">
        <StatCard icon={<Flame size={16} />} value={stats.streak} label="Sequência" />
        <StatCard icon={<CalendarDays size={16} />} value={stats.week} label="Esta semana" />
        <StatCard icon={<Trophy size={16} />} value={stats.total} label="Total" />
      </div>

      {/* Weekly calendar */}
      <div className="px-5 pt-6">
        <h2 className="text-[17px] font-semibold tracking-tight text-ink">Sua semana</h2>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {weeklyCalendar.map((d) => (
            <DayPill key={d.abbr} abbr={d.abbr} day={d.day} status={d.status} />
          ))}
        </div>
      </div>

      {/* Today section */}
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold tracking-tight text-ink">Hoje</h2>
          <span className="text-[13px] font-medium text-ink-muted">Sexta-feira</span>
        </div>
        <Card className="mt-3 p-4">
          <div className="flex flex-wrap gap-2">
            {todayMuscles.map((m) => (
              <Tag key={m}>{m}</Tag>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {todayExercises.slice(0, 3).map((ex, i) => (
              <div key={ex.id} className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface text-xs font-bold text-ink-muted">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-condensed text-ink">{ex.name}</p>
                  <p className="text-xs font-medium text-ink-muted">{ex.totalSeries} séries</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-medium text-primary">+{todayExercises.length - 3} exercícios</p>
          <Button full className="mt-4" onClick={() => onNavigate('treino')}>
            <Play size={18} fill="currentColor" /> Iniciar Treino
          </Button>
        </Card>
      </div>

      {/* Recent sessions */}
      <div className="pt-6">
        <SectionTitle title="Sessões Recentes" action="Ver todas" onAction={() => onNavigate('progresso')} />
        <div className="mt-3 space-y-2.5 px-5">
          {recentSessions.map((s) => (
            <Card key={s.id} className="flex items-center gap-3 p-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-condensed text-ink">{s.dayName}</p>
                <div className="mt-0.5 flex flex-wrap gap-1.5">
                  {s.muscles.map((m) => (
                    <span key={m} className="text-[11px] font-medium text-ink-muted">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-label ${
                    s.status === 'concluido'
                      ? 'bg-primary-soft text-primary'
                      : 'bg-surface text-ink-muted'
                  }`}
                >
                  {s.status === 'concluido' ? 'Concluído' : 'Parcial'}
                </span>
                <span className="text-[11px] font-medium text-ink-muted">{s.date}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <Card className="p-3.5">
      <div className="mb-2 text-ink-muted">{icon}</div>
      <p className="font-display text-[34px] leading-none text-ink">{value}</p>
      <p className="mt-1 text-[11px] font-medium text-ink-muted">{label}</p>
    </Card>
  );
}

function DayPill({ abbr, day, status }: { abbr: string; day: number; status: 'done' | 'active' | 'rest' | 'upcoming' }) {
  if (status === 'active') {
    return (
      <div className="flex w-12 shrink-0 flex-col items-center gap-1.5 rounded-card bg-primary py-3 shadow-glow">
        <span className="text-[10px] font-medium uppercase tracking-wide text-white/80">{abbr}</span>
        <span className="font-display text-xl leading-none text-white">{day}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </div>
    );
  }
  return (
    <div
      className={`flex w-12 shrink-0 flex-col items-center gap-1.5 rounded-card border py-3 ${
        status === 'rest' ? 'border-line opacity-50' : 'border-line'
      }`}
    >
      <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">{abbr}</span>
      <span className="font-display text-xl leading-none text-ink">{day}</span>
      {status === 'done' ? (
        <Check size={14} className="text-success" strokeWidth={3} />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-ink-muted/40" />
      )}
    </div>
  );
}
