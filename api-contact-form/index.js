const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')

// Configurar app
const app = express()
const db = new Database('./contact.db')

app.use(cors())
app.use(express.json())

// Crear tabla si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS contact_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run()

// Ruta POST
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body
  const stmt = db.prepare(`INSERT INTO contact_requests (name, email, phone, message) VALUES (?, ?, ?, ?)`)
  stmt.run(name, email, phone, message)
  res.status(200).json({ ok: true, message: 'Solicitud recibida' })
})

app.listen(3000, () => {
  console.log('Servidor API iniciado en http://localhost:3000')
})
