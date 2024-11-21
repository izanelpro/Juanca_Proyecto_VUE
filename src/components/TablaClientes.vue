<template>
  <div class="row">
    <h5 class="text-center front-weight-bold">GESTIÓN CLIENTES</h5>
  </div>

  <div class="container-fluid border p-4">
    <form class="form-in-line">
      <div class="col-10 col-m-6 col-lg-8 mx-auto">
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">DNI/NIE:</span>
          <input type="text" class="form-control sm w-25" placeholder="DNI-NIE" v-model="cliente.dni"
            @blur="validarDNI(this.cliente.dni)" :disabled="editDni">

          <button class="btn btn-primary m-1" @click.prevent="buscarDNI(this.cliente.dni)"><i class="bi bi-search"></i></button>

          <span class="input-group-text custom-span ms-auto me-2">Fecha Alta:</span>
          <input type="date" class="form-control sm w-25" placeholder="Fecha Alta" v-model="cliente.alta">
          <button class="input-group-text custom-span m-2 bg-primary text-light"><i
              class="bi bi-calendar-week"></i></button>
        </div>
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Apellidos: </span>
          <input type="text" class="form-control sm w-50" placeholder="Apellidos" v-model="cliente.apellidos">
          <span class="input-group-text custom-span ms-2 me-2">Nombre: </span>
          <input type="text" class="form-control sm w-50" placeholder="Nombre" v-model="cliente.nombre">
        </div>
        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Dirección: </span>
          <input type="text" class="form-control sm w-50" placeholder="Dirección" v-model="cliente.direccion">
          <span class="input-group-text custom-span ms-2 me-2">Email: </span>
          <input type="email" class="form-control sm w-50" placeholder="Email" v-model="cliente.email">
        </div>

        <div class="input-group-text mb-3">
          <span class="input-group-text custom-span me-2">Teléfono:</span>
          <input class="form-control sm w-25" type="text" v-model="cliente.telefono"
            @blur="validarTelefono(this.cliente.telefono)">
          <span class="input-group-text custom-span me-2 ms-2">Provincia: </span>
          <select name="provincia" class="form-control sm w-25" v-model="cliente.provincia">
            <option value="">Provincia</option>
            <option v-for="provincia in provincias" :key="provincia.id" :value="provincia">
              {{ provincia.nm }}
            </option>
          </select>
          <span class="input-group-text custom-span ms-2 me-2">Municipio: </span>
          <select name="municipio" class="form-control sm w-50" v-model="cliente.municipio">
            <option value="">Municipio</option>
            <option v-for="municipio in municipiosFiltrados" :key="municipio.id" :value="municipio">
              {{ municipio.nm }}
            </option>
          </select>

          <input type="checkbox" class="m-2" name="historico" v-model="isChecked">
          <label for="bg input-group-text custom-span ms-2 me-2">Histórico</label>

          <button class="btn btn-light m-1" @click="limpiarFormCli()">
            <i class="bi-arrow-clockwise"></i>
          </button>

        </div>
      </div>
      <button class="btn btn-primary m-1" @click.prevent="grabarcliente">Alta</button>
      <button class="btn btn-primary m-1" @click.prevent="modificarcliente">Modificar</button>
      <button class="btn btn-primary m-1" @click.prevent="eliminarcliente">Eliminar</button>
    </form>
  </div>


  <div>
    <div class="container my-5">
      <h2 class="mb-4">Lista de Datos</h2>
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
                <th scope="col" class="w-10 text-center">Fecha Baja</th>
                <th scope="col" class="pale-yellow table-warning">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cliente in clientePorPagina" :key="cliente.id">
                <td class="align-middle">{{ cliente.dni }}</td>
                <td class="align-middle">{{ cliente.apellidos }}</td>
                <td class="align-middle">{{ cliente.nombre }}</td>
                <td class="align-middle">{{ cliente.email }}</td>
                <td class="align-middle">{{ cliente.telefono }}</td>
                <td class="align-middle">{{ cliente.baja }}</td>
                <td class="text-center align-middle pale-yellow table-warning">
                  <div>
                    <button class="btn btn-warning m-2" @click="seleccionaCliente(cliente)">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <!--
                    <button class="btn btn-danger m-2" @click="deleteCliente(cliente.dni)">
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

            <button class="btn btn-secondary" :disabled="currentPage * perPage >= filtroClientes.length"
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
  name: "TablaClientes",
  components: {
    
  },

  data() {
    return {

      cliente: {
        dni: '',
        alta: '',
        apellidos: '',
        nombre: '',
        direccion: '',
        email: '',
        provincia: '',
        municipio: '',
        baja: '',
        telefono: ''
      },

      clientes: [],
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
    this.getClientes();
    this.getProvincias();
    this.getMunicipios();
  },


  computed: {
    clientePorPagina() {
      const cleintesFiltrados = this.filtroClientes;
      const indiceInicial = (this.currentPage - 1) * this.pageSize;
      return cleintesFiltrados.slice(indiceInicial, indiceInicial + this.pageSize)
    },

    filtroClientes() {
      if (this.isChecked) {
        return this.clientes;
      } else {
        return this.clientes.filter(cliente => !cliente.baja);
      }
    },

    municipiosFiltrados() {
      if (!this.cliente.provincia || !this.cliente.provincia.id) return [];

      return this.municipios.filter(municipio =>
        municipio.id.startsWith(this.cliente.provincia.id)
      )
    },
  },

  methods: {
    siguientePagina() {
      if (this.currentPage * this.pageSize < this.clientes.length) {
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
        const response = await fetch('http://localhost:3000/clientes');
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const clientes = await response.json();

        // Encontrar el cliente por su DNI
        const clienteEncontrado = clientes.find(c => c.dni === dni);


        if (clienteEncontrado) {
          // Convertir la fecha de alta al formato dd/mm/yyyy
          // Asignar el objeto completo de provincia y municipio
          if (this.cliente.provincia) {
            this.cliente.provincia = this.provincias.find(p => p.nm === this.cliente.provincia).nm;
            if (this.cliente.provincia) {
              console.log("Provincia encontrada", this.cliente.provincia);

            }
          }

          this.cliente = { ...clienteEncontrado };
          this.editDni = true;
          console.log("Cliente encontrado", this.cliente.municipio);
          if (this.cliente.alta) {
            this.cliente.alta = this.cliente.alta.split('T')[0];  // Para asegurarse de que la fecha esté en formato YYYY-MM-DD
          }
        } else {
          this.mostrarAlerta('Error', 'Ese cliente no existe.', 'error');
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta('Error', 'No se pudo cargar el cliente desde el servidor.', 'error');
      }
    },
    async seleccionaCliente(cliente) {
      try {
        this.limpiarFormCli()
        const response = await fetch('http://localhost:3000/clientes');
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const clientes = await response.json();

        // Encontrar el cliente por su DNI
        const clienteEncontrado = clientes.find(c => c.dni === cliente.dni);


        if (clienteEncontrado) {
          // Convertir la fecha de alta al formato dd/mm/yyyy
          // Asignar el objeto completo de provincia y municipio
          if (this.cliente.provincia) {
            this.cliente.provincia = this.provincias.find(p => p.nm === this.cliente.provincia).nm;
            if (this.cliente.provincia) {
              console.log("Provincia encontrada", this.cliente.provincia);

            }
          }

          this.cliente = { ...clienteEncontrado };
          this.editDni = true;
          console.log("Cliente encontrado", this.cliente.municipio);
          if (this.cliente.alta) {
            this.cliente.alta = this.cliente.alta.split('T')[0];  // Para asegurarse de que la fecha esté en formato YYYY-MM-DD
          }
        } else {
          this.mostrarAlerta('Error', 'Cliente no encontrado en el servidor.', 'error');
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta('Error', 'No se pudo cargar el cliente desde el servidor.', 'error');
      }
    },


    limpiarFormCli() {
      this.cliente = {
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
      this.cliente.dni = dni;
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

    async getClientes() {
      try {
        const response = await fetch('http://localhost:3000/clientes');
        if (!response.ok) {
          throw new Error('Error en la solicitud:' + response.statusText);
        }
        this.clientes = (await response.json()).sort((a, b) => a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre));
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

    async grabarcliente() {
      // Verificar si los campos requeridos están llenos
      if (this.cliente.dni && this.cliente.apellidos && this.cliente.telefono) {
        try {
          this.cliente.baja = '';
          // Obtener los clientes existentes
          const response = await fetch('http://localhost:3000/clientes');
          if (!response.ok) {
            throw new Error('Error al obtener los clientes: ' + response.statusText);
          }

          const clientesExistentes = await response.json();

          const clienteExistente = clientesExistentes.find(cliente => cliente.dni === this.cliente.dni);

          if (clienteExistente) {

            clienteExistente.baja = '';
            const actualizarResponse = await fetch(`http://localhost:3000/clientes/${clienteExistente.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(clienteExistente),
            });

            if (!actualizarResponse.ok) {
              throw new Error('Error al actualizar el cliente: ' + actualizarResponse.statusText);
            }

            this.mostrarAlerta('Aviso', 'Cliente reactivado correctamente', 'success');
            this.getClientes();
          } else {
            const crearResponse = await fetch('http://localhost:3000/clientes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(this.cliente),
            });

            if (!crearResponse.ok) {
              throw new Error('Error al guardar el cliente: ' + crearResponse.statusText);
            }

            const nuevoCliente = await crearResponse.json();
            this.clientes.push(nuevoCliente);
            this.mostrarAlerta('Aviso', 'Cliente grabado correctamente', 'success');
            this.getClientes();
          }
        } catch (error) {
          console.error(error);
          this.mostrarAlerta('Error', 'No se pudo grabar el cliente.', 'error');
        }
      } else {
        this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
      }
    },

    async eliminarcliente() {
      try {
        const response = await fetch("http://localhost:3000/clientes");
        if (!response.ok) {
          throw new Error("Error en la solicitud: " + response.statusText);
        }

        const clientes = await response.json();
        const clienteExistente = clientes.find(cliente => cliente.dni === this.cliente.dni);

        if (clienteExistente) {
          const fechaHoy = this.obtenerFechaHoy(); // Llamada a la función correctamente

          clienteExistente.baja = fechaHoy;

          await fetch(`http://localhost:3000/clientes/${clienteExistente.id}`, { // URL interpolada correctamente
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(clienteExistente),
          });

          this.mostrarAlerta("Aviso", "Cliente dado de baja correctamente", "success");
          this.getClientes(); // Actualizar lista de clientes

        } else {
          this.mostrarAlerta("Error", "Cliente no encontrado", "error");
        }
      } catch (error) {
        console.error(error);
        this.mostrarAlerta("Error", "No se pudo dar de baja al cliente", "error");
      }
    },

    async modificarcliente() {
      if (this.cliente.dni) {
        try {


          const response = await fetch(`http://localhost:3000/clientes/${this.cliente.id}`, { // URL interpolada correctamente
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.cliente),
          });


          if (!response.ok) {
            throw new Error('Error al modificar el cliente:' + response.statusText);
          }
          this.mostrarAlerta("Aviso", "Cliente modificado correctamente", "success");
          this.getClientes();

        } catch (error) {
          console.error(error);
        }
      } else {
        this.mostrarAlerta('Error', 'Debe seleccionar un cliente para modificar', 'error')
      }
    },


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