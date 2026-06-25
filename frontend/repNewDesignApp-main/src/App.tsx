import { useState } from 'react';
import { ThemeProvider } from './theme';
import { BottomNav, type TabId } from './components/ui';
import { HomeScreen } from './screens/Home';
import { PlanoScreen } from './screens/Plano';
import { DetalheScreen } from './screens/Detalhe';
import { TreinoScreen } from './screens/Treino';
import { IntroScreen } from './screens/Intro';
import { ProgressoScreen } from './screens/Progresso';
import { AddExerciseModal, EditExerciseModal } from './screens/Modais';
import type { Exercise } from './data';

type View =
  | { name: 'tab'; tab: TabId }
  | { name: 'detalhe'; dayId: string }
  | { name: 'intro'; dayId: string }
  | { name: 'treino' };

type Modal = { type: 'add' } | { type: 'edit'; exercise: Exercise } | null;

function AppShell() {
  const [view, setView] = useState<View>({ name: 'tab', tab: 'home' });
  const [modal, setModal] = useState<Modal>(null);

  const navigate = (tab: TabId) => setView({ name: 'tab', tab });

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[440px] bg-bg">
      {view.name === 'tab' && view.tab === 'home' && <HomeScreen onNavigate={navigate} />}
      {view.name === 'tab' && view.tab === 'plano' && (
        <PlanoScreen onSelectDay={(id) => setView({ name: 'detalhe', dayId: id })} />
      )}
      {view.name === 'tab' && view.tab === 'treino' && <TreinoScreen onBack={() => navigate('home')} />}
      {view.name === 'tab' && view.tab === 'progresso' && <ProgressoScreen />}
      {view.name === 'detalhe' && (
        <DetalheScreen
          dayId={view.dayId}
          onBack={() => navigate('plano')}
          onStart={() => setView({ name: 'intro', dayId: view.dayId })}
          onAddExercise={() => setModal({ type: 'add' })}
          onEditExercise={(ex) => setModal({ type: 'edit', exercise: ex })}
        />
      )}
      {view.name === 'intro' && (
        <IntroScreen
          dayId={view.dayId}
          onBack={() => setView({ name: 'detalhe', dayId: view.dayId })}
          onStart={() => setView({ name: 'treino' })}
        />
      )}
      {view.name === 'treino' && <TreinoScreen onBack={() => navigate('home')} />}

      {/* Bottom nav hidden during intro and active workout */}
      {!(view.name === 'treino' || view.name === 'intro' || (view.name === 'tab' && view.tab === 'treino')) && (
        <BottomNav
          active={view.name === 'detalhe' ? 'plano' : view.name === 'tab' ? view.tab : 'home'}
          onChange={navigate}
        />
      )}

      {modal?.type === 'add' && <AddExerciseModal onClose={() => setModal(null)} />}
      {modal?.type === 'edit' && <EditExerciseModal exercise={modal.exercise} onClose={() => setModal(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
