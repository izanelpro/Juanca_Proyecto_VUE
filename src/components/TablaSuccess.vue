<template>
    <div class="success-container">
      <div class="success-card">
        <h1 class="title">¡Pago Completado! 🎉</h1>
        <p class="message">
          Gracias por tu compra. Te hemos enviado un correo con los detalles.
        </p>
  
        <div class="invoice-container">
          <p>Descargue su factura en formato PDF:</p>
          <button @click="generarFacturaPDF" class="btn btn-primary">
            <i class="bi bi-file-earmark-pdf"></i> Descargar Factura
          </button>
        </div>
  
        <router-link to="/tienda" class="back-link">
          <i class="bi bi-arrow-left"></i> Volver a la tienda
        </router-link>
      </div>
    </div>
  </template>
  
  
  <script>
  import jsPDF from "jspdf";
  import autoTable from "jspdf-autotable";
  import { useCarritoStore } from "@/store/carrito.mjs";
  import { watch, toRefs } from "vue";
  import logo from "@/assets/logo.png"; // Importa la imagen
  
  export default {
    data() {
      return {
        cartItems: [],
        totalPrice: 0,
        // otros datos como el cliente, dirección, email, etc.
      };
    },
  
    mounted() {
      const cartStore = useCarritoStore();
  
      if (!cartStore) {
        console.error("🚨 Error: `cartStore` no está definido.");
        return;
      }
  
      const { carrito } = toRefs(cartStore); // ✅ Usar `carrito` en lugar de `items`
  
      if (!carrito) {
        console.error("🚨 Error: `carrito` no está definido en `cartStore`.");
        return;
      }
  
      this.cartItems = carrito.value || []; // ✅ Asignar carrito en lugar de items
      this.totalPrice = cartStore.totalPrecio; // ✅ Usar totalPrecio en lugar de totalPrice
  
      watch(
        () => cartStore.carrito,
        (newVal) => {
          this.cartItems = newVal;
        },
        { deep: true }
      );
    },
  
    methods: {
      generarFacturaPDF() {
        if (this.cartItems.length === 0) {
          console.error(
            "🚨 No hay productos en el carrito. No se puede generar la factura."
          );
          return;
        }
  
        const doc = new jsPDF();
        const cart = this.cartItems;
  
        // Logo en la parte superior izquierda (ajustar la ruta de tu logo)
        doc.addImage(logo, "png", 10, 10, 20, 20); // Ajusta las coordenadas y tamaño
  
        // Título de la factura
        doc.setFontSize(18);
        doc.text("Factura de Compra", 60, 20); // Alineado a la derecha del logo
  
        // Información del Cliente
        doc.setFontSize(9);
        doc.text(`Razón Social: Regalos Teis`, 110, 50);
        doc.text(`Dirección: Avenida Galicia 101, Vigo - 36216`, 110, 55);
        doc.text(`Tlfno: 986 666 333 - Email: regalos@example.com`, 110, 60);
  
        // Crear la tabla con los productos del carrito
        const headers = [
          ["ID", "Producto", "Cantidad", "Precio Unitario", "Total"],
        ];
        const data = cart.map((item) => [
          item._id,
          item.nombre,
          item.cantidad,
          `${item.precio_unitario.toFixed(2)} €`, // Formatear precio unitario
          `${(item.cantidad * item.precio_unitario).toFixed(2)} €`, // Formatear total
        ]);
        autoTable(doc, {
          startY: 80,
          head: headers,
          body: data,
          columnStyles: {
            0: { halign: "center" }, // Alinear ID al centro
            2: { halign: "center" }, // Alinear Cantidad al centro
            3: { halign: "right" }, // Alinear Precio Unitario a la derecha
            4: { halign: "right" }, // Alinear Total a la derecha
          },
          theme: "striped", // Estilo de la tabla con líneas de fondo alternadas
        });
  
        // Total de la compra (alineado a la derecha)
        const totalText = `Total: ${this.cartItems
          .reduce((acc, item) => acc + item.precio_unitario * item.cantidad, 0)
          .toFixed(2)} €`;
  
        // Obtener el ancho de la página
        const pageWidth = doc.internal.pageSize.width;
  
        // Calcular la posición X para alinear a la derecha
        const totalWidth = doc.getTextWidth(totalText);
        const positionX = pageWidth - totalWidth - 14; // Resta 14 para margen desde el borde derecho
  
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
  
        // Colocar el texto en la posición calculada
        doc.text(totalText, positionX - 9, doc.lastAutoTable.finalY + 10);
  
        // Guardar el archivo PDF
        doc.save("factura.pdf");
      },
    },
  
    beforeUnmount() {
      //Eliminar los datos del carrito después de mostrar la factura
      const cartStore = useCarritoStore();
      cartStore.vaciarCarrito();
    },
  };
  </script>
  
  
  <style scoped>
  .payment-success {
    text-align: center;
    margin-top: 50px;
  }
  
  .payment-success h1 {
    color: #4caf50;
  }
  
  .payment-success p {
    font-size: 18px;
  }
  </style>