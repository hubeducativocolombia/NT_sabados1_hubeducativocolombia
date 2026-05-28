import pandas as pd


def describir_calidadbeneficios(data_frame_limpio):
    print("*** DESCRIPCION DEL DATASET: calidadbeneficios ***")
    print(f"Numero de filas del dataset: {data_frame_limpio.shape[0]}")
    print(f"Numero de columnas del dataset: {data_frame_limpio.shape[1]}")
    print(f"Lista de columnas disponibles: {list(data_frame_limpio.columns)}")
    print(f"Tipos de dato de cada atributo:\n{data_frame_limpio.dtypes}")

    # Estadisticas (SOLO APLICA PARA DATOS NUMERICOS)
    print("\n*** ESTADISTICAS ***")
    print(data_frame_limpio[["idbeneficio", "idprograma"]].describe())

    # Informacion de conteos valiosos
    print("\n*** CONTEOS ***")
    print("Programas con acreditacion alta calidad:")
    print(data_frame_limpio["acreditacionaltacalidad"].value_counts())

    print("\nProgramas con doble titulacion:")
    print(data_frame_limpio["dobletitulacion"].value_counts())

    print("\nProgramas que ofrecen becas:")
    print(data_frame_limpio["ofrecebecas"].value_counts())

    print("\nProgramas que requieren segundo idioma:")
    print(data_frame_limpio["requieresegundoidioma"].value_counts())