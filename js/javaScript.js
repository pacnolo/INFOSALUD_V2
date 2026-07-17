"use strict";


/* =========================================================
   ELEMENTOS DEL DOM
========================================================= */

const fechaActual =
    document.getElementById("fechaActual");

const horaActual =
    document.getElementById("horaActual");

const buscadorSuperior =
    document.getElementById("buscadorSuperior");

const accesosRapidos =
    document.querySelectorAll(".acceso-rapido");

const botonesMenu =
    document.querySelectorAll(".menu-desplegable");

const bloquesInformacion =
    document.querySelectorAll(".bloque-informacion");

const botonesBloques =
    document.querySelectorAll(".bloque-encabezado");

const btnAccesos =
    document.getElementById("btnAccesos");

const panelAccesos =
    document.getElementById("panelAccesos");

const mensajeSinResultados =
    document.getElementById("mensajeSinResultados");


/* =========================================================
   FECHA Y HORA
========================================================= */

function actualizarFechaHora() {

    const ahora = new Date();

    const opcionesFecha = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    const opcionesHora = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };

    if (fechaActual) {

        fechaActual.textContent =
            ahora.toLocaleDateString(
                "es-MX",
                opcionesFecha
            );

    }

    if (horaActual) {

        horaActual.textContent =
            ahora.toLocaleTimeString(
                "es-MX",
                opcionesHora
            );

    }

}


/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}


/* =========================================================
   MENÚ LATERAL
========================================================= */

botonesMenu.forEach((boton) => {

    boton.addEventListener("click", () => {

        botonesMenu.forEach((otroBoton) => {

            if (otroBoton !== boton) {
                otroBoton.classList.remove("activo");
            }

        });

        boton.classList.toggle("activo");

    });

});


/* =========================================================
   MOSTRAR Y OCULTAR ACCESOS RÁPIDOS
========================================================= */

if (btnAccesos && panelAccesos) {

    btnAccesos.addEventListener("click", () => {

        const estaOculto =
            panelAccesos.classList.toggle("oculto");

        btnAccesos.classList.toggle(
            "cerrado",
            estaOculto
        );

        btnAccesos.setAttribute(
            "aria-expanded",
            String(!estaOculto)
        );

    });

}


/* =========================================================
   BLOQUES DESPLEGABLES
========================================================= */

botonesBloques.forEach((boton) => {

    boton.addEventListener("click", () => {

        const bloqueActual =
            boton.closest(".bloque-informacion");

        if (!bloqueActual) {
            return;
        }

        const estabaActivo =
            bloqueActual.classList.contains("activo");


        /*
        Cierra los demás bloques.
        Así solo queda uno abierto a la vez.
        */

        bloquesInformacion.forEach((bloque) => {

            bloque.classList.remove("activo");

            const encabezado =
                bloque.querySelector(".bloque-encabezado");

            if (encabezado) {

                encabezado.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });


        /*
        Si el bloque estaba cerrado, se abre.
        Si estaba abierto, permanece cerrado.
        */

        if (!estabaActivo) {

            bloqueActual.classList.add("activo");

            boton.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });

});


/* =========================================================
   BUSCADOR GENERAL
========================================================= */

function filtrarContenido() {

    if (!buscadorSuperior) {
        return;
    }

    const textoBuscado =
        normalizarTexto(
            buscadorSuperior.value
        );

    let accesosEncontrados = 0;
    let bloquesEncontrados = 0;


    /* FILTRAR ACCESOS RÁPIDOS */

    accesosRapidos.forEach((acceso) => {

        const contenido =
            normalizarTexto(
                acceso.textContent
            );

        const coincide =
            textoBuscado === "" ||
            contenido.includes(textoBuscado);

        acceso.style.display =
            coincide
                ? "flex"
                : "none";

        if (coincide) {
            accesosEncontrados++;
        }

    });


    /* FILTRAR BLOQUES */

    bloquesInformacion.forEach((bloque) => {

        const palabrasClave =
            bloque.dataset.busqueda || "";

        const contenido =
            normalizarTexto(
                bloque.textContent +
                " " +
                palabrasClave
            );

        const coincide =
            textoBuscado === "" ||
            contenido.includes(textoBuscado);

        bloque.classList.toggle(
            "oculto-busqueda",
            !coincide
        );

        if (coincide) {
            bloquesEncontrados++;
        }

    });


    /* MENSAJE SIN RESULTADOS */

    if (mensajeSinResultados) {

        const noHayResultados =
            textoBuscado !== "" &&
            accesosEncontrados === 0 &&
            bloquesEncontrados === 0;

        mensajeSinResultados.hidden =
            !noHayResultados;

    }

}


/* =========================================================
   EVENTOS DEL BUSCADOR
========================================================= */

if (buscadorSuperior) {

    buscadorSuperior.addEventListener(
        "input",
        filtrarContenido
    );

    buscadorSuperior.addEventListener(
        "keydown",
        (evento) => {

            if (evento.key === "Escape") {

                buscadorSuperior.value = "";

                filtrarContenido();

                buscadorSuperior.blur();

            }

        }
    );

}




/*******************************************
    FECHA Y HORA
*******************************************/
function actualizarFechaHora() {

    const ahora = new Date();

    const opcionesFecha = {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    };

    const fecha = ahora.toLocaleDateString('es-MX', opcionesFecha);

    const hora = ahora.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const elemento = document.getElementById("fechaHora");

    if(elemento){

        elemento.innerHTML = `${fecha} | ${hora}`;

    }

}

actualizarFechaHora();

setInterval(actualizarFechaHora,1000);


/*******************************************
    CONTADOR DE VISITAS
*******************************************/
(function(){

    const elemento = document.getElementById("numeroVisitas");

    if(!elemento) return;

    const CLAVE_VISITAS = "contadorVisitasPortal";
    const CLAVE_SESION  = "visitaRegistrada";

    let visitas = Number(localStorage.getItem(CLAVE_VISITAS)) || 0;

    if(!sessionStorage.getItem(CLAVE_SESION)){

        visitas++;

        localStorage.setItem(CLAVE_VISITAS, visitas);

        sessionStorage.setItem(CLAVE_SESION, "SI");

    }

    elemento.textContent = visitas.toLocaleString("es-MX");

})();


/*******************************************
    BUSCADOR
*******************************************/
filtrarContenido();