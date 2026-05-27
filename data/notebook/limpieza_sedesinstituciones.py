import pandas as pd


def limpiar_sedesinstituciones(data_frame_sucio):
    data_frame_limpio = data_frame_sucio.copy()

    # Limpieza de textos
    # 1. Eliminar espacios y convertir a minúsculas
    data_frame_limpio["ciudad"] = data_frame_limpio["ciudad"].astype("string").str.strip().str.lower()
    data_frame_limpio["nombresede"] = data_frame_limpio["nombresede"].astype("string").str.strip()
    data_frame_limpio["direccionfisica"] = data_frame_limpio["direccionfisica"].astype("string").str.strip()

    # 2. Controlar valores inesperados en ciudad
    valores_esperados_ciudad = ["bogotá", "medellín", "cali", "barranquilla", "bucaramanga", "manizales", "pereira"]
    data_frame_limpio["ciudad"] = data_frame_limpio["ciudad"].where(
        data_frame_limpio["ciudad"].isin(valores_esperados_ciudad),
        pd.NA
    )

    # 3. Reemplazar valores inválidos en direccionfisica
    valores_invalidos_direccion = ["sin dirección", "", "none", "nan"]
    data_frame_limpio["direccionfisica"] = data_frame_limpio["direccionfisica"].where(
        ~data_frame_limpio["direccionfisica"].str.lower().isin(valores_invalidos_direccion),
        pd.NA
    )

    # Limpieza de datos numéricos
    # 1. Verificar que idsede e idinstitucion sean numéricos
    data_frame_limpio["idsede"] = pd.to_numeric(data_frame_limpio["idsede"], errors="coerce")
    data_frame_limpio["idinstitucion"] = pd.to_numeric(data_frame_limpio["idinstitucion"], errors="coerce")

    # 2. Verificar que idsede e idinstitucion sean positivos
    data_frame_limpio = data_frame_limpio[data_frame_limpio["idsede"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["idinstitucion"] > 0]

    # Limpieza de booleanos
    # 1. Convertir essedeprincipal a booleano real
    data_frame_limpio["essedeprincipal"] = data_frame_limpio["essedeprincipal"].map(
        {True: True, False: False, "si": True, "no": False, 1: True, 0: False}
    )

    # Eliminar filas con columnas obligatorias vacías
    columnas_obligatorias = ["idsede", "ciudad", "nombresede", "idinstitucion"]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    return data_frame_limpio