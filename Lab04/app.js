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


// Variables para el formulario y la lista de tareas
let tareas = [];

const formulario = document.getElementById("formTarea");
const titulo = document.getElementById("titulo");
const curso = document.getElementById("curso");
const fecha = document.getElementById("fecha");
const alertas = document.querySelector(".alertas");
const listaTareas = document.getElementById("listaTareas");

// Evento del formulario
formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nombreTarea = titulo.value.trim();
    const nombreCurso = curso.value.trim();
    const fechaTarea = fecha.value;

    // Validar campos vacíos
    if (!nombreTarea || !nombreCurso || !fechaTarea) {
        alertas.textContent = "Todos los campos son obligatorios";
        return;
    }

    // Obtener fecha actual
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Convertir fecha seleccionada
    const fechaSeleccionada = new Date(fechaTarea + "T00:00:00");

    // Validar fecha
    if (fechaSeleccionada <= hoy) {
        alertas.textContent = "La fecha debe ser posterior a hoy";
        return;
    }

    alertas.textContent = "";

    const nuevaTarea = {
        id: Date.now(),
        titulo: nombreTarea,
        curso: nombreCurso,
        fechaEntrega: fechaTarea,
        completada: false
    };

    tareas.push(nuevaTarea);

    console.log(tareas);
    mostrarTareas("todos");
    activarFiltro(btnTodos);
    formulario.reset();
});

