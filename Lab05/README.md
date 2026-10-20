# Servidor HTTP Nativo — Laboratorio 05

## 1. Descripción del proyecto

Este proyecto consiste en implementar un servidor HTTP utilizando Node.js y su módulo nativo `http`, sin utilizar frameworks externos como Express.

El servidor permite gestionar peticiones HTTP mediante diferentes rutas y métodos, incluyendo la consulta y el registro de estudiantes a través de una API REST básica.

## 2. Objetivos

- Implementar un servidor HTTP nativo utilizando `http.createServer()`.
- Gestionar peticiones HTTP mediante los métodos GET y POST.
- Implementar endpoints para consultar y registrar estudiantes.
- Procesar el cuerpo de las peticiones POST mediante eventos.
- Retornar respuestas JSON con códigos de estado HTTP adecuados.
- Gestionar rutas inexistentes mediante respuestas 404.

## 3. Ejecución del servidor

Desde la terminal, ubicarse en la carpeta principal del proyecto y ejecutar:

```bash
npm start
```

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Una vez iniciado, el servidor estará disponible en:

```text
http://localhost:3000
```

## 4. Rutas HTTP implementadas

| Método | Ruta                | Descripción                                | Código HTTP   |
| ------ | ------------------- | ------------------------------------------ | ------------- |
| GET    | `/`                 | Muestra el archivo HTML principal          | 200 OK        |
| GET    | `/api/status`       | Consulta el estado del servidor            | 200 OK        |
| GET    | `/api/estudiantes`  | Obtiene la lista de estudiantes            | 200 OK        |
| POST   | `/api/estudiantes`  | Registra un nuevo estudiante               | 201 Created   |
| GET    | `/ruta-inexistente` | Devuelve un error de recurso no encontrado | 404 Not Found |

Las solicitudes POST con datos inválidos devuelven el código `400 Bad Request`.

## 5. Procesamiento de peticiones HTTP

El servidor se implementa mediante:

```javascript
const server = http.createServer((req, res) => {
  console.log(`Petición recibida: ${req.method} ${req.url}`);
});
```

El objeto `req` representa la petición realizada por el cliente y permite identificar el método HTTP y la URL solicitada.

El objeto `res` permite enviar respuestas al cliente, estableciendo códigos de estado, encabezados HTTP y contenido.

### 5.1. Peticiones GET

Las peticiones GET permiten consultar información del servidor.

Ejemplo:

```bash
curl -i http://localhost:3000/api/estudiantes
```

Respuesta esperada:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
[
  {
    "id": 1,
    "nombre": "Carlos",
    "carrera": "Ingeniería de Sistemas"
  }
]
```

### 5.2. Peticiones POST

Las peticiones POST permiten enviar información al servidor para registrar nuevos estudiantes.

El cuerpo de la petición se recibe mediante los eventos `data` y `end`:

```javascript
let body = "";

req.on("data", (chunk) => {
  body += chunk;
});

req.on("end", () => {
  const estudiante = JSON.parse(body);
});
```

- **data:** recibe los fragmentos de información enviados por el cliente.
- **end:** indica que se terminó de recibir el cuerpo de la petición.
- **JSON.parse():** convierte los datos recibidos en un objeto JavaScript.

En la implementación completa, el análisis del JSON se encuentra protegido mediante `try...catch` para manejar entradas inválidas.

## 6. Pruebas de funcionamiento

### Prueba 1: Consultar el estado del servidor

```bash
curl -i http://localhost:3000/api/status
```

Respuesta:

```json
{
  "status": "OK",
  "uptime": 35.42
}
```

El valor `uptime` representa los segundos transcurridos desde que se inició el proceso de Node.js.

### Prueba 2: Consultar estudiantes

```bash
curl -i http://localhost:3000/api/estudiantes
```

Código esperado: `200 OK`.

### Prueba 3: Registrar un estudiante

```bash
curl -i -X POST http://localhost:3000/api/estudiantes \
-H "Content-Type: application/json" \
-d '{"nombre":"Carlos","carrera":"Ingeniería de Sistemas"}'
```

Respuesta de ejemplo:

```json
{
  "id": 1,
  "nombre": "Carlos",
  "carrera": "Ingeniería de Sistemas"
}
```

Código esperado: `201 Created`.

El identificador dependerá de los registros existentes.

### Prueba 4: Enviar una petición POST inválida

```bash
curl -i -X POST http://localhost:3000/api/estudiantes \
-H "Content-Type: application/json" \
-d '{"nombre":"Carlos"}'
```

Respuesta:

```json
{
  "mensaje": "Nombre y carrera son obligatorios"
}
```

Código esperado: `400 Bad Request`.

### Prueba 5: Consultar una ruta inexistente

```bash
curl -i http://localhost:3000/ruta-inexistente
```

Respuesta:

```json
{
  "mensaje": "Recurso no encontrado"
}
```

Código esperado: `404 Not Found`.

## 7. Códigos de estado HTTP

| Código | Significado           | Aplicación                              |
| ------ | --------------------- | --------------------------------------- |
| 200    | OK                    | Petición GET procesada correctamente    |
| 201    | Created               | Estudiante registrado correctamente     |
| 400    | Bad Request           | Datos enviados incorrectos              |
| 404    | Not Found             | Ruta o recurso inexistente              |
| 500    | Internal Server Error | Error interno al procesar una solicitud |

## 8. Conclusiones

- Se implementó un servidor HTTP nativo utilizando Node.js sin depender de frameworks externos.
- Se desarrollaron rutas que permiten procesar peticiones GET y POST.
- Se implementó la recepción del cuerpo de las peticiones POST utilizando los eventos `data` y `end`.
- Se establecieron códigos de estado HTTP apropiados para informar sobre el resultado de las solicitudes.
- Se incorporó un mecanismo para responder ante rutas inexistentes mediante el código 404 y un mensaje en formato JSON.
