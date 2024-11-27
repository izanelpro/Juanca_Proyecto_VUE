<template>

    <h1>Panel de Control</h1>
    <br>
    <br>
    <div class="botones">
        <div class="botones-iz">
            <router-link to="/usuarios"><button class="btn btn-primary m-1 btn-hover1">Gestión Usuarios</button></router-link><br>
            <router-link to="/"><button class="btn btn-primary m-1 btn-hover2">En Construcción</button></router-link><br>
            <router-link to="/"><button class="btn btn-primary m-1 btn-hover2">En Construcción</button></router-link>
        </div>
        <div class="botones-der">
            <router-link to="/empleo"><button class="btn btn-primary m-1 btn-hover1">Gestión Empleo</button></router-link><br>
            <router-link to="/"><button class="btn btn-primary m-1 btn-hover2">En Construcción</button></router-link><br>
            <router-link to="/"><button class="btn btn-primary m-1 btn-hover2">En Construcción</button></router-link>
        </div>
    </div>
</template>

<script>

export default {
    name: "PaginaInicio",
    components: {
        
    }
}
</script>

<style>
 .botones{
    display: flex;
    margin-left: 40%; 
 }

 .botones-iz{
    margin: 10px;
 }
 .botones-der{
    margin: 10px;
 }
</style>