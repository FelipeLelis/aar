import assert from 'node:assert/strict';

function simulateAar(input) {
  const aircraft = input.aircraft.map((item) => ({
    ...item,
    fuelKg: item.initialFuelKg,
    done: item.initialFuelKg >= item.targetFuelKg,
    bingo: false,
  }));
  let podFuelKg = input.podFuelKg;
  let wingFuelKg = Math.min(input.wingFuelKg, input.wingCapacityKg);
  let activeIndex = aircraft.findIndex((item) => !item.done);
  let timeMin = 0;
  const events = [];

  while (timeMin < input.maxTimeMin && aircraft.some((item) => !item.done && !item.bingo)) {
    const refill = Math.min(input.podToWingKgPerMin * input.dtMin, podFuelKg, input.wingCapacityKg - wingFuelKg);
    podFuelKg -= refill;
    wingFuelKg += refill;

    const active = activeIndex >= 0 ? aircraft[activeIndex] : undefined;
    const transferNeed = active ? Math.max(0, active.targetFuelKg - active.fuelKg) : 0;
    const transfer = active && wingFuelKg > 0 ? Math.min(input.wingToAircraftKgPerMin * input.dtMin, wingFuelKg, transferNeed) : 0;

    if (transfer > 0) {
      active.fuelKg += transfer;
      wingFuelKg -= transfer;
    }

    aircraft.forEach((item, index) => {
      if (item.done || item.bingo) return;
      if (index !== activeIndex || transfer <= 0) {
        item.fuelKg -= item.burnKgPerMin * input.dtMin;
      }
      if (item.fuelKg <= item.bingoFuelKg) {
        item.bingo = true;
        events.push({ type: 'bingo', aircraftId: item.id });
      }
    });

    if (active && !active.done && active.fuelKg >= active.targetFuelKg) {
      active.done = true;
      activeIndex = aircraft.findIndex((item) => !item.done && !item.bingo);
    }

    timeMin += input.dtMin;
  }

  return {
    success: aircraft.every((item) => item.done),
    supportedAircraft: aircraft.filter((item) => item.done).length,
    events,
  };
}

const nominalAar = simulateAar({
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
  ],
});

assert.equal(nominalAar.success, true);
assert.equal(nominalAar.supportedAircraft, 2);

const bingoAar = simulateAar({
  podFuelKg: 0,
  wingFuelKg: 0,
  wingCapacityKg: 100,
  podToWingKgPerMin: 0,
  wingToAircraftKgPerMin: 200,
  dtMin: 1,
  maxTimeMin: 10,
  aircraft: [
    { id: 'A1', initialFuelKg: 650, targetFuelKg: 1200, burnKgPerMin: 40, bingoFuelKg: 620 },
  ],
});

assert.equal(bingoAar.success, false);
assert.equal(bingoAar.events.some((event) => event.type === 'bingo'), true);

console.log('Domain smoke tests passed.');
