const fs = require('fs');
const path = require('path');
const cursosFilePath = path.join(__dirname, '../data/cursos.json');


exports.getAllCurso = (req, res) => {
    const data = fs.readFileSync(cursosFilePath, 'utf8');
    const cursos = JSON.parse(data);

    const { creditos, id, codigo, nombre } = req.query;

    const resultado = cursos.filter(curso => {
        return (
            (creditos === undefined ||
                curso.creditos === Number(creditos)) &&

            (id === undefined ||
                curso.id.toLowerCase() === id.toLowerCase()) &&

            (docente === undefined ||
                curso.codigo.toLowerCase() === docente.toLowerCase()) &&

            (nombre === undefined ||
                curso.nombre.toLowerCase().includes(nombre.toLowerCase()))
        );
    });

    if (resultado.length === 0) {
        return res.status(404).json({
            mensaje: 'No se encontraron cursos con los filtros especificados'
        });
    }

    res.status(200).json(resultado);
};

exports.createCurso = (req, res) => {
    const data = fs.readFileSync(cursosFilePath, 'utf8'); // Leer el archivo JSON
    const cursos = JSON.parse(data); // Parsear el contenido del archivo JSON a un array de objetos

    if(req.body.nombre != undefined && req.body.creditos && req.body.codigo){
        return res.status(404).json({
            mensaje: "Todos los cammpos son Obligatorios (Curso no creado)"
        })
    }

    const newCurso = { 
        id: cursos.length > 0
            ? Math.max(...cursos.map(c => c.id)) + 1
            : 1,
        nombre: req.body.nombre,
        creditos: req.body.creditos,
        codigo: req.body.codigo
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
            mensaje: 'Curso no encontrado por el id'
        });
    }

    cursos[index] = {
        id: id,
        nombre: req.body.nombre,
        creditos: req.body.creditos,
        codigo: req.body.codigo
    };

    fs.writeFileSync(
        cursosFilePath,
        JSON.stringify(cursos, null, 2)
    );

    res.json(cursos[index]);fs.readFileSync(cursosFilePath, 'utf8')
};