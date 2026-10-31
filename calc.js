// Fuel cost per day, in US dollars.
export const usCost = (milesPerDay, mpg, usdPerGallon) =>
  mpg > 0 ? (milesPerDay / mpg) * usdPerGallon : 0;

export const euCost = (kmPerDay, l100km, eurPerLitre, usdPerEur) =>
  ((kmPerDay * l100km) / 100) * eurPerLitre * usdPerEur;

// Every state and country at default fuel economy, most expensive first.
export const ranking = (data, usdPerEur) =>
  [
    ...Object.entries(data.us).map(([name, s]) => ({
      name, region: 'us',
      usd: usCost(s.milesPerYear / 365, data.defaults.mpg, s.usdPerGallon),
    })),
    ...Object.entries(data.eu).map(([name, c]) => ({
      name, region: 'eu',
      usd: euCost(c.kmPerYear / 365, data.defaults.l100km, c.eurPerLitre, usdPerEur),
    })),
  ].sort((a, b) => b.usd - a.usd);
