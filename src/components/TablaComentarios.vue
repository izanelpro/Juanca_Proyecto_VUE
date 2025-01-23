<template>
    <br>

    <div class="row">
      <h5 class="font-weight-bold text-uppercase text-primary position-relative d-inline-block m-3">ZONA DE COMENTARIOS<i class="bi bi-chat-dots m-2"></i></h5>
      <router-link to="/" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
    </div>

    <br>
    <div class="container-fluid border p-4">
      <!-- Formulario -->
      <form class="form-in-line">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
  
          <!-- Email y Móvil -->
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span me-2">Email: </span>
            <input type="email" class="form-control sm w-50" placeholder="Correo electrónico" v-model="comentario.clienteEmail" @blur="validarCorreo(this.comentario.clienteEmail)">
            <span class="input-group-text custom-span ms-2 me-2">Móvil: </span>
            <input type="text" class="form-control sm w-50" placeholder="Móvil" v-model="comentario.clienteMovil
              " @blur="validarTelefono(this.comentario.clienteMovil)">
          </div>
          <!--Comentarios-->
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span me-2">Mensaje: </span>
            <textarea name="comentarios" id="comentarios" cols="130" rows="5" maxlength="256"></textarea>
          </div>
          <!--Estrellas-->
            <div class="input-group-text mb-3">
                <span class="input-group-text custom-span me-2">Valoración: </span>
                <div class="star-valor" >
                <span v-for="n in 5" :key="n" :class="n <= this.comentario.clienteValor? 'bi bi-star-fill' : 'bi bi-star' " 
                @click="setValor(n)"
                        class="star-icon" 
                ></span>
            </div>
          </div>
          <!-- Aceptar politica  -->
        <input type="checkbox" id="ckeckbox" v-model="comentario.lopd">
        <label for="checkbox">Acepto las condiciones y términos de la <router-link to="/avisoLegal" >Política de Privacidad</router-link></label><br>
          
        </div>
        
        <!-- Submit -->
        <button class="btn btn-primary m-1" @click.prevent="grabarcomentario">Alta</button>
      </form>
    </div>

    
    <div class="container my-5">
      <h2 class="mb-4">TABLA DE COMENTARIOS</h2>
      <div class="container my-2">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead class="table-info rounded-header">
              <tr>
                <th scope="col" class="w-20">Id</th>
                <th scope="col" class="w-20">Fecha</th>
                <th scope="col" class="w-20 text-center">Email</th>
                <th scope="col" class="w-10">Mensaje</th>
                <th scope="col" class="w-10 text-center">Valoración</th>
                <th scope="col" class="pale-yellow table-warning" v-if="isAdmin">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="comentario in comentarioPorPagina" :key="comentario.id">
                <td class="align-middle">{{ comentario.id }}</td>
                <td class="align-middle">{{ comentario.fechaComentario }}</td>
                <td class="align-middle">{{ comentario.clienteEmail }}</td>
                <td class="align-middle">{{ comentario.clienteMensaje }}</td>
                <td class="align-middle">{{ comentario.clienteValor }}</td>
                <td class="text-center align-middle pale-yellow table-warning" v-if="isAdmin">
                  <div v-if="isAdmin"> 
                    <button class="btn btn-warning m-2" @click="selelccionarcomentario(comentario)">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    
                    <button class="btn btn-danger m-2" @click="eliminarcomentario(comentario)">
                      <i class="bi bi-trash"></i>
                    </button>
                  
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="d-flex justify-content-center my-3">
            <button class="btn btn-primary" :disable="currentPage === 1" @click.prevent="paginaAnterior">
              <i class="bi bi-chevron-left"> </i>
            </button>
            <span class="mx-3 align-self-center">Página {{ currentPage }}</span>

            <button class="btn btn-secondary" :disabled="currentPage * perPage >= this.comentarios.length"
              @click.prevent="siguientePagina">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // import NavBar from './NavBar.vue';
  import Swal from 'sweetalert2';
  
  export default {
    name: "TablaComentarios",
    components: {
      // NavBar
    },
  
    data() {
      return {
  
        comentario: {
          fechaComentario: '',
          clienteEmail: '',
          clienteMovil: '',
          lopd: '',
          clienteMensaje:'',
          clienteValor: 1, // Valor inicial de la valoracion
        },
        comentarios: [],
        currentPage: 1,
        pageSize: 5,
  
      };
    },

    mounted() {
      this.isAdmin = localStorage.getItem('isAdmin') === 'true';
      this.getcomentarios();
      
    },

    computed: {
    comentarioPorPagina() {
      const comentariosFiltrados = this.comentarios;
      const indiceInicial = (this.currentPage - 1) * this.pageSize;
      return comentariosFiltrados.slice(indiceInicial, indiceInicial + this.pageSize)
    },
  },

  methods: {
    siguientePagina() {
      if (this.currentPage * this.pageSize < this.comentarios.length) {
        this.currentPage++;
      }
    },

    paginaAnterior() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    setValor(n) {
      this.comentario.clienteValor = n;
    },

    async buscarEmail(email) {
      try {
        this.limpiarFormCli()
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const usuarios = await response.json();

        // Encontrar el usuario por su DNI
        const usuarioEncontrado = usuarios.find(c => c.email === email);


        if (usuarioEncontrado) {
          // Convertir la fecha de alta al formato dd/mm/yyyy
          this.comentario = { ...usuarioEncontrado };
          this.editEmail = true;
          console.log("cliente encontrado", this.comentario.clienteEmail);
          if (this.comentario.fechaComentario) {
            this.comentario.fechaComentario = this.comentario.fechaComentario.split('T')[0];  // Para asegurarse de que la fecha esté en formato YYYY-MM-DD
          }
        } else {
          this.mostrarAlerta('Error', 'Ese usuario no existe.', 'error');
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta('Error', 'No se pudo cargar el usuario desde el servidor.', 'error');
      }
    },


    async selelccionarcomentario(comentario) {
      try {
        this.limpiarFormCli()
        const response = await fetch('http://localhost:3000/comentarios');
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const comentarios = await response.json();

        // Encontrar el comentario por su nmbre
        const comentarioEncontrado = comentarios.find(c => c.clienteEmail === comentario.clienteEmail);


        if (comentarioEncontrado) {
          this.comentario = { ...comentarioEncontrado }
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta('Error', 'No se pudo cargar el comentario desde el servidor.', 'error');
      }
    },


    limpiarFormCli() {
      this.comentario = {
          fechaComentario: '',
          clienteEmail: '',
          clienteMovil: '',
          lopd: '',
          clienteMensaje:'',
          clienteValor: 1, // Valor inicial de la valoracion
        
      }

      this.editDni = false;
    },

    // Validar Email
    validarCorreo(correo){
      if (correo == '') {
        this.mostrarAlerta('Error', 'El email con formato no valido', 'error');
      }
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(correo)) {
        this.mostrarAlerta('Error', 'El email con formato no valido', 'error')
      }
    },
    // Validar Telefono
    validarTelefono(movil) {
      if (movil == '') {
        this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error'); 
      }
      const regex = /^[67]\d{8}$/;
      if (!regex.test(movil)) {
        this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error')
      }
    },


    async getcomentarios() {
      try {
        const response = await fetch('http://localhost:3000/comentarios');
        if (!response.ok) {
          throw new Error('Error en la solicitud:' + response.statusText);
        }
        this.comentarios = (await response.json()).sort((a, b) => a.clienteEmail.localeCompare(b.clienteEmail) );
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

    
    async grabarcomentario() {
   // Verificar si los campos requeridos están llenos
   if (this.comentario.clienteEmail && this.comentario.clienteMovil && this.comentario.clienteValor && this.comentario.lopd) {
     try {
       if (this.comentario.id) {
         // Si el comentario tiene un id, significa que estamos editando
         const response = await fetch(`http://localhost:3000/comentarios/${this.comentario.id}`, {
           method: 'PUT',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(this.comentario),
         });

         if (!response.ok) {
           throw new Error('Error al actualizar el comentario: ' + response.statusText);
         }

         this.mostrarAlerta('Aviso', 'comentario actualizado correctamente', 'success');
       } else {
         // Si no tiene id, creamos un nuevo comentario
         const response = await fetch('http://localhost:3000/comentarios', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(this.comentario),
         });

         if (!response.ok) {
           throw new Error('Error al crear el comentario: ' + response.statusText);
         }

         this.mostrarAlerta('Aviso', 'Comentario creado correctamente', 'success');
       }

       // Actualizamos la lista de comentarios
       this.getcomentarios();

     } catch (error) {
       console.error(error);
       this.mostrarAlerta('Error', 'No se pudo grabar el comentario.', 'error');
     }
   } else {
     this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
   }
  },
 

    async eliminarcomentario(comentario) {
      const resultado= await Swal.fire(
        {
          title:'Confirmacion',
          html:`Seguro que desea eliminar a <strong>${comentario.clienteEmail}</strong> de la lista?`,
          icon:'warning',
          showCancelButton:true,
          confirmButtonColor:'#d33',
          cancelButtonColor:'rgb(0, 57, 172)',
          confirmButtonText:'Si,eliminar',
          cancelButtonText:'Cancelar'
        }
      )
      if (!resultado.isConfirmed){
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/comentarios");
        if (!response.ok) {
          throw new Error("Error en la solicitud: " + response.statusText);
        }

        const comentarios = await response.json();
        const comentarioExistente = comentarios.find(c => c.id === comentario.id);

        if (comentarioExistente) {
          await fetch(`http://localhost:3000/comentarios/${comentarioExistente.id}`, { 
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
          },
          });

          this.mostrarAlerta("Aviso", "comentario eliminado correctamente", "success");
          this.getcomentarios(); // Actualiza la lista de comentarios

        } else {
          this.mostrarAlerta("Error", "comentario no encontrado", "error");
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta("Error", "No se pudo eliminar al comentario", "error");
      }
    },

    async modificarcomentario() {
      if (this.comentario.id) {
        try {


          const response = await fetch(`http://localhost:3000/comentarios/${this.comentario.id}`, { // URL interpolada correctamente
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.comentario),
          });


          if (!response.ok) {
            throw new Error('Error al modificar el comentario:' + response.statusText);
          }
          this.mostrarAlerta("Aviso", "comentario modificado correctamente", "success");
          this.getcomentarios();

        } catch (error) {
          console.error(error);
        }
      } else {
        this.mostrarAlerta('Error', 'Debe seleccionar un comentario para modificar', 'error')
      }
    },
      async prueba() {
  
      },
  }
  }
  
  </script>
  
  <style scoped>
  .custom-date-input {
    width: 12em;
    text-align: center;
  }
  .star-valor {
  font-size: 2rem; /* TamaÃ±o de las estrellas */
  color: #ffc107; /* Color dorado */
  cursor: pointer;
}

.star-icon {
  margin-right: 5px;
}
  </style>