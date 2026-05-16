import pandas as pd

# *** ZONA PARA IMPORTAR SIMULACIONES ***
from data.utils.simulacion_calidadbeneficio import simular_calidadbeneficio
from data.utils.simulacion_instituciones import simular_instituciones
from data.utils.simulacion_programas_academicos import simular_programas_academicos
from data.utils.simulacion_sedes_institucion import simular_sedes_institucion
from data.utils.simulacion_usuario import simular_usuario
from data.utils.simulacionDetallesOperaciones import simular_detalles_operaciones

# *** ZONA PARA IMPORTAR LIMPIEZAS ***
from data.notebook.limpieza_calidadbeneficio import limpiar_calidadbeneficio
from data.notebook.limpieza_instituciones import limpiar_instituciones
from data.notebook.limpieza_programas_academicos import limpiar_simulacion
from data.notebook.limpieza_sedes_institucion import limpiar_sedes_institucion
from data.notebook.limpieza_usuario import limpiar_usuario
from data.notebook.limpiezaDetallesOperacion import limpiar_detalles_operacion

# *** ZONA PARA IMPORTAR DESCRIPCIONES ***
from data.notebook.descripcion_calidadbeneficio import describir_calidadbeneficio
from data.notebook.descripcion_instituciones import describir_instituciones
from data.notebook.descripcion_programas_academicos import describir_programas_academicos
from data.notebook.descripcion_sedes_institucion import describir_sedes_institucion
from data.notebook.descripcion_usuario import describir_usuario
from data.notebook.descripcionDetallesOperacion import describir_detalles_operacion

# ================================================
# CALIDAD BENEFICIO
# ================================================
simulaciones_calidadbeneficio = simular_calidadbeneficio(10)
df_calidadbeneficio = pd.DataFrame(simulaciones_calidadbeneficio)
df_calidadbeneficio_limpio = limpiar_calidadbeneficio(df_calidadbeneficio)
describir_calidadbeneficio(df_calidadbeneficio_limpio)

# ================================================
# INSTITUCIONES
# ================================================
simulaciones_instituciones = simular_instituciones(10)
df_instituciones = pd.DataFrame(simulaciones_instituciones)
df_instituciones_limpio = limpiar_instituciones(df_instituciones)
describir_instituciones(df_instituciones_limpio)

# ================================================
# PROGRAMAS ACADEMICOS
# ================================================
simulaciones_programas = simular_programas_academicos(10)
df_programas = pd.DataFrame(simulaciones_programas)
df_programas_limpio = limpiar_simulacion(df_programas)
describir_programas_academicos(df_programas_limpio)

# ================================================
# SEDES INSTITUCION
# ================================================
simulaciones_sedes = simular_sedes_institucion(10)
df_sedes = pd.DataFrame(simulaciones_sedes)
df_sedes_limpio = limpiar_sedes_institucion(df_sedes)
describir_sedes_institucion(df_sedes_limpio)

# ================================================
# USUARIO
# ================================================
simulaciones_usuario = simular_usuario(10)
df_usuario = pd.DataFrame(simulaciones_usuario)
df_usuario_limpio = limpiar_usuario(df_usuario)
describir_usuario(df_usuario_limpio)

# ================================================
# DETALLES OPERACIONES
# ================================================
simulaciones_detalles = simular_detalles_operaciones(10)
df_detalles = pd.DataFrame(simulaciones_detalles)
df_detalles_limpio = limpiar_detalles_operacion(df_detalles)
describir_detalles_operacion(df_detalles_limpio)