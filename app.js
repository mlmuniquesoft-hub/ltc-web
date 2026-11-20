/* ZERO-DEP — serves dist/public. Works with PhusionPassenger (Plesk). */
/* global PhusionPassenger */
import http from 'http'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream'
import { fileURLToPath } from 'url'

if (typeof PhusionPassenger !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false })
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const candidates = [
  path.join(__dirname, 'dist'),
  path.join(__dirname, 'public'),
]
const publicDir =
  candidates.find((d) => fs.existsSync(path.join(d, 'index.html'))) || candidates[0]
const port = Number(process.env.PORT || 4176)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
  '.webmanifest': 'application/manifest+json',
}

function safeJoin(root, reqPath) {
  const decoded = decodeURIComponent((reqPath || '/').split('?')[0])
  const cleaned = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '')
  const full = path.join(root, cleaned)
  if (!full.startsWith(root)) return null
  return full
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  })
  pipeline(fs.createReadStream(filePath), res, () => {})
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0]
  const candidate = safeJoin(publicDir, urlPath === '/' ? '/index.html' : urlPath)
  if (!candidate) {
    res.writeHead(400)
    res.end('Bad request')
    return
  }
  fs.stat(candidate, (err, st) => {
    if (!err && st.isFile()) {
      sendFile(res, candidate)
      return
    }
    // SPA fallback
    sendFile(res, path.join(publicDir, 'index.html'))
  })
})

if (typeof PhusionPassenger !== 'undefined') {
  server.listen('passenger')
} else {
  server.listen(port, () => {
    console.log('LTC web on', port, 'root=', publicDir)
  })
}
