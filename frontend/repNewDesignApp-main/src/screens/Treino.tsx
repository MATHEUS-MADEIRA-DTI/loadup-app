import { useEffect, useState } from 'react';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { todayExercises, seriesTypeShort } from '../data';

export function TreinoScreen({ onBack }: { onBack: () => void }) {
  const [exIndex, setExIndex] = useState(0);
  const [seriesIndex, setSeriesIndex] = useState(0);
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(12);
  const [rest, setRest] = useState(60);
  const [showTimer, setShowTimer] = useState(false);

  const ex = todayExercises[exIndex];
  const totalSeries = ex.totalSeries;
  const seriesDots = Array.from({ length: totalSeries });

  const completeSeries = () => {
    if (seriesIndex < totalSeries - 1) {
      setSeriesIndex((s) => s + 1);
      setShowTimer(true);
    } else if (exIndex < todayExercises.length - 1) {
      setExIndex((e) => e + 1);
      setSeriesIndex(0);
      setShowTimer(true);
    } else {
      onBack();
    }
  };

  return (
    <div className="relative min-h-screen pb-28">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 pt-4">
        <button
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink active:scale-90 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-[15px] font-semibold text-ink">Treino de Hoje</p>
          <p className="truncate text-xs font-medium text-ink-muted">Peito · Tríceps · Ombro</p>
        </div>
        <span className="rounded-full bg-primary-soft px-3 py-1.5 font-label text-primary">
          {exIndex + 1}/{todayExercises.length}
        </span>
      </div>

      {/* Exercise focus */}
      <div className="px-5 pt-8">
        <span
          className={`inline-block rounded-full px-3 py-1 text-[11px] font-label ${
            ex.seriesType === 'trabalho'
              ? 'bg-primary text-white'
              : ex.seriesType === 'adaptacao'
                ? 'bg-warning text-white'
                : 'bg-surface-elevated text-ink'
          }`}
        >
          {seriesTypeShort[ex.seriesType]}
        </span>
        <h1 className="mt-4 text-[40px] font-headline leading-[1.02] tracking-tight text-ink">{ex.name}</h1>
        <p className="mt-2 text-base font-medium text-primary">{ex.muscle}</p>
      </div>

      {/* Input cards */}
      <div className="grid grid-cols-3 gap-3 px-5 pt-8">
        <InputCard label="PESO" unit="kg" display={String(weight)} onDec={() => setWeight((w) => Math.max(0, w - 2.5))} onInc={() => setWeight((w) => w + 2.5)} />
        <InputCard label="REPS" unit="" display={String(reps)} onDec={() => setReps((r) => Math.max(0, r - 1))} onInc={() => setReps((r) => r + 1)} />
        <InputCard label="DESCANSO" unit="s" display={String(rest)} onDec={() => setRest((r) => Math.max(0, r - 15))} onInc={() => setRest((r) => r + 15)} />
      </div>

      {/* Series progress dots */}
      <div className="flex items-center justify-center gap-2.5 pt-8">
        {seriesDots.map((_, i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              i < seriesIndex ? 'bg-primary' : i === seriesIndex ? 'bg-primary scale-125' : 'bg-ink-muted/30'
            }`}
          />
        ))}
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 flex gap-3 px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))] glass-strong border-t border-line">
        <Button variant="outline" className="flex-1" onClick={() => completeSeries()}>
          Pular
        </Button>
        <Button className="flex-[1.4]" onClick={completeSeries}>
          Concluir ({seriesIndex + 1}/{totalSeries})
        </Button>
      </div>

      {/* Rest timer overlay */}
      {showTimer && (
        <RestTimer seconds={rest} onSkip={() => setShowTimer(false)} />
      )}
    </div>
  );
}

function InputCard({
  label,
  unit,
  display,
  onDec,
  onInc,
}: {
  label: string;
  unit: string;
  display: string;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <Card className="flex flex-col items-center p-3">
      <p className="text-[10px] font-label text-ink-muted">
        {label}
        {unit && ` (${unit})`}
      </p>
      <p className="my-2 font-display text-4xl leading-none text-ink">{display}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={onDec}
          className="grid h-8 w-8 place-items-center rounded-full bg-surface text-ink-muted active:scale-90 transition-transform"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={onInc}
          className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white active:scale-90 transition-transform"
        >
          <Plus size={16} />
        </button>
      </div>
    </Card>
  );
}

function RestTimer({ seconds, onSkip }: { seconds: number; onSkip: () => void }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const progress = (remaining / seconds) * 100;
  const angle = (remaining / seconds) * 360;
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xl animate-fade-in">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-ink-muted">Descanso</p>

      {/* Analog clock */}
      <div className="relative mt-10 grid place-items-center" style={{ width: 240, height: 240 }}>
        <svg width={240} height={240} className="-rotate-90">
          <circle cx={120} cy={120} r={110} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth={6} />
          <circle
            cx={120}
            cy={120}
            r={110}
            fill="none"
            stroke="rgb(var(--c-primary))"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 110}
            strokeDashoffset={2 * Math.PI * 110 * (1 - progress / 100)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        {/* Tick marks */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-2 w-0.5 bg-white/15"
            style={{
              top: 12,
              left: '50%',
              transformOrigin: '50% 108px',
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        ))}
        {/* Sweeping hand */}
        <div
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            height: 92,
            width: 3,
            marginLeft: -1.5,
            marginTop: -92,
            borderRadius: 999,
            background: 'rgb(var(--c-primary))',
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'bottom center',
            transition: 'transform 1s linear',
            boxShadow: '0 0 12px rgb(var(--c-primary) / 0.6)',
          }}
        />
        <div className="absolute h-4 w-4 rounded-full bg-primary shadow-glow" />
      </div>

      {/* Digital countdown */}
      <p className="mt-10 font-display text-7xl leading-none text-white tabular-nums">
        {mm}:{ss}
      </p>

      <button
        onClick={onSkip}
        className="mt-12 rounded-full border border-white/20 px-8 py-3 text-sm font-medium text-white/80 active:scale-95 transition-transform"
      >
        Pular descanso
      </button>
    </div>
  );
}
