import pandas as pd

def limpiar_datos(df_sucio):
    df_limpio = df_sucio.copy()

    # --- Limpieza de textos ---
    # 1. Eliminar espacios y convertir a minusculas
    df_limpio["codigosnies"] = df_limpio["codigosnies"].astype("string").str.strip().str.lower()
    df_limpio["nivelformacion"] = df_limpio["nivelformacion"].astype("string").str.strip().str.lower()
    df_limpio["nombreprograma"] = df_limpio["nombreprograma"].astype("string").str.strip().str.lower()

    # 2. Controlar valores inesperados en nivelformacion
    niveles_validos = ["tecnico", "tecnologo", "profesional", "especializacion", "maestria", "doctorado"]
    df_limpio["nivelformacion"] = df_limpio["nivelformacion"].where(
        df_limpio["nivelformacion"].isin(niveles_validos),
        pd.NA
    )

    # 3. Validar codigosnies no vacio
    df_limpio["codigosnies"] = df_limpio["codigosnies"].where(
        df_limpio["codigosnies"].str.len() > 0,
        pd.NA
    )

    # --- Limpieza de numericos ---
    # 1. Verificar que ids y totalsemestres sean numericos
    df_limpio["idprograma"] = pd.to_numeric(df_limpio["idprograma"], errors="coerce")
    df_limpio["idinstitucion"] = pd.to_numeric(df_limpio["idinstitucion"], errors="coerce")
    df_limpio["pkidinstitucion"] = pd.to_numeric(df_limpio["pkidinstitucion"], errors="coerce")
    df_limpio["totalsemestres"] = pd.to_numeric(df_limpio["totalsemestres"], errors="coerce")

    # 2. Eliminar valores invalidos
    df_limpio = df_limpio[df_limpio["idprograma"] > 0]
    df_limpio = df_limpio[df_limpio["idinstitucion"] > 0]
    df_limpio = df_limpio[df_limpio["totalsemestres"] > 0]

    # --- Limpieza de booleanos ---
    df_limpio["estaactivo"] = df_limpio["estaactivo"].apply(
        lambda x: True if x is True or str(x).strip().lower() == "true"
        else (False if x is False or str(x).strip().lower() == "false"
              else pd.NA)
    )

    # --- Eliminar filas con columnas obligatorias nulas ---
    columnas_obligatorias = ["idprograma", "codigosnies", "nombreprograma", "nivelformacion", "idinstitucion", "totalsemestres"]
    df_limpio = df_limpio.dropna(subset=columnas_obligatorias)

    return df_limpio