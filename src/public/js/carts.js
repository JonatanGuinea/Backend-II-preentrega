

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
