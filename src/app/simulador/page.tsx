import { AarNativePanel } from '@/components/AarNativePanel';
import { AarSimulationModule } from '@/components/AarSimulationModule';
import { AppHeader } from '@/components/AppHeader';

export default function SimulatorPage() {
  return (
    <main className="app-shell">
      <AppHeader />

      <section className="module-page-header">
        <div>
          <p className="eyebrow">Módulo AAR</p>
          <h2>Reabastecimento aéreo em ciranda</h2>
          <p>
            Ambiente dedicado para avaliar fluxos pod-asa-aeronave, espera em
            fila, pausas operacionais, bingo fuel e capacidade de atendimento.
          </p>
        </div>
        <aside className="run-state">
          <span>estado do módulo</span>
          <strong>migração gradual</strong>
          <small>Painel nativo conectado ao motor TypeScript · legado preservado abaixo</small>
        </aside>
      </section>

      <AarNativePanel />
      <AarSimulationModule compact />

      <footer className="footer">
        Autor:{' '}
        <a href="https://github.com/FelipeLelis/aar" target="_blank" rel="noreferrer">
          Felipe Lelis
        </a>
        . Projeto derivado de{' '}
        <a href="https://github.com/YgorLog/sim-aar" target="_blank" rel="noreferrer">
          YgorLog/sim-aar
        </a>{' '}
        e{' '}
        <a href="https://github.com/Setuav/PyThrust" target="_blank" rel="noreferrer">
          Setuav/PyThrust
        </a>
        .
      </footer>
    </main>
  );
}
