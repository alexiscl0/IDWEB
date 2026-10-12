// Variables para los botones de filtro
const btnTodos = document.querySelector(".btnTodos");
const btnPendientes = document.querySelector(".btnPendientes");
const btnCompletadas = document.querySelector(".btnCompletadas");

let filtroActual = "todos";

function activarFiltro(boton) {

    btnTodos.classList.remove("activo");
    btnPendientes.classList.remove("activo");
    btnCompletadas.classList.remove("activo");

    boton.classList.add("activo");

    if (boton === btnTodos) {
        filtroActual = "todos";
    } else if (boton === btnPendientes) {
        filtroActual = "pendientes";
    } else {
        filtroActual = "completadas";
    }
}

activarFiltro(btnTodos);
btnTodos.addEventListener("click", function() {
    activarFiltro(btnTodos);
    mostrarTareas("todos");
});

btnPendientes.addEventListener("click", function() {
    activarFiltro(btnPendientes);
    mostrarTareas("pendientes");
});

btnCompletadas.addEventListener("click", function() {
    activarFiltro(btnCompletadas);
    mostrarTareas("completadas");
});

