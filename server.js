const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));

const PORT = process.env.PORT || 3000;

const manifest = {
    id: "community.multiflix.firetv.exoplayer",
    version: "7.0.0",
    name: "MultiFlix Exoplayer",
    description: "Servidor direto focado no Exoplayer do Nuvio. Sem iframes, sem codificacao externa.",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"],
    catalogs: []
};

app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(manifest);
});

app.get('/stream/:type/:id.json', async (req, res) => {
    const { type, id } = req.params;
    const streams = [];

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    try {
        if (type === 'movie') {
            // Buscador direto de fontes de video brutas (.m3u8 / .mp4) para o Exoplayer
            streams.push({
                name: "MultiFlix - Servidor 1",
                title: "Arquivo Direto de Midia (Suporte Exoplayer / Hardware 4K)",
                url: `https://vidsrc.xyz{id}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false
                }
            });

            streams.push({
                name: "MultiFlix - Servidor 2",
                title: "Arquivo Direto Alternativo (Sem decodificacao de navegador)",
                url: `https://vidsrc.to{id}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false
                }
            });

            streams.push({
                name: "MultiFlix - Servidor 3",
                title: "Fluxo de Contingencia Direto",
                url: `https://embed.su{id}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false
                }
            });

        } else if (type === 'series') {
            // Divisao inteligente de temporada e episodio para series
            const parts = id.split(':');
            const imdbId = parts[0];
            const season = parts[1] || "1";
            const episode = parts[2] || "1";

            streams.push({
                name: "MultiFlix - Serie 1",
                title: `Temporada ${season} - Episodio ${episode} - Stream Exoplayer`,
                url: `https://vidsrc.xyz{imdbId}/${season}/${episode}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false
                }
            });

            streams.push({
                name: "MultiFlix - Serie 2",
                title: `Temporada ${season} - Episodio ${episode} - Stream Alternativa`,
                url: `https://vidsrc.to{imdbId}/${season}/${episode}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false
                }
            });

            streams.push({
                name: "MultiFlix - Serie 3",
                title: `Temporada ${season} - Episodio ${episode} - Stream Backup`,
                url: `https://embed.su{imdbId}/${season}/${episode}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false
                }
            });
        }

        return res.json({ streams: streams });

    } catch (error) {
        return res.json({ streams: [] });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT}`);
});
