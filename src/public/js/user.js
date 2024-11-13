document.addEventListener("DOMContentLoaded", function () {
    let form = document.getElementById("formUser");
    form.addEventListener("submit", async (evt) => {
        evt.preventDefault();

        let first_name = form.elements.first_name.value;
        let last_name = form.elements.last_name.value;
        let email = form.elements.email.value;

        try {
            // Llamada al backend para crear un nuevo usuario
            const response = await fetch(`/api/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first_name,
                    last_name,
                    email
                })
            });

            if (response.ok) {
                alert("Usuario registrado correctamente.");
            } else {
                alert("Error al registrar el usuario.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Hubo un problema al registrar el usuario.");
        }

        form.reset();
    });
});

