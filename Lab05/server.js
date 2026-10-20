
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const rutaEstudiantes = path.join(__dirname, 'data', 'estudiantes.json');
const carpetaPublic = path.join(__dirname, 'public');

// Función para enviar respuestas JSON
function responderJSON(res, codigo, datos) {
    res.writeHead(codigo, {
        'Content-Type': 'application/json; charset=utf-8'
    });
    res.end(JSON.stringify(datos));
}

// Crear servidor HTTP
const server = http.createServer((req, res) => {

    // Log de la petición
    console.log(`Petición recibida: ${req.method} ${req.url}`);

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const ruta = url.pathname;

    // GET /api/status
    if (ruta === '/api/status' && req.method === 'GET') {
        return responderJSON(res, 200, {
            status: 'OK',
            uptime: process.uptime()
        });
    }

    // GET /api/estudiantes
    if (ruta === '/api/estudiantes' && req.method === 'GET') {

        fs.readFile(rutaEstudiantes, 'utf8', (err, contenido) => {
            if (err) {
                return responderJSON(res, 500, {
                    mensaje: 'Error al leer los estudiantes'
                });
            }

            try {
                const estudiantes = JSON.parse(contenido);
                responderJSON(res, 200, estudiantes);
            } catch (error) {
                responderJSON(res, 500, {
                    mensaje: 'Error al procesar el archivo JSON'
                });
            }
        });

        return;
    }

    // POST /api/estudiantes
    if (ruta === '/api/estudiantes' && req.method === 'POST') {

        let body = '';

        // Recibir los fragmentos de información
        req.on('data', (chunk) => {
            body += chunk;
        });

        // Cuando termina la recepción
        req.on('end', () => {

            let nuevoEstudiante;

            try {
                nuevoEstudiante = JSON.parse(body);

                if (
                    !nuevoEstudiante ||
                    typeof nuevoEstudiante !== 'object' ||
                    Array.isArray(nuevoEstudiante) ||
                    typeof nuevoEstudiante.nombre !== 'string' ||
                    !nuevoEstudiante.nombre.trim() ||
                    typeof nuevoEstudiante.carrera !== 'string' ||
                    !nuevoEstudiante.carrera.trim()
                ) {
                    return responderJSON(res, 400, {
                        mensaje: 'Nombre y carrera son obligatorios'
                    });
                }

            } catch (error) {
                return responderJSON(res, 400, {
                    mensaje: 'JSON inválido'
                });
            }

            // Leer los datos existentes
            fs.readFile(rutaEstudiantes, 'utf8', (err, contenido) => {

                if (err) {
                    return responderJSON(res, 500, {
                        mensaje: 'Error al leer el archivo'
                    });
                }

                let estudiantes;

                try {
                    estudiantes = JSON.parse(contenido);

                    if (!Array.isArray(estudiantes)) {
                        throw new Error('Se esperaba un arreglo');
                    }
                } catch (error) {
                    return responderJSON(res, 500, {
                        mensaje: 'El archivo de estudiantes no es válido'
                    });
                }

                // Crear un nuevo estudiante
                const estudiante = {
                    id: estudiantes.reduce(
                        (max, e) => Math.max(max, Number(e.id) || 0), 0
                    ) + 1,
                    nombre: nuevoEstudiante.nombre.trim(),
                    carrera: nuevoEstudiante.carrera.trim()
                };

                estudiantes.push(estudiante);

                // Guardar los datos de forma asíncrona
                fs.writeFile(
                    rutaEstudiantes,
                    JSON.stringify(estudiantes, null, 2),
                    'utf8',
                    (err) => {

                        if (err) {
                            return responderJSON(res, 500, {
                                mensaje: 'Error al guardar el estudiante'
                            });
                        }

                        responderJSON(res, 201, estudiante);
                    }
                );
            });
        });

        req.on('error', () => {
            if (!res.headersSent) {
                responderJSON(res, 400, {
                    mensaje: 'Error al recibir los datos'
                });
            }
        });

        return;
    }

    // Servir archivos estáticos desde /public
    if (req.method === 'GET') {

        const archivo = ruta === '/' ? '/index.html' : ruta;
        const rutaArchivo = path.resolve(carpetaPublic, '.' + archivo);

        // Evitar acceder a archivos fuera de /public
        if (
            rutaArchivo !== carpetaPublic &&
            !rutaArchivo.startsWith(carpetaPublic + path.sep)
        ) {
            return responderJSON(res, 404, {
                mensaje: 'Recurso no encontrado'
            });
        }

        const extensiones = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml'
        };

        const extension = path.extname(rutaArchivo);
        const contentType = extensiones[extension] || 'application/octet-stream';

        fs.readFile(rutaArchivo, (err, contenido) => {

            if (err) {
                return responderJSON(res, err.code === 'ENOENT' || err.code === 'EISDIR' ? 404 : 500, {
                    mensaje: err.code === 'ENOENT' || err.code === 'EISDIR'
                        ? 'Recurso no encontrado'
                        : 'Error interno del servidor'
                });
            }

            res.writeHead(200, {
                'Content-Type': contentType
            });

            res.end(contenido);
        });

        return;
    }

    // Ruta no encontrada
    responderJSON(res, 404, {
        mensaje: 'Recurso no encontrado'
    });

});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
