import { ArrowLeft, Play, Dumbbell, Layers, Clock } from 'lucide-react';
import { Tag } from '../components/ui';
import { plan } from '../data';

export function IntroScreen({
  dayId,
  onBack,
  onStart,
}: {
  dayId: string;
  onBack: () => void;
  onStart: () => void;
}) {
  const day = plan.find((d) => d.id === dayId) ?? plan[4];
  const totalSeries = day.exercises.reduce((a, e) => a + e.totalSeries, 0);
  const estimatedMin = Math.max(20, Math.round(totalSeries * 2.5));

  return (
    <div className="relative min-h-screen overflow-hidden pb-40">
      {/* Gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 90% 55% at 50% 0%, rgb(var(--c-primary) / 0.15) 0%, transparent 65%)`,
        }}
      />

      <div className="relative">
        {/* Back arrow */}
        <div className="px-5 pt-4">
          <button
            onClick={onBack}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink active:scale-90 transition-transform"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* Day name massive */}
        <div className="px-5 pt-8 text-center">
          <h1 className="font-headline text-[72px] uppercase leading-[0.9] tracking-tight text-ink">
            {day.name.replace('-feira', '')}
          </h1>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {day.muscles.map((m) => (
              <Tag key={m}>{m}</Tag>
            ))}
          </div>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-3 gap-3 px-5 pt-8">
          <StatPill icon={<Dumbbell size={15} />} value={day.exercises.length} label="exercícios" />
          <StatPill icon={<Layers size={15} />} value={totalSeries} label="séries" />
          <StatPill icon={<Clock size={15} />} value={estimatedMin} label="min" />
        </div>

        {/* Exercise list */}
        <div className="px-5 pt-8">
          <p className="text-xs font-label text-ink-muted">Exercícios</p>
          <div className="mt-3 divide-y divide-line">
            {day.exercises.map((ex, i) => (
              <div key={ex.id} className="flex items-center gap-3.5 py-3.5">
                <span className="font-display text-2xl leading-none text-primary w-6 text-center">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-ink">{ex.name}</p>
                </div>
                <span className="text-xs font-medium text-ink-muted">{ex.totalSeries} séries</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom */}
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 border-t border-line glass-strong px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <button
          onClick={onStart}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-headline text-base uppercase tracking-wide text-white shadow-glow active:scale-[0.98] transition-transform"
        >
          <Play size={20} fill="currentColor" /> Iniciar
        </button>
        <button
          onClick={onBack}
          className="mt-3 w-full text-center text-sm font-normal text-ink-muted active:scale-95 transition-transform"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

function StatPill({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-card border border-line bg-surface-elevated px-2 py-3.5">
      <div className="mb-1.5 text-primary">{icon}</div>
      <p className="font-display text-3xl leading-none text-ink">{value}</p>
      <p className="mt-1 text-[10px] font-medium text-ink-muted">{label}</p>
    </div>
  );
}
