import os
import json
import pandas as pd

from notebook.consumo_instituciones import consumir_instituciones
from notebook.consumo_sedesinstituciones import consumir_sedesinstituciones
from notebook.consumo_programasacademicos import consumir_programasacademicos
from notebook.consumo_detallesoperacion import consumir_detallesoperacion
from notebook.consumo_calidadbeneficios import consumir_calidadbeneficios
from notebook.consumo_usuarios import consumir_usuarios

from notebook.limpieza_instituciones import limpiar_instituciones
from notebook.limpieza_sedesinstituciones import limpiar_sedesinstituciones
from notebook.limpieza_programasacademicos import limpiar_programasacademicos
from notebook.limpieza_detallesoperacion import limpiar_detallesoperacion
from notebook.limpieza_calidadbeneficios import limpiar_calidadbeneficios
from notebook.limpieza_usuarios import limpiar_usuarios

from notebook.transformacion_instituciones import transformar_instituciones
from notebook.transformacion_sedesinstituciones import transformar_sedesinstituciones
from notebook.transformacion_programasacademicos import transformar_programasacademicos
from notebook.transformacion_detallesoperacion import transformar_detallesoperacion
from notebook.transformacion_calidadbeneficios import transformar_calidadbeneficios
from notebook.transformacion_usuarios import transformar_usuarios

from notebook.graficacion import (
    # Instituciones
    graficar_instituciones_por_naturaleza,
    graficar_instituciones_post_2010,
    graficar_top15_instituciones_por_naturaleza,
    graficar_instituciones_publicas_por_nombre,
    # Sedes
    graficar_sedes_por_ciudad,
    graficar_sedes_principales_por_ciudad,
    graficar_mapa_calor_sedes,
    graficar_nombres_sedes_principales,
    # Programas
    graficar_programas_por_nivel,
    graficar_promedio_semestres_por_nivel,
    graficar_top10_programas_mas_ofrecidos,
    graficar_programas_largos_por_nivel,
    # Detalles operacion
    graficar_detalles_por_modalidad,
    graficar_costo_por_jornada,
    graficar_mapa_calor_detalles,
    graficar_jornadas_estudiantes_activos,
    # Calidad beneficios
    graficar_acreditacion_alta_calidad,
    graficar_mapa_calor_beneficios,
    graficar_becas_y_doble_titulacion,
    graficar_idioma_y_becas,
    # Usuarios
    graficar_usuarios_por_rol,
    graficar_usuarios_por_ocupacion,
    graficar_mapa_calor_usuarios,
    graficar_usuarios_recientes_por_ocupacion,
    graficar_admin_master_por_ocupacion,
)

# =============================================================================
# RUTA DE EXPORTACIÓN JSON
# Se guarda en frontend/public/datos para que React pueda consumirlos
# =============================================================================
RUTA_JSON = os.path.join(
    os.path.dirname(__file__), "..", "frontend", "public", "datos"
)
os.makedirs(RUTA_JSON, exist_ok=True)


def exportar_json(nombre_archivo, agrupaciones: dict):
    datos_serializables = {}
    for clave, df in agrupaciones.items():
        datos_serializables[clave] = json.loads(
            df.to_json(orient="records", force_ascii=False)
        )
    ruta_completa = os.path.join(RUTA_JSON, nombre_archivo)
    with open(ruta_completa, "w", encoding="utf-8") as archivo:
        json.dump(datos_serializables, archivo, ensure_ascii=False, indent=2)
    print(f"JSON exportado en: {ruta_completa}")


# =============================================================================
# INSTITUCIONES
# Pregunta 1: ¿Cuántas instituciones hay por naturaleza?
# Pregunta 2: ¿Cuántas instituciones se registraron después del 2010?
# Pregunta 3: ¿Cómo se distribuye la naturaleza por nombre oficial?
# Pregunta 4: ¿Cuántas instituciones públicas hay por nombre?
# Pregunta 5: ¿Cuántas instituciones privadas se registraron antes del 2005?
# =============================================================================
datos_instituciones = consumir_instituciones()
df_instituciones = pd.DataFrame(datos_instituciones).rename(columns=str.lower)
df_limpio_instituciones = limpiar_instituciones(df_instituciones)
agrupaciones_instituciones = transformar_instituciones(df_limpio_instituciones)

graficar_instituciones_por_naturaleza(agrupaciones_instituciones["agrupacion1"])
graficar_instituciones_post_2010(agrupaciones_instituciones["agrupacion2"])
graficar_top15_instituciones_por_naturaleza(agrupaciones_instituciones["agrupacion3"])
graficar_instituciones_publicas_por_nombre(agrupaciones_instituciones["agrupacion4"])
exportar_json("instituciones.json", agrupaciones_instituciones)


# =============================================================================
# SEDES INSTITUCIONES
# Pregunta 1: ¿En qué ciudades hay más sedes?
# Pregunta 2: ¿Cuántas sedes principales hay por ciudad?
# Pregunta 3: ¿Cómo se distribuyen sedes principales vs secundarias?
# Pregunta 4: ¿Cuántas sedes secundarias hay por ciudad?
# Pregunta 5: ¿Qué nombres tienen más sedes principales?
# =============================================================================
datos_sedes = consumir_sedesinstituciones()
df_sedes = pd.DataFrame(datos_sedes).rename(columns=str.lower)
df_limpio_sedes = limpiar_sedesinstituciones(df_sedes)
agrupaciones_sedes = transformar_sedesinstituciones(df_limpio_sedes)

