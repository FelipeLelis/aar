import { buildSampleMissionSummary } from '@/data/sampleMission';

const stateLabels = {
  ready: 'pronto',
  partial: 'parcial',
  failed: 'atenção',
};

const constraintLabels = {
  ok: 'ok',
  warning: 'atenção',
  failed: 'falha',
};

export function CombinedMissionPanel() {
  const summary = buildSampleMissionSummary();

  return (
    <section className="console-section">
      <div className="console-block-head">
        <div>
          <p className="eyebrow">Missão combinada</p>
          <h3>AAR e UAV sob a mesma ontologia</h3>
        </div>
        <p>
          Leitura amostral dos novos módulos de domínio: energia, restrições e
          recomendações em uma visão única.
        </p>
      </div>

      <div className="combined-panel">
        <div className="combined-status">
          <span>estado da amostra</span>
          <strong>{stateLabels[summary.state]}</strong>
          <p>
            {summary.recommendations.length > 0
              ? summary.recommendations.join(' ')
              : 'Nenhuma recomendação crítica para o cenário amostral.'}
          </p>
        </div>

        <div className="combined-grid">
          {summary.ontologies.map((ontology) => (
            <article className="combined-card" key={ontology.domain}>
              <span>{ontology.domain}</span>
              <h3>{ontology.vehicle}</h3>
              <p>
                Energia: {ontology.energy.initial.toFixed(1)} {ontology.energy.unit} · reserva{' '}
                {ontology.energy.reserve.toFixed(1)} {ontology.energy.unit}
              </p>
              <div className="constraint-list">
                {ontology.constraints.map((constraintItem) => (
                  <div className="constraint-row" key={constraintItem.key}>
                    <span>{constraintItem.label}</span>
                    <strong className={`constraint-${constraintItem.state}`}>
                      {constraintLabels[constraintItem.state]}
                    </strong>
                  </div>
                ))}
              </div>
              <small>{ontology.notes[0]}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
