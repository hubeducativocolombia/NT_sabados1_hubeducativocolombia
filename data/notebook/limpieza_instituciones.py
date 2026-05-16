import pandas as pd

def limpiar_datos(df_sucio):
    df_limpio = df_sucio.copy()

    # --- Limpieza de textos ---
    # 1. Eliminar espacios y convertir a minusculas
    df_limpio["naturaleza"] = df_limpio["naturaleza"].astype("string").str.strip().str.lower()
    df_limpio["nombreoficial"] = df_limpio["nombreoficial"].astype("string").str.strip().str.lower()
    df_limpio["sitioweb"] = df_limpio["sitioweb"].astype("string").str.strip().str.lower()

    # 2. Controlar valores inesperados en naturaleza
    valores_esperados_naturaleza = ["publica", "privada"]
    df_limpio["naturaleza"] = df_limpio["naturaleza"].where(
        df_limpio["naturaleza"].isin(valores_esperados_naturaleza),
        pd.NA
    )

    # --- Limpieza de numericos ---
    # 1. Verificar que idinstitucion sea numero
    df_limpio["idinstitucion"] = pd.to_numeric(df_limpio["idinstitucion"], errors="coerce")

    # 2. Eliminar ids invalidos
    df_limpio = df_limpio[df_limpio["idinstitucion"] > 0]

    # --- Limpieza de fechas ---
    # 1. Convertir fecharegistro a fecha
    df_limpio["fecharegistro"] = pd.to_datetime(df_limpio["fecharegistro"], errors="coerce")

    # 2. Reemplazar fechas nulas por fecha default
    fecha_default = pd.to_datetime("2020-01-01")
    df_limpio["fecharegistro"] = df_limpio["fecharegistro"].fillna(fecha_default)

    # --- Eliminar filas con columnas obligatorias nulas ---
    columnas_obligatorias = ["idinstitucion", "naturaleza", "nombreoficial", "sitioweb"]
    df_limpio = df_limpio.dropna(subset=columnas_obligatorias)

    return df_limpio