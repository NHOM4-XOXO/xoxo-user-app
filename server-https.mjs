import { createServer } from 'https'
import { readFileSync } from 'fs'
import path from 'path'
import next from 'next'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const keyPath = path.resolve(__dirname, './certificates/localhost+2-key.pem')
const certPath = path.resolve(__dirname, './certificates/localhost+2.pem')
const dev = true
const hostname = 'localhost'
const port = 3000
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()
await app.prepare()
createServer({ key: readFileSync(keyPath), cert: readFileSync(certPath) }, (req, res) => handle(req, res))
    .listen(port, () => console.log(`> Ready on https://localhost:${port}`))