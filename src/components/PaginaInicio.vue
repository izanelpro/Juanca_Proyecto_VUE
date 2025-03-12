<template>
    <div class="container text-center mt-4">
        <!-- Titulo -->
        <div class="panel_title">
        <h4 class="panel-title">
         <i class="bi bi-house-door-fill"></i>INICIO
      </h4>
      <br>
      <h5 class="subtitulo">Bienvenido a nuestra página web</h5>
        </div>
        <!-- Sección del Video -->
        <div class="video-container">
            <video autoplay loop muted playsinline>
                <source src="/videos/143884-784164219_small.mp4" type="video/mp4">
                Tu navegador no soporta videos.
            </video>
        </div>

        <!-- Sección de Contenido -->
        <div class="content">
            <div class="bloque">
                <hr>
                <h1 class="huno">Nuestro Servicio</h1>
                <hr>
            </div>
            <p>
                Bienvenido a nuestra tienda, tu destino ideal para sorprender a quienes más quieres. Explora nuestra
                selección de regalos únicos  para cualquier celebración.
            </p>
            <div class="bloque">
                <hr>
                <h1 class="huno">Que ofrecemos?</h1>
                <hr>
            </div>
            <div class="lista">
                <div class="lista_p">
                    <p>✅ Regalos originales y personalizados</p>
                    <p>🎂 Para cumpleaños, aniversarios y más</p>
                    <p>🚚 Envío rápido y seguro</p>
                </div>
                <p>✨ ¡Descubre nuestras colecciones y encuentra el detalle perfecto hoy mismo! ✨</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PaginaInicio",
};
</script>

<style>
/* Título del Panel */
.panel-title {
  font-weight: bold;
  text-transform: uppercase;
  color: #007bff;
  display: inline-block;
  padding-bottom: 5px;
  border-bottom: 3px solid #007bff;
  font-size: 24px;
  margin: 10px;
}

.subtitulo {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}
.bloque{
    margin: 150px;
}
.lista{
    text-align: center;
    margin-bottom: 20px;
}
.lista_p{
    margin-bottom: 200px;
}
.huno{
    color:rgb(0, 57, 172);
    text-align: center;
    margin:80px;
}

/* Contenedor del video */
.video-container {
    width: 100%;
    max-height: 500px;
    /* Ajusta la altura del video según necesidad */
    overflow: hidden;
}

/* Video ajustado al ancho completo */
video {
    width: 100%;
    height: auto;
    object-fit: cover;
}

/* Contenido con espaciado */
.content {
    margin-top: 6%;
    padding: 30px;
    max-width: auto;
    text-align: justify;
}
</style>