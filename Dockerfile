# Usar una imagen base que tenga node y python
FROM node:18

# Instalar ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Crear un directorio de la app
WORKDIR /app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de Node.js
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 8080

# Ejecutar la aplicación
CMD ["npm", "start"]
