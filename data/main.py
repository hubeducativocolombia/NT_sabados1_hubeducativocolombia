import random
import pandas as pd

from simulation.instituciones_simulation import simular_instituciones
from simulation.sedes_institucion_simulation import simular_sedes
from cleaning.instituciones_cleaning import limpiar_instituciones
from cleaning.sedes_institucion_cleaning import limpiar_sedes

# 1. Generar instituciones primero
instituciones = simular_instituciones(10)

# 2. Extraer ids reales de instituciones
idsInstituciones = [i["id_institucion"] for i in instituciones if i["id_institucion"] not in [None, -1, 0]]

# 3. Generar sedes
sedes = simular_sedes(10)

# 4. Asignar ids reales a las sedes (relacion entre tablas)
for sede in sedes:
    sede["id_institucion"] = random.choice(idsInstituciones) if idsInstituciones else None

# 5. Convertir a DataFrame
instituciones_df = pd.DataFrame(instituciones)
sedes_df = pd.DataFrame(sedes)

# 6. Imprimir datos sucios
print("=== INSTITUCIONES SUCIAS ===")
print(instituciones_df)

print("\n=== SEDES SUCIAS ===")
print(sedes_df)

# 7. Limpiar datos
instituciones_df_limpio = limpiar_instituciones(instituciones_df)
sedes_df_limpio = limpiar_sedes(sedes_df)

# 8. Imprimir datos limpios
print("\n=== INSTITUCIONES LIMPIAS ===")
print(instituciones_df_limpio)

print("\n=== SEDES LIMPIAS ===")
print(sedes_df_limpio)