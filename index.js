const express = require('express');
const cors = require('cors');
const { search, getAlbum, getPlaylist } = require('./ytmusicapi/parsers'); // Asegúrate de ajustar las importaciones según las funciones que necesites

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para buscar canciones
app.get('/search', async (req, res) => {
  try {
    const { query } = req.query; // Recibir el parámetro de búsqueda
    const results = await search(query); // Llamar a la función de búsqueda
    res.json(results); // Devolver los resultados como JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener un álbum
app.get('/album', async (req, res) => {
  try {
    const { albumId } = req.query;
    const album = await getAlbum(albumId);
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener una playlist
app.get('/playlist', async (req, res) => {
  try {
    const { playlistId } = req.query;
    const playlist = await getPlaylist(playlistId);
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define el puerto y lanza la app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