graficar_sedes_por_ciudad(agrupaciones_sedes["agrupacion1"])
graficar_sedes_principales_por_ciudad(agrupaciones_sedes["agrupacion2"])
graficar_mapa_calor_sedes(agrupaciones_sedes["agrupacion3"])
graficar_nombres_sedes_principales(agrupaciones_sedes["agrupacion5"])
exportar_json("sedes.json", agrupaciones_sedes)


# =============================================================================
# PROGRAMAS ACADEMICOS
# Pregunta 1: ¿Cuántos programas activos hay por nivel de formación?
# Pregunta 2: ¿Cuál es el promedio de semestres por nivel?
# Pregunta 3: ¿Cómo se distribuyen los programas por nivel y nombre?
# Pregunta 4: ¿Qué niveles tienen más programas de más de 8 semestres?
# Pregunta 5: ¿Cuántos programas inactivos hay por nombre?
# =============================================================================
datos_programas = consumir_programasacademicos()
df_programas = pd.DataFrame(datos_programas).rename(columns=str.lower)
df_limpio_programas = limpiar_programasacademicos(df_programas)
agrupaciones_programas = transformar_programasacademicos(df_limpio_programas)

graficar_programas_por_nivel(agrupaciones_programas["agrupacion1"])
graficar_promedio_semestres_por_nivel(agrupaciones_programas["agrupacion2"])
graficar_top10_programas_mas_ofrecidos(agrupaciones_programas["agrupacion3"])
graficar_programas_largos_por_nivel(agrupaciones_programas["agrupacion4"])
exportar_json("programas.json", agrupaciones_programas)


# =============================================================================
# DETALLES OPERACION
# Pregunta 1: ¿Cuántos programas son presenciales vs virtuales?
# Pregunta 2: ¿Qué jornada tiene el semestre más costoso?
# Pregunta 3: ¿Dónde se concentran más estudiantes por modalidad y jornada?
# Pregunta 4: ¿Qué jornadas tienen más de 200 estudiantes activos?
# Pregunta 5: ¿Qué modalidad tiene más programas costosos y recientes?
# =============================================================================
datos_detalles = consumir_detallesoperacion()
df_detalles = pd.DataFrame(datos_detalles).rename(columns=str.lower)
df_limpio_detalles = limpiar_detallesoperacion(df_detalles)
agrupaciones_detalles = transformar_detallesoperacion(df_limpio_detalles)

graficar_detalles_por_modalidad(agrupaciones_detalles["agrupacion1"])
graficar_costo_por_jornada(agrupaciones_detalles["agrupacion2"])
graficar_mapa_calor_detalles(agrupaciones_detalles["agrupacion3"])
graficar_jornadas_estudiantes_activos(agrupaciones_detalles["agrupacion4"])
exportar_json("detalles.json", agrupaciones_detalles)


# =============================================================================
# CALIDAD BENEFICIOS
# Pregunta 1: ¿Cuántos programas tienen acreditación de alta calidad?
# Pregunta 2: ¿Cuántos programas ofrecen becas y doble titulación?
# Pregunta 3: ¿Cómo se relaciona la acreditación con las becas?
# Pregunta 4: ¿Cuántos programas requieren segundo idioma y tienen becas?
# Pregunta 5: ¿Cuántos programas tienen acreditación y doble titulación?
# =============================================================================
datos_calidad = consumir_calidadbeneficios()
df_calidad = pd.DataFrame(datos_calidad).rename(columns=str.lower)
df_limpio_calidad = limpiar_calidadbeneficios(df_calidad)
agrupaciones_calidad = transformar_calidadbeneficios(df_limpio_calidad)

graficar_acreditacion_alta_calidad(agrupaciones_calidad["agrupacion1"])
graficar_mapa_calor_beneficios(agrupaciones_calidad["agrupacion3"])
graficar_becas_y_doble_titulacion(agrupaciones_calidad["agrupacion2"])
graficar_idioma_y_becas(agrupaciones_calidad["agrupacion4"])
exportar_json("calidad.json", agrupaciones_calidad)


# =============================================================================
# USUARIOS
# Pregunta 1: ¿Cómo se distribuyen los usuarios por rol?
# Pregunta 2: ¿Cuántos usuarios activos hay por ocupación?
# Pregunta 3: ¿Qué combinación de rol y estado tiene más usuarios?
# Pregunta 4: ¿Qué ocupaciones se registraron más después de junio 2025?
# Pregunta 5: ¿Qué ocupación predomina entre Admin y Master activos?
# =============================================================================
datos_usuarios = consumir_usuarios()
df_usuarios = pd.DataFrame(datos_usuarios).rename(columns=str.lower)
df_limpio_usuarios = limpiar_usuarios(df_usuarios)
agrupaciones_usuarios = transformar_usuarios(df_limpio_usuarios)

graficar_usuarios_por_rol(agrupaciones_usuarios["agrupacion1"])
graficar_usuarios_por_ocupacion(agrupaciones_usuarios["agrupacion2"])
graficar_mapa_calor_usuarios(agrupaciones_usuarios["agrupacion3"])
graficar_usuarios_recientes_por_ocupacion(agrupaciones_usuarios["agrupacion4"])
graficar_admin_master_por_ocupacion(agrupaciones_usuarios["agrupacion5"])
exportar_json("usuarios.json", agrupaciones_usuarios)


print("\n✅ Proceso completo: gráficas y JSONs exportados correctamente.")