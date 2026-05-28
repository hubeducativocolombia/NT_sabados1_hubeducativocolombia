import pandas as pd


def describir_instituciones(data_frame_limpio):
    print("*** DESCRIPCION DEL DATASET - INSTITUCIONES ***")
    print(f"Numero de filas del dataset: {data_frame_limpio.shape[0]}")
    print(f"Numero de columnas del dataset: {data_frame_limpio.shape[1]}")
    print(f"Lista de columnas disponibles: {list(data_frame_limpio.columns)}")
    print(f"Tipos de dato de cada atributo: {data_frame_limpio.dtypes}")

    # Estadisticas (SOLO APLICA PARA DATOS NUMERICOS)
    print("*** ESTADISTICAS ***")
    print(f"{data_frame_limpio[['idinstitucion']].describe()}")

    # Informacion de conteos valiosos
    print("*** CONTEOS ***")
    print(f"{data_frame_limpio['naturaleza'].value_counts()}")
    print(f"{data_frame_limpio['nombreoficial'].value_counts()}")

    # Describiendo las fechas
    print("*** DESCRIPCION DE FECHAS ***")
    print(f"Fecha de registro mas antigua: {data_frame_limpio['fecharegistro'].min()}")
    print(f"Fecha de registro mas reciente: {data_frame_limpio['fecharegistro'].max()}")