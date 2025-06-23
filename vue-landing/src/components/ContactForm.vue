<template>
  <form @submit.prevent="handleSubmit" class="form">
    <div class="field">
      <label>Nombre:</label>
      <input v-model="form.name" required />
    </div>

    <div class="field">
      <label>Correo:</label>
      <input v-model="form.email" type="email" required />
    </div>

    <div class="field">
      <label>Teléfono:</label>
      <input v-model="form.phone" required />
    </div>

    <div class="field">
      <label>Mensaje:</label>
      <textarea v-model="form.message" required></textarea>
    </div>

    <button type="submit">Enviar</button>
    <p v-if="success" class="success">Enviado correctamente</p>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const success = ref(false)

const handleSubmit = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      success.value = true
      Object.assign(form, { name: '', email: '', phone: '', message: '' })
    } else {
      alert('Hubo un problema al enviar el mensaje')
    }
  } catch (error) {
    alert('Error de red: ' + error.message)
  }
}
</script>

<style scoped>
.form {
  color: #000;
}

.field {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 0.3rem;
  color: #000;
}

input, textarea {
  background-color: #fff;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0.6rem;
  font-size: 1rem;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

button {
  padding: 0.6rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.success {
  margin-top: 1rem;
  color: green;
}
</style>
