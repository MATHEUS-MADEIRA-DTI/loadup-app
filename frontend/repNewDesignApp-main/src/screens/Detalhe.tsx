import { ArrowLeft, Pencil, Trash2, Plus, Play } from 'lucide-react';
import { Card, Tag, Button, ProgressRing } from '../components/ui';
import { plan } from '../data';
import type { Exercise } from '../data';

export function DetalheScreen({
  dayId,
  onBack,
  onStart,
  onAddExercise,
  onEditExercise,
}: {
  dayId: string;
  onBack: () => void;
  onStart: () => void;
  onAddExercise: () => void;
  onEditExercise: (ex: Exercise) => void;
}) {
  const day = plan.find((d) => d.id === dayId) ?? plan[4];
  const totalSeries = day.exercises.reduce((a, e) => a + e.totalSeries, 0);

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4">
        <button
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink active:scale-90 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-[26px] font-headline tracking-tight text-ink">{day.name}</h1>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 px-5 pt-2">
        {day.muscles.map((m) => (
          <Tag key={m}>{m}</Tag>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 px-5 pt-5">
        <Card className="flex items-center gap-3 p-4">
          <ProgressRing value={(day.exercises.length / 8) * 100}>
            <span className="font-display text-lg leading-none text-ink">{day.exercises.length}</span>
          </ProgressRing>
          <div>
            <p className="text-[11px] font-medium text-ink-muted">Exercícios</p>
            <p className="font-display text-2xl leading-none text-ink">{day.exercises.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <ProgressRing value={(totalSeries / 30) * 100}>
            <span className="font-display text-lg leading-none text-ink">{totalSeries}</span>
          </ProgressRing>
          <div>
            <p className="text-[11px] font-medium text-ink-muted">Séries</p>
            <p className="font-display text-2xl leading-none text-ink">{totalSeries}</p>
          </div>
        </Card>
      </div>

      {/* Exercise cards */}
      <div className="mt-5 space-y-3 px-5">
        {day.exercises.map((ex, i) => (
          <ExerciseCard key={ex.id} index={i + 1} exercise={ex} onEdit={() => onEditExercise(ex)} />
        ))}
      </div>

      {/* Fixed bottom button + FAB */}
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 border-t border-line glass-strong px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="relative">
          <Button full onClick={onStart}>
            <Play size={18} fill="currentColor" /> Iniciar Treino
          </Button>
          <button
            onClick={onAddExercise}
            className="absolute -top-16 right-0 grid h-14 w-14 place-items-center rounded-full bg-primary text-white shadow-glow active:scale-90 transition-transform"
          >
            <Plus size={26} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({
  index,
  exercise,
  onEdit,
}: {
  index: number;
  exercise: Exercise;
  onEdit: () => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-white">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-headline tracking-tight text-ink">{exercise.name}</p>
          <p className="mt-0.5 text-xs font-medium text-primary">{exercise.muscle}</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={onEdit}
            className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink-muted active:scale-90 transition-transform"
          >
            <Pencil size={14} />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-full border border-line text-destructive active:scale-90 transition-transform">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <p className="mt-3 pl-10 text-xs font-medium text-ink-muted">
        {exercise.totalSeries} séries totais · {exercise.workSeries} de trabalho
      </p>
    </Card>
  );
}
