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

Build is `vite build` only (no global `tsc`). Vite + TypeScript are in `dependencies` so Plesk production installs still work.

`app.js` is **zero-dependency** (Node `http` only). Passenger can start it after `dist/index.html` exists.

Application startup file: `app.js`  
Document root / static: build into `dist/` first, then restart the Node app.
