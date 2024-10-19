const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para la raíz con un mensaje de bienvenida
app.get('/', (req, res) => {
    res.send('Bienvenido');
});

// Ejemplo de otra ruta (ajusta según tus necesidades)
app.get('/search', (req, res) => {
    const query = req.query.query;
    exec(`python3 ./ytmusicapi/parsers/search.py ${query}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }
        return res.json(JSON.parse(stdout));
    });
});

// Ruta para obtener información de un álbum (ejemplo)
app.get('/album', (req, res) => {
    const albumId = req.query.id;
    exec(`python3 ./ytmusicapi/parsers/albums.py ${albumId}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }
        return res.json(JSON.parse(stdout));
    });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

module.exports = app;
