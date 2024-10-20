# Usar una imagen base de Python para poder usar yt-dlp
FROM python:3.9-slim

# Instalar ffmpeg y node
RUN apt-get update && \
    apt-get install -y curl ffmpeg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Instalar yt-dlp para descargar videos de YouTube
RUN pip install yt-dlp

# Crear un directorio de la app
WORKDIR /app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de Node.js
RUN npm install --omit=dev

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 8080

# Ejecutar la aplicación
CMD ["npm", "start"]
