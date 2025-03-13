<template>
    <div class="container text-center mt-4">
        <h3 class="panel-title"><i class="bi bi-box-seam"></i>
            GESTIÓN DE ARTICULOS
            <router-link to="/" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
        </h3>
    </div>
    <br />
    <div class="container-fluid border p-4">

        <form class="form-in-line">
            <div class="col-10 col-m-6 col-lg-8 mx-auto">
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span ms-2 me-2">Nombre: </span>
                    <input type="text" class="form-control sm w-50" placeholder="Nombre" v-model="articulo.nombre"
                        required>


                    <span class="input-group-text custom-span ms-auto me-2">Categoría:</span>
                    <select name="categoria" class="form-control w-25" v-model="articulo.categoria" required>
                        <option value="" disabled>Seleccionar categoría</option>
                        <option v-for="categoria in categorias" :key="categoria.id" :value="categoria">
                            {{ categoria }}
                        </option>
                    </select>

                </div>
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span ms-2 me-2">Descripción: </span>
                    <textarea maxlength="256" class="form-control w-50" rows="2" placeholder="Descripción del articulo"
                        v-model="articulo.descripcion"></textarea>

                    <span class="input-group-text custom-span ms-auto me-2">Precio unitario: </span>
                    <input type="text" class="form-control sm w-25 text-end" placeholder="0"
                        v-model="articulo.precio_unitario" required>
                </div>
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span ms-2 me-2">Stock: </span>
                    <input type="text" class="form-control sm w-25 text-end" placeholder="0"
                        v-model="articulo.stock_disponible" required>

                    <span class="input-group-text custom-span ms-5 me-2">Personalizacion: </span>
                    <textarea maxlength="256" class="form-control w-75" rows="2"
                        placeholder="Detalles de personalización" v-model="articulo.personalizacion"></textarea>
                </div>
                <div class="input-group-text mb-3">
                    <span class="input-group-text custom-span ms-2 me-2">Imagen: </span>
                    <input type="file" class="form-control sm w-75" ref="fileInput" @change="handleImageUpload">

                    <span class="input-group-text custom-span ms-5 me-2">Fecha de Alta: </span>
                    <input type="date" class="form-control sm w-25" placeholder="mm/dd/yyyy"
                        v-model="articulo.fecha_alta" required>
                    <button class="btn btn-light m-1" @click="limpiarArticulo()">
                        <i class="bi-arrow-clockwise"></i>
                    </button>
                </div>

            </div>
            <button class="btn btn-primary m-1" @click="agregarArticulo">Grabar</button>
            <button class="btn btn-primary m-1" @click="limpiarArticulo">Limpiar</button>
        </form>
    </div>

    <div class="container my-5">
        <h3 class="mb-4 text-primary"><i class="bi bi-boxes"></i> TABLA DE ARTÍCULOS</h3>
        <div class="container my-2">
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead class="table-info rounded-header">
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Fecha Alta</th>
                            <th scope="col" class="pale-yellow table-warning">Gestión</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="articulo in articulosPorPagina" :key="articulo.id">
                            <td class="align-middle">{{ acortarId(articulo._id) }}</td>
                            <td class="align-middle">{{ articulo.nombre }}</td>
                            <td class="align-middle">{{ articulo.categoria }}</td>
                            <td class="align-middle">{{ articulo.descripcion }}</td>
                            <td class="align-middle">{{ articulo.precio_unitario }}</td>
                            <td class="align-middle">{{ articulo.stock_disponible }}</td>
                            <td class="align-middle">{{ acortarFecha(articulo.fecha_alta) }}</td>

                            <td class="text-center align-middle pale-yellow table-warning">
                                <div>
                                    <button class="btn btn-warning m-2" @click="seleccionarArticulo(articulo._id)">
                                        <i class="fas fa-pencil-alt"></i>
                                    </button>
                                    <button class="btn btn-danger m-2" @click="eliminarArticulo(articulo._id)">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-center my-3">
                    <button class="btn btn-primary" :disabled="currentPage === 1" @click="paginaAnterior">
                        <i class="bi bi-chevron-left"> </i>
                    </button>
                    <span class="mx-3 align-self-center">Página {{ currentPage }}</span>

                    <button class="btn btn-primary" :disabled="currentPage * pageSize >= articulos.length"
                        @click="siguientePagina">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
