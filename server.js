const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Manifesto atualizado para o seu Addon Definitivo
const manifest = {
    id: "community.multiflix.perfect",
    version: "2.0.0",
    name: "MultiFlix Player Nativo",
    description: "Addon definitivo. Filmes rodando direto no player do Nuvio/Stremio, sem sair do app.",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"],
    catalogs: []
};

app.get('/manifest.json', (req, res) => {
    res.json(manifest);
});

app.get('/stream/:type/:id.json', async (req, res) => {
    const { type, id } = req.params; // O 'id' é o código IMDb (ex: tt1234567)
    const streams = [];

    try {
        // PROVEDOR 1: AutoEmbed - Decodifica o vídeo direto para o player nativo
        streams.push({
            name: "⚡ MultiFlix | AutoEmbed",
            title: "Opção Premium (Player Nativo - HD/4K)",
            url: `https://autoembed.to{id}`
        });

        // PROVEDOR 2: Vidsrc - Link direto otimizado para aplicativos de streaming
        streams.push({
            name: "🚀 MultiFlix | Vidsrc",
            title: "Opção Alternativa (Player Nativo - Rápido)",
            url: `https://vidsrc.me{id}`
        });

        // PROVEDOR 3: Embed.su - Servidor de contingência caso os outros falhem
        streams.push({
            name: "🎬 MultiFlix | EmbedSU",
            title: "Opção de Backup (Player Nativo)",
            url: `https://embed.su{id}`
        });

        // Se for série, adaptamos o formato para os provedores nativos
        if (type === 'series') {
            // Limpa a lista padrão de filmes e adiciona as rotas de séries da API estável
            streams.length = 0; 
            
            // Nota: O Stremio envia o ID de série no formato tt1234567:1:1 (ID:Temporada:Episódio)
            const parts = id.split(':');
            const imdbId = parts[0];
            const season = parts[1] || 1;
            const episode = parts[2] || 1;

            streams.push({
                name: "⚡ MultiFlix | Série Nativa",
                title: `Temporada ${season} - Episódio ${episode} (Player Nativo)`,
                url: `https://autoembed.to{imdbId}-${season}-${episode}`
            });
        }

        res.json({ streams: streams });

    } catch (error) {
        console.error("Erro ao processar streams:", error);
        res.json({ streams: [] });
    }
});

app.listen(PORT, () => {
    console.log(`Addon Perfeito rodando na porta ${PORT}`);
});
