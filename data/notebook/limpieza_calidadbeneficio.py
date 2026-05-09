# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : limpieza_calidadbeneficio.py
# PROPÓSITO  : Limpiar y validar los datos simulados (sucios) generados por
#              simulacion_calidadbeneficio.py para la tabla 'calidadbeneficios'.
# AUTORES    : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Motor Python : 3.10+
# LIBRERÍAS  : pandas
#
# NOTAS PEDAGÓGICAS:
#   - Se usa .copy() para no mutar el DataFrame original (buena práctica).
#   - Los campos TINYINT(1) solo admiten los valores 0 o 1: se validan con .isin([0, 1]).
#   - Los id_programa inválidos (0, negativos, inexistentes) se marcan como NA.
#   - Los duplicados de id_programa se eliminan conservando la primera aparición.
#   - Los campos de texto en requieresegundoidioma se convierten si es posible,
#     o se marcan como NA cuando la conversión no es posible.
#   - Las columnas obligatorias se validan al final con dropna().
# =============================================================================

import pandas as pd


def limpiar_calidad_beneficios(data_frame_sucio: pd.DataFrame) -> pd.DataFrame:
    """
    Limpia y valida un DataFrame con datos de la tabla 'calidad_beneficios'
    generados por simulacion_calidadbeneficio.py. Corrige los cinco tipos
    de errores controlados.

    Errores corregidos (referencia simulacion_calidadbeneficio.py):
        - Error tipo 1: valores TINYINT fuera de rango {0,1} + idbeneficio nulo
        - Error tipo 2: idprograma inexistente (viola FK) + campo booleano nulo
        - Error tipo 3: todos los campos indicadores en None (registro vacío)
        - Error tipo 4: idprograma duplicado real (viola UNIQUE)
        - Error tipo 5: requieresegundoidioma con texto en lugar de TINYINT

    Parámetros:
        data_frame_sucio (pd.DataFrame): DataFrame con los registros sin limpiar.

    Retorna:
        pd.DataFrame: DataFrame limpio, listo para inserción en MySQL.
    """

    data_frame_limpio = data_frame_sucio.copy()

    # -------------------------------------------------------------------------
    # LIMPIEZA DE DATOS NUMÉRICOS — IDs
    # -------------------------------------------------------------------------

    # 1. Verificar que 'idbeneficio' sea numérico
    #    Corrige Error tipo 1 (idbeneficio nulo → NA)
    data_frame_limpio["idbeneficio"] = pd.to_numeric(
        data_frame_limpio["idbeneficio"], errors="coerce"
    )

    # 2. Validar que 'idbeneficio' sea estrictamente positivo (PRIMARY KEY válida)
    data_frame_limpio = data_frame_limpio[
        data_frame_limpio["idbeneficio"].isna() | (data_frame_limpio["idbeneficio"] > 0)
    ]

    # 3. Verificar que 'idprograma' sea numérico
    data_frame_limpio["idprograma"] = pd.to_numeric(
        data_frame_limpio["idprograma"], errors="coerce"
    )

    # 4. Validar que 'idprograma' esté dentro del universo de IDs válidos
    #    Corrige Error tipo 2 (0, -5, 9999 → NA por no existir en programas_academicos)
    ids_programas_validos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    data_frame_limpio["idprograma"] = data_frame_limpio["idprograma"].where(
        data_frame_limpio["idprograma"].isin(ids_programas_validos),
        pd.NA
    )

    # -------------------------------------------------------------------------
    # LIMPIEZA DE CAMPOS INDICADORES TINYINT(1)
    # Valores válidos exclusivamente: 0 o 1
    # -------------------------------------------------------------------------

    # Lista de los cuatro campos indicadores definidos en el esquema SQL
    campos_tinyint = [
        "acreditacionaltacalidad",
        "ofrecebecas",
        "dobletitulacion",
        "requieresegundoidioma",
    ]

    for campo in campos_tinyint:

        # Paso 1: Intentar convertir texto a número antes de validar rango
        #         Corrige Error tipo 5 ("SI" → NA, "NO" → NA, "si" → NA)
        #         pd.to_numeric convierte "1" → 1, "0" → 0 y el resto → NA
        data_frame_limpio[campo] = pd.to_numeric(
            data_frame_limpio[campo], errors="coerce"
        )

        # Paso 2: Invalidar valores fuera del rango TINYINT(1): {0, 1}
        #         Corrige Error tipo 1 (-1, 2, 99 → NA)
        #         Corrige Error tipo 3 (None ya es NA después de to_numeric)
        data_frame_limpio[campo] = data_frame_limpio[campo].where(
            data_frame_limpio[campo].isin([0, 1]),
            pd.NA
        )

    # -------------------------------------------------------------------------
    # ELIMINACIÓN DE DUPLICADOS
    # -------------------------------------------------------------------------

    # Eliminar filas con id_programa duplicado, conservando la primera aparición
    #    Corrige Error tipo 4 (violación de restricción UNIQUE sobre idprograma)
    data_frame_limpio = data_frame_limpio.drop_duplicates(
        subset=["idprograma"], keep="first"
    )

    # -------------------------------------------------------------------------
    # NOVEDADES: ELIMINAR FILAS CON CAMPOS OBLIGATORIOS VACÍOS
    # -------------------------------------------------------------------------

    # Columnas NOT NULL según el esquema SQL de la tabla 'calidad_beneficios'
    columnas_obligatorias = [
        "idbeneficio",
        "idprograma",
        "acreditacionaltacalidad",
        "ofrecebecas",
        "dobletitulacion",
        "requieresegundoidioma",
    ]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    # -------------------------------------------------------------------------
    # REINDEXAR para que el DataFrame resultante tenga índices continuos
    # -------------------------------------------------------------------------
    data_frame_limpio = data_frame_limpio.reset_index(drop=True)

    return data_frame_limpio


# =============================================================================
# BLOQUE PRINCIPAL — Ejemplo de uso integrado con simulacion_calidadbeneficio.py
# =============================================================================

if __name__ == "__main__":

    from simulacion_calidadbeneficio import generar_calidad_beneficios

    NUMERO_REGISTROS = 50

    # 1. Generar datos sucios
    datos_sucios = generar_calidad_beneficios(NUMERO_REGISTROS)
    df_sucio = pd.DataFrame(datos_sucios)

    print("=" * 70)
    print(f"Registros ANTES de limpiar : {len(df_sucio)}")
    print("=" * 70)
    print(df_sucio.to_string(index=False))

    # 2. Ejecutar limpieza
    df_limpio = limpiar_calidad_beneficios(df_sucio)

    print("\n" + "=" * 70)
    print(f"Registros DESPUÉS de limpiar: {len(df_limpio)}")
    print("=" * 70)
    print(df_limpio.to_string(index=False))

    # 3. Resumen estadístico
    registros_eliminados = len(df_sucio) - len(df_limpio)
    print("\n" + "=" * 70)
    print("RESUMEN DE LIMPIEZA")
    print("=" * 70)
    print(f"  Registros originales : {len(df_sucio)}")
    print(f"  Registros limpios    : {len(df_limpio)}")
    print(f"  Registros eliminados : {registros_eliminados}")
    print(f"  Tasa de limpieza     : {registros_eliminados / len(df_sucio) * 100:.1f}%")