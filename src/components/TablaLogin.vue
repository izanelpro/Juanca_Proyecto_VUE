<template>
  <div>
    <div class="container text-center mt-4">
      <h5 class="panel-title"><i
        class="bi bi-box-arrow-in-right m-2"></i>INICIAR SESIÓN</h5>
    <router-link to="/tienda" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
    </div>
  
    <form @submit.prevent="iniciarSesion">
        <!-- Campo DNI -->
        <div class="mb-3">
          <label for="dni" class="form-label">DNI:</label>
          <input
            type="text"
            id="dni"
            class="form-control"
            v-model="dni"
            required
          />
        </div>
  
        <!-- Campo Contraseña -->
        <div class="mb-3">
          <label for="pass" class="form-label">Contraseña:</label>
          <input
            type="password"
            id="pass"
            class="form-control"
            v-model="pass"
            required
          />
        </div>
  
        <!-- Botón de login -->
        <button type="submit" class="btn btn-primary">Iniciar sesión</button>
      </form>
  
      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
<br> <br>
      <div class="row justify-content-center">
      <!-- Bloque de Admin -->
      <div class="col-md-5 admin card p-4 mx-2">
        <h2 class="text-primary">ADMIN</h2>
        <h3>DNI:</h3>
        <p class="font-weight-bold">00000000T</p>
        <h3>Contraseña:</h3>
        <p class="font-weight-bold">putin</p>
      </div>

      <!-- Bloque de User -->
      <div class="col-md-5 user card p-4 mx-2">
        <h2 class="text-success">USER</h2>
        <h3>DNI:</h3>
        <p class="font-weight-bold">78831986S</p>
        <h3>Contraseña:</h3>
        <p class="font-weight-bold">anxo</p>
      </div>
    </div>
    <br> <br>
  </div>

</template>
  
  <script>
  //import Swal from 'sweetalert2';
  import passport from  '../config/passport.mjs';
  import Swal from 'sweetalert2'; 
  
  export default {
    name: "TablaLogin",
    components: {
      
    },
    data() {
      return {
        dni: "",
        pass: "",
        errorMessage: "",
        usuarios: [] // Aquí se almacenarán los usuarios cargados desde el archivo JSON
      };
    },

    created() {
      // Cargar los usuarios desde el archivo datos.json al crear el componente
      this.getUsuarios();
    },

    methods: {
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

        async getUsuarios() {
            try {
                const response = await fetch('http://localhost:3000/usuarios');
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }

                // Obtener y ordenar usuarios por apellidos y luego por nombre
                this.usuarios = (await response.json()).sort((a, b) =>
                    a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre)
                );

                } catch (error) {
                    console.error(error);
                }
            },


        async iniciarSesion() {
            // Buscar el usuario con el DNI proporcionado
            const usuario = this.usuarios.find((user) => user.dni === this.dni);
    
            // Verificar si el usuario existe
            if (usuario) {
            // Verificar la contraseña usando passport para compararla con la encriptada
            const contrasenaCorrecta = await passport.verificarContrasena(
                this.pass,
                usuario.pass
            );
  
          if (contrasenaCorrecta) {
            if(usuario.tipo === "admin"){
              this.errorMessage = "";
              this.mostrarAlerta("Bienvenido ADMIN","Sesión Iniciada","sucess")
              localStorage.setItem('isLogueado','true')
              localStorage.setItem('isAdmin','true')
              localStorage.setItem('usuario', usuario.nombre)
              localStorage.setItem('usuarioEmail', usuario.email);
              this.$router.push({name:'inicio'}).then(()=> {
                window.location.reload();
              });
            }
            else if(usuario.tipo != "admin"){
              this.errorMessage = "";
              this.mostrarAlerta("Bienvenido","Sesión Iniciada","sucess")
              localStorage.setItem('isLogueado','true')
              localStorage.setItem('usuario', usuario.nombre)
              localStorage.setItem('usuarioEmail', usuario.email);
              this.$router.push({name:'inicio'}).then(()=> {
                window.location.reload();
              });
            }
           
            alert("Inicio de sesión exitoso");
            // Redirigir o hacer algo después del inicio de sesión
          } else {
            this.errorMessage = "DNI o contraseña incorrectos. Inténtalo de nuevo.";
          }
        } else {
          this.errorMessage = "DNI o contraseña incorrectos. Inténtalo de nuevo.";
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 400px;
    margin-top: 50px;
  }
  form {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
    padding:20px;
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
}
  </style>
  
  