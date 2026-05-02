# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : data_usuario_simulation.py
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
# Campos: id_usuario, nombre_completo, correo_electronico,
#         hash_contrasena, rol, esta_activo, fecha_creacion
#
# Restricciones del esquema SQL:
#   - rol IN ('ADMIN', 'UNIVERSIDAD', 'ESTUDIANTE')
#   - correo_electronico LIKE '%@%.%'
#   - esta_activo: 1=activo, 0=inactivo  (TINYINT(1))
# =============================================================================

def generar_usuarios(numero_simulaciones: int) -> list[dict]:
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
        numero_simulaciones (int): Cantidad de registros a generar.

    Retorna:
        list[dict]: Lista de diccionarios con los campos de la tabla 'usuarios'.
    """

    # --- Datos base válidos (universo de valores correctos) ---

    # Nombres completos de prueba para poblar el campo nombre_completo
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

    # Roles permitidos según restricción CHECK del esquema SQL
    roles_validos = ["ADMIN", "UNIVERSIDAD", "ESTUDIANTE"]

    # Dominios de correo institucionales para construir correos de prueba válidos
    dominios_correo = ["@cesde.net", "@eafit.edu.co", "@udea.edu.co", "@itm.edu.co"]

    # Fecha base desde la que se generan fechas de creación aleatorias (año 2025)
    fecha_inicio = datetime(2025, 1, 1)

    # Lista acumuladora de registros generados (cada elemento es un dict/fila)
    lista_usuarios = []

    # Lista auxiliar que almacena correos válidos ya generados para simular duplicados reales
    correos_generados = []

    for indice in range(numero_simulaciones):

        # Extraemos el primer nombre en minúsculas para construir el prefijo del correo.
        # Usamos módulo (%) para ciclar sobre la lista aunque haya más iteraciones que nombres.
        nombre_base = nombres_completos[indice % len(nombres_completos)].split()[0].lower()

        # Correo electrónico válido: prefijo + número aleatorio + dominio (cumple '%@%.%')
        correo_valido = nombre_base + str(random.randint(1, 999)) + random.choice(dominios_correo)

        # Acumulamos el correo válido para poder reutilizarlo como duplicado en iteraciones futuras
        correos_generados.append(correo_valido)

        # --- Registro inicial con datos completamente limpios ---
        usuario = {
            "id_usuario":         indice + 1,                                             # Clave primaria autoincremental
            "nombre_completo":    random.choice(nombres_completos),                       # Nombre elegido al azar del universo
            "correo_electronico": correo_valido,                                          # Correo construido con formato válido
            "hash_contrasena":    "$2b$12$hashSimulado" + str(random.randint(1000, 9999)), # Hash bcrypt simulado
            "rol":                random.choice(roles_validos),                           # Uno de los tres roles permitidos
            "esta_activo":        1,                                                      # 1 = activo (valor TINYINT válido)
            "fecha_creacion":     fecha_inicio + timedelta(days=random.randint(0, 365)),  # Fecha aleatoria dentro del año 2025
        }

        # -----------------------------------------------------------------
        # ERRORES CONTROLADOS
        # Simulan datos sucios que llegan desde formularios o migraciones.
        # Se aplica como máximo un tipo de error por registro.
        # -----------------------------------------------------------------

        # Número aleatorio entre 0.0 y 1.0 que determina qué tipo de error se introduce
        probabilidad_error = random.random()

        if probabilidad_error < 0.10:
            # Error tipo 1 (10 %): correo sin '@' + ID nulo — viola formato y PRIMARY KEY
            usuario["correo_electronico"] = "correo_invalido_sin_arroba.com"
            usuario["id_usuario"] = None                      # Nulo viola NOT NULL en PRIMARY KEY

        elif probabilidad_error < 0.25:
            # Error tipo 2 (15 %): rol inválido + fecha nula — viola CHECK constraint y NOT NULL
            usuario["rol"] = random.choice(["SUPERADMIN", "GUEST", "invitado", ""])
            usuario["fecha_creacion"] = None                  # Nulo viola NOT NULL

        elif probabilidad_error < 0.40:
            # Error tipo 3 (15 %): espacios en nombre + hash vacío + esta_activo fuera de TINYINT(1)
            usuario["nombre_completo"] = "  " + usuario["nombre_completo"] + "  "
            usuario["hash_contrasena"] = ""                   # Hash vacío: inseguro y no aceptable
            usuario["esta_activo"] = -1                       # -1 está fuera del rango válido {0, 1}

        elif probabilidad_error < 0.60:
            # Error tipo 4 (20 %): correo duplicado real + usuario inactivo
            # Reutilizamos un correo de iteraciones anteriores para simular violación de UNIQUE
            usuario["esta_activo"] = 0                        # 0 = inactivo
            if len(correos_generados) > 1:
                # Elegimos aleatoriamente un correo ya registrado (excluimos el actual)
                usuario["correo_electronico"] = random.choice(correos_generados[:-1])
            else:
                # Fallback para el primer registro: usamos un valor estático
                usuario["correo_electronico"] = "duplicado@itm.edu.co"

        elif probabilidad_error < 0.75:
            # Error tipo 5 (15 %): nombre vacío + ID nulo o negativo — viola integridad
            usuario["nombre_completo"] = ""
            usuario["id_usuario"] = random.choice([None, -1, 0])

        # Si probabilidad_error >= 0.75 (25 %), el registro queda completamente limpio

        # Agregamos el registro (con o sin errores) a la lista de resultados
        lista_usuarios.append(usuario)

    return lista_usuarios
