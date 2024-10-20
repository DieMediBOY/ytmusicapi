const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();

app.use(cors());
app.use(express.json());

// Función genérica para ejecutar comandos de Python
const runPythonScript = (command, query, res, extraArg = "") => {
    exec(`python3 ./ytmusicapi/parsers/index.py "${command}" "${query}" ${extraArg}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error ejecutando el script:', stderr);
            return res.status(500).json({ error: stderr });
        }
        try {
            const results = JSON.parse(stdout);
            res.json(results);
        } catch (parseError) {
            res.status(500).json({ error: 'Error parsing Python output', details: parseError.message });
        }
    });
};

// Endpoint para cada función
app.get('/search', (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Query parameter is required" });
    runPythonScript("search", query, res);
});

app.get('/suggestions', (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Query parameter is required" });
    runPythonScript("suggestions", query, res);
});

// Más endpoints para cada función de YTMusic
app.get('/home', (req, res) => runPythonScript("get_home", "", res));
app.get('/artist', (req, res) => {
    const artistId = req.query.artistId;
    if (!artistId) return res.status(400).json({ error: "artistId is required" });
    runPythonScript("get_artist", artistId, res);
});

app.get('/artist/albums', (req, res) => {
    const artistId = req.query.artistId;
    const albumType = req.query.albumType || "albums";
    if (!artistId) return res.status(400).json({ error: "artistId is required" });
    runPythonScript("get_artist_albums", artistId, res, albumType);
});

app.get('/album', (req, res) => {
    const albumId = req.query.albumId;
    if (!albumId) return res.status(400).json({ error: "albumId is required" });
    runPythonScript("get_album", albumId, res);
});

// Añade más endpoints para las otras funciones siguiendo este patrón...

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

module.exports = app;
