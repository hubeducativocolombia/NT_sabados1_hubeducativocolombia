import pandas as pd

def limpiar_datos(df_sucio):
    df_limpio = df_sucio.copy()

    # --- Limpieza de numericos ---
    # 1. Verificar que ids sean numericos
    df_limpio["idbeneficio"] = pd.to_numeric(df_limpio["idbeneficio"], errors="coerce")
    df_limpio["idprograma"] = pd.to_numeric(df_limpio["idprograma"], errors="coerce")
    df_limpio["pkidprograma"] = pd.to_numeric(df_limpio["pkidprograma"], errors="coerce")

    # 2. Eliminar ids invalidos
    df_limpio = df_limpio[df_limpio["idbeneficio"] > 0]
    df_limpio = df_limpio[df_limpio["idprograma"] > 0]

    # --- Limpieza de booleanos ---
    # Funcion para limpiar campos booleanos
    def limpiar_booleano(x):
        if x is True or str(x).strip().lower() == "true":
            return True
        elif x is False or str(x).strip().lower() == "false":
            return False
        else:
            return pd.NA

    df_limpio["acreditacionaltacalidad"] = df_limpio["acreditacionaltacalidad"].apply(limpiar_booleano)
    df_limpio["dobletitulacion"] = df_limpio["dobletitulacion"].apply(limpiar_booleano)
    df_limpio["ofrecebecas"] = df_limpio["ofrecebecas"].apply(limpiar_booleano)
    df_limpio["requieresegundoidioma"] = df_limpio["requieresegundoidioma"].apply(limpiar_booleano)

    # --- Eliminar filas con columnas obligatorias nulas ---
    columnas_obligatorias = ["idbeneficio", "idprograma", "acreditacionaltacalidad", "dobletitulacion", "ofrecebecas", "requieresegundoidioma"]
    df_limpio = df_limpio.dropna(subset=columnas_obligatorias)

    return df_limpio