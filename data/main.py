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
    graficar_instituciones_por_naturaleza,
    graficar_sedes_por_ciudad,
    graficar_programas_por_nivel,
    graficar_costo_por_jornada,
    graficar_mapa_calor_beneficios,
    graficar_usuarios_por_ocupacion
)

# =============================================================================
# INSTITUCIONES
# =============================================================================
datos_instituciones = consumir_instituciones()
df_instituciones = pd.DataFrame(datos_instituciones)
df_limpio_instituciones = limpiar_instituciones(df_instituciones)
agrupaciones_instituciones = transformar_instituciones(df_limpio_instituciones)

graficar_instituciones_por_naturaleza(
    agrupaciones_instituciones["agrupacion1"]
)

# =============================================================================
# SEDES INSTITUCIONES
# =============================================================================
datos_sedes = consumir_sedesinstituciones()
df_sedes = pd.DataFrame(datos_sedes)
df_limpio_sedes = limpiar_sedesinstituciones(df_sedes)
agrupaciones_sedes = transformar_sedesinstituciones(df_limpio_sedes)

graficar_sedes_por_ciudad(
    agrupaciones_sedes["agrupacion1"]
)

# =============================================================================
# PROGRAMAS ACADEMICOS
# =============================================================================
datos_programas = consumir_programasacademicos()
df_programas = pd.DataFrame(datos_programas)
df_limpio_programas = limpiar_programasacademicos(df_programas)
agrupaciones_programas = transformar_programasacademicos(df_limpio_programas)

graficar_programas_por_nivel(
    agrupaciones_programas["agrupacion1"]
)

# =============================================================================
# DETALLES OPERACION
# =============================================================================
datos_detalles = consumir_detallesoperacion()
df_detalles = pd.DataFrame(datos_detalles)
df_limpio_detalles = limpiar_detallesoperacion(df_detalles)
agrupaciones_detalles = transformar_detallesoperacion(df_limpio_detalles)

graficar_costo_por_jornada(
    agrupaciones_detalles["agrupacion2"]
)

# =============================================================================
# CALIDAD BENEFICIOS
# =============================================================================
datos_calidad = consumir_calidadbeneficios()
df_calidad = pd.DataFrame(datos_calidad)
df_limpio_calidad = limpiar_calidadbeneficios(df_calidad)
agrupaciones_calidad = transformar_calidadbeneficios(df_limpio_calidad)

graficar_mapa_calor_beneficios(
    agrupaciones_calidad["agrupacion3"]
)

# =============================================================================
# USUARIOS
# =============================================================================
datos_usuarios = consumir_usuarios()
df_usuarios = pd.DataFrame(datos_usuarios)
df_limpio_usuarios = limpiar_usuarios(df_usuarios)
agrupaciones_usuarios = transformar_usuarios(df_limpio_usuarios)

graficar_usuarios_por_ocupacion(
    agrupaciones_usuarios["agrupacion2"]
)