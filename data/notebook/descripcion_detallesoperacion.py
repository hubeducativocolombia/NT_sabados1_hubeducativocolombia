import pandas as pd


def describir_detallesoperacion(data_frame_limpio):
    print("*** DESCRIPCION DEL DATASET - DETALLES OPERACION ***")
    print(f"Numero de filas del dataset: {data_frame_limpio.shape[0]}")
    print(f"Numero de columnas del dataset: {data_frame_limpio.shape[1]}")
    print(f"Lista de columnas disponibles: {list(data_frame_limpio.columns)}")
    print(f"Tipos de dato de cada atributo: {data_frame_limpio.dtypes}")

    # Estadisticas (SOLO APLICA PARA DATOS NUMERICOS)
    print("*** ESTADISTICAS ***")
    print(f"{data_frame_limpio[['iddetalle', 'costosemestre', 'estudiantesactivos', 'idprograma']].describe()}")

    # Informacion de conteos valiosos
    print("*** CONTEOS ***")
    print("Distribucion por jornada:")
    print(f"{data_frame_limpio['jornada'].value_counts()}")
    print("\nDistribucion por modalidad:")
    print(f"{data_frame_limpio['modalidad'].value_counts()}")

    # Describiendo las fechas
    print("*** DESCRIPCION DE FECHAS ***")
    print(f"Fecha de actualizacion mas antigua: {data_frame_limpio['fechaactualizacion'].min()}")
    print(f"Fecha de actualizacion mas reciente: {data_frame_limpio['fechaactualizacion'].max()}")