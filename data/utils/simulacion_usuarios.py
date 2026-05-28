# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : simulacion_usuarios.py
# PROPÓSITO  : Generar datos simulados (válidos + con errores controlados)
#              para la tabla 'usuarios' de la base de datos MySQL.
# AUTORES    : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Motor Python : 3.10+
# LIBRERÍAS  : random, datetime
#
# NOTAS PEDAGÓGICAS:
#   - Se usa random.choice() correctamente (NO random.choise).
#   - Las condiciones elif llevan ":" al final (sintaxis obligatoria Python).
#   - El bloque de errores controlados está DENTRO del bucle for.
#   - Se acumulan correos ya generados para simular duplicados reales (error tipo 4).
# =============================================================================

import random
from datetime import datetime, timedelta


# =============================================================================
# TABLA 1: usuarios
# Campos: idusuario, nombrecompleto, correoelectronico,
#         hashcontrasena, rol, estaactivo, fechacreacion,
#         fechamodificacion, ocupacion
#
# Restricciones del esquema SQL:
#   - rol IN ('Master', 'Admin', 'User')
#   - correoelectronico LIKE '%@%.%'
#   - estaactivo: 1=activo, 0=inactivo  (TINYINT(1))
# =============================================================================

def generar_usuarios(numeroSimulaciones: int) -> list[dict]:
    """
    Genera una lista de diccionarios que representan filas de la tabla 'usuarios'.
    Incluye errores controlados para simular datos sucios (limpieza de datos).

    Distribución de errores controlados:
        - 10% Error tipo 1: correo inválido (sin '@') + id_usuario nulo
        - 15% Error tipo 2: rol fuera del CHECK constraint + fecha_creacion nula
        - 15% Error tipo 3: nombre con espacios extra + hash vacío + esta_activo=-1
        - 20% Error tipo 4: esta_activo=0 + correo duplicado (reutiliza uno previo)
        - 15% Error tipo 5: nombre vacío + id_usuario nulo o negativo
        - 25% Sin errores: registro completamente válido

    Parámetros:
        numeroSimulaciones (int): Cantidad de registros a generar.

    Retorna:
        list[dict]: Lista de diccionarios con los campos de la tabla 'usuarios'.
    """

    # --- Datos base válidos (universo de valores correctos) ---

    nombres_completos = [
        "Diana Zapata Ortega",
        "Yuliana Chica Correa",
        "Samuel Zapata Valcarcel",
        "Edwin Rios Sanchez",
        "Mariana López Gómez",
        "Carlos Andrés Pérez",
        "Laura Sofía Hernández",
        "Juan David Martínez",
    ]

    roles_validos = ["Master", "Admin", "User"]

    dominios_correo = ["@cesde.net", "@eafit.edu.co", "@udea.edu.co", "@itm.edu.co"]

    ocupaciones = ["Estudiante", "Docente", "Administrativo", "Investigador", "Egresado"]

    fecha_inicio = datetime(2025, 1, 1)

    lista_usuarios = []
    correos_generados = []

    for indice in range(numeroSimulaciones):

        nombre_base = nombres_completos[indice % len(nombres_completos)].split()[0].lower()
        correo_valido = nombre_base + str(random.randint(1, 999)) + random.choice(dominios_correo)
        correos_generados.append(correo_valido)

        fechaCreacion = fecha_inicio + timedelta(days=random.randint(0, 365))

        usuario = {
            "idusuario":          indice + 1,
            "nombrecompleto":     random.choice(nombres_completos),
            "correoelectronico":  correo_valido,
            "hashcontrasena":     "$2b$12$hashSimulado" + str(random.randint(1000, 9999)),
            "rol":                random.choice(roles_validos),
            "estaactivo":         1,
            "fechacreacion":      fechaCreacion,
            "fechamodificacion":  fechaCreacion + timedelta(days=random.randint(1, 365)),
            "ocupacion":          random.choice(ocupaciones),
        }

        # -----------------------------------------------------------------
        # ERRORES CONTROLADOS
        # -----------------------------------------------------------------
        probabilidad_error = random.random()

        if probabilidad_error < 0.10:
            # Error tipo 1 (10%): correo sin '@' + ID nulo
            usuario["correoelectronico"] = "correo_invalido_sin_arroba.com"
            usuario["idusuario"] = None

        elif probabilidad_error < 0.25:
            # Error tipo 2 (15%): rol inválido + fecha nula
            usuario["rol"] = random.choice(["SUPERADMIN", "GUEST", "invitado", ""])
            usuario["fechacreacion"] = None

        elif probabilidad_error < 0.40:
            # Error tipo 3 (15%): espacios en nombre + hash vacío + estaactivo fuera de rango
            usuario["nombrecompleto"] = "  " + usuario["nombrecompleto"] + "  "
            usuario["hashcontrasena"] = ""
            usuario["estaactivo"] = -1

        elif probabilidad_error < 0.60:
            # Error tipo 4 (20%): correo duplicado + usuario inactivo
            usuario["estaactivo"] = 0
            if len(correos_generados) > 1:
                usuario["correoelectronico"] = random.choice(correos_generados[:-1])
            else:
                usuario["correoelectronico"] = "duplicado@itm.edu.co"

        elif probabilidad_error < 0.75:
            # Error tipo 5 (15%): nombre vacío + ID nulo o negativo
            usuario["nombrecompleto"] = ""
            usuario["idusuario"] = random.choice([None, -1, 0])

        lista_usuarios.append(usuario)

    return lista_usuarios