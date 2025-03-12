<template>
  <div class="">
    <h3 class="text-center front-weight-bold mt-4 text-primary" id="titulo"><i class="bi bi-person-vcard"></i> TRABAJA
      CON NOSOTROS
      <router-link to="/" class="text-dark"><button class="btn btn-customb"><i
            class="bi bi-arrow-return-left"></i></button></router-link>
    </h3>
  </div>
  <br>
  <div class="container-fluid border p-4">
    <form class="form-in-line">
      <div class="col-10 col-m-6 col-lg-8 mx-auto">
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Apellidos:</span>
          <input type="text" class="form-control sm w-50" required placeholder="Apellidos"
            v-model="candidato.apellidos">

          <span class="input-group-text custom-span ms-2 me-2">Nombre:</span>
          <input type="text" class="form-control sm w-50" required placeholder="Nombre" v-model="candidato.nombre">
        </div>

        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span ms-2 me-2">Email: </span>
          <input type="email" class="form-control sm w-75" required placeholder="Email" v-model="candidato.email"
            @blur="validarEmail(this.candidato.email)">

          <span class="input-group-text custom-span ms-2 me-2">Móvil:</span>
          <input class="form-control sm w-25" type="text" required placeholder="Móvil" v-model="candidato.movil"
            @blur="validarTelefono(this.candidato.movil)">
        </div>

        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span ms-2 me-2">Departamento:</span>
          <select name="departamento" class="form-control sm w-50" v-model="candidato.departamento">
            <option value="" disabled>Departamento</option>
            <option v-for="departamento in departamentos" :key="departamento.id" :value="departamento">
              {{ departamento.nm }}
            </option>
          </select>


          <span class="input-group-text custom-span ms-2 me-2">Modalidad:</span>
          <div class="m-auto">
            <input type="radio" class="ms-2 me-1" name="modalidad" id="remoto" value="remoto"
              v-model="candidato.modalidad"><label for="remoto" class="me-2">Remoto</label>
            <input type="radio" class="ms-2 me-1" name="modalidad" id="hibrido" value="hibrido"
              v-model="candidato.modalidad"><label for="hibrido" class="me-2">Híbrido</label>
            <input type="radio" class="ms-2 me-1" name="modalidad" id="presencial" value="presencial"
              v-model="candidato.modalidad"><label for="presencial" class="me-2">Presencial</label>
          </div>

        </div>
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span ms-2 me-2">Comentarios: </span>
          <textarea maxlength="256" class="form-control" cols="30" rows="5"
            placeholder="Comentarios (máximo 256 caracteres)" v-model="candidato.comentarios"
            @blur="validarComent(this.candidato.comentarios)"></textarea>
        </div>

        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span ms-2 me-2">CV (PDF): </span>
          <input type="file" placeholder="Selecciona un archivo" class="custom-file-input form-control" id="archivo"
            name="archivo" accept=".pdf" @change="handleFileUpload" ref="fileInput">
            <button class="btn btn-light m-1" @click="limpiarFormCand()">
            <i class="bi-arrow-clockwise"></i>
          </button>
        </div>
        <div class="d-flex justify-content-start">
          <input type="checkbox" name="avisoleagal" id="avisolegal" v-model="avisolegal" required><label
            for="avisolegal" class="mx-2"> He leído y acepto las
            <router-link to="/privacidad" exact-active-class="active">Políticas de Privacidad</router-link></label>
        </div>
      </div>
      <button class="btn btn-primary m-1" @click.prevent="grabarCandidato" :disabled="!this.avisolegal">Enviar</button>
    </form>
  </div>


  <div v-if="isAdmin">
    <div class="container my-5">
      <h3 class="mb-4 text-primary"><i class="bi bi-tools"></i> Lista de Candidatos</h3>
      <div class="container my-2">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead class="table-info rounded-header">
              <tr>
                <th scope="col" class="w-25">Apellidos</th>
                <th scope="col" class="w-20">Nombre</th>
                <th scope="col" class="w-10">Movil</th>
                <th scope="col" class="w-10">Departamento</th>
                <th scope="col" class="w-10 text-center">Modalidad</th>
                <th scope="col" class="pale-yellow table-warning">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="candidato in candidatos" :key="candidato.id">
                <td class="align-middle">{{ candidato.apellidos }}</td>
                <td class="align-middle text-start">{{ candidato.nombre }}</td>
                <td class="align-middle">{{ candidato.movil }}</td>
                <td class="align-middle">{{ candidato.departamento.nm }}</td>
                <td class="align-middle">{{ candidato.modalidad }}</td>
                <td class="text-center align-middle pale-yellow table-warning">
                  <div>
                    <button class="btn btn-warning m-2" @click="seleccionaCandidato(candidato)">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn btn-danger m-2" @click="deleteCandidato(candidato.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: "TablaEmpleo",
  components: {
  },

  data() {
    return {
      candidato: {
        apellidos: '',
        nombre: '',
        email: '',
        movil: '',
        departamento: '',
        modalidad: '',
        comentarios: ''
      },
      avisolegal: '',
      cvFile: null,
      editMovil: false,
      candidatos: [],
      departamentos: [],
      isAdmin: false
    }
  },

  mounted() {
    this.getDepartamentos();
    this.getCandidatos();
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
  },

  methods: {
    limpiarFormCand() {
      this.candidato = {
        apellidos: '',
        nombre: '',
        email: '',
        movil: '',
        departamento: '',
        modalidad: '',
        comentarios: '',
      }

      this.avisolegal = '',
        this.cvFile = null,
        this.$refs.fileInput.value = null;
      this.editMovil = false
    },

    validarTelefono(telefono) {
      if (telefono == '') {
        this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error');
      }
      const regex = /^[67]\d{8}$/;
      if (!regex.test(telefono)) {
        this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error')
      }
    },

    validarEmail(email) {
      if (email == '') {
        this.mostrarAlerta('Error', 'El email con formato no valido', 'error');
      }
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regex.test(email)) {
        this.mostrarAlerta('Error', 'El email con formato no valido', 'error')
      }
    },

    validarComent(comentarios) {
      if (comentarios.length > 256) {
        this.mostrarAlerta('Error', 'El comentario tiene que ser de menos de 256 caracteres', 'error')
      }
    },

    async getCandidatos() {
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

    handleFileUpload(event) {
      this.cvFile = event.target.files[0];
    },

    async grabarCandidato() {
      if (this.candidato.apellidos && this.candidato.nombre && this.candidato.email && this.candidato.movil && this.candidato.departamento && this.candidato.modalidad && this.avisolegal) {
        try {
          const response = await fetch('http://localhost:3000/candidatos');
          if (!response.ok) {
            throw new Error('Error al obtener los candidatos: ' + response.statusText);
          }

          const candidatosExistentes = await response.json();

          let candidatoExistente = candidatosExistentes.find(candidato => candidato.email === this.candidato.email);

          if (this.candidato.comentarios && this.candidato.comentarios.length > 256) {
            throw new Error("El comentario no puede ser mayor de 256 carácteres");
          }

          if (candidatoExistente) {

            if (candidatoExistente.departamento === this.candidato.departamento) {
              throw new Error("Ya tiene una solicitud en este departamento")
            } else {
              this.createCandidato();
              if (this.cvFile !== null) {
                this.submitFile();
              }
            }
          } else {
            this.createCandidato();
            if (this.cvFile !== null) {
              this.submitFile();
            }
          }
        } catch (error) {
          console.error(error);
          this.mostrarAlerta('Error', error.message, 'error');
        }
      } else {
        this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
      }

    },

    async submitFile() {
      if (!this.cvFile) {
        console.error("No hay archivo para subir");
        return;
      }

      const formdata = new FormData();
      const candidatoId = this.candidato.movil || 'default';
      const nuevoArchivo = new File([this.cvFile], `${candidatoId}.pdf`, { type: 'application/pdf' });

      formdata.append("archivo", nuevoArchivo);
      formdata.append("candidatoId", candidatoId);

      try {
        const uploadResponse = await fetch('http://localhost:5000/subircv', {
          method: 'POST',
          body: formdata,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Error al subir el CV: ${uploadResponse.statusText}`);
        }

        console.log('CV subido con éxito:', await uploadResponse.json());
      } catch (error) {
        console.error("Error en submitFile:", error);
      }
    },


    async createCandidato() {
      const crearResponse = await fetch('http://localhost:3000/candidatos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.candidato)
      });

      if (!crearResponse.ok) {
        throw new Error('Error al guardar el candidato: ' + crearResponse.statusText);
      }

      const nuevoCandidato = await crearResponse.json();
      this.candidatos.push(nuevoCandidato);
      this.mostrarAlerta('Aviso', 'Candidato agregado correctamente', 'success');
      this.getCandidatos();
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

    async seleccionaCandidato(candidato) {
      try {
        this.limpiarFormCand()
        const response = await fetch('http://localhost:3000/candidatos');
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const candidatos = await response.json();

        const candidatoEncontrado = candidatos.find(c => c.id === candidato.id);


        if (candidatoEncontrado) {
          this.avisolegal = true
          this.candidato = { ...candidatoEncontrado };
          this.editMovil = true
        } else {
          this.mostrarAlerta('Error', 'Candidato no encontrado en el servidor.', 'error');
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta('Error', 'No se pudo cargar el candidato desde el servidor.', 'error');
      }
    },

    async deleteCandidato(id) {
      const resultado = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar el candidato?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
      })

      if (resultado.isConfirmed) {
        try {
          const response = await fetch("http://localhost:3000/candidatos");
          if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
          }

          const candidatos = await response.json();
          const candidatoExistente = candidatos.find(candidato => candidato.id === id);

          if (candidatoExistente) {
            await fetch(`http://localhost:3000/candidatos/${candidatoExistente.id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(candidatoExistente),
            });

            this.mostrarAlerta("Aviso", "Candidato dado de baja correctamente", "success");
            this.getCandidatos();

          } else {
            this.mostrarAlerta("Error", "Candidato no encontrado", "error");
          }
        } catch (error) {
          console.error(error);
          this.mostrarAlerta("Error", "No se pudo dar de baja al candidato", "error");
        }
      }
    },

  }
}
</script>

<style></style>