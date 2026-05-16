import pandas as pd

def describir_datos(df_limpio):
    print("*** DESCRIPCION DEL DATASET: detallesoperacion ***")
    print(f"Numero de filas del dataset: {df_limpio.shape[0]}")
    print(f"Numero de columnas del dataset: {df_limpio.shape[1]}")
    print(f"Lista de columnas disponibles: {list(df_limpio.columns)}")
    print(f"Tipos de dato de cada atributo:\n{df_limpio.dtypes}")

    # Estadisticas numericas
    print("\n*** ESTADISTICAS ***")
    print(df_limpio[["iddetalle", "costosemestre", "estudiantesactivos", "idprograma"]].describe())

    # Conteos
    print("\n*** CONTEOS ***")
    print("Distribucion por jornada:")
    print(df_limpio["jornada"].value_counts())

    print("\nDistribucion por modalidad:")
    print(df_limpio["modalidad"].value_counts())

    # Fechas
    print("\n*** DESCRIPCION DE FECHAS ***")
    print(f"Fecha de actualizacion mas antigua: {df_limpio['fechaactualizacion'].min()}")
    print(f"Fecha de actualizacion mas reciente: {df_limpio['fechaactualizacion'].max()}")