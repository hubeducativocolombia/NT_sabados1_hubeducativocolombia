# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : data_calidad_beneficio_simulation.py
# PROPÓSITO  : Generar datos simulados (válidos + con errores controlados)
#              para la tabla 'calidad_beneficios' de la base de datos MySQL.
# AUTORES    : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Motor Python : 3.10+
# LIBRERÍAS  : random
#
# NOTAS PEDAGÓGICAS:
#   - Todos los campos indicadores son TINYINT(1): solo admiten los valores 0 o 1.
#   - Los errores controlados simulan las violaciones más comunes en datos reales.
#   - El bloque de errores controlados está DENTRO del bucle for.
#   - Se acumulan id_programas usados para simular duplicados reales (error tipo 4).
# =============================================================================

import random

# =============================================================================
# TABLA 2: calidad_beneficios
# Campos: id_beneficio, id_programa, acreditacion_alta_calidad,
#         ofrece_becas, doble_titulacion, requiere_segundo_idioma
#
# Restricciones del esquema SQL:
#   - id_programa debe existir en programas_academicos (FK — integridad referencial)
#   - Todos los campos indicadores son TINYINT(1): valores válidos son 0 o 1
#   - requiere_segundo_idioma DEFAULT 1 (la mayoría de programas lo exige)
# =============================================================================

def generar_calidad_beneficios(numero_simulaciones: int) -> list[dict]:
    """
    Genera una lista de diccionarios que representan filas de 'calidad_beneficios'.
    Incluye errores controlados: valores fuera de rango, nulos y duplicados.

    Distribución de errores controlados:
        - 10% Error tipo 1: valores TINYINT fuera de rango {0,1} + id_beneficio nulo
        - 15% Error tipo 2: id_programa inexistente (viola FK) + campo booleano nulo
        - 15% Error tipo 3: todos los campos indicadores en None (registro vacío)
        - 15% Error tipo 4: id_programa duplicado real (reutiliza uno previo, viola UNIQUE)
        - 15% Error tipo 5: requiere_segundo_idioma con texto en lugar de TINYINT
        - 30% Sin errores: registro completamente válido

    Parámetros:
        numero_simulaciones (int): Cantidad de registros a generar.

    Retorna:
        list[dict]: Lista de diccionarios con los campos de 'calidad_beneficios'.
    """

    # Universo de 10 IDs de programas académicos válidos (deben existir en la tabla programas_academicos)
    ids_programas_validos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    # Lista acumuladora de registros generados (cada elemento es un dict/fila)
    lista_beneficios = []

    # Lista auxiliar que guarda los id_programa ya asignados para simular duplicados reales
    ids_programas_usados = []

    for indice in range(numero_simulaciones):

        # Seleccionamos aleatoriamente un id_programa válido para este registro
        id_programa_actual = random.choice(ids_programas_validos)

        # Acumulamos el id_programa para poder reutilizarlo como duplicado en iteraciones futuras
        ids_programas_usados.append(id_programa_actual)

        # --- Registro inicial con datos completamente limpios (TINYINT válido: solo 0 o 1) ---
        beneficio = {
            "id_beneficio":              indice + 1,              # Clave primaria autoincremental
            "id_programa":               id_programa_actual,      # FK a la tabla programas_academicos
            "acreditacion_alta_calidad": random.choice([0, 1]),   # 0 = No acreditado, 1 = Acreditado
            "ofrece_becas":              random.choice([0, 1]),   # 0 = No ofrece becas, 1 = Ofrece becas
            "doble_titulacion":          random.choice([0, 1]),   # 0 = Sin doble título, 1 = Con doble título
            "requiere_segundo_idioma":   1,                       # DEFAULT = 1 según esquema SQL
        }

        # -----------------------------------------------------------------
        # ERRORES CONTROLADOS
        # Simulan inconsistencias comunes en datos de calidad académica.
        # Se aplica como máximo un tipo de error por registro.
        # -----------------------------------------------------------------

        # Número aleatorio entre 0.0 y 1.0 que determina el tipo de error a introducir
        probabilidad_error = random.random()

        if probabilidad_error < 0.10:
            # Error tipo 1 (10 %): valores booleanos fuera del rango TINYINT(1) + id_beneficio nulo
            beneficio["acreditacion_alta_calidad"] = random.choice([-1, 2, 99])  # Fuera del rango {0, 1}
            beneficio["ofrece_becas"] = random.choice([-1, 2])                   # Fuera del rango {0, 1}
            beneficio["id_beneficio"] = None                                      # Nulo viola PRIMARY KEY

        elif probabilidad_error < 0.25:
            # Error tipo 2 (15 %): id_programa apunta a un programa inexistente (viola FK)
            beneficio["id_programa"] = random.choice([0, -5, 9999])  # IDs que no existen en programas_academicos
            beneficio["doble_titulacion"] = None                      # Nulo en campo booleano viola NOT NULL

        elif probabilidad_error < 0.40:
            # Error tipo 3 (15 %): todos los indicadores en None → registro completamente vacío
            beneficio["acreditacion_alta_calidad"] = None  # Nulo en campo indicador
            beneficio["ofrece_becas"] = None               # Nulo en campo indicador
            beneficio["doble_titulacion"] = None           # Nulo en campo indicador
            beneficio["requiere_segundo_idioma"] = None    # Nulo sobrescribe el DEFAULT

        elif probabilidad_error < 0.55:
            # Error tipo 4 (15 %): id_programa duplicado real — reutiliza uno ya asignado
            # Esto viola la restricción UNIQUE si el esquema la define sobre id_programa
            if len(ids_programas_usados) > 1:
                # Elegimos aleatoriamente un id_programa de iteraciones anteriores (excluimos el actual)
                beneficio["id_programa"] = random.choice(ids_programas_usados[:-1])
            else:
                # Fallback para el primer registro: usamos el mismo ID actual como duplicado de sí mismo
                beneficio["id_programa"] = ids_programas_usados[0]

        elif probabilidad_error < 0.70:
            # Error tipo 5 (15 %): requiere_segundo_idioma con cadena de texto en lugar de TINYINT(1)
            beneficio["requiere_segundo_idioma"] = random.choice(["SI", "NO", "si"])  # Texto viola tipo de dato

        # Si probabilidad_error >= 0.70 (30 %), el registro queda completamente limpio

        # Agregamos el registro (con o sin errores) a la lista de resultados
        lista_beneficios.append(beneficio)

    return lista_beneficios
