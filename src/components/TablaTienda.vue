<template>
    <br>

    <div class="row">
      <h5 class="font-weight-bold text-uppercase text-primary position-relative d-inline-block m-3">TIENDA<i class="bi bi-person-workspace m-2"></i></h5>
      <router-link to="/" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
    </div>

    <br>
    <div class="container my-5" v-if="isAdmin">
      <h2 class="mb-4">Lista de Datos de Candidatos</h2>
      <div class="container my-2">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead class="table-info rounded-header">
              <tr>
                <th scope="col" class="w-20">Apellidos</th>
                <th scope="col" class="w-20">Nombre</th>
                <th scope="col" class="w-20 text-center">Email</th>
                <th scope="col" class="w-10">Telefono</th>
                <th scope="col" class="w-10 text-center">Departamento</th>
                <th scope="col" class="w-10 text-center">Modalidad</th>
                <th scope="col" class="pale-yellow table-warning">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="candidato in candidatoPorPagina" :key="candidato.id">
                <td class="align-middle">{{ candidato.apellidos }}</td>
                <td class="align-middle">{{ candidato.nombre }}</td>
                <td class="align-middle">{{ candidato.email }}</td>
                <td class="align-middle">{{ candidato.movil }}</td>
                <td class="align-middle">{{ candidato.departamento.nm }}</td>


                <td class="align-middle">{{ candidato.modalidad }}</td>
                <td class="text-center align-middle pale-yellow table-warning">
                  <div>
                    <button class="btn btn-warning m-2" @click="selelccionarcandidato(candidato)">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    
                    <button class="btn btn-danger m-2" @click="eliminarcandidato(candidato)">
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

            <button class="btn btn-secondary" :disabled="currentPage * perPage >= this.candidatos.length"
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
    name: "TablaEmpleo",
    components: {
      // NavBar
    },
  
    data() {
      return {
  
        candidato: {
          apellidos: '',
          nombre: '',
          email: '',
          movil: '',
          modalidad: '',
          avisoLegal: '',
          comentarios:''
        },
        candidatos: [],
        departamentos: [],
        currentPage: 1,
        pageSize: 5,
  
      };
    },

    mounted() {
      this.getcandidatos();
      this.getDepartamentos();
      this.isAdmin = localStorage.getItem('isAdmin') === 'true';

    },

    computed: {
    candidatoPorPagina() {
      const candidatosFiltrados = this.candidatos;
      const indiceInicial = (this.currentPage - 1) * this.pageSize;
      return candidatosFiltrados.slice(indiceInicial, indiceInicial + this.pageSize)
    },
  },

  methods: {
    siguientePagina() {
      if (this.currentPage * this.pageSize < this.candidatos.length) {
        this.currentPage++;
      }
    },

    paginaAnterior() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    

    async selelccionarcandidato(candidato) {
      try {
        this.limpiarFormCli()
        const response = await fetch('http://localhost:3000/candidatos');
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const candidatos = await response.json();

        // Encontrar el candidato por su nmbre
        const candidatoEncontrado = candidatos.find(c => c.nombre === candidato.nombre);


        if (candidatoEncontrado) {
          this.candidato = { ...candidatoEncontrado }
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta('Error', 'No se pudo cargar el candidato desde el servidor.', 'error');
      }
    },


    limpiarFormCli() {
      this.candidato = {
          apellidos: '',
          nombre: '',
          email: '',
          movil: '',
          modalidad: '',
          avisoLegal: '',
          comentarios:''
        
      }

      this.editDni = false;
    },
    validarTelefono(movil) {
      if (movil == '') {
        this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error');
      }
      const regex = /^[67]\d{8}$/;
      if (!regex.test(movil)) {
        this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error')
      }
    },


    async getcandidatos() {
      try {
        const response = await fetch('http://localhost:3000/candidatos');
        if (!response.ok) {
          throw new Error('Error en la solicitud:' + response.statusText);
        }
        this.candidatos = (await response.json()).sort((a, b) => a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre));
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

    
    async grabarcandidato() {
   // Verificar si los campos requeridos están llenos
   if (this.candidato.apellidos && this.candidato.nombre && this.candidato.email && this.candidato.movil && this.candidato.modalidad && this.candidato.avisoLegal) {
    const resultado= await Swal.fire(
        {
          title:'Confirmacion',
          html:`Seguro que desea grabar al candidato a la lista?`,
          icon:'warning',
          showCancelButton:true,
          confirmButtonColor:'#d33',
          cancelButtonColor:'rgb(0, 57, 172)',
          confirmButtonText:'Si,añadir',
          cancelButtonText:'Cancelar'
        }
      )
      if (!resultado.isConfirmed){
        return;
      }
     try {
       if (this.candidato.id) {
         // Si el candidato tiene un id, significa que estamos editando
         const response = await fetch(`http://localhost:3000/candidatos/${this.candidato.id}`, {
           method: 'PUT',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(this.candidato),
         });

         if (!response.ok) {
           throw new Error('Error al actualizar el candidato: ' + response.statusText);
         }

         this.mostrarAlerta('Aviso', 'Candidato actualizado correctamente', 'success');
       } else {
         // Si no tiene id, creamos un nuevo candidato
         const response = await fetch('http://localhost:3000/candidatos', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(this.candidato),
         });

         if (!response.ok) {
           throw new Error('Error al crear el candidato: ' + response.statusText);
         }

         this.mostrarAlerta('Aviso', 'Candidato creado correctamente', 'success');
       }

       // Actualizamos la lista de candidatos
       this.getcandidatos();

     } catch (error) {
       console.error(error);
       this.mostrarAlerta('Error', 'No se pudo grabar el candidato.', 'error');
     }
   } else {
     this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
   }
  },
 

    async eliminarcandidato(candidato) {
      const resultado= await Swal.fire(
        {
          title:'Confirmacion',
          html:`Seguro que desea eliminar a <strong>${candidato.nombre} ${candidato.apellidos}</strong> de la lista?`,
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
        const response = await fetch("http://localhost:3000/candidatos");
        if (!response.ok) {
          throw new Error("Error en la solicitud: " + response.statusText);
        }

        const candidatos = await response.json();
        const candidatoExistente = candidatos.find(c => c.id === candidato.id);

        if (candidatoExistente) {
          await fetch(`http://localhost:3000/candidatos/${candidatoExistente.id}`, { 
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
          },
          });

          this.mostrarAlerta("Aviso", "Candidato eliminado correctamente", "success");
          this.getcandidatos(); // Actualiza la lista de candidatos

        } else {
          this.mostrarAlerta("Error", "Candidato no encontrado", "error");
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta("Error", "No se pudo eliminar al candidato", "error");
      }
    },

    async modificarcandidato() {
      if (this.candidato.id) {
        try {


          const response = await fetch(`http://localhost:3000/candidatos/${this.candidato.id}`, { // URL interpolada correctamente
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.candidato),
          });


          if (!response.ok) {
            throw new Error('Error al modificar el candidato:' + response.statusText);
          }
          this.mostrarAlerta("Aviso", "candidato modificado correctamente", "success");
          this.getcandidatos();

        } catch (error) {
          console.error(error);
        }
      } else {
        this.mostrarAlerta('Error', 'Debe seleccionar un candidato para modificar', 'error')
      }
    },
    


    async getDepartamentos() {
      try {
        const response = await fetch('http://localhost:3000/departamentos');
        if (!response.ok) {
          throw new Error('Error en la solicitud:' + response.statusText);
        }
        this.departamentos = await response.json();
      } catch (error) {
        console.error(error);
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
  </style>