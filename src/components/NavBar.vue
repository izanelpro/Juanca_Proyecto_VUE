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
                        <li class="nav-item">
                            <router-link to="/usuarios" class="nav-link text-white"
                                exact-active-class="active">Usuarios</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/empleo" class="nav-link text-white"
                                exact-active-class="active">Empleo</router-link>
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
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
export default {
    name: "NavBar"
}
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