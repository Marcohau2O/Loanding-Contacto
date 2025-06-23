<template>
  <div class="container">
    <h1>🌱 Formulario Contacto</h1>
    <ContactForm />
  </div>
</template>

<script setup>
import ContactForm from './components/ContactForm.vue'
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f0f4f8;
  margin: 0;
  padding: 2rem;
  color: #000; /* ← Texto negro en todo el body */
}

.container {
  max-width: 600px;
  margin: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #000; /* ← Asegura texto negro dentro del contenedor */
}
</style>
