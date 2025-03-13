<template>
    <div id="navbar" class='container'>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link to="/" class="nav-link text-white"
                                exact-active-class="active">Inicio</router-link>
                        </li>
                        <li class="nav-item" v-if="isAdmin">
                            <router-link to="/gestion" class="nav-link text-white"
                                exact-active-class="active">Gestión</router-link>
                        </li>
                        <li class="nav-item" v-if="isAdmin">
                            <router-link to="/usuarios" class="nav-link text-white"
                                exact-active-class="active">Usuarios</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/empleo" class="nav-link text-white"
                                exact-active-class="active">Empleo</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/articulos" v-if="isAdmin" class="nav-link text-white"
                                exact-active-class="active">Articulos</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/comentarios" class="nav-link text-white"
                                exact-active-class="active">Comentarios</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/tienda" class="nav-link text-white"
                                exact-active-class="active">Tienda</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/contacto" class="nav-link text-white"
                                exact-active-class="active">Contacto</router-link>
                        </li>
                        <router-link to="/cart" exact-active-class="active">
                            <button class="btn btn-carrito"> <i
                                    class="bi bi-cart4"></i></button>
                        </router-link>
                    </ul>
                    <input class="form-control me-2 w-25 ms-auto" type="search" placeholder="Buscar"
                        aria-label="Search">

                    <button class="btn btn-outline-success bg-light" type="submit"> <i
                            class="bi bi-search"></i></button>

                    <div class="dropdown">

                        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-person-circle"></i>
                        </button>
                        <p class="clase-user m-3" v-if="isLogueado">Bienvenido,{{usuario}}</p>
                        <ul class="dropdown-menu" :class="{show: isDropdownVisible}" aria-labelledby="dropdownMenuButton">
                            <li v-if="!isLogueado"><router-link class="dropdown-item" to="/login">Acceso</router-link></li>
                            <li v-if="!isLogueado"><router-link class="dropdown-item" to="/registrarse">Registro</router-link></li>
                            <li v-if="isLogueado || isAdmin"><router-link class="dropdown-item" to="#" @click="logout">Cerrar Sesión</router-link></li>
                        </ul>
                    </div>
                    
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
export default {
    name: "NavBar",
    data(){
        return{
            isDropdownVisible: false,
            isAdmin: false,
            isLogueado:false,
            usuario:'' 
        };
    },
    mounted(){
        this.isAdmin = localStorage.getItem('isAdmin') === 'true';
        this.isLogueado = localStorage.getItem('isLogueado') === 'true';
        this.usuario = localStorage.getItem('usuario') || '';

    },
    methods:{
        toggleDropdown(){
            console.log("botón pulsado");
            this.isDropdownVisible = !this.isDropdownVisible;
        },
        logout(){
            localStorage.removeItem('isLogueado');
            localStorage.removeItem('isAdmin');
            console.log(this.usuario);  // Debes usar `this.usuario` para acceder a la propiedad

            this.$router.push({name:'login'}).then(()=> {
                window.location.reload();
            });
        }
    },
};
</script>

<style scoped>
/* Cambiar el color de la clase active */
.nav-link.active {
    color: #FAD02E !important;
    font-size: 1.1rem;
    /* Aumenta un poco el tamaño de la fuente */
    transition: font-size 0.5s ease;
    /* con una transición suave */

}
.clase-user{
    color: white;
    size: 10px;
}
.btn-carrito {
    color: white; /* White text color */
    border: none; /* Remove default border */
    padding: 10px 15px; /* Padding for the button */
    font-size: 18px; /* Increase font size */
    cursor: pointer; /* Pointer cursor on hover */
    transition: background-color 0.3s ease; /* Smooth transition for background color */
}

.btn-carrito:hover {
    color: rgb(204, 204, 204);
}

.btn-carrito i {
    margin-right: 5px; /* Space between icon and text */
}

</style>