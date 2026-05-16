import pandas as pd

def limpiar_datos(df_sucio):
    df_limpio = df_sucio.copy()

    # --- Limpieza de textos ---
    # 1. Eliminar espacios y convertir a minusculas
    df_limpio["ciudad"] = df_limpio["ciudad"].astype("string").str.strip().str.lower()
    df_limpio["direccionfisica"] = df_limpio["direccionfisica"].astype("string").str.strip().str.lower()
    df_limpio["nombresede"] = df_limpio["nombresede"].astype("string").str.strip().str.lower()

    # 2. Controlar valores inesperados en ciudad
    ciudades_validas = ["bogota", "medellin", "cali", "barranquilla", "bucaramanga"]
    df_limpio["ciudad"] = df_limpio["ciudad"].where(
        df_limpio["ciudad"].isin(ciudades_validas),
        pd.NA
    )

    # --- Limpieza de numericos ---
    # 1. Verificar que ids sean numericos
    df_limpio["idsede"] = pd.to_numeric(df_limpio["idsede"], errors="coerce")
    df_limpio["idinstitucion"] = pd.to_numeric(df_limpio["idinstitucion"], errors="coerce")
    df_limpio["pkidinstitucion"] = pd.to_numeric(df_limpio["pkidinstitucion"], errors="coerce")

    # 2. Eliminar ids invalidos
    df_limpio = df_limpio[df_limpio["idsede"] > 0]
    df_limpio = df_limpio[df_limpio["idinstitucion"] > 0]

    # --- Limpieza de booleanos ---
    # Convertir essedepprincipal a booleano real
    df_limpio["essedepprincipal"] = df_limpio["essedepprincipal"].apply(
        lambda x: True if x is True or str(x).strip().lower() == "true"
        else (False if x is False or str(x).strip().lower() == "false"
              else pd.NA)
    )

    # --- Eliminar filas con columnas obligatorias nulas ---
    columnas_obligatorias = ["idsede", "ciudad", "nombresede", "idinstitucion"]
    df_limpio = df_limpio.dropna(subset=columnas_obligatorias)

    return df_limpio