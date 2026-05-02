# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : calidad_beneficios_description.py
# TABLA      : calidad_beneficios  (db-hubeducativocolombia-v2.1.sql)
# PROPÓSITO  : Describir estadísticamente el DataFrame de calidad_beneficios
#              aplicando el patrón de descripcion.py con las columnas reales.
# AUTOR      : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Python 3.10+  |  pandas
#
# COLUMNAS DE LA TABLA calidad_beneficios:
#   id_beneficio              INT        → numérica (PK)
#   id_programa               INT        → numérica (FK → programas_academicos)
#   acreditacion_alta_calidad TINYINT(1) → booleana: 0=No, 1=Sí
#   ofrece_becas              TINYINT(1) → booleana: 0=No, 1=Sí
#   doble_titulacion          TINYINT(1) → booleana: 0=No, 1=Sí
#   requiere_segundo_idioma   TINYINT(1) → booleana: 0=No, 1=Sí  DEFAULT 1
#
# NOTA: Esta tabla NO tiene columnas de fecha ni texto categórico.
#       Todas las columnas de atributo son TINYINT(1) (booleanas).
#       El patrón de value_counts() se aplica sobre cada campo booleano
#       para medir la distribución 0/1 de cada beneficio.
#
# CORRECCIONES RESPECTO A descripcion.py:
#   ✔ [["col1","col2"].describe()]  →  [["col1","col2"]].describe()
#   ✔ fecha_maxima usaba .min()     →  corregido a .max()
#   ✔ Indentación mixta tabs/spaces →  espacios uniformes (PEP 8)
# =============================================================================

import pandas as pd


def describir_datos(data_frame_limpio):
    """
    Imprime un perfil estadístico completo del DataFrame de calidad_beneficios.

    Sigue el patrón de descripcion.py:
      1. Dimensiones del DataFrame
      2. Columnas disponibles
      3. Estadísticas de columnas numéricas
      4. Conteo de columnas categóricas (booleanas TINYINT)
      5. Rango de valores numéricos mínimo y máximo

    Parámetros:
        data_frame_limpio (pd.DataFrame): DataFrame con datos de calidad_beneficios.
    """

    print("=" * 60)
    print("  DESCRIPCIÓN DE DATOS — TABLA: calidad_beneficios")
    print("=" * 60)

    # ------------------------------------------------------------------
    # 1. DIMENSIONES
    #    Equivalente a: shape[0]=filas, shape[1]=columnas en descripcion.py
    # ------------------------------------------------------------------
    print(f"\nnumero de filas      : {data_frame_limpio.shape[0]}")
    print(f"numero de columnas   : {data_frame_limpio.shape[1]}")

    # ------------------------------------------------------------------
    # 2. COLUMNAS DISPONIBLES
    #    Muestra los nombres de todas las columnas del DataFrame.
    # ------------------------------------------------------------------
    print(f"\ncolumnas disponibles : {list(data_frame_limpio.columns)}")

    # ------------------------------------------------------------------
    # 3. ESTADÍSTICAS NUMÉRICAS
    #    Equivalente a: data_frame_limpio[["id","costo"]].describe()
    #    CORRECCIÓN: el corchete de .describe() cierra DESPUÉS de la lista.
    #    Columnas numéricas de 'calidad_beneficios': id_beneficio, id_programa
    #    Puedo contar una o más columnas:
    # ------------------------------------------------------------------
    print(f"\nestadisticas numericas:\n"
          f"{data_frame_limpio[['id_beneficio', 'id_programa']].describe()}")

    # ------------------------------------------------------------------
    # 4. VALORES CATEGÓRICOS (booleanos TINYINT)
    #    Equivalente a: data_frame_limpio["servicio"].value_counts()
    #    En esta tabla no hay texto categórico — los atributos son TINYINT(1).
    #    value_counts() sobre cada campo booleano muestra cuántos programas
    #    tienen (1) o no tienen (0) cada beneficio.
    #    Puedo contar una o más columnas:
    # ------------------------------------------------------------------
    print(f"\nvalores categoricos — acreditacion_alta_calidad (1=Sí, 0=No):\n"
          f"{data_frame_limpio['acreditacion_alta_calidad'].value_counts()}")

    print(f"\nvalores categoricos — ofrece_becas (1=Sí, 0=No):\n"
          f"{data_frame_limpio['ofrece_becas'].value_counts()}")

    print(f"\nvalores categoricos — doble_titulacion (1=Sí, 0=No):\n"
          f"{data_frame_limpio['doble_titulacion'].value_counts()}")

    print(f"\nvalores categoricos — requiere_segundo_idioma (1=Sí, 0=No):\n"
          f"{data_frame_limpio['requiere_segundo_idioma'].value_counts()}")

    # ------------------------------------------------------------------
    # 5. RANGO DE VALORES NUMÉRICOS
    #    Equivalente a: .min() y .max() sobre columna de fecha en descripcion.py
    #    Esta tabla no tiene fechas, pero sí id_programa como FK numérica.
    #    CORRECCIÓN: el valor máximo usaba .min() — corregido a .max()
    # ------------------------------------------------------------------
    print(f"\nid_programa minimo   : {data_frame_limpio['id_programa'].min()}")
    print(f"id_programa maximo   : {data_frame_limpio['id_programa'].max()}")

    print("\n" + "=" * 60)


# =============================================================================
# BLOQUE DE PRUEBA
# Genera un DataFrame de ejemplo con datos simulados de 'calidad_beneficios'
# para verificar que describir_datos() funciona correctamente.
# =============================================================================

if __name__ == "__main__":

    import random

    # IDs de programas válidos (según seed data del SQL)
    ids_programas_validos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    registros = []
    for i in range(1, 21):
        registros.append({
            "id_beneficio":              i,
            "id_programa":               random.choice(ids_programas_validos),
            "acreditacion_alta_calidad": random.choice([0, 1]),
            "ofrece_becas":              random.choice([0, 1]),
            "doble_titulacion":          random.choice([0, 1]),
            "requiere_segundo_idioma":   1,   # DEFAULT del esquema SQL
        })

    # Convertimos la lista a DataFrame de pandas
    df_calidad = pd.DataFrame(registros)

    # Ejecutamos la descripción
    describir_datos(df_calidad)