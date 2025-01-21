import { createRouter, createWebHistory } from 'vue-router'
import PaginaInicio from '@/components/PaginaInicio.vue'
import TablaUsuarios from '@/components/TablaUsuarios.vue'
import TablaContacto from '@/components/TablaContacto.vue'
import TablaEmpleo from '@/components/TablaEmpleo.vue'
import NotFound from '@/components/NotFound.vue'
import AvisoLegal from '@/components/avisoLegal.vue'
import TablaComentarios from '@/components/TablaComentarios.vue'
import TablaArticulos from '@/components/TablaArticulos.vue'
import TablaRegistro from '@/components/TablaRegistro.vue'
import TablaLogin from '@/components/TablaLogin.vue'

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
    path: '/articulos',
    name:'articulos',
    component: TablaArticulos
  },
  {
    path: '/comentarios',
    name:'TablaComentarios',
    component: TablaComentarios
  },
  {
    path:'/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/registrarse',
    name:'TablaRegistro',
    component: TablaRegistro
  },
  {
    path: '/login',
    name:'TablaLogin',
    component: TablaLogin
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
