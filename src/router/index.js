import { createRouter, createWebHistory } from 'vue-router'
import TablaInicio from '@/components/PaginaInicio.vue'
import gestion from '@/components/Gestion.vue'
import TablaUsuarios from '@/components/TablaUsuarios.vue'
import TablaContacto from '@/components/TablaContacto.vue'
import TablaEmpleo from '@/components/TablaEmpleo.vue'
import NotFound from '@/components/NotFound.vue'
import AvisoLegal from '@/components/avisoLegal.vue'
import TablaComentarios from '@/components/TablaComentarios.vue'
import TablaArticulos from '@/components/TablaArticulos.vue'
import TablaRegistro from '@/components/TablaRegistro.vue'
import TablaLogin from '@/components/TablaLogin.vue'
import TablaTienda from '@/components/TablaTienda.vue'
import TablaCarro from '@/components/TablaCarro.vue'
const routes = [
  {
    path: '/',
    name:'inicio',
    component: TablaInicio
  },
  {
    path: '/gestion',
    name: 'gestion',
    component: gestion,
    meta:{ requiresAdmin: false}
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
    name:'registro',
    component: TablaRegistro
  },
  {
    path: '/login',
    name:'login',
    component: TablaLogin
  },
  {
    path: '/tienda',
    name:'tienda',
    component: TablaTienda
  },
  {
    path: '/cart',
    name: 'carro',
    component: TablaCarro
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.meta.requiresAdmin){
    const isLogeado = localStorage.getItem('isLogeado') == 'true';
    const isAdmin = localStorage.getItem('isAdmin') == 'true';

    if (!isLogeado || !isAdmin){
      next({ name: 'login'});
    }else{
      next();
    }
  }else{
    next();
  }
});

export default router
