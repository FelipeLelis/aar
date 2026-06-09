import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';
import { CombinedMissionPanel } from '@/components/CombinedMissionPanel';
import { IntegrationMap } from '@/components/IntegrationMap';
import { MetricCard } from '@/components/MetricCard';
import { aarCapabilities, integrationMap, roadmap } from '@/data/platform';

const modules = [
  {
    title: 'Módulo AAR',
    href: '/simulador/',
    state: 'operacional',
    text: 'Reabastecimento em ciranda, fila, pausas por fluxo e cruzamento de bingo fuel.',
  },
  {
    title: 'Módulo UAV / PyThrust',
    href: '/uav/',
    state: 'triagem ativa',
    text: 'Combinações de motor, hélice, bateria e margens de missão para UAVs.',
  },
];

export default function Home() {
  return (
    <main className="app-shell">
      <AppHeader />

      <section className="console-board">
        <div className="console-header">
          <div>
            <p className="eyebrow">Console de simulação</p>
            <h2>AAR + UAV</h2>
            <p>
              Painel central para acessar os módulos de reabastecimento aéreo,
              propulsão UAV e evolução da ontologia de missão.
            </p>
          </div>
          <aside className="run-state">
            <span>estado do sistema</span>
            <strong>modularizado</strong>
            <small>AAR e UAV separados em rotas próprias</small>
          </aside>
        </div>

        <div className="console-metrics">
          {aarCapabilities.map((capability) => (
            <MetricCard
              key={capability.label}
              label={capability.label}
              value={capability.value}
              detail={capability.detail}
            />
          ))}
        </div>

        <div className="console-block">
          <div className="console-block-head">
            <div>
              <p className="eyebrow">Módulos</p>
              <h3>Ambientes de estudo</h3>
            </div>
            <p>Cada módulo concentra seus controles, resultados e hipóteses.</p>
          </div>
          <div className="module-picker">
            {modules.map((module) => (
              <Link className="module-card" href={module.href} key={module.title}>
                <span>{module.state}</span>
                <h3>{module.title}</h3>
                <p>{module.text}</p>
                <strong>Abrir módulo</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CombinedMissionPanel />

      <section className="console-details" id="modelo">
        <article className="panel">
          <h3>Ontologia de missão</h3>
          <p>
            O mesmo vocabulário cobre combustível, bateria, fila, carga,
            empuxo, catálogo e margem operacional.
          </p>
          <div className="panel-spacer">
            <IntegrationMap rows={integrationMap} />
          </div>
        </article>
        <article className="panel">
          <h3>Próximas extrações técnicas</h3>
          <div className="scope-list compact">
            {roadmap.map((item) => (
              <span key={item.title}>
                <strong>{item.title}</strong>
                {item.text}
              </span>
            ))}
          </div>
        </article>
      </section>

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
