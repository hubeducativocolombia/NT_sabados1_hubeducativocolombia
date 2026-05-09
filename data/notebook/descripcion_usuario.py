# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : descripcion_usuario.py
# PROPÓSITO  : Describir estadísticamente el DataFrame limpio de la tabla
#              'usuarios', generado por limpieza_usuario.py.
# AUTORES    : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Motor Python : 3.10+
# LIBRERÍAS  : pandas
#
# NOTAS PEDAGÓGICAS:
#   - Se describe el shape (filas y columnas) del DataFrame resultante.
#   - Los campos numéricos descritos son: idusuario y estaactivo.
#   - Los campos categóricos contados son: rol y estaactivo.
#   - El campo de fecha analizado es: fechacreacion (mínimo y máximo).
#   - Se corrige el error de descripcion.py: data_frame[["fecha"].min()]
#     era sintaxis incorrecta; aquí se usa .describe() de forma correcta.
# =============================================================================

import pandas as pd


def describir_usuarios(data_frame_limpio: pd.DataFrame) -> None:
    """
    Imprime un resumen estadístico descriptivo del DataFrame limpio
    de la tabla 'usuarios'. Analiza dimensiones, columnas disponibles,
    estadísticas numéricas, distribución de valores categóricos y
    rango de fechas.

    Parámetros:
        data_frame_limpio (pd.DataFrame): DataFrame ya procesado por
                                          limpiar_usuarios().

    Retorna:
        None  — toda la salida se imprime en consola.
    """

    print("=" * 60)
    print("DESCRIPCIÓN DEL DATASET: usuarios")
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
    # Campos numéricos en 'usuarios': idusuario (PK), estaactivo (TINYINT 0/1)
    # -------------------------------------------------------------------------
    print("\nEstadísticas de campos numéricos (idusuario, estaactivo):")
    print(data_frame_limpio[["idusuario", "estaactivo"]].describe())

    # -------------------------------------------------------------------------
    # DISTRIBUCIÓN DE VALORES CATEGÓRICOS
    # Equivalente a: print(f"valores categoricos {data_frame_limpio["servicio"].value_counts()}")
    # Campo categórico principal: rol  (ADMIN / UNIVERSIDAD / ASPIRANTE)
    # Campo adicional:  estaactivo (0 = inactivo / 1 = activo)
    # -------------------------------------------------------------------------
    print("\nDistribución del campo 'rol':")
    print(data_frame_limpio["rol"].value_counts())

    print("\nDistribución del campo 'estaactivo' (0=inactivo, 1=activo):")
    print(data_frame_limpio["estaactivo"].value_counts())

    # -------------------------------------------------------------------------
    # RANGO DE FECHAS
    # Equivalente a:
    #   print(f"fecha minima {data_frame_limpio["fecha"].min()}")
    #   print(f"fecha maxima {data_frame_limpio["fecha"].max()}")   ← corregido el bug
    # Campo de fecha en 'usuarios': fechacreacion
    # NOTA: en descripcion.py la fecha máxima usaba .min() por error tipográfico;
    #       aquí se usa .max() correctamente para la fecha máxima.
    # -------------------------------------------------------------------------
    print(f"\nFecha de creación mínima : {data_frame_limpio['fechacreacion'].min()}")
    print(f"Fecha de creación máxima : {data_frame_limpio['fechacreacion'].max()}")

    print("\n" + "=" * 60)


# =============================================================================
# BLOQUE PRINCIPAL — Ejemplo de uso integrado con el pipeline completo
# =============================================================================

if __name__ == "__main__":

    from simulacion_usuario import generar_usuarios
    from limpieza_usuario   import limpiar_usuarios

    NUMERO_REGISTROS = 50

    # 1. Generar datos sucios
    datos_sucios = generar_usuarios(NUMERO_REGISTROS)
    df_sucio = pd.DataFrame(datos_sucios)

    # 2. Limpiar datos
    df_limpio = limpiar_usuarios(df_sucio)

    # 3. Describir datos limpios
    describir_usuarios(df_limpio)