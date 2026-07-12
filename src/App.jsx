/* eslint-disable react-hooks/exhaustive-deps, no-unused-vars */
import { useState, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');`;

const css = `
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
  .audience-title { font-family: 'Cormorant Garamond', serif !important; font-size: 24px; font-weight: 300; color: #ffffff; text-shadow: 0 1px 8px rgba(0,0,0,0.9); margin-bottom: 14px; letter-spacing: 0.02em; }


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
  .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 72px; }
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
  .audience-title { font-family: 'Cormorant Garamond', serif !important; font-size: 24px; font-weight: 300; color: #ffffff; text-shado
  .audience-body { font-size: 12px; line-height: 1.8; color: #4a3e28; margin-bottom: 20px; font-family: 'Cormorant Garamond', serif !important; font-weight: 300; letter-spacing: 0.02em; }
  .audience-list { font-family: 'Cormorant Garamond', serif !important; list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .audience-list li { font-family: 'Cormorant Garamond', serif !important; font-size: 10px; letter-spacing: 0.05em; color: #5a5040; display: flex; align-items: flex-start; gap: 8px; }
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

// ─── DATA ────────────────────────────────────────────────────
const SUGGESTIONS = ["Rolex Submariner","Omega Constellation","Zenith El Primero","Longines Conquest","Jaeger-LeCoultre Memovox","IWC Mark XI","Tudor Prince","Heuer Carrera vintage"];

const MVT_SUGGESTIONS = [
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

const MVT_INFO = {
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
const FILTERS = ["tous","cosmétique","modérée","complète","majeure"];
const SORTS = [
  { key:"default", label:"Par défaut" },
  { key:"gain_desc", label:"Meilleur Gain" },
  { key:"price_asc", label:"Prix ↑" },
  { key:"price_desc", label:"Prix ↓" },
];
const LEVEL_MAP = {
  "cosmétique":{ cls:"lvl-cosmetic", bar:"bar-cosmetic", label:"Restauration cosmétique" },
  "modérée":   { cls:"lvl-moderee",  bar:"bar-moderee",  label:"Restauration modérée"   },
  "complète":  { cls:"lvl-complete", bar:"bar-complete", label:"Restauration complète"   },
  "majeure":   { cls:"lvl-majeure",  bar:"bar-majeure",  label:"Restauration majeure"    },
};
function getMeta(l="") { return LEVEL_MAP[l.toLowerCase().trim()] || LEVEL_MAP["complète"]; }
function parseNum(v) { if(typeof v==="number")return v; return parseFloat(String(v||"").replace(/[^\d.,]/g,"").replace(",","."))||0; }

const SYSTEM_PROMPT = `Tu es un expert en restauration horlogère. Trouve EXCLUSIVEMENT des montres à restaurer : défectueuses, "pour pièces", non fonctionnelles, épaves, "spares or repair", "as found".

Recherche sur : eBay ("for parts or not working"), Le Bon Coin ("pour pièces"), Chrono24, Catawiki, Delcampe, Reddit r/watchexchange.
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

// ─── Gain PANEL ───────────────────────────────────────────────
function RoiPanel({ item }) {
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

// ─── STOCK EVALUATOR (AI-powered) ──────────────────────────
function StockEvaluator({ models, qty, condition }) {
  const [eval_result, setEvalResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const evaluate = async () => {
    if (!models || !qty) return;
    setLoading(true);
    try {
      const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
      const res = await fetch("/api/anthropic", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
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
        })
      });
      const data = await res.json();
      const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
      const match = text.match(/\{[\s\S]*"stock_value_low"[\s\S]*\}/);
      if (match) setEvalResult(JSON.parse(match[0]));
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const evaluateRef = useRef(evaluate);
  evaluateRef.current = evaluate;
  useEffect(() => { if (models && qty) evaluateRef.current(); }, [models, qty]);

  if (loading) return (
    <div style={{padding:"20px",borderTop:"1px solid #161410",background:"#080806",display:"flex",alignItems:"center",gap:10}}>
      <div className="dot-pulse"/>
      <span style={{fontSize:10,letterSpacing:"0.18em",color:"#7a6a50",textTransform:"uppercase"}}>Évaluation IA en cours...</span>
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

// ─── CONSIGNMENT FORM ────────────────────────────────────────
function ConsignForm() {
  const [sent, setSent] = useState(false);
  const [evaluated, setEvaluated] = useState(false);
  const [form, setForm] = useState({
    name:"", company:"", email:"", phone:"", siret:"",
    activity:"horloger", stock_qty:"", models:"", avg_condition:"complète",
    storage_location:"", has_photos:"non", message:""
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

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

        <button className="form-submit" style={{marginTop:16}}
          onClick={()=>form.name&&form.email&&form.phone&&form.models&&form.stock_qty?setSent(true):null}>
          Confier mon stock à WatchRestore
        </button>
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



// ─── PRICE COMPARISON CHART ──────────────────────────────────
function PriceChart({ listings }) {
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
  "feedback": "Votre annonce est claire et bien ciblée — elle sera visible immédiatement."
}`;

function AiValidator({ type, model, description, condition, onResult }) {
  const [state, setState] = useState("idle"); // idle | checking | approved | rejected
  const [result, setResult] = useState(null);

  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  useEffect(() => {
    if (!model || !description || description.length < 20) return;
    const timer = setTimeout(async () => {
      setState("checking");
      try {
        const res = await fetch("/api/anthropic", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-5",
            max_tokens: 400,
            messages: [{ role: "user", content: AI_VALIDATION_PROMPT(type, model, description, condition) }]
          })
        });
        const data = await res.json();
        const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
        const match = text.match(/\{[\s\S]*"approved"[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          setResult(parsed);
          setState(parsed.approved ? "approved" : "rejected");
          onResultRef.current(parsed.approved);
        }
      } catch(e) { setState("idle"); }
    }, 900);
    return () => clearTimeout(timer);
  }, [model, description, condition, type]);

  if (state === "idle") return null;

  const criteria = result ? [
    { label:"Horlogerie",    ok: result.relevant },
    { label:"À restaurer",   ok: result.restorable },
    { label:"Description",   ok: result.description_ok },
    { label:"Conformité",    ok: result.safe },
  ] : [];

  return (
    <div className={`ai-validation ${state}`}>
      <div className="ai-val-row">
        <span className="ai-val-icon">{state==="checking"?"◌":state==="approved"?"◎":"◈"}</span>
        <div>
          <div className={`ai-val-text ${state==="rejected"?"rejected":""}`}>
            {state==="checking" && "Validation IA en cours..."}
            {state==="approved" && (result?.feedback || "Annonce validée — prête à être publiée.")}
            {state==="rejected" && (result?.feedback || "Cette annonce ne correspond pas aux critères de WatchRestore.")}
          </div>
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

function DepositForm() {
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

  if (published) return (
    <div className="publish-success">
      <div className="publish-success-icon">◎</div>
      <div className="publish-success-title">Annonce publiée !</div>
      <div className="publish-ref">{ref}</div>
      <p className="publish-success-msg">
        Votre annonce a été validée par notre IA et est désormais visible par la communauté WatchRestore.
        Conservez votre référence <strong style={{color:"#c86030",fontWeight:400}}>{ref}</strong> pour toute question.
        Vous serez contacté directement par les acheteurs intéressés.
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
                Annonce gratuite · Validée par IA · Visible immédiatement · Référence : <strong style={{color:"#4a7030",fontWeight:400}}>{ref}</strong>
              </span>
            </div>

            <div style={{display:"flex",gap:10,marginTop:8}}>
              <button onClick={()=>setStep(2)} style={{padding:"12px 20px",background:"transparent",border:"1px solid #1a1610",color:"#3a3020",fontFamily:"DM Mono, monospace",fontSize:9,letterSpacing:"0.25em",textTransform:"uppercase",cursor:"pointer"}}>
                ← Retour
              </button>
              <button className="form-submit" style={{flex:1,opacity:form.name&&form.email&&form.location?1:0.4,cursor:form.name&&form.email&&form.location?"pointer":"not-allowed"}}
                onClick={()=>form.name&&form.email&&form.location?setPublished(true):null}>
                Publier mon annonce gratuitement
              </button>
            </div>
            <p style={{fontSize:9,letterSpacing:"0.08em",color:"#2a2018",marginTop:10,textAlign:"center",lineHeight:1.6}}>
              En publiant, vous acceptez les CGU de WatchRestore. Publication gratuite, retrait possible à tout moment sur demande.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



// ─── STOCK EVALUATOR (AI-powered) ──────────────────────────
// ─── CONSIGNMENT FORM ────────────────────────────────────────
// ─── PRICE COMPARISON CHART ──────────────────────────────────
// ─── DEPOSIT LISTING FORM ────────────────────────────────────
// ─── WATCH LOGO COMPONENT ────────────────────────────────────
function WatchLogo({ size = 80, animated = true }) {
  const w = size, h = size * 1.55;
  const cx = w/2, cy = h/2;
  const R = size*0.36, Rbz = size*0.295, Ri = size*0.272;
  const s = size;

  // Animation state — starts at 10h10, then ticks in real time
  const [time, setTime] = useState({ h: 10, m: 10, s: 0 });
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!animated) return;
    // Start at 10:10:00 and advance in real time (but slower — 1 real sec = 1 watch sec)
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000; // seconds elapsed
      const totalSeconds = 10*3600 + 10*60 + elapsed;
      const hh = (totalSeconds / 3600) % 12;
      const mm = (totalSeconds / 60) % 60;
      const ss = totalSeconds % 60;
      setTime({ h: hh, m: mm, s: ss });
    }, 50);
    return () => clearInterval(interval);
  }, [animated]);

  // Convert time to angles (from 12h = -90°)
  const hAngle = ((time.h / 12) * 360 - 90) * Math.PI / 180;
  const mAngle = ((time.m / 60) * 360 - 90) * Math.PI / 180;
  const sAngle = ((time.s / 60) * 360 - 90) * Math.PI / 180;

  // Strap
  const strapW = size*0.38, strapLen = size*0.22, strapTaper = size*0.04;
  const strapTopPath = `M ${cx-strapW/2} ${cy-R+s*0.01} L ${cx-strapW/2+strapTaper} ${cy-R-strapLen} Q ${cx} ${cy-R-strapLen-s*0.025} ${cx+strapW/2-strapTaper} ${cy-R-strapLen} L ${cx+strapW/2} ${cy-R+s*0.01}`;
  const strapBotPath = `M ${cx-strapW/2} ${cy+R-s*0.01} L ${cx-strapW/2+strapTaper} ${cy+R+strapLen} Q ${cx} ${cy+R+strapLen+s*0.025} ${cx+strapW/2-strapTaper} ${cy+R+strapLen} L ${cx+strapW/2} ${cy+R-s*0.01}`;

  const hours = Array.from({length:12},(_,i)=>i);

  // Tapered hand helper
  const handPath = (angle, length, backLen, tipW, baseW) => {
    const perp = angle + Math.PI/2;
    const tx = cx + length*Math.cos(angle), ty = cy + length*Math.sin(angle);
    const bx = cx - backLen*Math.cos(angle), by = cy - backLen*Math.sin(angle);
    return [
      `${tx+tipW*Math.cos(perp)},${ty+tipW*Math.sin(perp)}`,
      `${tx-tipW*Math.cos(perp)},${ty-tipW*Math.sin(perp)}`,
      `${bx-baseW*Math.cos(perp)},${by-baseW*Math.sin(perp)}`,
      `${bx+baseW*Math.cos(perp)},${by+baseW*Math.sin(perp)}`,
    ].join(' ');
  };

  const hPts = handPath(hAngle, Ri*0.56, Ri*0.14, Math.max(0.3,s*0.008), Math.max(0.7,s*0.016));
  const mPts = handPath(mAngle, Ri*0.74, Ri*0.12, Math.max(0.2,s*0.005), Math.max(0.4,s*0.011));
  const sPts = handPath(sAngle, Ri*0.78, Ri*0.22, Math.max(0.15,s*0.003), Math.max(0.15,s*0.003));

  // W and R positions (fixed at 9h and 3h)
  const wAngle = (9*30-90)*Math.PI/180;
  const rAngle = (3*30-90)*Math.PI/180;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" style={{display:"block",flexShrink:0}}>
      <defs>
        <radialGradient id={`case${s}`} cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#323028"/><stop offset="30%" stopColor="#1e1c14"/>
          <stop offset="70%" stopColor="#141210"/><stop offset="100%" stopColor="#0a0806"/>
        </radialGradient>
        <linearGradient id={`bez${s}`} x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#c86030" stopOpacity="0.9"/>
          <stop offset="25%" stopColor="#a04820"/><stop offset="50%" stopColor="#c86030" stopOpacity="0.85"/>
          <stop offset="75%" stopColor="#7a3010"/><stop offset="100%" stopColor="#c86030" stopOpacity="0.9"/>
        </linearGradient>
        <radialGradient id={`dial${s}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1610"/><stop offset="60%" stopColor="#0e0c08"/>
          <stop offset="100%" stopColor="#060504"/>
        </radialGradient>
        <radialGradient id={`glass${s}`} cx="38%" cy="25%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
        <linearGradient id={`strap${s}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a1410"/><stop offset="20%" stopColor="#2a2018"/>
          <stop offset="50%" stopColor="#1e1a12"/><stop offset="80%" stopColor="#2a2018"/>
          <stop offset="100%" stopColor="#141008"/>
        </linearGradient>
        <filter id={`glow${s}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={s*0.016} result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id={`shadow${s}`}>
          <feDropShadow dx="0" dy={s*0.02} stdDeviation={s*0.03} floodColor="#c86030" floodOpacity="0.2"/>
        </filter>
      </defs>

      {/* TOP STRAP */}
      <path d={strapTopPath} fill={`url(#strap${s})`} stroke="#c86030" strokeWidth={s*0.018} strokeLinejoin="round" opacity="0.9"/>
      {[0.3,0.55,0.78].map((t,i)=>(
        <line key={i} x1={cx-(strapW/2-strapTaper*t)*0.85} y1={cy-R-strapLen*t} x2={cx+(strapW/2-strapTaper*t)*0.85} y2={cy-R-strapLen*t} stroke="rgba(200,96,48,0.12)" strokeWidth={s*0.012} strokeLinecap="round"/>
      ))}
      <line x1={cx-strapW/2*0.7} y1={cy-R-strapLen*0.45} x2={cx+strapW/2*0.7} y2={cy-R-strapLen*0.45} stroke="#c86030" strokeWidth={s*0.025} strokeLinecap="round" opacity="0.5"/>

      {/* BOTTOM STRAP */}
      <path d={strapBotPath} fill={`url(#strap${s})`} stroke="#c86030" strokeWidth={s*0.018} strokeLinejoin="round" opacity="0.9"/>
      {[0.3,0.55,0.78].map((t,i)=>(
        <line key={i} x1={cx-(strapW/2-strapTaper*t)*0.85} y1={cy+R+strapLen*t} x2={cx+(strapW/2-strapTaper*t)*0.85} y2={cy+R+strapLen*t} stroke="rgba(200,96,48,0.12)" strokeWidth={s*0.012} strokeLinecap="round"/>
      ))}
      <rect x={cx-strapW*0.28} y={cy+R+strapLen*0.6} width={strapW*0.56} height={s*0.035} rx={s*0.01} fill="none" stroke="#c86030" strokeWidth={s*0.018} opacity="0.45"/>
      <line x1={cx} y1={cy+R+strapLen*0.6} x2={cx} y2={cy+R+strapLen*0.6+s*0.035} stroke="#c86030" strokeWidth={s*0.015} opacity="0.45"/>

      {/* CASE */}
      <circle cx={cx} cy={cy} r={R} fill={`url(#case${s})`} filter={`url(#shadow${s})`}/>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={`url(#bez${s})`} strokeWidth={s*0.062}/>
      <circle cx={cx} cy={cy} r={R-s*0.058} fill="none" stroke="rgba(200,160,80,0.2)" strokeWidth={s*0.018}/>
      <circle cx={cx} cy={cy} r={Rbz+s*0.018} fill="none" stroke="#c86030" strokeWidth={s*0.012} opacity="0.4"/>

      {/* DIAL */}
      <circle cx={cx} cy={cy} r={Rbz} fill={`url(#dial${s})`}/>
      {Array.from({length:72},(_,i)=>{const a=(i*5)*Math.PI/180;return <line key={i} x1={cx} y1={cy} x2={cx+Ri*Math.cos(a)} y2={cy+Ri*Math.sin(a)} stroke="rgba(200,160,80,0.04)" strokeWidth="0.3"/>;})};
      <circle cx={cx} cy={cy} r={Rbz} fill={`url(#glass${s})`}/>
      <circle cx={cx} cy={cy} r={Rbz} fill="none" stroke="rgba(200,160,80,0.15)" strokeWidth={s*0.012}/>
      <circle cx={cx} cy={cy} r={Ri*0.94} fill="none" stroke="#c86030" strokeWidth="0.3" opacity="0.18"/>

      {/* HOUR MARKERS — skip 9 and 3 (replaced by W and R) */}
      {hours.map((i) => {
        if (i===9 || i===3) return null;
        const angle=(i*30-90)*Math.PI/180, isMajor=i%3===0;
        const r1=Ri-s*0.02, r2=Ri-(isMajor?s*0.092:s*0.055);
        const mw=isMajor?Math.max(1,s*0.044):Math.max(0.4,s*0.022);
        return (
          <g key={i}>
            <line x1={cx+r1*Math.cos(angle)} y1={cy+r1*Math.sin(angle)} x2={cx+r2*Math.cos(angle)} y2={cy+r2*Math.sin(angle)} stroke="#c86030" strokeWidth={mw+1.5} strokeLinecap="round" opacity="0.12"/>
            <line x1={cx+r1*Math.cos(angle)} y1={cy+r1*Math.sin(angle)} x2={cx+r2*Math.cos(angle)} y2={cy+r2*Math.sin(angle)} stroke="#c86030" strokeWidth={mw} strokeLinecap="round" opacity={isMajor?0.95:0.42}/>
          </g>
        );
      })}

      {/* W at 9h (fixed) */}
      <text x={cx+(Ri-s*0.07)*Math.cos(wAngle)} y={cy+(Ri-s*0.07)*Math.sin(wAngle)} textAnchor="middle" dominantBaseline="middle" fontFamily="Cormorant Garamond, serif" fontSize={Math.max(6,s*0.115)} fontStyle="italic" fill="#c86030" opacity="0.18" style={{filter:`blur(${s*0.018}px)`}}>W</text>
      <text x={cx+(Ri-s*0.07)*Math.cos(wAngle)} y={cy+(Ri-s*0.07)*Math.sin(wAngle)} textAnchor="middle" dominantBaseline="middle" fontFamily="Cormorant Garamond, serif" fontSize={Math.max(6,s*0.115)} fontStyle="italic" fill="#c86030" opacity="0.92">W</text>

      {/* R at 3h (fixed) */}
      <text x={cx+(Ri-s*0.07)*Math.cos(rAngle)} y={cy+(Ri-s*0.07)*Math.sin(rAngle)} textAnchor="middle" dominantBaseline="middle" fontFamily="Cormorant Garamond, serif" fontSize={Math.max(6,s*0.115)} fontStyle="italic" fill="#c86030" opacity="0.18" style={{filter:`blur(${s*0.018}px)`}}>R</text>
      <text x={cx+(Ri-s*0.07)*Math.cos(rAngle)} y={cy+(Ri-s*0.07)*Math.sin(rAngle)} textAnchor="middle" dominantBaseline="middle" fontFamily="Cormorant Garamond, serif" fontSize={Math.max(6,s*0.115)} fontStyle="italic" fill="#c86030" opacity="0.92">R</text>

      {/* SECOND HAND (fine red line) */}
      <polygon points={sPts} fill="#e06040" opacity="0.7"/>

      {/* HOUR HAND */}
      <polygon points={hPts} fill="#c86030" opacity="0.12" style={{filter:`blur(${s*0.015}px)`}}/>
      <polygon points={hPts} fill="#c86030" opacity="0.95" filter={`url(#glow${s})`}/>

      {/* MINUTE HAND */}
      <polygon points={mPts} fill="#c86030" opacity="0.1" style={{filter:`blur(${s*0.012}px)`}}/>
      <polygon points={mPts} fill="#c86030" opacity="0.78"/>

      {/* CENTER PIVOT */}
      <circle cx={cx} cy={cy} r={Math.max(1.8,s*0.048)} fill="#c86030" opacity="0.9"/>
      <circle cx={cx} cy={cy} r={Math.max(0.8,s*0.022)} fill="#0a0806"/>
      <circle cx={cx} cy={cy} r={Math.max(0.3,s*0.009)} fill="#e06040" opacity="0.8"/>

      {/* CROWN */}
      <rect x={cx+R+s*0.008} y={cy-s*0.062} width={s*0.082} height={s*0.124} rx={s*0.028} fill={`url(#case${s})`} stroke={`url(#bez${s})`} strokeWidth={s*0.022}/>
      {[-1,0,1].map(i=><line key={i} x1={cx+R+s*0.018} y1={cy+i*s*0.032} x2={cx+R+s*0.075} y2={cy+i*s*0.032} stroke="rgba(200,96,48,0.3)" strokeWidth={s*0.012} strokeLinecap="round"/>)}
    </svg>
  );
}


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
    setStatus("Recherche d'épaves et projets de restauration...");
    try {
      const res=await fetch("/api/anthropic",{
        method:"POST", headers:{"Content-Type":"application/json","x-api-key":process.env.REACT_APP_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01","anthropic-beta":"web-search-2025-03-05"},
        body:JSON.stringify({ model:"claude-sonnet-4-5", max_tokens:4000, system:SYSTEM_PROMPT,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:searchMode==="movement" ? `Trouve des montres À RESTAURER équipées du mouvement ${q}. Cherche sur eBay, Le Bon Coin, Chrono24, forums. Inclus prix, coût restauration, valeur marché et Gain.` : `Trouve des montres À RESTAURER pour : ${q}. Inclus prix, coût restauration estimé, valeur marché et Gain.`}]
        })
      });
      if(!res.ok)throw new Error(`Erreur API: ${res.status}`);
      const data=await res.json();
      setStatus("Calcul des Gain...");
      const text=data.content.filter(b=>b.type==="text").map(b=>b.text).join("");
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
            position:"absolute",inset:0,zIndex:0,overflow:"hidden",
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
          </>
  }
        {/* AUDIENCE */}
      {page==="" && (
        <div className="section" style={{paddingTop:0,position:"relative",zIndex:1}}>
          <div className="section-kicker">Pour qui ?</div>
          <div className="section-title">Deux profils,<br/><em>une même plateforme</em></div>
          <div className="audience-grid">
            <div className="audience-cell">
              <span className="audience-tag buyer">Acheteur / Restaurateur</span>
              <div className="audience-title" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontWeight:300,fontSize:14,lineHeight:1.9}}>Passionné, horloger amateur ou professionnel, vous cherchez des épaves à remettre en état.</div>
              <div className="audience-body" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontWeight:300}}>WatchRestore agrège toutes les opportunités et calcule automatiquement si elles valent l'investissement.</div>
              <ul className="audience-list" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontWeight:300,fontSize:14}}>
                <li>Recherche multi-plateformes en temps réel</li>
                <li>Analyse Gain automatique par annonce</li>
                <li>Filtres par niveau de restauration requis</li>
                <li>Tri par meilleure rentabilité</li>
              </ul>
            </div>
            <div className="audience-cell">
              <span className="audience-tag pro">Professionnel / Vendeur</span>
              <div className="audience-title" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontWeight:300,fontSize:14,lineHeight:1.9}}>Horloger, brocanteur, succession ou revendeur, vous disposez de montres à restaurer.</div>
              <div className="audience-body" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontWeight:300}}>Déposez vos annonces directement auprès d'une communauté de restaurateurs actifs.</div>
              <ul className="audience-list" style={{fontFamily:"'Cormorant Garamond', Georgia, serif",fontWeight:300,fontSize:14}}>
                <li>Dépôt d'annonce en quelques minutes</li>
                <li>Visibilité auprès d'acheteurs qualifiés</li>
                <li>Pas de commission sur la vente</li>
              </ul>
            </div>
          </div>
        </div>
      )}

 

      {/* ══ SEARCH ══ */}
      {page==="search" && (
        <div className="search-page">
          <div style={{marginBottom:32}}>
            <div className="section-kicker">Moteur de recherche · Comparateur multi-sources</div>
            <div className="section-title" style={{marginBottom:0}}>Comparez toutes les offres,<em>en une seule recherche</em></div>
          </div>
          <div style={{marginBottom:28,padding:"16px 20px",border:"1px solid #1a1610",background:"#0b0b08",display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {["eBay","Le Bon Coin","Chrono24","Catawiki","Watchuseek","Reddit","Delcampe"].map(s=>(
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
            </div>

  );
}
