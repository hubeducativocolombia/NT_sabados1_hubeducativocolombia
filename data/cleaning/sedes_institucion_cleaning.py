import pandas as pd

def limpiar_sedes(data_frame_sucio):
    data_frame_limpio = data_frame_sucio.copy()

    # Procesando los textos del DF SUCIO
    # 1. Limpiando los textos para eliminar espacios y mayusculas
    data_frame_limpio["nombre_sede"] = data_frame_limpio["nombre_sede"].astype("string").str.strip().str.lower()
    data_frame_limpio["ciudad"] = data_frame_limpio["ciudad"].astype("string").str.strip().str.lower()
    data_frame_limpio["direccion_fisica"] = data_frame_limpio["direccion_fisica"].astype("string").str.strip().str.lower()

    # 2. Limpiando los textos para controlar valores inesperados
    valores_esperados_sede = ["sede norte", "sede sur", "sede centro", "sede oriente", "sede occidente"]
    data_frame_limpio["nombre_sede"] = data_frame_limpio["nombre_sede"].where(
        data_frame_limpio["nombre_sede"].isin(valores_esperados_sede),
        pd.NA
    )

    valores_esperados_ciudad = ["bogota", "medellin", "cali", "barranquilla", "cartagena"]
    data_frame_limpio["ciudad"] = data_frame_limpio["ciudad"].where(
        data_frame_limpio["ciudad"].isin(valores_esperados_ciudad),
        pd.NA
    )

    # Limpieza de datos numericos
    # 1. Verificar que los numeros si sean numeros
    data_frame_limpio["id_sede"] = pd.to_numeric(data_frame_limpio["id_sede"])
    data_frame_limpio["id_institucion"] = pd.to_numeric(data_frame_limpio["id_institucion"])
    data_frame_limpio["es_sede_principal"] = pd.to_numeric(data_frame_limpio["es_sede_principal"])

    # 2. Verificar valores numericos esperados
    data_frame_limpio = data_frame_limpio[data_frame_limpio["id_sede"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["id_institucion"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["es_sede_principal"].isin([0, 1])]

    # NOVEDADES de datos vacios
    columnas_obligatorias = ["id_sede", "id_institucion", "nombre_sede", "ciudad"]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    return data_frame_limpio