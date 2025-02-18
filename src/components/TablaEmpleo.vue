<template>
    <br>

    <div class="row">
      <h5 class="font-weight-bold text-uppercase text-primary position-relative d-inline-block m-3">TRABAJA CON NOSOTROS<i class="bi bi-person-workspace m-2"></i></h5>
      <router-link to="/" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
    </div>

    <br>
    <div class="container-fluid border p-4">
      <!-- Formulario -->
      <form class="form-in-line">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
  
          <!-- Nombres y Apellido -->
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span me-2">Apellidos: </span>
            <input type="text" class="form-control sm w-50" placeholder="Apellidos" v-model="candidato.apellidos">
            <span class="input-group-text custom-span ms-2 me-2">Nombre: </span>
            <input type="text" class="form-control sm w-50" placeholder="Nombre" v-model="candidato.nombre">
          </div>
  
          <!-- Email y Móvil -->
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span me-2">Email: </span>
            <input type="email" class="form-control sm w-50" placeholder="Correo electrónico" v-model="candidato.email">
            <span class="input-group-text custom-span ms-2 me-2">Móvil: </span>
            <input type="text" class="form-control sm w-50" placeholder="Móvil" v-model="candidato.movil
              " @blur="validarTelefono(this.candidato.movil)">
          </div>

          <!-- Categoría y Modalidad -->
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span me-2">Departamentos: </span>
            <select name="departamento" class="form-control sm w-25" v-model="candidato.departamento">
            <option value="">Departamentos</option>
            <option v-for="departamento in departamentos" :key="departamento.id" :value="departamento">
              {{ departamento.nm }}
            </option>
          </select>
            <span class="input-group-text custom-span ms-auto me-2">Remoto: </span>  
            <input class="mx-4" type="radio" name="modalidad" id="modalidad" value="remoto" v-model="candidato.modalidad">
            <label for="remoto">Remoto</label>
            <input class="mx-4" type="radio" name="modalidad" id="modalidad" value="hibrido" v-model="candidato.modalidad">
            <label for="hibrido">Híbrido</label>
            <input class="mx-4" type="radio" name="modalidad" id="modalidad" value="presencial" v-model="candidato.modalidad">
            <label for="presencial">Presencial</label>
          </div>
          <!--Comentarios-->
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span me-2">Comentarios: </span>
            <textarea name="comentarios" id="comentarios" cols="130" rows="5" v-model="candidato.comentarios"></textarea>
          </div>
          <!-- CV -->
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span me-2">CV(PDF): </span>
            <input type="file" class="form-control sm w-50" @change="manejarSubidaDeArchivo" />
          </div>

          <!-- Aceptar politica  -->
        <input type="checkbox" id="ckeckbox" v-model="candidato.avisoLegal">
        <label for="checkbox"> Acepto las condiciones y términos de la <router-link to="/avisoLegal" >Política de Privacidad</router-link></label><br>
          
        </div>
        
        <!-- Submit -->
        <button class="btn btn-primary m-1" @click.prevent="grabarcandidato">Alta</button>
      </form>
    </div>



    
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
                <td class="align-middle">{{ candidato.departamento ? candidato.departamento.nm : 'No Departamento' }}</td>



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
          cv: '',
          comentarios:''
        },
        candidatos: [],
        departamentos: [],
        cvFile: null,
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
    handleFileUpload(event) {
        this.cvFile = event.target.files[0];
      },
  
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

    async estasSeguro() {
              const result = await Swal.fire({
                  title: "¿Estás seguro?",
                  text: "¿Quieres actualizar este candidato?",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Aceptar',
                  cancelButtonText: 'Cancelar',
                  customClass: {
                      container: 'custom-alert-container',
                      popup: 'custom-alert-popup',
                      modal: 'custom-alert-modal',
                      confirmButton: 'btn-aceptar',
                      cancelButton: 'btn-cancelar',
                      closeButton: 'weqweqwe'
                  }
              });
  
              // Retorna true si el usuario acepta (hace clic en "Aceptar") o false si cancela
              return result.isConfirmed;
          },

    async grabarcandidato() {
  if (this.candidato.apellidos && this.candidato.nombre && this.candidato.email && this.candidato.movil && this.candidato.departamento && this.candidato.modalidad && this.candidato.avisoLegal) {
          try {
            const response = await fetch('http://localhost:3000/candidatos');
            if (!response.ok) {
              throw new Error('Error al obtener los candidatos: ' + response.statusText);
            }
  
            const candidatosExistentes = await response.json();
  
  
          const candidatoEncontrado = candidatosExistentes.find(c => c.movil === this.candidato.movil);
  
            //let candidatoExistente = candidatosExistentes.find(candidato => candidato.email === this.candidato.email);
  
            if (this.candidato.comentarios && this.candidato.comentarios.length > 256) {
              throw new Error("El comentario no puede ser mayor de 256 carácteres");
            }
  
            if (this.candidato.id) {
  
              /* if (candidatoExistente.departamento === this.candidato.departamento) {
                throw new Error("Ya tiene una solicitud en este departamento")
              } else {
                this.createCandidato();
                if (this.cvFile !== null) {
                  this.submitFile();
                }
  
              } */
              const confirmar = await this.estasSeguro();
  
                          if (confirmar) {
  
                            const candidatoData = { ...this.candidato };
                              // Realizar la actualización del candidato
                              const response = await fetch(`http://localhost:3000/candidatos/${this.candidato.id}`, {
                                  method: 'PUT',
                                  headers: {
                                      'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify(candidatoData),
                              });
  
                              if (!response.ok) {
                                  throw new Error('Error al actualizar el candidato: ' + response.statusText);
                              }
  
                              this.mostrarAlerta('Aviso', 'Candidato actualizado correctamente', 'success');
                              this.getcandidatos(); // Recargar la lista de candidatos
                              this.limpiarFormCli();
                          } else {
                              this.mostrarAlerta('Aviso', 'La actualización del candidato ha sido cancelada.', 'info');
                          }
            } else {
  
              if(candidatoEncontrado){
  
                throw new Error("Ya tiene una solicitud asociada a este número de móvil")
  
              }else{
  
  
              
              this.createCandidato();
              if (this.cvFile !== null) {
                this.submitFile();
                this.limpiarFormCli();
              }
            }}
          } catch (error) {
            console.error(error);
            this.mostrarAlerta('Error', error.message, 'error');
          }
        } else {
          this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
        }
  
      },
      async createCandidato() {
        const candidatoData = {
    ...this.candidato
    //,departamento: this.candidato.departamento.label  // Solo el id del departamento
  };
        const crearResponse = await fetch('http://localhost:3000/candidatos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          
          body: JSON.stringify(candidatoData)
        });
  
        if (!crearResponse.ok) {
          throw new Error('Error al guardar el candidato: ' + crearResponse.statusText);
        }
  
        const nuevoCandidato = await crearResponse.json();
        this.candidatos.push(nuevoCandidato);
        this.mostrarAlerta('Aviso', 'Candidato agregado correctamente', 'success');
        this.getcandidatos();
      },
   
    async submitFile() {
        const formdata = new FormData;
        const candidatoId = this.candidato.movil || 'default';
        const nuevoArchivo = new File([this.cvFile], `${candidatoId}.pdf`, { type: this.cvFile.type })
        formdata.append("archivo", nuevoArchivo);
        formdata.append("candidatoId", candidatoId)
        console.log(nuevoArchivo);
        const uploadResponse = await fetch('http://localhost:5000/subircv', {
          method: 'POST',
          body: formdata,
        });
  
        if (!uploadResponse.ok) {
          throw new Error('Error al subir el cv');
        } else {
          console.log('hubo respuesta: ', uploadResponse);
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