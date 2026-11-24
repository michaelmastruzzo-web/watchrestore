// Envoie par e-mail (Resend) les formulaires du site : dépôt d'annonce et Espace Pro.
import { originAllowed, clientIp, rateLimiter } from './_guard.js';

const rateLimited = rateLimiter(5);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Champs acceptés par formulaire : [clé, libellé, obligatoire, longueur max].
const FORMS = {
  deposit: {
    title: 'Nouvelle annonce',
    subject: f => `Annonce ${f.ref || ''} — ${f.model}`,
    fields: [
      ['ref', 'Référence', false, 20],
      ['type', 'Type', true, 20],
      ['model', 'Modèle / référence', true, 200],
      ['movement', 'Mouvement', false, 200],
      ['condition', 'État', false, 40],
      ['qty', 'Quantité', false, 10],
      ['price', 'Prix demandé (€)', false, 20],
      ['negotiable', 'Prix négociable', false, 10],
      ['description', 'Description', true, 3000],
      ['name', 'Nom', true, 120],
      ['email', 'Email', true, 200],
      ['phone', 'Téléphone', false, 40],
      ['location', 'Ville / région', true, 120],
      ['contact_pref', 'Contact préféré', false, 20]
    ]
  },
  consign: {
    title: 'Nouvelle demande Espace Pro',
    subject: f => `Stock pro — ${f.name} (${f.stock_qty} montres)`,
    fields: [
      ['name', 'Nom', true, 120],
      ['company', 'Société', false, 200],
      ['email', 'Email', true, 200],
      ['phone', 'Téléphone', true, 40],
      ['siret', 'SIRET', false, 40],
      ['activity', 'Activité', false, 40],
      ['stock_qty', 'Nombre de montres', true, 10],
      ['models', 'Modèles', true, 3000],
      ['avg_condition', 'État moyen', false, 40],
      ['storage_location', 'Lieu de stockage', false, 200],
      ['has_photos', 'Photos disponibles', false, 10],
      ['message', 'Message', false, 3000]
    ]
  }
};

const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Une seule ligne, sans caractères de contrôle (objet et en-têtes de l'e-mail).
const oneLine = s => s.replace(/[\r\n\t]+/g, ' ').trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!originAllowed(req)) return res.status(403).json({ error: 'Origin not allowed' });
  if (rateLimited(clientIp(req))) return res.status(429).json({ error: 'Trop de requêtes, réessayez dans une minute.' });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) {
    console.error('RESEND_API_KEY ou CONTACT_EMAIL absente de l\'environnement');
    return res.status(500).json({ error: 'Envoi non configuré' });
  }

  const { kind, form } = req.body || {};
  const spec = Object.hasOwn(FORMS, kind) ? FORMS[kind] : null;
  if (!spec || !form || typeof form !== 'object') return res.status(400).json({ error: 'Requête invalide' });

  const clean = {};
  for (const [key, label, required, max] of spec.fields) {
    const value = String(form[key] ?? '').trim().slice(0, max);
    if (required && !value) return res.status(400).json({ error: `Champ manquant : ${label}` });
    clean[key] = value;
  }
  if (!EMAIL_RE.test(clean.email)) return res.status(400).json({ error: 'Adresse email invalide' });

  const rows = spec.fields.filter(([key]) => clean[key]);
  const text = rows.map(([key, label]) => `${label} : ${clean[key]}`).join('\n');
  const html = `<h2>${spec.title}</h2><table cellpadding="6" style="border-collapse:collapse">` +
    rows.map(([key, label]) =>
      `<tr><td style="vertical-align:top;color:#666"><b>${label}</b></td><td>${esc(clean[key]).replace(/\n/g, '<br>')}</td></tr>`
    ).join('') + '</table>';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'WatchRestore <onboarding@resend.dev>',
        to: [to],
        reply_to: oneLine(clean.email),
        subject: oneLine(`[WatchRestore] ${spec.subject(clean)}`).slice(0, 200),
        text: `${spec.title}\n\n${text}`,
        html
      })
    });
    if (!response.ok) {
      console.error('Erreur Resend', response.status, await response.text());
      return res.status(502).json({ error: 'L\'envoi a échoué, réessayez dans un instant.' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Erreur contact', error);
    return res.status(502).json({ error: 'L\'envoi a échoué, réessayez dans un instant.' });
  }
}
