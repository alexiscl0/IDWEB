
let tareas = [];

const formulario = document.getElementById("formTarea");
const titulo = document.getElementById("titulo");
const curso = document.getElementById("curso");
const fecha = document.getElementById("fecha");
const alertas = document.querySelector(".alertas");

// Evento del formulario
formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    const nuevaTarea = {
        id: Date.now(),
        titulo: titulo.value.trim(),
        curso: curso.value.trim(),
        fechaEntrega: fecha.value,
        completada: false
    };
    tareas.push(nuevaTarea);
    formulario.reset();
    console.log("Tarea agregada:", nuevaTarea);
});