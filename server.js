const express = require('express');
const cors = require('cors');

const app = express();

// CORS completo e irrestrito para garantir comunicacao direta com o Fire OS
app.use(cors({
    origin: '*',
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 3000;

const manifest = {
    id: "community.multiflix.exoplayer.ultimate",
    version: "8.0.0",
    name: "MultiFlix ExoPlayer Direct",
    description: "Servidor bruto de alta estabilidade para ExoPlayer nativo.",
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

app.get('/stream/:type/:id.json', async (req, res) => {
    const { type, id } = req.params;
    const streams = [];

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Headers de mascaramento industrial para forcar o ExoPlayer a ignorar restricoes web
    const fireTvHeaders = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 11; Fire TV Build/NS6314) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/94.0.4606.61 Mobile Safari/537.36",
        "Referer": "https://vidsrc.xyz",
        "Origin": "https://vidsrc.xyz",
        "X-Requested-With": "com.amazon.amazonvideo.livingroom"
    };

    try {
        if (type === 'movie') {
            // Rotas brutas injetadas diretamente com controle de proxy de rede
            streams.push({
                name: "Servidor 1 - ExoPlayer",
                title: "Streaming Direto / Decodificacao por Hardware 4K",
                url: `https://vidsrc.xyzembed/movie/${id}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false,
                    proxyHeaders: { request: fireTvHeaders }
                }
            });

            streams.push({
                name: "Servidor 2 - ExoPlayer",
                title: "Streaming Direto / Rota de Contingencia 1080p",
                url: `https://vidsrc.to{id}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false,
                    proxyHeaders: { request: fireTvHeaders }
                }
            });

            streams.push({
                name: "Servidor 3 - ExoPlayer",
                title: "Streaming Direto / CDN Alternativa Secundaria",
                url: `https://embed.su{id}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false,
                    proxyHeaders: { request: fireTvHeaders }
                }
            });

        } else if (type === 'series') {
            // Divisao cirurgica do ID composto para busca inteligente de episodios
            const parts = id.split(':');
            const imdbId = parts[0];
            const season = parts[1] || "1";
            const episode = parts[2] || "1";

            streams.push({
                name: "Servidor 1 - ExoPlayer Serie",
                title: `Temporada ${season} / Episodio ${episode} - Stream Nativa`,
                url: `https://vidsrc.xyzembed/tv/${imdbId}/${season}/${episode}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false,
                    proxyHeaders: { request: fireTvHeaders }
                }
            });

            streams.push({
                name: "Servidor 2 - ExoPlayer Serie",
                title: `Temporada ${season} / Episodio ${episode} - Rota Alternativa`,
                url: `https://vidsrc.to{imdbId}/${season}/${episode}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false,
                    proxyHeaders: { request: fireTvHeaders }
                }
            });

            streams.push({
                name: "Servidor 3 - ExoPlayer Serie",
                title: `Temporada ${season} / Episodio ${episode} - Rota Contingencia`,
                url: `https://embed.su{imdbId}/${season}/${episode}`,
                behaviorHints: {
                    notWebReady: true,
                    forceWindow: false,
                    proxyHeaders: { request: fireTvHeaders }
                }
            });
        }

        return res.json({ streams: streams });

    } catch (error) {
        // Bloco de captura de excecoes para impedir que o Nuvio congele ou feche o app
        return res.json({ streams: [] });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor industrial rodando com sucesso na porta ${PORT}`);
});
