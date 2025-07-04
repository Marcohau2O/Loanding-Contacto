import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../src/views/LoginView.vue'
import LeadsView from '../src/views/LeadsView.vue'
import Formulario from '../src/components/ContactForm.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Login', component: LoginView },
    { path: '/leads', name: 'Leads', component: LeadsView },
    { path: '/formulario', name: 'Formulario', component: Formulario }
  ]
})

// Protege rutas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/' || token) next()
  else next('/')
})

export default router