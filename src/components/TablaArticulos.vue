<template>
    <br>
    <div class="row">
      
      <h5 class="text-center front-weight-bold">GESTIÓN DE ARTÍCULOS</h5>
      <router-link to="/" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
    </div>
    <br>
  
    <div class="container-fluid border p-4">
        <form class="form-in-line">
            <div class="col-10 col-m-6 col-lg-8 mx-auto">

                <!--Nombre y categoría-->
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span me-2">Nombre: </span>
                    <input type="text" class="form-control sm w-50" placeholder="Nombre del artículo" v-model="articulo.nombre">

                    <span class="input-group-text custom-span me-2">Categoría: </span>
                    <select name="departamento" class="form-control sm w-25" v-model="articulo.categoria">
                        <option value="">Seleccionar categoría</option>
                        <option v-for="categoria in categorias" :key="categoria.id" :value="categoria">
                        {{ categoria.nm }}
                        </option>
                    </select>
                </div>
                <!--Comentarios y Precio por Unidad-->
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span me-2">Descripción: </span>
                    <textarea name="descripcion" id="descripcion" cols="110" rows="3" placeholder="Descripcion de artículo" v-model="articulo.descripcion"></textarea>

                    <span class="input-group-text custom-span me-2">Precio Unitario: </span>
                    <input type="number" class="form-control sm w-50"  v-model="articulo.precio">
                </div>

                <!--Stock y Personalización-->
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span me-2">Stock: </span>
                    <input type="number" class="form-control sm w-50"  v-model="articulo.stock">

                    <span class="input-group-text custom-span me-2">Personalización: </span>
                    <textarea name="personalizacion" id="personalizacion" cols="110" rows="3" placeholder="Detalles de personalización" v-model="articulo.personalizacion"></textarea>
                </div>

                <!--Imagen y ALta-->
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span me-2">Imagen URL: </span>
                    <textarea name="descripcion" id="descripcion" cols="130" rows="1" v-model="articulo.imagen"></textarea>

                    <span class="input-group-text custom-span ms-auto me-2">Fecha Alta:</span>
                    <input type="date" class="form-control sm w-25" v-model="articulo.fechaAlta">
                </div>
            </div>
            
            <!--Grabar y Limpiar-->
            <button class="btn btn-primary m-1" @click.prevent="grabararticulo">
            <i class="bi bi-arrow-up-square mr-2"></i> Grabar
            </button>
            <button class="btn btn-light m-1" @click="limpiarFormCli()">
            <i class="bi-arrow-clockwise"></i> Limpiar
          </button>
        </form>
    </div>
  
    <div>
      <div class="container my-5">
        <h2 class="mb-4">TABLA DE ARTÍCULOS</h2>
        <div class="container my-2">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead class="table-info rounded-header">
                <tr>
                  <th scope="col" class="w-15 text-center">ID</th>
                  <th scope="col" class="w-20">Nombre</th>
                  <th scope="col" class="w-20">Categoría</th>
                  <th scope="col" class="w-20 text-center">Descripción</th>
                  <th scope="col" class="w-10">Precio</th>
                  <th scope="col" class="w-10 text-center">Stock</th>
                  <th scope="col" class="w-10 text-center">Fecha Alta</th>
                  <th scope="col" class="pale-yellow table-warning">Gestión</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="articulo in articuloPorPagina" :key="articulo.id">
                  <td class="align-middle">{{ articulo.id }}</td>
                  <td class="align-middle">{{ articulo.nombre }}</td>
                  <td class="align-middle">{{ articulo.categoria.nm }}</td>
                  <td class="align-middle">{{ articulo.descripcion }}</td>
                  <td class="align-middle">{{ articulo.precio }}</td>
                  <td class="align-middle">{{ articulo.stock }}</td>
                  <td class="align-middle">{{ articulo.fechaAlta }}</td>
                  <td class="text-center align-middle pale-yellow table-warning">
                    <div>
                      <button class="btn btn-warning m-2" @click="seleccionaarticulo(articulo)">
                        <i class="fas fa-pencil-alt"></i>
                      </button>
                      
                      <button class="btn btn-danger m-2" @click="deletearticulo(articulo.dni)">
                        <i class="bi bi-trash"></i>
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
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  
  export default {
    name: "Tabla-articulos",
    components: {
      
    },
  
    data() {
      return {
  
        articulo: {
          nombre: '',
          categoria: '',
          descripcion: '',
          precio: '',
          stock: '',
          personalizacion: '',
          imagen: '',
          alta: '',
        },
  
        articulos: [],
        categorias:[],
        currentPage: 1,
        pageSize: 5,

      };
    },
  
    mounted() {
      this.getarticulos();
      this.getCategorias();
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
  
      async seleccionaarticulo(articulo) {
        try {
          this.limpiarFormCli()
          const response = await fetch('http://localhost:3000/articulos');
          if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
          }
          const articulos = await response.json();
  
          // Encontrar el articulo por su DNI
          const articuloEncontrado = articulos.find(c => c.nombre === articulo.nombre);
  
  
          if (articuloEncontrado) {
            // Convertir la fecha de alta al formato dd/mm/yyyy
            // Asignar el objeto completo de provincia y municipio
  
            this.articulo = { ...articuloEncontrado };
            console.log("articulo encontrado");
            if (this.articulo.fechaAlta) {
              this.articulo.fechaAlta = this.articulo.fechaAlta.split('T')[0];  // Para asegurarse de que la fecha esté en formato YYYY-MM-DD
            }
          } else {
            this.mostrarAlerta('Error', 'articulo no encontrado en el servidor.', 'error');
          }
        } catch (error) {
          console.error(error);
          this.mostrarAlerta('Error', 'No se pudo cargar el articulo desde el servidor.', 'error');
        }
      },
  
  
      limpiarFormCli() {
        this.articulo = {
          nombre: '',
          categoria: '',
          descripcion: '',
          precio: '',
          stock: '',
          personalizacion: '',
          imagen: '',
          fechaAlta: '',
        }
      },
  
      
  
      async getarticulos() {
        try {
          const response = await fetch('http://localhost:3000/articulos');
          if (!response.ok) {
            throw new Error('Error en la solicitud:' + response.statusText);
          }
          this.articulos = (await response.json()).sort((a, b) => a.nombre.localeCompare(b.nombre) || a.nombre.localeCompare(b.nombre));
        } catch (error) {
          console.error(error);
        }
      },
      async getCategorias() {
      try {
        const response = await fetch('http://localhost:3000/categorias');
        if (!response.ok) {
          throw new Error('Error en la solicitud:' + response.statusText);
        }
        this.categorias = await response.json();
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
  
      async grabararticulo() {
        // Verificar si los campos requeridos están llenos
        if (this.articulo.nombre && this.articulo.categoria && this.articulo.precio&& this.articulo.stock&& this.articulo.fechaAlta) {
          try {
            this.articulo.fechaAlta = '';
            // Obtener los articulos existentes
            const response = await fetch('http://localhost:3000/articulos');
            if (!response.ok) {
              throw new Error('Error al obtener los articulos: ' + response.statusText);
            }
  
            const articulosExistentes = await response.json();
  
            const articuloExistente = articulosExistentes.find(articulo => articulo.nombre === this.articulo.nombre);
  
            if (articuloExistente) {
  
              articuloExistente.alta = '';
              const actualizarResponse = await fetch(`http://localhost:3000/articulos/${articuloExistente.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(articuloExistente),
              });
  
              if (!actualizarResponse.ok) {
                throw new Error('Error al actualizar el articulo: ' + actualizarResponse.statusText);
              }
  
              this.mostrarAlerta('Aviso', 'articulo reactivado correctamente', 'success');
              this.getarticulos();
            } else {
              const crearResponse = await fetch('http://localhost:3000/articulos', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.articulo),
              });
  
              if (!crearResponse.ok) {
                throw new Error('Error al guardar el articulo: ' + crearResponse.statusText);
              }
  
              const nuevoarticulo = await crearResponse.json();
              this.articulos.push(nuevoarticulo);
              this.mostrarAlerta('Aviso', 'articulo grabado correctamente', 'success');
              this.getarticulos();
            }
          } catch (error) {
            console.error(error);
            this.mostrarAlerta('Error', 'No se pudo grabar el articulo.', 'error');
          }
        } else {
          this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
        }
      },
  
      async eliminararticulo() {
        try {
          const response = await fetch("http://localhost:3000/articulos");
          if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
          }
  
          const articulos = await response.json();
          const articuloExistente = articulos.find(articulo => articulo.nombre === this.articulo.nombre);
  
          if (articuloExistente) {
            await fetch(`http://localhost:3000/articulos/${articuloExistente.id}`, { // URL interpolada correctamente
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(articuloExistente),
            });
  
            this.mostrarAlerta("Aviso", "articulo dado de baja correctamente", "success");
            this.getarticulos(); // Actualizar lista de articulos
  
          } else {
            this.mostrarAlerta("Error", "articulo no encontrado", "error");
          }
        } catch (error) {
          console.error(error);
          this.mostrarAlerta("Error", "No se pudo dar de baja al articulo", "error");
        }
      },
  
      async modificararticulo() {
        if (this.articulo.dni) {
          try {
            const response = await fetch(`http://localhost:3000/articulos/${this.articulo.id}`, { // URL interpolada correctamente
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