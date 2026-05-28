# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : consumiendo_usuarios.py
# PROPÓSITO  : Consumir servicios RESTful desarrollados en el backend de Spring Boot, específicamente diseñados
#              para la tabla 'usuarios' de la base de datos MySQL.
# AUTORES    : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Motor Python : 3.10+
# LIBRERÍAS  : random, datetime
#
# =============================================================================

# Pasos para conectarme conectarme con el backend (Consumir API)

try:
    import requests
except ImportError:  # pragma: no cover - runtime dependency
    requests = None
def consumir_servicios_usuarios():
    # 1. Almacenar la URL + Endpoint en una variable
    url="http://localhost:8080/api/usuarios"

    # 2 .Activar Requets
    if requests is None:
        raise ImportError("Se requiere la biblioteca 'requests'. Instar con: pip install requests")

    respuesta = requests.get(url)


    # 3. Esperar el status code
    respuesta.raise_for_status() # Si el status code es diferente a 200, se lanzará una excepción

    
    # 4. Verificar el formato de respuesta
    datos = respuesta.json() # Convertir la respuesta a formato JSON


    #5. Retornar la respuesta
    return datos