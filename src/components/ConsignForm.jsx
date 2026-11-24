import { useState } from "react";
import { StockEvaluator } from "./StockEvaluator";
import { sendForm } from "../api";

// ─── CONSIGNMENT FORM ────────────────────────────────────────
export function ConsignForm() {
  const [sent, setSent] = useState(false);
  const [evaluated, setEvaluated] = useState(false);
  const [form, setForm] = useState({
    name:"", company:"", email:"", phone:"", siret:"",
    activity:"horloger", stock_qty:"", models:"", avg_condition:"complète",
    storage_location:"", has_photos:"non", message:""
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const missing = [["name","nom"],["email","email"],["phone","téléphone"],["stock_qty","nombre de montres"],["models","modèles"]]
    .filter(([k]) => !String(form[k]).trim()).map(([,label]) => label);

  const submit = async () => {
    if (sending) return;
    if (missing.length) { setSendError(`Champs obligatoires manquants : ${missing.join(", ")}.`); return; }
    setSending(true); setSendError(null);
    try {
      await sendForm("consign", form);
      setSent(true);
    } catch(e) { setSendError(e.message); }
    finally { setSending(false); }
  };

  if (sent) return (
    <div className="form-success">
      <div className="form-success-icon">◈</div>
      <p className="form-success-msg">
        Votre stock a bien été soumis à notre équipe.<br/>
        Un expert WatchRestore vous contacte sous <strong style={{color:"#c86030",fontWeight:400}}>48h ouvrées</strong> pour finaliser l'évaluation et lancer la mise en vente.
      </p>
    </div>
  );

  return (
    <div>
      {/* How it works */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",background:"#161410",border:"1px solid #161410",marginBottom:28}}>
        {[
          ["01","Soumettez","Décrivez votre stock en 2 minutes via ce formulaire."],
          ["02","On évalue","Notre IA calcule le potentiel de revente de votre stock instantanément."],
          ["03","On vend","Vos montres sont publiées auprès de notre réseau d'acheteurs qualifiés."],
          ["04","Vous encaissez","Prix de vente moins 15% de commission. Zéro frais à l'avance."],
        ].map(([n,t,b]) => (
          <div key={n} style={{background:"#0b0b08",padding:"20px 18px"}}>
            <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:32,fontWeight:300,color:"#1e1810",marginBottom:8}}>{n}</div>
            <div style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"#c86030",marginBottom:6}}>{t}</div>
            <div style={{fontSize:10,lineHeight:1.65,color:"#3a3020"}}>{b}</div>
          </div>
        ))}
      </div>

      {/* Commission banner */}
      <div style={{border:"1px solid #3a2818",background:"#100c06",padding:"20px 28px",marginBottom:28,display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
        <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:56,fontWeight:300,color:"#c86030",lineHeight:1,flexShrink:0}}>15%</div>
        <div style={{fontSize:11,lineHeight:1.85,color:"#5a4a30"}}>
          <strong style={{color:"#8a7a50",fontWeight:400}}>Commission uniquement sur les ventes réalisées.</strong><br/>
          Aucun frais à l'avance. Aucun abonnement requis. Vous ne payez que quand votre montre est vendue.
          Idéal pour les horlogers, brocanteurs et gestionnaires de succession qui souhaitent écouler un stock sans effort commercial.
        </div>
      </div>

      {/* Form */}
      <div className="pro-form">
        <div className="form-grid">
          <div className="form-field"><label className="form-label">Nom / Prénom *</label><input className="form-input" placeholder="Jean Dupont" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
          <div className="form-field"><label className="form-label">Société / Raison sociale</label><input className="form-input" placeholder="Atelier Dupont SARL" value={form.company} onChange={e=>set("company",e.target.value)}/></div>
          <div className="form-field"><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="contact@exemple.fr" value={form.email} onChange={e=>set("email",e.target.value)}/></div>
          <div className="form-field"><label className="form-label">Téléphone *</label><input className="form-input" placeholder="+33 6 00 00 00 00" value={form.phone} onChange={e=>set("phone",e.target.value)}/></div>
          <div className="form-field"><label className="form-label">N° SIRET (optionnel)</label><input className="form-input" placeholder="123 456 789 00012" value={form.siret} onChange={e=>set("siret",e.target.value)}/></div>
          <div className="form-field"><label className="form-label">Type d'activité</label>
            <select className="form-select" value={form.activity} onChange={e=>set("activity",e.target.value)}>
              <option value="horloger">Horloger / Réparateur</option>
              <option value="brocanteur">Brocanteur / Antiquaire</option>
              <option value="succession">Gestion de succession / Notaire</option>
              <option value="revendeur">Revendeur de montres</option>
              <option value="collectionneur">Collectionneur particulier</option>
              <option value="autre">Autre professionnel</option>
            </select>
          </div>
          <div className="form-field"><label className="form-label">Nombre de montres *</label><input className="form-input" type="number" min="1" placeholder="ex: 8" value={form.stock_qty} onChange={e=>set("stock_qty",e.target.value)}/></div>
          <div className="form-field"><label className="form-label">État général du stock</label>
            <select className="form-select" value={form.avg_condition} onChange={e=>set("avg_condition",e.target.value)}>
              <option value="mixte">Mixte (plusieurs niveaux)</option>
              <option value="cosmétique">Majoritairement cosmétique — fonctionnelles</option>
              <option value="modérée">Majoritairement modérée — révision nécessaire</option>
              <option value="complète">Majoritairement complète — révision totale</option>
              <option value="majeure">Majoritairement majeure — pièces manquantes / HS</option>
            </select>
          </div>
          <div className="form-field full"><label className="form-label">Modèles concernés *</label>
            <textarea className="form-textarea" style={{minHeight:64}} placeholder="ex: Omega Constellation années 60 (x3), Longines automatique non fonctionnel (x2), Zenith El Primero cadran abîmé (x1)..." value={form.models} onChange={e=>set("models",e.target.value)}/>
          </div>
          <div className="form-field"><label className="form-label">Lieu de stockage</label><input className="form-input" placeholder="Ville, département" value={form.storage_location} onChange={e=>set("storage_location",e.target.value)}/></div>
          <div className="form-field"><label className="form-label">Photos disponibles ?</label>
            <select className="form-select" value={form.has_photos} onChange={e=>set("has_photos",e.target.value)}>
              <option value="oui">Oui, je peux en fournir</option>
              <option value="non">Non, pas encore</option>
              <option value="partiel">Partiellement</option>
            </select>
          </div>
          <div className="form-field full"><label className="form-label">Informations complémentaires</label>
            <textarea className="form-textarea" placeholder="Prix souhaité, contraintes de temps, informations sur la provenance du stock..." value={form.message} onChange={e=>set("message",e.target.value)}/>
          </div>
        </div>

        {/* AI Evaluation preview */}
        {form.models && form.stock_qty && !evaluated && (
          <div style={{marginBottom:16,padding:"14px 16px",border:"1px dashed #2a2010",background:"#0c0a06",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <span style={{fontSize:10,letterSpacing:"0.1em",color:"#5a4a30"}}>◈ Estimation IA disponible pour votre stock</span>
            <button onClick={()=>setEvaluated(true)} style={{padding:"8px 18px",background:"transparent",border:"1px solid #c86030",color:"#c86030",fontFamily:"DM Mono, monospace",fontSize:9,letterSpacing:"0.25em",textTransform:"uppercase",cursor:"pointer"}}>
              Calculer le potentiel →
            </button>
          </div>
        )}

        {evaluated && <StockEvaluator models={form.models} qty={form.stock_qty} condition={form.avg_condition}/>}

        <button className="form-submit" style={{marginTop:16,opacity:sending?0.4:1}} onClick={submit}>
          {sending ? "Envoi en cours..." : "Confier mon stock à WatchRestore"}
        </button>
        {sendError && (
          <div style={{marginTop:12,padding:"10px 14px",border:"1px solid #3a1410",background:"#0e0604",fontSize:10,letterSpacing:"0.1em",color:"#8a4030",lineHeight:1.6}}>
            ⚠ {sendError}
          </div>
        )}
        <p style={{fontSize:9,letterSpacing:"0.1em",color:"#2a2018",marginTop:10,textAlign:"center",lineHeight:1.6}}>
          En soumettant ce formulaire, vous acceptez que WatchRestore évalue votre stock et vous contacte pour vous proposer des conditions de revente. Aucun engagement de votre part.
        </p>
      </div>

      {/* Guarantees */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1px",background:"#161410",border:"1px solid #161410",marginTop:32}}>
        {[
          ["◎","Zéro risque financier","Vous ne payez rien à l'avance. La commission de 15% est prélevée uniquement sur les ventes réalisées."],
          ["◈","Acheteurs qualifiés","Votre stock est présenté exclusivement à des restaurateurs actifs, pas à un public généraliste."],
          ["◇","Transparence totale","Vous êtes informé à chaque vente avec le détail du prix, de la commission et du montant reversé."],
        ].map(([icon,title,body]) => (
          <div key={title} style={{background:"#0b0b08",padding:"22px 20px"}}>
            <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:24,color:"#c86030",marginBottom:10}}>{icon}</div>
            <div style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"#d8c8a0",marginBottom:7}}>{title}</div>
            <div style={{fontSize:10,lineHeight:1.7,color:"#3a3020"}}>{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
