import { motorCatalog, propellerCatalog } from '@/data/uavCatalog';
import { simulateAar, type AarSimulationInput } from '@/domain/aarEngine';
import { summarizeCombinedMission } from '@/domain/combinedMission';
import { evaluateUav, type UavSolverInput } from '@/domain/uavSolver';

export const sampleAarInput: AarSimulationInput = {
  podFuelKg: 4200,
  wingFuelKg: 650,
  wingCapacityKg: 900,
  podToWingKgPerMin: 70,
  wingToAircraftKgPerMin: 110,
  dtMin: 0.5,
  maxTimeMin: 90,
  aircraft: [
    { id: 'A1', initialFuelKg: 900, targetFuelKg: 1500, burnKgPerMin: 8, bingoFuelKg: 620 },
    { id: 'A2', initialFuelKg: 880, targetFuelKg: 1500, burnKgPerMin: 8, bingoFuelKg: 620 },
    { id: 'A3', initialFuelKg: 860, targetFuelKg: 1500, burnKgPerMin: 8, bingoFuelKg: 620 },
  ],
};

export const sampleUavInput: UavSolverInput = {
  massKg: 2.4,
  rotorCount: 4,
  batteryWh: 92,
  reservePct: 20,
  thrustMarginPct: 35,
  cruisePowerFactor: 0.72,
};

export function buildSampleMissionSummary() {
  const aar = simulateAar(sampleAarInput);
  const uavResults = evaluateUav(sampleUavInput, motorCatalog, propellerCatalog);
  const best = uavResults.find((result) => result.feasible) ?? uavResults[0];

  return summarizeCombinedMission({
    aar,
    uav: {
      input: sampleUavInput,
      best,
    },
  });
}
