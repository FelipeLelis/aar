export type AarAircraftInput = {
  id: string;
  initialFuelKg: number;
  targetFuelKg: number;
  burnKgPerMin: number;
  bingoFuelKg: number;
};

export type AarSimulationInput = {
  podFuelKg: number;
  wingFuelKg: number;
  wingCapacityKg: number;
  podToWingKgPerMin: number;
  wingToAircraftKgPerMin: number;
  dtMin: number;
  maxTimeMin: number;
  aircraft: AarAircraftInput[];
};

export type AarEventType = 'start' | 'transfer' | 'pause' | 'complete' | 'bingo' | 'done' | 'timeout';

export type AarEvent = {
  timeMin: number;
  type: AarEventType;
  aircraftId?: string;
  message: string;
};

export type AarSimulationResult = {
  success: boolean;
  totalTimeMin: number;
  supportedAircraft: number;
  remainingPodFuelKg: number;
  remainingWingFuelKg: number;
  events: AarEvent[];
};

type AircraftState = AarAircraftInput & {
  fuelKg: number;
  done: boolean;
  bingo: boolean;
};

export function simulateAar(input: AarSimulationInput): AarSimulationResult {
  const aircraft: AircraftState[] = input.aircraft.map((item) => ({
    ...item,
    fuelKg: item.initialFuelKg,
    done: item.initialFuelKg >= item.targetFuelKg,
    bingo: false,
  }));
  const events: AarEvent[] = [];
  let podFuelKg = input.podFuelKg;
  let wingFuelKg = Math.min(input.wingFuelKg, input.wingCapacityKg);
  let activeIndex = aircraft.findIndex((item) => !item.done);
  let timeMin = 0;

  if (activeIndex >= 0) {
    events.push({
      timeMin,
      type: 'start',
      aircraftId: aircraft[activeIndex].id,
      message: `${aircraft[activeIndex].id} iniciou atendimento.`,
    });
  }

  while (timeMin < input.maxTimeMin && aircraft.some((item) => !item.done && !item.bingo)) {
    const refill = Math.min(input.podToWingKgPerMin * input.dtMin, podFuelKg, input.wingCapacityKg - wingFuelKg);
    podFuelKg -= refill;
    wingFuelKg += refill;

    const active = activeIndex >= 0 ? aircraft[activeIndex] : undefined;
    const canTransfer = Boolean(active && !active.done && wingFuelKg > 0);
    const transferNeed = active ? Math.max(0, active.targetFuelKg - active.fuelKg) : 0;
    const transfer = canTransfer ? Math.min(input.wingToAircraftKgPerMin * input.dtMin, wingFuelKg, transferNeed) : 0;

    if (active && transfer <= 0 && transferNeed > 0) {
      events.push({
        timeMin,
        type: 'pause',
        aircraftId: active.id,
        message: `${active.id} aguardou recuperação do tanque de asa.`,
      });
    }

    if (active && transfer > 0) {
      active.fuelKg += transfer;
      wingFuelKg -= transfer;
      events.push({
        timeMin,
        type: 'transfer',
        aircraftId: active.id,
        message: `${active.id} recebeu ${transfer.toFixed(1)} kg.`,
      });
    }

    aircraft.forEach((item, index) => {
      if (item.done || item.bingo) return;
      if (index !== activeIndex || transfer <= 0) {
        item.fuelKg -= item.burnKgPerMin * input.dtMin;
      }
      if (item.fuelKg <= item.bingoFuelKg) {
        item.bingo = true;
        events.push({
          timeMin: timeMin + input.dtMin,
          type: 'bingo',
          aircraftId: item.id,
          message: `${item.id} cruzou bingo fuel.`,
        });
      }
    });

    if (active && !active.done && active.fuelKg >= active.targetFuelKg) {
      active.done = true;
      events.push({
        timeMin: timeMin + input.dtMin,
        type: 'complete',
        aircraftId: active.id,
        message: `${active.id} atingiu combustível alvo.`,
      });
      activeIndex = aircraft.findIndex((item) => !item.done && !item.bingo);
      if (activeIndex >= 0) {
        events.push({
          timeMin: timeMin + input.dtMin,
          type: 'start',
          aircraftId: aircraft[activeIndex].id,
          message: `${aircraft[activeIndex].id} iniciou atendimento.`,
        });
      }
    }

    timeMin += input.dtMin;
  }

  const success = aircraft.every((item) => item.done);
  const failedByBingo = aircraft.some((item) => item.bingo);
  events.push({
    timeMin,
    type: success ? 'done' : 'timeout',
    message: success
      ? 'Operação AAR concluída.'
      : failedByBingo
        ? 'Operação AAR interrompida por bingo fuel.'
        : 'Operação AAR interrompida por limite de tempo.',
  });

  return {
    success,
    totalTimeMin: timeMin,
    supportedAircraft: aircraft.filter((item) => item.done).length,
    remainingPodFuelKg: podFuelKg,
    remainingWingFuelKg: wingFuelKg,
    events,
  };
}
