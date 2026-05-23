# Proyecto Integrador: hubeducativocolombia
NT_sabados1_hubeducativocolombia
## Tipo:
Monorepo

PROYECTO  : Hub Educativo Colombia
STACK     : Motor de base de datos MySQL 8.4 InnoDB
          : Frontend HTML + CSS + React Vite + Test
		  : Backend Spring Boot + Maven + JDK 21
		  : Analitica (Data) Python 3.14 + Pandas + Requests
AUTORES   : Diana Zapata Ortega, Yuliana Chica Correa,
            Samuel Zapata Valcarcel y Edwin Rios Sanchez
PROFESORES: Juan Gallego, Freddy Moscoso y Jossy Tello
NOTAS     : Datos de prueba (10 registros por tabla)
FECHA     : Mayo 23, 2026
REQUISITO : Ejecutar primero backend


### Ejecutar frontend con vite
En bash:
npm create vite@latest
(dir_nombre_del_proyecto: frontend)
cd frontend
npm install
npm run dev
#### Con test
npm install --save-dev jest jest-environment-jsdom babel-jest @babel/preset-env @babel/preset-react @testing-library/react @testing-library/jest-dom @testing-library/user-event identity-obj-proxy
npm test o npm test -- Componente.test.jsx
npm test -- --coverage


### Ejecutar backend
En bash:
cd backend
mvnw spring-boot:run


### Analitica
En bash:
cd data
python -m venv venv
cd venv\Scripts
activate
cd ..\\..\\
pip install -r requirements.txt
pip install -e .
pip install pandas requests 
pip freeze > requirements.txt
pip list
python main.py (o archivo principal)
#### Desactivar entorno:
En bash:
cd venv\Scripts
deactivate
