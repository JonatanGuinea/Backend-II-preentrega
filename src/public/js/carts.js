// // cart.js

// // Evento para eliminar un producto específico del carrito
// document.querySelectorAll('.remove-product').forEach(button => {
//     button.addEventListener('click', async () => {
//         const productId = button.getAttribute('data-product-id');
//         const cartId = 'ID_DEL_CARRITO';  // reemplaza con el ID actual del carrito

//         try {
//             const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
//                 method: 'DELETE'
//             });
//             const result = await response.json();
//             if (result.status === 'success') {
//                 location.reload();  // recarga la página para actualizar la lista de productos
//             }
//         } catch (error) {
//             console.error('Error al eliminar el producto:', error);
//         }
//     });
// });

// // Evento para eliminar todos los productos del carrito
// document.querySelector('.clear-cart').addEventListener('click', async () => {
//     const cartId = 'ID_DEL_CARRITO';  // reemplaza con el ID actual del carrito

//     try {
//         const response = await fetch(`/api/carts/${cartId}`, {
//             method: 'DELETE'
//         });
//         const result = await response.json();
//         if (result.status === 'success') {
//             location.reload();
//         }
//     } catch (error) {
//         console.error('Error al vaciar el carrito:', error);
//     }
// });

document.addEventListener("DOMContentLoaded", function () {
    // Eliminar producto específico
    document.querySelectorAll(".remove-product").forEach(button => {
        button.addEventListener("click", async function () {
            const productId = this.getAttribute("data-product-id");
            const cartId = document.querySelector(".cart-id").textContent.trim(); // Obtener el ID del carrito

            try {
                // Llamada al backend para eliminar el producto del carrito
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    // Eliminar el producto de la interfaz si la solicitud fue exitosa
                    this.closest(".product-item").remove();
                    alert("Producto eliminado correctamente.");
                } else {
                    alert("Error al eliminar el producto.");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
                alert("Hubo un problema al eliminar el producto.");
            }
        });
    });

    // Eliminar todos los productos del carrito
    const clearCartButton = document.querySelector(".clear-cart");
    if (clearCartButton) {
        clearCartButton.addEventListener("click", async function () {
            const cartId = document.querySelector(".cart-id").textContent.trim(); // Obtener el ID del carrito

            try {
                // Llamada al backend para eliminar todos los productos del carrito
                const response = await fetch(`/api/carts/${cartId}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    // Limpiar la lista de productos de la interfaz si la solicitud fue exitosa
                    document.querySelectorAll(".product-item").forEach(item => item.remove());
                    alert("Todos los productos han sido eliminados del carrito.");
                } else {
                    alert("Error al eliminar todos los productos.");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
                alert("Hubo un problema al eliminar todos los productos.");
            }
        });
    }
});
