import { createRouter, createWebHistory } from 'vue-router'
import PaginaInicio from '@/components/PaginaInicio.vue'
import TablaUsuarios from '@/components/TablaUsuarios.vue'
import TablaContacto from '@/components/TablaContacto.vue'
import TablaEmpleo from '@/components/TablaEmpleo.vue'
import NotFound from '@/components/NotFound.vue'
import AvisoLegal from '@/components/avisoLegal.vue'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: PaginaInicio
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: TablaUsuarios
  },
  {
    path: '/contacto',
    name: 'contacto',
    component: TablaContacto
  },
  {
    path: '/empleo',
    name:'empleo',
    component: TablaEmpleo
  },
  {
    path: '/avisoLegal',
    name:'avisoLegal',
    component: AvisoLegal
  },
  {
    path:'/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
