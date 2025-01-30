<template>
    <div class="container">
        <!-- Titulo -->
        <div class="titulo">
            <h4 class="font-weight-bold text-uppercase text-primary position-relative d-inline-block m-3">
                INICIO<i class="bi bi-house-door-fill m-2"></i>
            </h4>
            <h5>Bienvenido a nuestra página web</h5>
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
            <p>
                Bienvenido a nuestra tienda, tu destino ideal para sorprender a quienes más quieres. Explora nuestra
                selección de regalos únicos, personalizados
                y especiales para cualquier celebración.
            </p>
            <ul>
                <li>✅ Regalos originales y personalizados</li>
                <li>🎂 Para cumpleaños, aniversarios y más</li>
                <li>🚚 Envío rápido y seguro</li>
            </ul>
            <p>✨ ¡Descubre nuestras colecciones y encuentra el detalle perfecto hoy mismo! ✨</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "PaginaInicio",
};
</script>

<style>
/* Contenedor titulo */
.titulo {
    text-align: center;
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
    margin-left: 22%;
    margin-top: 6%;
    padding: 20px;
    max-width: 650px;
    text-align: justify;
    background-color: rgba(197, 197, 197, 0.377);
}
</style>