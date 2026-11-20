# ltc-web

LTC — Language Training Center public site for **language.osmartbd.com**.

React + Vite SPA talking to O-SMART Laravel API (`/api/v1/ltc/*`).

## Develop

```bash
npm install
npm run dev
```

## Production

```bash
npm install
npm run build
```

`app.js` is **zero-dependency** (Node `http` only — no Express). Plesk/Passenger can start it without `node_modules` as long as `dist/index.html` exists.

Application startup file: `app.js`  
Document root / static: build into `dist/` first, then restart the Node app.
