import pandas as pd


def limpiar_instituciones(data_frame_sucio):
    data_frame_limpio = data_frame_sucio.copy()

    # Limpieza de textos
    data_frame_limpio["naturaleza"] = data_frame_limpio["naturaleza"].astype("string").str.strip()
    data_frame_limpio["nombreoficial"] = data_frame_limpio["nombreoficial"].astype("string").str.strip()
    data_frame_limpio["sitioweb"] = data_frame_limpio["sitioweb"].astype("string").str.strip().str.lower()

    # Normalizar naturaleza: unificar variantes a 'oficial' o 'privada'
    def normalizar_naturaleza(valor):
        if pd.isna(valor):
            return pd.NA
        v = str(valor).strip().lower()
        if v in ['publica', 'pública', 'oficial', 'public']:
            return 'publica'
        elif v in ['privada', 'private']:
            return 'privada'
        elif v in ['mixta', 'privada/público', 'privada/publica']:
            return 'mixta'
        else:
            return pd.NA

    data_frame_limpio["naturaleza"] = data_frame_limpio["naturaleza"].apply(normalizar_naturaleza)

    # Reemplazar valores inválidos en sitioweb
    valores_invalidos_sitioweb = ["sin sitio", "", "none", "nan"]
    data_frame_limpio["sitioweb"] = data_frame_limpio["sitioweb"].where(
        ~data_frame_limpio["sitioweb"].str.lower().isin(valores_invalidos_sitioweb),
        pd.NA
    )

    # Limpieza de datos numéricos
    data_frame_limpio["idinstitucion"] = pd.to_numeric(data_frame_limpio["idinstitucion"], errors="coerce")
    data_frame_limpio = data_frame_limpio[data_frame_limpio["idinstitucion"] > 0]

    # Limpieza de fechas
    data_frame_limpio["fecharegistro"] = pd.to_datetime(data_frame_limpio["fecharegistro"], errors="coerce")
    fecha_default = pd.to_datetime("2000-01-01")
    data_frame_limpio["fecharegistro"] = data_frame_limpio["fecharegistro"].fillna(fecha_default)

    # Eliminar filas con columnas obligatorias vacías
    columnas_obligatorias = ["idinstitucion", "naturaleza", "nombreoficial"]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    return data_frame_limpio
