import pandas as pd

def limpiar_datos(data_frame_sucio):
    data_frame_limpio=data_frame_sucio.copy()

    #Procesando los textos del DF SUCIO

    #1. Limpiando los textos para eliminar espacios y mayusculas
    data_frame_limpio["servicio"]=data_frame_limpio["servicio"].astype("string").str.strip().str.lower()
    data_frame_limpio["codigo"]=data_frame_limpio["codigo"].astype("string").str.strip().str.lower()

    #2. Limpiando los textos para controlar valores inesperados
    valores_esperados_servicio=["esterilizacion","corte uñas","vacunacion"]
    data_frame_limpio["servicio"]=data_frame_limpio["servicio"].where(
        data_frame_limpio["servicio"].isin(valores_esperados_servicio),
        pd.NA
    )

    valores_esperados_codigo=["am001","am045","am300"]
    data_frame_limpio["codigo"]=data_frame_limpio["codigo"].where(
        data_frame_limpio["codigo"].isin(valores_esperados_codigo),
        pd.NA
    )

    #Limpieza de datos numericos

    #1. VERIFICAR QUE LOS NUMEROS SI SEAN NUMEROS
    data_frame_limpio["id"]=pd.to_numeric(data_frame_limpio["id"])
    data_frame_limpio["costo"]=pd.to_numeric(data_frame_limpio["costo"])

    #2. Verifiquemos los valores numericos esperados
    data_frame_limpio=data_frame_limpio[data_frame_limpio["id"]>0]
    data_frame_limpio=data_frame_limpio[data_frame_limpio["costo"]>=100000]

    #Limpieza de FECHAS
    #1. Verificar que el campo si es una fecha
    data_frame_limpio["fecha"]=pd.to_datetime(data_frame_limpio["fecha"])

    #2. Reemplazar fechas que no llegan por una fecha por defecto
    fecha_default=pd.to_datetime("2026-01-01")
    data_frame_limpio["fecha"]=data_frame_limpio["fecha"].fillna(fecha_default)

    #NOVEDADES de datos vacios
    columnas_obligatorias=["id","servicio","costo","codigo"]
    data_frame_limpio=data_frame_limpio.dropna(subset=columnas_obligatorias)

    return data_frame_limpio