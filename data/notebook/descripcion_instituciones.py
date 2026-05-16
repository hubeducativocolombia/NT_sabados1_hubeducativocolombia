import pandas as pd

def describir_datos(df_limpio):
    print("*** DESCRIPCION DEL DATASET: instituciones ***")
    print(f"Numero de filas del dataset: {df_limpio.shape[0]}")
    print(f"Numero de columnas del dataset: {df_limpio.shape[1]}")
    print(f"Lista de columnas disponibles: {list(df_limpio.columns)}")
    print(f"Tipos de dato de cada atributo:\n{df_limpio.dtypes}")

    # Estadisticas numericas
    print("\n*** ESTADISTICAS ***")
    print(df_limpio[["idinstitucion"]].describe())

    # Conteos
    print("\n*** CONTEOS ***")
    print("Distribucion por naturaleza:")
    print(df_limpio["naturaleza"].value_counts())

    # Fechas
    print("\n*** DESCRIPCION DE FECHAS ***")
    print(f"Fecha de registro mas antigua: {df_limpio['fecharegistro'].min()}")
    print(f"Fecha de registro mas reciente: {df_limpio['fecharegistro'].max()}")