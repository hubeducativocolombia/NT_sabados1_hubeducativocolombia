import pandas as pd

def limpiar_instituciones(data_frame_sucio):
    data_frame_limpio = data_frame_sucio.copy()

    # Procesando los textos del DF SUCIO
    # 1. Limpiando los textos para eliminar espacios y mayusculas
    data_frame_limpio["nombre_oficial"] = data_frame_limpio["nombre_oficial"].astype("string").str.strip().str.lower()
    data_frame_limpio["naturaleza"] = data_frame_limpio["naturaleza"].astype("string").str.strip().str.lower()

    # 2. Limpiando los textos para controlar valores inesperados
    valores_esperados_nombre = [
        "universidad nacional de colombia",
        "universidad de antioquia",
        "universidad de los andes",
        "universidad del valle",
        "universidad industrial de santander",
        "universidad pontificia bolivariana",
        "universidad eafit",
        "universidad del rosario",
        "universidad javeriana",
        "universidad externado de colombia"
    ]
    data_frame_limpio["nombre_oficial"] = data_frame_limpio["nombre_oficial"].where(
        data_frame_limpio["nombre_oficial"].isin(valores_esperados_nombre),
        pd.NA
    )

    valores_esperados_naturaleza = ["publica", "privada", "mixta"]
    data_frame_limpio["naturaleza"] = data_frame_limpio["naturaleza"].where(
        data_frame_limpio["naturaleza"].isin(valores_esperados_naturaleza),
        pd.NA
    )

    # Limpieza de datos numericos
    # 1. Verificar que los numeros si sean numeros
    data_frame_limpio["id_institucion"] = pd.to_numeric(data_frame_limpio["id_institucion"])

    # 2. Verificar valores numericos esperados
    data_frame_limpio = data_frame_limpio[data_frame_limpio["id_institucion"] > 0]

    # Limpieza de FECHAS
    # 1. Verificar que el campo si es una fecha
    data_frame_limpio["fecha_registro"] = pd.to_datetime(data_frame_limpio["fecha_registro"], errors="coerce")

    # 2. Reemplazar fechas que no llegan por una fecha por defecto
    fecha_default = pd.to_datetime("1987-05-07")
    data_frame_limpio["fecha_registro"] = data_frame_limpio["fecha_registro"].fillna(fecha_default)

    # NOVEDADES de datos vacios
    columnas_obligatorias = ["id_institucion", "nombre_oficial", "naturaleza"]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    return data_frame_limpio