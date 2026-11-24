// Appelle le proxy /api/anthropic et renvoie le texte de la réponse.
// Lève une Error au message lisible en cas d'échec.
export async function askClaude(body) {
  let res;
  try {
    res = await fetch("/api/anthropic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-5-5", ...body })
    });
  } catch (e) {
    throw new Error("Connexion impossible. Vérifiez votre réseau et réessayez.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Erreur API: ${res.status}${data.error ? ` — ${data.error.message || data.error}` : ""}`);
  }
  if (!Array.isArray(data.content)) throw new Error("Réponse inattendue du service.");
  return data.content.filter(b => b.type === "text").map(b => b.text).join("");
}

// Envoie un formulaire du site (dépôt d'annonce ou Espace Pro) à l'équipe par e-mail.
export async function sendForm(kind, form) {
  let res;
  try {
    res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, form })
    });
  } catch (e) {
    throw new Error("Connexion impossible. Vérifiez votre réseau et réessayez.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
}
