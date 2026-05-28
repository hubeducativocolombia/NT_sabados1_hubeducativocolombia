import pandas as pd


def limpiar_detallesoperacion(data_frame_sucio):
    data_frame_limpio = data_frame_sucio.copy()

    # Limpieza de textos
    # 1. Eliminar espacios y convertir a minúsculas
    data_frame_limpio["jornada"] = data_frame_limpio["jornada"].astype("string").str.strip().str.lower()
    data_frame_limpio["modalidad"] = data_frame_limpio["modalidad"].astype("string").str.strip().str.lower()

    # 2. Controlar valores inesperados en jornada
    valores_esperados_jornada = ["diurna", "nocturna", "mixta", "fines de semana"]
    data_frame_limpio["jornada"] = data_frame_limpio["jornada"].where(
        data_frame_limpio["jornada"].isin(valores_esperados_jornada),
        pd.NA
    )

    # 3. Controlar valores inesperados en modalidad
    valores_esperados_modalidad = ["presencial", "virtual", "distancia", "semipresencial"]
    data_frame_limpio["modalidad"] = data_frame_limpio["modalidad"].where(
        data_frame_limpio["modalidad"].isin(valores_esperados_modalidad),
        pd.NA
    )

    # Limpieza de datos numéricos
    # 1. Verificar que los números sean numéricos
    data_frame_limpio["iddetalle"] = pd.to_numeric(data_frame_limpio["iddetalle"], errors="coerce")
    data_frame_limpio["costosemestre"] = pd.to_numeric(data_frame_limpio["costosemestre"], errors="coerce")
    data_frame_limpio["estudiantesactivos"] = pd.to_numeric(data_frame_limpio["estudiantesactivos"], errors="coerce")
    data_frame_limpio["idprograma"] = pd.to_numeric(data_frame_limpio["idprograma"], errors="coerce")

    # 2. Verificar valores esperados
    data_frame_limpio = data_frame_limpio[data_frame_limpio["iddetalle"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["costosemestre"] >= 1500000]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["estudiantesactivos"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["idprograma"] > 0]

    # Limpieza de fechas
    # 1. Verificar que fechaactualizacion sea una fecha
    data_frame_limpio["fechaactualizacion"] = pd.to_datetime(data_frame_limpio["fechaactualizacion"], errors="coerce")

    # 2. Reemplazar fechas nulas por fecha por defecto
    fecha_default = pd.to_datetime("2023-01-01")
    data_frame_limpio["fechaactualizacion"] = data_frame_limpio["fechaactualizacion"].fillna(fecha_default)

    # Novedades: eliminar filas con columnas obligatorias vacías
    columnas_obligatorias = ["iddetalle", "costosemestre", "estudiantesactivos", "jornada", "modalidad", "idprograma"]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    return data_frame_limpio
