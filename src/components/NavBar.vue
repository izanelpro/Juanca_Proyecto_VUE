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
                            <router-link to="/contacto" class="nav-link text-white"
                                exact-active-class="active">Contacto</router-link>
                        </li>
                    </ul>
                    <input class="form-control me-4 w-25 ms-auto" type="search" placeholder="Buscar"
                        aria-label="Search">

                    <button class="btn btn-outline-success bg-light" type="submit"> <i
                            class="bi bi-search"></i></button>
                            <div class="dropdown">
                        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-person-circle"></i>
                        </button>
                        <ul class="dropdown-menu" :class="{show: isDropdownVisible}" aria-labelledby="dropdownMenuButton">
                            <li><router-link class="dropdown-item" to="/login">Acceso</router-link></li>
                            <li><router-link class="dropdown-item" to="/registrarse">Registro</router-link></li>
                            <li><router-link class="dropdown-item" to="#" @click="logout">Cerrar Sesión</router-link></li>
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
        };
    },
    mounted(){
        this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    },
    methods:{
        toggleDropdown(){
            console.log("botón pulsado");
            this.isDropdownVisible = !this.isDropdownVisible;
        },
        logout(){
            localStorage.removeItem('isLogueado');
            localStorage.removeItem('isAdmin');

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

</style>