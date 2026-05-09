# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : descripcion_calidadbeneficio.py
# PROPÓSITO  : Describir estadísticamente el DataFrame limpio de la tabla
#              'calidad_beneficios', generado por limpieza_calidadbeneficio.py.
# AUTORES    : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Motor Python : 3.10+
# LIBRERÍAS  : pandas
#
# NOTAS PEDAGÓGICAS:
#   - Se describe el shape (filas y columnas) del DataFrame resultante.
#   - Los campos numéricos descritos son: idbeneficio, idprograma y los
#     cuatro indicadores TINYINT(1).
#   - Los campos categóricos contados son los cuatro indicadores TINYINT(1),
#     ya que solo admiten valores 0 o 1 (equivalente a "servicio" en descripcion.py).
#   - La tabla 'calidad_beneficios' NO tiene campo de fecha en su esquema SQL,
#     por lo que ese bloque se omite justificadamente y se documenta aquí.
# =============================================================================

import pandas as pd


def describir_calidad_beneficios(data_frame_limpio: pd.DataFrame) -> None:
    """
    Imprime un resumen estadístico descriptivo del DataFrame limpio
    de la tabla 'calidad_beneficios'. Analiza dimensiones, columnas
    disponibles, estadísticas numéricas y distribución de los cuatro
    campos indicadores TINYINT(1).

    Parámetros:
        data_frame_limpio (pd.DataFrame): DataFrame ya procesado por
                                          limpiar_calidad_beneficios().

    Retorna:
        None  — toda la salida se imprime en consola.
    """

    print("=" * 60)
    print("DESCRIPCIÓN DEL DATASET: calidad_beneficios")
    print("=" * 60)

    # -------------------------------------------------------------------------
    # DIMENSIONES DEL DATAFRAME
    # Equivalente a: print(f"numero de filas {data_frame_limpio.shape[0]}")
    # -------------------------------------------------------------------------
    print(f"\nNúmero de filas    : {data_frame_limpio.shape[0]}")
    print(f"Número de columnas : {data_frame_limpio.shape[1]}")

    # -------------------------------------------------------------------------
    # COLUMNAS DISPONIBLES
    # Equivalente a: print(f"columnas disponibles {data_frame_limpio.columns}")
    # -------------------------------------------------------------------------
    print(f"\nColumnas disponibles:\n{data_frame_limpio.columns.tolist()}")

    # -------------------------------------------------------------------------
    # ESTADÍSTICAS DE CAMPOS NUMÉRICOS
    # Equivalente a: print(f"estadisticas {data_frame_limpio[["id","costo"]].describe()}")
    # Campos numéricos en 'calidad_beneficios':
    #   - idbeneficio             : clave primaria autoincremental
    #   - idprograma              : FK a programas_academicos
    #   - acreditacionaltacalidad : TINYINT(1) — indicador booleano
    #   - ofrecebecas             : TINYINT(1) — indicador booleano
    #   - dobletitulacion         : TINYINT(1) — indicador booleano
    #   - requieresegundoidioma   : TINYINT(1) — indicador booleano
    # -------------------------------------------------------------------------
    campos_numericos = [
        "idbeneficio",
        "idprograma",
        "acreditacionaltacalidad",
        "ofrecebecas",
        "dobletitulacion",
        "requieresegundoidioma",
    ]
    print("\nEstadísticas de campos numéricos:")
    print(data_frame_limpio[campos_numericos].describe())

    # -------------------------------------------------------------------------
    # DISTRIBUCIÓN DE VALORES DE LOS INDICADORES TINYINT(1)
    # Equivalente a: print(f"valores categoricos {data_frame_limpio["servicio"].value_counts()}")
    # Los cuatro indicadores son los campos categóricos de esta tabla,
    # ya que solo admiten los valores 0 (No) o 1 (Sí).
    # -------------------------------------------------------------------------
    campos_indicadores = [
        "acreditacionaltacalidad",
        "ofrecebecas",
        "dobletitulacion",
        "requieresegundoidioma",
    ]

    print("\nDistribución de campos indicadores (0=No, 1=Sí):")
    for campo in campos_indicadores:
        print(f"\n  '{campo}':")
        print(data_frame_limpio[campo].value_counts().to_string())

    # -------------------------------------------------------------------------
    # CAMPO DE FECHA
    # NOTA: La tabla 'calidad_beneficios' NO define ningún campo de fecha
    # en su esquema SQL (a diferencia de 'usuarios' que tiene fechacreacion).
    # Por esta razón el bloque fecha mínima / fecha máxima de descripcion.py
    # no aplica aquí y se omite justificadamente.
    # -------------------------------------------------------------------------

    print("\n" + "=" * 60)


# =============================================================================
# BLOQUE PRINCIPAL — Ejemplo de uso integrado con el pipeline completo
# =============================================================================

if __name__ == "__main__":

    from simulacion_calidadbeneficio import generar_calidad_beneficios
    from limpieza_calidadbeneficio   import limpiar_calidad_beneficios

    NUMERO_REGISTROS = 50

    # 1. Generar datos sucios
    datos_sucios = generar_calidad_beneficios(NUMERO_REGISTROS)
    df_sucio = pd.DataFrame(datos_sucios)

    # 2. Limpiar datos
    df_limpio = limpiar_calidad_beneficios(df_sucio)

    # 3. Describir datos limpios
    describir_calidad_beneficios(df_limpio)