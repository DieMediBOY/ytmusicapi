const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para ejecutar el script de búsqueda de canciones
app.get('/search', (req, res) => {
    const query = req.query.query;
    exec(`python3 ./ytmusicapi/parsers/search.py ${query}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }
        return res.json(JSON.parse(stdout));
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
