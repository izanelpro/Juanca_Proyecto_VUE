<template>
    <div class="container text-center mt-4">
      <h5 class="panel-title"> <i class="bi bi-people-fill m-2"></i>PERFIL</h5>
      <router-link to="/" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
    </div>
    <br>
  
    <div class="container-fluid border p-4">
      <form class="form-in-line">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
          <div class="input-group-text mb-3">
            <span class="input-group-text custom-span me-2">DNI/NIE:</span>
            <input type="text" class="form-control sm w-25" placeholder="DNI-NIE" v-model="usuario.dni"
               :disabled="editDni">
  
            <button class="btn btn-primary m-1" ><i class="bi bi-search"></i></button>
  
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
              >
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
  
  
    
  
  


  </template>
  
  <script>
  
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
        this.isAdmin = localStorage.getItem('isAdmin') === 'true';
        this.isLogueado = localStorage.getItem('isLogueado') === 'true';
        this.usuario = localStorage.getItem('usuario') || '';
    },
  
  
    created() {
      // Cargar los usuarios desde el archivo datos.json al crear el componente
      this.usuarioVer();

    },

    methods:{
        async usuarioVer(){
            try {
            this.limpiarFormCli()
            const response = await fetch('http://localhost:3000/usuarios');
            if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
            }
            const usuarios = await response.json();

            // Encontrar el usuario por su DNI
            const usuarioEncontrado = usuarios.find(this.isLogueado==="true");


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
            } 
        } catch (error) {
            console.error(error);
        }
    
            }
    }
  
   
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