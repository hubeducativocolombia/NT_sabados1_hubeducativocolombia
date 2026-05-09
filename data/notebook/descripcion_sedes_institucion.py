import pandas as pd

def describir_sedes(data_frame_limpio):
    print("*** DESCRIPCION DEL DATASET SEDES ***")
    print(f"Numero de filas: {data_frame_limpio.shape[0]}")
    print(f"Numero de columnas: {data_frame_limpio.shape[1]}")
    print(f"Lista de columnas: {list(data_frame_limpio.columns)}")
    print(f"Tipos de dato: {data_frame_limpio.dtypes}")

    # Estadisticas numericas
    print("*** ESTADISTICAS ***")
    print(f"{data_frame_limpio[['id_sede', 'id_institucion']].describe()}")

    # Conteos
    print("*** CONTEOS ***")
    print(f"{data_frame_limpio['nombre_sede'].value_counts()}")
    print(f"{data_frame_limpio['ciudad'].value_counts()}")
    print(f"{data_frame_limpio['es_sede_principal'].value_counts()}")