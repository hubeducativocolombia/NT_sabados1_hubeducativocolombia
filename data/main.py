import pandas as pd

from utils.simulacion_instituciones import simular_instituciones
from utils.simulacion_sedes import simular_sedes

# Generar simulaciones
instituciones = simular_instituciones(10)
sedes = simular_sedes(10)

# Convertir a DataFrame
instituciones_df = pd.DataFrame(instituciones)
sedes_df = pd.DataFrame(sedes)

# Imprimir
print("=== INSTITUCIONES ===")
print(instituciones_df)

print("\n=== SEDES ===")
print(sedes_df)