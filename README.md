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
npm run build
npm start
```

Serves `dist/` on `PORT` (default `4176`). Point the `language.osmartbd.com` vhost / reverse proxy at this process.
