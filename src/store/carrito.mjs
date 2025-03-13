import { defineStore } from 'pinia';

export const useCarritoStore = defineStore('carrito', {
    state: () => ({
        carrito: JSON.parse(localStorage.getItem('carrito')) || [] // Recuperar carrito
    }),

    getters: {
        totalArticulos: (state) => state.carrito.reduce((total, item) => total + item.cantidad, 0),
        totalPrecio: (state) => state.carrito.reduce((total, item) => total + item.precio * item.cantidad, 0),
    },

    actions: {
        guardarEnLocalStorage() {
            localStorage.setItem('carrito', JSON.stringify(this.carrito)); // Guardar en localStorage
        },

        agregarAlCarrito(articulo) {
            const itemExistente = this.carrito.find(item => item._id === articulo._id);
            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                this.carrito.push({ ...articulo, cantidad: 1, precio: articulo.precio_unitario });
            }
            this.guardarEnLocalStorage(); // Guardar cambios
        },  

        eliminarDelCarrito(id) {
            this.carrito = this.carrito.filter(item => item._id !== id);
            this.guardarEnLocalStorage(); // Guardar cambios
        },

        vaciarCarrito() {
            this.carrito = [];
            localStorage.removeItem('carrito'); // Eliminar del almacenamiento
        }
    }
});