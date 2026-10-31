# Daily Fuel Cost Calculator

Compare what a day of driving costs in fuel in any US state vs any EU country.

No framework, no build step: plain HTML, CSS and ES modules.

| File | What it is |
|---|---|
| `index.html` | Page markup |
| `style.css` | Styles (light and dark) |
| `app.js` | UI: loads `data.json`, wires the form, draws the ranking |
| `calc.js` | Cost math, shared by the app and the tests |
| `data.json` | Prices, exchange rate, distances, and their dates and sources |

```bash
npm start   # http://localhost:8000 (needs a server; file:// can't load modules)
npm test    # checks the cost math and data.json
```

To update prices, edit `data.json`. Sources: AAA state averages (US), EU Weekly Oil Bulletin (EU), ECB reference rate (USD per EUR). Distances are rough estimates.
