import { useState } from 'react';
import { Search, Plus, X, Dumbbell } from 'lucide-react';
import { Button, SegmentedControl, Stepper } from '../components/ui';
import { exerciseLibrary, filterChips, muscleGroups, type SeriesType } from '../data';
import type { Exercise } from '../data';

export function AddExerciseModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'buscar' | 'manual' | 'importar'>('buscar');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todos');

  const filtered = exerciseLibrary.filter((e) => {
    const matchQuery = e.name.toLowerCase().includes(query.toLowerCase());
    const matchFilter = filter === 'Todos' || e.muscle === filter;
    return matchQuery && matchFilter;
  });

  return (
    <Backdrop onClose={onClose}>
      <div className="absolute bottom-0 left-1/2 w-full max-w-[440px] -translate-x-1/2 rounded-t-[24px] border-t border-line bg-surface-elevated p-5 pb-[max(20px,env(safe-area-inset-bottom))] animate-sheet-up max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink-muted/30" />

        {/* Tabs */}
        <div className="flex rounded-input bg-surface p-1 border border-line">
          {(['buscar', 'manual', 'importar'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-[8px] py-2 font-label text-[12px] capitalize transition-all ${
                tab === t ? 'bg-primary text-white' : 'text-ink-muted'
              }`}
            >
              {t === 'buscar' ? 'Buscar' : t === 'manual' ? 'Manual' : 'Importar'}
            </button>
          ))}
        </div>

        {tab === 'buscar' && (
          <>
            {/* Search input */}
            <div className="mt-4 flex items-center gap-2.5 rounded-input border border-line bg-surface px-3.5 py-3">
              <Search size={18} className="text-ink-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar exercício..."
                className="flex-1 bg-transparent text-sm font-medium text-ink placeholder:text-ink-muted outline-none"
              />
            </div>

            {/* Filter chips */}
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {filterChips.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-label transition-all ${
                    filter === c ? 'bg-primary text-white' : 'border border-line text-ink-muted'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Exercise list */}
            <div className="mt-4 space-y-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-surface text-ink-muted">
                    <Dumbbell size={26} />
                  </div>
                  <p className="text-sm font-medium text-ink-muted">Nenhum exercício encontrado</p>
                </div>
              ) : (
                filtered.map((e) => (
                  <div key={e.name} className="flex items-center gap-3 rounded-input border border-line bg-surface px-3.5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-ink">{e.name}</p>
                      <p className="text-xs font-medium text-ink-muted">{e.muscle}</p>
                    </div>
                    <button className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white active:scale-90 transition-transform">
                      <Plus size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {tab === 'manual' && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-label text-ink-muted">Nome do exercício</label>
              <input
                placeholder="Ex: Supino Reto"
                className="mt-2 w-full rounded-input border border-line bg-surface px-3.5 py-3 text-sm font-medium text-ink placeholder:text-ink-muted outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-label text-ink-muted">Grupo muscular</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {muscleGroups.map((m) => (
                  <button
                    key={m}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-label text-ink-muted hover:bg-primary-soft hover:text-primary transition-colors"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <Button full className="mt-2">
              <Plus size={18} /> Adicionar exercício
            </Button>
          </div>
        )}

        {tab === 'importar' && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-surface text-ink-muted">
              <Dumbbell size={26} />
            </div>
            <p className="text-sm font-medium text-ink-muted">Importe treinos de outros atletas</p>
            <Button variant="outline">Explorar biblioteca</Button>
          </div>
        )}
      </div>
    </Backdrop>
  );
}

export function EditExerciseModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const [name, setName] = useState(exercise.name);
  const [muscle, setMuscle] = useState(exercise.muscle);
  const [seriesType, setSeriesType] = useState<SeriesType>(exercise.seriesType);
  const [reps, setReps] = useState(12);
  const [rest, setRest] = useState(60);

  return (
    <Backdrop onClose={onClose}>
      <div className="absolute bottom-0 left-1/2 w-full max-w-[440px] -translate-x-1/2 rounded-t-[24px] border-t border-line bg-surface-elevated p-5 pb-[max(20px,env(safe-area-inset-bottom))] animate-sheet-up max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink-muted/30" />

        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-headline tracking-tight text-ink">Editar</h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-muted active:scale-90 transition-transform"
          >
            <X size={18} />
          </button>
        </div>

        {/* Name input */}
        <div className="mt-4">
          <label className="text-xs font-label text-ink-muted">Nome do exercício</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-input border border-line bg-surface px-3.5 py-3 text-base font-semibold text-ink outline-none focus:border-primary"
          />
        </div>

        {/* Muscle group chips */}
        <div className="mt-4">
          <label className="text-xs font-label text-ink-muted">Grupo muscular</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {muscleGroups.map((m) => (
              <button
                key={m}
                onClick={() => setMuscle(m)}
                className={`rounded-full px-3 py-1.5 text-xs font-label transition-all ${
                  muscle === m ? 'bg-primary text-white' : 'border border-line text-ink-muted'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Séries section */}
        <div className="mt-5">
          <label className="text-xs font-label text-ink-muted">Séries</label>
          <div className="mt-2">
            <SegmentedControl
              value={seriesType}
              onChange={setSeriesType}
              options={[
                { label: 'Aquecimento', value: 'aquecimento' },
                { label: 'Adaptação', value: 'adaptacao' },
                { label: 'Trabalho', value: 'trabalho' },
              ]}
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs font-label text-ink-muted">Repetições</p>
              <Stepper value={reps} onChange={setReps} min={1} />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-label text-ink-muted">Descanso (s)</p>
              <Stepper value={rest} onChange={setRest} step={15} />
            </div>
          </div>

          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-input border border-dashed border-line py-3 font-label text-ink-muted hover:text-primary hover:border-primary transition-colors">
            <Plus size={16} /> Adicionar série
          </button>
        </div>

        {/* Bottom actions */}
        <div className="mt-6 flex gap-3">
          <Button variant="destructive" className="flex-1">
            Excluir
          </Button>
          <Button className="flex-[1.4]" onClick={onClose}>
            Salvar
          </Button>
        </div>
      </div>
    </Backdrop>
  );
}

function Backdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[20px] animate-fade-in"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="relative h-full">
        {children}
      </div>
    </div>
  );
}
