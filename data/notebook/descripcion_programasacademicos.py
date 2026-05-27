import pandas as pd

def describir_datos(df_limpio):
    print("*** DESCRIPCION DEL DATASET: programasacademicos ***")
    print(f"Numero de filas del dataset: {df_limpio.shape[0]}")
    print(f"Numero de columnas del dataset: {df_limpio.shape[1]}")
    print(f"Lista de columnas disponibles: {list(df_limpio.columns)}")
    print(f"Tipos de dato de cada atributo:\n{df_limpio.dtypes}")

    # Estadisticas numericas
    print("\n*** ESTADISTICAS ***")
    print(df_limpio[["idprograma", "idinstitucion", "totalsemestres", "pkidinstitucion"]].describe())

    # Conteos
    print("\n*** CONTEOS ***")
    print("Distribucion por nivel de formacion:")
    print(df_limpio["nivelformacion"].value_counts())

    print("\nDistribucion por nombre de programa:")
    print(df_limpio["nombreprograma"].value_counts())

    print("\nProgramas activos vs inactivos:")
    print(df_limpio["estaactivo"].value_counts())