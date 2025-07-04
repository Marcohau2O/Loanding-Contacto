<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm">
      <h2 class="text-xl font-bold mb-6 text-center">Iniciar sesión</h2>
      <input v-model="email" placeholder="Correo" class="input mb-4" />
      <div class="flex items-center gap-2 mb-4">
          <input v-model="password" type="password" placeholder="Contraseña" class="input mb-4" id="pwd"/>
          <input type="checkbox" onclick="pwd.type = this.checked ? 'text' : 'password'">
      </div>
      <button @click="login" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Entrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await axios.post(import.meta.env.VITE_API_URL + '/login', { email: email.value, password: password.value })
    localStorage.setItem('token', res.data.token)
    router.push('/leads') // Redirigir al dashboard
  } catch (e) {
    alert('Credenciales inválidas')
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  outline: none;
}
</style>
