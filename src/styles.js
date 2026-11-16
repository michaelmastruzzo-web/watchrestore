export const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');`;

export const css = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080808; color: #d8d0c0; font-family: 'DM Mono', monospace; min-height: 100vh; }
  .app { min-height: 100vh; background: #080808; }

  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.5;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  }


  /* LISTING FORM PAGE */
  .listing-type-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 28px; }
  .listing-type-card { border: 1px solid #1a1610; background: #0b0b08; padding: 20px 18px; cursor: pointer; transition: all 0.2s; text-align: left; font-family: 'DM Mono', monospace; }
  .listing-type-card:hover { border-color: #2a2018; }
  .listing-type-card.selected { border-color: #c86030; background: #100c06; }
  .listing-type-icon { font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #3a3020; margin-bottom: 10px; display: block; }
  .listing-type-card.selected .listing-type-icon { color: #c86030; }
  .listing-type-title { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #6a5a40; margin-bottom: 6px; }
  .listing-type-card.selected .listing-type-title { color: #c86030; }
  .listing-type-desc { font-size: 10px; line-height: 1.6; color: #3a3020; }

  .ai-validation { border: 1px solid #1a2410; background: #080d06; padding: 16px 20px; margin: 16px 0; }
  .ai-validation.checking { border-color: #2a3a18; animation: borderPulse 1.5s ease infinite; }
  .ai-validation.approved { border-color: #2a4a18; background: #080d06; }
  .ai-validation.rejected { border-color: #3a1410; background: #0e0604; }
  @keyframes borderPulse { 0%,100%{border-color:#1a2410;}50%{border-color:#4a7030;} }
  .ai-val-row { display: flex; align-items: center; gap: 10px; }
  .ai-val-icon { font-size: 16px; flex-shrink: 0; font-family: 'Cormorant Garamond', serif; }
  .ai-val-text { font-size: 10px; letter-spacing: 0.1em; color: #4a6a38; line-height: 1.6; }
  .ai-val-text.rejected { color: #8a4030; }
  .ai-criteria { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
  .ai-criterion { font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; padding: 2px 8px; border: 1px solid; }
  .ai-criterion.ok  { color: #4a8a30; border-color: #1a2e10; background: #060a04; }
  .ai-criterion.nok { color: #a04030; border-color: #2e1010; background: #0a0404; }
  .ai-criterion.pending { color: #3a3020; border-color: #1a1610; background: #0b0b08; }

  .listing-preview { border: 1px solid #221e14; background: #0d0c09; padding: 24px 28px; margin: 20px 0; position: relative; }
  .listing-preview::before { content: 'APERÇU DE VOTRE ANNONCE'; position: absolute; top: 0; left: 24px; transform: translateY(-50%); font-size: 8px; letter-spacing: 0.4em; color: #4a8a30; background: #0d0c09; padding: 0 8px; text-transform: uppercase; }

  .publish-success { text-align: center; padding: 60px 20px; }
  .publish-success-icon { font-family: 'Cormorant Garamond', serif; font-size: 64px; color: #6ab040; margin-bottom: 20px; }
  .publish-success-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: #ece4d4; margin-bottom: 12px; }
  .publish-success-msg { font-size: 11px; letter-spacing: 0.08em; color: #5a5040; line-height: 1.8; max-width: 480px; margin: 0 auto 28px; }
  .publish-ref { font-size: 9px; letter-spacing: 0.3em; color: #3a3020; padding: 8px 16px; border: 1px solid #1a1610; display: inline-block; margin-bottom: 24px; }


  /* PRICE COMPARISON CHART */
  .price-chart { border: 1px solid #1a1e10; background: #080b06; padding: 24px 28px; margin-bottom: 20px; position: relative; }
  .price-chart::before { content: 'COMPARATIF DES PRIX PAR SOURCE'; position: absolute; top: 0; left: 24px; transform: translateY(-50%); font-size: 8px; letter-spacing: 0.45em; text-transform: uppercase; color: #4a8a30; background: #080b06; padding: 0 8px; }
  .chart-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .chart-row:last-child { margin-bottom: 0; }
  .chart-source { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: #4a3e28; width: 90px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chart-bar-wrap { flex: 1; position: relative; height: 24px; background: #0d0c09; border: 1px solid #161410; }
  .chart-bar-fill { height: 100%; display: flex; align-items: center; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); position: relative; min-width: 2px; }
  .chart-bar-fill.best  { background: linear-gradient(90deg, #1a3a10, #4a8a30); }
  .chart-bar-fill.mid   { background: linear-gradient(90deg, #2a2a10, #8a8a30); }
  .chart-bar-fill.high  { background: linear-gradient(90deg, #3a1a10, #c86030); }
  .chart-price { font-family: 'Cormorant Garamond', serif; font-size: 14px; font-weight: 300; color: #c8b888; width: 80px; flex-shrink: 0; text-align: right; }
  .chart-badge { font-size: 7px; letter-spacing: 0.2em; text-transform: uppercase; padding: 1px 6px; border: 1px solid; position: absolute; right: 4px; top: 50%; transform: translateY(-50%); white-space: nowrap; }
  .chart-badge.best-price { color: #4a8a30; border-color: #1a2e10; background: #060a04; }
  .chart-badge.highest   { color: #c86030; border-color: #2a1408; background: #0a0502; }
  .chart-legend { display: flex; gap: 16px; margin-top: 14px; padding-top: 12px; border-top: 1px solid #161410; flex-wrap: wrap; }
  .chart-legend-item { display: flex; align-items: center; gap: 6px; font-size: 9px; letter-spacing: 0.1em; color: #3a3020; }
  .legend-dot { width: 8px; height: 8px; border-radius: 0; flex-shrink: 0; }
  .chart-summary { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #161410; border: 1px solid #161410; margin-top: 14px; }
  .chart-summary-cell { background: #0b0b08; padding: 12px 14px; }
  .chart-summary-label { font-size: 7px; letter-spacing: 0.3em; text-transform: uppercase; color: #2a2818; margin-bottom: 5px; }
  .chart-summary-value { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 300; color: #c8b080; line-height: 1; }
  .chart-summary-value.green { color: #6ab040; }
  .chart-summary-value.orange { color: #c86030; }


  /* LOGO & HERO VISUAL */
  .logo-mark {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Cormorant Garamond', serif;
  }
  .logo-svg { width: 32px; height: 32px; flex-shrink: 0; }
  .topbar-logo { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 300; color: #ece4d4; letter-spacing: 0.05em; cursor: pointer; display: flex; align-items: center; gap: 8px; }
  .topbar-logo em { font-style: italic; color: #c86030; }

  .hero-visual {
    width: 180px; height: 180px; margin: 0 auto 36px;
    position: relative; flex-shrink: 0;
  }
  .hero-visual svg { width: 100%; height: 100%; opacity: 0.85; }

  .franco-swiss {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 8px 18px; border: 1px solid #2a2018;
    background: #0d0c09; margin-bottom: 28px;
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: #6a5a40;
  }
  .franco-swiss .flag { font-size: 16px; }
  .franco-swiss .sep { color: #2a2018; }

  .origin-badge {
    display: flex; align-items: center; gap: 8px;
    font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
    color: #4a3a28; padding: 5px 12px;
    border: 1px solid #1a1610; background: #0b0b08;
  }
  .origin-dot { width: 5px; height: 5px; border-radius: 50%; background: #c86030; flex-shrink: 0; }

  /* FRANCO-SWISS SECTION */
  .fs-section { background: #080a08; border-top: 1px solid #0e140e; border-bottom: 1px solid #0e140e; padding: 60px 24px; }
  .fs-inner { max-width: 960px; margin: 0 auto; }
  .fs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #0e140e; border: 1px solid #0e140e; }
  .fs-cell { background: #080a08; padding: 32px 28px; }
  .fs-flag { font-size: 32px; margin-bottom: 14px; }
  .fs-country { font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase; color: #4a6030; margin-bottom: 10px; }
  .fs-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; color: #c0d0a0; margin-bottom: 10px; }
  .fs-body { font-size: 11px; line-height: 1.8; color: #3a4a28; }
  .fs-divider { display: flex; align-items: center; justify-content: center; padding: 32px 0; }
  .fs-divider-text { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; font-style: italic; color: #4a6030; text-align: center; }

  /* ECO / GREEN SECTION */
  .eco-section { background: #060a06; border-top: 1px solid #0e1a0e; border-bottom: 1px solid #0e1a0e; padding: 80px 24px; }
  .eco-inner { max-width: 960px; margin: 0 auto; }
  .eco-kicker { font-size: 9px; letter-spacing: 0.45em; text-transform: uppercase; color: #4a8a30; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  .eco-kicker::before { content: ''; display: block; width: 24px; height: 1px; background: #1a2e10; }
  .eco-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 4vw, 48px); font-weight: 300; color: #d0e8c0; line-height: 1.1; margin-bottom: 20px; }
  .eco-title em { font-style: italic; color: #6ab040; }
  .eco-intro { font-size: 12px; letter-spacing: 0.08em; color: #3a5030; line-height: 1.9; max-width: 620px; margin-bottom: 48px; }
  .eco-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #0e1a0e; border: 1px solid #0e1a0e; margin-bottom: 40px; }
  .eco-stat { background: #060a06; padding: 28px 24px; }
  .eco-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 44px; font-weight: 300; color: #6ab040; line-height: 1; margin-bottom: 6px; }
  .eco-stat-label { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: #2a4020; margin-bottom: 6px; }
  .eco-stat-body { font-size: 10px; line-height: 1.6; color: #2a3a20; }
  .eco-pillars { display: grid; grid-template-columns: repeat(2,1fr); gap: 1px; background: #0e1a0e; border: 1px solid #0e1a0e; margin-bottom: 40px; }
  .eco-pillar { background: #060a06; padding: 28px 26px; }
  .eco-pillar-icon { font-size: 22px; color: #4a8a30; font-family: 'Cormorant Garamond', serif; margin-bottom: 12px; }
  .eco-pillar-title { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #5a9040; margin-bottom: 10px; }
  .eco-pillar-body { font-size: 11px; line-height: 1.8; color: #2a3a20; }
  .eco-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1px solid #1a2e10; background: #080d08; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #4a7030; }
  .eco-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #6ab040; flex-shrink: 0; }
  .eco-commitment { border: 1px solid #0e1a0e; background: #080d08; padding: 28px 32px; margin-bottom: 0; position: relative; }
  .eco-commitment::before { content: 'NOTRE ENGAGEMENT'; position: absolute; top: 0; left: 28px; transform: translateY(-50%); font-size: 8px; letter-spacing: 0.45em; text-transform: uppercase; color: #4a8a30; background: #080d08; padding: 0 8px; }
  .eco-commitment-body { font-family: 'Cormorant Garamond', serif; font-size: 16px; line-height: 1.85; color: #4a6a38; font-weight: 300; font-style: italic; }

  .topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 52px;
    background: rgba(8,8,8,0.92); backdrop-filter: blur(12px);
    border-bottom: 1px solid #161410;
  }
  .topbar-logo {
    font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 300;
    color: #ece4d4; letter-spacing: 0.05em; cursor: pointer;
  }
  .topbar-logo em { font-style: italic; color: #c86030; }
  .topbar-nav { display: flex; gap: 4px; }
  .nav-btn {
    font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 7px 14px; border: none; background: transparent;
    color: #4a3e28; cursor: pointer; font-family: 'DM Mono', monospace;
    transition: color 0.2s;
  }
  .nav-btn:hover, .nav-btn.active { color: #c86030; }
  .nav-cta {
    font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 7px 16px; border: 1px solid #c86030; background: transparent;
    color: #c86030; cursor: pointer; font-family: 'DM Mono', monospace;
    transition: all 0.2s; margin-left: 8px;
  }
  .nav-cta:hover { background: #c86030; color: #080808; }

  /* ── PAGES ── */
  .page { position: relative; z-index: 1; }

  /* ── LANDING ── */
  .hero {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 100px 24px 60px;
    position: relative; overflow: hidden;
  }
  .hero-stripe {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, #c86030, transparent);
  }
  .hero-kicker {
    font-size: 9px; letter-spacing: 0.5em; text-transform: uppercase;
    color: #c86030; margin-bottom: 28px;
    display: flex; align-items: center; gap: 14px;
  }
  .hero-kicker::before, .hero-kicker::after { content: ''; display: block; width: 40px; height: 1px; background: #2a2018; }
  .hero-h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(52px, 9vw, 110px);
    font-weight: 300; line-height: 0.88; color: #ece4d4;
    margin-bottom: 28px; letter-spacing: -0.02em;
  }
  .hero-h1 em { font-style: italic; color: #c86030; display: block; }
  .hero-sub {
    font-size: 12px; letter-spacing: 0.12em; color: #5a5040;
    max-width: 520px; line-height: 1.9; margin-bottom: 44px;
    text-transform: uppercase;
  }
  .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 72px; position: relative; z-index: 1; }
  .btn-primary {
    padding: 16px 36px; background: #c86030; border: none;
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 0.35em; text-transform: uppercase; color: #080808;
    cursor: pointer; transition: background 0.2s;
  }
  .btn-primary:hover { background: #e07040; }
  .btn-secondary {
    padding: 16px 36px; background: transparent;
    border: 1px solid #2a2018;
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 0.35em; text-transform: uppercase; color: #6a5a40;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: #c86030; color: #c86030; }

  /* STATS ROW */
  .stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px; background: #161410; border: 1px solid #161410;
    width: 100%; max-width: 640px;
  }
  .stat-cell { background: #0b0b08; padding: 22px 20px; text-align: center; }
  .stat-num {
    font-family: 'Cormorant Garamond', serif; font-size: 36px;
    font-weight: 300; color: #c86030; line-height: 1;
  }
  .stat-lbl { font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase; color: #3a3020; margin-top: 6px; }

  /* VALUE PROPS */
  .section { padding: 80px 24px; max-width: 960px; margin: 0 auto; }
  .section-kicker { font-size: 9px; letter-spacing: 0.45em; text-transform: uppercase; color: #c86030; margin-bottom: 16px; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 4vw, 48px); font-weight: 300; color: #ece4d4; line-height: 1.1; margin-bottom: 48px; }
  .section-title em { font-style: italic; color: #c86030; }

  .props-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #161410; border: 1px solid #161410; }
  .prop-cell { background: #0b0b08; padding: 28px 24px; }
  .prop-icon { font-size: 22px; margin-bottom: 14px; color: #c86030; font-family: 'Cormorant Garamond', serif; }
  .prop-title { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #d8c8a0; margin-bottom: 10px; }
  .prop-body { font-size: 11px; line-height: 1.8; color: #4a3e28; }

  /* HOW IT WORKS */
  .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 0; }
  .step { position: relative; padding: 24px; border: 1px solid #161410; background: #0b0b08; }
  .step-num { font-family: 'Cormorant Garamond', serif; font-size: 48px; font-weight: 300; color: #1e1810; line-height: 1; margin-bottom: 12px; }
  .step-title { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #c86030; margin-bottom: 8px; }
  .step-body { font-size: 11px; line-height: 1.7; color: #4a3e28; }

  /* AUDIENCE */
  .audience-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; background: transparent; border: none; }
  .audience-cell { background: transparent; padding: 36px 32px; border-right: 1px solid rgba(200,96,48,0.2); } .audience-cell:last-child { border-right: none; }
  .audience-tag { font-size: 8px; letter-spacing: 0.4em; text-transform: uppercase; padding: 4px 10px; border: 1px solid; display: inline-block; margin-bottom: 20px; }
  .audience-tag.buyer { color: #6a9a40; border-color: #1e2e10; background: #0a0e06; }
  .audience-tag.pro   { color: #c86030; border-color: #301408; background: #100804; }
  .audience-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 300; color: #ece4d4; margin-bottom: 14px; }
  .audience-body { font-size: 12px; line-height: 1.8; color: #4a3e28; margin-bottom: 20px; font-family: 'Cormorant Garamond', serif; font-weight: 300; letter-spacing: 0.02em; }
  .audience-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .audience-list li { font-size: 10px; letter-spacing: 0.05em; color: #5a5040; display: flex; align-items: flex-start; gap: 8px; }
  .audience-list li::before { content: '—'; color: #c86030; flex-shrink: 0; }

  /* PRICING */
  .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #161410; border: 1px solid #161410; }
  .plan { background: #0b0b08; padding: 32px 28px; position: relative; }
  .plan.featured { background: #0f0c08; border: 1px solid #c86030; margin: -1px; z-index: 1; }
  .plan-badge { position: absolute; top: -1px; left: 50%; transform: translateX(-50%); font-size: 8px; letter-spacing: 0.35em; text-transform: uppercase; color: #080808; background: #c86030; padding: 4px 14px; white-space: nowrap; }
  .plan-name { font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase; color: #5a4a30; margin-bottom: 16px; }
  .plan-price { font-family: 'Cormorant Garamond', serif; font-size: 42px; font-weight: 300; color: #ece4d4; line-height: 1; margin-bottom: 4px; }
  .plan-price span { font-size: 16px; color: #5a4a30; }
  .plan-period { font-size: 9px; letter-spacing: 0.2em; color: #3a3020; margin-bottom: 24px; text-transform: uppercase; }
  .plan-divider { height: 1px; background: #161410; margin-bottom: 24px; }
  .plan-features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
  .plan-features li { font-size: 10px; letter-spacing: 0.05em; color: #5a5040; display: flex; gap: 8px; align-items: flex-start; }
  .plan-features li.on { color: #8a7a60; }
  .plan-features li::before { content: '·'; color: #3a3020; flex-shrink: 0; }
  .plan-features li.on::before { content: '✓'; color: #c86030; }
  .plan-btn { width: 100%; padding: 12px; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; border: 1px solid #2a2018; background: transparent; color: #5a4a30; }
  .plan-btn:hover { border-color: #c86030; color: #c86030; }
  .plan.featured .plan-btn { background: #c86030; border-color: #c86030; color: #080808; }
  .plan.featured .plan-btn:hover { background: #e07040; }

  /* PRO DEPOSIT FORM */
  .pro-form { border: 1px solid #221e14; background: #0b0b08; padding: 40px; position: relative; }
  .pro-form::before { content: 'ESPACE PROFESSIONNEL'; position: absolute; top: 0; left: 32px; transform: translateY(-50%); font-size: 8px; letter-spacing: 0.45em; text-transform: uppercase; color: #c86030; background: #0b0b08; padding: 0 10px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .form-field { display: flex; flex-direction: column; gap: 6px; }
  .form-field.full { grid-column: 1 / -1; }
  .form-label { font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase; color: #3a3020; }
  .form-input, .form-select, .form-textarea {
    padding: 12px 14px; background: #0d0c09; border: 1px solid #1e1c14;
    color: #d8d0c0; font-family: 'DM Mono', monospace; font-size: 12px;
    outline: none; transition: border-color 0.2s; width: 100%;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #c86030; }
  .form-select option { background: #0d0c09; }
  .form-textarea { resize: vertical; min-height: 80px; }
  .form-submit {
    width: 100%; padding: 15px; background: #c86030; border: none;
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.35em;
    text-transform: uppercase; color: #080808; cursor: pointer; transition: background 0.2s;
    margin-top: 8px;
  }
  .form-submit:hover { background: #e07040; }
  .form-success { text-align: center; padding: 40px; }
  .form-success-icon { font-family: 'Cormorant Garamond', serif; font-size: 48px; color: #c86030; margin-bottom: 16px; }
  .form-success-msg { font-size: 11px; letter-spacing: 0.1em; color: #5a5040; line-height: 1.8; }


  /* SEARCH MODE TOGGLE */
  .search-mode-row { display: flex; gap: 0; margin-bottom: 14px; border: 1px solid #1e1c14; align-self: flex-start; }
  .mode-btn { padding: 9px 18px; background: transparent; border: none; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: #3a3020; cursor: pointer; transition: all 0.2s; border-right: 1px solid #1e1c14; }
  .mode-btn:last-child { border-right: none; }
  .mode-btn:hover { color: #7a6a50; }
  .mode-btn.active { background: #0f0c08; color: #c86030; }
  .mode-badge { display: inline-block; font-size: 7px; padding: 1px 5px; background: #1a0e06; border: 1px solid #2a1808; color: #6a4020; margin-left: 5px; letter-spacing: 0.1em; vertical-align: middle; }

  /* MOVEMENT INFO PANEL */
  .mvt-panel { border: 1px solid #1a2410; background: #080d06; padding: 16px 20px; margin-bottom: 14px; display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
  .mvt-panel-label { font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase; color: #3a5020; flex-shrink: 0; margin-top: 2px; }
  .mvt-info { font-size: 11px; line-height: 1.7; color: #3a5028; font-family: 'Cormorant Garamond', serif; font-style: italic; flex: 1; }
  .mvt-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
  .mvt-tag { font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; padding: 2px 8px; background: #080d06; border: 1px solid #1a2410; color: #3a5020; }

  /* SEARCH PAGE */
  .search-page { padding: 80px 24px; max-width: 900px; margin: 0 auto; }
  .search-wrap { margin-bottom: 40px; }
  .search-box { display: flex; border: 1px solid #221e14; background: #0d0c09; transition: border-color 0.3s; }
  .search-box:focus-within { border-color: #c86030; }
  .search-input { flex: 1; padding: 18px 22px; background: transparent; border: none; outline: none; font-family: 'DM Mono', monospace; font-size: 13px; color: #d8d0c0; letter-spacing: 0.04em; }
  .search-input::placeholder { color: #2e2a20; }
  .search-btn { padding: 18px 28px; border: none; cursor: pointer; background: #c86030; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.35em; text-transform: uppercase; color: #080808; transition: background 0.2s; white-space: nowrap; }
  .search-btn:hover:not(:disabled) { background: #e07040; }
  .search-btn:disabled { background: #2a2218; color: #1a1810; cursor: not-allowed; }
  .quick-searches { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 11px; }
  .qs-btn { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: #3a3428; padding: 4px 11px; border: 1px solid #161410; background: transparent; cursor: pointer; transition: all 0.2s; font-family: 'DM Mono', monospace; }
  .qs-btn:hover { color: #7a6a50; border-color: #2e2818; }

  /* FILTERS */
  .filter-bar { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px; align-items: center; }
  .filter-label { font-size: 8px; letter-spacing: 0.35em; text-transform: uppercase; color: #3a3020; margin-right: 4px; }
  .filter-btn { font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; padding: 5px 12px; border: 1px solid #1a1610; background: transparent; color: #3a3428; cursor: pointer; font-family: 'DM Mono', monospace; transition: all 0.2s; }
  .filter-btn:hover { color: #7a6a50; border-color: #2e2818; }
  .filter-btn.active { border-color: #c86030; color: #c86030; background: #160c06; }
  .filter-sep { width: 1px; height: 16px; background: #1a1610; margin: 0 4px; }

  /* STATUS */
  .status-bar { display: flex; align-items: center; gap: 10px; padding: 13px 18px; background: #0d0c09; border-left: 2px solid #c86030; margin-bottom: 28px; }
  .dot-pulse { width: 6px; height: 6px; border-radius: 50%; background: #c86030; animation: dpulse 1.1s ease-in-out infinite; }
  @keyframes dpulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.2;transform:scale(0.7);} }
  .status-txt { font-size: 10px; letter-spacing: 0.18em; color: #7a6a50; text-transform: uppercase; }

  /* SYNTHESIS */
  .synthesis { position: relative; padding: 28px 32px; border: 1px solid #221e14; background: #0b0b08; margin-bottom: 28px; }
  .synthesis-label { position: absolute; top: 0; left: 28px; transform: translateY(-50%); font-size: 8px; letter-spacing: 0.45em; text-transform: uppercase; color: #c86030; background: #0b0b08; padding: 0 8px; }
  .synthesis-body { font-family: 'Cormorant Garamond', serif; font-size: 16px; line-height: 1.85; color: #b0a080; font-weight: 300; }

  /* RESULTS */
  .results-header { display: flex; align-items: baseline; justify-content: space-between; padding-bottom: 14px; border-bottom: 1px solid #161410; margin-bottom: 20px; }
  .results-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-style: italic; font-weight: 300; color: #c86030; }
  .results-meta { font-size: 9px; letter-spacing: 0.25em; color: #3a3028; text-transform: uppercase; }

  /* CARD */
  .card { position: relative; border: 1px solid #161410; background: #0b0b08; margin-bottom: 14px; transition: border-color 0.25s, transform 0.2s; animation: rise 0.35s ease backwards; overflow: hidden; }
  @keyframes rise { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);} }
  .card:hover { border-color: #2a1e14; transform: translateX(3px); }
  .card-main { padding: 26px 30px; }
  .card-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; transition: filter 0.25s; }
  .card:hover .card-bar { filter: brightness(1.7); }
  .bar-cosmetic { background: #2a4a18; }
  .bar-moderee  { background: #4a3a10; }
  .bar-complete { background: #5a2810; }
  .bar-majeure  { background: #5a1010; }
  .card-row1 { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 16px; }
  .card-left { display: flex; flex-direction: column; gap: 6px; }
  .source-tag { font-size: 8px; letter-spacing: 0.35em; text-transform: uppercase; color: #4a3e28; padding: 3px 8px; border: 1px solid #1a1610; align-self: flex-start; }
  .resto-level { display: inline-flex; align-items: center; gap: 5px; font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase; padding: 3px 9px; border: 1px solid; align-self: flex-start; font-family: 'DM Mono', monospace; }
  .resto-level .rdot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
  .lvl-cosmetic { color: #6a9a40; border-color: #1e2e10; background: #0a0e06; }
  .lvl-moderee  { color: #c8a020; border-color: #302808; background: #0e0c04; }
  .lvl-complete { color: #c86030; border-color: #301408; background: #100804; }
  .lvl-majeure  { color: #c03020; border-color: #301008; background: #100604; }
  .card-price { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: #c86030; white-space: nowrap; }
  .card-title { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 400; color: #ece4d4; line-height: 1.25; margin-bottom: 8px; }
  .card-desc { font-size: 11px; line-height: 1.85; color: #5a5040; letter-spacing: 0.02em; }
  .card-works { margin-top: 14px; }
  .works-label { font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase; color: #3a2e1c; margin-bottom: 6px; }
  .works-list { display: flex; flex-wrap: wrap; gap: 5px; }
  .work-item { font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase; padding: 3px 8px; background: #0e0c08; border: 1px solid #1a1610; color: #4a3e28; }
  .card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; flex-wrap: wrap; gap: 8px; }
  .card-link { display: inline-flex; align-items: center; gap: 5px; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #6a5a40; text-decoration: none; transition: color 0.2s; }
  .card-link:hover { color: #c86030; }
  .gain-toggle { display: flex; align-items: center; gap: 6px; cursor: pointer; background: none; border: none; font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.25em; text-transform: uppercase; color: #4a3e28; padding: 4px 0; transition: color 0.2s; }
  .gain-toggle:hover { color: #c86030; }
  .gain-toggle .chevron { display: inline-block; transition: transform 0.25s; font-size: 10px; }
  .gain-toggle .chevron.open { transform: rotate(90deg); }

  /* Gain PANEL */
  .gain-panel { border-top: 1px solid #161410; background: #080806; padding: 22px 30px; animation: panelIn 0.22s ease; }
  @keyframes panelIn { from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);} }
  .gain-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #161410; border: 1px solid #161410; margin-bottom: 18px; }
  .gain-cell { background: #0b0b08; padding: 16px 14px; }
  .gain-cell-label { font-size: 7px; letter-spacing: 0.35em; text-transform: uppercase; color: #3a3020; margin-bottom: 8px; }
  .gain-cell-value { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 300; color: #d8c8a0; line-height: 1; }
  .gain-cell-value.positive { color: #6a9a40; }
  .gain-cell-value.negative { color: #c03020; }
  .gain-cell-value.neutral  { color: #c8a020; }
  .gain-cell-sub { font-size: 9px; color: #4a3e28; margin-top: 4px; letter-spacing: 0.05em; }
  .gain-bar-wrap { margin-bottom: 6px; }
  .gain-bar-label { display: flex; justify-content: space-between; font-size: 7px; letter-spacing: 0.25em; text-transform: uppercase; color: #3a3020; margin-bottom: 6px; }
  .gain-bar-track { height: 3px; background: #161410; }
  .gain-bar-fill { height: 100%; transition: width 0.6s ease; }
  .gain-bar-fill.fill-good { background: linear-gradient(90deg, #2a4a18, #6a9a40); }
  .gain-bar-fill.fill-mid  { background: linear-gradient(90deg, #4a3010, #c8a020); }
  .gain-bar-fill.fill-low  { background: linear-gradient(90deg, #4a1808, #c86030); }

  /* PRO TABS */
  .pro-tabs { display: flex; gap: 0; margin-bottom: 40px; border: 1px solid #1e1c14; }
  .pro-tab { flex: 1; padding: 16px 20px; background: transparent; border: none; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: #3a3020; cursor: pointer; transition: all 0.2s; border-right: 1px solid #1e1c14; text-align: center; }
  .pro-tab:last-child { border-right: none; }
  .pro-tab:hover { color: #7a6a50; background: #0d0c09; }
  .pro-tab.active { background: #0f0c08; color: #c86030; border-bottom: 2px solid #c86030; }
  .pro-tab .tab-icon { display: block; font-size: 20px; margin-bottom: 6px; font-family: 'Cormorant Garamond', serif; }
  .pro-tab .tab-sub { display: block; font-size: 8px; color: #3a3020; margin-top: 3px; letter-spacing: 0.15em; }
  .pro-tab.active .tab-sub { color: #5a3a20; }

  .commission-banner { border: 1px solid #3a2818; background: #100c06; padding: 22px 28px; margin-bottom: 28px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
  .commission-pct { font-family: 'Cormorant Garamond', serif; font-size: 56px; font-weight: 300; color: #c86030; line-height: 1; flex-shrink: 0; }
  .commission-txt { font-size: 11px; line-height: 1.85; color: #5a4a30; }
  .commission-txt strong { color: #8a7a50; font-weight: 400; }

  .process-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: #161410; border: 1px solid #161410; margin-bottom: 32px; }
  .process-step { background: #0b0b08; padding: 20px 18px; position: relative; }
  .process-step::after { content: '→'; position: absolute; right: -8px; top: 20px; color: #2a2018; font-size: 13px; z-index: 1; }
  .process-step:last-child::after { display: none; }
  .process-n { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: #1e1810; margin-bottom: 8px; }
  .process-t { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #c86030; margin-bottom: 6px; }
  .process-b { font-size: 10px; line-height: 1.65; color: #3a3020; }

  .guarantees { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #161410; border: 1px solid #161410; margin-top: 32px; }
  .guarantee-cell { background: #0b0b08; padding: 22px 20px; }
  .guarantee-icon { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #c86030; margin-bottom: 10px; }
  .guarantee-title { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #d8c8a0; margin-bottom: 7px; }
  .guarantee-body { font-size: 10px; line-height: 1.7; color: #3a3020; }

  /* FOOTER */
  .footer { border-top: 1px solid #161410; padding: 40px 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
  .footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 300; color: #3a3020; }
  .footer-logo em { font-style: italic; color: #5a3a20; }
  .footer-copy { font-size: 9px; letter-spacing: 0.2em; color: #2a2018; text-transform: uppercase; }

  /* MISC */
  .error { padding: 18px 22px; border: 1px solid #3a1410; background: #0e0604; color: #a05040; font-size: 11px; line-height: 1.7; }
  .empty { text-align: center; padding: 60px 20px; }
  .empty-glyph { font-family: 'Cormorant Garamond', serif; font-size: 52px; color: #1a1610; margin-bottom: 18px; }
  .empty-msg { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #2e2820; }

  @media (max-width: 700px) {
    .props-grid, .steps, .pricing-grid, .audience-grid { grid-template-columns: 1fr; }
    .gain-grid { grid-template-columns: repeat(2,1fr); }
    .form-grid { grid-template-columns: 1fr; }
    .topbar-nav { display: none; }
  }
`;
