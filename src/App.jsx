import { useState, useRef, useEffect } from "react";
import { askClaude } from "./api";
import { css } from "./styles";
import { SUGGESTIONS, MVT_SUGGESTIONS, MVT_INFO, FILTERS, SORTS, getMeta, parseNum, SYSTEM_PROMPT } from "./data";
import { RoiPanel } from "./components/RoiPanel";
import { ConsignForm } from "./components/ConsignForm";
import { PriceChart } from "./components/PriceChart";
import { DepositForm } from "./components/DepositForm";
import { WatchLogo } from "./components/WatchLogo";

// ─── MAIN APP ────────────────────────────────────────────────
export default function WatchRestorer() {
  const [page,setPage]=useState("home");
  const [query,setQuery]=useState("");
  const [loading,setLoading]=useState(false);
  const [status,setStatus]=useState("");
  const [results,setResults]=useState(null);
  const [error,setError]=useState(null);
  const [filter,setFilter]=useState("tous");
  const [sort,setSort]=useState("default");
  const [openRoi,setOpenRoi]=useState({});
  const [searchMode,setSearchMode]=useState("model");
  const [selectedMvt,setSelectedMvt]=useState(null);
  const inputRef=useRef();

  useEffect(()=>{
    const el=document.createElement("style");
    el.textContent=css; document.head.appendChild(el);
    return()=>document.head.removeChild(el);
  },[]);

  const goSearch=()=>{ setPage("search"); setTimeout(()=>inputRef.current?.focus(),100); };

  const search=async(sq)=>{
    const q=sq||query; if(!q.trim())return;
    setLoading(true); setError(null); setResults(null); setOpenRoi({});
    setFilter("tous"); setSort("default");
    setStatus("Recherche d'annonces en ligne (jusqu'à une minute)...");
    try {
      const text=await askClaude({ max_tokens:2000, system:SYSTEM_PROMPT,
        messages:[{role:"user",content:searchMode==="movement" ? `Trouve des montres À RESTAURER équipées du mouvement ${q}. Cherche sur le web de vraies annonces en ligne et indique pour chacune son prix, le coût de restauration estimé, la valeur marché et le gain potentiel.` : `Trouve des montres À RESTAURER pour : ${q}. Cherche sur le web de vraies annonces en ligne et indique pour chacune son prix, le coût de restauration estimé, la valeur marché et le gain potentiel.`}]
      });
      setStatus("Calcul des Gain...");
      const match=text.match(/\{[\s\S]*"listings"[\s\S]*\}/);
      if(!match)throw new Error("Format inattendu");
      setResults(JSON.parse(match[0]));
    } catch(e){ setError(e.message||"Erreur."); }
    finally{ setLoading(false); setStatus(""); }
  };

  const listings=results?.listings||[];
  const filtered=filter==="tous"?listings:listings.filter(i=>i.restoration_level?.toLowerCase().trim()===filter);
  const sorted=[...filtered].sort((a,b)=>{
    if(sort==="gain_desc"){ const r=x=>{const t=parseNum(x.price_num||x.price)+parseNum(x.restoration_cost_num||x.restoration_cost),m=parseNum(x.market_value_num||x.market_value);return t>0?(m-t)/t*100:0;}; return r(b)-r(a); }
    if(sort==="price_asc") return parseNum(a.price_num||a.price)-parseNum(b.price_num||b.price);
    if(sort==="price_desc") return parseNum(b.price_num||b.price)-parseNum(a.price_num||a.price);
    return 0;
  });

  return (
    <div className="app">
      <div className="noise"/>

      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-logo" onClick={()=>setPage("home")}>
          <WatchLogo size={44} animated={true}/>
              Watch<em>Restore</em>
        </div>
        <div className="topbar-nav">
          <button className={`nav-btn ${page==="home"?"active":""}`} onClick={()=>setPage("home")}>Accueil</button>
          <button className={`nav-btn ${page==="search"?"active":""}`} onClick={()=>setPage("search")}>Recherche</button>
          <button className={`nav-btn ${page==="pricing"?"active":""}`} onClick={()=>setPage("pricing")}>Tarifs</button>
          <button className={`nav-btn ${page==="pro"?"active":""}`} onClick={()=>setPage("pro")}>Espace Pro</button>
          <button className={`nav-btn ${page==="deposit"?"active":""}`} onClick={()=>setPage("deposit")}>Déposer une annonce</button>
          <button className="nav-cta" onClick={goSearch}>Lancer une recherche</button>
        </div>
      </div>

      <div className="page">

      {/* ══ HOME ══ */}
      {page==="home" && <>
        <div className="hero">
          <div className="hero-stripe"/>

          {/* Hero photo background */}
          <div style={{
            position:"absolute",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none",
          }}>
            <img
              src="https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=1600&q=80&auto=format&fit=crop"
              alt="Mouvement horloger démonté"
              style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",opacity:0.12,filter:"grayscale(30%) sepia(20%)"}}
            />
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, #080808 0%, transparent 30%, transparent 70%, #080808 100%)"}}/>
          </div>

          {/* WatchLogo hero mark */}
          <div style={{marginBottom:28,position:"relative",zIndex:1}}>
            <WatchLogo size={110} animated={true}/>
          </div>

          <div className="hero-kicker" style={{position:"relative",zIndex:1}}>Le moteur de recherche horloger</div>
          <h1 className="hero-h1" style={{position:"relative",zIndex:1}}>Trouvez vos<br/><em>projets de restauration</em></h1>
          <p className="hero-sub">Le premier site dédié aux montres à restaurer. Annonces en temps réel, Analyse du Gain potentiel automatique — et une démarche éco-responsable : chaque montre restaurée, c'est des pièces de seconde main qui retrouvent vie.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={goSearch}>Rechercher une montre</button>
            <button className="btn-secondary" onClick={()=>setPage("pro")}>Confier mon stock →</button>
            <button className="btn-secondary" onClick={()=>setPage("deposit")}>Déposer une annonce</button>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:32}}>
            {["♻ Upcycling horloger","◉ Pièces de seconde main","⬡ Faible empreinte carbone"].map(b=>(
              <span key={b} className="eco-badge"><span className="eco-badge-dot"/>{b}</span>
            ))}
          </div>
          <div className="stats-row">
            <div className="stat-cell"><div className="stat-num">12+</div><div className="stat-lbl">Sources agrégées</div></div>
            <div className="stat-cell"><div className="stat-num">AI</div><div className="stat-lbl">Analyse Gain en temps réel</div></div>
            <div className="stat-cell"><div className="stat-num">4</div><div className="stat-lbl">Niveaux de restauration</div></div>
          </div>
        </div>

        {/* VALUE PROPS */}
        <div className="section">
          <div className="section-kicker">Pourquoi WatchRestore</div>
          <div className="section-title">Un outil pensé pour<br/><em>restaurateurs & collectionneurs</em></div>
          <div className="props-grid">
            {[
              ["◎","Comparateur multi-sources","eBay, Le Bon Coin, Chrono24, Catawiki, Delcampe, forums — toutes les offres comparables en un coup d'œil. Fini les 7 onglets ouverts en parallèle : un seul résultat, toutes les sources."],
              ["◈","Gain calculé automatiquement","Prix d'achat, coût de restauration estimé par IA, valeur marché après remise en état. Évaluez la rentabilité d'un projet en un coup d'œil."],
              ["◇","Classement par niveau","Cosmétique, modérée, complète ou majeure : chaque annonce est analysée et classée pour cibler précisément les projets qui correspondent à votre niveau et budget."],
            ].map(([icon,title,body])=>(
              <div className="prop-cell" key={title}>
                <div className="prop-icon">{icon}</div>
                <div className="prop-title">{title}</div>
                <div className="prop-body">{body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="section" style={{paddingTop:0}}>
          <div className="section-kicker">Comment ça marche</div>
          <div className="section-title">En 4 étapes,<br/><em>trouvez votre prochain projet</em></div>
          <div className="steps">
            {[
              ["01","Lancez la comparaison","Entrez un modèle ou un calibre. Notre moteur interroge simultanément eBay, Le Bon Coin, Chrono24, Catawiki et les forums — en une seule requête."],
              ["02","Les offres sont comparées","Chaque annonce est classifiée par état, source et prix. Vous obtenez un comparatif clair plutôt qu'une liste brute à trier manuellement."],
              ["03","Consultez le Gain","Prix d'achat + coût restauration vs valeur marché finale : toutes les données financières sont calculées pour vous."],
              ["04","Accédez à l'annonce","Cliquez directement vers l'annonce originale pour contacter le vendeur et saisir l'opportunité."],
            ].map(([n,t,b])=>(
              <div className="step" key={n}>
                <div className="step-num">{n}</div>
                <div className="step-title">{t}</div>
                <div className="step-body">{b}</div>
              </div>
            ))}
          </div>
        </div>


        {/* ECO SECTION */}
        <div className="eco-section">
          <div className="eco-inner">
            <div className="eco-kicker">Démarche éco-responsable</div>
            <div className="eco-title">L'horlogerie circulaire,<br/><em>notre raison d'être</em></div>
            <p className="eco-intro">
              Des milliers de montres dorment dans les ateliers d'horlogers, des boîtes à chaussures et des successions. Leurs pièces — mouvements, cadrans, aiguilles, boîtiers — sont en parfait état mais inutilisées. WatchRestore donne une seconde vie à ces composants en les connectant aux restaurateurs qui en ont besoin. Moins de déchets, moins de production neuve, plus de patrimoine préservé.
            </p>

            <div className="eco-stats">
              {[
                ["−90%","Empreinte carbone","par rapport à la fabrication d'une montre neuve équivalente. Restaurer, c'est presque toujours la solution la plus écologique."],
                ["∞","Durabilité","Une montre mécanique bien entretenue peut fonctionner des générations. Le meilleur produit durable est celui qui existe déjà."],
                ["0","Déchet supplémentaire","Les pièces de rechange stockées chez les horlogers sont réutilisées directement. Aucune extraction de matière première nécessaire."],
              ].map(([n,l,b])=>(
                <div className="eco-stat" key={l}>
                  <div className="eco-stat-num">{n}</div>
                  <div className="eco-stat-label">{l}</div>
                  <div className="eco-stat-body">{b}</div>
                </div>
              ))}
            </div>

            <div className="eco-pillars">
              {[
                ["◎","Réutilisation des pièces de seconde main","Les horlogers accumulent des pièces détachées — mouvements récupérés, cadrans déposés, boîtiers inutilisés. Ces composants ont déjà été extraits, usinés et transportés. Les réutiliser évite de produire l'équivalent neuf, et tout le coût carbone que cela implique."],
                ["◈","Upcycling vs fast fashion horlogère","L'industrie horlogère produit des millions de montres chaque année. Restaurer une pièce existante — même abîmée — a une empreinte carbone infiniment plus faible qu'acheter une montre neuve équivalente, y compris bas de gamme."],
                ["◇","Circuit court et économie locale","WatchRestore favorise les échanges entre professionnels locaux : un horloger parisien cède ses pièces à un restaurateur lyonnais. Pas de container maritime, pas de logistique internationale. Un réseau humain et de proximité."],
                ["◉","Préservation du patrimoine horloger","Chaque montre restaurée est une pièce du patrimoine industriel et artisanal sauvée. Les mouvements mécaniques suisses, français ou allemands des années 50-80 sont des chefs-d'œuvre de précision qui méritent de survivre."],
              ].map(([icon,title,body])=>(
                <div className="eco-pillar" key={title}>
                  <div className="eco-pillar-icon">{icon}</div>
                  <div className="eco-pillar-title">{title}</div>
                  <div className="eco-pillar-body">{body}</div>
                </div>
              ))}
            </div>

            <div className="eco-commitment">
              <p className="eco-commitment-body">
                "Chaque montre que nous aidons à restaurer représente une victoire contre l'obsolescence programmée. WatchRestore n'est pas seulement un moteur de recherche — c'est un engagement pour que les savoir-faire horlogers et les matières premières déjà extraites trouvent une utilité durable, plutôt que de finir dans une poubelle ou un tigainr oublié."
              </p>
            </div>
          </div>
        </div>


        {/* ══ FRANCO-SWISS ══ */}
        <div className="fs-section">
          <div className="fs-inner">
            <div style={{textAlign:"center",marginBottom:32}}>
              <div style={{fontSize:9,letterSpacing:"0.45em",textTransform:"uppercase",color:"#4a6030",marginBottom:12}}>Ancrage géographique</div>
              <div style={{fontFamily:"Cormorant Garamond, serif",fontSize:"clamp(26px,4vw,44px)",fontWeight:300,color:"#c0d0a0",lineHeight:1.1,marginBottom:12}}>
                France <em style={{fontStyle:"italic",color:"#6a9a40",fontSize:"1.2em"}}>🤝</em> Suisse<br/>
                <em style={{fontStyle:"italic",color:"#6a9a40",fontSize:"0.85em"}}>L'horlogerie sans frontières</em>
              </div>
            </div>

            <div className="fs-grid">
              <div className="fs-cell">
                <div className="fs-flag">🇫🇷</div>
                <div className="fs-country">France</div>
                <div className="fs-title">Un site 100% français</div>
                <div className="fs-body">WatchRestore est né en France, pour la communauté française des restaurateurs et collectionneurs. Interface en français, vendeurs français, pièces disponibles en France métropolitaine. Pas de barrière de langue, pas de frais douaniers.</div>
              </div>
              <div className="fs-cell">
                <div className="fs-flag">🇨🇭</div>
                <div className="fs-country">Suisse · Swiss Made</div>
                <div className="fs-title">La tradition horlogère suisse</div>
                <div className="fs-body">La Suisse reste la référence mondiale de la haute horlogerie. Les calibres ETA, les manufactures de la Vallée de Joux, les mouvements Swiss Made — WatchRestore intègre cette tradition en référençant les pièces et mouvements issus de ce savoir-faire unique.</div>
              </div>
            </div>

            <div className="fs-divider">
              <div className="fs-divider-text">
                "La frontière franco-suisse est la plus belle route<br/>de l'horlogerie mondiale"
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1px",background:"#0e140e",border:"1px solid #0e140e"}}>
              {[
                ["🇫🇷","Communauté","Réseau de restaurateurs et collectionneurs français actifs"],
                ["🇨🇭","Références","Mouvements Swiss Made indexés : ETA, Peseux, AS, Unitas..."],
                ["🤝","Proximité","Transactions franco-suisses facilitées, même fuseau horaire"],
              ].map(([flag,title,body])=>(
                <div key={title} style={{background:"#080a08",padding:"22px 20px"}}>
                  <div style={{fontSize:20,marginBottom:10}}>{flag}</div>
                  <div style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"#4a6030",marginBottom:7}}>{title}</div>
                  <div style={{fontSize:10,lineHeight:1.7,color:"#2a3a20"}}>{body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AUDIENCE */}
        <div style={{paddingTop:0,position:"relative",overflow:"hidden"}}>
          {/* Watch dial watermark */}
          <div style={{position:"absolute",inset:0,zIndex:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
            <svg width="600" height="600" viewBox="0 0 200 200" fill="none" style={{opacity:0.20}}>
              <circle cx="100" cy="100" r="90" stroke="#c86030" strokeWidth="1.5"/>
              <circle cx="100" cy="100" r="75" stroke="#c86030" strokeWidth="0.5" opacity="0.5"/>
              <circle cx="100" cy="100" r="60" stroke="#c86030" strokeWidth="0.3" opacity="0.3"/>
              {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{
                const a=(i*30-90)*Math.PI/180, r1=78, r2=i%3===0?65:72;
                return <line key={i} x1={100+r1*Math.cos(a)} y1={100+r1*Math.sin(a)} x2={100+r2*Math.cos(a)} y2={100+r2*Math.sin(a)} stroke="#c86030" strokeWidth={i%3===0?2:1}/>;
              })}
              <line x1="100" y1="100" x2={100+55*Math.cos((10*30-90)*Math.PI/180)} y2={100+55*Math.sin((10*30-90)*Math.PI/180)} stroke="#c86030" strokeWidth="3" strokeLinecap="round"/>
              <line x1="100" y1="100" x2={100+68*Math.cos((2*30-90)*Math.PI/180)} y2={100+68*Math.sin((2*30-90)*Math.PI/180)} stroke="#c86030" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="100" cy="100" r="4" fill="#c86030"/>
            </svg>
          </div>
          <div className="section" style={{paddingTop:0,position:"relative",zIndex:1}}>
          <div className="section-kicker">Pour qui ?</div>
          <div className="section-title">Deux profils,<br/><em>une même plateforme</em></div>
          <div className="audience-grid">
            <div className="audience-cell">
              <span className="audience-tag buyer">Acheteur / Restaurateur</span>
              <div className="audience-title" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontWeight:300}}>Vous cherchez votre prochain projet</div>
              <div className="audience-body" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontWeight:300,fontSize:14,lineHeight:1.9}}>Passionné, horloger amateur ou professionnel, vous cherchez des épaves à remettre en état. WatchRestore agrège toutes les opportunités et calcule automatiquement si elles valent l'investissement.</div>
              <ul className="audience-list" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontWeight:300,fontSize:14}}>
                <li>Recherche multi-plateformes en temps réel</li>
                <li>Analyse Gain automatique par annonce</li>
                <li>Filtres par niveau de restauration requis</li>
                <li>Tri par meilleure rentabilité</li>
              </ul>
            </div>
            <div className="audience-cell">
              <span className="audience-tag pro">Professionnel / Vendeur</span>
              <div className="audience-title" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontWeight:300}}>Vous souhaitez écouler votre stock</div>
              <div className="audience-body" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontWeight:300,fontSize:14,lineHeight:1.9}}>Horloger, brocanteur, succession ou revendeur, vous disposez de montres à restaurer et cherchez des acheteurs qualifiés. Déposez vos annonces directement auprès d'une communauté de restaurateurs actifs.</div>
              <ul className="audience-list" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontWeight:300,fontSize:14}}>
                <li>Dépôt d'annonce en quelques minutes</li>
                <li>Visibilité auprès d'acheteurs spécialisés</li>
                <li>Abonnement mensuel à partir de 49€</li>
                <li>Mise en avant dans les résultats de recherche</li>
              </ul>
            </div>
          </div>
        </div>
          </div>

        <div style={{textAlign:"center",padding:"20px 0 80px"}}>
          <button className="btn-primary" onClick={goSearch}>Commencer gratuitement</button>
        </div>
      </>}

      {/* ══ SEARCH ══ */}
      {page==="search" && (
        <div className="search-page">
          <div style={{marginBottom:32}}>
            <div className="section-kicker">Moteur de recherche · Comparateur multi-sources</div>
            <div className="section-title" style={{marginBottom:0}}>Comparez toutes les offres,<em>en une seule recherche</em></div>
          </div>
          <div style={{marginBottom:28,padding:"16px 20px",border:"1px solid #1a1610",background:"#0b0b08",display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {["eBay","Le Bon Coin","Chrono24","Catawiki","Delcampe","Vinted"].map(s=>(
                <span key={s} style={{fontSize:8,letterSpacing:"0.2em",textTransform:"uppercase",padding:"3px 9px",border:"1px solid #1a1610",color:"#4a3e28",background:"#080808"}}>{s}</span>
              ))}
            </div>
            <div style={{fontSize:11,letterSpacing:"0.06em",color:"#4a3e28",lineHeight:1.8,flex:1,minWidth:200}}>
              Une seule recherche, <strong style={{color:"#8a7a50",fontWeight:400}}>toutes les plateformes simultanément</strong>. Comparez les prix, les états et les vendeurs sans ouvrir 7 onglets. Gagnez des heures de recherche.
            </div>
          </div>
          <div className="search-wrap">
            {/* Mode toggle */}
            <div className="search-mode-row">
              <button className={`mode-btn ${searchMode==="model"?"active":""}`} onClick={()=>{setSearchMode("model");setQuery("");setSelectedMvt(null);}}>
                ◎ Par modèle <span className="mode-badge">Marque / Référence</span>
              </button>
              <button className={`mode-btn ${searchMode==="movement"?"active":""}`} onClick={()=>{setSearchMode("movement");setQuery("");setSelectedMvt(null);}}>
                ◈ Par mouvement <span className="mode-badge">Calibre / Numéro</span>
              </button>
            </div>

            {/* Search box */}
            <div className="search-box">
              <input ref={inputRef} className="search-input"
                placeholder={searchMode==="model" ? "ex: Omega Constellation, Rolex Submariner..." : "ex: ETA 2824-2, Cal. 1570, Valjoux 7750..."}
                value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}/>
              <button className="search-btn" onClick={()=>search()} disabled={loading||!query.trim()}>
                {loading?"···":"Rechercher"}
              </button>
            </div>

            {/* Movement info panel */}
            {searchMode==="movement" && selectedMvt && MVT_INFO[selectedMvt] && (
              <div className="mvt-panel">
                <span className="mvt-panel-label">Info calibre</span>
                <div style={{flex:1}}>
                  <div className="mvt-info">{MVT_INFO[selectedMvt]}</div>
                  <div className="mvt-tags">
                    {MVT_SUGGESTIONS.find(m=>m.ref===selectedMvt)?.hint.split(" — ")[1]?.split(", ").map(t=>(
                      <span key={t} className="mvt-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div className="quick-searches">
              {searchMode==="model"
                ? SUGGESTIONS.map(s=><button key={s} className="qs-btn" onClick={()=>{setQuery(s);search(s);}}>{s}</button>)
                : MVT_SUGGESTIONS.map(m=>(
                    <button key={m.ref} className="qs-btn" title={m.hint}
                      onClick={()=>{setQuery(m.ref);setSelectedMvt(m.ref);search(m.ref);}}>
                      {m.label}
                    </button>
                  ))
              }
            </div>
          </div>

          {loading && <div className="status-bar"><div className="dot-pulse"/><span className="status-txt">{status}</span></div>}
          {error && <div className="error">⚠ {error}</div>}

          {results && <>
            {results.synthesis && <div className="synthesis"><span className="synthesis-label">Comparatif marché · Analyse IA</span><p className="synthesis-body">{results.synthesis}</p></div>}
            <PriceChart listings={listings}/>
            <div className="filter-bar">
              <span className="filter-label">Niveau</span>
              {FILTERS.map(f=><button key={f} className={`filter-btn ${filter===f?"active":""}`} onClick={()=>setFilter(f)}>{f==="tous"?"Tous":f}</button>)}
              <span className="filter-sep"/>
              <span className="filter-label">Trier</span>
              {SORTS.map(s=><button key={s.key} className={`filter-btn ${sort===s.key?"active":""}`} onClick={()=>setSort(s.key)}>{s.label}</button>)}
            </div>
            <div className="results-header">
              <span className="results-title">Comparatif des offres disponibles</span>
              <span className="results-meta">{sorted.length} / {listings.length} annonces</span>
            </div>
            {sorted.map((item,i)=>{
              const meta=getMeta(item.restoration_level), gainOpen=!!openRoi[i];
              return (
                <div className="card" key={i} style={{animationDelay:`${i*0.07}s`}}>
                  <div className={`card-bar ${meta.bar}`}/>
                  <div className="card-main">
                    <div className="card-row1">
                      <div className="card-left">
                        <span className="source-tag">{item.source}</span>
                        <span className={`resto-level ${meta.cls}`}><span className="rdot"/>{meta.label}</span>
                      </div>
                      <span className="card-price">{item.price}</span>
                    </div>
                    <div className="card-title">{item.title}</div>
                    <div className="card-desc">{item.description}</div>
                    {item.works_needed?.length>0 && <div className="card-works"><div className="works-label">Travaux nécessaires</div><div className="works-list">{item.works_needed.map((w,wi)=><span key={wi} className="work-item">{w}</span>)}</div></div>}
                    <div className="card-footer">
                      {item.url&&item.url!=="N/A"?<a className="card-link" href={item.url} target="_blank" rel="noopener noreferrer">Voir l'annonce →</a>:<span/>}
                      <button className="gain-toggle" onClick={()=>setOpenRoi(s=>({...s,[i]:!s[i]}))}>
                        <span className={`chevron ${gainOpen?"open":""}`}>▶</span>
                        Comparaison avant / après
                      </button>
                    </div>
                  </div>
                  {gainOpen && <RoiPanel item={item}/>}
                </div>
              );
            })}
          </>}

          {!loading&&!results&&!error && <div className="empty"><div className="empty-glyph">◌</div><p className="empty-msg">Recherchez un modèle pour trouver des projets de restauration</p></div>}
        </div>
      )}

      {/* ══ PRICING ══ */}
      {page==="pricing" && (
        <div className="section" style={{paddingTop:100}}>
          <div className="section-kicker">Tarifs</div>
          <div className="section-title">Choisissez votre<em>formule</em></div>
          <div className="pricing-grid">
            <div className="plan">
              <div className="plan-name">Gratuit</div>
              <div className="plan-price">0<span>€</span></div>
              <div className="plan-period">Pour toujours</div>
              <div className="plan-divider"/>
              <ul className="plan-features">
                <li className="on">3 recherches par jour</li>
                <li className="on">Résultats limités à 3 annonces</li>
                <li className="on">Synthèse marché de base</li>
                <li>Gain non disponible</li>
                <li>Tri et filtres non disponibles</li>
                <li>Alertes non disponibles</li>
              </ul>
              <button className="plan-btn" onClick={goSearch}>Commencer</button>
            </div>
            <div className="plan featured">
              <div className="plan-badge">Populaire</div>
              <div className="plan-name">Premium</div>
              <div className="plan-price">12<span>€/mois</span></div>
              <div className="plan-period">Ou 99€/an · économisez 45€</div>
              <div className="plan-divider"/>
              <ul className="plan-features">
                <li className="on">Recherches illimitées</li>
                <li className="on">Toutes les annonces disponibles</li>
                <li className="on">Analyse Gain complète</li>
                <li className="on">Tri, filtres avancés</li>
                <li className="on">Alertes sur un modèle</li>
                <li className="on">Export des résultats</li>
              </ul>
              <button className="plan-btn" onClick={()=>setPage("pro")}>S'abonner</button>
            </div>
            <div className="plan">
              <div className="plan-name">Professionnel</div>
              <div className="plan-price">49<span>€/mois</span></div>
              <div className="plan-period">Engagement 3 mois minimum</div>
              <div className="plan-divider"/>
              <ul className="plan-features">
                <li className="on">Tout le plan Premium</li>
                <li className="on">Dépôt d'annonces illimité</li>
                <li className="on">Mise en avant dans les résultats</li>
                <li className="on">Badge "Vendeur Pro" vérifié</li>
                <li className="on">Statistiques de visibilité</li>
                <li className="on">Support prioritaire</li>
              </ul>
              <button className="plan-btn" onClick={()=>setPage("pro")}>Contacter</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ PRO ══ */}
      {page==="pro" && (
        <div className="section" style={{paddingTop:100}}>
          <div className="section-kicker">Espace Professionnel</div>
          <div className="section-title">Confiez-nous votre stock,<em>on s'occupe de tout</em></div>
          <p style={{fontSize:12,letterSpacing:"0.06em",color:"#5a5040",lineHeight:1.85,marginBottom:44,maxWidth:620}}>
            Vous êtes horloger, brocanteur, antiquaire ou gérez une succession avec des montres à vendre ?
            WatchRestore calcule instantanément le potentiel de revente de votre stock et le diffuse auprès de notre réseau d'acheteurs restaurateurs. Commission de 15% sur les ventes. Aucun frais à l'avance.
          </p>
          <ConsignForm/>
        </div>
      )}

      {/* ══ DEPOSIT ══ */}
      {page==="deposit" && (
        <div className="section" style={{paddingTop:100}}>
          <div className="section-kicker">Particuliers · Gratuit</div>
          <div className="section-title">Publiez votre annonce,<em>contribuez à l'upcycling</em></div>
          <p style={{fontSize:12,letterSpacing:"0.06em",color:"#5a5040",lineHeight:1.85,marginBottom:44,maxWidth:620}}>
            Vous avez une montre à restaurer, des pièces détachées ou un lot à vendre ? Publiez gratuitement en 3 minutes. Votre annonce est validée automatiquement par notre IA et visible immédiatement par notre communauté de restaurateurs.
          </p>
          <DepositForm/>
        </div>
      )}



      </div>

      <div className="footer">
        <div className="footer-logo" style={{display:"flex",alignItems:"center",gap:8}}>
          <WatchLogo size={26} animated={false}/>
          Watch<em>Restore</em>
        </div>
        <div style={{display:"flex",gap:20}}>
          {["home","search","deposit","pricing","pro"].map(p=>(
            <button key={p} className="nav-btn" onClick={()=>setPage(p)} style={{padding:"4px 0"}}>
              {p==="home"?"Accueil":p==="search"?"Recherche":p==="deposit"?"Déposer":p==="pricing"?"Tarifs":"Espace Pro"}
            </button>
          ))}
        </div>
        <div className="footer-copy">© 2026 WatchRestore · Tous droits réservés</div>
      </div>
    </div>
  );
}
