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

## 3.Guía de Configuración de Base de Datos

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