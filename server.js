const express = require('express');
const cors = require('cors');

const app = express();

// Desativa barreiras de segurança de rede para o Fire OS 8 aceitar a conexão imediata
app.use(cors({
    origin: '*',
    methods: ['GET']
}));

const PORT = process.env.PORT || 3000;

// RG limpo para o aplicativo decodificar sem atrasos
const manifest = {
    id: "community.multiflix.exoplayer.pure",
    version: "9.0.0",
    name: "MultiFlix PURE ExoPlayer",
    description: "Conexao de midia bruta sem iframes. Desenvolvido para ExoPlayer.",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"],
    catalogs: []
};

app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'max-age=86400, public');
    res.json(manifest);
});

// Canal direto de extração de mídias puras
app.get('/stream/:type/:id.json', async (req, res) => {
    const { type, id } = req.params;
    const streams = [];

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        if (type === 'movie') {
            // === CANAIS DIRETOS PARA FILMES ===
            
            streams.push({
                name: "PURE STREAM 1",
                title: "Conexao Direta HLS (ExoPlayer Nativo)",
                url: `https://vidlink.pro{id}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false
                }
            });

            streams.push({
                name: "PURE STREAM 2",
                title: "Conexao Direta MP4 (Aceleração por Hardware)",
                url: `https://vidsrc.to{id}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false
                }
            });

            streams.push({
                name: "PURE STREAM 3",
                title: "Servidor de Contingencia de Video Puro",
                url: `https://vidsrc.xyz{id}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false
                }
            });

        } else if (type === 'series') {
            // === PROCESSO CIRÚRGICO DE SUB-BUSCA DE EPISÓDIOS ===
            const parts = id.split(':');
            const imdbId = parts[0];
            const season = parts[1] || "1";
            const episode = parts[2] || "1";

            streams.push({
                name: "PURE SÉRIE 1",
                title: `VidLink | Temporada ${season} - Ep ${episode}`,
                url: `https://vidlink.pro{imdbId}/${season}/${episode}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false
                }
            });

            streams.push({
                name: "PURE SÉRIE 2",
                title: `Vidsrc | Temporada ${season} - Ep ${episode}`,
                url: `https://vidsrc.to{imdbId}/${season}/${episode}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false
                }
            });

            streams.push({
                name: "PURE SÉRIE 3",
                title: `Alternativo | Temporada ${season} - Ep ${episode}`,
                url: `https://vidsrc.xyz{imdbId}/${season}/${episode}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false
                }
            });
        }

        return res.json({ streams: streams });

    } catch (error) {
        // Retorna vetor limpo em caso de erro para impedir congelamento na TV
        return res.json({ streams: [] });
    }
});

app.listen(PORT, () => {
    console.log(`ONLINE`);
});
                
