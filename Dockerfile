# Usar una imagen base que tenga Python y Node.js
FROM python:3.9-slim

# Instalar Node.js
RUN apt-get update && \
    apt-get install -y curl ffmpeg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Crear un directorio de la app
WORKDIR /app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Copiar el resto del código de la aplicación
COPY . .

# Instalar las dependencias de Node.js y Python
RUN npm install --omit=dev
RUN pip install yt-dlp

# Exponer el puerto
EXPOSE 8080

# Ejecutar la aplicación
CMD ["npm", "start"]
