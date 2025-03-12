<template>
    <div class="container text-center mt-4">
      <h5 class="panel-title"><i
        class="bi bi-box-arrow-in-right m-2"></i>REGISTRARSE</h5>
    <router-link to="/tienda" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
    </div>
  
    <div class="container-fluid border p-4">
      <form class="form_reg">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span me-2">DNI/NIE:</span>
            <input type="text" class="form-control sm w-25" placeholder="DNI-NIE" v-model="usuario.dni"
              @blur="validarDNI(this.usuario.dni)" :disabled="editDni">
          </div>
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span me-2">Apellidos: </span>
            <input type="text" class="form-control sm w-50" placeholder="Apellidos" v-model="usuario.apellidos">
            <span class="input-group-text custom-span ms-2 me-2">Nombre: </span>
            <input type="text" class="form-control sm w-50" placeholder="Nombre" v-model="usuario.nombre">
          </div>
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span ms-2 me-2">Email: </span>
            <input type="email" class="form-control sm w-50" placeholder="Email" v-model="usuario.email"
            @blur="validarEmail(this.usuario.email)">
            <span class="input-group-text custom-span ms-2 me-2">Repetir Email: </span>
            <input type="email" class="form-control sm w-50" placeholder="Repita el Email" v-model="usuario.email2"
            @blur="validarEmail2(this.usuario.email2)">
            <span class="input-group-text custom-span me-2">Teléfono:</span>
            <input class="form-control sm w-25" type="text" v-model="usuario.telefono"
              @blur="validarTelefono(this.usuario.telefono)">
          </div>
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span ms-2 me-2">Contraseña: </span>
            <input type="password" class="form-control sm w-50" :class="{'error-border': passMismatch}" placeholder="Contraseña" v-model="usuario.pass">
            <span class="input-group-text custom-span ms-2 me-2">Repetir Contraseña: </span>
            <input type="password" class="form-control sm w-50" :class="{'error-border': passMismatch}" placeholder="Repita la contraseña" v-model="usuario.pass2"
            @blur="validarPass2(this.usuario.pass2)">
          </div>
  
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span me-2">Dirección: </span>
            <input type="text" class="form-control sm w-50" placeholder="Dirección" v-model="usuario.direccion">
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
          </div>
        </div>
        <button class="btn btn-primary m-1" @click.prevent="grabarusuario">
          Enviar
        </button>
      </form>
    </div>
</template>
  
  <script>
  import Swal from 'sweetalert2';
  import passport from '@/config/passport.mjs';
  
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
          email2:'',
          pass:'',
          pass2:'',
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
  
  
      limpiarFormCli() {
        this.usuario = {
          dni: '',
          alta: '',
          apellidos: '',
          nombre: '',
          direccion: '',
          email: '',
          email2:'',
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
          return false;
        }
        const regex = /^[67]\d{8}$/;
        if (!regex.test(telefono)) {
          this.mostrarAlerta('Error', 'El teléfono con formato no valido', 'error')
          return false;
        }
        return true;
      },
     validarEmail(email) {
        if (email == '') {
          this.mostrarAlerta('Error', 'El email con formato no valido', 'error');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          this.mostrarAlerta('Error', 'El email con formato no valido', 'error');
          return false;
        }
        return true;
        },

      validarEmail2(email2){
        this.usuario.email2 = email2
        if(email2!= this.usuario.email){
            this.mostrarAlerta('Error', 'El email no está bien puesto', 'error');
            return false;
        }
        return true;
      },
      validarPass2(pass2){
        this.usuario.pass2 = pass2
        if(pass2!= this.usuario.pass){
            this.mostrarAlerta('Error', 'La contraseña no está bien puesta', 'error');
            return false;
        }
        return true;
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
        if (this.usuario.dni && this.usuario.apellidos && this.usuario.nombre && this.usuario.email && this.usuario.email2 && this.usuario.pass
        && this.usuario.pass2 && this.usuario.telefono &&
            this.usuario.direccion && this.usuario.provincia && this.usuario.municipio && this.validarDNI(this.usuario.dni) && this.validarEmail(this.usuario.email) && 
            this.validarEmail2(this.usuario.email2) && this.validarTelefono(this.usuario.telefono)){
                try {

                  this.usuario.pass = await passport.encriptarContrasena(this.usuario.pass)

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
          this.mostrarAlerta('Error', 'Por favor, introduzca bien los datos.', 'error');
        }
      },
  
    }
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
  .form_reg {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    padding:15px;
    border-radius: 5px;
    box-shadow: inset 0 0 6px rgba(0, 2, 94, 0.44);
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