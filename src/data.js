// ─── DATA ────────────────────────────────────────────────────
export const SUGGESTIONS = ["Rolex Submariner","Omega Constellation","Zenith El Primero","Longines Conquest","Jaeger-LeCoultre Memovox","IWC Mark XI","Tudor Prince","Heuer Carrera vintage"];

export const MVT_SUGGESTIONS = [
  { ref:"ETA 2824-2", label:"ETA 2824-2", hint:"Automatique 3Hz — Omega, Longines, Ball, Hamilton..." },
  { ref:"ETA 7750", label:"Valjoux 7750", hint:"Chronographe automatique — TAG Heuer, Breitling, IWC..." },
  { ref:"ETA 2892", label:"ETA 2892-A2", hint:"Automatique ultra-plat — Omega, Baume & Mercier..." },
  { ref:"Cal. 1570", label:"Cal. 1570 Rolex", hint:"Automatique — Rolex Oysterdate, Datejust années 60-70" },
  { ref:"Cal. 321", label:"Cal. 321 Omega", hint:"Chronographe manuel — Speedmaster Apollo, rare" },
  { ref:"AS 1977", label:"AS 1977", hint:"Automatique — Tissot, Certina, Technos..." },
  { ref:"FE 7001", label:"FE 7001 / ETA 7001", hint:"Manuel ultra-plat — IWC, Baume & Mercier, Ebel..." },
  { ref:"Cal. 3135", label:"Cal. 3135 Rolex", hint:"Automatique — Submariner, Datejust, Day-Date" },
  { ref:"Peseux 7001", label:"Peseux 7001", hint:"Manuel ultra-plat — vintage Omega, Patek, JLC" },
  { ref:"Unitas 6497", label:"Unitas 6497", hint:"Manuel gousset/poche — IWC Portugaise, Panerai..." },
];

export const MVT_INFO = {
  "ETA 2824-2": "Mouvement automatique suisse produit depuis 1982 par ETA SA (groupe Swatch). L'un des calibres les plus répandus au monde — équipait Omega, Longines, Hamilton, Ball, et des centaines de marques sous licence. Pièces très disponibles, révision accessible.",
  "ETA 7750": "Calibre chronographe automatique à roue à colonnes, référence absolue de l'industrie depuis 1974. Équipe TAG Heuer Carrera, Breitling, IWC, Zenith et de nombreuses montres sportives vintage. Robuste et réparable.",
  "ETA 2892": "Automatique ultra-plat (3,6mm) haute qualité — base de nombreux mouvements Omega Co-Axial et modules complications. Finitions supérieures à l'ETA 2824, côté davantage par les collectionneurs.",
  "Cal. 1570": "Calibre automatique Rolex produit de 1965 à 1977, issu du célèbre Cal. 1520. Équipait les Oysterdate, Datejust et GMT des années 60-70. Pièces détachées encore disponibles, très apprécié des restaurateurs.",
  "Cal. 321": "Calibre chronographe manuel Lemania/Omega, équipant les Speedmaster portées lors des missions Apollo. L'un des calibres les plus recherchés et les plus valorisés au monde. Extrêmement rare à trouver à restaurer.",
  "AS 1977": "Calibre automatique A. Schild très répandu dans les années 60-70. Équipait Tissot, Certina, Technos, Doxa et de nombreuses marques mid-range. Pièces parfois difficiles à trouver.",
  "FE 7001": "Calibre manuel ultra-plat Frédéric Piguet, également connu sous la référence ETA 7001. Équipait IWC, Baume & Mercier, Ebel dans les années 80-90. Très délicat à manipuler.",
  "Cal. 3135": "Calibre automatique Rolex produit depuis 1988, considéré comme l'un des plus fiables au monde. Équipe Submariner, Datejust, Day-Date. Révision recommandée tous les 10 ans.",
  "Peseux 7001": "Calibre manuel ultra-plat de haute horlogerie, base de nombreux mouvements Omega, Patek Philippe et JLC vintage. Rare, délicat, très recherché des collectionneurs.",
  "Unitas 6497": "Grand calibre manuel dérivé des mouvements de poche, emblématique de l'IWC Portugaise et du Panerai Luminor. Robuste, très accessible à réviser, idéal pour débuter la restauration.",
};
export const FILTERS = ["tous","cosmétique","modérée","complète","majeure"];
export const SORTS = [
  { key:"default", label:"Par défaut" },
  { key:"gain_desc", label:"Meilleur Gain" },
  { key:"price_asc", label:"Prix ↑" },
  { key:"price_desc", label:"Prix ↓" },
];
export const LEVEL_MAP = {
  "cosmétique":{ cls:"lvl-cosmetic", bar:"bar-cosmetic", label:"Restauration cosmétique" },
  "modérée":   { cls:"lvl-moderee",  bar:"bar-moderee",  label:"Restauration modérée"   },
  "complète":  { cls:"lvl-complete", bar:"bar-complete", label:"Restauration complète"   },
  "majeure":   { cls:"lvl-majeure",  bar:"bar-majeure",  label:"Restauration majeure"    },
};
export function getMeta(l="") { return LEVEL_MAP[l.toLowerCase().trim()] || LEVEL_MAP["complète"]; }
export function parseNum(v) { if(typeof v==="number")return v; return parseFloat(String(v||"").replace(/[^\d.,]/g,"").replace(",","."))||0; }

export const SYSTEM_PROMPT = `Tu es un expert en restauration horlogère. Trouve EXCLUSIVEMENT des montres à restaurer : défectueuses, "pour pièces", non fonctionnelles, épaves, "spares or repair", "as found".

Recherche sur : eBay ("for parts or not working"), Le Bon Coin ("pour pièces"), Chrono24, Catawiki, Delcampe, Vinted.
Requêtes : "[modèle] pour pièces", "[modèle] spares repair", "[modèle] restauration", "[modèle] non fonctionnel", "[modèle] as found".

Niveaux : "cosmétique" / "modérée" / "complète" / "majeure"

Si la recherche porte sur un numéro/type de mouvement (ex: ETA 2824, Cal. 1570, Valjoux 7750), recherche des montres ÉQUIPÉES de ce mouvement qui sont à restaurer. Précise le mouvement concerné dans chaque annonce.

Réponds UNIQUEMENT avec ce JSON strict (sans backticks) :
{
  "synthesis": "Analyse marché restauration : épaves disponibles, prix, valeur après restauration, pièces rares, conseils",
  "listings": [{
    "source":"Site","title":"Titre","price":"Prix","price_num":450,
    "restoration_level":"complète","description":"État précis",
    "works_needed":["Travail 1","Travail 2"],
    "restoration_cost_num":280,"restoration_cost":"280 €",
    "market_value_num":1200,"market_value":"1 200 €",
    "url":"URL ou N/A"
  }]
}`;
