import pandas as pd


def limpiar_instituciones(data_frame_sucio):
    data_frame_limpio = data_frame_sucio.copy()

    # Limpieza de textos
    # 1. Eliminar espacios y convertir a minúsculas
    data_frame_limpio["naturaleza"] = data_frame_limpio["naturaleza"].astype("string").str.strip().str.lower()
    data_frame_limpio["nombreoficial"] = data_frame_limpio["nombreoficial"].astype("string").str.strip()
    data_frame_limpio["sitioweb"] = data_frame_limpio["sitioweb"].astype("string").str.strip().str.lower()

    # 2. Controlar valores inesperados en naturaleza
    valores_esperados_naturaleza = ["oficial", "privada"]
    data_frame_limpio["naturaleza"] = data_frame_limpio["naturaleza"].where(
        data_frame_limpio["naturaleza"].isin(valores_esperados_naturaleza),
        pd.NA
    )

    # 3. Reemplazar valores inválidos en sitioweb
    valores_invalidos_sitioweb = ["sin sitio", "", "none", "nan"]
    data_frame_limpio["sitioweb"] = data_frame_limpio["sitioweb"].where(
        ~data_frame_limpio["sitioweb"].str.lower().isin(valores_invalidos_sitioweb),
        pd.NA
    )

    # Limpieza de datos numéricos
    # 1. Verificar que idinstitucion sea numérico
    data_frame_limpio["idinstitucion"] = pd.to_numeric(data_frame_limpio["idinstitucion"], errors="coerce")

    # 2. Verificar que idinstitucion sea positivo
    data_frame_limpio = data_frame_limpio[data_frame_limpio["idinstitucion"] > 0]

    # Limpieza de fechas
    # 1. Verificar que fecharegistro sea una fecha
    data_frame_limpio["fecharegistro"] = pd.to_datetime(data_frame_limpio["fecharegistro"], errors="coerce")

    # 2. Reemplazar fechas nulas por fecha por defecto
    fecha_default = pd.to_datetime("2000-01-01")
    data_frame_limpio["fecharegistro"] = data_frame_limpio["fecharegistro"].fillna(fecha_default)

    # Eliminar filas con columnas obligatorias vacías
    columnas_obligatorias = ["idinstitucion", "naturaleza", "nombreoficial"]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    return data_frame_limpio
