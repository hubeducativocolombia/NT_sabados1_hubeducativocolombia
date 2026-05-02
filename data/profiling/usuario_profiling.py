# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : usuarios_description.py
# TABLA      : usuarios  (db-hubeducativocolombia-v2.1.sql)
# PROPÓSITO  : Describir estadísticamente el DataFrame de la tabla 'usuarios'
#              aplicando el patrón de descripcion.py con las columnas reales.
# AUTOR      : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Python 3.10+  |  pandas
#
# COLUMNAS DE LA TABLA usuarios:
#   id_usuario          BIGINT        → numérica
#   nombre_completo     VARCHAR(150)  → texto
#   correo_electronico  VARCHAR(150)  → texto / categórica
#   hash_contrasena     VARCHAR(255)  → texto (no se analiza: dato sensible)
#   rol                 VARCHAR(30)   → categórica: ADMIN, UNIVERSIDAD, ESTUDIANTE
#   esta_activo         TINYINT(1)    → numérica: 1=activo, 0=inactivo
#   fecha_creacion      DATETIME      → fecha
#   fecha_modificacion  DATETIME      → fecha
#
# CORRECCIONES RESPECTO A descripcion.py:
#   ✔ [["col1","col2"].describe()]  →  [["col1","col2"]].describe()
#   ✔ fecha_maxima usaba .min()     →  corregido a .max()
#   ✔ Indentación mixta tabs/spaces →  espacios uniformes (PEP 8)
# =============================================================================

import pandas as pd


def describir_datos(data_frame_limpio):
    """
    Imprime un perfil estadístico completo del DataFrame de la tabla 'usuarios'.

    Sigue el patrón de descripcion.py:
      1. Dimensiones del DataFrame
      2. Columnas disponibles
      3. Estadísticas de columnas numéricas
      4. Conteo de columnas categóricas
      5. Rango de columnas de fecha

    Parámetros:
        data_frame_limpio (pd.DataFrame): DataFrame con los datos de 'usuarios'.
    """

    print("=" * 60)
    print("  DESCRIPCIÓN DE DATOS — TABLA: usuarios")
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
    #    Columnas numéricas de 'usuarios': id_usuario, esta_activo
    # ------------------------------------------------------------------
    print(f"\nestadisticas numericas:\n"
          f"{data_frame_limpio[['id_usuario', 'esta_activo']].describe()}")

    # ------------------------------------------------------------------
    # 4. VALORES CATEGÓRICOS
    #    Equivalente a: data_frame_limpio["servicio"].value_counts()
    #    Columna categórica principal de 'usuarios': rol
    #    Puedo contar una o más columnas:
    # ------------------------------------------------------------------
    print(f"\nvalores categoricos — rol:\n"
          f"{data_frame_limpio['rol'].value_counts()}")

    print(f"\nvalores categoricos — esta_activo (1=activo, 0=inactivo):\n"
          f"{data_frame_limpio['esta_activo'].value_counts()}")

    # ------------------------------------------------------------------
    # 5. RANGO DE FECHAS
    #    Equivalente a: .min() y .max() sobre columna de fecha.
    #    CORRECCIÓN: fecha_maxima usaba .min() — corregido a .max()
    #    Columnas de fecha de 'usuarios': fecha_creacion, fecha_modificacion
    # ------------------------------------------------------------------
    print(f"\nfecha_creacion minima    : {data_frame_limpio['fecha_creacion'].min()}")
    print(f"fecha_creacion maxima    : {data_frame_limpio['fecha_creacion'].max()}")

    print(f"\nfecha_modificacion minima: {data_frame_limpio['fecha_modificacion'].min()}")
    print(f"fecha_modificacion maxima: {data_frame_limpio['fecha_modificacion'].max()}")

    print("\n" + "=" * 60)


# =============================================================================
# BLOQUE DE PRUEBA
# Genera un DataFrame de ejemplo con datos simulados de 'usuarios'
# para verificar que describir_datos() funciona correctamente.
# =============================================================================

if __name__ == "__main__":

    from datetime import datetime, timedelta
    import random

    # Datos de ejemplo alineados con las columnas reales de la tabla
    roles_validos = ["ADMIN", "UNIVERSIDAD", "ESTUDIANTE"]
    fecha_inicio = datetime(2025, 1, 1)

    registros = []
    for i in range(1, 21):
        registros.append({
            "id_usuario":          i,
            "nombre_completo":     f"Usuario Ejemplo {i}",
            "correo_electronico":  f"usuario{i}@hubeducativo.co",
            "hash_contrasena":     f"$2b$12$hashEjemplo{i}",
            "rol":                 random.choice(roles_validos),
            "esta_activo":         random.choice([0, 1]),
            "fecha_creacion":      fecha_inicio + timedelta(days=random.randint(0, 365)),
            "fecha_modificacion":  fecha_inicio + timedelta(days=random.randint(0, 365)),
        })

    # Convertimos la lista a DataFrame de pandas
    df_usuarios = pd.DataFrame(registros)

    # Convertimos las columnas de fecha al tipo correcto
    df_usuarios["fecha_creacion"]     = pd.to_datetime(df_usuarios["fecha_creacion"])
    df_usuarios["fecha_modificacion"] = pd.to_datetime(df_usuarios["fecha_modificacion"])

    # Ejecutamos la descripción
    describir_datos(df_usuarios)