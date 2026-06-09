'use client';

import { useMemo, useState } from 'react';
import { motorCatalog, propellerCatalog } from '@/data/uavCatalog';
import { evaluateUav, type UavResult, type UavSolverInput } from '@/domain/uavSolver';

const initialInput: UavSolverInput = {
  massKg: 2.4,
  rotorCount: 4,
  batteryWh: 92,
  reservePct: 20,
  thrustMarginPct: 35,
  cruisePowerFactor: 0.72,
};

type UavChartsProps = {
  results: UavResult[];
};

type UavSceneProps = {
  input: UavSolverInput;
  best?: UavResult;
};

function UavRankingCharts({ results }: UavChartsProps) {
  const chartResults = results.slice(0, 5);
  const maxEndurance = Math.max(...chartResults.map((result) => result.enduranceMin), 1);
  const maxPower = Math.max(...chartResults.map((result) => result.totalPowerW), 1);
  const width = 520;
  const rowHeight = 34;
  const chartHeight = chartResults.length * rowHeight + 28;

  return (
    <div className="uav-visual-card">
      <div className="uav-visual-head">
        <div>
          <span>gráficos</span>
          <h3>Ranking por autonomia e potência</h3>
        </div>
        <strong>{chartResults.filter((result) => result.feasible).length}/{chartResults.length} viáveis</strong>
      </div>
      <svg className="uav-chart" viewBox={`0 0 ${width} ${chartHeight}`} role="img" aria-label="Ranking UAV por autonomia e potência">
        {chartResults.map((result, index) => {
          const y = 20 + index * rowHeight;
          const enduranceWidth = (result.enduranceMin / maxEndurance) * 190;
          const powerWidth = (result.totalPowerW / maxPower) * 150;

          return (
            <g key={result.key}>
              <text x="0" y={y + 10} className="uav-chart-label">
                {index + 1}. {result.propeller}
              </text>
              <rect x="180" y={y} width="190" height="10" rx="5" className="uav-chart-track" />
              <rect x="180" y={y} width={enduranceWidth} height="10" rx="5" className="uav-chart-endurance" />
              <text x="378" y={y + 10} className="uav-chart-value">
                {result.enduranceMin.toFixed(1)} min
              </text>
              <rect x="180" y={y + 15} width="150" height="8" rx="4" className="uav-chart-track" />
              <rect x="180" y={y + 15} width={powerWidth} height="8" rx="4" className="uav-chart-power" />
              <text x="338" y={y + 23} className="uav-chart-value muted">
                {result.totalPowerW.toFixed(0)} W
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Uav3DScene({ input, best }: UavSceneProps) {
  const rotorSlots = Array.from({ length: input.rotorCount }, (_, index) => index);
  const throttle = Math.min(Math.max(best?.throttlePct ?? 0, 0), 100);
  const battery = Math.max(0, 100 - input.reservePct);
  const sceneState = best?.feasible ? 'uav-state-ok' : 'uav-state-alert';

  return (
    <div className={`uav-visual-card uav-3d-card ${sceneState}`}>
      <div className="uav-visual-head">
        <div>
          <span>3D</span>
          <h3>Estado físico do UAV</h3>
        </div>
        <strong>{throttle.toFixed(0)}% throttle</strong>
      </div>

      <div className="uav-scene" aria-label="Cena 3D do UAV">
        <div className="uav-ground" />
        <div className="uav-frame-3d">
          <div className="uav-body-3d">
            <span />
          </div>
          {rotorSlots.map((slot) => {
            const angle = (360 / input.rotorCount) * slot;
            return (
              <div className="uav-arm-3d" key={slot} style={{ transform: `rotateZ(${angle}deg)` }}>
                <div className="uav-rotor-3d">
                  <span />
                </div>
              </div>
            );
          })}
        </div>
        <div className="uav-thrust-column" style={{ height: `${42 + throttle * 0.55}%` }} />
      </div>

      <div className="uav-scene-metrics">
        <div>
          <span>Bateria útil</span>
          <strong>{battery.toFixed(0)}%</strong>
        </div>
        <div>
          <span>Margem</span>
          <strong>{best?.marginPct.toFixed(0)}%</strong>
        </div>
        <div>
          <span>Rotores</span>
          <strong>{input.rotorCount}</strong>
        </div>
      </div>
    </div>
  );
}

export function UavSimulationModule() {
  const [input, setInput] = useState(initialInput);
  const updateInput = (key: keyof UavSolverInput, value: number) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const results = useMemo(
    () => evaluateUav(input, motorCatalog, propellerCatalog),
    [input],
  );
  const best = results.find((result) => result.feasible) ?? results[0];
  const visibleResults = results.slice(0, 6);

  return (
    <section className="simulation-module uav-module" id="uav">
      <div className="module-strip">
        <div>
          <span className="module-kicker">Módulo UAV / PyThrust</span>
          <h2>Otimização preliminar de propulsão elétrica</h2>
        </div>
        <div className="module-status">
          <span>catálogo reduzido · solver aproximado no browser</span>
          <strong>{best?.feasible ? 'combinação viável' : 'sem solução viável'}</strong>
        </div>
      </div>

      <div className="uav-console">
        <form className="uav-form">
          <label>
            Massa total do UAV (kg)
            <input type="number" min="0.2" step="0.1" value={input.massKg} onChange={(event) => updateInput('massKg', Number(event.target.value))} />
          </label>
          <label>
            Número de rotores
            <select value={input.rotorCount} onChange={(event) => updateInput('rotorCount', Number(event.target.value))}>
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
            </select>
          </label>
          <label>
            Bateria útil nominal (Wh)
            <input type="number" min="10" step="5" value={input.batteryWh} onChange={(event) => updateInput('batteryWh', Number(event.target.value))} />
          </label>
          <label>
            Reserva de bateria (%)
            <input type="number" min="0" max="70" step="5" value={input.reservePct} onChange={(event) => updateInput('reservePct', Number(event.target.value))} />
          </label>
          <label>
            Margem de empuxo (%)
            <input type="number" min="0" max="150" step="5" value={input.thrustMarginPct} onChange={(event) => updateInput('thrustMarginPct', Number(event.target.value))} />
          </label>
          <label>
            Fator de potência em missão
            <input type="number" min="0.4" max="1.4" step="0.02" value={input.cruisePowerFactor} onChange={(event) => updateInput('cruisePowerFactor', Number(event.target.value))} />
          </label>
        </form>

        <div className="uav-summary">
          <span>melhor combinação</span>
          <strong>{best?.motor}</strong>
          <p>{best?.propeller}</p>
          <dl>
            <div>
              <dt>Autonomia</dt>
              <dd>{best?.enduranceMin.toFixed(1)} min</dd>
            </div>
            <div>
              <dt>Potência total</dt>
              <dd>{best?.totalPowerW.toFixed(0)} W</dd>
            </div>
            <div>
              <dt>Corrente/motor</dt>
              <dd>{best?.currentA.toFixed(1)} A</dd>
            </div>
            <div>
              <dt>Throttle</dt>
              <dd>{best?.throttlePct.toFixed(0)}%</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="uav-visual-grid">
        <UavRankingCharts results={visibleResults} />
        <Uav3DScene input={input} best={best} />
      </div>

      <div className="uav-results">
        <div className="uav-results-head">
          <span>ranking</span>
          <span>motor</span>
          <span>hélice</span>
          <span>autonomia</span>
          <span>margem</span>
          <span>estado</span>
        </div>
        {visibleResults.map((result, index) => (
          <div className="uav-result-row" key={result.key}>
            <span>{index + 1}</span>
            <span>{result.motor}</span>
            <span>{result.propeller}</span>
            <span>{result.enduranceMin.toFixed(1)} min</span>
            <span>{result.marginPct.toFixed(0)}%</span>
            <span className={result.feasible ? 'state-ok' : 'state-bad'}>{result.reason}</span>
          </div>
        ))}
      </div>

      <p className="module-note">
        Esta versão usa uma aproximação física para triagem rápida. A próxima etapa é trocar o avaliador por uma ponte Python que execute o solver PyThrust/OpenMDAO completo.
      </p>
    </section>
  );
}
