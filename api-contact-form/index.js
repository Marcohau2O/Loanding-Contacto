require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const axios = require('axios')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const app = express()
const db = new Database('./contact.db')
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
const JWT_SECRET = process.env.JWT_SECRET

app.use(cors())
app.use(express.json())


db.prepare(`
  CREATE TABLE IF NOT EXISTS contact_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    message TEXT,
    status TEXT DEFAULT 'nuevo',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run()

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  );
`).run()

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token requerido' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' })
  }
}

app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Credenciales inválidas' })
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '2h'
  })

  res.json({ token })
})

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message, recaptchaToken } = req.body

  // Validar reCAPTCHA
  try {
    const verify = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken
      })
    )

    if (!verify.data.success) {
      return res.status(400).json({ error: 'Error de reCAPTCHA' })
    }
  } catch (err) {
    return res.status(500).json({ error: 'Error validando reCAPTCHA' })
  }

  const cleanName = validator.escape(validator.trim(name || ''))
  const cleanEmail = validator.normalizeEmail(email || '')
  const cleanPhone = validator.whitelist(phone || '', '0-9+ -()')
  const cleanMessage = validator.escape(validator.trim(message || ''))

  if (!validator.isEmail(cleanEmail)) {
    return res.status(400).json({ error: 'Correo inválido' })
  }

  // Guardar
  const stmt = db.prepare(`
    INSERT INTO contact_requests (name, email, phone, message)
    VALUES (?, ?, ?, ?)
  `)
  stmt.run(cleanName, cleanEmail, cleanPhone, cleanMessage)

  res.status(200).json({ message: 'Enviado correctamente' })
})

app.get('/api/leads', auth, (req, res) => {
  const leads = db.prepare(`
    SELECT * FROM contact_requests ORDER BY created_at DESC
  `).all()

  res.json(leads)
})

app.patch('/api/leads/:id', auth, (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const allowed = ['nuevo', 'contactado', 'descartado']

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Estado inválido' })
  }

  db.prepare(`UPDATE contact_requests SET status = ? WHERE id = ?`).run(status, id)
  res.json({ message: 'Estado actualizado' })
})

// 🚀 Iniciar servidor
app.listen(3000, () => {
  console.log('API escuchando en http://localhost:3000')
})
