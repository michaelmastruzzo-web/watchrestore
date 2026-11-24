import { useState, useRef, useEffect } from "react";
import { askClaude, sendForm } from "../api";

// ─── DEPOSIT LISTING FORM ────────────────────────────────────
const LISTING_TYPES = [
  { key:"watch",  icon:"◎", title:"Montre à restaurer", desc:"Épave, non fonctionnelle, pour pièces détachées ou projet de restauration." },
  { key:"parts",  icon:"◈", title:"Pièces détachées",   desc:"Mouvement isolé, cadran, aiguilles, boîtier, bracelet ou tout composant horloger." },
  { key:"lot",    icon:"◇", title:"Lot de montres",     desc:"Plusieurs montres vendues ensemble — succession, déstockage, collection." },
];

const CONDITIONS = [
  { value:"cosmétique", label:"Cosmétique — fonctionne, rayures/usures légères" },
  { value:"modérée",    label:"Modérée — révision nécessaire, quelques pièces" },
  { value:"complète",   label:"Complète — révision totale, cadran/aiguilles abîmés" },
  { value:"majeure",    label:"Majeure — pièces manquantes, oxydation, mouvement HS" },
];

const AI_VALIDATION_PROMPT = (type, model, desc, cond) => `Tu es le modérateur de WatchRestore, une plateforme dédiée aux montres à restaurer, aux pièces détachées et aux lots horlogers.
Analyse cette annonce et réponds UNIQUEMENT en JSON strict (sans backticks) :
Type : ${type} | Modèle : ${model} | Condition : ${cond} | Description : ${desc}

Vérifie :
1. "relevant" : l'annonce concerne bien une montre/mouvement/pièce horlogère (true/false)
2. "restorable" : il s'agit bien d'un article à restaurer, pour pièces, ou pièce détachée — PAS une montre neuve ou de luxe en parfait état (true/false)
3. "description_ok" : la description est suffisamment précise pour un acheteur (true/false)
4. "safe" : pas de contenu frauduleux, trompeur ou inapproprié (true/false)
5. "approved" : true si les 4 critères sont vrais
6. "feedback" : message court (1 phrase) pour l'utilisateur — encourageant si approuvé, correctif sinon
{
  "relevant": true,
  "restorable": true,
  "description_ok": true,
  "safe": true,
  "approved": true,
  "feedback": "Votre annonce est claire et bien ciblée — elle peut être envoyée."
}`;

