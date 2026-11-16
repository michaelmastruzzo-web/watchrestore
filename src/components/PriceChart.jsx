import { useState, useEffect } from "react";
import { parseNum } from "../data";

// ─── PRICE COMPARISON CHART ──────────────────────────────────
export function PriceChart({ listings }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build per-source price data
  const sourceMap = {};
  listings.forEach(item => {
    const price = parseNum(item.price_num || item.price);
    if (!price) return;
    const src = item.source || "Autre";
    if (!sourceMap[src]) sourceMap[src] = [];
    sourceMap[src].push(price);
  });

  // Average per source
  const rows = Object.entries(sourceMap).map(([src, prices]) => ({
    source: src,
    avg: Math.round(prices.reduce((a,b) => a+b, 0) / prices.length),
    min: Math.min(...prices),
    max: Math.max(...prices),
    count: prices.length,
  })).sort((a,b) => a.avg - b.avg);

  if (rows.length < 2) return null;

  const maxPrice = Math.max(...rows.map(r => r.max));
  const minAvg   = Math.min(...rows.map(r => r.avg));
  const maxAvg   = Math.max(...rows.map(r => r.avg));
  const allPrices = listings.map(i => parseNum(i.price_num||i.price)).filter(Boolean);
  const globalMin = Math.min(...allPrices);
  const globalMax = Math.max(...allPrices);
  const globalAvg = Math.round(allPrices.reduce((a,b)=>a+b,0)/allPrices.length);
  const spread    = Math.round(((globalMax - globalMin) / globalMin) * 100);

  const getBarClass = (avg) => {
    if (avg === minAvg) return "best";
    if (avg === maxAvg) return "high";
    return "mid";
  };

  return (
    <div className="price-chart">
      {rows.map((row, i) => {
        const pct = animated ? Math.max(6, Math.round((row.avg / maxPrice) * 100)) : 0;
        const isBest = row.avg === minAvg;
        const isHigh = row.avg === maxAvg;
        return (
          <div className="chart-row" key={row.source}>
            <div className="chart-source" title={row.source}>{row.source}</div>
            <div className="chart-bar-wrap">
              <div className={`chart-bar-fill ${getBarClass(row.avg)}`} style={{width:`${pct}%`}}>
                {isBest && <span className="chart-badge best-price">Moins cher</span>}
                {isHigh && <span className="chart-badge highest">Plus cher</span>}
              </div>
            </div>
            <div className="chart-price">
              {row.avg.toLocaleString("fr-FR")} €
              {row.count > 1 && <span style={{fontSize:9,color:"#3a3020",display:"block"}}>moy. {row.count} ann.</span>}
            </div>
          </div>
        );
      })}

      <div className="chart-summary">
        <div className="chart-summary-cell">
          <div className="chart-summary-label">Prix le plus bas</div>
          <div className="chart-summary-value green">{globalMin.toLocaleString("fr-FR")} €</div>
        </div>
        <div className="chart-summary-cell">
          <div className="chart-summary-label">Prix moyen</div>
          <div className="chart-summary-value">{globalAvg.toLocaleString("fr-FR")} €</div>
        </div>
        <div className="chart-summary-cell">
          <div className="chart-summary-label">Écart max/min</div>
          <div className="chart-summary-value orange">+{spread} %</div>
        </div>
      </div>

      <div className="chart-legend">
        <div className="chart-legend-item"><div className="legend-dot" style={{background:"#4a8a30"}}/>Meilleur prix</div>
        <div className="chart-legend-item"><div className="legend-dot" style={{background:"#8a8a30"}}/>Prix moyen</div>
        <div className="chart-legend-item"><div className="legend-dot" style={{background:"#c86030"}}/>Prix élevé</div>
        <div className="chart-legend-item" style={{marginLeft:"auto",color:"#2a2818"}}>Prix moyens par source · {allPrices.length} annonce{allPrices.length>1?"s":""}</div>
      </div>
    </div>
  );
}
