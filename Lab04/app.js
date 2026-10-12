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


// Mostrar Tareas
function mostrarTareas(filtro="todos") {

    listaTareas.innerHTML = "";
    let tareasFiltradas = tareas;

    if (filtro === "pendientes") {
        tareasFiltradas = tareas.filter(tarea => tarea.completada === false);
    }

    if (filtro === "completadas") {
        tareasFiltradas = tareas.filter(tarea => tarea.completada === true);
    }

    tareasFiltradas.forEach(function(tarea) {

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-tarea");

        const nombre = document.createElement("h3");
        nombre.textContent = tarea.titulo;

        const curso = document.createElement("p");
        curso.textContent = tarea.curso;

        const fecha = document.createElement("p");
        fecha.textContent = tarea.fechaEntrega;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarea.completada;

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("btn-eliminar");

        btnEliminar.addEventListener("click", function() {

            tareas = tareas.filter(t => t.id !== tarea.id);

            mostrarTareas(filtroActual);

        });

        checkbox.addEventListener("change", function() {

        const tareaEncontrada = tareas.find(t => t.id === tarea.id);

            if (tareaEncontrada) {
                tareaEncontrada.completada = checkbox.checked;
            }

            mostrarTareas(filtroActual);

        });
        tarjeta.append(nombre, curso, fecha, checkbox, btnEliminar);

        listaTareas.appendChild(tarjeta);

    });

}