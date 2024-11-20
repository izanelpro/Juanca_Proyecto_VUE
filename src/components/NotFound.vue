<template>
  <div class="row">
    <div class="cold-md-12">
        <img src="../assets/john-travolta-lost.gif" width=25%><br>
        <h2>Sorry, it isn't your fault. We have done something wrong</h2>
        <hr>
        <router-link class="btn btn-danger" :to="{name: 'inicio'}">Volver</router-link>
    </div>
  </div>
</template>

<script>

export default {
    name: "NotFound",
    components: {
        
    }
}
</script>

<style>

</style>