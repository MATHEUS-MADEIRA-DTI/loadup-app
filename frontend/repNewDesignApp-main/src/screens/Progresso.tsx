import { useState } from 'react';
import { Check, Pencil, Moon, Sun, ChevronDown } from 'lucide-react';
import { Card, Button, SegmentedControl, Stepper } from '../components/ui';
import { useTheme, THEMES, type ThemeId } from '../theme';
import { weeklyVolume, personalRecords, recentSessions, user } from '../data';

type Tab = 'progresso' | 'config';

export function ProgressoScreen() {
  const [tab, setTab] = useState<Tab>('progresso');

  return (
    <div className="pb-28">
      {/* Tab bar */}
      <div className="px-5 pt-4">
        <div className="flex rounded-input bg-surface p-1 border border-line">
          {(['progresso', 'config'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-[8px] py-2.5 font-label text-[13px] transition-all ${
                tab === t ? 'bg-primary text-white shadow-glow' : 'text-ink-muted'
              }`}
            >
              {t === 'progresso' ? 'Progresso' : 'Configurações'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'progresso' ? <ProgressoTab /> : <ConfigTab />}
    </div>
  );
}

function ProgressoTab() {
  const maxVol = Math.max(...weeklyVolume.map((v) => v.value));
  return (
    <>
      {/* Weekly volume chart */}
      <div className="px-5 pt-5">
        <h2 className="text-[17px] font-semibold tracking-tight text-ink">Volume Semanal</h2>
        <Card className="mt-3 p-4">
          <div className="flex h-40 items-end justify-between gap-2">
            {weeklyVolume.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      v.value === 0 ? 'bg-ink-muted/15' : 'bg-primary'
                    }`}
                    style={{ height: `${v.value === 0 ? 4 : (v.value / maxVol) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-label text-ink-muted">{v.day}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Personal records */}
      <div className="px-5 pt-6">
        <h2 className="text-[17px] font-semibold tracking-tight text-ink">Recordes Pessoais</h2>
        <div className="mt-3 space-y-2.5">
          {personalRecords.map((pr) => (
            <Card key={pr.exercise} className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-[15px] font-condensed text-ink">{pr.exercise}</p>
                <p className="text-xs font-medium text-primary">{pr.delta}</p>
              </div>
              <span className="font-display text-2xl leading-none text-ink">{pr.value}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent sessions history */}
      <div className="px-5 pt-6">
        <h2 className="text-[17px] font-semibold tracking-tight text-ink">Histórico</h2>
        <div className="mt-3 space-y-2.5">
          {recentSessions.map((s) => (
            <Card key={s.id} className="flex items-center gap-3 p-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-condensed text-ink">{s.dayName}</p>
                <p className="text-xs font-medium text-ink-muted">{s.muscles.join(' · ')}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-label ${
                    s.status === 'concluido' ? 'bg-primary-soft text-primary' : 'bg-surface text-ink-muted'
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
    </>
  );
}

function ConfigTab() {
  const { theme, mode, setTheme, setMode } = useTheme();
  const [name, setName] = useState(user.name);
  const [editingName, setEditingName] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [lang, setLang] = useState('Português');
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="px-5 pt-5 space-y-7">
      {/* Perfil */}
      <section>
        <SectionLabel>Perfil</SectionLabel>
        <Card className="mt-3 p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-lg font-semibold text-white shadow-glow">
                {user.initials}
              </div>
              <button className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-surface-elevated border border-line text-ink-muted">
                <Pencil size={11} />
              </button>
            </div>
            <div className="flex-1">
              {editingName ? (
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
                  className="w-full rounded-input border border-line bg-surface px-3 py-1.5 text-base font-semibold text-ink outline-none focus:border-primary"
                />
              ) : (
                <button onClick={() => setEditingName(true)} className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-ink">{name}</span>
                  <Pencil size={13} className="text-ink-muted" />
                </button>
              )}
              <p className="mt-0.5 text-sm text-ink-muted">{user.email}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Aparência */}
      <section>
        <SectionLabel>Aparência</SectionLabel>
        <Card className="mt-3 p-4">
          <p className="text-[15px] font-semibold text-ink">Tema de Cor</p>
          <div className="mt-3 flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {THEMES.map((t) => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as ThemeId)}
                  className="flex shrink-0 flex-col items-center gap-2"
                >
                  <div className="relative">
                    <div
                      className="h-10 w-10 rounded-full transition-transform active:scale-90"
                      style={{ background: t.primary, boxShadow: active ? `0 0 0 2px ${t.primary}, 0 0 0 4px rgb(var(--c-bg))` : 'none' }}
                    />
                    {active && (
                      <div className="absolute inset-0 grid place-items-center">
                        <Check size={16} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-label ${active ? 'text-ink' : 'text-ink-muted'}`}>{t.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-[15px] font-semibold text-ink">Aparência</span>
            <div className="flex rounded-input bg-surface p-1 border border-line">
              <button
                onClick={() => setMode('dark')}
                className={`flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-label transition-all ${
                  mode === 'dark' ? 'bg-primary text-white' : 'text-ink-muted'
                }`}
              >
                <Moon size={13} /> Dark
              </button>
              <button
                onClick={() => setMode('light')}
                className={`flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-label transition-all ${
                  mode === 'light' ? 'bg-primary text-white' : 'text-ink-muted'
                }`}
              >
                <Sun size={13} /> Light
              </button>
            </div>
          </div>
        </Card>
      </section>

      {/* Preferências */}
      <section>
        <SectionLabel>Preferências</SectionLabel>
        <Card className="mt-3 divide-y divide-line">
          <div className="flex items-center justify-between p-4">
            <span className="text-[15px] font-semibold text-ink">Tempo de descanso padrão</span>
            <div className="w-36">
              <Stepper value={restTime} onChange={setRestTime} step={15} suffix="s" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="text-[15px] font-semibold text-ink">Unidade de peso</span>
            <div className="w-32">
              <SegmentedControl
                size="sm"
                value={unit}
                onChange={setUnit}
                options={[
                  { label: 'kg', value: 'kg' },
                  { label: 'lb', value: 'lb' },
                ]}
              />
            </div>
          </div>
          <div className="relative flex items-center justify-between p-4">
            <span className="text-[15px] font-semibold text-ink">Idioma</span>
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-2 rounded-input border border-line bg-surface px-3 py-2 text-sm font-medium text-ink"
            >
              {lang}
              <ChevronDown size={14} className="text-ink-muted" />
            </button>
            {langOpen && (
              <div className="absolute right-4 top-full z-20 mt-1 w-40 overflow-hidden rounded-input border border-line bg-surface-elevated shadow-card">
                {['Português', 'English', 'Español'].map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium ${
                      l === lang ? 'text-primary' : 'text-ink'
                    } hover:bg-surface`}
                  >
                    {l}
                    {l === lang && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Conta */}
      <section>
        <SectionLabel>Conta</SectionLabel>
        <Button variant="destructive" full className="mt-3">
          Sair
        </Button>
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1 text-xs font-label text-ink-muted">{children}</p>
  );
}
