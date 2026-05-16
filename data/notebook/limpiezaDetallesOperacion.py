import pandas as pd

def limpiar_datos(df_sucio):
    df_limpio = df_sucio.copy()

    # --- Limpieza de textos ---
    # 1. Eliminar espacios y convertir a minusculas
    df_limpio["jornada"] = df_limpio["jornada"].astype("string").str.strip().str.lower()
    df_limpio["modalidad"] = df_limpio["modalidad"].astype("string").str.strip().str.lower()

    # 2. Controlar valores inesperados en jornada
    jornadas_validas = ["manana", "tarde", "noche", "mixta"]
    df_limpio["jornada"] = df_limpio["jornada"].where(
        df_limpio["jornada"].isin(jornadas_validas),
        pd.NA
    )

    # 3. Controlar valores inesperados en modalidad
    modalidades_validas = ["presencial", "virtual", "semipresencial"]
    df_limpio["modalidad"] = df_limpio["modalidad"].where(
        df_limpio["modalidad"].isin(modalidades_validas),
        pd.NA
    )

    # --- Limpieza de numericos ---
    # 1. Verificar que los campos numericos sean numericos
    df_limpio["iddetalle"] = pd.to_numeric(df_limpio["iddetalle"], errors="coerce")
    df_limpio["idprograma"] = pd.to_numeric(df_limpio["idprograma"], errors="coerce")
    df_limpio["pkidprograma"] = pd.to_numeric(df_limpio["pkidprograma"], errors="coerce")
    df_limpio["costosemestre"] = pd.to_numeric(df_limpio["costosemestre"], errors="coerce")
    df_limpio["estudiantesactivos"] = pd.to_numeric(df_limpio["estudiantesactivos"], errors="coerce")

    # 2. Eliminar valores invalidos
    df_limpio = df_limpio[df_limpio["iddetalle"] > 0]
    df_limpio = df_limpio[df_limpio["idprograma"] > 0]
    df_limpio = df_limpio[df_limpio["costosemestre"] > 0]
    df_limpio = df_limpio[df_limpio["estudiantesactivos"] > 0]

    # --- Limpieza de fechas ---
    # 1. Convertir fechaactualizacion a fecha
    df_limpio["fechaactualizacion"] = pd.to_datetime(df_limpio["fechaactualizacion"], errors="coerce")

    # 2. Reemplazar fechas nulas por fecha default
    fecha_default = pd.to_datetime("2020-01-01")
    df_limpio["fechaactualizacion"] = df_limpio["fechaactualizacion"].fillna(fecha_default)

    # --- Eliminar filas con columnas obligatorias nulas ---
    columnas_obligatorias = ["iddetalle", "costosemestre", "estudiantesactivos", "idprograma", "jornada", "modalidad"]
    df_limpio = df_limpio.dropna(subset=columnas_obligatorias)

    return df_limpio