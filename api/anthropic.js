// Proxy vers l'API Anthropic pour WatchRestore
const BREVITY = `

CONTRAINTES DE LONGUEUR (obligatoires) :
- Exactement 4 annonces dans "listings".
- "synthesis" : 3 phrases maximum.
- "description" : 20 mots maximum.
- "works_needed" : 3 éléments maximum, quelques mots chacun.
- JSON compact, sans backticks, sans texte avant ou après.`;

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

// Modèle imposé côté serveur : le client ne peut pas en choisir un autre.
const MODEL = 'claude-sonnet-5-5';
const MAX_BODY_CHARS = 20000;

// Limite best-effort par IP (mémoire de l'instance serverless).
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 10;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_MAX;
}

// N'accepte que les appels venant du site lui-même (ou des domaines de ALLOWED_ORIGINS).
function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  let host;
  try { host = new URL(origin).host; } catch (_) { return false; }
  if (host === req.headers.host) return true;
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  return allowed.includes(origin);
}

function validMessages(messages) {
  return Array.isArray(messages) && messages.length > 0 && messages.length <= 4 &&
    messages.every(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!originAllowed(req)) return res.status(403).json({ error: 'Origin not allowed' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Trop de requêtes, réessayez dans une minute.' });

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
      body.max_tokens = 3000;
    } else {
      body.max_tokens = Math.min(Number(req.body.max_tokens) || 1000, 2000);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) console.error('Erreur Anthropic', response.status, JSON.stringify(data));

    if (isSearch && response.ok && Array.isArray(data.content)) {
      const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
      const fixed = repairListingsJson(text);
      if (fixed) data.content = [{ type: 'text', text: fixed }];
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Erreur proxy', error);
    return res.status(500).json({ error: error.message });
  }
}
