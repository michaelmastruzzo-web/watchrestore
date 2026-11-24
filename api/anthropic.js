// Proxy vers l'API Anthropic pour WatchRestore
import { originAllowed, clientIp, rateLimiter } from './_guard.js';

const BREVITY = `

RECHERCHE WEB (obligatoire) :
- Utilise l'outil web_search pour trouver de VRAIES annonces actuellement en ligne. Tu disposes de 8 recherches : varie les sites et les formulations (français et anglais), par exemple "[modèle] pour pièces", "[modèle] for parts not working", "[modèle] à restaurer".
- Le titre, l'extrait et l'URL d'un résultat de recherche suffisent pour retenir une annonce : tu n'as pas besoin d'ouvrir la page. Déduis le prix et l'état de l'extrait ; s'il manque une information, donne ton estimation et signale-le dans "description".
- Préfère les pages d'annonces individuelles aux pages de catégorie ou de résultats.
- N'invente jamais une annonce ni une URL : "url" doit être l'adresse exacte d'un résultat de recherche.
- Si tu trouves moins d'annonces que demandé, renvoie seulement celles que tu as trouvées.

CONTRAINTES DE LONGUEUR (obligatoires) :
- 6 annonces maximum dans "listings".
- "synthesis" : 3 phrases maximum.
- "description" : 20 mots maximum.
- "works_needed" : 3 éléments maximum, quelques mots chacun.
- Réponse finale : JSON compact, sans backticks, sans texte avant ou après.`;

const WEB_SEARCH_TOOL = {
  type: 'web_search_20260209',
  name: 'web_search',
  max_uses: 8,
  allowed_domains: [
    'ebay.fr', 'ebay.com', 'ebay.de', 'ebay.it', 'ebay.co.uk',
    'leboncoin.fr', 'chrono24.fr', 'chrono24.com', 'catawiki.com', 'catawiki.fr',
    'delcampe.net', 'vinted.fr'
  ]
};
// Reprises maximum quand la recherche s'interrompt (stop_reason "pause_turn").
const MAX_CONTINUATIONS = 2;

// Répare un JSON de recherche coupé en fin de réponse :
// on garde les annonces complètes et on referme la structure.
function repairListingsJson(text) {
  let t = text.replace(/```json|```/g, '').trim();
  const start = t.indexOf('{');
  if (start === -1) return null;
  t = t.slice(start);
  try { JSON.parse(t); return t; } catch (_) {}

  const listingsAt = t.indexOf('"listings"');
  if (listingsAt === -1) return null;
  // Coupe après chaque "}" en partant de la fin, puis referme la liste.
  for (let i = t.length - 1; i > listingsAt; i--) {
    if (t[i] !== '}') continue;
    const candidate = t.slice(0, i + 1) + ']}';
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed.listings) && parsed.listings.length > 0) {
        return JSON.stringify(parsed);
      }
    } catch (_) {}
  }
  return null;
}

