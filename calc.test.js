import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { usCost, euCost, ranking } from './calc.js';

test('US: 50 mi at 25 mpg and $4/gal is $8', () => assert.equal(usCost(50, 25, 4), 8));
test('US: zero mpg does not divide by zero', () => assert.equal(usCost(50, 0, 4), 0));
test('EU: 100 km at 5 L/100km, €2/L, $1.10/€ is $11', () => assert.ok(Math.abs(euCost(100, 5, 2, 1.1) - 11) < 1e-9));
test('ranking covers every place, most expensive first', () => {
  const data = JSON.parse(readFileSync(new URL('./data.json', import.meta.url)));
  const r = ranking(data, data.usdPerEur);
  assert.equal(r.length, 77);
  assert.ok(r.every((x, i) => i === 0 || r[i - 1].usd >= x.usd));
});
