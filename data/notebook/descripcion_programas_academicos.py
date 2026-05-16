import pandas as pd

def describir_programas_academicos(data_frame_limpio):
    print("*** DESCRIPCION DEL DATASET - PROGRAMAS ACADEMICOS ***")
    print(f"Numero de filas del dataset: {data_frame_limpio.shape[0]}")
    print(f"Numero de columnas del dataset: {data_frame_limpio.shape[1]}")
    print(f"Lista de columnas disponibles: {list(data_frame_limpio.columns)}")
    print(f"Tipos de dato de cada atributo:\n{data_frame_limpio.dtypes}")

    # Estadisticas (SOLO APLICA PARA DATOS NUMERICOS)
    print("\n*** ESTADISTICAS ***")
    print(data_frame_limpio[["idprograma", "idinstitucion", "codigosnies", "totalsemestres"]].describe())

    # Informacion de conteos valiosos
    print("\n*** CONTEOS ***")
    print("Conteo por nombre de programa:")
    print(data_frame_limpio["nombreprograma"].value_counts())
    print("\nConteo por nivel de formacion:")
    print(data_frame_limpio["nivelformacion"].value_counts())