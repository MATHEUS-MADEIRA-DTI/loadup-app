import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Home, ClipboardList, Dumbbell, BarChart3, type LucideIcon } from 'lucide-react';

export function Card({
  children,
  className = '',
  glass = true,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`${glass ? 'glass' : 'bg-surface-elevated'} border border-line rounded-card shadow-card ${
        onClick ? 'active:scale-[0.98] transition-transform' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Tag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-label text-primary ${className}`}
    >
      {children}
    </span>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'destructive';
  size?: 'md' | 'lg';
  full?: boolean;
};

export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  full = false,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-label transition-all active:scale-[0.97] disabled:opacity-50';
  const sizes = { md: 'px-4 py-2.5 text-[13px]', lg: 'px-5 py-3.5 text-[15px]' };
  const variants = {
    primary: 'bg-primary text-white shadow-glow hover:brightness-110',
    outline: 'border border-line text-ink bg-transparent hover:bg-surface-elevated',
    ghost: 'text-ink-muted hover:text-ink',
    destructive: 'border border-destructive/40 text-destructive bg-transparent hover:bg-destructive/10',
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
}) {
  return (
    <div className="flex rounded-input bg-surface p-1 border border-line">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-[8px] font-label transition-all ${
              size === 'sm' ? 'py-1.5 text-[11px]' : 'py-2.5 text-[12px]'
            } ${active ? 'bg-primary text-white shadow-glow' : 'text-ink-muted hover:text-ink'}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-input border border-line bg-surface px-3 py-2.5">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated text-ink-muted active:scale-90 transition-transform"
      >
        −
      </button>
      <span className="font-display text-2xl leading-none text-ink">
        {value}
        {suffix && <span className="ml-1 text-xs font-label text-ink-muted">{suffix}</span>}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white active:scale-90 transition-transform"
      >
        +
      </button>
    </div>
  );
}

export function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--c-border) / 0.12)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(var(--c-primary))"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export type TabId = 'home' | 'plano' | 'treino' | 'progresso';

const NAV_ITEMS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'plano', label: 'Plano', icon: ClipboardList },
  { id: 'treino', label: 'Treino', icon: Dumbbell },
  { id: 'progresso', label: 'Progresso', icon: BarChart3 },
];

export function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 border-t border-line glass-strong px-2 pb-[max(12px,env(safe-area-inset-bottom))] pt-2">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active;
          const isCenter = item.id === 'treino';
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="group flex flex-1 flex-col items-center gap-1 py-1"
            >
              <div
                className={`grid place-items-center rounded-full transition-all ${
                  isCenter
                    ? `h-11 w-11 ${isActive ? 'bg-primary text-white shadow-glow' : 'bg-surface-elevated text-ink-muted'} -mt-3`
                    : `h-7 w-7 ${isActive ? 'text-primary' : 'text-ink-muted'}`
                }`}
              >
                <Icon size={isCenter ? 22 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={`text-[10px] font-label ${
                  isActive ? 'text-primary' : 'text-ink-muted'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function ScreenHeader({ children }: { children: ReactNode }) {
  return <div className="px-5 pt-3">{children}</div>;
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-5">
      <h2 className="text-[17px] font-semibold tracking-tight text-ink">{title}</h2>
      {action && (
        <button onClick={onAction} className="text-[13px] font-condensed text-primary">
          {action}
        </button>
      )}
    </div>
  );
}
