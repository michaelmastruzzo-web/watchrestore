import { parseNum } from "../data";

// ─── Gain PANEL ───────────────────────────────────────────────
export function RoiPanel({ item }) {
  const buy=parseNum(item.price_num||item.price), resto=parseNum(item.restoration_cost_num||item.restoration_cost), mval=parseNum(item.market_value_num||item.market_value);
  const total=buy+resto, margin=mval-total, gain=total>0?Math.round((margin/total)*100):0;
  const fmt=(n)=>n>0?`${n.toLocaleString("fr-FR")} €`:"—";
  const gainClass=gain>=30?"positive":gain>=0?"neutral":"negative";
  const barPct=Math.min(100,Math.max(0,((gain+50)/250)*100));
  const barClass=gain>=30?"fill-good":gain>=0?"fill-mid":"fill-low";
  return (
    <div className="gain-panel">
      <div className="gain-grid">
        {[["Prix d'achat",fmt(buy),"épave",""],["Coût restauration",item.restoration_cost||fmt(resto),"estimé IA","neutral"],["Valeur marché",item.market_value||fmt(mval),"après restauration",""],["Gain potentiel",`${gain>=0?"+":""}${gain} %`,`marge : ${fmt(margin)}`,gainClass]].map(([lbl,val,sub,cls],i)=>(
          <div className="gain-cell" key={i}>
            <div className="gain-cell-label">{lbl}</div>
            <div className={`gain-cell-value ${cls}`}>{val}</div>
            <div className="gain-cell-sub">{sub}</div>
          </div>
        ))}
      </div>
      <div className="gain-bar-wrap">
        <div className="gain-bar-label"><span>Rentabilité estimée</span><span>Investissement total : {fmt(total)}</span></div>
        <div className="gain-bar-track"><div className={`gain-bar-fill ${barClass}`} style={{width:`${barPct}%`}}/></div>
      </div>
    </div>
  );
}
