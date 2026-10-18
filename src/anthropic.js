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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.REACT_APP_ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const body = { ...req.body };
    delete body.tools;

    const isSearch = typeof body.system === 'string' && body.system.includes('"listings"');
    if (isSearch) {
      body.system += BREVITY;
      body.max_tokens = 3000;
    } else if (!body.max_tokens || body.max_tokens > 2000) {
      body.max_tokens = 2000;
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

    if (isSearch && response.ok && Array.isArray(data.content)) {
      const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
      const fixed = repairListingsJson(text);
      if (fixed) data.content = [{ type: 'text', text: fixed }];
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
