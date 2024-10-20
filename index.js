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

// Ruta para buscar canciones usando `ytmusicapi`
app.get('/search', (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    // Ejecuta el script de Python con el argumento de búsqueda
    exec(`python3 ./ytmusicapi/parsers/index.py "${query}"`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error ejecutando el script:', stderr);
            return res.status(500).json({ error: stderr });
        }
        try {
            // Intenta parsear la salida del script como JSON
            const results = JSON.parse(stdout);
            res.json(results);
        } catch (parseError) {
            res.status(500).json({ error: 'Error parsing Python output', details: parseError.message });
        }
    });
});

// Ruta para obtener sugerencias de búsqueda
app.get('/suggestions', (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    // Ejecuta el script de Python con el comando "suggestions"
    exec(`python3 ./ytmusicapi/parsers/index.py "${query}" suggestions`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error ejecutando el script:', stderr);
            return res.status(500).json({ error: stderr });
        }
        try {
            // Intenta parsear la salida del script como JSON
            const suggestions = JSON.parse(stdout);
            res.json(suggestions);
        } catch (parseError) {
            res.status(500).json({ error: 'Error parsing Python output', details: parseError.message });
        }
    });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

module.exports = app;
