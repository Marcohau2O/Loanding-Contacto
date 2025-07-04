const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')

// Conecta a la base de datos
const db = new Database('./contact.db')

// Datos del usuario administrador
const email = 'admin@test.com'
const plainPassword = 'admin123'
const hashedPassword = bcrypt.hashSync(plainPassword, 10)

try {
  db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword)
  console.log('✅ Usuario admin creado con éxito')
} catch (err) {
  console.log('⚠️ El usuario ya existe o hubo un error:', err.message)
}