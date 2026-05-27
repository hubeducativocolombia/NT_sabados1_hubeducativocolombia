import pandas as pd

def describir_datos(df_limpio):
    print("*** DESCRIPCION DEL DATASET: sedesinstituciones ***")
    print(f"Numero de filas del dataset: {df_limpio.shape[0]}")
    print(f"Numero de columnas del dataset: {df_limpio.shape[1]}")
    print(f"Lista de columnas disponibles: {list(df_limpio.columns)}")
    print(f"Tipos de dato de cada atributo:\n{df_limpio.dtypes}")

    # Estadisticas numericas
    print("\n*** ESTADISTICAS ***")
    print(df_limpio[["idsede", "idinstitucion", "pkidinstitucion"]].describe())

    # Conteos
    print("\n*** CONTEOS ***")
    print("Distribucion por ciudad:")
    print(df_limpio["ciudad"].value_counts())

    print("\nDistribucion por nombre de sede:")
    print(df_limpio["nombresede"].value_counts())

    print("\nSedes principales vs secundarias:")
    print(df_limpio["essedepprincipal"].value_counts())