// Toutes les URL présentes dans les résultats d'outils (hors texte rédigé par le modèle).
function collectToolUrls(content) {
  const urls = new Set();
  const walk = (v) => {
    if (typeof v === 'string') {
      for (const m of v.match(/https?:\/\/[^\s"'<>)\]]+/g) || []) urls.add(normalizeUrl(m));
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  content.filter(b => b.type !== 'text').forEach(walk);
  return urls;
}

function normalizeUrl(u) {
  return u.split(/[?#]/)[0].replace(/[.,;]+$/, '').replace(/\/+$/, '').replace(/^http:/, 'https:');
}

// Retire les URL qui ne viennent pas des résultats de recherche.
function keepFoundUrls(json, foundUrls) {
  const parsed = JSON.parse(json);
  for (const l of parsed.listings || []) {
    if (typeof l.url !== 'string' || !foundUrls.has(normalizeUrl(l.url))) l.url = 'N/A';
  }
  return JSON.stringify(parsed);
}

// Modèle imposé côté serveur : le client ne peut pas en choisir un autre.
const MODEL = 'claude-sonnet-5-5';
const MAX_BODY_CHARS = 20000;

const rateLimited = rateLimiter(10);

function validMessages(messages) {
  return Array.isArray(messages) && messages.length > 0 && messages.length <= 4 &&
    messages.every(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!originAllowed(req)) return res.status(403).json({ error: 'Origin not allowed' });

  if (rateLimited(clientIp(req))) return res.status(429).json({ error: 'Trop de requêtes, réessayez dans une minute.' });

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.REACT_APP_ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY absente de l\'environnement');
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { system, messages } = req.body || {};
  if (!validMessages(messages) || (system !== undefined && typeof system !== 'string')) {
    return res.status(400).json({ error: 'Requête invalide' });
  }
  if (JSON.stringify({ system, messages }).length > MAX_BODY_CHARS) {
    return res.status(413).json({ error: 'Requête trop longue' });
  }

  try {
    const body = { model: MODEL, messages };
    if (system) body.system = system;

    const isSearch = typeof system === 'string' && system.includes('"listings"');
    if (isSearch) {
      body.system += BREVITY;
      body.max_tokens = 8000;
      body.tools = [WEB_SEARCH_TOOL];
      body.output_config = { effort: 'low' };
    } else {
      // La réflexion du modèle compte dans max_tokens : une limite trop basse coupe la réponse.
      body.max_tokens = 4000;
      body.output_config = { effort: 'low' };
    }

    const callApi = () => fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    let response = await callApi();
    let data = await response.json();
    // Un site peut bloquer le robot d'Anthropic : on le retire de la liste et on relance une fois.
    const blocked = isSearch && response.status === 400 &&
      /not accessible to our user agent: \[([^\]]*)\]/.exec(data?.error?.message || '');
    if (blocked) {
      const names = blocked[1].match(/[\w.-]+/g) || [];
      console.error('Domaines bloqués retirés', names);
      body.tools = [{ ...WEB_SEARCH_TOOL, allowed_domains: WEB_SEARCH_TOOL.allowed_domains.filter(d => !names.includes(d)) }];
      response = await callApi();
      data = await response.json();
    }
    // La recherche web peut s'interrompre : on renvoie le tour en cours pour la reprendre.
    const content = [];
    for (let i = 0; response.ok && data.stop_reason === 'pause_turn' && i < MAX_CONTINUATIONS; i++) {
      content.push(...data.content);
      body.messages = [...messages, { role: 'assistant', content: [...content] }];
      response = await callApi();
      data = await response.json();
    }
    if (!response.ok) console.error('Erreur Anthropic', response.status, JSON.stringify(data));
    if (response.ok && data.stop_reason !== 'end_turn') {
      console.error('Réponse incomplète', data.stop_reason, JSON.stringify(data.usage));
    }

    if (isSearch && response.ok && Array.isArray(data.content)) {
      const all = [...content, ...data.content];
      // Le JSON final suit le dernier résultat d'outil ; le texte d'avant est du commentaire.
      let lastTool = -1;
      all.forEach((b, i) => { if (b.type !== 'text') lastTool = i; });
      const text = all.slice(lastTool + 1).filter(b => b.type === 'text').map(b => b.text).join('');
      const fixed = repairListingsJson(text);
      if (fixed) {
        const foundUrls = collectToolUrls(all);
        console.log('Recherche', JSON.stringify({
          stop: data.stop_reason,
          blocs: all.map(b => b.type),
          urlsTrouvees: foundUrls.size,
          urlsAnnonces: JSON.parse(fixed).listings.map(l => l.url)
        }));
        data.content = [{ type: 'text', text: keepFoundUrls(fixed, foundUrls) }];
      } else {
        console.error('Réponse de recherche illisible', data.stop_reason, text.slice(0, 500));
      }
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Erreur proxy', error);
    return res.status(500).json({ error: error.message });
  }
}
