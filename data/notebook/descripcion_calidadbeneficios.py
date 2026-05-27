import pandas as pd

def describir_datos(df_limpio):
    print("*** DESCRIPCION DEL DATASET: calidadbeneficios ***")
    print(f"Numero de filas del dataset: {df_limpio.shape[0]}")
    print(f"Numero de columnas del dataset: {df_limpio.shape[1]}")
    print(f"Lista de columnas disponibles: {list(df_limpio.columns)}")
    print(f"Tipos de dato de cada atributo:\n{df_limpio.dtypes}")

    # Estadisticas numericas
    print("\n*** ESTADISTICAS ***")
    print(df_limpio[["idbeneficio", "idprograma", "pkidprograma"]].describe())

    # Conteos de booleanos
    print("\n*** CONTEOS ***")
    print("Programas con acreditacion alta calidad:")
    print(df_limpio["acreditacionaltacalidad"].value_counts())

    print("\nProgramas con doble titulacion:")
    print(df_limpio["dobletitulacion"].value_counts())

    print("\nProgramas que ofrecen becas:")
    print(df_limpio["ofrecebecas"].value_counts())

    print("\nProgramas que requieren segundo idioma:")
    print(df_limpio["requieresegundoidioma"].value_counts())