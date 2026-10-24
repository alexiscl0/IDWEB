const fs = require('fs');
const path = require('path');
const cursosFilePath = path.join(__dirname, '../data/cursos.json');

exports.getAllCurso = (req, res) => {
    const data = fs.readFileSync(cursosFilePath, 'utf8');
    const cursos = JSON.parse(data);

    res.json(cursos);
};

exports.createCurso = (req, res) => {
    const data = fs.readFileSync(cursosFilePath, 'utf8'); // Leer el archivo JSON
    const cursos = JSON.parse(data); // Parsear el contenido del archivo JSON a un array de objetos

    const newCurso = { 
        id: cursos.length > 0
            ? Math.max(...cursos.map(c => c.id)) + 1
            : 1,
        nombre: req.body.nombre,
        creditos: req.body.creditos,
        docente: req.body.docente
    };

    cursos.push(newCurso); // Agregar el nuevo curso al array de cursos

    fs.writeFileSync(cursosFilePath, JSON.stringify(cursos, null, 2)); // Escribir el array actualizado de cursos en el archivo JSON

    res.status(201).json(newCurso); // Devolver el nuevo curso creado como respuesta
};

exports.updateCurso = (req, res) => {
    const id = parseInt(req.params.id);

    const index = cursos.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({
            mensaje: 'Curso no encontrado'
        });
    }

    cursos[index] = {
        id: id,
        nombre: req.body.nombre,
        creditos: req.body.creditos,
        docente: req.body.docente
    };

    fs.writeFileSync(
        cursosFilePath,
        JSON.stringify(cursos, null, 2)
    );

    res.json(cursos[index]);fs.readFileSync(cursosFilePath, 'utf8')
};