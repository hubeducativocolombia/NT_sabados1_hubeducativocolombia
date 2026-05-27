import pandas as pd


def describir_sedesinstituciones(data_frame_limpio):
    print("*** DESCRIPCION DEL DATASET - SEDES INSTITUCIONES ***")
    print(f"Numero de filas del dataset: {data_frame_limpio.shape[0]}")
    print(f"Numero de columnas del dataset: {data_frame_limpio.shape[1]}")
    print(f"Lista de columnas disponibles: {list(data_frame_limpio.columns)}")
    print(f"Tipos de dato de cada atributo: {data_frame_limpio.dtypes}")

    # Estadisticas (SOLO APLICA PARA DATOS NUMERICOS)
    print("*** ESTADISTICAS ***")
    print(f"{data_frame_limpio[['idsede', 'idinstitucion']].describe()}")

    # Informacion de conteos valiosos
    print("*** CONTEOS ***")
    print(f"{data_frame_limpio['ciudad'].value_counts()}")
    print(f"{data_frame_limpio['nombresede'].value_counts()}")
    print(f"{data_frame_limpio['essedeprincipal'].value_counts()}")
