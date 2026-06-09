import { AppHeader } from '@/components/AppHeader';
import { UavOptimizationPanel } from '@/components/UavOptimizationPanel';
import { UavSimulationModule } from '@/components/UavSimulationModule';
import { pythrustModules } from '@/data/platform';

export default function UavPage() {
  return (
    <main className="app-shell">
      <AppHeader />

      <section className="module-page-header">
        <div>
          <p className="eyebrow">Módulo UAV / PyThrust</p>
          <h2>Propulsão elétrica e missão UAV</h2>
          <p>
            Ambiente dedicado para estimar autonomia, potência, corrente,
            margem de empuxo e combinações viáveis de motor e hélice.
          </p>
        </div>
        <aside className="run-state">
          <span>estado do módulo</span>
          <strong>triagem ativa</strong>
          <small>Solver aproximado no browser · PyThrust como próximo acoplamento</small>
        </aside>
      </section>

      <UavSimulationModule />

      <UavOptimizationPanel modules={pythrustModules} />

      <footer className="footer">
        Autor:{' '}
        <a href="https://github.com/FelipeLelis/aar" target="_blank" rel="noreferrer">
          Felipe Lelis
        </a>
        . Módulo UAV derivado de{' '}
        <a href="https://github.com/Setuav/PyThrust" target="_blank" rel="noreferrer">
          Setuav/PyThrust
        </a>
        .
      </footer>
    </main>
  );
}
