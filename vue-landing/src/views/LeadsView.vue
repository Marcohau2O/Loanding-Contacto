<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <!-- Navbar -->
     <Navbar @logout="logout" />
    <!-- Leads Table -->
    <div class="p-6">
      <h1 class="text-2xl font-semibold mb-4">Leads</h1>
      <div class="overflow-x-auto">
        <table v-if="leads.length" class="w-full bg-white shadow-md rounded table-auto">
          <thead class="bg-gray-200 text-left">
            <tr>
              <th class="p-3">Nombre</th>
              <th class="p-3">Email</th>
              <th class="p-3">Teléfono</th>
              <th class="p-3">Mensaje</th>
              <th class="p-3">Estado</th>
              <th class="p-3">Cambiar Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in leads" :key="lead.id" class="border-t">
              <td class="p-3">{{ lead.name }}</td>
              <td class="p-3">{{ lead.email }}</td>
              <td class="p-3">{{ lead.phone }}</td>
              <td class="p-3">{{ lead.message }}</td>
              <td class="p-3 capitalize">{{ lead.status }}</td>
              <td class="p-3">
                <select v-model="lead.status" @change="updateStatus(lead)" class="border p-1 rounded">
                  <option value="nuevo">Nuevo</option>
                  <option value="contactado">Contactado</option>
                  <option value="descartado">Descartado</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="mt-4 text-gray-600">No hay leads disponibles</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'

const leads = ref([])
const router = useRouter()

const fetchLeads = async () => {
  try {
    const res = await axios.get(import.meta.env.VITE_API_URL + '/leads', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
    leads.value = res.data
  } catch (e) {
    router.push('/login')
  }
}

const updateStatus = async (lead) => {
  await axios.patch(`${import.meta.env.VITE_API_URL}/leads/${lead.id}`, {
    status: lead.status
  }, {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  })
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(fetchLeads)
</script>