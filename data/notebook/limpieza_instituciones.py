import pandas as pd

def limpiar_instituciones(data_frame_sucio):
    data_frame_limpio = data_frame_sucio.copy()
    
    # Limpieza de textos
    data_frame_limpio["nombre_oficial"] = data_frame_limpio["nombre_oficial"].astype("string").str.strip()
    data_frame_limpio["naturaleza"] = data_frame_limpio["naturaleza"].astype("string").str.strip().str.capitalize()
    
    # Valores esperados
    valores_esperados_naturaleza = ["Publica", "Privada", "Mixta"]
    data_frame_limpio["naturaleza"] = data_frame_limpio["naturaleza"].where(
        data_frame_limpio["naturaleza"].isin(valores_esperados_naturaleza),
        pd.NA
    )
    
    # Limpieza numérica
    data_frame_limpio["id_institucion"] = pd.to_numeric(data_frame_limpio["id_institucion"])
    data_frame_limpio = data_frame_limpio[data_frame_limpio["id_institucion"] > 0]
    
    # Limpieza de fechas
    data_frame_limpio["fecha_registro"] = pd.to_datetime(data_frame_limpio["fecha_registro"], errors="coerce")
    fecha_default = pd.to_datetime("1987-01-01")
    data_frame_limpio["fecha_registro"] = data_frame_limpio["fecha_registro"].fillna(fecha_default)
    
    # Eliminar filas con datos obligatorios vacíos
    columnas_obligatorias = ["id_institucion", "nombre_oficial", "naturaleza"]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)
    
    return data_frame_limpio