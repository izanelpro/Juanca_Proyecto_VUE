<template>
  <div class="container text-center mt-4">
    <h5 class="panel-title"> <i class="bi bi-people-fill m-2"></i>GESTIÓN USUARIOS</h5>
    <router-link to="/" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
  </div>
  <br>

  <div class="container-fluid border p-4">
    <form class="form-in-line">
      <div class="col-10 col-m-6 col-lg-8 mx-auto">
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">DNI/NIE:</span>
          <input type="text" class="form-control sm w-25" placeholder="DNI-NIE" v-model="usuario.dni"
            @blur="validarDNI(this.usuario.dni)" :disabled="editDni">

          <button class="btn btn-primary m-1" @click.prevent="buscarDNI(this.usuario.dni)"><i class="bi bi-search"></i></button>

          <span class="input-group-text custom-span ms-auto me-2">Fecha Alta:</span>
          <input type="date" class="form-control sm w-25" placeholder="Fecha Alta" v-model="usuario.alta">
          <button class="input-group-text custom-span m-2 bg-primary text-light"><i
              class="bi bi-calendar-week"></i></button>
        </div>
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Apellidos: </span>
          <input type="text" class="form-control sm w-50" placeholder="Apellidos" v-model="usuario.apellidos">
          <span class="input-group-text custom-span ms-2 me-2">Nombre: </span>
          <input type="text" class="form-control sm w-50" placeholder="Nombre" v-model="usuario.nombre">
        </div>
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Dirección: </span>
          <input type="text" class="form-control sm w-50" placeholder="Dirección" v-model="usuario.direccion">
          <span class="input-group-text custom-span ms-2 me-2">Email: </span>
          <input type="email" class="form-control sm w-50" placeholder="Email" v-model="usuario.email">
          <span class="input-group-text custom-span me-2">Teléfono:</span>
          <input class="form-control sm w-25" type="text" v-model="usuario.telefono"
            @blur="validarTelefono(this.usuario.telefono)">
        </div>

        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2 ms-2">Provincia: </span>
          <select name="provincia" class="form-control sm w-25" v-model="usuario.provincia">
            <option value="">Provincia</option>
            <option v-for="provincia in provincias" :key="provincia.id" :value="provincia">
              {{ provincia.nm }}
            </option>
          </select>
          <span class="input-group-text custom-span ms-2 me-2">Municipio: </span>
          <select name="municipio" class="form-control sm w-50" v-model="usuario.municipio">
            <option value="">Municipio</option>
            <option v-for="municipio in municipiosFiltrados" :key="municipio.id" :value="municipio">
              {{ municipio.nm }}
            </option>
          </select>
          <span class="input-group-text custom-span me-2 ms-2">Tipo Usuario: </span>
          <select name="provincia" class="form-control sm w-25" v-model="usuario.tipo">
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <input type="checkbox" class="m-2" name="historico" v-model="isChecked">
          <label for="bg input-group-text custom-span ms-2 me-2">Histórico</label>

          <button class="btn btn-light m-1" @click="limpiarFormCli()">
            <i class="bi-arrow-clockwise"></i>
          </button>

        </div>
      </div>
      <button class="btn btn-primary m-1" @click.prevent="grabarusuario">
        <i class="bi bi-arrow-up-square mr-2"></i> Alta
      </button>
      <button class="btn btn-primary m-1" @click.prevent="modificarusuario">
        <i class="bi bi-pencil mr-2"></i>Modificar
      </button>
      <button class="btn btn-primary m-1" @click.prevent="eliminarusuario">
        <i class="bi bi-trash3 mr-2"></i>Eliminar
      </button>
    </form>
  </div>


  <div>
    <div class="container my-5">
      <h3 class="mb-4 text-primary"><i class="bi bi-person-lines-fill"></i> Lista de Datos de Usuario</h3>
      <div class="container my-2">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead class="table-info rounded-header">
              <tr>
                <th scope="col" class="w-15 text-center">DNI</th>
                <th scope="col" class="w-20">Apellidos</th>
                <th scope="col" class="w-20">Nombre</th>
                <th scope="col" class="w-20 text-center">Email</th>
                <th scope="col" class="w-10">Telefono</th>
                <th scope="col" class="w-10 text-center">Tipo</th>
                <th scope="col" class="w-10 text-center">Fecha Baja</th>
                <th scope="col" class="pale-yellow table-warning">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarioPorPagina" :key="usuario.id">
                <td class="align-middle">{{ usuario.dni }}</td>
                <td class="align-middle">{{ usuario.apellidos }}</td>
                <td class="align-middle">{{ usuario.nombre }}</td>
                <td class="align-middle">{{ usuario.email }}</td>
                <td class="align-middle">{{ usuario.telefono }}</td>
                <td class="align-middle">{{ usuario.tipo }}</td>
                <td class="align-middle">{{ usuario.baja }}</td>
                <td class="text-center align-middle pale-yellow table-warning">
                  <div>
                    <button class="btn btn-warning m-2" @click="seleccionausuario(usuario)">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <!--
                    <button class="btn btn-danger m-2" @click="deleteusuario(usuario.dni)">
                      <i class="bi bi-trash"></i>
                    </button>
                    -->
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

            <button class="btn btn-secondary" :disabled="currentPage * perPage >= filtrousuarios.length"
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
  name: "Tabla-usuarios",
  components: {
    
  },

  data() {
    return {

      usuario: {
        dni: '',
        alta: '',
        apellidos: '',
        nombre: '',
        direccion: '',
        email: '',
        provincia: '',
        municipio: '',
        baja: '',
        telefono: '',
        tipo:'usuario'
      },

      usuarios: [],
      provincias: [],
      municipios: [],
      errores: [],
      currentPage: 1,
      pageSize: 5,
      isChecked: false,
      editDni: false
    };
  },

  mounted() {
    this.getusuarios();
    this.getProvincias();
    this.getMunicipios();
  },


  computed: {
    usuarioPorPagina() {
      const cleintesFiltrados = this.filtrousuarios;
      const indiceInicial = (this.currentPage - 1) * this.pageSize;
      return cleintesFiltrados.slice(indiceInicial, indiceInicial + this.pageSize)
    },

    filtrousuarios() {
      if (this.isChecked) {
        return this.usuarios;
      } else {
        return this.usuarios.filter(usuario => !usuario.baja);
      }
    },

    municipiosFiltrados() {
      if (!this.usuario.provincia || !this.usuario.provincia.id) return [];

      return this.municipios.filter(municipio =>
        municipio.id.startsWith(this.usuario.provincia.id)
      )
    },
  },

  methods: {
    siguientePagina() {
      if (this.currentPage * this.pageSize < this.usuarios.length) {
        this.currentPage++;
      }
    },



    paginaAnterior() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    async buscarDNI(dni) {
      try {
        this.limpiarFormCli()
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const usuarios = await response.json();

        // Encontrar el usuario por su DNI
        const usuarioEncontrado = usuarios.find(c => c.dni === dni);


        if (usuarioEncontrado) {
          // Convertir la fecha de alta al formato dd/mm/yyyy
          // Asignar el objeto completo de provincia y municipio
          if (this.usuario.provincia) {
            this.usuario.provincia = this.provincias.find(p => p.nm === this.usuario.provincia).nm;
            if (this.usuario.provincia) {
              console.log("Provincia encontrada", this.usuario.provincia);

            }
          }

          this.usuario = { ...usuarioEncontrado };
          this.editDni = true;
          console.log("usuario encontrado", this.usuario.municipio);
          if (this.usuario.alta) {
            this.usuario.alta = this.usuario.alta.split('T')[0];  // Para asegurarse de que la fecha esté en formato YYYY-MM-DD
          }
        } else {
          this.mostrarAlerta('Error', 'Ese usuario no existe.', 'error');
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta('Error', 'No se pudo cargar el usuario desde el servidor.', 'error');
      }
    },
    async seleccionausuario(usuario) {
      try {
        this.limpiarFormCli()
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const usuarios = await response.json();

        // Encontrar el usuario por su DNI
        const usuarioEncontrado = usuarios.find(c => c.dni === usuario.dni);


        if (usuarioEncontrado) {
          // Convertir la fecha de alta al formato dd/mm/yyyy
          // Asignar el objeto completo de provincia y municipio
          if (this.usuario.provincia) {
            this.usuario.provincia = this.provincias.find(p => p.nm === this.usuario.provincia).nm;
            if (this.usuario.provincia) {
              console.log("Provincia encontrada", this.usuario.provincia);

            }
          }

          this.usuario = { ...usuarioEncontrado };
          this.editDni = true;
          console.log("usuario encontrado", this.usuario.municipio);
          if (this.usuario.alta) {
            this.usuario.alta = this.usuario.alta.split('T')[0];  // Para asegurarse de que la fecha esté en formato YYYY-MM-DD
          }
        } else {
          this.mostrarAlerta('Error', 'usuario no encontrado en el servidor.', 'error');
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta('Error', 'No se pudo cargar el usuario desde el servidor.', 'error');
      }
    },


    limpiarFormCli() {
      this.usuario = {
        dni: '',
        alta: '',
        apellidos: '',
        nombre: '',
        direccion: '',
        email: '',
        provincia: '',
        municipio: '',
        baja: ''
      }

      this.editDni = false;
    },

    validarDNI(dni) {
      if (dni === '') {
        // Si el campo está vacío, no hace nada
        return true;
      }
      dni = dni.toUpperCase(); // Convertir a mayúsculas
      this.usuario.dni = dni;
      // Comprobar el formato del DNI/NIE
      const dniRegex = /^[XYZ0-9][0-9]{7}[A-Z]$/; // Formato 8 dígitos seguido de 1 letra

      if (!dniRegex.test(dni)) {
        this.mostrarAlerta('Error', 'El NIE/DNI con formato no válido.', 'error');
        return false;
      }

      // Inicializar variables para el cálculo
      let dniNum = dni.substring(0, 8); // Extraer los númerhttp://localhost:3000/provinciasos
      const letra = dni.charAt(8); // Obtener la letra en la posición 8
      // Identificación del NIE y sustitución
      if (dniNum.charAt(0) === 'X') {
        dniNum = dniNum.substring(1, 8)
        dniNum = '0' + dniNum; // Sustituir X por 0
      } else if (dniNum.charAt(0) === 'Y') {
        dniNum = dniNum.substring(1, 8)
        dniNum = '1' + dniNum; // Sustituir Y por 1
      } else if (dni.charAt(0) === 'Z') {
        dniNum = dniNum.substring(1, 8)
        dniNum = '2' + dniNum; // Sustituir Z por 2
      }

      // Comprobar la letra esperada
      const letras = 'TRWAGMYFPDXBNJZSQVHLCKE'; // Letras válidas para el DNI
      const letraCalculada = letras[dniNum % 23]; // Calcular la letra esperada
      if (letra !== letraCalculada) {
        this.mostrarAlerta('Error', 'DNI/NIE Incorrecto.', 'error');
        return false;
      }

      return true; // DNI/NIE válido

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

    async getusuarios() {
      try {
        const response = await fetch('http://localhost:3000/usuarios');
        if (!response.ok) {
          throw new Error('Error en la solicitud:' + response.statusText);
        }
        this.usuarios = (await response.json()).sort((a, b) => a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre));
      } catch (error) {
        console.error(error);
      }
    },

    async getProvincias() {
      try {
        const response = await fetch('http://localhost:3000/provincias');
        if (!response.ok) {
          throw new Error('Error en la solicitud:' + response.statusText);
        }
        this.provincias = await response.json();
      } catch (error) {
        console.error(error);
      }
    },

    async getMunicipios() {
      try {
        const response = await fetch('http://localhost:3000/municipios');
        if (!response.ok) {
          throw new Error('Error en la solicitud:' + response.statusText);
        }
        this.municipios = await response.json();
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
    obtenerFechaHoy() {
      const fecha = new Date();
      const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
      //return fecha.toLocaleDateString('es-ES');  // Formato dd/mm/yyyy
      return fechaFormateada;
    },

    async grabarusuario() {
      // Verificar si los campos requeridos están llenos
      if (this.usuario.dni && this.usuario.apellidos && this.usuario.telefono) {
        try {
          this.usuario.baja = '';
          // Obtener los usuarios existentes
          const response = await fetch('http://localhost:3000/usuarios');
          if (!response.ok) {
            throw new Error('Error al obtener los usuarios: ' + response.statusText);
          }

          const usuariosExistentes = await response.json();

          const usuarioExistente = usuariosExistentes.find(usuario => usuario.dni === this.usuario.dni);

          if (usuarioExistente) {

            usuarioExistente.baja = '';
            const actualizarResponse = await fetch(`http://localhost:3000/usuarios/${usuarioExistente.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(usuarioExistente),
            });

            if (!actualizarResponse.ok) {
              throw new Error('Error al actualizar el usuario: ' + actualizarResponse.statusText);
            }

            this.mostrarAlerta('Aviso', 'usuario reactivado correctamente', 'success');
            this.getusuarios();
          } else {
            const crearResponse = await fetch('http://localhost:3000/usuarios', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(this.usuario),
            });

            if (!crearResponse.ok) {
              throw new Error('Error al guardar el usuario: ' + crearResponse.statusText);
            }

            const nuevousuario = await crearResponse.json();
            this.usuarios.push(nuevousuario);
            this.mostrarAlerta('Aviso', 'usuario grabado correctamente', 'success');
            this.getusuarios();
          }
        } catch (error) {
          console.error(error);
          this.mostrarAlerta('Error', 'No se pudo grabar el usuario.', 'error');
        }
      } else {
        this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
      }
    },

    async eliminarusuario() {
      try {
        const response = await fetch("http://localhost:3000/usuarios");
        if (!response.ok) {
          throw new Error("Error en la solicitud: " + response.statusText);
        }

        const usuarios = await response.json();
        const usuarioExistente = usuarios.find(usuario => usuario.dni === this.usuario.dni);

        if (usuarioExistente) {
          const fechaHoy = this.obtenerFechaHoy(); // Llamada a la función correctamente

          usuarioExistente.baja = fechaHoy;

          await fetch(`http://localhost:3000/usuarios/${usuarioExistente.id}`, { // URL interpolada correctamente
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(usuarioExistente),
          });

          this.mostrarAlerta("Aviso", "usuario dado de baja correctamente", "success");
          this.getusuarios(); // Actualizar lista de usuarios

        } else {
          this.mostrarAlerta("Error", "usuario no encontrado", "error");
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta("Error", "No se pudo dar de baja al usuario", "error");
      }
    },

    async modificarusuario() {
      if (this.usuario.dni) {
        try {


          const response = await fetch(`http://localhost:3000/usuarios/${this.usuario.id}`, { // URL interpolada correctamente
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.usuario),
          });


          if (!response.ok) {
            throw new Error('Error al modificar el usuario:' + response.statusText);
          }
          this.mostrarAlerta("Aviso", "usuario modificado correctamente", "success");
          this.getusuarios();

        } catch (error) {
          console.error(error);
        }
      } else {
        this.mostrarAlerta('Error', 'Debe seleccionar un usuario para modificar', 'error')
      }
    },


  },
}

</script>

<style scoped>
.panel-title {
  font-weight: bold;
  text-transform: uppercase;
  color: #007bff;
  display: inline-block;
  padding-bottom: 5px;
  border-bottom: 3px solid #007bff;
  font-size: 24px;
  margin: 10px;
}
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

.btn-customb {
  position: absolute;
  font-size: 22px;
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s, transform 0.2s;
}

.btn-customb:hover {
  color: #0056b3;
  transform: translateX(-5px);
}
</style>