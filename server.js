const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Manifesto Oficial do Addon Definitivo
const manifest = {
    id: "community.multiflix.perfect",
    version: "2.0.0",
    name: "MultiFlix Player Nativo",
    description: "Addon definitivo. Filmes e séries rodando direto no player do Nuvio/Stremio, sem sair do app.",
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
            // PROVEDORES PARA FILMES (Player Nativo)
            streams.push({
                name: "⚡ MultiFlix | AutoEmbed",
                title: "Opção Premium (Player Nativo - HD/4K)",
                url: `https://autoembed.to{id}`
            });
            streams.push({
                name: "🚀 MultiFlix | Vidsrc",
                title: "Opção Alternativa (Player Nativo - Rápido)",
                url: `https://vidsrc.xyz{id}`
            });
        } else if (type === 'series') {
            // LÓGICA DE SÉRIES 100% CORRIGIDA
            // Corta o ID (ex: tt1234567:1:5) nos pontos corretos
            const parts = id.split(':');
            const imdbId = parts[0];       // tt1234567
            const season = parts[1] || "1"; // Temporada 1
            const episode = parts[2] || "1"; // Episódio 5

            // PROVEDORES PARA SÉRIES (Player Nativo)
            streams.push({
                name: "⚡ MultiFlix | Série Nativa",
                title: `AutoEmbed | Temporada ${season} - Ep ${episode}`,
                url: `https://autoembed.to{imdbId}-${season}-${episode}`
            });
            streams.push({
                name: "🚀 MultiFlix | Vidsrc Série",
                title: `Vidsrc | Temporada ${season} - Ep ${episode}`,
                url: `https://vidsrc.xyz{imdbId}/${season}/${episode}`
            });
        }

        res.json({ streams: streams });

    } catch (error) {
        console.error("Erro interno no addon:", error);
        res.json({ streams: [] });
    }
});

app.listen(PORT, () => {
    console.log(`Addon Perfeito rodando na porta ${PORT}`);
});
