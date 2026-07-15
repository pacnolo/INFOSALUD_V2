document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("contenedorDirectorio");
    const buscador = document.getElementById("buscarDirectorio");

    let directorio = [];

    async function cargarDirectorio() {
        try {
            const respuesta = await fetch("./json/directorio.json");

            if (!respuesta.ok) {
                throw new Error(
                    `No se pudo cargar el directorio. Código: ${respuesta.status}`
                );
            }

            directorio = await respuesta.json();

            console.log("Directorio cargado:", directorio);

            mostrarDirectorio(directorio);

        } catch (error) {
            console.error("Error al cargar el directorio:", error);

            contenedor.innerHTML = `
                <p class="mensaje-error">
                    No fue posible cargar el directorio.
                </p>
            `;
        }
    }

    function obtenerValor(persona, claves) {
        for (const clave of claves) {
            if (
                persona[clave] !== undefined &&
                persona[clave] !== null &&
                String(persona[clave]).trim() !== ""
            ) {
                return String(persona[clave]).trim();
            }
        }

        return "";
    }

    function mostrarDirectorio(registros) {

        if (!Array.isArray(registros) || registros.length === 0) {
            contenedor.innerHTML = `
                <p class="sin-resultados">
                    No se encontraron resultados.
                </p>
            `;
            return;
        }

        contenedor.innerHTML = registros.map(persona => {

            const nombre = obtenerValor(persona, [
                "nombre",
                "Nombre",
                "NOMBRE"
            ]);

            const cargo = obtenerValor(persona, [
                "cargo",
                "Cargo",
                "CARGO"
            ]);

            const ooad = obtenerValor(persona, [
                "ooad",
                "OOAD",
                "delegacion",
                "Delegacion",
                "DELEGACIÓN"
            ]);

            const correo = obtenerValor(persona, [
                "correo",
                "Correo",
                "CORREO",
                "CORREO ELECTRÓNICO"
            ]);

      const telefono = obtenerValor(persona, [
    "telefono",
    "Telefono",
    "TELÉFONO",
    "TELÉFONO DIRECTO",
    "TELÉFONO\nDIRECTO"
]);

            const conmutador = obtenerValor(persona, [
                "conmutador",
                "Conmutador",
                "CONMUTADOR"
            ]);

            const direccion = obtenerValor(persona, [
                "direccion",
                "Direccion",
                "DIRECCIÓN"
            ]);

            return `
                <article class="tarjeta-directorio">

                    <div class="directorio-icono">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div class="directorio-datos">

                        <h2>
                            ${nombre || "Nombre no disponible"}
                        </h2>

                        <p class="directorio-cargo">
                            ${cargo || "Cargo no disponible"}
                        </p>

                        <p>
                            <strong>OOAD:</strong>
                            ${ooad || "Sin información"}
                        </p>

                        <p>
                            <strong>Correo:</strong>
                            ${
                                correo
                                    ? `<a href="mailto:${correo}">${correo}</a>`
                                    : "Sin información"
                            }
                        </p>

                        <p>
                            <strong>Teléfono:</strong>
                            ${telefono || "Sin información"}
                        </p>

                        <p>
                            <strong>Conmutador:</strong>
                            ${conmutador || "Sin información"}
                        </p>

                        <p>
                            <strong>Dirección:</strong>
                            ${direccion || "Sin información"}
                        </p>

                    </div>

                </article>
            `;
        }).join("");
    }

    buscador.addEventListener("input", function () {

        const texto = this.value
            .toLowerCase()
            .trim();

        const resultados = directorio.filter(persona => {

            const contenido = Object.values(persona)
                .filter(valor => valor !== null && valor !== undefined)
                .join(" ")
                .toLowerCase();

            return contenido.includes(texto);
        });

        mostrarDirectorio(resultados);
    });

    cargarDirectorio();
});