function AiValidator({ type, model, description, condition, onResult }) {
  const [state, setState] = useState("idle"); // idle | checking | approved | rejected | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  useEffect(() => {
    // Toute modification de l'annonce annule la validation précédente.
    onResultRef.current(false);
    if (!model || !description || description.length < 20) { setState("idle"); return; }
    // Ignore la réponse d'une vérification devenue obsolète (saisie modifiée entre-temps).
    let cancelled = false;
    const timer = setTimeout(async () => {
      setState("checking");
      setResult(null);
      try {
        const text = await askClaude({
          max_tokens: 400,
          messages: [{ role: "user", content: AI_VALIDATION_PROMPT(type, model, description, condition) }]
        });
        if (cancelled) return;
        const match = text.match(/\{[\s\S]*"approved"[\s\S]*\}/);
        if (!match) throw new Error("La réponse de validation n'a pas pu être lue.");
        const parsed = JSON.parse(match[0]);
        setResult(parsed);
        setState(parsed.approved ? "approved" : "rejected");
        onResultRef.current(!!parsed.approved);
      } catch(e) {
        if (cancelled) return;
        setError(e instanceof SyntaxError ? "La réponse de validation n'a pas pu être lue." : e.message);
        setState("error");
      }
    }, 900);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [model, description, condition, type, attempt]);

  if (state === "idle") return null;

  const criteria = result ? [
    { label:"Horlogerie",    ok: result.relevant },
    { label:"À restaurer",   ok: result.restorable },
    { label:"Description",   ok: result.description_ok },
    { label:"Conformité",    ok: result.safe },
  ] : [];

  return (
    <div className={`ai-validation ${state==="error"?"rejected":state}`}>
      <div className="ai-val-row">
        <span className="ai-val-icon">{state==="checking"?"◌":state==="approved"?"◎":state==="error"?"⚠":"◈"}</span>
        <div>
          <div className={`ai-val-text ${state==="rejected"||state==="error"?"rejected":""}`}>
            {state==="checking" && "Validation IA en cours..."}
            {state==="approved" && (result?.feedback || "Annonce validée — prête à être publiée.")}
            {state==="rejected" && (result?.feedback || "Cette annonce ne correspond pas aux critères de WatchRestore.")}
            {state==="error" && `Validation indisponible — ${error}`}
          </div>
          {state==="error" && (
            <button onClick={()=>setAttempt(n=>n+1)} style={{marginTop:10,padding:"6px 12px",background:"transparent",border:"1px solid #3a1410",color:"#8a4030",fontFamily:"DM Mono, monospace",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer"}}>Réessayer</button>
          )}
          {criteria.length > 0 && (
            <div className="ai-criteria">
              {criteria.map(c => (
                <span key={c.label} className={`ai-criterion ${c.ok?"ok":"nok"}`}>
                  {c.ok?"✓":"✗"} {c.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DepositForm() {
  const [step, setStep]           = useState(1); // 1=type, 2=details, 3=contact
  const [published, setPublished] = useState(false);
  const [aiApproved, setAiApproved] = useState(false);
  const [ref] = useState("WR-" + Math.random().toString(36).substr(2,6).toUpperCase());
  const [form, setForm] = useState({
    type: "",
    model: "", movement: "", condition: "modérée",
    qty: "1", price: "", negotiable: "oui",
    description: "",
    name: "", email: "", phone: "", location: "",
    contact_pref: "email",
  });
  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const canPublish = form.name && form.email && form.location && !sending;

  const publish = async () => {
    if (!canPublish) return;
    setSending(true); setSendError(null);
    try {
      await sendForm("deposit", { ...form, ref });
      setPublished(true);
    } catch(e) { setSendError(e.message); }
    finally { setSending(false); }
  };

  if (published) return (
    <div className="publish-success">
      <div className="publish-success-icon">◎</div>
      <div className="publish-success-title">Annonce envoyée !</div>
      <div className="publish-ref">{ref}</div>
      <p className="publish-success-msg">
        Votre annonce a été validée par notre IA et transmise à l'équipe WatchRestore.
        Conservez votre référence <strong style={{color:"#c86030",fontWeight:400}}>{ref}</strong> pour toute question.
        Nous revenons vers vous à l'adresse <strong style={{color:"#c86030",fontWeight:400}}>{form.email}</strong>.
      </p>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"#3a3020",padding:"8px 14px",border:"1px solid #1a1610"}}>
          ♻ Merci de contribuer à l'upcycling horloger
        </span>
      </div>
    </div>
  );

  return (
    <div>
      {/* Step indicator */}
      <div style={{display:"flex",gap:0,marginBottom:32,border:"1px solid #1a1610"}}>
        {[["1","Type d'annonce"],["2","Détails"],["3","Contact & Publication"]].map(([n,label],i) => (
          <div key={n} style={{flex:1,padding:"12px 16px",background:step>i+1?"#0a0906":step===i+1?"#0f0c08":"transparent",borderRight:i<2?"1px solid #1a1610":"none",textAlign:"center"}}>
            <div style={{fontSize:8,letterSpacing:"0.3em",textTransform:"uppercase",color:step>=i+1?"#c86030":"#2a2018",marginBottom:3}}>{n}</div>
            <div style={{fontSize:9,letterSpacing:"0.1em",color:step>=i+1?"#6a5a40":"#1e1c14"}}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── STEP 1 : Type ── */}
      {step === 1 && (
        <div>
          <div style={{marginBottom:20,fontSize:11,letterSpacing:"0.08em",color:"#4a3e28",lineHeight:1.7}}>
            Choisissez le type d'annonce que vous souhaitez publier. La publication est <strong style={{color:"#8a7a50",fontWeight:400}}>entièrement gratuite</strong> et validée automatiquement par notre IA.
          </div>
          <div className="listing-type-grid">
            {LISTING_TYPES.map(t => (
              <button key={t.key} className={`listing-type-card ${form.type===t.key?"selected":""}`}
                onClick={() => set("type", t.key)}>
                <span className="listing-type-icon">{t.icon}</span>
                <div className="listing-type-title">{t.title}</div>
                <div className="listing-type-desc">{t.desc}</div>
              </button>
            ))}
          </div>
          <div style={{padding:"14px 18px",border:"1px solid #0e1a0e",background:"#060a06",marginBottom:20,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{color:"#4a8a30",fontSize:14,flexShrink:0}}>♻</span>
            <span style={{fontSize:10,letterSpacing:"0.06em",color:"#2a4020",lineHeight:1.7}}>
              En publiant sur WatchRestore, vous contribuez à l'économie circulaire horlogère. Chaque pièce vendue évite la production d'un composant neuf et réduit l'empreinte carbone de la restauration.
            </span>
          </div>
          <button className="form-submit" onClick={()=>form.type?setStep(2):null}
            style={{opacity:form.type?1:0.4,cursor:form.type?"pointer":"not-allowed"}}>
            Continuer →
          </button>
        </div>
      )}

      {/* ── STEP 2 : Details ── */}
      {step === 2 && (
        <div>
          <div className="pro-form">
            <div className="form-grid">
              <div className="form-field full">
                <label className="form-label">
                  {form.type==="parts" ? "Type de pièce / référence *" : form.type==="lot" ? "Description du lot *" : "Marque et modèle *"}
                </label>
                <input className="form-input"
                  placeholder={form.type==="parts" ? "ex: Mouvement ETA 2824-2, cadran Omega Constellation..." : form.type==="lot" ? "ex: Lot 5 montres automatiques années 70, Omega, Tissot, Longines..." : "ex: Omega Constellation Ref. 168.005, Rolex Datejust..."}
                  value={form.model} onChange={e=>set("model",e.target.value)}/>
              </div>
              {form.type !== "parts" && (
                <div className="form-field">
                  <label className="form-label">Numéro de mouvement / calibre</label>
                  <input className="form-input" placeholder="ex: ETA 2824, Cal. 1570, Valjoux 7750..."
                    value={form.movement} onChange={e=>set("movement",e.target.value)}/>
                </div>
              )}
              <div className="form-field">
                <label className="form-label">{form.type==="lot"?"Nombre de pièces *":"Quantité"}</label>
                <input className="form-input" type="number" min="1" value={form.qty} onChange={e=>set("qty",e.target.value)}/>
              </div>
              {form.type !== "parts" && (
                <div className="form-field full">
                  <label className="form-label">État général *</label>
                  <select className="form-select" value={form.condition} onChange={e=>set("condition",e.target.value)}>
                    {CONDITIONS.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              )}
              <div className="form-field">
                <label className="form-label">Prix demandé (€)</label>
                <input className="form-input" placeholder="ex: 120" value={form.price} onChange={e=>set("price",e.target.value)}/>
              </div>
              <div className="form-field">
                <label className="form-label">Prix négociable ?</label>
                <select className="form-select" value={form.negotiable} onChange={e=>set("negotiable",e.target.value)}>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                  <option value="échange">Échange possible</option>
                </select>
              </div>
              <div className="form-field full">
                <label className="form-label">Description détaillée *</label>
                <textarea className="form-textarea" style={{minHeight:100}}
                  placeholder={form.type==="parts"
                    ? "État de la pièce, provenance, dimensions si connues, référence exacte..."
                    : form.type==="lot"
                    ? "Contenu du lot, état général de chaque pièce, marques représentées, mouvements..."
                    : "État du boîtier, du cadran, des aiguilles, du mouvement. Ce qui fonctionne, ce qui ne fonctionne pas, pièces manquantes..."}
                  value={form.description} onChange={e=>set("description",e.target.value)}/>
              </div>
            </div>

            {/* AI Validation */}
            <AiValidator
              type={form.type} model={form.model}
              description={form.description} condition={form.condition}
              onResult={ok => setAiApproved(ok)}
            />

            {/* Preview */}
            {form.model && form.description.length > 20 && aiApproved && (
              <div className="listing-preview">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,gap:12}}>
                  <div>
                    <span style={{fontSize:8,letterSpacing:"0.3em",textTransform:"uppercase",color:"#4a3e28",padding:"2px 8px",border:"1px solid #1a1610",marginBottom:6,display:"inline-block"}}>
                      {LISTING_TYPES.find(t=>t.key===form.type)?.title}
                    </span>
                    <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:18,color:"#ece4d4",marginTop:6}}>{form.model}</div>
                  </div>
                  {form.price && <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:24,color:"#c86030",whiteSpace:"nowrap"}}>{form.price} €{form.negotiable==="oui"?" ·":"" }<span style={{fontSize:11,color:"#5a4a30"}}>{form.negotiable==="oui"?" négociable":""}</span></div>}
                </div>
                <div style={{fontSize:11,lineHeight:1.8,color:"#5a5040"}}>{form.description}</div>
                {form.movement && <div style={{marginTop:8,fontSize:9,color:"#4a3e28",letterSpacing:"0.1em"}}>Mouvement : {form.movement}</div>}
              </div>
            )}

            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button onClick={()=>setStep(1)} style={{padding:"12px 20px",background:"transparent",border:"1px solid #1a1610",color:"#3a3020",fontFamily:"DM Mono, monospace",fontSize:9,letterSpacing:"0.25em",textTransform:"uppercase",cursor:"pointer"}}>
                ← Retour
              </button>
              <button className="form-submit" style={{flex:1,opacity:aiApproved?1:0.4,cursor:aiApproved?"pointer":"not-allowed"}}
                onClick={()=>aiApproved?setStep(3):null}>
                Continuer →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3 : Contact ── */}
      {step === 3 && (
        <div>
          <div className="pro-form">
            <div style={{fontSize:10,letterSpacing:"0.08em",color:"#4a3e28",lineHeight:1.7,marginBottom:20}}>
              Vos coordonnées ne sont visibles que par les acheteurs qui vous contactent directement. Elles ne sont jamais revendues ni partagées publiquement.
            </div>
            <div className="form-grid">
              <div className="form-field"><label className="form-label">Prénom / Pseudo *</label><input className="form-input" placeholder="Jean ou Collectionneur75" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
              <div className="form-field"><label className="form-label">Ville / Région *</label><input className="form-input" placeholder="Paris, Lyon, Bordeaux..." value={form.location} onChange={e=>set("location",e.target.value)}/></div>
              <div className="form-field"><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="votre@email.fr" value={form.email} onChange={e=>set("email",e.target.value)}/></div>
              <div className="form-field"><label className="form-label">Téléphone (optionnel)</label><input className="form-input" placeholder="+33 6 00 00 00 00" value={form.phone} onChange={e=>set("phone",e.target.value)}/></div>
              <div className="form-field full"><label className="form-label">Préférence de contact</label>
                <select className="form-select" value={form.contact_pref} onChange={e=>set("contact_pref",e.target.value)}>
                  <option value="email">Email uniquement</option>
                  <option value="phone">Téléphone uniquement</option>
                  <option value="both">Email et téléphone</option>
                </select>
              </div>
            </div>

            <div style={{margin:"16px 0",padding:"12px 16px",border:"1px solid #0e1a0e",background:"#060a06",display:"flex",gap:8,alignItems:"flex-start"}}>
              <span style={{color:"#4a8a30",flexShrink:0}}>◎</span>
              <span style={{fontSize:9,letterSpacing:"0.1em",color:"#2a4020",lineHeight:1.7}}>
                Annonce gratuite · Validée par IA · Transmise à l'équipe · Référence : <strong style={{color:"#4a7030",fontWeight:400}}>{ref}</strong>
              </span>
            </div>

            <div style={{display:"flex",gap:10,marginTop:8}}>
              <button onClick={()=>setStep(2)} style={{padding:"12px 20px",background:"transparent",border:"1px solid #1a1610",color:"#3a3020",fontFamily:"DM Mono, monospace",fontSize:9,letterSpacing:"0.25em",textTransform:"uppercase",cursor:"pointer"}}>
                ← Retour
              </button>
              <button className="form-submit" style={{flex:1,opacity:canPublish?1:0.4,cursor:canPublish?"pointer":"not-allowed"}}
                onClick={publish}>
                {sending ? "Envoi en cours..." : "Publier mon annonce gratuitement"}
              </button>
            </div>
            {sendError && (
              <div style={{marginTop:12,padding:"10px 14px",border:"1px solid #3a1410",background:"#0e0604",fontSize:10,letterSpacing:"0.1em",color:"#8a4030",lineHeight:1.6}}>
                ⚠ L'annonce n'a pas été envoyée — {sendError}
              </div>
            )}
            <p style={{fontSize:9,letterSpacing:"0.08em",color:"#2a2018",marginTop:10,textAlign:"center",lineHeight:1.6}}>
              En publiant, vous acceptez les CGU de WatchRestore. Publication gratuite, retrait possible à tout moment sur demande.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
