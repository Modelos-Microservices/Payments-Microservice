#!/bin/sh
# start.sh

echo "Iniciando script de startup..."

# Verificar la variable de entorno
if [ -z "$HOOKDECK_API_KEY" ]; then
  echo "ERROR: HOOKDECK_API_KEY no está configurada"
  exit 1
else
  echo "HOOKDECK_API_KEY está configurada correctamente"
fi

# Autenticación con Hookdeck usando la API key
echo "Intentando autenticar con Hookdeck..."
echo $HOOKDECK_API_KEY | hookdeck login --key-stdin
if [ $? -ne 0 ]; then
  echo "ERROR: Fallo en la autenticación con Hookdeck"
  exit 1
else
  echo "Autenticación con Hookdeck exitosa"
fi

# Verificar que Hookdeck está instalado correctamente
echo "Verificando instalación de Hookdeck..."
hookdeck --version
if [ $? -ne 0 ]; then
  echo "ERROR: Hookdeck CLI no está instalado correctamente"
  exit 1
else
  echo "Hookdeck CLI está instalado correctamente"
fi

# Iniciar el listener de Hookdeck en segundo plano
echo "Iniciando listener de Hookdeck..."
hookdeck listen 3003 stripe-to-localhost &
HOOKDECK_PID=$!
echo "Listener de Hookdeck iniciado con PID: $HOOKDECK_PID"

# Esperar un momento para asegurarse de que Hookdeck ha iniciado
sleep 5

# Verificar si el proceso de Hookdeck sigue en ejecución
if ps -p $HOOKDECK_PID > /dev/null; then
  echo "Hookdeck está ejecutándose correctamente"
else
  echo "ERROR: El proceso de Hookdeck no está en ejecución"
fi

# Iniciar la aplicación NestJS en modo desarrollo
echo "Iniciando aplicación NestJS..."
npm run start:dev