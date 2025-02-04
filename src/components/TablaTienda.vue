<template>
    <br>

    <div class="row">
      <h5 class="font-weight-bold text-uppercase text-primary position-relative d-inline-block m-3">TIENDA<i class="bi bi-person-workspace m-2"></i></h5>
      <router-link to="/" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
    </div>

    <br>
    <div class="container my-5">
      <h2 class="mb-4">Lista de Elementos en Tienda</h2>
      <div class="container my-2">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead class="table-info rounded-header">
              <tr>
                <th scope="col" class="w-20">ID</th>
                <th scope="col" class="w-20">Nombre</th>
                <th scope="col" class="w-20 text-center">Descripción</th>
                <th scope="col" class="w-10">Precio</th>
                <th scope="col" class="w-10 text-center">Stock</th>
                <th scope="col" class="w-10 text-center">Foto</th>
                <th scope="col" class="pale-yellow table-warning" v-if="isLogued || isAdmin">Carrito</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="articulo in articuloPorPagina" :key="articulo._id">
                  <td class="align-middle">{{ articulo._id.substring(0,4) }}</td>
                  <td class="align-middle">{{ articulo.nombre }}</td>
                  <td class="align-middle">{{ articulo.descripcion }}</td>
                  <td class="align-middle">{{ articulo.precio_unitario }}</td>
                  <td class="align-middle">{{ articulo.stock_disponible }}</td>
                  <td class="align-middle">{{ articulo.imagen }}</td>
                  <td class="text-center align-middle pale-yellow table-warning" v-if="isLogued || isAdmin">
                    <div>
                      <button class="btn btn-warning m-2" @click="agregar_carrito(articulo)">
                        <i class="bi bi-cart3"></i>
                      </button>
                    </div>
                  </td>
                </tr>
            </tbody>
          </table>

          <div class="d-flex justify-content-center my-3">
              <button class="btn btn-primary" :disable="currentPage === 1" @click="paginaAnterior">
                <i class="bi bi-chevron-left"> </i>
              </button>
              <span class="mx-3 align-self-center">Página {{ currentPage }}</span>
  
              <button class="btn btn-secondary" :disabled="currentPage * perPage >= filtroarticulos.length"
                @click="siguientePagina">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2'; // Importar SweetAlert2
  import { obtenerArticulos, eliminarArticulo} from '@/js/articuloServicios.js';

export default {
  name: "TablaTienda",

  data() {
    return {
      articulos: [],
      
      currentPage: 1,
      pageSize: 5, //registros por página
      categorias: [
        'Electrónica',
        'Hogar',
        'Ofimática',
        'Deporte',
        'Libros',
        'Otros'
      ]
    };
  },

  
  mounted() {
    this.getarticulos();
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    this.isLogued= localStorage.getItem('isLogued') === 'true';

  },
  
  
    computed: {
      articuloPorPagina() {
        const articulosFiltrados = this.filtroarticulos;
        const indiceInicial = (this.currentPage - 1) * this.pageSize;
        return articulosFiltrados.slice(indiceInicial, indiceInicial + this.pageSize)
      },
  
      filtroarticulos() {
        if (this.isChecked) {
          return this.articulos;
        } else {
          return this.articulos.filter(articulo => !articulo.fechaAlta);
        }
      },
    },
  
    methods: {
      siguientePagina() {
        if (this.currentPage * this.pageSize < this.articulos.length) {
          this.currentPage++;
        }
      },
  
      paginaAnterior() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      
      // Modificar Artículo
      async agregar_carrito(articulo) {
        if(this.isLogued){
            try {
              this.limpiarFormCli()
              const response = await fetch('http://localhost:5000/articulos');
              if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
              }
              const articulos = await response.json();
      
              // Encontrar el articulo por su ID
              const articuloEncontrado = articulos.find(c => c._id === articulo._id);
      
      
              if (articuloEncontrado) {
                // Convertir la fecha de alta al formato dd/mm/yyyy
                // Asignar el objeto completo de provincia y municipio
      
                this.articulo = { ...articuloEncontrado };
                console.log("articulo encontrado");
                if (this.articulo.fecha_alta) {
                  this.articulo.fecha_alta = this.articulo.fecha_alta.split('T')[0];  // Para asegurarse de que la fecha esté en formato YYYY-MM-DD
                }
              } else {
                this.mostrarAlerta('Error', 'articulo no encontrado en el servidor.', 'error');
              }
            } catch (error) {
            console.error(error);
            this.mostrarAlerta('Error', 'No se pudo cargar el articulo desde el servidor.', 'error');
            }
          }
      },
      async getarticulos() {
        try {
          this.articulos = await obtenerArticulos();
        } catch (error) {
          console.error(error);
        }
      },
  
      mostrarAlerta(titulo, mensaje, icono) {
        Swal.fire({
          title: titulo,
          text: mensaje,
          icon: icono,
          customClass: {
            container: 'custom-alert-container',
            popup: 'custom-alert-popup',
            modal: 'custom-alert-modal'
          }
        })
      },
  
   


  
      // Modificar Artículo
      async eliminararticulo(id) {
        try {
          await eliminarArticulo(id);
          this.getarticulos()

        } catch (error) {
          console.error(error);
          this.mostrarAlerta("Error", "No se pudo dar de baja al articulo", "error");
        }
      },
  
      async modificararticulo() {
        if (this.articulo.nombre) {
          try {
            const response = await fetch(`http://localhost:5000/articulos/${this.articulo.id}`, { // URL interpolada correctamente
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(this.articulo),
            });
  
  
            if (!response.ok) {
              throw new Error('Error al modificar el articulo:' + response.statusText);
            }
            this.mostrarAlerta("Aviso", "articulo modificado correctamente", "success");
            this.getarticulos();
  
          } catch (error) {
            console.error(error);
          }
        } else {
          this.mostrarAlerta('Error', 'Debe seleccionar un articulo para modificar', 'error')
        }
      },
  
  
    },
    
      async prueba() {
  
      },
  }
  
  </script>
  
  <style scoped>
  .custom-date-input {
    width: 12em;
    text-align: center;
  }
  .btn-primary:hover{
    color: white;
    border: 1px solid rgb(20, 122, 255);
    background-color: rgb(0, 57, 172);
  }
  .btn-warning:hover{
    background-color: rgb(255, 166, 0);
  }
  </style>