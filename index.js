const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
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

// Función para ejecutar el script de Python
const runYTscript = (query, res) => {
     exec(`python3 ./ytmusicapi/parsers/download_audio.py "${query}"`, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
        if (error) {
            console.error('Error ejecutando el script:', stderr);
            return res.status(500).json({ error: stderr });
        }
        try {
            const results = JSON.parse(stdout.trim());
            if (results.status === "success") {
                const filePath = path.resolve(__dirname, results.file);
                // Devuelve el enlace de streaming
                const fileUrl = `${req.protocol}://${req.get('host')}/stream/${results.file}`;
                res.json({ status: "success", url: fileUrl });
            } else {
                res.status(500).json(results);
            }
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
// Endpoint para obtener letras de una canción
app.get('/lyrics', (req, res) => {
    const songId = req.query.songId;
    if (!songId) {
        return res.status(400).json({ error: "songId parameter is required" });
    }
    runPythonScript("get_lyrics", songId, res);
});

// Endpoint para manejar la descarga y conversión
app.get('/download', (req, res) => {
    const youtubeId = req.query.id;
    if (!youtubeId) {
        return res.status(400).json({ error: "YouTube ID is required" });
    }
    runYTscript(youtubeId, res);
});

// Endpoint para servir el archivo MP3 en streaming
app.get('/stream/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.resolve(__dirname, fileName);

    // Verificar si el archivo existe antes de servirlo
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'audio/mpeg');
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    } else {
        res.status(404).json({ error: "File not found" });
    }
});



// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

module.exports = app;
