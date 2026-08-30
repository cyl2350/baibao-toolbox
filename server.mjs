// 本地预览服务器: node server.mjs [port]
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname, normalize } from 'node:path'

const root = join(process.cwd(), 'dist')
const port = parseInt(process.argv[2] || '8080', 10)

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0])
  if (urlPath.endsWith('/')) urlPath += 'index.html'
  let file = normalize(join(root, urlPath))
  if (!file.startsWith(root)) { res.writeHead(403); res.end('Forbidden'); return }
  if (!existsSync(file) || statSync(file).isDirectory()) {
    file = join(root, '404.html')
    res.statusCode = 404
  }
  const data = readFileSync(file)
  res.writeHead(res.statusCode || 200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' })
  res.end(data)
}).listen(port, () => console.log(`预览地址: http://127.0.0.1:${port}/`))
