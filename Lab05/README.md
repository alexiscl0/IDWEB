# API REST con Node.js y Express

## 1. Descripción

Este proyecto consiste en una API REST desarrollada con **Node.js y Express**, que permite realizar peticiones HTTP mediante los métodos GET y POST.

La API incluye validación de datos, consulta del estado del servidor y manejo de errores 404 para rutas inexistentes. Las respuestas se devuelven en formato JSON.

## 2. Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

- Node.js
- npm (Node Package Manager)
- Git (opcional)
- Postman o curl para probar las rutas

Para verificar las instalaciones, ejecutar:

```bash
node -v
npm -v
```

## 3. Instalación del proyecto

### Paso 1. Descargar o clonar el proyecto

Si el proyecto está alojado en GitHub:

```bash
git clone URL_DEL_REPOSITORIO
cd mi-api
```

Si ya tienes la carpeta del proyecto, simplemente ábrela desde la terminal.

### Paso 2. Instalar las dependencias

Ejecutar:

```bash
npm install
```

Este comando instalará las dependencias definidas en `package.json`, incluyendo Express y Nodemon.

### Paso 3. Inicializar npm (solo para proyectos nuevos)

Si estás creando el proyecto desde cero:

```bash
npm init -y
```

Esto genera el archivo `package.json`.

## 4. Estructura del proyecto

```text
mi-api/
│
├── node_modules/
├── index.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

**Descripción de archivos:**

- `index.js`: Archivo principal del servidor y definición de rutas.
- `package.json`: Configuración del proyecto, scripts y dependencias.
- `package-lock.json`: Registro de versiones de las dependencias.
- `.gitignore`: Excluye la carpeta `node_modules/` del repositorio.
- `README.md`: Documentación del proyecto.

## 5. Ejecución del servidor

El proyecto dispone de dos modos de ejecución.

### Modo normal

```bash
npm start
```

### Modo desarrollo

```bash
npm run dev
```

El modo desarrollo utiliza Nodemon, que reinicia automáticamente el servidor cuando se detectan cambios en el código.

Al ejecutar correctamente, aparecerá:

```text
Servidor ejecutándose en http://localhost:3000
```

La API estará disponible en:

http://localhost:3000

Para detener el servidor, presionar `Ctrl + C`.

## 6. Endpoints disponibles

| Método     | Ruta             | Descripción                     | Código |
| ---------- | ---------------- | ------------------------------- | ------ |
| GET        | `/`              | Mensaje de bienvenida           | 200    |
| GET        | `/api/status`    | Consultar estado del servidor   | 200    |
| POST       | `/api/usuarios`  | Registrar datos válidos         | 201    |
| POST       | `/api/usuarios`  | Validación de datos incorrectos | 400    |
| Cualquiera | Ruta inexistente | Error 404 en JSON               | 404    |

## 7. Pruebas de la API con curl

Para realizar las pruebas, el servidor debe estar ejecutándose.

### Prueba 1: GET /api/status

Verifica si el servidor funciona correctamente.

```bash
curl -i http://localhost:3000/api/status
```

**Respuesta esperada (200 OK):**

```json
{
  "status": "OK",
  "mensaje": "Servidor funcionando correctamente"
}
```

### Prueba 2: POST con datos válidos

Envía un usuario con nombre y edad válidos.

```bash
curl -i -X POST http://localhost:3000/api/usuarios \
-H "Content-Type: application/json" \
-d '{"nombre":"Carlos","edad":20}'
```

**Respuesta esperada (201 Created):**

```json
{
  "mensaje": "Usuario registrado correctamente",
  "usuario": {
    "nombre": "Carlos",
    "edad": 20
  }
}
```

### Prueba 3: POST con datos inválidos

Se envían datos que no cumplen las validaciones.

```bash
curl -i -X POST http://localhost:3000/api/usuarios \
-H "Content-Type: application/json" \
-d '{"nombre":"","edad":-5}'
```

**Respuesta esperada (400 Bad Request):**

```json
{
  "error": "Datos inválidos",
  "mensaje": "Se requiere un nombre y una edad válida"
}
```

### Prueba 4: Ruta inexistente (404)

Se realiza una petición a una ruta que no está definida.

```bash
curl -i http://localhost:3000/api/productos
```

**Respuesta esperada (404 Not Found):**

```json
{
  "error": "Ruta no encontrada",
  "mensaje": "La ruta /api/productos no existe"
}
```

## 8. Pruebas utilizando Postman

También se pueden realizar las pruebas mediante Postman.

1. Abrir Postman.
2. Crear una nueva petición HTTP.
3. Seleccionar el método GET o POST.
4. Introducir la URL correspondiente.
5. Para POST, seleccionar **Body → raw → JSON**.
6. Introducir los datos en formato JSON.
7. Presionar **Send**.
8. Verificar el código HTTP y la respuesta JSON.

**Ejemplo de cuerpo para POST:**

```json
{
  "nombre": "Carlos",
  "edad": 20
}
```

## 9. Códigos de respuesta HTTP

| Código | Significado                        |
| ------ | ---------------------------------- |
| 200    | Solicitud procesada correctamente. |
| 201    | Recurso creado correctamente.      |
| 400    | Los datos enviados son inválidos.  |
| 404    | La ruta solicitada no existe.      |

## 10. Configuración de Git

El archivo `.gitignore` contiene:

```gitignore
node_modules/
```

Esto evita subir las dependencias al repositorio.

Cualquier usuario que descargue el proyecto puede reinstalarlas mediante:

```bash
npm install
```

## 11. Consideraciones

- El servidor utiliza el puerto `3000`.
- Las peticiones POST deben enviar datos JSON.
- El campo `nombre` debe contener texto no vacío.
- El campo `edad` debe ser un número entero mayor o igual a cero.
- Las rutas inexistentes responden con código HTTP 404.
- El registro de usuarios es demostrativo: no se almacena información en una base de datos.
