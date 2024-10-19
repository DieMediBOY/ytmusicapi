const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { search, getAlbum, getPlaylist } = require('./ytmusicapi/parsers'); // Ajusta las importaciones si es necesario

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Ruta de prueba para verificar el funcionamiento del servidor
app.get('/', (req, res) => {
  res.json({ message: "API de YouTube Music funcionando correctamente" });
});

// Ruta para buscar canciones
app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const results = await search(query);
    res.json(results);
  } catch (error) {
    console.error('Error en /search:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
});

// Ruta para obtener un álbum
app.get('/album', async (req, res) => {
  try {
    const { albumId } = req.query;
    if (!albumId) {
      return res.status(400).json({ error: 'Album ID is required' });
    }
    const album = await getAlbum(albumId);
    res.json(album);
  } catch (error) {
    console.error('Error en /album:', error);
    res.status(500).json({ error: 'Failed to get album' });
  }
});

// Ruta para obtener una playlist
app.get('/playlist', async (req, res) => {
  try {
    const { playlistId } = req.query;
    if (!playlistId) {
      return res.status(400).json({ error: 'Playlist ID is required' });
    }
    const playlist = await getPlaylist(playlistId);
    res.json(playlist);
  } catch (error) {
    console.error('Error en /playlist:', error);
    res.status(500).json({ error: 'Failed to get playlist' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

module.exports = app;
