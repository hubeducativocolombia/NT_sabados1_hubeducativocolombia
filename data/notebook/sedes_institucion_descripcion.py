# Toda rutina de analisis debe describir el data set
# 1. Es importante conocer cuantos registros tengo
# 2. Es importante conocer cuantos atributos tengo
# 3. Es util tener acceso a una lista con los nombres de los atributos
# 4. Es util hacer conteos de algunas columnas de interes
# 5. Es util conocer las estadisticas descriptivas de los campos numericos

import pandas as pd

def describir_sedes(data_frame_limpio):
    print("*** DESCRIPCION DEL DATASET SEDES ***")
    print(f"Numero de filas del dataset: {data_frame_limpio.shape[0]}")
    print(f"Numero de columnas del dataset: {data_frame_limpio.shape[1]}")
    print(f"Lista de columnas disponibles: {list(data_frame_limpio.columns)}")
    print(f"Tipos de dato de cada atributo: {data_frame_limpio.dtypes}")

    # Estadisticas (SOLO APLICA PARA DATOS NUMERICOS)
    print("*** ESTADISTICAS ***")
    print(f"{data_frame_limpio[['id_sede', 'id_institucion', 'es_sede_principal']].describe()}")

    # Informacion de conteos valiosos
    print("*** CONTEOS ***")
    print(f"{data_frame_limpio['nombre_sede'].value_counts()}")
    print(f"{data_frame_limpio['ciudad'].value_counts()}")
    print(f"{data_frame_limpio['es_sede_principal'].value_counts()}")