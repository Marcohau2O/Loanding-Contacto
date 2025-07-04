<template>
  <Navbar @logout="logout" />

  <!-- Formulario de contacto -->
  <div class="py-20  text-center">
    <h1 class="text-3xl font-bold text-gray-800 tracking-wide">📝 Formulario de Contacto</h1>
    <p class="text-sm text-gray-600 mt-2">Completa los campos a continuación y nos pondremos en contacto contigo.</p>
  </div>

  <form
    @submit.prevent="handleSubmit"
    class="w-full max-w-xl p-6 space-y-4 bg-white rounded-lg shadow mx-auto"
  >
    <!-- Nombre -->
    <div>
      <label class="block text-sm font-medium mb-1">Nombre completo:</label>
      <input
        v-model="form.name"
        required
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
      />
    </div>

    <!-- Correo -->
    <div>
      <label class="block text-sm font-medium mb-1">Correo:</label>
      <input
        v-model="form.email"
        type="email"
        required
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
      />
    </div>

    <!-- Teléfono -->
    <div>
      <label class="block text-sm font-medium mb-1">Teléfono:</label>
      <input
        v-model="form.phone"
        required
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
      />
    </div>

    <!-- Mensaje -->
    <div>
      <label class="block text-sm font-medium mb-1">Mensaje:</label>
      <textarea
        v-model="form.message"
        required
        rows="4"
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
      ></textarea>
    </div>

    <!-- Términos y condiciones -->
    <div class="flex items-center space-x-3">
      <input
        type="checkbox"
        id="terms"
        v-model="form.acceptedTerms"
        class="h-4 w-4 text-green-600 border-gray-300 rounded"
      />
      <label for="terms" class="text-sm text-gray-700">Acepto los</label>
      <button
        type="button"
        @click="showTerms = true"
        class="text-sm text-blue-600 underline hover:text-blue-800"
      >
        Términos y condiciones
      </button>
    </div>

    <!-- reCAPTCHA -->
    <div
      class="g-recaptcha mt-4"
      ref="recaptcha"
      :data-sitekey="recaptchaSiteKey"
    ></div>

    <!-- Botón de envío -->
    <button
      type="submit"
      class="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
    >
      Enviar
    </button>

    <!-- Mensajes de respuesta -->
    <p v-if="success" class="text-green-600 mt-2">✅ Enviado correctamente</p>
    <p v-if="error" class="text-red-600 mt-2">❌ {{ error }}</p>
  </form>

  <!-- Modal de Términos -->
  <div
    v-if="showTerms"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg overflow-y-auto max-h-[80vh]">
      <h2 class="text-lg font-semibold mb-4">Términos y Condiciones</h2>
      <p class="text-sm text-gray-700 mb-6">
        Aquí van tus términos y condiciones completos...
      </p>
      <div class="flex justify-end space-x-2">
        <button
          @click="showTerms = false"
          class="text-gray-600 hover:text-gray-800 px-4 py-2 text-sm"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './Navbar.vue'
import emailjs from 'emailjs-com'

const router = useRouter()

const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const emailjsUserId = import.meta.env.VITE_EMAILJS_USER_ID


const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: '',
  acceptedTerms: false
})

const success = ref(false)
const error = ref('')
const showTerms = ref(false)
const recaptcha = ref(null)
const recaptchaWidgetId = ref(null)

const apiUrl = import.meta.env.VITE_API_URL
const recaptchaSiteKey = import.meta.env.VITE_SITE_KEY

// Inicializa reCAPTCHA
onMounted(() => {
  const interval = setInterval(() => {
    if (window.grecaptcha && recaptcha.value && !recaptchaWidgetId.value) {
      recaptchaWidgetId.value = grecaptcha.render(recaptcha.value, {
        sitekey: recaptchaSiteKey
      })
      clearInterval(interval)
    }
  }, 300)
})

// Manejo de envío
const handleSubmit = async () => {
  if (!form.acceptedTerms) {
    error.value = 'Debes aceptar los términos y condiciones.'
    return
  }

  if (!window.grecaptcha || typeof grecaptcha.getResponse !== 'function') {
    error.value = 'reCAPTCHA aún no se ha cargado.'
    return
  }

  const recaptchaToken = grecaptcha.getResponse(recaptchaWidgetId.value)
  if (!recaptchaToken) {
    error.value = 'Completa el reCAPTCHA antes de continuar.'
    return
  }

  try {
    const res = await fetch(`${apiUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, recaptchaToken })
    })

    if (res.ok) {
      success.value = true
      error.value = ''
      grecaptcha.reset(recaptchaWidgetId.value)

      await emailjs.send(
        emailjsServiceId,
        emailjsTemplateId,{
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message
        }, 
        emailjsUserId
      )
      
      Object.assign(form, {
        name: '',
        email: '',
        phone: '',
        message: '',
        acceptedTerms: false
      })
    } else {
      error.value = 'Error al enviar. Intenta más tarde.'
    }
  } catch (e) {
    error.value = 'Error de red: ' + e.message
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>