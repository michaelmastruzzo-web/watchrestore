import { useState, useRef, useEffect } from "react";
import { askClaude } from "../api";

// ─── STOCK EVALUATOR (AI-powered) ──────────────────────────
export function StockEvaluator({ models, qty, condition }) {
  const [eval_result, setEvalResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const evaluate = async () => {
    if (!models || !qty) return;
    setLoading(true);
    setError(null);
    try {
      const text = await askClaude({
        max_tokens: 500,
        messages: [{
          role: "user",
            content: `Tu es un expert en valorisation de montres d'occasion et à restaurer. Évalue ce stock professionnel et réponds UNIQUEMENT en JSON strict (sans backticks) :
Stock : ${qty} montre(s), modèles : ${models}, état général : ${condition}.
{
  "stock_value_low": 1200,
  "stock_value_high": 2800,
  "per_unit_low": 150,
  "per_unit_high": 350,
  "commission_low": 180,
  "commission_high": 420,
  "best_buyers": "Profil des acheteurs les plus susceptibles d'acheter ce stock",
  "avg_delay": "Délai moyen de vente estimé (ex: 2 à 6 semaines)",
  "tips": "Conseil court pour maximiser la valeur de revente de ce stock"
}`
        }]
      });
      const match = text.match(/\{[\s\S]*"stock_value_low"[\s\S]*\}/);
      if (!match) throw new Error("L'estimation n'a pas pu être lue.");
      setEvalResult(JSON.parse(match[0]));
    } catch(e) {
      console.error(e);
      setEvalResult(null);
      setError(e instanceof SyntaxError ? "L'estimation n'a pas pu être lue." : e.message);
    }
    finally { setLoading(false); }
  };

  const evaluateRef = useRef(evaluate);
  evaluateRef.current = evaluate;
  // Attend la fin de la saisie avant de relancer une estimation.
  useEffect(() => {
    if (!models || !qty) return;
    const timer = setTimeout(() => evaluateRef.current(), 900);
    return () => clearTimeout(timer);
  }, [models, qty]);

  if (loading) return (
    <div style={{padding:"20px",borderTop:"1px solid #161410",background:"#080806",display:"flex",alignItems:"center",gap:10}}>
      <div className="dot-pulse"/>
      <span style={{fontSize:10,letterSpacing:"0.18em",color:"#7a6a50",textTransform:"uppercase"}}>Évaluation IA en cours...</span>
    </div>
  );

  if (error) return (
    <div style={{padding:"16px 20px",borderTop:"1px solid #3a1410",background:"#0e0604",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
      <span style={{fontSize:10,letterSpacing:"0.1em",color:"#8a4030",lineHeight:1.6}}>⚠ Estimation indisponible — {error}</span>
      <button onClick={evaluate} style={{padding:"8px 14px",background:"transparent",border:"1px solid #3a1410",color:"#8a4030",fontFamily:"DM Mono, monospace",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer"}}>Réessayer</button>
    </div>
  );

  if (!eval_result) return null;

  const fmt = n => n ? `${Number(n).toLocaleString("fr-FR")} €` : "—";

  return (
    <div style={{borderTop:"1px solid #2a1e10",background:"#0a0806",padding:"24px 28px",marginTop:0}}>
      <div style={{fontSize:8,letterSpacing:"0.45em",textTransform:"uppercase",color:"#c86030",marginBottom:16}}>
        ◈ Estimation IA de votre stock
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1px",background:"#161410",border:"1px solid #161410",marginBottom:16}}>
        {[
          ["Valeur du stock", `${fmt(eval_result.stock_value_low)} – ${fmt(eval_result.stock_value_high)}`, "fourchette de revente"],
          ["Par unité", `${fmt(eval_result.per_unit_low)} – ${fmt(eval_result.per_unit_high)}`, "prix moyen estimé"],
          ["Votre gain net", `${fmt(eval_result.commission_low)} – ${fmt(eval_result.commission_high)}`, "après commission 15%"],
        ].map(([l,v,s]) => (
          <div key={l} style={{background:"#0b0b08",padding:"16px 14px"}}>
            <div style={{fontSize:7,letterSpacing:"0.35em",textTransform:"uppercase",color:"#3a3020",marginBottom:6}}>{l}</div>
            <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:18,fontWeight:300,color:"#c86030",lineHeight:1,marginBottom:4}}>{v}</div>
            <div style={{fontSize:9,color:"#4a3e28"}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[
          ["Profil acheteurs",eval_result.best_buyers],
          ["Délai estimé",eval_result.avg_delay],
        ].map(([l,v])=>(
          <div key={l} style={{background:"#0b0b08",border:"1px solid #161410",padding:"12px 14px"}}>
            <div style={{fontSize:7,letterSpacing:"0.3em",textTransform:"uppercase",color:"#3a3020",marginBottom:5}}>{l}</div>
            <div style={{fontSize:11,color:"#6a5a40",lineHeight:1.6}}>{v}</div>
          </div>
        ))}
      </div>
      {eval_result.tips && (
        <div style={{marginTop:10,padding:"12px 14px",borderLeft:"2px solid #c86030",background:"#0c0a06"}}>
          <div style={{fontSize:7,letterSpacing:"0.3em",textTransform:"uppercase",color:"#5a3a20",marginBottom:4}}>Conseil</div>
          <div style={{fontSize:11,color:"#6a5a40",lineHeight:1.6,fontStyle:"italic"}}>{eval_result.tips}</div>
        </div>
      )}
    </div>
  );
}
