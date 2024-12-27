// document.addEventListener("DOMContentLoaded", function () {
//     let form = document.getElementById("formUser");
//     form.addEventListener("submit", async (evt) => {
//         evt.preventDefault();

//         let email = form.elements.email.value;
//         let password= form.elements.password.value;

//         try {
//             // Llamada al backend para crear un nuevo usuario
//             const response = await fetch(`/api/users/login`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     email,
//                     password
//                 })
//             });

//             if (response) {
//                 alert(`Usuario iniciado correctamente ${JSON.parse(response)}` );
//             } else {
//                 alert("Error al registrar el usuario.");
//             }
//         } catch (error) {
//             console.error("Error en la solicitud:", error);
//             alert("Hubo un problema al registrar el usuario.");
//         }

//         form.reset();
//     });
// });

