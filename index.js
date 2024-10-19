// Importar las librerías necesarias
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { search, getAlbum, getPlaylist } = require('./ytmusicapi/parsers'); // Ajustar según las funciones disponibles

// Crear una instancia de Express
const app = express();

// Usar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Usar bodyParser para manejar JSON en las solicitudes
app.use(bodyParser.json());

// Rutas de la API

// Ruta para buscar canciones
app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const results = await search(query); // Llama a la función de búsqueda
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener un álbum por ID
app.get('/album', async (req, res) => {
  try {
    const { albumId } = req.query;
    const album = await getAlbum(albumId); // Llama a la función para obtener un álbum
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener una playlist por ID
app.get('/playlist', async (req, res) => {
  try {
    const { playlistId } = req.query;
    const playlist = await getPlaylist(playlistId); // Llama a la función para obtener una playlist
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta de prueba para verificar el funcionamiento del servidor
app.get('/', (req, res) => {
  res.json({ message: "API de YouTube Music funcionando correctamente" });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Exportar la app para que Vercel la use
module.exports = app;
