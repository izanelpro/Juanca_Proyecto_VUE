<template>
    <div class="container text-center mt-4">
      <h5 class="panel-title">
         <i class="bi bi-menu-button">PANEL DE CONTROL</i>
      </h5>
  
      <div class="botones">
        <div class="botones-iz">
          <router-link to="/usuarios">
            <button class="btn btn-primary btn-panel">Gestión Usuarios</button>
          </router-link>
          <router-link to="/comentarios">
            <button class="btn btn-primary btn-panel">Gestión Comentarios</button>
          </router-link>
          <button class="btn btn-secondary btn-panel" disabled>En Construcción</button>
        </div>
  
        <div class="botones-der">
          <router-link to="/empleo">
            <button class="btn btn-primary btn-panel">Gestión Empleo</button>
          </router-link>
          <router-link to="/articulos">
            <button class="btn btn-primary btn-panel">Gestión Artículos</button>
          </router-link>
          <button class="btn btn-secondary btn-panel" disabled>En Construcción</button>
        </div>
      </div>
    </div>
  </template>

<script>
//ACTUALIZADO
export default {
    name: "PaginaInicio",
    components: {}
}
</script>

<style scoped>
/* Título del Panel */
.panel-title {
  font-weight: bold;
  text-transform: uppercase;
  color: #007bff;
  display: inline-block;
  padding-bottom: 5px;
  border-bottom: 3px solid #007bff;
}

/* Contenedor de botones */
.botones {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}

/* Columnas de botones */
.botones-iz, .botones-der {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Botones uniformes */
.btn-panel {
  width: 220px; /* Todos los botones tienen el mismo ancho */
  height: 50px; /* Misma altura */
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

/* Efectos de Hover */
.btn-panel:hover {
  transform: scale(1.05);
}

/* Botón primario */
.btn-primary {
  background-color: #007bff;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* Botones deshabilitados */
.btn-panel:disabled {
  background-color: #b9b9b9;
  cursor: not-allowed;
  border: 1px solid white;
}

/* Responsivo */
@media (max-width: 768px) {
  .botones {
    flex-direction: column;
    align-items: center;
  }
}
</style>
