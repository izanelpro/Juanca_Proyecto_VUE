<template>
    <br>

    <div class="row">
      <h5 class="text-center front-weight-bold">Trabaja con nosotros</h5>
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
            <span class="input-group-text custom-span me-2">Categoria: </span>
            <select class="input-group-text custom-span me-2" name="categoria" id="categoria" v-model="candidato.categoria">
              <option value="" disabled selected>Categoria</option>
              <option value="ventas">Ventas</option>
              <option value="compras">Compras</option>
              <option value="it">IT</option>
              <option value="logistica">Logistica</option>
              <option value="juridico">Juridico</option>
            </select>
            <span class="input-group-text custom-span ms-auto me-2">Remoto: </span>  
            <input class="mx-4" type="radio" name="modalidad" id="modalidad" value="remoto" v-model="candidato.modalidad">
            <label for="remoto">Remoto</label>
            <input class="mx-4" type="radio" name="modalidad" id="modalidad" value="hibrido" v-model="candidato.modalidad">
            <label for="hibrido">Híbrido</label>
            <input class="mx-4" type="radio" name="modalidad" id="modalidad" value="presencial" v-model="candidato.modalidad">
            <label for="presencial">Presencial</label>
          </div>
  
          <!-- CV -->
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span me-2">CV(PDF): </span>
            <input type="file" class="form-control sm w-50">
          </div>
        </div>

        <!-- Submit -->
        <button class="btn btn-primary m-1" @click.prevent="grabarcandidato">Alta</button>
      </form>
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
          categoria: '',
          modalidad: ''
        },
        candidatos: []
  
      };
    },
  
    methods: {
  
      validarTelefono(telefono) {
        if (telefono == '') {
          this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error');
        }
        const regex = /^[67]\d{8}$/;
        if (!regex.test(telefono)) {
          this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error')
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
        console.error("Esta tirando")
  
        if (this.candidato.apellidos && this.candidato.nombre && this.candidato.email && this.candidato.movil && this.candidato.categoria && this.candidato.modalidad) {
          try {
  
  
            const crearResponse = await fetch('http://localhost:3000/candidatos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(this.candidato),
            });
  
            if (!crearResponse.ok) {
              throw new Error('Error al guardar el candidato: ' + crearResponse.statusText);
            }
  
            const nuevoCandidato = await crearResponse.json();
            this.candidatos.push(nuevoCandidato);
            this.mostrarAlerta('Aviso', 'Cliente grabado correctamente', 'success');
            //this.getClientes();
  
  
          }
          catch (error) {
            console.error(error);
            this.mostrarAlerta('Error', 'No se pudo grabar el cliente.', 'error');
          }
  
        }
        else {
          this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
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