import { useState, useRef, useEffect } from "react";

// ─── WATCH LOGO COMPONENT ────────────────────────────────────
export function WatchLogo({ size = 80, animated = true }) {
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
