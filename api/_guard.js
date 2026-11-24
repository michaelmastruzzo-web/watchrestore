// Protections communes aux fonctions /api (fichier préfixé par "_" : non exposé comme route).

// N'accepte que les appels venant du site lui-même (ou des domaines de ALLOWED_ORIGINS).
export function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  let host;
  try { host = new URL(origin).host; } catch (_) { return false; }
  if (host === req.headers.host) return true;
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  return allowed.includes(origin);
}

export function clientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
}

// Limite best-effort par IP (mémoire de l'instance serverless).
export function rateLimiter(max, windowMs = 60 * 1000) {
  const hits = new Map();
  return (ip) => {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(t => now - t < windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) hits.clear();
    return recent.length > max;
  };
}
