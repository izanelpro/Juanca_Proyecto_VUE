<template>
    <div class="container text-center mt-4">
      <h5 class="panel-title"><i
        class="bi bi-cart4"></i>CARRITO</h5>
    <router-link to="/tienda" class="btn btn-customb"><i class="bi bi-arrow-return-left me-2"></i></router-link>
      <div v-if="carritoStore.carrito.length === 0" class="alert alert-info">
        <p>El carrito está vacío.</p>
      </div>
      <div v-else>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in carritoStore.carrito" :key="item._id">
              <td class="img-cell">
                <img
                  :src="`http://localhost:5000/uploads/img/${item.imagen_url}`"
                  alt="Imagen del artículo"
                  class="img-fluid"
                />
              </td>
              <td>{{ item.nombre }}</td>
              <td>{{ item.cantidad }}</td>
              <td>{{ item.precio }}€</td>
              <td>{{ (item.cantidad * item.precio).toFixed(2) }}€</td>
              <td>
                <button
                  class="btn btn-danger btn-sm"
                  @click="carritoStore.eliminarDelCarrito(item._id)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        Cupon descuento:<input type="text" @blur="descuento(this.Descuento.desc)" v-model="Descuento.desc"><br><br>
        Gastos Envio:<input type="text" disabled value="0.90€"><br>
        <p class="h5" v-if="this.Descuento.desc!='DESCUENTO'">Total: {{ carritoStore.totalPrecio }}€</p>
        <p class="h5" v-if="this.Descuento.desc ==='DESCUENTO'">Total: {{ (carritoStore.totalPrecio)*0.1 }}€</p><br>
        
        <div>
          <button
            class="btn btn-warning me-1"
            @click="carritoStore.vaciarCarrito"
          >
            Vaciar Carrito
          </button>
          <button
            class="btn btn-success ms-1"
            @click="finalizarPago"
            :disabled="carritoStore.length === 0"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  import { useCarritoStore } from "@/store/carrito.mjs";
  import { loadStripe } from '@stripe/stripe-js';
  
  export default {
    name: "TablaCarrito",

    data() {
      return {
        Descuento:{
          desc:""
        }
      };
    },
  
    setup() {
      const carritoStore = useCarritoStore();
  
      return { carritoStore };
    },
    methods: {

        descuento(descuent){
          this.Descuento.desc=descuent;
          if(descuent==="DESCUENTO"){
            this.mostrarAlerta("DESCUENTO BIEN");
          }
          else{
            this.mostrarAlerta("DESCUENTO MAL PUESTO");
          }
        },
        total() {
          
          return this.carritoStore.carrito.reduce((acc, item) => acc + item.precio_unitario * item.cantidad, 0).toFixed(2);
          
        },

        mostrarAlerta(titulo, mensaje, icono) {
        Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono,
        customClass: {
          container: 'custom-alert-container',
          popup: 'custom-alert-popup',
          modal: 'custom-alert-modal'
        }
      })
    },

        async finalizarPago() {
        console.log("init finalizarPago");
        const stripe = await loadStripe("pk_test_51Qzcf4G4dAQI05pTnplgsrcJvcmfvhuvTnSwB0yhshjBLvWfwD4x9kMD2xLsCixoTEz6zhyYgx8sCftdHPNxIHmV00TJibHPo7");
        console.log("enviando al backend: ", JSON.stringify({items : this.carritoStore.carrito}));  
        
        console.log(this.carritoStore.carrito);
        console.log(this.total());

        const response = await fetch("http://localhost:5000/crear-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({items : this.carritoStore.carrito, amount : this.total()}),
        });

        const session = await response.json();
        console.log("Session response : ", session);
        if(!session.id){
          console.error("No se recibió sessionId de Stripe");
          return;
        }
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.id,
        });
        
        if (error) {
          console.error("Error en el pago: ", error);
          }
      },
    },
  };
  </script>
  
  <style>
  .img-cell {
    padding: 0 !important;
    margin: 0 !important;
    width: 10%;
    /* Ajusta el ancho según necesites */
    text-align: center;
  }
  
  .img-fluid {
    max-width: 100%;
    height: auto;
    display: block;
  }
  .btn-customb {
  position: absolute;
  font-size: 22px;
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s, transform 0.2s;
}

.btn-customb:hover {
  color: #0056b3;
  transform: translateX(-5px);
}
  </style>