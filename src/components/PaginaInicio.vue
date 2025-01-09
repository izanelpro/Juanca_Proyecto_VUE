<template>
    <h1>Panel de Control</h1>
    <br>
    <br>
    <div class="botones">
        <div class="botones-iz">
            <router-link to="/usuarios"><button class="btn btn-primary m-1 btn-hover1">Gestión Usuarios</button></router-link><br>
            <router-link to="/comentarios"><button class="btn btn-primary m-1 btn-hover2">Gestion Comentarios</button></router-link><br>
            <router-link to="/"><button class="btn btn-primary m-1 btn-hover2" disabled>En Construcción</button></router-link>
        </div>
        <div class="botones-der">
            <router-link to="/empleo"><button class="btn btn-primary m-1 btn-hover1">Gestión Empleo</button></router-link><br>
            <router-link to="/"><button class="btn btn-primary m-1 btn-hover2" disabled>En Construcción</button></router-link><br>
            <router-link to="/"><button class="btn btn-primary m-1 btn-hover2" disabled>En Construcción</button></router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "PaginaInicio",
    components: {}
}
</script>

<style>
 .botones{
    display: flex;
    margin-left: 40%; 
 }
 
 .botones-iz, .botones-der {
    margin: 10px;
 }

 
 button.btn-hover2:disabled {
    background-color: #b9b9b9b9;
    cursor: not-allowed;
    opacity: 1; 
    border: 1px solid white;
 }
</style>
