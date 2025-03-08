<template>
    <div>
        <form @submit.prevent="enviarCorreo">
            <div class="form-group">
                <label for="nombre">Nombre</label>
                <input type="text" v-model="contacto.nombre" class="form-control" id="nombre" required>
            </div>
            <div class="form-group">
                <label for="telefono">Teléfono</label>
                <input type="tel" v-model="contacto.telefono" class="form-control" id="telefono" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" v-model="contacto.email" class="form-control" id="email" required>
            </div>
            <div class="form-group">
                <label for="mensaje">Mensaje</label>
                <textarea v-model="contacto.mensaje" class="form-control" id="mensaje" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Enviar</button>
        </form>
    </div>

</template>

<script>
import Swal from 'sweetalert2';
export default {
    name: 'TablaContacto',
    data() {
        return {
            contacto: {
                nombre: '',
                telefono: '',
                email: '',
                mensaje: ''
            },

        };
    },
    computed: {

    },
    methods: {
        enviarCorreo() {
            fetch('http://localhost:5000/enviar-correo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.contacto),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        this.mensajeExito = 'Mensaje enviado con éxito!';
                        // Optional: Reseteamos el formulario
                        this.contacto.nombre = '';
                        this.contacto.telefono = '';
                        this.contacto.email = '';
                        this.contacto.mensaje = '';
                        Swal.fire({
                            icon: 'success',
                            title: "Mensaje Enviado con Éxito",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        this.mensajeError = 'Hubo un problema al enviar el mensaje. Intenta de nuevo.';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.mensajeError = 'Hubo un error en la conexión con el servidor. Intenta nuevamente.';
                });
        }
    }
};

</script>

<style scoped>asda
.form-control:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}

.btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
}

.invalid-feedback {
    color: #dc3545;
}

.border {
    border: 1px solid #dee2e6 !important;
}

.rounded {
    border-radius: 0.25rem !important;
}

.shadow-sm {
    box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075) !important;
}
</style>