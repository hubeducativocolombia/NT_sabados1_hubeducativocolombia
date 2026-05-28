import pandas as pd


def limpiar_programasacademicos(data_frame_sucio):
    data_frame_limpio = data_frame_sucio.copy()

    # Limpieza de textos
    # 1. Eliminar espacios y convertir a minúsculas
    data_frame_limpio["nivelformacion"] = data_frame_limpio["nivelformacion"].astype("string").str.strip().str.lower()
    data_frame_limpio["nombreprograma"] = data_frame_limpio["nombreprograma"].astype("string").str.strip()
    data_frame_limpio["codigosnies"] = data_frame_limpio["codigosnies"].astype("string").str.strip().str.upper()

    # 2. Controlar valores inesperados en nivelformacion
    valores_esperados_nivel = ["pregrado", "posgrado", "maestría", "doctorado", "especialización", "tecnología", "técnica"]
    data_frame_limpio["nivelformacion"] = data_frame_limpio["nivelformacion"].where(
        data_frame_limpio["nivelformacion"].isin(valores_esperados_nivel),
        pd.NA
    )

    # 3. Reemplazar valores inválidos en codigosnies
    data_frame_limpio["codigosnies"] = data_frame_limpio["codigosnies"].replace(["", "NAN", "NONE"], pd.NA)

    # Limpieza de datos numéricos
    # 1. Verificar que los números sean numéricos
    data_frame_limpio["idprograma"] = pd.to_numeric(data_frame_limpio["idprograma"], errors="coerce")
    data_frame_limpio["totalsemestres"] = pd.to_numeric(data_frame_limpio["totalsemestres"], errors="coerce")
    data_frame_limpio["idinstitucion"] = pd.to_numeric(data_frame_limpio["idinstitucion"], errors="coerce")

    # 2. Verificar valores esperados
    data_frame_limpio = data_frame_limpio[data_frame_limpio["idprograma"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["totalsemestres"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["idinstitucion"] > 0]

    # Limpieza de booleanos
    # 1. Convertir estaactivo a booleano real
    data_frame_limpio["estaactivo"] = data_frame_limpio["estaactivo"].map(
        {True: True, False: False, "si": True, "no": False, 1: True, 0: False}
    )

    # Novedades: eliminar filas con columnas obligatorias vacías
    columnas_obligatorias = ["idprograma", "codigosnies", "nombreprograma", "nivelformacion", "totalsemestres", "idinstitucion"]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    return data_frame_limpio
