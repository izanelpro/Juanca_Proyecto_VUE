<template>
  <div>
      <h3 class="text-center front-weight-bold mt-4 text-primary" id="titulo">
          <i class="bi bi-shop"></i> Tienda
          <router-link to="/" class="text-dark">
              <button class="btn btn-customb">
                  <i class="bi bi-arrow-return-left"></i>
              </button>
          </router-link>
      </h3>
  </div>

  <div class="container mt-5 text-start">
      <!-- Botón para mostrar todos los artículos -->
      <button @click="filtrarCategoria('Todos')"
          :class="categoriaSeleccionada === 'Todos' ? 'btn btn-info m-1' : 'btn btn-outline-secondary m-1'">
          Todos
      </button>

      <!-- Botones para cada categoría -->
      <button v-for="categoria in categorias" :key="categoria" @click="filtrarCategoria(categoria)"
          :class="categoriaSeleccionada === categoria ? 'btn btn-info m-1' : 'btn btn-outline-secondary m-1'">
          {{ categoria }}
      </button>
  </div>

  <div class="container mt-n1 mb-5">
      <div class="table-responsive rounded">
          <table class="table table-striped">
              <thead class="table-info rounded-header">
                  <tr class="align-middle">
                      <th scope="col" class="col-md-1 table-info">Imagen</th>
                      <th scope="col" class="col-md-2">Nombre</th>
                      <th scope="col" class="col-md-1">Categoría</th>
                      <th scope="col" class="col-md-4">Descripción</th>
                      <th scope="col" class="col-md-2">Precio</th>
                      <th scope="col" class="col-md-4" v-if="isAdmin">Stock</th>
                      <th scope="col" class="pale-yellow table-warning col-md-4" v-if="isLogged">Añadir al carro</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="articulo in articulosFiltrados" :key="articulo._id">
                      <td>
                          <img :src="`http://localhost:5000/uploads/img/${articulo.imagen_url}`"
                              alt="Imagen del artículo" class="img-thumbnail img-thumbnail-small" />
                      </td>
                      <td class="align-middle">{{ articulo.nombre }}</td>
                      <td class="align-middle">{{ articulo.categoria }}</td>
                      <td class="align-middle">{{ articulo.descripcion }}</td>
                      <td class="align-middle">{{ articulo.precio_unitario }} €</td>
                      <td class="align-middle" v-if="isAdmin">{{ articulo.stock_disponible }}</td>
                      <td class="text-center align-middle pale-yellow table-warning" v-if="isLogged" >
                          <button class="btn btn-success m-2" @click="carritoStore.agregarAlCarrito(articulo)">
                              <i class="bi bi-cart2" ></i>
                          </button>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  </div>
</template>

<script>
import { obtenerArticulos } from '@/js/articuloServicios.js';
import { useCarritoStore } from '@/store/carrito.mjs';

export default {
  name: "TablaTienda",

  setup(){
      const carritoStore = useCarritoStore();

      return { carritoStore };
  },

  data() {
      return {
          articulos: [],
          articulosFiltrados: [],
          isAdmin: false,
          isLogged: false,
          categorias: ["Electrónica", "Hogar", "Ofimática", "Deporte", "Libros", "Otros"],
          categoriaSeleccionada: "Todos"
      };
  },
  mounted() {
      this.obtenerArt();
      this.isAdmin = localStorage.getItem('isAdmin') === 'true';
      this.isLogged = localStorage.getItem('isLogueado') === 'true';
  },
  methods: {
      async obtenerArt() {
          try {
              this.articulos = await obtenerArticulos();
              this.articulosFiltrados = this.articulos;
          } catch (error) {
              console.error('Error al obtener los artículos', error);
          }
      },
      filtrarCategoria(categoria) {
          this.categoriaSeleccionada = categoria;
          this.articulosFiltrados = this.articulos.filter(articulo =>
              categoria === "Todos" || articulo.categoria === categoria
          );
      }
  }
};
</script>

<style scoped>
  .mt-n1 {
      margin-top: -0.40rem !important;
  }

  .ms-n1 {
      margin-left: -0.1rem ;
  }
</style>