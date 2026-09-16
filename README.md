# 1.Laboratorio 6:ExpresoFast

## Carátula
* **Curso:** IF0009 - Desarrollo de Software IV
* **Ciclo:** II Ciclo 2026
* **Estudiante:** Ericka Mariel Barrantes Durán
* **Carnet:** C5D017
* **Estudiante:**Brayan Caleb Murillo Estrada
* **Carnet:** C5H753

## 2.Requisitos de Entorno
* **Java:** JDK 17 o superior
* **Herramienta de Construcción:** Apache Maven 3.8+
* **Base de Datos:** Microsoft SQL Server
* **Navegador Web:** Google Chrome, Mozilla Firefox o Microsoft Edge (con soporte para ES6+ y Fetch API)

## 3. Guía de Configuración de Base de Datos

Sigue estos pasos para preparar la base de datos localmente antes de ejecutar la aplicación:

1. **Asegurar la instancia de SQL Server**: Confirma que el servicio de SQL Server esté corriendo localmente en el puerto predeterminado (`1433`).
2. **Ejecutar el script SQL**: Abre SQL Server Management Studio (SSMS) o la extensión de SQL Server en VS Code y ejecuta el script principal para crear la base de datos `ExpresoFastDB`, sus tablas, claves foráneas e índices.
3. **Poblar datos iniciales**: El script creará la estructura básica junto con la información semilla para las tablas de empresas logísticas, vehículos, conductores y usuarios con sus contraseñas encriptadas mediante **BCrypt**.
4. **Configurar credenciales locales**: 
   * Copia el archivo `src/main/resources/application.properties.example` y renómbralo a `application.properties`.
   * Sustituye los valores `TU_USUARIO` y `TU_CONTRASEÑA` por tus credenciales de SQL Server. *(Nota: Este archivo está ignorado por Git para no exponer contraseñas).*

---

## 4. Usuarios de Prueba

Para probar el sistema y el control de acceso según roles, utiliza las siguientes credenciales preconfiguradas en el script inicial:

| Usuario | Contraseña | Rol | Descripción |
| :--- | :--- | :--- | :--- |
| **admin** | `admin123` | `ROLE_ADMIN` | Acceso total para gestionar envíos, conductores, vehículos y reportes. |
| **conductor1** | `cond123` | `ROLE_CONDUCTOR` | Permiso para visualizar rutas asignadas y actualizar estados de entrega. |
| **cliente1** | `client123` | `ROLE_CLIENTE` | Consulta únicamente del estado de sus envíos en tiempo real. |

> **Nota de Seguridad**: Las contraseñas en la base de datos están almacenadas como hashes encriptados mediante el algoritmo BCrypt. Las contraseñas en texto plano mostradas en la tabla son únicamente para uso exclusivo de pruebas e integración en entorno local.

1. tener una instancia de **SQL Server** en ejecución.
2. Crea la base de datos `ExpresoFastDB` ejecutando la siguiente sentencia:
   ```sql
   CREATE DATABASE ExpresoFastDB;
   GO
   USE ExpresoFastDB;
   GO


## 5. Instrucciones de Ejecución

### Backend (Spring Boot)
1. Abre una terminal y navega al directorio raíz del proyecto backend donde se encuentra el archivo `pom.xml`:
   ```bash
   cd backend
   mvn clean spring-boot:run
* El backend quedará escuchando peticiones HTTP en http://localhost:8080.

### Frontend

cd frontend
* Haz doble clic sobre login.html para abrirlo directamente en Google Chrome, Mozilla Firefox o Microsoft Edge.