import { agregarArticulo, eliminarArticulo, obtenerArticulos, actualizarArticulo } from '@/js/articuloServicios.js';



export default {
    name: "TablaArticulos",
    components: {},

    data() {
        return {
            articulo: {
                nombre: '',
                categoria: '',
                descripcion: '',
                precio_unitario: 0.00,
                stock_disponible: 0,
                personalizacion: '',
                fecha_alta: '',
                imagen_url: ''
            },

            image: null,
            articulos: [],
            categorias: [
                "Electrónica",
                "Hogar",
                "Ofimática",
                "Deporte",
                "Libros",
                "Otros"
            ],
            currentPage: 1,
            pageSize: 5
        };
    },

    computed: {
        articulosPorPagina() {
            const indice = (this.currentPage - 1) * this.pageSize;
            return this.articulos.slice(indice, indice + this.pageSize);
        },
    },

    mounted() {
        this.obtenerArt();
    },

    methods: {
        siguientePagina() {
            if (this.currentPage * this.pageSize < this.articulos.length) {
                this.currentPage++;
            }
        },

        paginaAnterior() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },

        async obtenerArt() {
            try {
                this.articulos = await obtenerArticulos();
            } catch (error) {
                console.error('Error al obtener los artículos', error);
            }
        },

        handleImageUpload(event) {
            this.image = event.target.files[0];
        },
        async agregarArticulo(event) {
            event.preventDefault();

            try {
                this.articulo.imagen_url = `${this.image.name.split('.').pop()}`;
                if (this.articulo._id) {
                    // Si el artículo ya tiene un ID, actualizar
                    await actualizarArticulo(this.articulo._id, this.articulo);
                    Swal.fire({
                        title: 'Artículo actualizado',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });


                    this.submitImage(this.articulo._id);

                } else {
                    // Subir el artículo y esperar el ID
                    const nuevoArticulo = await agregarArticulo(this.articulo);
                    this.articulos.push(nuevoArticulo);

                    Swal.fire({
                        title: 'Artículo agregado',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    this.submitImage(nuevoArticulo._id);


                }

                // Recargar artículos y limpiar formulario
                this.obtenerArt();
                this.limpiarArticulo();
            } catch (error) {
                console.error('Error al agregar el artículo', error);
            }
        },

        async submitImage(id) {
            const formdata = new FormData();

            // Usa directamente this.image si ya es un archivo
            formdata.append("image", this.image, `${id}.${this.image.name.split('.').pop()}`);
            formdata.append("articuloId", id);

            try {
                const uploadResponse = await fetch('http://localhost:5000/subirimg', {
                    method: 'POST',
                    body: formdata,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Error al subir la imagen');
                }

                console.log('Hubo respuesta: ', await uploadResponse.json());

            } catch (error) {
                console.error('Error:', error);
            }
        },

        async eliminarArticulo(id) {
            const resultado = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Deseas eliminar el artículo?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'No, cancelar',
                cancelButtonColor: '#d33',
                confirmButtonColor: '#3085d6',
            })

            if (resultado.isConfirmed) {
                try {
                    await eliminarArticulo(id);
                    this.articulos = this.articulos.filter(articulo => articulo._id !== id);
                    Swal.fire({
                        title: 'Artículo eliminado',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } catch (error) {
                    console.error('Error al eliminar el artículo', error);
                }
            }
        },

        async seleccionarArticulo(id) {
            const articulo = this.articulos.find(articulo => articulo._id === id);
            articulo.fecha_alta = new Date(articulo.fecha_alta).toISOString().split('T')[0];

            this.articulo = { ...articulo };
        },

        acortarId(id) {
            return id.slice(-4);
        },

        acortarFecha(fecha) {
            return fecha.slice(0, 10);
        },

        limpiarArticulo() {
            this.articulo = {
                nombre: '',
                categoria: '',
                descripcion: '',
                precio_unitario: 0.00,
                stock_disponible: 0,
                personalizacion: '',
                imagen_url: '',
                fecha_alta: ''
            };

            this.image = null
        }
    }
}

</script>

<style scoped>
.star-valor {
    font-size: 2rem;
    /* TamaÃ±o de las estrellas */
    color: #ffc107;
    /* Color dorado */
    cursor: pointer;
}

.star-icon {
    margin-right: 5px;
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