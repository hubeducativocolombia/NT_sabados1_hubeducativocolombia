import pandas as pd

def describir_datos(data_frame_limpio):
    print(f"numero de filas{data_frame_limpio.shape[0]}")
    print(f"numero de columnas{data_frame_limpio.shape[1]}")
    print(f"columnas disponibles{list(data_frame_limpio.columns)}")
    print(f"estadisticas{data_frame_limpio[['costo']].describe()}")
    print(f"valores categoricos{data_frame_limpio['id_programa'].value_counts()}")
    print(f"fecha minima{data_frame_limpio['fecha'].min()}")
    print(f"fecha maxima{data_frame_limpio['fecha'].max()}")