import { usCost, euCost, ranking } from './calc.js';

const $ = (id) => document.getElementById(id);
const num = (id) => Math.max(0, parseFloat($(id).value) || 0);
const usd = (v) => '$' + v.toFixed(2);
const usd0 = (v) => '$' + Math.round(v).toLocaleString('en-US');
const date = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const data = await fetch('data.json').then((r) => r.json());

for (const k in data.us) $('us-sel').add(new Option(k, k));
for (const k in data.eu) $('eu-sel').add(new Option(k, k));
$('us-sel').value = 'California';
$('eu-sel').value = 'Sweden';
$('fx').value = data.usdPerEur;
$('sources').textContent =
  `US regular gas from ${data.sources.us} for ${date(data.asOf.us)}. ` +
  `EU petrol from the ${data.sources.eu} for ${date(data.asOf.eu)}. ` +
  `Exchange rate is the ${data.sources.fx} for ${date(data.asOf.fx)}.`;

function fillUS() {
  const s = data.us[$('us-sel').value];
  $('us-dist').value = Math.round(s.milesPerYear / 365);
  $('us-eff').value = data.defaults.mpg;
  $('us-price').value = s.usdPerGallon.toFixed(2);
}
function fillEU() {
  const c = data.eu[$('eu-sel').value];
  $('eu-dist').value = Math.round(c.kmPerYear / 365);
  $('eu-eff').value = data.defaults.l100km;
  $('eu-price').value = c.eurPerLitre.toFixed(3);
}

function render() {
  const fx = num('fx') || data.usdPerEur;
  const u = usCost(num('us-dist'), num('us-eff'), num('us-price'));
  const e = euCost(num('eu-dist'), num('eu-eff'), num('eu-price'), fx);
  $('us-day').textContent = usd(u) + ' / day';
  $('us-year').textContent = usd0(u * 365) + ' a year';
  $('eu-day').textContent = usd(e) + ' / day';
  $('eu-year').textContent = '€' + (e / fx).toFixed(2) + ' a day · ' + usd0(e * 365) + ' a year';

  const us = $('us-sel').value, eu = $('eu-sel').value, d = u - e;
  $('verdict').innerHTML = Math.abs(d) < 0.005
    ? `Driving in <b>${us}</b> and <b>${eu}</b> costs the same per day.`
    : `A day of driving in <b>${d > 0 ? us : eu}</b> costs <b>${usd(Math.abs(d))}</b> more than in <b>${d > 0 ? eu : us}</b>. That is <b>${usd0(Math.abs(d) * 365)}</b> a year.`;

  const all = ranking(data, fx), max = all[0].usd;
  $('rows').innerHTML = all.map((x) =>
    `<div class="row ${x.region}${x.name === us || x.name === eu ? ' sel' : ''}"><span class="n">${x.name}</span><span class="bar" style="width:${(x.usd / max * 100).toFixed(1)}%"></span><span class="v">${usd(x.usd)}</span></div>`
  ).join('');
}

$('us-sel').onchange = () => { fillUS(); render(); };
$('eu-sel').onchange = () => { fillEU(); render(); };
document.querySelectorAll('input').forEach((i) => i.addEventListener('input', render));
$('reset').onclick = () => { $('fx').value = data.usdPerEur; fillUS(); fillEU(); render(); };
fillUS(); fillEU(); render();
