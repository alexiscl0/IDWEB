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
                curso.id === Number(id)) &&

            (codigo === undefined ||
                curso.codigo.toLowerCase() === codigo.toLowerCase()) &&

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

exports.getCursoById = (req, res) => {
  try {
    const data = fs.readFileSync(cursosFilePath, 'utf8');
    const cursos = JSON.parse(data);

    const id = req.params.id;

    const curso = cursos.find(
      curso => String(curso.id) === String(id)
    );

    if (!curso) {
      return res.status(404).json({
        mensaje: 'Curso no encontrado',
        idBuscado: id,
        idsDisponibles: cursos.map(curso => curso.id)
      });
    }

    return res.status(200).json(curso);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al buscar el curso',
      error: error.message
    });
  }
};

exports.createCurso = (req, res) => {
    const data = fs.readFileSync(cursosFilePath, 'utf8'); // Leer el archivo JSON
    const cursos = JSON.parse(data); // Parsear el contenido del archivo JSON a un array de objetos

    if ( req.body.nombre === undefined || req.body.creditos === undefined || req.body.codigo === undefined) {
    return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios (curso no creado)'});
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
  try {
    const id = parseInt(req.params.id, 10);

    // Leer los cursos del archivo JSON
    const data = fs.readFileSync(cursosFilePath, 'utf8');
    const cursos = JSON.parse(data);

    // Buscar el curso por su ID
    const index = cursos.findIndex(c => String(c.id) === String(id));

    if (index === -1) {
      return res.status(404).json({
        mensaje: 'Curso no encontrado por el id'
      });
    }

    // Actualizar solamente los campos enviados
    const { nombre, creditos, codigo } = req.body;

    if (nombre !== undefined) {
      cursos[index].nombre = nombre;
    }

    if (creditos !== undefined) {
      cursos[index].creditos = creditos;
    }

    if (codigo !== undefined) {
      cursos[index].codigo = codigo;
    }

    // Guardar los cambios en el archivo JSON
    fs.writeFileSync(
      cursosFilePath,
      JSON.stringify(cursos, null, 2)
    );

    return res.status(200).json(cursos[index]);

  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al actualizar el curso',
      error: error.message
    });
  }
};


exports.deleteCurso = (req, res) => {
    const data = fs.readFileSync(cursosFilePath, 'utf8');
    const cursos = JSON.parse(data);

    const id = parseInt(req.params.id);
    const index = cursos.findIndex(c => String(c.id) === String(id));

    if (index === -1) {
        return res.status(404).json({
            mensaje: 'Curso no encontrado'
        });
    }

    const cursoEliminado = cursos.splice(index, 1)[0];

    fs.writeFileSync(
        cursosFilePath,
        JSON.stringify(cursos, null, 2)
    );

    res.status(200).json({
        mensaje: 'Curso eliminado correctamente',
        curso: cursoEliminado
    });
};
