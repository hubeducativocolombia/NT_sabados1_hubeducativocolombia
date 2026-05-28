# =============================================================================
# PROYECTO   : Hub Educativo Colombia
# ARCHIVO    : descripcion_usuarios.py
# PROPÓSITO  : Describir estadísticamente el DataFrame limpio de la tabla
#              'usuarios', generado por limpieza_usuarios.py.
# AUTORES    : Edwin Rios Sanchez
# MOTOR BD   : MySQL 8.0+  |  Motor Python : 3.10+
# LIBRERÍAS  : pandas
# =============================================================================

import pandas as pd


def describir_usuarios(data_frame_limpio: pd.DataFrame) -> None:

    print("=" * 60)
    print("DESCRIPCIÓN DEL DATASET: usuarios")
    print("=" * 60)

    # Dimensiones del DataFrame
    print(f"\nNúmero de filas    : {data_frame_limpio.shape[0]}")
    print(f"Número de columnas : {data_frame_limpio.shape[1]}")

    # Columnas disponibles
    print(f"\nColumnas disponibles:\n{data_frame_limpio.columns.tolist()}")

    # Estadísticas de campos numéricos
    print("\nEstadísticas de campos numéricos (idusuario, estaactivo):")
    print(data_frame_limpio[["idusuario", "estaactivo"]].describe())

    # Distribución de valores categóricos
    print("\nDistribución del campo 'rol':")
    print(data_frame_limpio["rol"].value_counts())

    print("\nDistribución del campo 'estaactivo' (0=inactivo, 1=activo):")
    print(data_frame_limpio["estaactivo"].value_counts())

    print("\nDistribución del campo 'ocupacion':")
    print(data_frame_limpio["ocupacion"].value_counts())

    # Rango de fechas
    print(f"\nFecha de creación mínima  : {data_frame_limpio['fechacreacion'].min()}")
    print(f"Fecha de creación máxima  : {data_frame_limpio['fechacreacion'].max()}")
    print(f"Fecha de modificación mínima : {data_frame_limpio['fechamodificacion'].min()}")
    print(f"Fecha de modificación máxima : {data_frame_limpio['fechamodificacion'].max()}")

    print("\n" + "=" * 60)