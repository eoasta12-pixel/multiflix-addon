const express = require('express');
const cors = require('cors');

const app = express();

// Configurações de tráfego pesado para evitar bloqueios no Fire OS 8
app.use(cors({
    origin: '*',
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

const PORT = process.env.PORT || 3000;

// Manifesto Organizado com Identidade Profissional
const manifest = {
    id: "community.multiflix.firetv.perfect",
    version: "5.0.0",
    name: "⚡ MultiFlix Ultra 4K",
    description: "Addon privado e otimizado para hardware Fire TV Stick 4K. Força a reprodução direta sem utilizar reprodutores Beta.",
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"],
    catalogs: []
};

app.get('/manifest.json', (req, res) => {
    res.setHeader('Cache-Control', 'max-age=86400, public');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(manifest);
});

// O Motor Inteligente de Alinhamento de Player Nativo
app.get('/stream/:type/:id.json', async (req, res) => {
    const { type, id } = req.params;
    const streams = [];

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        if (type === 'movie') {
            // ==========================================
            // FILMES - INTERFACE TOTALMENTE ORGANIZADA
            // ==========================================

            // Fonte Principal: Força fluxo limpo compatível com reprodutor padrão Android/FireOS
            streams.push({
                name: "⚡ MULTIFLIX\n[SERVIDOR 1]",
                title: "🎬 Filme Dublado / Legendado (Auto-HD/4K)\n👉 REPRODUÇÃO DIRETA (Forçar Player Nativo)",
                url: `https://vidsrc.xyz{id}`,
                behaviorHints: {
                    notSupported: false,
                    isLive: false,
                    // Avisa ao Nuvio que isso é uma stream direta para não abrir o LibMpv Beta
                    forceWindow: false, 
                    proxyHeaders: { "User-Agent": "Mozilla/5.0 (Linux; Android 11; Fire TV)" }
                }
            });

            // Fonte Secundária: CDN Alternativa de Alta Velocidade
            streams.push({
                name: "🚀 MULTIFLIX\n[SERVIDOR 2]",
                title: "🎬 Rota Alternativa - Sem Travamento (1080p)\n👉 REPRODUÇÃO DIRETA (Aceleração por Hardware)",
                url: `https://autoembed.to{id}`,
                behaviorHints: {
                    forceWindow: false,
                    proxyHeaders: { "User-Agent": "Mozilla/5.0" }
                }
            });

        } else if (type === 'series') {
            // ==========================================
            // SÉRIES - ORGANIZAÇÃO POR EPISÓDIO
            // ==========================================
            const parts = id.split(':');
            const imdbId = parts[0];
            const season = parts[1] || "1";
            const episode = parts[2] || "1";

            // Fonte Principal para Séries
            streams.push({
                name: "⚡ MULTIFLIX\n[SÉRIE S1]",
                title: `🍿 Temporada ${season} • Episódio ${episode}\n👉 REPRODUÇÃO DIRETA (Player de Sistema)`,
                url: `https://vidsrc.xyz{imdbId}/${season}/${episode}`,
                behaviorHints: {
                    forceWindow: false,
                    proxyHeaders: { "User-Agent": "Mozilla/5.0 (Linux; Android 11; Fire TV)" }
                }
            });

            // Fonte Secundária para Séries
            streams.push({
                name: "🚀 MULTIFLIX\n[SÉRIE S2]",
                title: `🍿 Rota Estável • Temporada ${season} • Ep ${episode}\n👉 REPRODUÇÃO DIRETA (Alta Estabilidade)`,
                url: `https://autoembed.to{imdbId}-${season}-${episode}`,
                behaviorHints: {
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
    console.log(`=== MOTOR SUPREMO ORGANIZADO PRONTO ===`);
});
