// ─── LIENS DE RECHERCHE DIRECTE ──────────────────────────────
// Ouvre la recherche correspondante sur chaque site d'annonces.
const SITES = [
  ["eBay",         q => `https://www.ebay.fr/sch/i.html?_nkw=${q}&LH_ItemCondition=7000`],
  ["Le Bon Coin",  q => `https://www.leboncoin.fr/recherche?text=${q}%20pour%20pi%C3%A8ces`],
  ["Chrono24",     q => `https://www.chrono24.fr/search/index.htm?query=${q}`],
  ["Catawiki",     q => `https://www.catawiki.com/fr/s?q=${q}`],
  ["Vinted",       q => `https://www.vinted.fr/catalog?search_text=${q}`],
];

export function DirectLinks({ query, empty }) {
  if (!query) return null;
  const q = encodeURIComponent(query.trim());
  return (
    <div style={{margin:"24px 0",padding:"18px 22px",border:"1px solid #221e14",background:"#0b0b08"}}>
      <div style={{fontSize:10,letterSpacing:"0.1em",color:"#7a6a50",lineHeight:1.7,marginBottom:12}}>
        {empty
          ? "Aucune annonce vérifiable n'a été trouvée pour cette recherche. Consultez directement les sites :"
          : "Poursuivre la recherche directement sur les sites :"}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {SITES.map(([name, url]) => (
          <a key={name} className="card-link" href={url(q)} target="_blank" rel="noopener noreferrer"
            style={{padding:"8px 14px",border:"1px solid #2a2018"}}>
            {name} →
          </a>
        ))}
      </div>
    </div>
  );
}
