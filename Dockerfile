# Usar una imagen base de Python 3.9 slim
FROM python:3.9-slim

# Instalar dependencias de sistema
RUN apt-get update && \
    apt-get install -y curl ffmpeg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Crear un directorio para la app
WORKDIR /app

# Copiar archivos de dependencias
COPY requirements.txt .
COPY package*.json ./

# Instalar dependencias de Python y Node.js
RUN pip install -r requirements.txt
RUN npm install --omit=dev

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
