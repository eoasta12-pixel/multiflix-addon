const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const manifest = {
    id: "community.multiflix.personal",
    version: "1.0.0",
    name: "MultiFlix Pessoal",
    description: "Meu indexador privado de Iracemaflix, Seriesflix e Rede Canais.",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"],
    catalogs: []
};

app.get('/manifest.json', (req, res) => {
    res.json(manifest);
});

app.get('/stream/:type/:id.json', async (req, res) => {
    const { type, id } = req.params;
    const streams = [];

    try {
        if (type === 'movie') {
            streams.push({
                name: "🎬 Iracemaflix",
                title: "Assistir via Iracemaflix (Player Externo)",
                url: `https://eu.cc{id}`
            });
            streams.push({
                name: "🎥 Seriesflix",
                title: "Assistir via Seriesflix (HD)",
                url: `https://seriesflixbiz.com{id}`
            });
            streams.push({
                name: "📺 Rede Canais",
                title: "Assistir via Rede Canais (Rápido)",
                url: `https://redecanais.in{id}`
            });
        } else {
            streams.push({
                name: "🍿 MultiFlix Séries",
                title: "Buscar esta série no Seriesflix",
                url: `https://seriesflixbiz.com{id}`
            });
        }

        res.json({ streams: streams });
    } catch (e) {
        res.json({ streams: [] });
    }
});

app.listen(PORT, () => {
    console.log(`Addon rodando na porta ${PORT}`);
});
