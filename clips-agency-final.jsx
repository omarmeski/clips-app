import { useState, useEffect, useRef } from "react";

const T = {
  base:    "#0a0a0f",
  surface: "#111118",
  lift:    "#13131a",
  raised:  "#1a1a24",
  line:    "#1e1e2e",
  lineHi:  "#2a2a3e",
  ink:     "#f0f0f5",
  muted:   "#a0a0c0",
  dim:     "#7070a0",
  ghost:   "#333348",
  gold:    "#c084fc",
  goldHi:  "#ECC3FF",
  goldBg:  "#1e0f2e",
  goldLine:"#c084fc44",
  reach:   "#38bdf8",
  reachBg: "#082038",
  auth:    "#ECC3FF",
  authBg:  "#200a3a",
  conv:    "#34d399",
  convBg:  "#052e20",
  draft:   "#9ca3af",
  approved:"#34d399",
  done:    "#ECC3FF",
};

const PILLAR_CFG = {
  AUTHORITY: { color: "#ECC3FF", bg: "#200a3a44", line: "#c084fc55" },
  CONVERSION:{ color: "#34d399", bg: "#05462033", line: "#10b98155" },
  REACH:     { color: "#38bdf8", bg: "#08203844", line: "#0ea5e955" },
};
const TYPE_CFG = {
  CONTRARIAN:{ color: "#fb923c", bg: "#431a0522", line: "#f9731655" },
  AUTHORITY: { color: "#38bdf8", bg: "#08203822", line: "#0ea5e955" },
  VALUE:     { color: "#94a3b8", bg: "#1e293b22", line: "#64748b55" },
  PAIN:      { color: "#f87171", bg: "#3b0a0a22", line: "#ef444455" },
  CURIOSITY: { color: "#c084fc", bg: "#2d0a4422", line: "#a855f755" },
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&family=Cairo:wght@400;500;600;700;800&family=Noto+Kufi+Arabic:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin:; padding:; }
  ::-webkit-scrollbar { width:px; height:px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.ghost}; border-radius: 99px; }
  ::selection { background: ${T.gold}33; color: ${T.goldHi}; }
  textarea, input { font-family: inherit; }
  textarea::placeholder, input::placeholder { color: ${T.dim}; }

  @keyframes fadeUp {
    from { opacity:; transform:translateY(8px); }
    to   { opacity:; transform:translateY(0); }
  }
  @keyframes pulse-gold {
    0%, 100% { box-shadow: 0 0 0 0 ${T.gold}33; }
    50%       { box-shadow: 0 0 0 6px transparent; }
  }
  .fade-up { animation:fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.1s; }
  .fade-up-3 { animation-delay: 0.15s; }
  .fade-up-4 { animation-delay: 0.2s; }

  /* Grain overlay */
  .grain::after {
    content: '';
    position:fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 160px 160px;
    pointer-events: none; z-index: 9999; opacity:.4;
  }

  .tab-btn { transition:all 0.18s ease; }
  .tab-btn:hover { color: ${T.ink} !important; }
  .row-hover { transition:background 0.15s; }
  .row-hover:hover { background: ${T.lift} !important; }
  .card-hover { transition:border-color 0.2s, box-shadow 0.2s; }
  .card-hover:hover { border-color: ${T.lineHi} !important; box-shadow: 0 4px 24px #00000033 !important; }
  .btn-hover { transition:all 0.18s ease; }
  .btn-hover:hover { opacity:.85; transform:translateY(-1px); }
  .gold-btn:hover { box-shadow: 0 0 20px ${T.gold}44; }
`;

function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

function PBadge({ label, size = 10 }) {
  const c = PILLAR_CFG[label] || PILLAR_CFG.AUTHORITY;
  return (
    <span style={{ color: c.color, background: c.bg, border: `1px solid ${c.line}`, fontSize: size, fontWeight:700, letterSpacing:"0.1em", padding: "2px 8px", borderRadius:4, fontFamily:"'DM Mono', monospace", display:"inline-block" }}>
      {label}
    </span>
  );
}
function TBadge({ label }) {
  const c = TYPE_CFG[label] || TYPE_CFG.VALUE;
  return (
    <span style={{ color: c.color, background: c.bg, border: `1px solid ${c.line}`, fontSize:10, fontWeight:700, letterSpacing:"0.1em", padding: "2px 8px", borderRadius:4, fontFamily:"'DM Mono', monospace", display:"inline-block" }}>
      {label}
    </span>
  );
}
function StatusPill({ status }) {
  const cfg = { DRAFT: [T.draft,"#1e1e1a",T.dim+"66"], APPROVED: [T.conv,"#0b1a12",T.conv+"44"], DONE: [T.gold,"#1a1508",T.gold+"44"] };
  const [col, bg, border] = cfg[status] || cfg.DRAFT;
  return <span style={{ color: col, background: bg, border: `1px solid ${border}`, fontSize:9, fontWeight:700, letterSpacing:"0.12em", padding: "2px 7px", borderRadius:3, fontFamily:"'DM Mono', monospace" }}>{status}</span>;
}
function GoldBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} className="btn-hover gold-btn"
      style={{ background:T.gold, color: "#ffffff", border:"none", borderRadius:6, padding: "8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", letterSpacing:"0.05em", display:"flex", alignItems:"center", gap:6, ...style }}>
      {children}
    </button>
  );
}
function GhostBtn({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} className="btn-hover"
      style={{ background:"transparent", color:T.muted, border: `1px solid ${T.line}`, borderRadius:6, padding: "7px 14px", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", letterSpacing:"0.05em", display:"flex", alignItems:"center", gap:6, ...style }}>
      {children}
    </button>
  );
}
function AIBtn({ label = "AI", onClick }) {
  return (
    <button onClick={onClick} className="btn-hover"
      style={{ background:T.goldBg, color:T.gold, border: `1px solid ${T.goldLine}`, borderRadius:6, padding: "5px 11px", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"'DM Mono', monospace", letterSpacing:"0.08em", display:"flex", alignItems:"center", gap:6 }}>
      <span style={{ fontSize:11 }}>✦</span> {label}
    </button>
  );
}
function Label({ children }) {
  return <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:T.dim, fontFamily:"'DM Mono', monospace", marginBottom:8 }}>{children}</div>;
}
function SectionCard({ title, sub, action, children, style = {} }) {
  return (
    <div className="card-hover" style={{ background:T.surface, border: `1px solid ${T.line}`, borderRadius:8, overflow:"hidden", marginBottom:14, maxWidth:860, ...style }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding: "14px 20px", borderBottom: `1px solid ${T.line}` }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, fontFamily:"'DM Sans', sans-serif" }}>{title}</div>
          {sub && <div style={{ fontSize:11, color:T.dim, marginTop:2 }}>{sub}</div>}
        </div>
        {action}
      </div>
      <div style={{ padding:0 }}>{children}</div>
    </div>
  );
}

const CLIENTS_DATA = [
  { id: 1, name: "Elite Real Estate", initials: "ER", niche: "Real Estate", scripts: 4, status: "Active", accent: "#ECC3FF", color: "#200a3a", type: "individual" },
  { id: 2, name: "Smile Clinic",      initials: "SC", niche: "Healthcare",  scripts: 2, status: "Active", accent: "#34d399", color: "#052e20", type: "individual" },
  { id: 3, name: "Coach Peak",        initials: "CP", niche: "Coaching",    scripts: 1, status: "Draft",  accent: "#38bdf8", color: "#082038", type: "individual" },
  { id: 4, name: "Revive Clinic",     initials: "RC", niche: "Aesthetics & Wellness", scripts: 9, status: "Active", accent: "#f0abfc", color: "#2d0a35", type: "team" },
];
const REVIVE_DOCTORS = [
  {
    id: "dr-sara", name: "Dr. Sara Al Mansoori", title: "Aesthetic Medicine Physician", specialty: "Aesthetic Medicine",
    avatar: "SA", color: "#f0abfc", languages: ["Arabic", "English"],
    bio: "Board-certified aesthetic physician with 10+ years specialising in non-surgical facial rejuvenation, skin quality, and body contouring.",
    pillars: [
      { id:"p1", type:"AUTHORITY", label:"Skin Science", ratio:40, desc:"Evidence-based skin education that builds trust", topics:[
        { title:"Why your skin ages faster in Dubai", subtopics:["UV damage vs humidity","Barrier breakdown","What SPF actually does"] },
        { title:"Morpheus8 explained simply", subtopics:["Radiofrequency + microneedling","Why collagen takes 3 months","Before & after expectations"] },
      ]},
      { id:"p2", type:"CONVERSION", label:"Treatment Results", ratio:35, desc:"Real patient transformations that drive bookings", topics:[
        { title:"Filler myth-busting", subtopics:["Natural vs overfilled","Dissolving filler","How to choose the right doctor"] },
      ]},
      { id:"p3", type:"REACH", label:"Lifestyle & Confidence", ratio:25, desc:"Relatable content connecting aesthetics to self-confidence", topics:[
        { title:"Glowing skin from the inside out", subtopics:["Diet and skin","Sleep and collagen","Stress and breakouts"] },
      ]},
    ],
    avatars: [
      { id:1, name:"The Appearance-Conscious Professional", color:"#f0abfc", age:"28–45", location:"Dubai, Abu Dhabi", income:"AED 25K–80K/mo", occupation:"Marketing exec, lawyer, entrepreneur", fears:["Looking overdone or fake","Trusting the wrong doctor","Wasting money on ineffective treatments"], desires:["Natural refreshed results","A doctor who listens","Long-lasting skin improvement"], phrases:["I just want to look like myself, but better","How do I know it won't look obvious?"], blockers:["Scared of needles","Seen bad results on others"] },
    ],
  },
  {
    id: "dr-ahmed", name: "Dr. Ahmed Khalil", title: "Functional & Longevity Medicine", specialty: "Longevity & Wellness",
    avatar: "AK", color: "#67e8f9", languages: ["Arabic", "English"],
    bio: "Functional medicine doctor focused on root-cause health optimisation, longevity protocols, hormones, and performance for high-achieving professionals.",
    pillars: [
      { id:"p1", type:"AUTHORITY", label:"Longevity Science", ratio:45, desc:"Science-backed content on optimising health and lifespan", topics:[
        { title:"Why you're tired despite sleeping 8 hours", subtopics:["Cortisol patterns","Blood sugar crashes","Mitochondrial health"] },
        { title:"The truth about testosterone", subtopics:["Low T symptoms","Natural vs TRT","Who actually needs it"] },
      ]},
      { id:"p2", type:"REACH", label:"Performance & Energy", ratio:35, desc:"Aspirational content for driven professionals", topics:[
        { title:"Morning routine of a longevity doctor", subtopics:["Cold exposure","Fasting windows","Light exposure protocols"] },
      ]},
      { id:"p3", type:"CONVERSION", label:"Revive Programmes", ratio:20, desc:"Content driving longevity programme consultations", topics:[
        { title:"What a full health audit looks like", subtopics:["Blood panel deep-dive","Gut microbiome","Hormone mapping"] },
      ]},
    ],
    avatars: [
      { id:1, name:"The High-Performing Executive", color:"#67e8f9", age:"35–55", location:"Dubai, Riyadh, London", income:"AED 80K+/mo", occupation:"CEO, founder, surgeon, investor", fears:["Burning out before 50","Declining energy affecting performance","Being told 'everything looks normal'"], desires:["Optimised energy and focus","Data-driven health clarity","Longevity without sacrificing performance"], phrases:["I feel fine but not great","My bloodwork is 'normal' but something's off"], blockers:["Sceptical of functional medicine","Too busy to commit to protocols"] },
    ],
  },
  {
    id: "dr-lara", name: "Dr. Lara Nasser", title: "Dermatologist & Hair Restoration", specialty: "Dermatology",
    avatar: "LN", color: "#86efac", languages: ["Arabic", "English", "French"],
    bio: "Consultant dermatologist specialising in medical and aesthetic dermatology, hair loss, and advanced skin treatments for all skin types including darker tones.",
    pillars: [
      { id:"p1", type:"AUTHORITY", label:"Dermatology Expertise", ratio:40, desc:"Medical dermatology education that earns trust", topics:[
        { title:"Hair loss in your 20s — what's really happening", subtopics:["Telogen effluvium","DHT and genetics","When to seek help"] },
        { title:"Dark spots and hyperpigmentation", subtopics:["Fitzpatrick skin types","What works vs what doesn't","Professional vs at-home"] },
      ]},
      { id:"p2", type:"CONVERSION", label:"Treatment Education", ratio:35, desc:"Content that converts curious followers into consultations", topics:[
        { title:"PRP for hair — the honest truth", subtopics:["What PRP actually does","Who it works for","How many sessions"] },
      ]},
      { id:"p3", type:"REACH", label:"Skin for All Tones", ratio:25, desc:"Inclusive content for Middle Eastern and darker skin tones", topics:[
        { title:"Skincare for Arab skin", subtopics:["Common mistakes","Ingredients to avoid","Building a simple routine"] },
      ]},
    ],
    avatars: [
      { id:1, name:"The Skin-Conscious Woman", color:"#86efac", age:"22–40", location:"Dubai, Beirut, Cairo", income:"AED 10K–40K/mo", occupation:"Professional, homemaker, student", fears:["Permanent scarring from wrong treatments","Products not working for her skin tone","Not being taken seriously by doctors"], desires:["Clear even skin tone","Effective hair growth","A routine that actually works"], phrases:["I've tried everything","My skin is different — not all advice applies to me"], blockers:["Overwhelmed by conflicting advice online","Budget-conscious"] },
    ],
  },
];

const REVIVE_SCRIPTS = [
  { id:101, title:"Why your skin ages faster in Dubai", pillar:"AUTHORITY", status:"APPROVED", session:"Revive Shoot — Mar 15", doctor:"dr-sara", hook:"Dubai's climate is silently destroying your skin barrier.", altHooks:[], body:"The combination of UV intensity, air conditioning, and low humidity creates a perfect storm for accelerated skin ageing. Here's what's happening and how to fix it.", cta:"Book a skin consultation at Revive.", duration:"~45s" },
  { id:102, title:"Filler myth-busting", pillar:"CONVERSION", status:"DRAFT", session:"Revive Shoot — Mar 15", doctor:"dr-sara", hook:"Everything you've been told about fillers is probably wrong.", altHooks:[], body:"Most people think fillers make you look fake. That's bad technique, not the product. Here's what natural filler actually looks like.", cta:"DM us 'FILLER' for a free consultation.", duration:"~30s" },
  { id:103, title:"Morpheus8 — what to actually expect", pillar:"AUTHORITY", status:"REVIEW", session:"Revive Shoot — Mar 15", doctor:"dr-sara", hook:"Morpheus8 results don't happen overnight. Here's the honest timeline.", altHooks:[], body:"Week 1: swelling. Month 1: subtle changes. Month 3: the result. Collagen takes time. Anyone promising instant results is lying to you.", cta:"See real patient results on our page.", duration:"~45s" },
  { id:104, title:"Why you're tired despite sleeping 8 hours", pillar:"AUTHORITY", status:"APPROVED", session:"Revive Shoot — Mar 15", doctor:"dr-ahmed", hook:"8 hours of sleep and still exhausted? Your cortisol is broken.", altHooks:[], body:"Most fatigue isn't about sleep quantity — it's about blood sugar crashes, cortisol patterns, and mitochondrial dysfunction. Here's how we find the root cause.", cta:"Book a longevity audit at Revive.", duration:"~45s" },
  { id:105, title:"The truth about testosterone", pillar:"AUTHORITY", status:"DRAFT", session:"Revive Shoot — Mar 15", doctor:"dr-ahmed", hook:"Low testosterone is an epidemic nobody's talking about.", altHooks:[], body:"Symptoms: low energy, brain fog, declining drive, changing body composition. Most doctors won't catch it because the range is too wide. Here's what optimal actually looks like.", cta:"Get your levels checked — DM us.", duration:"~30s" },
  { id:106, title:"What a full health audit looks like", pillar:"CONVERSION", status:"APPROVED", session:"Revive Shoot — Mar 15", doctor:"dr-ahmed", hook:"'Your bloodwork is normal' — the most dangerous words in medicine.", altHooks:[], body:"Normal is not optimal. At Revive we run 60+ markers including hormones, gut health, inflammation, and nutrient status. This is what we look at.", cta:"Book your full health audit today.", duration:"~60s" },
  { id:107, title:"Hair loss in your 20s", pillar:"AUTHORITY", status:"APPROVED", session:"Revive Shoot — Mar 15", doctor:"dr-lara", hook:"Losing hair in your 20s is more common than you think — and more treatable.", altHooks:[], body:"Telogen effluvium, DHT sensitivity, iron deficiency — most early hair loss has a fixable cause. The key is catching it early and knowing which type you have.", cta:"Book a trichology consultation at Revive.", duration:"~45s" },
  { id:108, title:"Dark spots — what actually works", pillar:"AUTHORITY", status:"DRAFT", session:"Revive Shoot — Mar 15", doctor:"dr-lara", hook:"Most hyperpigmentation treatments don't work for darker skin tones. Here's why.", altHooks:[], body:"Ingredients that are safe for fair skin can cause rebound pigmentation on Fitzpatrick types 4–6. As a dermatologist treating mostly Arab and South Asian skin, here's what I actually recommend.", cta:"DM us for a skin tone consultation.", duration:"~45s" },
  { id:109, title:"PRP for hair — the honest truth", pillar:"CONVERSION", status:"REVIEW", session:"Revive Shoot — Mar 15", doctor:"dr-lara", hook:"PRP for hair growth — I'm going to tell you exactly who it works for and who it doesn't.", altHooks:[], body:"PRP works best for early-stage androgenic alopecia and telogen effluvium. If you've had significant follicle death for years, the window has passed. Let me explain.", cta:"Book a PRP consultation — link in bio.", duration:"~45s" },
];
const HOOKS_DATA = [
  { id:1, text:'"Stop trying to sell houses. Start selling the life people want."', pillar:"AUTHORITY", type:"CONTRARIAN", niche:"Real Estate", strength:8 },
  { id:2, text:'"The 3 biggest mistakes first-time home buyers make in this market."', pillar:"AUTHORITY", type:"AUTHORITY", niche:"Real Estate", strength:9 },
  { id:3, text:'"How to double your property\'s value with just $5,000."', pillar:"REACH", type:"VALUE", niche:"Real Estate", strength:10 },
  { id:4, text:'"Why your smile clinic is losing patients to the competition."', pillar:"CONVERSION", type:"PAIN", niche:"Clinic", strength:8 },
  { id:5, text:'"The secret to a perfect smile without the pain of braces."', pillar:"REACH", type:"CURIOSITY", niche:"Clinic", strength:9 },
  { id:6, text:'"3 dental tips your dentist won\'t tell you."', pillar:"AUTHORITY", type:"AUTHORITY", niche:"Clinic", strength:10 },
  { id:7, text:'"Stop trading your time for money. Here\'s how to scale."', pillar:"AUTHORITY", type:"CONTRARIAN", niche:"Coaching", strength:8 },
];
const RESOURCES_DATA = [
  { id:1, ref:"@creator_1", url:"https://example.com/video/1", pillar:"AUTHORITY", platform:"IG Reels", niche:"Clinic", views:"100k", likes:"10k" },
  { id:2, ref:"@creator_2", url:"https://example.com/video/2", pillar:"CONVERSION", platform:"TikTok",  niche:"Coaching", views:"100k", likes:"10k" },
  { id:3, ref:"@creator_3", url:"https://example.com/video/3", pillar:"REACH",    platform:"IG Reels", niche:"Real Estate", views:"100k", likes:"10k" },
  { id:4, ref:"@creator_4", url:"https://example.com/video/4", pillar:"AUTHORITY", platform:"TikTok",  niche:"Clinic", views:"100k", likes:"10k" },
  { id:5, ref:"@creator_5", url:"https://example.com/video/5", pillar:"CONVERSION", platform:"IG Reels", niche:"Coaching", views:"100k", likes:"10k" },
];
const TEMPLATES_DATA_SEED = [
  { id:1, name:"The Contrarian Framework", desc:"Challenge a common belief your audience holds. Take the opposite stance and back it up.", pillar:"AUTHORITY", duration:"45s", tags:["viral","authority"], fields:[
    { id:"f1", label:"Hook", hint:"Start with the belief you're about to challenge", type:"textarea" },
    { id:"f2", label:"The Wrong Belief", hint:"What does everyone think is true?", type:"textarea" },
    { id:"f3", label:"Your Contrarian Take", hint:"Why they're wrong and what's actually true", type:"textarea" },
    { id:"f4", label:"Proof / Evidence", hint:"Why your take is credible", type:"textarea" },
    { id:"f5", label:"Call to Action", hint:"What should they do next?", type:"text" },
  ]},
  { id:2, name:"The 3-Step Tutorial", desc:"Teach your audience how to do something valuable in exactly 3 steps.", pillar:"REACH", duration:"30s", tags:["viral","value"], fields:[
    { id:"f1", label:"Hook", hint:"What will they be able to do after watching?", type:"textarea" },
    { id:"f2", label:"Step 1", hint:"First actionable step", type:"textarea" },
    { id:"f3", label:"Step 2", hint:"Second actionable step", type:"textarea" },
    { id:"f4", label:"Step 3", hint:"Third actionable step", type:"textarea" },
    { id:"f5", label:"Call to Action", hint:"Follow, save, or DM?", type:"text" },
  ]},
  { id:3, name:"The Case Study", desc:"Walk through a real client result from problem to transformation.", pillar:"CONVERSION", duration:"60s", tags:["viral","social proof"], fields:[
    { id:"f1", label:"Hook", hint:"Lead with the result — make it specific", type:"textarea" },
    { id:"f2", label:"The Client Situation", hint:"Who were they before? What was the problem?", type:"textarea" },
    { id:"f3", label:"The Turning Point", hint:"What did they do / what did you do for them?", type:"textarea" },
    { id:"f4", label:"The Result", hint:"Specific outcome — numbers if possible", type:"textarea" },
    { id:"f5", label:"Call to Action", hint:"DM, book a call, comment?", type:"text" },
  ]},
  { id:4, name:"The Pain Agitator", desc:"Name the pain, twist the knife, then offer relief.", pillar:"AUTHORITY", duration:"45s", tags:["viral","authority"], fields:[
    { id:"f1", label:"Hook", hint:"Name the pain immediately", type:"textarea" },
    { id:"f2", label:"Agitate the Pain", hint:"Make it worse — why does this pain persist?", type:"textarea" },
    { id:"f3", label:"The Root Cause", hint:"What's actually causing the problem?", type:"textarea" },
    { id:"f4", label:"The Solution", hint:"How do you solve it?", type:"textarea" },
    { id:"f5", label:"Call to Action", hint:"What's the next step?", type:"text" },
  ]},
  { id:5, name:"The Trend Hook", desc:"Ride a trending format or topic and tie it back to your niche.", pillar:"REACH", duration:"30s", tags:["viral","reach"], fields:[
    { id:"f1", label:"Trend / Format Reference", hint:"What's the trend you're jumping on?", type:"text" },
    { id:"f2", label:"Hook", hint:"Open with the trend — make it immediately recognisable", type:"textarea" },
    { id:"f3", label:"The Niche Tie-In", hint:"How does this trend connect to your world?", type:"textarea" },
    { id:"f4", label:"Your Take / Punchline", hint:"The insight or twist", type:"textarea" },
    { id:"f5", label:"Call to Action", hint:"Follow for more takes like this", type:"text" },
  ]},
  { id:6, name:"The Offer Drop", desc:"Present an irresistible offer with urgency and clear value.", pillar:"CONVERSION", duration:"60s", tags:["viral","conversion"], fields:[
    { id:"f1", label:"Hook", hint:"Lead with what they get — not what you sell", type:"textarea" },
    { id:"f2", label:"The Problem it Solves", hint:"What pain does this offer eliminate?", type:"textarea" },
    { id:"f3", label:"What's Included", hint:"Break down exactly what they get", type:"textarea" },
    { id:"f4", label:"The Result / Promise", hint:"What transformation can they expect?", type:"textarea" },
    { id:"f5", label:"Urgency / Scarcity", hint:"Why act now?", type:"text" },
    { id:"f6", label:"Call to Action", hint:"DM, link in bio, comment?", type:"text" },
  ]},
  { id:7, name:"The Myth Buster", desc:"Debunk a common myth in your industry and replace it with the truth.", pillar:"REACH", duration:"45s", tags:["viral","reach"], fields:[
    { id:"f1", label:"Hook", hint:"State the myth boldly — make them stop scrolling", type:"textarea" },
    { id:"f2", label:"The Myth", hint:"Explain what people believe and why it sounds reasonable", type:"textarea" },
    { id:"f3", label:"Why It's Wrong", hint:"The evidence or logic that busts it", type:"textarea" },
    { id:"f4", label:"The Truth", hint:"What should they believe instead?", type:"textarea" },
    { id:"f5", label:"Call to Action", hint:"Save this, share it, follow for more", type:"text" },
  ]},
  { id:8, name:"Trending Series: This or That", desc:"Ask your audience to choose between 2 options, repeated across multiple rounds.", pillar:"REACH", duration:"30s", tags:["trending","series","engagement"], fields:[
    { id:"f1", label:"Text Hook", hint:"The opening line that sets up the game", type:"textarea" },
    { id:"f2", label:"Choice Pairs", hint:"Each row is one round: Option A vs Option B", type:"pairs" },
    { id:"f3", label:"Final CTA", hint:"Follow to see the results / more rounds", type:"text" },
  ]},
  { id:9, name:"Social Proof Ad", desc:"Conversion ad built around a real client result or testimonial.", pillar:"CONVERSION", duration:"45s", tags:["conversion","ad","social proof"], fields:[
    { id:"f1", label:"Hook", hint:"Lead with the client result — be specific", type:"textarea" },
    { id:"f2", label:"Customer Quote", hint:"Direct quote from the client", type:"textarea" },
    { id:"f3", label:"Context", hint:"Who is this person and what was their situation before?", type:"textarea" },
    { id:"f4", label:"The Result", hint:"What changed? Numbers if possible.", type:"textarea" },
    { id:"f5", label:"Offer / CTA", hint:"What do they do next to get the same result?", type:"text" },
  ]},
  { id:10, name:"Offer-Driven Ad", desc:"Hard conversion ad focused on the offer, value stack, and urgency.", pillar:"CONVERSION", duration:"45s", tags:["conversion","ad","offer"], fields:[
    { id:"f1", label:"Hook", hint:"Lead with the outcome or the transformation", type:"textarea" },
    { id:"f2", label:"The Offer", hint:"What exactly are you offering?", type:"textarea" },
    { id:"f3", label:"Value Stack", hint:"List everything they get", type:"list" },
    { id:"f4", label:"Price / Anchor", hint:"What is it worth vs what does it cost?", type:"text" },
    { id:"f5", label:"Urgency", hint:"Why now? Limited spots, deadline, etc.", type:"text" },
    { id:"f6", label:"Call to Action", hint:"Exactly what to do next", type:"text" },
  ]},
];
const INIT_SCRIPTS = [
  { id:1, title:"The Real Estate Secret", pillar:"REACH",      status:"DRAFT",    session:"Session 1", hook:"Nobody is talking about this real estate loophole.", altHooks:[], body:"Most people think you need 20% down to buy a home. But there's a way to get in with zero down if you know where to look.", cta:"Comment 'LOOPHOLE' to get the full guide.", duration:"~30s" },
  { id:2, title:"Scaling to $10k",         pillar:"AUTHORITY",  status:"APPROVED", session:"Session 1", hook:"Stop trading your time for money. Here's how to scale.", altHooks:[], body:"I spent 5 years stuck at $5k/month until I realized that I was the bottleneck. Once I built systems, everything changed.", cta:"Follow for the full breakdown.", duration:"~30s" },
  { id:3, title:"Why Off-Market Beats Listed", pillar:"CONVERSION", status:"DRAFT",  session:"Session 2", hook:"The best properties never hit the MLS.", altHooks:[], body:"When you buy off-market, you skip the bidding wars, the inflated prices, and the stress. Here's how our clients do it.", cta:"DM me 'OFFMARKET' to learn more.", duration:"~30s" },
  { id:4, title:"3 Mistakes Buyers Make",  pillar:"AUTHORITY",  status:"APPROVED", session:"Session 2", hook:"The 3 biggest mistakes first-time home buyers make in this market.", altHooks:[], body:"Mistake 1: Waiting for rates to drop. Mistake 2: Buying at the top of your budget. Mistake 3: Skipping the inspection.", cta:"Save this before your next offer.", duration:"~45s" },
];
const KO_QUESTIONS = [
  "What do you do and who do you help?",
  "What makes you different from others in your space?",
  "What is the #1 problem you solve for your clients?",
  "What results or transformations do your clients experience?",
  "What do most people get wrong about your industry?",
  "What's your origin story — why did you start this?",
  "What does your ideal client look like?",
  "What objections do people have before working with you?",
  "What content topics do you feel most confident talking about?",
  "What do you want to be known for in 3 years?",
];
const KO_PRE = {
  0: "We help high-net-worth individuals acquire and manage luxury off-market properties for passive income.",
  1: "We guarantee a 12% ROI and only work with off-market listings — no competition, no bidding wars.",
  4: "Most people think real estate investing requires constant attention. We handle everything end-to-end.",
};
const STRAT_DATA = {
  positioning: "The only real estate firm that guarantees a 12% ROI through off-market luxury listings.",
  offering: "Full-service luxury property acquisition and management.",
  audience: "High-net-worth investors looking for passive income through luxury real estate.",
  conversionGoal: "Investment Consultations",
  brandTone: "Premium",
  painPoints: ["High taxes", "Volatility in stock market", "Lack of time to manage properties"],
  goals: ["Generational wealth", "Passive income", "Portfolio diversification"],
  insecurities: ["Fear of missing out on the next big deal", "Worrying about market crashes"],
  dreams: ["Retiring early in the Mediterranean", "Leaving a legacy for their children"],
  clientGoals: ["Acquire 50 new high-value clients this year", "Increase average deal size by 20%"],
  ctas: ["Book a Strategy Call", "Download the ROI Report"],
};

const inputSt = { width:"100%", background:T.lift, border:`1px solid ${T.line}`, borderRadius:4, padding:"9px 12px", color:T.ink, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"'DM Sans', sans-serif" };
const taSt = { ...inputSt, resize:"vertical", lineHeight:1.7 };

const EDITORS_DATA = [
  {
    id: 1, name: "Khalid Al-Rashid", country: "UAE", flag: "🇦🇪",
    avatar: "KR", avatarColor: "#c084fc",
    status: "available",
    rate: "AED 2,500 / mo",
    workload: "5–7 videos / week",
    bio: "Dubai-based editor with 4 years of short-form experience. Specializes in fast-paced real estate and luxury brand content. Has worked with clients across MENA, Europe and the UK. Known for clean transitions, precise color grading and delivery that never misses a deadline.",
    portfolio: [
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    ],
    bank: { name: "Emirates NBD", account: "1234-5678-9012-3456", iban: "AE07 0331 2345 6789 0123 456", swift: "EBILAEAD" }
  },
  {
    id: 2, name: "Marco Gentile", country: "Italy", flag: "🇮🇹",
    avatar: "MG", avatarColor: "#0ea5e9",
    status: "unavailable",
    rate: "AED 2,500 / mo",
    workload: "5–7 videos / week",
    bio: "Milan-trained video editor with a background in fashion and lifestyle content. Brings a cinematic touch to short-form. Works remotely across time zones with a 24-hour turnaround guarantee. Fluent in English and Italian.",
    portfolio: [
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    ],
    bank: { name: "Intesa Sanpaolo", account: "IT60 X054 2811 1010 0000 0123 456", iban: "IT60 X054 2811 1010 0000 0123 456", swift: "BCITITMM" }
  },
  {
    id: 3, name: "Priya Nair", country: "India", flag: "🇮🇳",
    avatar: "PN", avatarColor: "#34d399",
    status: "hired",
    rate: "AED 2,500 / mo",
    workload: "5–7 videos / week",
    bio: "Based in Bangalore, Priya has edited for over 40 creators across health, coaching and e-commerce niches. Exceptional at hook-optimized cuts and caption styling. Delivers same-day revisions and communicates proactively throughout every project.",
    portfolio: [
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    ],
    bank: { name: "HDFC Bank", account: "5020 0112 3456 789", iban: "N/A", swift: "HDFCINBB" }
  },
  {
    id: 4, name: "Yusuf Öztürk", country: "Turkey", flag: "🇹🇷",
    avatar: "YO", avatarColor: "#f97316",
    status: "available",
    rate: "AED 2,500 / mo",
    workload: "5–7 videos / week",
    bio: "Istanbul-based editor specializing in talking-head content, podcast clips and educational carousels. Reliable, fast, and deeply familiar with platform algorithm-optimized editing. Works with clients in both the MENA and European markets.",
    portfolio: [
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    ],
    bank: { name: "Garanti BBVA", account: "TR12 0006 2000 1234 5678 9012 34", iban: "TR12 0006 2000 1234 5678 9012 34", swift: "TGBATRISXXX" }
  },
];

const VIDEOGRAPHERS_DATA = [
  {
    id: 1, name: "Faisal Al-Mansoori", country: "UAE", flag: "🇦🇪",
    avatar: "FM", avatarColor: "#c084fc",
    status: "available",
    rate: "AED 3,000 / shoot",
    workload: "4 hrs / shoot",
    bio: "Dubai-based cinematographer with 6 years shooting commercial and content for luxury brands. Owns full Sony FX3 and FX6 kit. Comfortable on location, in-studio, and in run-and-gun documentary-style shoots. Available across all 7 Emirates.",
    portfolio: [
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    ],
    bank: { name: "ADCB", account: "AE45 0300 0000 0100 1234 567", iban: "AE45 0300 0000 0100 1234 567", swift: "ADCBAEAA" }
  },
  {
    id: 2, name: "Lena Hoffmann", country: "Germany", flag: "🇩🇪",
    avatar: "LH", avatarColor: "#ECC3FF",
    status: "hired",
    rate: "AED 3,000 / shoot",
    workload: "4 hrs / shoot",
    bio: "Berlin-based videographer now based in Dubai Media City. Background in documentary and brand storytelling. Specializes in natural light, talking-head and B-roll-heavy formats. Works across health, real estate and personal brand niches.",
    portfolio: [
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    ],
    bank: { name: "Deutsche Bank UAE", account: "AE07 0331 2345 6789 0111 222", iban: "AE07 0331 2345 6789 0111 222", swift: "DEUTAEAA" }
  },
  {
    id: 3, name: "Carlos Rivera", country: "Mexico", flag: "🇲🇽",
    avatar: "CR", avatarColor: "#34d399",
    status: "available",
    rate: "AED 3,000 / shoot",
    workload: "4 hrs / shoot",
    bio: "Guadalajara native, 4 years experience in social-first video production. Skilled in drone operation, handheld and tripod setups. Works primarily with coaching, wellness and lifestyle brands. Open to both remote direction and on-site collaboration.",
    portfolio: [
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ","https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    ],
    bank: { name: "BBVA Mexico", account: "MX98 BBVA 0110 8001 1012 3456 789", iban: "MX98 BBVA 0110 8001 1012 3456 789", swift: "BCMRMXMM" }
  },
];

const VA_DATA = [
  { id:1, name:"Sara Al-Hashemi",    flag:"🇦🇪", avatar:"SH", avatarColor:"#c084fc", status:"available", role:"Content VA", skills:["Scheduling","Captioning","Repurposing","Analytics"], rate:"AED 1,800 / mo", tz:"GST +4" },
  { id:2, name:"Anika Sharma",       flag:"🇵🇭", avatar:"AS", avatarColor:"#0ea5e9", status:"hired",     role:"Operations VA", skills:["Inbox Mgmt","Client Comms","Invoicing","CRM"], rate:"AED 1,500 / mo", tz:"PST +8" },
  { id:3, name:"James Owusu",        flag:"🇬🇭", avatar:"JO", avatarColor:"#34d399", status:"available", role:"Social Media VA", skills:["Posting","Community Mgmt","DM Scripts","Reports"], rate:"AED 1,800 / mo", tz:"GMT +0" },
  { id:4, name:"Nina Kowalski",      flag:"🇵🇱", avatar:"NK", avatarColor:"#f97316", status:"available", role:"Research VA", skills:["Trend Research","Competitor Audits","Hook Mining","Briefing"], rate:"AED 1,600 / mo", tz:"CET +1" },
];

const STUDIOS_DATA = [
  {
    id:1, name:"Poddster", location:"Al Barsha, Dubai, UAE", flag:"🇦🇪",
    pricePerHour:"AED 450 / hr",
    backgrounds:["Infinity White","Matte Black","Raw Concrete","Neon Strip","Greenscreen"],
    amenities:["4K Monitor","Full Lighting Rig","Teleprompter","Makeup Station"],
    available: true,
  },
  {
    id:2, name:"Podcast Corner", location:"Business Bay, Dubai, UAE", flag:"🇦🇪",
    pricePerHour:"AED 600 / hr",
    backgrounds:["All-Black Void","Dark Wood Panel","Exposed Brick","RGB Cyc","Custom Build"],
    amenities:["Director Monitor","Podcast Setup","Full Grip Kit","Green Room"],
    available: true,
  },
  {
    id:3, name:"Imvent Studios", location:"Dubai Media City, UAE", flag:"🇦🇪",
    pricePerHour:"AED 850 / hr",
    backgrounds:["Marble White","Luxury Living Set","Minimalist Grey","Full Greenscreen","Coloured Cyc"],
    amenities:["Premium Lighting","Catering","Private Parking","Teleprompter"],
    available: false,
  },
];

function MyTeamPage({ hiredIds, setHiredIds }) {
  const mono = "'DM Mono', monospace";
  const allTalent = [
    ...EDITORS_DATA.map(p => ({ ...p, type:"editors", role:"Editor" })),
    ...VIDEOGRAPHERS_DATA.map(p => ({ ...p, type:"videographers", role:"Videographer" })),
    ...VA_DATA.map(p => ({ ...p, type:"vas", role:p.role })),
  ];
  const team = allTalent.filter(p => (hiredIds[p.type]||[]).includes(p.id) || p.status === "hired");
  const cancelHire = (type, id) => setHiredIds(p => ({ ...p, [type]: (p[type]||[]).filter(x => x !== id) }));

  const [confirmCancel, setConfirmCancel] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [contractStatus, setContractStatus] = useState({});
  const [paidMonths, setPaidMonths] = useState({});
  const [notes, setNotes] = useState({});
  const [editingNote, setEditingNote] = useState(null);
  const [delivered, setDelivered] = useState({});

  const startDates = { "editors-3":"2024-12-01", "videographers-2":"2025-01-15", "vas-2":"2025-02-01" };
  const getStartDate = (key) => new Date(startDates[key] || new Date());
  const monthsActive = (key) => Math.max(1, Math.round((new Date() - getStartDate(key)) / (1000*60*60*24*30.4)));
  const nextPayDate = () => { const d=new Date(); d.setMonth(d.getMonth()+1,1); return d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}); };
  const parseRate = (rate) => { const m=rate.match(/[\d,]+/); return m ? parseInt(m[0].replace(",","")) : 0; };
  const currentMK = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; };
  const getStatus = (key) => contractStatus[key] || "Active";
  const statusCfg = {
    "Active":    { color:"#34d399", bg:"#05462033", border:"#34d39944" },
    "Paused":    { color:"#f97316", bg:"#431a0522", border:"#f9731655" },
    "On Notice": { color:"#f87171", bg:"#3b0a0a22", border:"#ef444455" },
  };
  const cycleStatus = (key) => {
    const order = ["Active","Paused","On Notice"];
    setContractStatus(p => ({...p, [key]: order[(order.indexOf(getStatus(key))+1)%order.length]}));
  };
  const togglePaid = (key) => {
    const mk = currentMK();
    setPaidMonths(p => { const s=new Set(p[key]||[]); s.has(mk)?s.delete(mk):s.add(mk); return {...p,[key]:s}; });
  };
  const isPaid = (key) => (paidMonths[key]||new Set()).has(currentMK());


  const CollapsedCard = ({ p, key: k, group, sc }) => {
    const mo = monthsActive(k);
    const rate = parseRate(p.rate);
    const paid = isPaid(k);
    return (
      <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, overflow:"hidden" }}>
        <div style={{ height:2, background:`linear-gradient(90deg,${p.avatarColor},${p.avatarColor}22)` }} />
        <div style={{ padding:"14px 20px", display:"flex",alignItems:"center",gap:14 }}>
          {/* Avatar */}
          <div style={{ width:38, height:38, borderRadius:8, background:p.avatarColor+"22", border:`1.5px solid ${p.avatarColor}44`, display:"flex",alignItems:"center",justifyContent:"center", fontSize:13, fontWeight:800, color:p.avatarColor, flexShrink:0 }}>{p.avatar}</div>
          {/* Name + role */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8, marginBottom:3 }}>
              <span style={{ fontSize:14, fontWeight:700, color:T.ink }}>{p.name}</span>
              <span style={{ fontSize:13 }}>{p.flag}</span>
              <button onClick={() => cycleStatus(k)}
                style={{ fontSize:8, fontWeight:700, letterSpacing:"0.12em", color:sc.color, background:sc.bg, border:`1px solid ${sc.border}`, borderRadius:3, padding:"2px 7px", cursor:"pointer", fontFamily:mono }}>
                {getStatus(k)}
              </button>
            </div>
            <span style={{ fontSize:11, color:T.dim }}>{group.role} · {mo} month{mo!==1?"s":""} · {p.rate}</span>
          </div>
          {/* Payment pill */}
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            {paid
              ? <span style={{ fontSize:9, fontWeight:700, color:"#34d399", background:"#05462033", border:"1px solid #34d39944", borderRadius:3, padding:"3px 9px", fontFamily:mono }}>✓ PAID</span>
              : <span style={{ fontSize:9, fontWeight:700, color:"#f97316", background:"#431a0522", border:"1px solid #f9731655", borderRadius:3, padding:"3px 9px", fontFamily:mono }}>UNPAID</span>
            }
            {/* Expand toggle */}
            <button onClick={() => setExpanded(prev => ({...prev,[k]:!prev[k]}))}
              style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:5, padding:"6px 12px", fontSize:10, fontWeight:600, color:T.muted, cursor:"pointer", fontFamily:mono, display:"flex",alignItems:"center",gap:5, letterSpacing:"0.08em" }}>
              {expanded[k] ? "LESS" : "MORE"}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform:expanded[k]?"rotate(180deg)":"rotate(0deg)", transition:"0.2s" }}><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button onClick={() => setConfirmCancel({ type:p.type, id:p.id, name:p.name, role:group.role, flag:p.flag })}
              style={{ background:"none", border:`1px solid #ef444433`, borderRadius:5, padding:"6px 10px", fontSize:9, fontWeight:700, color:"#f87171", cursor:"pointer", letterSpacing:"0.1em", fontFamily:mono }}>
              OFFBOARD
            </button>
          </div>
        </div>
      </div>
    );
  };


  const EditorExpanded = ({ p, k }) => {
    const mo = monthsActive(k); const rate = parseRate(p.rate);
    const del = delivered[k]||0; const target = 24;
    const delPct = Math.min(100,Math.round((del/target)*100));
    const paid = isPaid(k);
    return (
      <div style={{ borderTop:`1px solid ${T.line}`, padding:"18px 20px", display:"flex",flexDirection:"column", gap:14 }}>
        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {[["STARTED", getStartDate(k).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})],
            ["TENURE", `${mo} mo`],
            ["TOTAL PAID", `AED ${(mo*rate).toLocaleString()}`],
            ["WORKLOAD", p.workload||"—"],
          ].map(([label,val]) => (
            <div key={label} style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:6, padding:"10px 12px" }}>
              <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.15em", color:T.dim, fontFamily:mono, marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {/* Deliverables */}
          <div style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:6, padding:"14px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.14em", color:T.dim, fontFamily:mono }}>DELIVERED THIS MONTH</div>
              <span style={{ fontSize:11, fontWeight:700, color:T.ink, fontFamily:mono }}>{del}/{target}</span>
            </div>
            <div style={{ height:4, background:T.raised, borderRadius:99, overflow:"hidden", marginBottom:10 }}>
              <div style={{ height:"100%", width:`${delPct}%`, background:delPct>=80?"#34d399":delPct>=50?T.gold:"#f97316", borderRadius:99, transition:"width 0.3s" }} />
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={() => setDelivered(prev => ({...prev,[k]:Math.max(0,(prev[k]||0)-1)}))}
                style={{ flex:1, background:T.surface, border:`1px solid ${T.line}`, borderRadius:4, padding:"5px", fontSize:14, color:T.muted, cursor:"pointer" }}>−</button>
              <button onClick={() => setDelivered(prev => ({...prev,[k]:Math.min(target,(prev[k]||0)+1)}))}
                style={{ flex:1, background:T.surface, border:`1px solid ${T.line}`, borderRadius:4, padding:"5px", fontSize:14, color:T.ink, cursor:"pointer" }}>+</button>
            </div>
          </div>

          {/* Payment */}
          <div style={{ background:paid?"#05462033":T.lift, border:`1px solid ${paid?"#34d39944":T.line}`, borderRadius:6, padding:"14px 16px", display:"flex",flexDirection:"column", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.14em", color:T.dim, fontFamily:mono, marginBottom:5 }}>THIS MONTH'S PAYMENT</div>
              <div style={{ fontSize:18, fontWeight:800, color:paid?"#34d399":T.ink, fontFamily:mono, marginBottom:3 }}>AED {rate.toLocaleString()}</div>
              <div style={{ fontSize:10, color:T.dim }}>Due {nextPayDate()}</div>
            </div>
            <button onClick={() => togglePaid(k)}
              style={{ marginTop:10, background:paid?"#34d39922":T.gold, border:paid?"1px solid #34d39944":"none", borderRadius:6, padding:"8px", fontSize:10, fontWeight:700, color:paid?"#34d399":"#fff", cursor:"pointer", letterSpacing:"0.1em", fontFamily:mono }}>
              {paid?"✓ MARKED AS PAID":"MARK AS PAID"}
            </button>
          </div>
        </div>

        {/* Bank details */}
        {p.bank && (
          <div style={{ background:T.goldBg, border:`1px solid ${T.goldLine}`, borderRadius:6, padding:"12px 16px" }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.15em", color:T.gold, fontFamily:mono, marginBottom:8 }}>BANK TRANSFER DETAILS</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[["BANK",p.bank.name],["IBAN",p.bank.iban],["SWIFT",p.bank.swift]].map(([l,v]) => (
                <div key={l}>
                  <div style={{ fontSize:8, color:T.dim, fontFamily:mono, letterSpacing:"0.12em", marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:T.ink, fontFamily:mono }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.15em", color:T.dim, fontFamily:mono, marginBottom:6 }}>PRIVATE NOTES</div>
          {editingNote===k ? (
            <textarea autoFocus value={notes[k]||""} onChange={e => setNotes(prev=>({...prev,[k]:e.target.value}))} onBlur={() => setEditingNote(null)}
              placeholder="Add a private note..." rows={2}
              style={{ width:"100%", background:T.lift, border:`1px solid ${T.goldLine}`, borderRadius:6, padding:"10px 12px", color:T.ink, fontSize:12, outline:"none", resize:"none", fontFamily:"'DM Sans',sans-serif", lineHeight:1.6, boxSizing:"border-box" }} />
          ) : (
            <div onClick={() => setEditingNote(k)} style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:6, padding:"10px 12px", cursor:"text", minHeight:38, display:"flex", alignItems:"center" }}>
              <span style={{ fontSize:12, color:notes[k]?T.muted:T.ghost, fontStyle:notes[k]?"normal":"italic" }}>{notes[k]||"Click to add a private note..."}</span>
            </div>
          )}
        </div>
      </div>
    );
  };


  const SimpleExpanded = ({ p, k }) => {
    const mo = monthsActive(k); const rate = parseRate(p.rate);
    const paid = isPaid(k);
    return (
      <div style={{ borderTop:`1px solid ${T.line}`, padding:"18px 20px", display:"flex",flexDirection:"column", gap:12 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {[["STARTED", getStartDate(k).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})],
            ["TENURE", `${mo} month${mo!==1?"s":""}`],
            ["TOTAL PAID", `AED ${(mo*rate).toLocaleString()}`],
          ].map(([label,val]) => (
            <div key={label} style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:6, padding:"10px 12px" }}>
              <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.15em", color:T.dim, fontFamily:mono, marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{val}</div>
            </div>
          ))}
        </div>
        {/* Payment */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between", background:paid?"#05462033":T.lift, border:`1px solid ${paid?"#34d39944":T.line}`, borderRadius:6, padding:"12px 16px" }}>
          <div>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.14em", color:T.dim, fontFamily:mono, marginBottom:4 }}>NEXT PAYMENT</div>
            <div style={{ fontSize:16, fontWeight:800, color:paid?"#34d399":T.ink, fontFamily:mono }}>{p.rate}</div>
            <div style={{ fontSize:10, color:T.dim, marginTop:2 }}>Due {nextPayDate()}</div>
          </div>
          <button onClick={() => togglePaid(k)}
            style={{ background:paid?"#34d39922":T.gold, border:paid?"1px solid #34d39944":"none", borderRadius:6, padding:"9px 18px", fontSize:10, fontWeight:700, color:paid?"#34d399":"#fff", cursor:"pointer", letterSpacing:"0.1em", fontFamily:mono }}>
            {paid?"✓ PAID":"MARK AS PAID"}
          </button>
        </div>
        {/* Bank */}
        {p.bank && (
          <div style={{ background:T.goldBg, border:`1px solid ${T.goldLine}`, borderRadius:6, padding:"12px 16px" }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.15em", color:T.gold, fontFamily:mono, marginBottom:8 }}>BANK TRANSFER DETAILS</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[["BANK",p.bank.name],["IBAN",p.bank.iban],["SWIFT",p.bank.swift]].map(([l,v]) => (
                <div key={l}>
                  <div style={{ fontSize:8, color:T.dim, fontFamily:mono, letterSpacing:"0.12em", marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:T.ink, fontFamily:mono }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Notes */}
        <div>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.15em", color:T.dim, fontFamily:mono, marginBottom:6 }}>PRIVATE NOTES</div>
          {editingNote===k ? (
            <textarea autoFocus value={notes[k]||""} onChange={e => setNotes(prev=>({...prev,[k]:e.target.value}))} onBlur={() => setEditingNote(null)}
              placeholder="Add a private note..." rows={2}
              style={{ width:"100%", background:T.lift, border:`1px solid ${T.goldLine}`, borderRadius:6, padding:"10px 12px", color:T.ink, fontSize:12, outline:"none", resize:"none", fontFamily:"'DM Sans',sans-serif", lineHeight:1.6, boxSizing:"border-box" }} />
          ) : (
            <div onClick={() => setEditingNote(k)} style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:6, padding:"10px 12px", cursor:"text", minHeight:38, display:"flex", alignItems:"center" }}>
              <span style={{ fontSize:12, color:notes[k]?T.muted:T.ghost, fontStyle:notes[k]?"normal":"italic" }}>{notes[k]||"Click to add a private note..."}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ flex:1, overflowY:"auto", background:T.base }}>
      {/* Offboard confirm modal */}
      {confirmCancel && (
        <div style={{ position:"fixed", inset:0, background:"#00000099", zIndex:1000, display:"flex",alignItems:"center",justifyContent:"center", backdropFilter:"blur(4px)" }}
          onClick={() => setConfirmCancel(null)}>
          <div style={{ background:T.surface, border:`1px solid ${T.lineHi}`, borderRadius:12, width:440, overflow:"hidden", boxShadow:"0 40px 80px #00000088" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding:"24px 28px 20px", borderBottom:`1px solid ${T.line}` }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:"#f87171", fontFamily:mono, marginBottom:8 }}>REMOVE FROM PAYROLL</div>
              <div style={{ fontSize:20, fontWeight:800, color:T.ink, marginBottom:4 }}>Offboard {confirmCancel.name}?</div>
              <div style={{ fontSize:13, color:T.muted }}>{confirmCancel.flag} {confirmCancel.role}</div>
            </div>
            <div style={{ padding:"22px 28px" }}>
              <div style={{ background:"#3b0a0a22", border:"1px solid #ef444433", borderRadius:8, padding:"16px 18px", marginBottom:24 }}>
                <p style={{ fontSize:13, color:T.muted, lineHeight:1.75, margin:0 }}>This will remove <span style={{ color:T.ink, fontWeight:700 }}>{confirmCancel.name}</span> from your active roster and cancel their retainer. This action cannot be undone.</p>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => setConfirmCancel(null)} style={{ flex:1, background:"none", border:`1px solid ${T.line}`, borderRadius:6, padding:"11px", fontSize:12, fontWeight:600, color:T.muted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Keep</button>
                <button onClick={() => { cancelHire(confirmCancel.type, confirmCancel.id); setConfirmCancel(null); }}
                  style={{ flex:2, background:"#7f1d1d", border:"1px solid #ef444444", borderRadius:6, padding:"11px", fontSize:10, fontWeight:700, color:"#fca5a5", cursor:"pointer", letterSpacing:"0.12em", fontFamily:mono }}>
                  CONFIRM OFFBOARD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding:"22px 28px 18px", borderBottom:`1px solid ${T.line}` }}>
        <div style={{ fontSize:9, letterSpacing:"0.18em", color:T.dim, fontFamily:mono, marginBottom:6 }}>TALENT NETWORK</div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <h2 style={{ fontSize:24, fontWeight:800, color:T.ink, margin:0 }}>My Team</h2>
            <span style={{ fontSize:10, fontFamily:mono, color:T.dim, background:T.lift, border:`1px solid ${T.line}`, borderRadius:3, padding:"2px 8px" }}>{team.length} MEMBERS</span>
          </div>
          {team.length > 0 && <div style={{ fontSize:11, color:T.dim, fontFamily:mono }}>Next payroll: <span style={{ color:T.gold, fontWeight:700 }}>{nextPayDate()}</span></div>}
        </div>
      </div>

      {team.length === 0 ? (
        <div style={{ display:"flex",flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, padding:80, textAlign:"center" }}>
          <div style={{ fontSize:40 }}>👥</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.muted }}>No team members yet</div>
          <div style={{ fontSize:13, color:T.dim }}>Hire editors, videographers or VAs from Talent Network</div>
        </div>
      ) : (
        <div style={{ padding:"20px 28px 48px" }}>
          {[
            { label:"EDITORS", type:"editors", role:"Editor" },
            { label:"VIDEOGRAPHERS", type:"videographers", role:"Videographer" },
            { label:"VIRTUAL ASSISTANTS", type:"vas", role:"VA" },
          ].map(group => {
            const members = team.filter(p => p.type === group.type);
            if (!members.length) return null;
            return (
              <div key={group.type} style={{ marginBottom:32 }}>
                <div style={{ display:"flex",alignItems:"center",gap:12, marginBottom:12 }}>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:T.dim, fontFamily:mono }}>{group.label}</span>
                  <div style={{ height:1, flex:1, background:T.line }} />
                  <span style={{ fontSize:9, color:T.dim, fontFamily:mono }}>{members.length}</span>
                </div>
                <div style={{ display:"flex",flexDirection:"column", gap:8 }}>
                  {members.map(p => {
                    const k = `${p.type}-${p.id}`;
                    const sc = statusCfg[getStatus(k)];
                    const isOpen = expanded[k];
                    return (
                      <div key={p.id} style={{ background:T.surface, border:`1px solid ${isOpen ? T.lineHi : T.line}`, borderRadius:8, overflow:"hidden", transition:"border-color 0.2s" }}>
                        <div style={{ height:2, background:`linear-gradient(90deg,${p.avatarColor},${p.avatarColor}22)` }} />
                        {/* Collapsed row */}
                        <div style={{ padding:"13px 20px", display:"flex",alignItems:"center",gap:14 }}>
                          <div style={{ width:36, height:36, borderRadius:8, background:p.avatarColor+"22", border:`1.5px solid ${p.avatarColor}44`, display:"flex",alignItems:"center",justifyContent:"center", fontSize:12, fontWeight:800, color:p.avatarColor, flexShrink:0 }}>{p.avatar}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex",alignItems:"center",gap:8, marginBottom:3 }}>
                              <span style={{ fontSize:14, fontWeight:700, color:T.ink }}>{p.name}</span>
                              <span>{p.flag}</span>
                              <button onClick={() => cycleStatus(k)} style={{ fontSize:8, fontWeight:700, letterSpacing:"0.12em", color:sc.color, background:sc.bg, border:`1px solid ${sc.border}`, borderRadius:3, padding:"2px 7px", cursor:"pointer", fontFamily:mono }}>{getStatus(k)}</button>
                            </div>
                            <span style={{ fontSize:11, color:T.dim }}>{group.role} · {monthsActive(k)} mo · {p.rate}</span>
                          </div>
                          <div style={{ display:"flex",alignItems:"center",gap:8, flexShrink:0 }}>
                            {isPaid(k)
                              ? <span style={{ fontSize:9, fontWeight:700, color:"#34d399", background:"#05462033", border:"1px solid #34d39944", borderRadius:3, padding:"3px 8px", fontFamily:mono }}>✓ PAID</span>
                              : <span style={{ fontSize:9, fontWeight:700, color:"#f97316", background:"#431a0522", border:"1px solid #f9731655", borderRadius:3, padding:"3px 8px", fontFamily:mono }}>UNPAID</span>
                            }
                            <button onClick={() => setExpanded(prev => ({...prev,[k]:!prev[k]}))}
                              style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:5, padding:"5px 11px", fontSize:9, fontWeight:600, color:T.muted, cursor:"pointer", fontFamily:mono, display:"flex",alignItems:"center",gap:5, letterSpacing:"0.08em" }}>
                              {isOpen?"LESS":"MORE"}
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform:isOpen?"rotate(180deg)":"rotate(0)", transition:"0.2s" }}><path d="M6 9l6 6 6-6"/></svg>
                            </button>
                            <button onClick={() => setConfirmCancel({ type:p.type, id:p.id, name:p.name, role:group.role, flag:p.flag })}
                              style={{ background:"none", border:`1px solid #ef444433`, borderRadius:5, padding:"5px 10px", fontSize:9, fontWeight:700, color:"#f87171", cursor:"pointer", letterSpacing:"0.1em", fontFamily:mono }}>
                              OFFBOARD
                            </button>
                          </div>
                        </div>
                        {/* Expanded panel */}
                        {isOpen && (group.type === "editors"
                          ? <EditorExpanded p={p} k={k} />
                          : <SimpleExpanded p={p} k={k} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TalentNetwork({ hiredIds, setHiredIds }) {
  const mono = "'DM Mono', monospace";
  const [sub, setSub] = useState("editors");
  const [openProfile, setOpenProfile] = useState(null);

  const hire = (type, id) => setHiredIds(p => ({ ...p, [type]: [...(p[type]||[]), id] }));
  const cancelHire = (type, id) => setHiredIds(p => ({ ...p, [type]: (p[type]||[]).filter(x => x !== id) }));
  const [confirmCancel, setConfirmCancel] = useState(null);

  const [confirmHire, setConfirmHire] = useState(null);

  const HireConfirmModal = () => {
    if (!confirmHire) return null;
    const { type, id, name, role, rate, flag } = confirmHire;
    return (
      <div style={{ position:"fixed", inset:0, background:"#00000099", zIndex:1000, display:"flex",alignItems:"center",justifyContent:"center", backdropFilter:"blur(4px)" }}
        onClick={() => setConfirmHire(null)}>
        <div style={{ background:T.surface, border:`1px solid ${T.lineHi}`, borderRadius:12, width:460, overflow:"hidden", boxShadow:"0 40px 80px #00000088" }}
          onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div style={{ padding:"24px 28px 20px", borderBottom:`1px solid ${T.line}` }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:T.dim, fontFamily:"'DM Mono',monospace", marginBottom:8 }}>CONFIRM ONBOARDING</div>
            <div style={{ fontSize:20, fontWeight:800, color:T.ink, marginBottom:4 }}>Add {name} to your payroll?</div>
            <div style={{ fontSize:13, color:T.muted }}>{flag} {role} · {rate}</div>
          </div>
          {/* Body */}
          <div style={{ padding:"22px 28px" }}>
            <div style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:8, padding:"16px 18px", marginBottom:20 }}>
              <p style={{ fontSize:13, color:T.muted, lineHeight:1.75, margin:0 }}>
                By confirming, you are committing to onboard <span style={{ color:T.ink, fontWeight:700 }}>{name}</span> as part of The Clips Agency talent roster. This includes a recurring monthly retainer of <span style={{ color:T.gold, fontWeight:700 }}>{rate}</span>, payable directly to their registered bank account.
              </p>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:24 }}>
              <div style={{ width:16, height:16, borderRadius:3, background:T.goldBg, border:`1px solid ${T.goldLine}`, display:"flex",alignItems:"center",justifyContent:"center", flexShrink:0, marginTop:2 }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <span style={{ fontSize:12, color:T.muted, lineHeight:1.65 }}>Their bank details will be unlocked immediately so you can set up your first payment.</span>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirmHire(null)}
                style={{ flex:1, background:"none", border:`1px solid ${T.line}`, borderRadius:6, padding:"11px", fontSize:12, fontWeight:600, color:T.muted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                Cancel
              </button>
              <button onClick={() => { hire(type, id); setConfirmHire(null); }}
                style={{ flex:2, background:T.gold, border:"none", borderRadius:6, padding:"11px", fontSize:10, fontWeight:700, color:"#fff", cursor:"pointer", letterSpacing:"0.12em", fontFamily:"'DM Mono',monospace" }}>
                CONFIRM & ONBOARD
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CancelHireModal = () => {
    if (!confirmCancel) return null;
    const { type, id, name, role, flag } = confirmCancel;
    return (
      <div style={{ position:"fixed", inset:0, background:"#00000099", zIndex:1000, display:"flex",alignItems:"center",justifyContent:"center", backdropFilter:"blur(4px)" }}
        onClick={() => setConfirmCancel(null)}>
        <div style={{ background:T.surface, border:`1px solid ${T.lineHi}`, borderRadius:12, width:440, overflow:"hidden", boxShadow:"0 40px 80px #00000088" }}
          onClick={e => e.stopPropagation()}>
          <div style={{ padding:"24px 28px 20px", borderBottom:`1px solid ${T.line}` }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:"#f87171", fontFamily:"'DM Mono',monospace", marginBottom:8 }}>REMOVE FROM PAYROLL</div>
            <div style={{ fontSize:20, fontWeight:800, color:T.ink, marginBottom:4 }}>Offboard {name}?</div>
            <div style={{ fontSize:13, color:T.muted }}>{flag} {role}</div>
          </div>
          <div style={{ padding:"22px 28px" }}>
            <div style={{ background:"#3b0a0a22", border:"1px solid #ef444433", borderRadius:8, padding:"16px 18px", marginBottom:24 }}>
              <p style={{ fontSize:13, color:T.muted, lineHeight:1.75, margin:0 }}>
                This will remove <span style={{ color:T.ink, fontWeight:700 }}>{name}</span> from your active roster and cancel their monthly retainer. Their bank details will be locked again. This action cannot be undone.
              </p>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirmCancel(null)}
                style={{ flex:1, background:"none", border:`1px solid ${T.line}`, borderRadius:6, padding:"11px", fontSize:12, fontWeight:600, color:T.muted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                Keep Editor
              </button>
              <button onClick={() => { cancelHire(type, id); setConfirmCancel(null); }}
                style={{ flex:2, background:"#7f1d1d", border:"1px solid #ef444444", borderRadius:6, padding:"11px", fontSize:10, fontWeight:700, color:"#fca5a5", cursor:"pointer", letterSpacing:"0.12em", fontFamily:"'DM Mono',monospace" }}>
                CONFIRM OFFBOARD
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatusBadge = ({ status, type, id }) => {
    const isHired = (hiredIds[type]||[]).includes(id) || status === "hired";
    const isUnavailable = !isHired && status === "unavailable";
    const color = isHired ? "#34d399" : isUnavailable ? "#f87171" : "#f97316";
    const bg    = isHired ? "#05462033" : isUnavailable ? "#3b0a0a22" : "#431a0522";
    const bdr   = isHired ? "#34d39955" : isUnavailable ? "#ef444455" : "#f9731655";
    const label = isHired ? "HIRED" : isUnavailable ? "UNAVAILABLE" : "AVAILABLE";
    return (
      <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", fontFamily:mono,
        padding:"2px 8px", borderRadius:2, color, background:bg, border:`1px solid ${bdr}` }}>
        {label}
      </span>
    );
  };


  const ProfilePage = ({ person, type }) => {
    const isHired = (hiredIds[type]||[]).includes(person.id) || person.status === "hired";
    return (
      <div style={{ flex:1, overflowY:"auto", background:T.base }}>
        {/* Top bar */}
        <div style={{ padding:"20px 28px", borderBottom:`1px solid ${T.line}`, display:"flex",alignItems:"center",gap:14 }}>
          <button onClick={() => setOpenProfile(null)}
            style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", display:"flex",alignItems:"center",gap:6, fontSize:11, fontFamily:"'DM Sans',sans-serif", padding:0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 19l-7-7 7-7"/></svg>
            Talent Network
          </button>
          <div style={{ height:16, width:1, background:T.line }} />
          <span style={{ fontSize:12, color:T.muted }}>{person.name}</span>
        </div>

        <div style={{ padding:"28px 28px 60px" }}>
          {/* Hero */}
          <div style={{ display:"flex", gap:24, alignItems:"flex-start", marginBottom:32 }}>
            <div style={{ width:72, height:72, borderRadius:12, background:person.avatarColor+"22", border:`2px solid ${person.avatarColor}44`, display:"flex",alignItems:"center",justifyContent:"center", fontSize:22, fontWeight:800, color:person.avatarColor, flexShrink:0 }}>{person.avatar}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12, marginBottom:8 }}>
                <h2 style={{ fontSize:24, fontWeight:800, color:T.ink, margin:0 }}>{person.name}</h2>
                <span style={{ fontSize:16 }}>{person.flag}</span>
                <StatusBadge status={person.status} type={type} id={person.id} />
              </div>
              <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                {[["📍", person.country], ["💰", person.rate], ["🎬", person.workload]].map(([icon, val]) => (
                  <span key={val} style={{ fontSize:12, color:T.muted, display:"flex",alignItems:"center",gap:5 }}>{icon} {val}</span>
                ))}
              </div>
            </div>
            {!isHired ? (
              <button onClick={() => setConfirmHire({ type, id:person.id, name:person.name, role: type==="editors"?"Editor":"Videographer", rate:person.rate, flag:person.flag })}
                style={{ background:T.gold, border:"none", borderRadius:6, padding:"9px 22px", fontSize:10, fontWeight:700, color:"#fff", cursor:"pointer", letterSpacing:"0.12em", fontFamily:mono, whiteSpace:"nowrap" }}>
                Hire {type === "editors" ? "Editor" : "Videographer"}
              </button>
            ) : (
              <div style={{ display:"flex",flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#34d399", background:"#05462033", border:"1px solid #34d39944", borderRadius:6, padding:"9px 18px", fontFamily:mono, letterSpacing:"0.12em" }}>✓ HIRED</span>
                <button onClick={() => setConfirmCancel({ type, id:person.id, name:person.name, role: type==="editors"?"Editor":"Videographer", flag:person.flag })}
                  style={{ background:"none", border:"none", fontSize:10, color:"#f87171", cursor:"pointer", fontFamily:mono, letterSpacing:"0.1em", padding:0 }}>
                  CANCEL CONTRACT →
                </button>
              </div>
            )}
          </div>

          {/* Bio */}
          <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, padding:"20px 24px", marginBottom:28 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:T.dim, fontFamily:mono, marginBottom:10 }}>BIO</div>
            <p style={{ fontSize:13, color:T.muted, lineHeight:1.75, margin:0 }}>{person.bio}</p>
          </div>

          {/* Portfolio grid */}
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:T.dim, fontFamily:mono, marginBottom:14 }}>PORTFOLIO — 9 VIDEOS</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
              {person.portfolio.map((url, i) => (
                <div key={i} style={{ borderRadius:8, overflow:"hidden", background:T.surface, border:`1px solid ${T.line}`, aspectRatio:"16/9" }}>
                  <iframe src={url} width="100%" height="100%" style={{ border:"none", display:"block" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen title={`Portfolio ${i+1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Bank details — locked unless hired */}
          <div style={{ background: isHired ? T.surface : T.lift, border:`1px solid ${isHired ? T.goldLine : T.line}`, borderRadius:8, overflow:"hidden" }}>
            <div style={{ padding:"14px 24px", borderBottom:`1px solid ${isHired ? T.goldLine : T.line}`, display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isHired ? T.gold : T.dim} strokeWidth="2" strokeLinecap="round"><rect x="1" y="11" width="22" height="11" rx="2"/><path d="M1 11V9a2 2 0 012-2h2m14 0h2a2 2 0 012 2v2M7 7V5a5 5 0 0110 0v2"/></svg>
                <span style={{ fontSize:12, fontWeight:700, color: isHired ? T.gold : T.dim }}>Bank Details</span>
              </div>
              {!isHired && (
                <span style={{ fontSize:10, fontFamily:mono, color:T.dim, display:"flex",alignItems:"center",gap:5 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  Unlocks after hiring
                </span>
              )}
            </div>
            <div style={{ padding:"20px 24px" }}>
              {isHired ? (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {[["Bank", person.bank.name], ["Account", person.bank.account], ["IBAN", person.bank.iban], ["SWIFT", person.bank.swift]].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.15em", color:T.dim, fontFamily:mono, marginBottom:5 }}>{label}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.ink, fontFamily:mono }}>{val}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign:"center", padding:"20px 0" }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>🔒</div>
                  <div style={{ fontSize:13, color:T.dim }}>Hire this talent to unlock their payment details</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };


  const TalentGrid = ({ data, type, role }) => (
    <div style={{ padding:"28px 28px 60px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
        {data.map(person => {
          const isHired = (hiredIds[type]||[]).includes(person.id) || person.status === "hired";
          return (
            <div key={person.id} className="card-hover" style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, overflow:"hidden", position:"relative", cursor:"pointer" }}
              onClick={() => setOpenProfile({ person, type })}>
              {/* Top accent */}
              <div style={{ height:3, background:`linear-gradient(90deg, ${person.avatarColor}, ${person.avatarColor}33)` }} />
              <div style={{ padding:"20px 22px" }}>
                {/* Header row */}
                <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:16 }}>
                  <div style={{ width:52, height:52, borderRadius:10, background:person.avatarColor+"22", border:`1.5px solid ${person.avatarColor}44`, display:"flex",alignItems:"center",justifyContent:"center", fontSize:16, fontWeight:800, color:person.avatarColor, flexShrink:0 }}>
                    {person.avatar}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8, marginBottom:5 }}>
                      <span style={{ fontSize:15, fontWeight:700, color:T.ink }}>{person.name}</span>
                      <span style={{ fontSize:14 }}>{person.flag}</span>
                    </div>
                    <StatusBadge status={person.status} type={type} id={person.id} />
                  </div>
                </div>
                {/* Stats row */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:18 }}>
                  {[
                    ["COUNTRY", person.country],
                    ["RATE", person.rate],
                    ["WORKLOAD", person.workload],
                  ].map(([label, val]) => (
                    <div key={label} style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:5, padding:"9px 10px" }}>
                      <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.15em", color:T.dim, fontFamily:mono, marginBottom:4 }}>{label}</div>
                      <div style={{ fontSize:11, fontWeight:600, color:T.muted }}>{val}</div>
                    </div>
                  ))}
                </div>
                {/* CTA */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => setOpenProfile({ person, type })}
                    style={{ background:"none", border:"none", color:T.dim, fontSize:10, fontFamily:mono, cursor:"pointer", letterSpacing:"0.08em", padding:0 }}>
                    VIEW PROFILE →
                  </button>
                  {!isHired ? (
                    <button onClick={(e) => { e.stopPropagation(); setConfirmHire({ type, id:person.id, name:person.name, role: type==="editors"?"Editor":"Videographer", rate:person.rate, flag:person.flag }); }}
                      style={{ background:T.gold, border:"none", borderRadius:6, padding:"9px 22px", fontSize:10, fontWeight:700, color:"#fff", cursor:"pointer", letterSpacing:"0.12em", fontFamily:mono }}>
                      Hire {role}
                    </button>
                  ) : (
                    <span style={{ fontSize:10, fontWeight:700, color:"#34d399", background:"#05462033", border:"1px solid #34d39944", borderRadius:4, padding:"6px 14px", fontFamily:mono }}>✓ HIRED</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );


  const VAGrid = () => (
    <div style={{ padding:"28px 28px 60px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
        {VA_DATA.map(va => {
          const isHired = (hiredIds.vas||[]).includes(va.id) || va.status === "hired";
          return (
            <div key={va.id} className="card-hover" style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, overflow:"hidden" }}>
              <div style={{ height:3, background:`linear-gradient(90deg, ${va.avatarColor}, ${va.avatarColor}33)` }} />
              <div style={{ padding:"20px 22px" }}>
                <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:16 }}>
                  <div style={{ width:48, height:48, borderRadius:10, background:va.avatarColor+"22", border:`1.5px solid ${va.avatarColor}44`, display:"flex",alignItems:"center",justifyContent:"center", fontSize:15, fontWeight:800, color:va.avatarColor, flexShrink:0 }}>
                    {va.avatar}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8, marginBottom:5 }}>
                      <span style={{ fontSize:15, fontWeight:700, color:T.ink }}>{va.name}</span>
                      <span style={{ fontSize:14 }}>{va.flag}</span>
                    </div>
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                      <span style={{ fontSize:10, color:T.dim, fontFamily:mono }}>{va.role}</span>
                      <span style={{ color:T.line }}>·</span>
                      <StatusBadge status={va.status} type="vas" id={va.id} />
                    </div>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                  {[["RATE", va.rate], ["TIMEZONE", va.tz]].map(([label, val]) => (
                    <div key={label} style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:5, padding:"9px 10px" }}>
                      <div style={{ fontSize:8, fontWeight:700, letterSpacing:"0.15em", color:T.dim, fontFamily:mono, marginBottom:4 }}>{label}</div>
                      <div style={{ fontSize:11, fontWeight:600, color:T.muted }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:16 }}>
                  {va.skills.map(s => (
                    <span key={s} style={{ fontSize:9, fontFamily:mono, color:T.muted, background:T.lift, border:`1px solid ${T.line}`, borderRadius:3, padding:"2px 8px" }}>{s}</span>
                  ))}
                </div>
                <div style={{ display:"flex", justifyContent:"flex-end" }}>
                  {!isHired ? (
                    <button onClick={() => setConfirmHire({ type:"vas", id:va.id, name:va.name, role:va.role, rate:va.rate, flag:va.flag })}
                      style={{ background:T.gold, border:"none", borderRadius:6, padding:"9px 22px", fontSize:10, fontWeight:700, color:"#fff", cursor:"pointer", letterSpacing:"0.12em", fontFamily:mono }}>
                      Hire VA
                    </button>
                  ) : (
                    <span style={{ fontSize:10, fontWeight:700, color:"#34d399", background:"#05462033", border:"1px solid #34d39944", borderRadius:4, padding:"6px 14px", fontFamily:mono }}>✓ HIRED</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );


  const StudiosGrid = () => (
    <div style={{ padding:"28px 28px 60px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
        {STUDIOS_DATA.map(studio => (
          <div key={studio.id} className="card-hover" style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, overflow:"hidden" }}>
            <div style={{ height:3, background:`linear-gradient(90deg, ${studio.available ? T.gold : T.dim}, transparent)` }} />
            <div style={{ padding:"20px 22px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <div>
                  <div style={{ display:"flex",alignItems:"center",gap:8, marginBottom:5 }}>
                    <span style={{ fontSize:15, fontWeight:700, color:T.ink }}>{studio.name}</span>
                    <span style={{ fontSize:14 }}>{studio.flag}</span>
                  </div>
                  <div style={{ fontSize:12, color:T.dim }}>📍 {studio.location}</div>
                </div>
                <div>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", fontFamily:mono,
                    padding:"2px 8px", borderRadius:2,
                    color: studio.available ? "#f97316" : T.dim,
                    background: studio.available ? "#431a0522" : T.lift,
                    border: `1px solid ${studio.available ? "#f9731655" : T.line}` }}>
                    {studio.available ? "AVAILABLE" : "BOOKED"}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div style={{ background:T.goldBg, border:`1px solid ${T.goldLine}`, borderRadius:5, padding:"10px 14px", marginBottom:14, display:"inline-flex", alignItems:"center", gap:8 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                <span style={{ fontSize:13, fontWeight:700, color:T.gold, fontFamily:mono }}>{studio.pricePerHour}</span>
              </div>

              {/* Backgrounds */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.15em", color:T.dim, fontFamily:mono, marginBottom:7 }}>BACKGROUNDS</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {studio.backgrounds.map(bg => (
                    <span key={bg} style={{ fontSize:10, color:T.muted, background:T.lift, border:`1px solid ${T.line}`, borderRadius:3, padding:"3px 9px", fontFamily:mono }}>{bg}</span>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.15em", color:T.dim, fontFamily:mono, marginBottom:7 }}>AMENITIES</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {studio.amenities.map(a => (
                    <span key={a} style={{ fontSize:10, color:T.gold, background:T.goldBg, border:`1px solid ${T.goldLine}`, borderRadius:3, padding:"3px 9px", fontFamily:mono }}>{a}</span>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <button style={{ background: studio.available ? T.gold : T.lift, border:`1px solid ${studio.available ? T.gold : T.line}`, borderRadius:6, padding:"9px 22px", fontSize:10, fontWeight:700, color: studio.available ? "#fff" : T.dim, cursor:studio.available ? "pointer" : "not-allowed", letterSpacing:"0.12em", fontFamily:mono }}>
                  {studio.available ? "Book Studio" : "Unavailable"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TABS = [
    { id:"editors", label:"Editors" },
    { id:"videographers", label:"Videographers" },
    { id:"studios", label:"Studios" },
    { id:"va", label:"VA" },
  ];
  if (openProfile) return <>
    <HireConfirmModal />
    <CancelHireModal />
    <ProfilePage person={openProfile.person} type={openProfile.type} />
  </>;

  return (
    <>
    <HireConfirmModal />
    <CancelHireModal />
    <div style={{ flex:1, display:"flex",flexDirection:"column", overflow:"hidden" }}>
      {/* Page header */}
      <div style={{ padding:"22px 28px 0", background:T.base, flexShrink:0 }}>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:9, letterSpacing:"0.18em", color:T.dim, fontFamily:mono, marginBottom:6 }}>STUDIO</div>
          <h2 style={{ fontSize:24, fontWeight:800, color:T.ink, margin:0 }}>Talent Network</h2>
        </div>
        {/* Sub-tabs */}
        <div style={{ display:"flex", borderBottom:`1px solid ${T.line}` }}>
          {TABS.map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setSub(t.id)}
              style={{ padding:"9px 20px", fontSize:12, fontWeight:sub===t.id?700:500, color:sub===t.id?T.gold:T.dim, background:"none", border:"none", borderBottom:`2px solid ${sub===t.id?T.gold:"transparent"}`, cursor:"pointer", marginBottom:-1, fontFamily:"'DM Sans',sans-serif" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex:1, overflowY:"auto", background:T.base }}>
        {sub==="editors"       && <TalentGrid data={EDITORS_DATA} type="editors" role="Editor" />}
        {sub==="videographers" && <TalentGrid data={VIDEOGRAPHERS_DATA} type="videographers" role="Videographer" />}
        {sub==="studios"       && <StudiosGrid />}
        {sub==="va"            && <VAGrid />}
      </div>
    </div>
    </>
  );
}

const CLIPS_TEAM = [
  { id:"clips-1", name:"Jad Meski", avatar:"JM", avatarColor:"#c084fc", role:"Creative Director", flag:"🇱🇧" },
  { id:"clips-2", name:"Lara Khoury", avatar:"LK", avatarColor:"#ECC3FF", role:"Account Manager", flag:"🇱🇧" },
  { id:"clips-3", name:"Tariq Salem", avatar:"TS", avatarColor:"#38bdf8", role:"Strategy Lead", flag:"🇦🇪" },
];

const AGENCY_REPLIES = [
  "On it! Will update you shortly.",
  "Great question — let me check with the team.",
  "Noted, we'll get that sorted today.",
  "Thanks for the heads up. We're on it.",
  "Can you send over more details? Happy to help.",
  "Done! Let us know if you need anything else.",
];

function ChatPage({ hiredIds }) {
  const mono = "'DM Mono', monospace";
  const allTalent = [
    ...EDITORS_DATA.map(p => ({ ...p, type:"editors", role:"Editor", isTeam:false })),
    ...VIDEOGRAPHERS_DATA.map(p => ({ ...p, type:"videographers", role:"Videographer", isTeam:false })),
    ...VA_DATA.map(p => ({ ...p, type:"vas", role:p.role, isTeam:false })),
  ];
  const hiredTalent = allTalent.filter(p => (hiredIds[p.type]||[]).includes(p.id) || p.status === "hired");
  const AGENCY_GROUP = { id:"agency", name:"The Clips Agency", avatar:"CA", avatarColor:"#c084fc", role:"Team · 3 members", flag:"", isGroup:true,
    pinned:true,
    seedMessages:[
      { from:"them", speaker:"Lara Khoury", text:"Welcome to the team chat! This is your direct line to the Clips Agency team.", ts:"9:00 AM" },
      { from:"them", speaker:"Jad Meski", text:"Feel free to share updates, ask questions, or flag anything here.", ts:"9:01 AM" },
    ]
  };

  const [messages, setMessages] = useState({ agency: AGENCY_GROUP.seedMessages });
  const [activeId, setActiveId] = useState("agency");
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, activeId]);

  const conversations = [AGENCY_GROUP, ...hiredTalent];
  const active = conversations.find(c => c.id === (activeId || "agency")) || AGENCY_GROUP;
  const msgs = messages[active.id] || [];

  const send = () => {
    if (!input.trim()) return;
    const msg = { from:"me", text:input.trim(), ts: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) };
    setMessages(prev => ({ ...prev, [active.id]: [...(prev[active.id]||[]), msg] }));
    setInput("");
    setTimeout(() => {
      const replyText = AGENCY_REPLIES[Math.floor(Math.random()*AGENCY_REPLIES.length)];
      const speaker = active.isGroup ? CLIPS_TEAM[Math.floor(Math.random()*CLIPS_TEAM.length)].name : active.name;
      const reply = { from:"them", speaker: active.isGroup ? speaker : null, text:replyText, ts: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) };
      setMessages(prev => ({ ...prev, [active.id]: [...(prev[active.id]||[]), reply] }));
    }, 900 + Math.random()*600);
  };

  return (
    <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
      {/* Sidebar */}
      <div style={{ width:272, borderRight:`1px solid ${T.line}`, display:"flex",flexDirection:"column", flexShrink:0, background:T.surface }}>
        <div style={{ padding:"20px 18px 14px", borderBottom:`1px solid ${T.line}` }}>
          <div style={{ fontSize:9, letterSpacing:"0.18em", color:T.dim, fontFamily:mono, marginBottom:6 }}>MESSAGES</div>
          <h2 style={{ fontSize:20, fontWeight:800, color:T.ink, margin:0 }}>Chat</h2>
        </div>

        <div style={{ flex:1, overflowY:"auto" }}>
          {/* Pinned — Agency group */}
          <div style={{ padding:"8px 10px 4px 18px" }}>
            <span style={{ fontSize:8, fontWeight:700, letterSpacing:"0.18em", color:T.ghost, fontFamily:mono }}>PINNED</span>
          </div>
          {[AGENCY_GROUP].map(c => {
            const lastMsg = (messages[c.id]||[]).slice(-1)[0];
            const isActive = activeId === c.id;
            return (
              <div key={c.id} onClick={() => setActiveId(c.id)} className="row-hover"
                style={{ padding:"12px 18px", cursor:"pointer", background: isActive ? T.lift :"transparent", display:"flex", gap:12, alignItems:"center", borderLeft: isActive ? `2px solid ${T.gold}` : "2px solid transparent" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#c084fc33,#ECC3FF22)", border:`1.5px solid ${T.gold}44`, display:"flex",alignItems:"center",justifyContent:"center", fontSize:12, fontWeight:800, color:T.gold, flexShrink:0, position:"relative" }}>
                  CA
                  <div style={{ position:"absolute", bottom:-2, right:-2, width:9, height:9, borderRadius:"50%", background:"#34d399", border:`2px solid ${T.surface}` }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>The Clips Agency</span>
                    {lastMsg && <span style={{ fontSize:9, color:T.dim, fontFamily:mono }}>{lastMsg.ts}</span>}
                  </div>
                  <span style={{ fontSize:11, color:T.dim, display:"block", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {lastMsg ? lastMsg.text.slice(0,34)+"…" : "Team · 3 members"}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Hired talent DMs */}
          {hiredTalent.length > 0 && (
            <>
              <div style={{ padding:"14px 10px 4px 18px" }}>
                <span style={{ fontSize:8, fontWeight:700, letterSpacing:"0.18em", color:T.ghost, fontFamily:mono }}>DIRECT MESSAGES</span>
              </div>
              {hiredTalent.map(p => {
                const lastMsg = (messages[p.id]||[]).slice(-1)[0];
                const isActive = activeId === p.id;
                return (
                  <div key={p.id} onClick={() => setActiveId(p.id)} className="row-hover"
                    style={{ padding:"12px 18px", cursor:"pointer", background: isActive ? T.lift :"transparent", display:"flex", gap:12, alignItems:"center", borderLeft: isActive ? `2px solid ${p.avatarColor}` : "2px solid transparent" }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:p.avatarColor+"22", border:`1.5px solid ${isActive ? p.avatarColor : p.avatarColor+"44"}`, display:"flex",alignItems:"center",justifyContent:"center", fontSize:12, fontWeight:800, color:p.avatarColor, flexShrink:0, position:"relative" }}>
                      {p.avatar}
                      <div style={{ position:"absolute", bottom:-2, right:-2, width:9, height:9, borderRadius:"50%", background:"#34d399", border:`2px solid ${T.surface}` }} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
                        <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{p.name}</span>
                        {lastMsg && <span style={{ fontSize:9, color:T.dim, fontFamily:mono }}>{lastMsg.ts}</span>}
                      </div>
                      <span style={{ fontSize:11, color:T.dim, display:"block", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {lastMsg ? lastMsg.text.slice(0,34)+"…" : p.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Chat pane */}
      <div style={{ flex:1, display:"flex",flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"14px 24px", borderBottom:`1px solid ${T.line}`, display:"flex",alignItems:"center",gap:14, flexShrink:0, background:T.surface }}>
          <div style={{ width:38, height:38, borderRadius:9, background: active.isGroup ? `linear-gradient(135deg,#c084fc33,#ECC3FF22)` : active.avatarColor+"22", border:`1.5px solid ${active.isGroup ? T.gold : active.avatarColor}44`, display:"flex",alignItems:"center",justifyContent:"center", fontSize:12, fontWeight:800, color: active.isGroup ? T.gold : active.avatarColor }}>
            {active.isGroup ? "CA" : active.avatar}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{active.name} {active.flag}</div>
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#34d399" }} />
              <span style={{ fontSize:11, color:"#34d399", fontFamily:mono }}>
                {active.isGroup ? "3 members online" : `Online · ${active.role}`}
              </span>
            </div>
          </div>
          {active.isGroup && (
            <div style={{ display:"flex", gap:-6 }}>
              {CLIPS_TEAM.map((m,i) => (
                <div key={m.id} style={{ width:26, height:26, borderRadius:"50%", background:m.avatarColor+"33", border:`1.5px solid ${T.surface}`, display:"flex",alignItems:"center",justifyContent:"center", fontSize:9, fontWeight:800, color:m.avatarColor, marginLeft: i===0?0:-8 }}>
                  {m.avatar}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px 28px 16px", display:"flex",flexDirection:"column", gap:14, background:T.base }}>
          {msgs.length === 0 && (
            <div style={{ textAlign:"center", marginTop:60 }}>
              <div style={{ fontSize:28, marginBottom:10 }}>💬</div>
              <div style={{ fontSize:13, color:T.dim }}>Start a conversation with {active.name}</div>
            </div>
          )}
          {msgs.map((m, i) => {
            const isMe = m.from === "me";
            const avatarColor = active.isGroup ? "#c084fc" : active.avatarColor;
            const avatarLabel = active.isGroup ? (CLIPS_TEAM.find(t => t.name === m.speaker)?.avatar || "CA") : active.avatar;
            return (
              <div key={i} style={{ display:"flex", justifyContent:isMe?"flex-end":"flex-start", alignItems:"flex-end", gap:10 }}>
                {!isMe && (
                  <div style={{ display:"flex",flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:avatarColor+"22", border:`1px solid ${avatarColor}33`, display:"flex",alignItems:"center",justifyContent:"center", fontSize:10, fontWeight:800, color:avatarColor, flexShrink:0 }}>
                      {avatarLabel}
                    </div>
                  </div>
                )}
                <div style={{ maxWidth:"62%" }}>
                  {!isMe && m.speaker && <div style={{ fontSize:10, fontWeight:600, color:T.dim, marginBottom:4, fontFamily:mono }}>{m.speaker}</div>}
                  <div style={{ background: isMe ? T.gold : T.surface, border: isMe ? "none" : `1px solid ${T.line}`, borderRadius: isMe ? "14px 14px 3px 14px" : "14px 14px 14px 3px", padding:"11px 15px" }}>
                    <span style={{ fontSize:13, color: isMe ? "#fff" : T.ink, lineHeight:1.6 }}>{m.text}</span>
                  </div>
                  <div style={{ fontSize:9, color:T.ghost, fontFamily:mono, marginTop:4, textAlign:isMe?"right":"left" }}>{m.ts}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding:"14px 24px 20px", borderTop:`1px solid ${T.line}`, display:"flex", gap:10, alignItems:"center", flexShrink:0, background:T.surface }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); } }}
            placeholder={`Message ${active.name}...`}
            style={{ flex:1, background:T.lift, border:`1px solid ${T.line}`, borderRadius:8, padding:"12px 16px", color:T.ink, fontSize:13, outline:"none", fontFamily:"'DM Sans',sans-serif" }} />
          <button onClick={send}
            style={{ background:T.gold, border:"none", borderRadius:8, width:44, height:44, display:"flex",alignItems:"center",justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ page, setPage }) {
  const mono = "'DM Mono', monospace";
  const NAV = [
    { id:"studio", label:"Studio", icon:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>, sub:[] },
    { id:"chat", label:"Chat", icon:<><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>, sub:[] },
    { id:"talent", label:"Talent Network", icon:<><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/></>, sub:[
      { id:"myteam", label:"My Team", icon:<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></> }
    ] },
  ];
  return (
    <div style={{ width:200, background:T.base, borderRight:`1px solid ${T.line}`, display:"flex",flexDirection:"column", height:"100%", flexShrink:0 }}>
      {/* Logo */}
      <div style={{ padding:"22px 18px 18px", borderBottom:`1px solid ${T.line}` }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:4, background:T.gold, display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.base} strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:T.ink, letterSpacing:"-0.01em", fontFamily:"'DM Sans', sans-serif", lineHeight:1 }}>CLIPS</div>
            <div style={{ fontSize:9, fontWeight:600, color:T.gold, letterSpacing:"0.2em", fontFamily:mono }}>AGENCY</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding:"12px 14px", borderBottom:`1px solid ${T.line}` }}>
        <div style={{ position:"relative" }}>
          <svg style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)" }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.ghost} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input style={{ ...inputSt, paddingLeft:28, fontSize:11, background:T.surface }} placeholder="Search..." />
        </div>
      </div>

      {/* Nav */}
      <div style={{ padding:"10px 10px", flex:1, display:"flex",flexDirection:"column", gap:2 }}>
        {NAV.map(n => {
          const active = page === n.id;
          const childActive = (n.sub||[]).some(s => page === s.id);
          return (
            <div key={n.id}>
              <button onClick={() => setPage(n.id)}
                style={{ width:"100%", textAlign:"left", padding:"9px 12px", background: active ? T.goldBg :"transparent", border: active ? `1px solid ${T.goldLine}` : "1px solid transparent", borderRadius:4, display:"flex",alignItems:"center",gap:9, cursor:"pointer" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={active||childActive ? T.gold : T.dim} strokeWidth="2" strokeLinecap="round">{n.icon}</svg>
                <span style={{ fontSize:12, fontWeight: active||childActive ? 700 : 500, color: active||childActive ? T.gold : T.muted, fontFamily:"'DM Sans', sans-serif" }}>{n.label}</span>
              </button>
              {(n.sub||[]).map(s => {
                const sActive = page === s.id;
                return (
                  <button key={s.id} onClick={() => setPage(s.id)}
                    style={{ width:"100%", textAlign:"left", padding:"7px 12px 7px 32px", background: sActive ? T.goldBg :"transparent", border: sActive ? `1px solid ${T.goldLine}` : "1px solid transparent", borderRadius:4, display:"flex",alignItems:"center",gap:8, cursor:"pointer", marginTop:2 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={sActive ? T.gold : T.dim} strokeWidth="2" strokeLinecap="round">{s.icon}</svg>
                    <span style={{ fontSize:11, fontWeight: sActive ? 700 : 500, color: sActive ? T.gold : T.dim, fontFamily:"'DM Sans', sans-serif" }}>{s.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* User */}
      <div style={{ padding:"14px 16px", borderTop:`1px solid ${T.line}` }}>
        <div style={{ display:"flex",alignItems:"center",gap:9 }}>
          <div style={{ width:28, height:28, borderRadius:4, background:T.goldBg, border:`1px solid ${T.goldLine}`, display:"flex",alignItems:"center",justifyContent:"center", fontSize:10, fontWeight:800, color:T.gold, fontFamily:mono }}>OM</div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink, fontFamily:"'DM Sans', sans-serif" }}>Omar Meski</div>
            <div style={{ fontSize:9, color:T.dim, fontFamily:mono, letterSpacing:"0.1em" }}>ADMIN</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientsPage({ onSelect }) {
  return (
    <div style={{ flex:1, overflowY:"auto", background:T.base, padding:"36px 40px" }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom:40 }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:9, letterSpacing:"0.18em", color:T.dim, fontFamily:"'DM Mono', monospace", marginBottom:6 }}>CONTENT STUDIO</div>
            <h2 style={{ fontSize:24, fontWeight:800, color:T.ink, margin:0, fontFamily:"'DM Sans', sans-serif" }}>Client Workspace</h2>
          </div>
          <GoldBtn>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 4v16m8-8H4"/></svg>
            New Client
          </GoldBtn>
        </div>
        {/* Thin gold rule */}
        <div style={{ height:1, background:`linear-gradient(90deg, ${T.gold}, transparent)`, marginTop:24 }} />
      </div>

      {/* Stats */}
      <div className="fade-up fade-up-1" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:36 }}>
        {[
          { label:"Total Clients", value:"3", sub:"Active accounts" },
          { label:"Scripts Created", value:"24", sub:"Across all clients" },
          { label:"Sessions Filmed", value:"6", sub:"Production complete" },
        ].map((s, i) => (
          <div key={s.label} className="card-hover" style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:6, padding:"20px 22px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, width:3, height:"100%", background: i===0 ? T.gold : i===1 ? T.reach : T.conv }} />
            <div style={{ fontSize:10, color:T.dim, letterSpacing:"0.1em", fontFamily:"'DM Mono', monospace", marginBottom:10 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontSize:36, fontWeight:800, color:T.ink, fontFamily:"'DM Sans', sans-serif", lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Client list */}
      <div className="fade-up fade-up-2">
        <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:T.dim, fontFamily:"'DM Mono', monospace", marginBottom:14 }}>ALL CLIENTS</div>
        <div style={{ display:"flex",flexDirection:"column", gap:10 }}>
          {CLIENTS_DATA.map((c) => {
            const TABS = [
              { id:"strategy",   label:"Strategy",   icon:<><path d="M12 2L2 7l10 5 10-5-10-5"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></> },
              { id:"content",    label:"Content",    icon:<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></> },
              { id:"production", label:"Production", icon:<><polygon points="5 3 19 12 5 21 5 3"/></> },
            ];
            return (
              <div key={c.id} style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, overflow:"hidden" }}>
                <div style={{ height:2, background:`linear-gradient(90deg,${c.accent},${c.accent}22)` }} />
                <div style={{ padding:"16px 20px 14px", display:"flex",alignItems:"center",gap:14 }}>
                  {/* Monogram + name — clickable, opens Content */}
                  <div onClick={() => onSelect(c)} style={{ display:"flex",alignItems:"center",gap:14, flex:1, minWidth:0, cursor:"pointer" }}>
                    <div style={{ width:40, height:40, borderRadius:6, background:T.lift, border:`1px solid ${c.accent}44`, display:"flex",alignItems:"center",justifyContent:"center", fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight:700, color:c.accent, flexShrink:0 }}>
                      {c.initials}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:10, marginBottom:4 }}>
                        <span style={{ fontSize:15, fontWeight:700, color:T.ink }}>{c.name}</span>
                        <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", color: c.status==="Active" ? T.conv : T.dim, background: c.status==="Active" ? T.convBg : T.lift, border:`1px solid ${c.status==="Active" ? T.conv+"44" : T.line}`, padding:"2px 7px", borderRadius:2, fontFamily:"'DM Mono', monospace" }}>
                          {c.status.toUpperCase()}
                        </span>
                        <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", color: c.type==="team" ? "#f0abfc" : T.dim, background: c.type==="team" ? "#f0abfc14" : T.lift, border:`1px solid ${c.type==="team" ? "#f0abfc33" : T.line}`, padding:"2px 7px", borderRadius:2, fontFamily:"'DM Mono', monospace", display:"flex",alignItems:"center",gap:4 }}>
                          {c.type==="team" ? (
                            <><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>TEAM</>
                          ) : (
                            <><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>INDIVIDUAL</>
                          )}
                        </span>
                      </div>
                      <span style={{ fontSize:11, color:T.dim }}>{c.niche} · {c.scripts} scripts</span>
                    </div>
                  </div>
                  <div style={{ width:1, height:36, background:T.line, flexShrink:0 }} />
                  <div style={{ display:"flex",alignItems:"center",gap:6, flexShrink:0 }}>
                    <span style={{ fontSize:8, fontWeight:700, letterSpacing:"0.14em", color:T.ghost, fontFamily:"'DM Mono',monospace", marginRight:2 }}>JUMP TO</span>
                    {TABS.map(t => (
                      <button key={t.id} onClick={() => onSelect(c, t.id)}
                        style={{ display:"flex",alignItems:"center",gap:6, background:T.lift, border:`1px solid ${T.line}`, borderRadius:5, padding:"7px 13px", fontSize:11, fontWeight:600, color:T.muted, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background=c.accent+"22"; e.currentTarget.style.borderColor=c.accent+"66"; e.currentTarget.style.color=c.accent; }}
                        onMouseLeave={e => { e.currentTarget.style.background=T.lift; e.currentTarget.style.borderColor=T.line; e.currentTarget.style.color=T.muted; }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WorkspaceNav({ client, tab, setTab, onBack }) {
  const isTeam = client?.type === "team";
  const tabs = [
    { id:"strategy",   label:"Strategy" },
    ...(isTeam ? [{ id:"team", label:"Team", team:true }] : []),
    { id:"content",    label:"Content" },
    { id:"resources",  label:"Resources" },
    { id:"production", label:"Production" },
    { id:"clientview", label:"Client View", accent:true },
  ];
  return (
    <div style={{ height:48, borderBottom:`1px solid ${T.line}`, display:"flex", alignItems:"stretch", justifyContent:"space-between", background:T.surface, flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"stretch" }}>
        {tabs.map(t => (
          <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)}
            style={{ padding:"0 18px", fontSize:12, fontWeight: tab===t.id ? 700 : 500, color: tab===t.id ? (t.accent ? "#38bdf8" : t.team ? "#f0abfc" : T.gold) : t.accent ? "#38bdf844" : t.team ? "#f0abfc55" : T.dim, background:"transparent", border:"none", borderBottom:`2px solid ${tab===t.id ? (t.accent ? "#38bdf8" : t.team ? "#f0abfc" : T.gold) :"transparent"}`, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", letterSpacing:"0.04em", transition:"all 0.18s", display:"flex",alignItems:"center",gap:6 }}>
            {t.accent && <span style={{ width:5, height:5, borderRadius:"50%", background: tab===t.id ? "#38bdf8" : "#38bdf844", flexShrink:0 }} />}
            {t.team && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            )}
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:12, padding:"0 16px" }}>
        <div style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:4, padding:"5px 12px", display:"flex",alignItems:"center",gap:8 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background: isTeam ? "#f0abfc" : T.conv }} />
          <span style={{ fontSize:12, fontWeight:700, color:T.ink, fontFamily:"'DM Sans', sans-serif" }}>{client.name}</span>
          {isTeam && <span style={{ fontSize:9, color:"#f0abfc", fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", background:"#f0abfc14", border:"1px solid #f0abfc33", borderRadius:3, padding:"1px 6px" }}>TEAM</span>}
        </div>
        <button onClick={onBack} style={{ background:"none", border:"none", color:T.dim, fontSize:11, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", display:"flex",alignItems:"center",gap:4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 19l-7-7 7-7"/></svg>
          Clients
        </button>
      </div>
    </div>
  );
}

const AR = {
  "CLIENT FOUNDATION": "أساس العميل",
  "Foundation": "الأساس",
  "Paste Summary": "لصق الملخص",
  "Send to Client": "إرسال إلى العميل",
  "Positioning": "تحديد الموقع",
  "STEP 1": "الخطوة ١",
  "Preview as Client": "معاينة كعميل",
  "Doctor": "طبيب",
  "Clinic": "عيادة",
  "Business": "شركة",
  "Coach / Consultant": "مدرب / مستشار",
  "Real Estate": "عقارات",
  "PERSONAL & PROFESSIONAL": "الشخصية والمهنية",
  "OPINION & THOUGHT LEADERSHIP": "الرأي والقيادة الفكرية",
  "AUDIENCE ENGAGEMENT": "التواصل مع الجمهور",
  "INSPIRATIONS": "الإلهام",
  "IDENTITY & PUBLIC PERCEPTION": "الهوية والصورة العامة",
  "Full Name": "الاسم الكامل",
  "Profession / Title": "المهنة / المسمى الوظيفي",
  "Professional Bio": "السيرة المهنية",
  "Personal Bio": "السيرة الشخصية",
  "3 words that best describe you": "٣ كلمات تصفك أفضل وصف",
  "Which language would you like your videos to be in?": "بأي لغة تريد أن تكون فيديوهاتك؟",
  "Noteworthy Achievements": "إنجازات بارزة",
  "Social Media Links & Website": "روابط التواصل الاجتماعي والموقع",
  "What's a controversial or debatable topic in your space that you have a strong opinion on?": "ما هو موضوع مثير للجدل في مجالك لديك رأي قوي فيه؟",
  "What are the biggest challenges in your industry and how do you solve them?": "ما أكبر التحديات في مجالك وكيف تتعامل معها؟",
  "Who is your target audience?": "من هو جمهورك المستهدف؟",
  "What are the most common questions your audience asks you?": "ما أكثر الأسئلة الشائعة التي يطرحها جمهورك؟",
  "Who or what inspires your content style?": "من يلهم أسلوب المحتوى الخاص بك؟",
  "Do you have existing brand guidelines?": "هل لديك هوية بصرية موجودة مسبقاً؟",
  "How do you perceive yourself?": "كيف تنظر إلى نفسك؟",
  "How do others perceive you?": "كيف يراك الآخرون؟",
  "How would you like to be perceived?": "كيف تريد أن يُنظر إليك؟",
  "What is your medical specialty and what conditions do you treat?": "ما هو تخصصك الطبي والحالات التي تعالجها؟",
  "What makes your clinical approach different from other doctors?": "ما الذي يميز نهجك الطبي عن غيرك؟",
  "Who is your ideal patient?": "من هو مريضك المثالي؟",
  "What do patients feel before they find you, and after?": "ماذا يشعر المرضى قبل أن يجدوك وبعد ذلك؟",
  "What does a patient need to believe before booking with you?": "ماذا يحتاج المريض أن يؤمن به قبل الحجز معك؟",
  "What's the biggest myth in your field that you can debunk?": "ما أكبر خرافة في مجالك يمكنك دحضها؟",
  "What type of clinic do you run and what are your hero treatments?": "ما نوع العيادة التي تديرها وما علاجاتك الرئيسية؟",
  "Who is your ideal patient and what do they come in for?": "من هو مريضك المثالي ولماذا يأتي إليك؟",
  "What result or transformation does your clinic deliver?": "ما النتيجة أو التحول الذي تقدمه عيادتك؟",
  "What sets your clinic apart from others in the market?": "ما الذي يميز عيادتك عن غيرها في السوق؟",
  "How do new patients typically find and book with you?": "كيف يجدك المرضى الجدد ويحجزون معك؟",
  "What does someone need to believe before booking their first treatment?": "ماذا يحتاج الشخص أن يؤمن به قبل حجز أول علاج؟",
  "What does your business do and who is it for?": "ماذا تفعل شركتك ولمن هي؟",
  "What is your primary product or service — the one content should support?": "ما منتجك أو خدمتك الرئيسية التي يجب أن يدعمها المحتوى؟",
  "What problem do most customers think they have vs. the real problem?": "ما المشكلة التي يعتقد العملاء أنهم يواجهونها مقابل المشكلة الحقيقية؟",
  "What objections do customers have before they purchase?": "ما الاعتراضات التي يواجهها العملاء قبل الشراء؟",
  "Who is your best customer — who do you want more of?": "من هو أفضل عميل لديك؟",
  "What's the one thing you wish more people understood about what you do?": "ما الشيء الذي تتمنى أن يفهمه الناس أكثر عمّا تفعله؟",
  "What do you coach or consult on, and who do you help?": "على ماذا تدرّب أو تستشير، ومن تساعد؟",
  "What is your signature programme or offer?": "ما برنامجك أو عرضك المميز؟",
  "What is the transformation you deliver — before and after?": "ما التحول الذي تقدمه — قبل وبعد؟",
  "What do your clients try before they find you, and why does it fail?": "ماذا يجرب عملاؤك قبل أن يجدوك ولماذا يفشل؟",
  "What do you believe about your space that most people in it would disagree with?": "ما الذي تؤمن به في مجالك وكثيرون يختلفون معك عليه؟",
  "What does someone need to believe to be ready to work with you?": "ماذا يحتاج الشخص أن يؤمن به حتى يكون مستعداً للعمل معك؟",
  "What area of real estate do you specialise in?": "ما مجال العقارات الذي تتخصص فيه؟",
  "What markets or locations do you operate in?": "في أي أسواق أو مناطق تعمل؟",
  "Who is your ideal buyer, seller, or investor?": "من هو مشتريك أو بائعك أو مستثمرك المثالي؟",
  "What gives you an edge that other agents or investors don't have?": "ما الذي يميزك عن غيرك من الوكلاء أو المستثمرين؟",
  "What does someone need to believe before they work with you?": "ماذا يحتاج الشخص أن يؤمن به قبل العمل معك؟",
  "What's the biggest myth in your market that you can debunk?": "ما أكبر خرافة في سوقك يمكنك دحضها؟",
  "What you do, who you serve, your credentials.": "ما تفعله، من تخدم، مؤهلاتك.",
  "The human behind the brand — origin story, turning points.": "الإنسان خلف العلامة التجارية — قصة النشأة، نقاط التحول.",
  "Optional but powerful for content.": "اختياري لكنه قوي للمحتوى.",
  "OPTIONAL": "اختياري",
  "MISSING": "مفقود",
  "STRATEGY": "الاستراتيجية",
  "Content Positioning": "تحديد موقع المحتوى",
  "Four questions. The 20% that drives 80% of content clarity.": "أربعة أسئلة. الـ٢٠٪ التي تحرك ٨٠٪ من وضوح المحتوى.",
  "Content Pillar System": "منظومة ركائز المحتوى",
  "Three pillars. Each tied to the transformation. Each with a purpose and a topic bank.": "ثلاث ركائز. كل منها مرتبطة بالتحول. لكل منها غرض ومخزن مواضيع.",
  "TOPIC BUCKETS": "مجموعات المواضيع",
  "topics": "مواضيع",
  "sub": "فرعي",
  "+ ADD TOPIC": "+ إضافة موضوع",
  "+ ADD SUBTOPIC": "+ إضافة موضوع فرعي",
  "RATIO": "النسبة",
  "Send to Client": "إرسال إلى العميل",
  "The Trigger": "المحفّز",
  "When someone thinks about [problem or desire], what do you want them to immediately think of you for?": "عندما يفكر شخص ما في [مشكلة أو رغبة]، بماذا تريده أن يفكر فيك فوراً؟",
  "Describe the exact moment — the scroll, the stress, the search — when your ideal client should think of this creator.": "صف اللحظة بالضبط — التصفح، التوتر، البحث — التي يجب أن يفكر فيها عميلك المثالي في هذا المنشئ.",
  "The Enemy": "العدو",
  "What is the common advice in your space that you fundamentally disagree with?": "ما النصيحة الشائعة في مجالك التي تختلف معها جذرياً؟",
  "The enemy isn't a person — it's a bad idea, a broken belief, or lazy conventional wisdom. Great content is built on this tension.": "العدو ليس شخصاً — بل هو فكرة سيئة أو معتقد خاطئ أو حكمة تقليدية كسولة. المحتوى العظيم مبني على هذا التوتر.",
  "The Transformation": "التحول",
  "What is the before and after? Where does your audience start, and where do you take them?": "ما هو قبل وبعد؟ أين يبدأ جمهورك وإلى أين تأخذه؟",
  "Every piece of content should be a chapter in this story. Make the before painfully specific and the after undeniably desirable.": "كل قطعة محتوى يجب أن تكون فصلاً في هذه القصة. اجعل ما قبل محدداً بشكل مؤلم وما بعد مرغوباً فيه بلا شك.",
  "The One CTA": "الدعوة الوحيدة للتحرك",
  "What is the single next step you want someone to take after consuming your content?": "ما الخطوة التالية الوحيدة التي تريد من شخص ما اتخاذها بعد مشاهدة محتواك؟",
  "One CTA only. The more options you give, the less action people take. What is the one door you want them to walk through?": "دعوة واحدة فقط. كلما أعطيت خيارات أكثر، قلّ الفعل. ما الباب الوحيد الذي تريدهم المرور من خلاله؟",
  "WHO WE'RE TALKING TO": "من نتحدث إليه",
  "Audience": "الجمهور",
  "AVATAR NAME": "اسم الشخصية",
  "click to rename": "انقر للتسمية",
  "AVATAR": "الشخصية",
  "OF": "من",
  "CLIENT PROFILE": "ملف العميل",
  "Bio Optimizer": "محسّن السيرة الذاتية",
  "CTA & Link": "الدعوة للتحرك والرابط",
  "The one action you want people to take after every piece of content.": "الإجراء الوحيد الذي تريد من الناس اتخاذه بعد كل محتوى.",
  "THE ONE CTA": "الدعوة الوحيدة",
  "LINK / BOOKING PAGE": "الرابط / صفحة الحجز",
  "e.g. Dr. Sarah Al Mansoori": "مثال: د. سارة المنصوري",
  "e.g. Functional Medicine Doctor & CEO": "مثال: طبيب طب وظيفي ورئيس تنفيذي",
  "Summary of your professional background and areas of ex...": "ملخص خلفيتك المهنية ومجالات خبرتك...",
  "Background stories worth mentioning that shaped who you...": "قصص شخصية أثّرت في تكوينك وشخصيتك...",
  "e.g. Driven · Visionary · Grounded": "مثال: طموح · رؤيوي · متزن",
  "e.g. English, Arabic, or both": "مثال: عربي، إنجليزي، أو كليهما",
  "Awards, milestones, press features, record-breaking res...": "جوائز، إنجازات، تغطيات صحفية، أرقام قياسية...",
  "Instagram, TikTok, LinkedIn, YouTube, website...": "إنستغرام، تيك توك، لينكدإن، يوتيوب، الموقع...",
  "Something most people in your industry wouldn't dare say...": "شيء لا يجرؤ معظم الناس في مجالك على قوله...",
  "Problem → your approach → why it works...": "المشكلة ← نهجك ← لماذا ينجح...",
  "Be specific — demographics, mindset, situation they're ...": "كن محدداً — الفئة السكانية، العقلية، الوضع الذي يعيشونه...",
  "List 3–5 FAQs you hear most often...": "اذكر ٣–٥ أسئلة تسمعها أكثر من غيرها...",
  "Creators, brands, podcasts, books you admire...": "منشئو محتوى، علامات تجارية، بودكاست، كتب تعجبك...",
  "Colours, fonts, tone, visual references — or describe y...": "ألوان، خطوط، نبرة، مراجع بصرية — أو صِف هويتك...",
  "How you see your own strengths, values, and presence...": "كيف ترى نقاط قوتك وقيمك وحضورك...",
  "How colleagues, clients, or friends would describe you...": "كيف يصفك الزملاء أو العملاء أو الأصدقاء...",
  "The reputation and impression you want to build through...": "السمعة والانطباع الذي تريد بناءه من خلال...",
  "e.g. Functional medicine, aesthetic surgery, sports med...": "مثال: الطب الوظيفي، الجراحة التجميلية، طب الرياضة...",
  "Your methodology, philosophy, or patient care model...": "منهجيتك وفلسفتك أو نموذج رعاية المريض...",
  "Age, lifestyle, health concern, mindset, income level...": "العمر، نمط الحياة، المخاوف الصحية، العقلية، مستوى الدخل...",
  "Before: frustrated, misdiagnosed, in pain... After: tra...": "قبل: محبط، تشخيص خاطئ، يتألم... بعد: تحوّل...",
  "The mindset shift required before they take action...": "التحول الذهني المطلوب قبل اتخاذ القرار...",
  "A common belief that's keeping your patients stuck...": "معتقد شائع يُعيق تقدّم مرضاك...",
  "e.g. Aesthetic clinic — signature: Morpheus8, PRP, thre...": "مثال: عيادة تجميل — علاجات: مورفيوس، PRP...",
  "Demographics, treatment goals, lifestyle, budget...": "الفئة السكانية، أهداف العلاج، نمط الحياة، الميزانية...",
  "Before and after — physical, emotional, confidence...": "قبل وبعد — جسدياً، عاطفياً، على صعيد الثقة...",
  "Technology, team, experience, results, environment...": "التقنية، الفريق، الخبرة، النتائج، البيئة...",
  "Instagram, referrals, Google, walk-in, consultation call...": "إنستغرام، إحالات، جوجل، زيارة مباشرة، مكالمة استشارية...",
  "The trust or mindset shift required before they commit...": "الثقة أو التحول الذهني المطلوب قبل الالتزام...",
  "One clear sentence describing your business and customer...": "جملة واحدة واضحة تصف عملك وعميلك...",
};

const t = (key, isArabic) => (isArabic && AR[key]) ? AR[key] : key;

function BioTab({ isArabic = false, arabicFont = "'DM Sans', sans-serif" }) {
  const mono = "'DM Mono', monospace";
  const sans = isArabic ? arabicFont : "'DM Sans', sans-serif";
  const [cta,  setCta]  = useState("Book a free 20-min strategy call");
  const [link, setLink] = useState("linktr.ee/eliterealestate");
  const inp = { width:"100%", background:T.lift, border:`1px solid ${T.line}`, borderRadius:5, padding:"9px 12px", color:T.ink, fontSize:12, outline:"none", fontFamily:sans, boxSizing:"border-box" };

  return (
    <div style={{ flex:1, overflowY:"auto", background:T.base, padding:"28px 28px 60px", direction: isArabic ? "rtl" : "ltr", fontFamily:sans }}>
      <div style={{ maxWidth:860 }}>
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:9, letterSpacing:"0.18em", color:T.dim, fontFamily:mono, marginBottom:6 }}>{t("CLIENT PROFILE", isArabic)}</div>
          <h2 style={{ fontSize:22, fontWeight:800, color:T.ink, margin:0, fontFamily:sans }}>{t("Bio Optimizer", isArabic)}</h2>
        </div>
        <BioOptimizer />

        {/* CTA + Link */}
        <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, overflow:"hidden" }}>
          <div style={{ padding:"13px 18px", borderBottom:`1px solid ${T.line}` }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, fontFamily:sans }}>{t("CTA & Link", isArabic)}</div>
            <div style={{ fontSize:10, color:T.dim, marginTop:2, fontFamily:sans }}>{t("The one action you want people to take after every piece of content.", isArabic)}</div>
          </div>
          <div style={{ padding:"16px 18px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div>
              <div style={{ fontSize:9, letterSpacing:"0.14em", color:T.conv, fontFamily:mono, marginBottom:6 }}>{t("THE ONE CTA", isArabic)}</div>
              <input value={cta} onChange={e=>setCta(e.target.value)} style={{ ...inp, fontWeight:600 }} placeholder="e.g. Book a free strategy call" />
            </div>
            <div>
              <div style={{ fontSize:9, letterSpacing:"0.14em", color:T.conv, fontFamily:mono, marginBottom:6 }}>{t("LINK / BOOKING PAGE", isArabic)}</div>
              <input value={link} onChange={e=>setLink(e.target.value)} style={inp} placeholder="linktr.ee/..." />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const STUDIO_SETUPS = [
  { id:1,  name:"Minimal White",       mood:"Clean · Bright · Corporate",     color:"#e8e8e8", accent:"#888", img:"https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=400&q=80" },
  { id:2,  name:"Dark Moody",          mood:"Bold · Cinematic · Premium",      color:"#1a1a2e", accent:"#c084fc", img:"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80" },
  { id:3,  name:"Warm Earthy",         mood:"Relaxed · Natural · Approachable",color:"#c8a882", accent:"#8b5e3c", img:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80" },
  { id:4,  name:"Branded Bookshelf",   mood:"Expert · Intellectual · Curated", color:"#2d4a3e", accent:"#34d399", img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id:5,  name:"Industrial Loft",     mood:"Raw · Urban · Creative",          color:"#3d3d3d", accent:"#fb923c", img:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" },
  { id:6,  name:"Luxury Lounge",       mood:"High-end · Polished · Confident", color:"#1c1410", accent:"#d4a574", img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
  { id:7,  name:"Outdoor Terrace",     mood:"Fresh · Aspirational · Lifestyle",color:"#4a7c59", accent:"#86efac", img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
  { id:8,  name:"Tech / Glass",        mood:"Modern · Sharp · Forward",        color:"#0f1923", accent:"#38bdf8", img:"https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&q=80" },
  { id:9,  name:"Café / Coffee Shop",  mood:"Casual · Warm · Relatable",       color:"#5c3d2e", accent:"#fbbf24", img:"https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80" },
  { id:10, name:"Neutral Gradient",    mood:"Versatile · Clean · Minimal",     color:"#b8b8c8", accent:"#6366f1", img:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80" },
  { id:11, name:"Home Office",         mood:"Personal · Authentic · Real",     color:"#d4c5b0", accent:"#a78bfa", img:"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80" },
  { id:12, name:"Clinic / Medical",    mood:"Trust · Clean · Professional",    color:"#e8f4f8", accent:"#0ea5e9", img:"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80" },
];

function StudioSetupPicker({ selectedIds, setSelectedIds }) {
  const mono = "'DM Mono', monospace";
  const sans = "'DM Sans', sans-serif";
  const [expanded, setExpanded] = useState(false);

  const toggle = (id) => setSelectedIds(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  const preview = STUDIO_SETUPS.slice(0, 5);
  const visible = expanded ? STUDIO_SETUPS : preview;

  const Card = ({ setup }) => {
    const selected = selectedIds.includes(setup.id);
    return (
      <div onClick={() => toggle(setup.id)} style={{ position:"relative", borderRadius:8, overflow:"hidden", cursor:"pointer", border:`2px solid ${selected ? T.gold :"transparent"}`, transition:"border-color 0.15s", flexShrink:0 }}>
        {/* Image */}
        <div style={{ width:"100%", paddingTop:"70%", position:"relative", background:setup.color }}>
          <img src={setup.img} alt={setup.name} onError={e=>{e.target.style.display="none";}}
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          {/* Overlay */}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, #000000cc 0%, transparent 50%)" }} />
          {/* Selected check */}
          {selected && (
            <div style={{ position:"absolute", top:8, right:8, width:22, height:22, borderRadius:"50%", background:T.gold, display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          )}
          {/* Label */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"8px 10px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#fff", fontFamily:sans, lineHeight:1.2 }}>{setup.name}</div>
            <div style={{ fontSize:9, color:"#ffffff88", fontFamily:mono, marginTop:2, letterSpacing:"0.06em" }}>{setup.mood}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, overflow:"hidden", marginBottom:14 }}>
      {/* Header */}
      <div style={{ padding:"14px 20px", borderBottom:`1px solid ${T.line}`, display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, fontFamily:sans }}>Planning on shooting studio content?</div>
          <div style={{ fontSize:11, color:T.dim, marginTop:3 }}>Pick the setups that resonate with you the most. {selectedIds.length > 0 && <span style={{ color:T.gold, fontFamily:mono }}>{selectedIds.length} selected</span>}</div>
        </div>
        {selectedIds.length > 0 && (
          <div style={{ display:"flex", gap:4 }}>
            {selectedIds.map(id => {
              const s = STUDIO_SETUPS.find(x=>x.id===id);
              return s ? <div key={id} style={{ width:28, height:28, borderRadius:4, overflow:"hidden", border:`1px solid ${T.goldLine}` }}><img src={s.img} style={{ width:"100%", height:"100%", objectFit:"cover" }} /></div> : null;
            })}
          </div>
        )}
      </div>
      {/* Grid */}
      <div style={{ padding:"16px 20px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:10, marginBottom: !expanded && STUDIO_SETUPS.length > 5 ? 12 : 0 }}>
          {visible.map(s => <Card key={s.id} setup={s} />)}
        </div>
        {/* Expand / collapse */}
        <button onClick={() => setExpanded(p=>!p)}
          style={{ width:"100%", marginTop:12, padding:"8px", background:"none", border:`1px dashed ${T.line}`, borderRadius:6, color:T.dim, fontSize:11, cursor:"pointer", fontFamily:mono, letterSpacing:"0.08em", display:"flex",alignItems:"center",justifyContent:"center", gap:6 }}>
          {expanded
            ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 15l-6-6-6 6"/></svg>SHOW LESS</>
            : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>VIEW ALL {STUDIO_SETUPS.length} SETUPS</>
          }
        </button>
      </div>
    </div>
  );
}

const UNIVERSAL_QUESTIONS = [
  { id:"name",            section:"Personal & Professional", label:"Full Name",                          placeholder:"e.g. Dr. Sarah Al Mansoori",             type:"input" },
  { id:"title",           section:"Personal & Professional", label:"Profession / Title",                  placeholder:"e.g. Functional Medicine Doctor & CEO",   type:"input" },
  { id:"prof_bio",        section:"Personal & Professional", label:"Professional Bio",                    placeholder:"Summary of your professional background and areas of ex...", type:"textarea", hint:"What you do, who you serve, your credentials." },
  { id:"personal_bio",    section:"Personal & Professional", label:"Personal Bio",                        placeholder:"Background stories worth mentioning that shaped who you...", type:"textarea", hint:"The human behind the brand — origin story, turning points." },
  { id:"three_words",     section:"Personal & Professional", label:"3 words that best describe you",      placeholder:"e.g. Driven · Visionary · Grounded",      type:"input" },
  { id:"language",        section:"Personal & Professional", label:"Which language would you like your videos to be in?", placeholder:"e.g. English, Arabic, or both", type:"input" },
  { id:"achievements",    section:"Personal & Professional", label:"Noteworthy Achievements",             placeholder:"Awards, milestones, press features, record-breaking res...", type:"textarea", hint:"Optional but powerful for content.", optional:true },
  { id:"socials",         section:"Personal & Professional", label:"Social Media Links & Website",        placeholder:"Instagram, TikTok, LinkedIn, YouTube, website...", type:"textarea" },
  { id:"controversial",   section:"Opinion & Thought Leadership", label:"What's a controversial or debatable topic in your space that you have a strong opinion on?", placeholder:"Something most people in your industry wouldn't dare say...", type:"textarea" },
  { id:"challenges",      section:"Opinion & Thought Leadership", label:"What are the biggest challenges in your industry and how do you solve them?", placeholder:"Problem → your approach → why it works...", type:"textarea" },
  { id:"target_audience", section:"Audience Engagement",    label:"Who is your target audience?",         placeholder:"Be specific — demographics, mindset, situation they're ...", type:"textarea" },
  { id:"audience_faqs",   section:"Audience Engagement",    label:"What are the most common questions your audience asks you?", placeholder:"List 3–5 FAQs you hear most often...", type:"textarea" },
  { id:"inspirations",    section:"Inspirations",            label:"Who or what inspires your content style?", placeholder:"Creators, brands, podcasts, books you admire...", type:"textarea" },
  { id:"brand_guidelines",section:"Inspirations",            label:"Do you have existing brand guidelines?", placeholder:"Colours, fonts, tone, visual references — or describe y...", type:"textarea", optional:true },
  { id:"self_perception", section:"Identity & Public Perception", label:"How do you perceive yourself?",  placeholder:"How you see your own strengths, values, and presence...", type:"textarea" },
  { id:"others_perception",section:"Identity & Public Perception",label:"How do others perceive you?",   placeholder:"How colleagues, clients, or friends would describe you...", type:"textarea" },
  { id:"desired_perception",section:"Identity & Public Perception",label:"How would you like to be perceived?", placeholder:"The reputation and impression you want to build through...", type:"textarea" },
];

const TYPE_QUESTIONS = {
  doctor: [
    { id:"doc_specialty",   label:"What is your medical specialty and what conditions do you treat?",        placeholder:"e.g. Functional medicine, aesthetic surgery, sports med...",        type:"textarea" },
    { id:"doc_approach",    label:"What makes your clinical approach different from other doctors?",         placeholder:"Your methodology, philosophy, or patient care model...",                 type:"textarea" },
    { id:"doc_patient",     label:"Who is your ideal patient?",                                              placeholder:"Age, lifestyle, health concern, mindset, income level...",               type:"textarea" },
    { id:"doc_journey",     label:"What do patients feel before they find you, and after?",                  placeholder:"Before: frustrated, misdiagnosed, in pain... After: tra...", type:"textarea" },
    { id:"doc_belief",      label:"What does a patient need to believe before booking with you?",            placeholder:"The mindset shift required before they take action...",                  type:"textarea" },
    { id:"doc_myth",        label:"What's the biggest myth in your field that you can debunk?",              placeholder:"A common belief that's keeping your patients stuck...",                  type:"textarea" },
  ],
  clinic: [
    { id:"clinic_type",     label:"What type of clinic do you run and what are your hero treatments?",       placeholder:"e.g. Aesthetic clinic — signature: Morpheus8, PRP, thre...",    type:"textarea" },
    { id:"clinic_patient",  label:"Who is your ideal patient and what do they come in for?",                 placeholder:"Demographics, treatment goals, lifestyle, budget...",                    type:"textarea" },
    { id:"clinic_result",   label:"What result or transformation does your clinic deliver?",                 placeholder:"Before and after — physical, emotional, confidence...",                  type:"textarea" },
    { id:"clinic_edge",     label:"What sets your clinic apart from others in the market?",                  placeholder:"Technology, team, experience, results, environment...",                  type:"textarea" },
    { id:"clinic_booking",  label:"How do new patients typically find and book with you?",                   placeholder:"Instagram, referrals, Google, walk-in, consultation call...",            type:"textarea" },
    { id:"clinic_belief",   label:"What does someone need to believe before booking their first treatment?", placeholder:"The trust or mindset shift required before they commit...",               type:"textarea" },
  ],
  business: [
    { id:"biz_description", label:"What does your business do and who is it for?",                          placeholder:"One clear sentence describing your business and customer...",           type:"textarea" },
    { id:"primary_product", label:"What is your primary product or service — the one content should support?", placeholder:"The hero offer content should drive people toward...",              type:"textarea" },
    { id:"real_problem",    label:"What problem do most customers think they have vs. the real problem?",    placeholder:"Surface problem vs. the deeper root cause you actually ...",       type:"textarea" },
    { id:"objections",      label:"What objections do customers have before they purchase?",                 placeholder:"Price, trust, timing, competition — what holds them back?",            type:"textarea" },
    { id:"best_customer",   label:"Who is your best customer — who do you want more of?",                   placeholder:"The type of customer who gets results and refers others...",            type:"textarea" },
    { id:"biz_differentiator", label:"What's the one thing you wish more people understood about what you do?", placeholder:"The insight that changes how people see your category...",          type:"textarea" },
  ],
  coach: [
    { id:"coach_topic",     label:"What do you coach or consult on, and who do you help?",                  placeholder:"Your niche and the specific person you serve...",                      type:"textarea" },
    { id:"signature_offer", label:"What is your signature programme or offer?",                             placeholder:"Name, what's included, what it achieves...",                           type:"textarea" },
    { id:"transformation",  label:"What is the transformation you deliver — before and after?",             placeholder:"Where your client starts and where they end up after wo...", type:"textarea" },
    { id:"tried_before",    label:"What do your clients try before they find you, and why does it fail?",   placeholder:"The alternatives they exhaust before realising they nee...",        type:"textarea" },
    { id:"contrarian_belief",label:"What do you believe about your space that most people in it would disagree with?", placeholder:"Your contrarian stance — the hill you'll die on...",       type:"textarea" },
    { id:"ready_belief",    label:"What does someone need to believe to be ready to work with you?",        placeholder:"The mindset shift required before they're a good fit...",               type:"textarea" },
  ],
  realestate: [
    { id:"re_focus",        label:"What area of real estate do you specialise in?",                         placeholder:"e.g. Off-market luxury, buy-to-let, commercial, land de...",   type:"textarea" },
    { id:"re_market",       label:"What markets or locations do you operate in?",                           placeholder:"Cities, regions, or types of properties you focus on...",               type:"textarea" },
    { id:"re_client",       label:"Who is your ideal buyer, seller, or investor?",                          placeholder:"Their profile, goals, budget range, and situation...",                  type:"textarea" },
    { id:"re_edge",         label:"What gives you an edge that other agents or investors don't have?",      placeholder:"Access, network, methodology, track record...",                         type:"textarea" },
    { id:"re_belief",       label:"What does someone need to believe before they work with you?",           placeholder:"The mindset shift that separates serious clients from t...",  type:"textarea" },
    { id:"re_myth",         label:"What's the biggest myth in your market that you can debunk?",            placeholder:"A common belief that holds buyers or investors back...",                 type:"textarea" },
  ],
};

const CLIENT_TYPES_DEF = [
  { id:"doctor",     label:"Doctor",             icon:"👨‍⚕️", desc:"Physician, specialist, surgeon, functional medicine" },
  { id:"clinic",     label:"Clinic",             icon:"🏥", desc:"Aesthetic clinic, dental centre, therapy practice" },
  { id:"business",   label:"Business",           icon:"🏢", desc:"Product or service company, founder, CEO" },
  { id:"coach",      label:"Coach / Consultant", icon:"🎯", desc:"Personal brand, expert, educator, advisor" },
  { id:"realestate", label:"Real Estate",        icon:"🏡", desc:"Agent, broker, investor, property developer" },
];

const SECTION_ORDER = ["Personal & Professional","Opinion & Thought Leadership","Audience Engagement","Inspirations","Identity & Public Perception"];


function KickOffTab({ isArabic = false, arabicFont = "'DM Sans', sans-serif" }) {
  const mono = "'DM Mono', monospace";
  const sans = isArabic ? arabicFont : "'DM Sans', sans-serif";
  const dir = isArabic ? "rtl" : "ltr";
  const inputRTL = isArabic ? { textAlign:"right", direction:"rtl", fontFamily:sans } : {};


  const [mode, setMode] = useState("manual");
  const [clientType, setClientType] = useState(null);
  const [answers, setAnswers] = useState({});
  const [studioSetup, setStudioSetup] = useState([1, 3]);
  const [showMRF, setShowMRF] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [intakeStep, setIntakeStep] = useState("guard");
  const [intakeSent, setIntakeSent] = useState(false);
  const [showSignOff, setShowSignOff] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showBrain, setShowBrain] = useState(true);
  const [brainAssets, setBrainAssets] = useState([
    { id:1, type:"kickoff",  name:"Kick-off Call — James.mp4",   size:"142 MB", status:"processed", date:"Mar 3", insights:["Speaks in short punchy sentences","Loves the word 'leverage'","Keeps coming back to 'time freedom'","Naturally uses real estate metaphors"] },
    { id:2, type:"sales",    name:"Sales Call — Discovery.mp3",   size:"38 MB",  status:"processed", date:"Feb 28", insights:["Very direct, no fluff","Leads with numbers and ROI","Says 'let me be straight with you' often"] },
  ]);
  const [brainPasting, setBrainPasting] = useState(false);
  const [brainPasteText, setBrainPasteText] = useState("");
  const [brainProcessing, setBrainProcessing] = useState(false);
  const [activeBrainAsset, setActiveBrainAsset] = useState(null);
  const [brainInputMode, setBrainInputMode] = useState(null);
  const [brainUploadFile, setBrainUploadFile] = useState(null);
  const [brainUploadProgress, setBrainUploadProgress] = useState(0);
  const [persp, setPersp] = useState(["Most agents sell properties. I build portfolios.","ROI is the only metric that matters — not the listing price."]);
  const [miscs, setMiscs] = useState([{ text:"You need millions to start investing in luxury real estate", reframe:"Strategic financing lets you enter at $200K." }]);
  const [tags, setTags] = useState(["luxury real estate","off-market deals","passive income","portfolio diversification"]);

  const ASSET_TYPES = [
    { id:"sales",    label:"Sales Call",       icon:"📞", color:"#38bdf8" },
    { id:"kickoff",  label:"Kick-off Call",    icon:"🚀", color:"#c084fc" },
    { id:"practice", label:"Practice Session", icon:"🎬", color:"#34d399" },
    { id:"other",    label:"Other",            icon:"📄", color:T.dim },
  ];

  const extractInsights = (text) => {
    const insights = [];
    if (text.length > 200) insights.push("Voice patterns extracted from transcript");
    if (text.toLowerCase().includes("i think") || text.toLowerCase().includes("i believe")) insights.push("Opinion-led communication style");
    if (text.toLowerCase().includes("we") && text.toLowerCase().includes("team")) insights.push("Collaborative framing — uses 'we' naturally");
    if (text.toLowerCase().includes("?")) insights.push("Asks rhetorical questions naturally");
    if (insights.length === 0) insights.push("Vocabulary and tone mapped");
    insights.push("Language patterns stored for script generation");
    return insights;
  };

  const handleBrainPaste = (assetType) => {
    if (!brainPasteText.trim()) return;
    setBrainProcessing(true);
    setTimeout(() => {
      const typeInfo = ASSET_TYPES.find(t=>t.id===assetType) || ASSET_TYPES[3];
      setBrainAssets(p => [...p, {
        id: Date.now(),
        type: assetType,
        name: `${typeInfo.label} — Transcript`,
        size: `${brainPasteText.split(' ').length} words`,
        status: "processed",
        date: new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"}),
        insights: extractInsights(brainPasteText),
      }]);
      setBrainPasteText("");
      setBrainPasting(false);
      setBrainProcessing(false);
    }, 1600);
  };

  const handleBrainUpload = (file, assetType) => {
    if (!file) return;
    setBrainUploadFile(file);
    setBrainProcessing(true);
    setBrainUploadProgress(0);
    const interval = setInterval(() => {
      setBrainUploadProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 18;
      });
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setBrainUploadProgress(100);
      const typeInfo = ASSET_TYPES.find(t=>t.id===assetType) || ASSET_TYPES[3];
      setBrainAssets(p => [...p, {
        id: Date.now(),
        type: assetType,
        name: file.name,
        size: `${(file.size / (1024*1024)).toFixed(1)} MB`,
        status: "processed",
        date: new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"}),
        insights: ["Voice patterns extracted from recording","Natural speech rhythm and pacing mapped","Key vocabulary and phrases identified","Topic clusters detected","Language patterns stored for script generation"],
      }]);
      setBrainPasting(false);
      setBrainInputMode(null);
      setBrainUploadFile(null);
      setBrainUploadProgress(0);
      setBrainProcessing(false);
    }, 3000);
  };

  const allQuestions = clientType ? [...UNIVERSAL_QUESTIONS, ...TYPE_QUESTIONS[clientType]] : UNIVERSAL_QUESTIONS;
  const filledCount = allQuestions.filter(q => (answers[q.id]||"").trim().length > 0).length;
  const totalCount  = allQuestions.length;
  const fillPct     = Math.round((filledCount / totalCount) * 100);
  const canSignOff  = fillPct >= 60;

  const mrf = {
    trigger:        answers["target_audience"] || "Someone stressed about making their money work harder without risking it all in volatile markets.",
    enemy:          "Most agents tell you to 'wait for the right time.' The right time is the moment you stop competing with everyone else.",
    transformation: "From overwhelmed and uncertain, to confident and closing the right deals with a clear strategy.",
    cta:            "Book a Strategy Call",
  };


  const handleAutofill = () => {
    setIsParsing(true);
    setTimeout(() => {
      const lower = pasteText.toLowerCase();
      const filled = {};
      if (lower.includes("full name") || lower.includes("name:")) {
        const m = pasteText.match(/(?:full name|name)[:\s]+([^\n]+)/i);
        if (m) filled["name"] = m[1].trim();
      }
      if (lower.includes("profession") || lower.includes("title:")) {
        const m = pasteText.match(/(?:profession|title)[:\s]+([^\n]+)/i);
        if (m) filled["title"] = m[1].trim();
      }
      if (lower.includes("professional bio")) {
        const m = pasteText.match(/professional bio[:\s\n]+([^]+?)(?:\n\n|\n\d\.)/i);
        if (m) filled["prof_bio"] = m[1].trim();
      }
      if (lower.includes("personal bio")) {
        const m = pasteText.match(/personal bio[:\s\n]+([^]+?)(?:\n\n|\n\d\.)/i);
        if (m) filled["personal_bio"] = m[1].trim();
      }
      if (lower.includes("3 words") || lower.includes("three words")) {
        const m = pasteText.match(/(?:3 words|three words)[:\s]+([^\n]+)/i);
        if (m) filled["three_words"] = m[1].trim();
      }
      if (lower.includes("language")) {
        const m = pasteText.match(/language[:\s]+([^\n]+)/i);
        if (m) filled["language"] = m[1].trim();
      }
      if (lower.includes("target audience")) {
        const m = pasteText.match(/target audience[:\s\n]+([^]+?)(?:\n\n|\n[A-Z])/i);
        if (m) filled["target_audience"] = m[1].trim();
      }
      if (lower.includes("controversial") || lower.includes("debatable")) {
        const m = pasteText.match(/(?:controversial|debatable)[^:\n]*[:\s\n]+([^]+?)(?:\n\n|\n[A-Z])/i);
        if (m) filled["controversial"] = m[1].trim();
      }
      if (lower.includes("inspiration")) {
        const m = pasteText.match(/inspiration[^:\n]*[:\s\n]+([^]+?)(?:\n\n|\n[A-Z])/i);
        if (m) filled["inspirations"] = m[1].trim();
      }
      if (lower.includes("how do you perceive yourself") || lower.includes("self perception")) {
        const m = pasteText.match(/(?:perceive yourself|self perception)[:\s\n]+([^]+?)(?:\n\n|\n[A-Z])/i);
        if (m) filled["self_perception"] = m[1].trim();
      }
      if (lower.includes("others perceive") || lower.includes("how do others")) {
        const m = pasteText.match(/(?:others perceive|how do others)[^:\n]*[:\s\n]+([^]+?)(?:\n\n|\n[A-Z])/i);
        if (m) filled["others_perception"] = m[1].trim();
      }
      if (lower.includes("like to be perceived") || lower.includes("desired perception")) {
        const m = pasteText.match(/(?:like to be perceived|desired perception)[^:\n]*[:\s\n]+([^]+?)(?:\n\n|\n[A-Z])/i);
        if (m) filled["desired_perception"] = m[1].trim();
      }
      if (lower.includes("clinic") || lower.includes("doctor") || lower.includes("patient") || lower.includes("practice")) setClientType("practice");
      else if (lower.includes("programme") || lower.includes("coach") || lower.includes("consult")) setClientType("coach");
      else setClientType("business");

      setAnswers(p => ({...p, ...filled}));
      setIsParsing(false);
      setShowPaste(false);
      setMode("manual");
    }, 1800);
  };


  const inp = { width:"100%", background:T.lift, border:`1px solid ${T.line}`, borderRadius:5, padding:"9px 12px", color:T.ink, fontSize:12, outline:"none", fontFamily:sans, boxSizing:"border-box", ...(isArabic ? { textAlign:"right", direction:"rtl" } : {}) };
  const ta  = { ...inp, resize:"none", lineHeight:1.65 };

  const isMissing = (id) => !(answers[id]||"").trim();


  const renderQ = (q, i) => {
    const missing = isMissing(q.id);
    return (
      <div key={q.id} style={{ paddingBottom:22, borderBottom:`1px solid ${T.line}`, marginBottom:22 }}>
        <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
          <span style={{ fontSize:9, fontWeight:700, color: missing ? T.ghost : T.gold, fontFamily:mono, width:20, flexShrink:0, paddingTop:2, textAlign: isArabic ? "right" : "left" }}>{String(i+1).padStart(2,"0")}</span>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8, marginBottom:q.hint?4:0 }}>
              <span style={{ fontSize:13, fontWeight:600, color:T.ink, fontFamily:sans, lineHeight:1.4 }}>{t(q.label, isArabic)}</span>
              {q.optional && <span style={{ fontSize:9, color:T.dim, fontFamily:mono, letterSpacing:"0.1em" }}>{t("OPTIONAL", isArabic)}</span>}
              {missing && mode==="manual" && <span style={{ fontSize:9, color:"#fb923c", fontFamily:mono, letterSpacing:"0.1em" }}>{t("MISSING", isArabic)}</span>}
            </div>
            {q.hint && <div style={{ fontSize:11, color:T.dim, fontFamily:sans, marginBottom:6 }}>{t(q.hint, isArabic)}</div>}
          </div>
        </div>
        <div style={{ marginLeft: isArabic ? 0 : 30, marginRight: isArabic ? 30 : 0 }}>
          {q.type==="input"
            ? <input value={answers[q.id]||""} onChange={e=>setAnswers(p=>({...p,[q.id]:e.target.value}))} placeholder={t(q.placeholder, isArabic)} style={{ ...inp, borderColor: missing && mode!=="select" ? "#fb923c33" : T.line }} />
            : <textarea value={answers[q.id]||""} onChange={e=>setAnswers(p=>({...p,[q.id]:e.target.value}))} placeholder={t(q.placeholder, isArabic)} rows={3} style={{ ...ta, borderColor: missing && mode!=="select" ? "#fb923c33" : T.line }} />
          }
        </div>
      </div>
    );
  };


  if (mode === "client") {
    const clientQ = [...UNIVERSAL_QUESTIONS, ...(clientType ? TYPE_QUESTIONS[clientType] : [])];
    if (confirmed) return (
      <div style={{ flex:1, overflowY:"auto", background:"#f8f8fc", display:"flex",alignItems:"center",justifyContent:"center", minHeight:400 }}>
        <div style={{ textAlign:"center", maxWidth:480, padding:40 }}>
          {!showSchedule ? (
            <>
              <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
              <h2 style={{ fontSize:24, fontWeight:800, color:"#111", margin:"0 0 12px", fontFamily:sans }}>Foundation Confirmed</h2>
              <p style={{ fontSize:14, color:"#666", lineHeight:1.7, margin:"0 0 28px" }}>Thank you for reviewing your foundation document. Your team now has everything they need to get started.</p>
              <button onClick={()=>setShowSchedule(true)}
                style={{ background:"#c084fc", border:"none", borderRadius:8, padding:"14px 32px", fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer", fontFamily:sans }}>
                📅 Book Your Kick-off Call
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize:48, marginBottom:16 }}>📅</div>
              <h2 style={{ fontSize:24, fontWeight:800, color:"#111", margin:"0 0 12px", fontFamily:sans }}>Schedule Your Kick-off</h2>
              <p style={{ fontSize:14, color:"#666", lineHeight:1.7, margin:"0 0 28px" }}>Pick a time that works for you and your strategist will be ready to walk through the full plan.</p>
              <div style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:10, padding:"24px", textAlign:"left", marginBottom:20 }}>
                <div style={{ fontSize:11, color:"#999", fontFamily:mono, letterSpacing:"0.1em", marginBottom:8 }}>CALENDLY LINK</div>
                <div style={{ fontSize:13, color:"#c084fc", fontFamily:sans }}>calendly.com/theclipsagency/kickoff</div>
              </div>
              <button style={{ background:"#c084fc", border:"none", borderRadius:8, padding:"14px 32px", fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer", fontFamily:sans }}>
                Open Calendly →
              </button>
            </>
          )}
          <button onClick={()=>setMode("manual")} style={{ display:"block", margin:"20px auto 0", background:"none", border:"none", color:"#aaa", fontSize:11, cursor:"pointer", fontFamily:sans }}>← Back to agency view</button>
        </div>
      </div>
    );

    return (
      <div style={{ flex:1, overflowY:"auto", background:"#f8f8fc" }}>
        {/* Client header */}
        <div style={{ background:"#fff", borderBottom:"1px solid #e8e8ee", padding:"20px 40px", display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:11, color:"#aaa", fontFamily:mono, letterSpacing:"0.12em", marginBottom:4 }}>THE CLIPS AGENCY</div>
            <h1 style={{ fontSize:20, fontWeight:800, color:"#111", margin:0, fontFamily:sans }}>Your Onboarding Document</h1>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ fontSize:11, color:"#999", fontFamily:mono }}>{filledCount}/{clientQ.length} complete</div>
            <div style={{ width:120, height:4, background:"#f0f0f5", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${fillPct}%`, background:"#c084fc", borderRadius:99 }} />
            </div>
            <button onClick={()=>setMode("manual")} style={{ fontSize:11, color:"#aaa", background:"none", border:"1px solid #e0e0e0", borderRadius:5, padding:"5px 12px", cursor:"pointer", fontFamily:sans }}>Agency view</button>
          </div>
        </div>

        <div style={{ maxWidth:680, margin:"0 auto", padding:"40px 24px 100px" }}>
          <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:8, padding:"14px 18px", marginBottom:32, fontSize:13, color:"#92400e", fontFamily:sans, lineHeight:1.6 }}>
            👋 We've pre-filled what we know from your onboarding call. Please review, correct anything that's off, and fill in any gaps — then confirm at the bottom.
          </div>

          {SECTION_ORDER.map(section => {
            const qs = clientQ.filter(q => q.section === section);
            if (!qs.length) return null;
            return (
              <div key={section} style={{ marginBottom:40 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.18em", color:"#c084fc", fontFamily:mono, marginBottom:16, paddingBottom:8, borderBottom:"2px solid #f0e8ff" }}>{section.toUpperCase()}</div>
                {qs.map((q,i) => (
                  <div key={q.id} style={{ marginBottom:24 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#333", fontFamily:sans, marginBottom:q.hint?4:8 }}>{q.label} {q.optional && <span style={{ fontSize:11, color:"#aaa", fontWeight:400 }}>(optional)</span>}</div>
                    {q.hint && <div style={{ fontSize:11, color:"#999", marginBottom:8, fontFamily:sans }}>{q.hint}</div>}
                    {q.type==="input"
                      ? <input value={answers[q.id]||""} onChange={e=>setAnswers(p=>({...p,[q.id]:e.target.value}))} placeholder={q.placeholder}
                          style={{ width:"100%", background:"#fff", border:`1px solid ${isMissing(q.id)?"#fed7aa":"#e0e0e8"}`, borderRadius:6, padding:"10px 14px", fontSize:13, color:"#111", outline:"none", fontFamily:sans, boxSizing:"border-box" }} />
                      : <textarea value={answers[q.id]||""} onChange={e=>setAnswers(p=>({...p,[q.id]:e.target.value}))} placeholder={q.placeholder} rows={3}
                          style={{ width:"100%", background:"#fff", border:`1px solid ${isMissing(q.id)?"#fed7aa":"#e0e0e8"}`, borderRadius:6, padding:"10px 14px", fontSize:13, color:"#111", outline:"none", fontFamily:sans, boxSizing:"border-box", resize:"none", lineHeight:1.65 }} />
                    }
                  </div>
                ))}
              </div>
            );
          })}
          {/* Type-specific section */}
          {clientType && TYPE_QUESTIONS[clientType] && (
            <div style={{ marginBottom:40 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.18em", color:"#c084fc", fontFamily:mono, marginBottom:16, paddingBottom:8, borderBottom:"2px solid #f0e8ff" }}>ABOUT YOUR {clientType.toUpperCase()}</div>
              {TYPE_QUESTIONS[clientType].map((q,i) => (
                <div key={q.id} style={{ marginBottom:24 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#333", fontFamily:sans, marginBottom:8 }}>{q.label}</div>
                  {q.type==="input"
                    ? <input value={answers[q.id]||""} onChange={e=>setAnswers(p=>({...p,[q.id]:e.target.value}))} placeholder={q.placeholder}
                        style={{ width:"100%", background:"#fff", border:`1px solid ${isMissing(q.id)?"#fed7aa":"#e0e0e8"}`, borderRadius:6, padding:"10px 14px", fontSize:13, color:"#111", outline:"none", fontFamily:sans, boxSizing:"border-box" }} />
                    : <textarea value={answers[q.id]||""} onChange={e=>setAnswers(p=>({...p,[q.id]:e.target.value}))} placeholder={q.placeholder} rows={3}
                        style={{ width:"100%", background:"#fff", border:`1px solid ${isMissing(q.id)?"#fed7aa":"#e0e0e8"}`, borderRadius:6, padding:"10px 14px", fontSize:13, color:"#111", outline:"none", fontFamily:sans, boxSizing:"border-box", resize:"none", lineHeight:1.65 }} />
                  }
                </div>
              ))}
            </div>
          )}

          {/* Confirm button */}
          <div style={{ background:"#fff", border:"1px solid #e8e8ee", borderRadius:10, padding:"24px 28px", textAlign:"center" }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#111", fontFamily:sans, marginBottom:6 }}>Everything look right?</div>
            <div style={{ fontSize:12, color:"#999", fontFamily:sans, marginBottom:20 }}>Once you confirm, your team will be in touch to schedule your kick-off call.</div>
            <button onClick={()=>setConfirmed(true)}
              style={{ background:"#c084fc", border:"none", borderRadius:8, padding:"14px 40px", fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer", fontFamily:sans }}>
              ✓ Confirm Foundation
            </button>
          </div>
        </div>
      </div>
    );
  }


  const hasVoiceData = brainAssets.some(a => a.status === "processed");
  const groupedUniversal = SECTION_ORDER.map(section => ({
    section,
    questions: UNIVERSAL_QUESTIONS.filter(q => q.section === section),
  })).filter(g => g.questions.length > 0);

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden", position:"relative", direction: isArabic ? "rtl" : "ltr", fontFamily:sans }}>
      <div style={{ flex:1, overflowY:"auto", background:T.base, padding:"28px 28px 80px" }}>
        <div style={{ maxWidth:860 }}>

          {/* ── Header ── */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
            <div>
              <div style={{ fontSize:9, letterSpacing:"0.18em", color:T.dim, fontFamily:mono, marginBottom:6 }}>{t("CLIENT FOUNDATION", isArabic)}</div>
              <h2 style={{ fontSize:22, fontWeight:800, color:T.ink, margin:0, fontFamily:sans }}>{t("Foundation", isArabic)}</h2>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              {/* Progress */}
              <div style={{ display:"flex",alignItems:"center",gap:8, background:T.surface, border:`1px solid ${T.line}`, borderRadius:6, padding:"6px 12px" }}>
                <div style={{ width:60, height:4, background:T.lift, borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${fillPct}%`, background: fillPct>=60 ? T.conv : fillPct>=30 ? "#fb923c" : T.gold, borderRadius:99, transition:"width 0.3s" }} />
                </div>
                <span style={{ fontSize:10, color:T.dim, fontFamily:mono }}>{filledCount}/{totalCount}</span>
              </div>
              <button onClick={()=>setShowBrain(p=>!p)}
                style={{ display:"flex",alignItems:"center",gap:6, fontSize:11, padding:"7px 14px", borderRadius:6, border:`1px solid ${showBrain ? "#c084fc44" : T.line}`, background:showBrain ? "#c084fc18" :"transparent", color:showBrain ? "#c084fc" : T.dim, cursor:"pointer", fontFamily:sans, position:"relative" }}>
                🧠 Client Brain
                {hasVoiceData && <span style={{ width:6, height:6, borderRadius:"50%", background:"#34d399", position:"absolute", top:6, right:6 }} />}
              </button>
              <button onClick={()=>setShowPaste(true)}
                style={{ fontSize:11, padding:"7px 14px", borderRadius:6, border:`1px solid ${T.line}`, background:"transparent", color:T.dim, cursor:"pointer", fontFamily:sans }}>
                ⚡ {t("Paste Summary", isArabic)}
              </button>
              <button onClick={()=>{ setIntakeStep("guard"); setIntakeSent(false); setShowIntake(true); }}
                style={{ fontSize:11, padding:"7px 16px", borderRadius:6, border:`1px solid ${T.goldLine}`, background:T.goldBg, color:T.gold, cursor:"pointer", fontFamily:sans, fontWeight:700, display:"flex",alignItems:"center",gap:6 }}>
                📤 {t("Send to Client", isArabic)}
              </button>
              {filledCount >= 5 && (
                <button onClick={() => setShowMRF(true)}
                  style={{ display:"flex",alignItems:"center",gap:7, background:T.goldBg, border:`1px solid ${T.goldLine}`, borderRadius:6, padding:"7px 14px", fontSize:11, fontWeight:700, color:T.gold, cursor:"pointer", fontFamily:sans }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                  {t("Positioning", isArabic)}
                </button>
              )}
            </div>
          </div>

          {/* ── Client Type selector ── */}
          <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, padding:"12px 16px", marginBottom:24, display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ fontSize:9, letterSpacing:"0.14em", color:T.dim, fontFamily:mono, whiteSpace:"nowrap", flexShrink:0 }}>{t("STEP 1", isArabic)}</div>
            <div style={{ width:1, height:16, background:T.line, flexShrink:0 }} />
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {CLIENT_TYPES_DEF.map(ct => (
                <button key={ct.id} onClick={()=>setClientType(ct.id)}
                  style={{ display:"flex",alignItems:"center",gap:6, padding:"6px 14px", borderRadius:6, border:`1px solid ${clientType===ct.id ? T.goldLine : T.line}`, background:clientType===ct.id ? T.goldBg :"transparent", cursor:"pointer", transition:"all 0.15s" }}>
                  <span style={{ fontSize:13 }}>{ct.icon}</span>
                  <span style={{ fontSize:11, fontWeight:clientType===ct.id ? 700 : 500, color:clientType===ct.id ? T.gold : T.muted, fontFamily:sans }}>{t(ct.label, isArabic)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Universal questions by section ── */}
          {groupedUniversal.map(({ section, questions }) => (
            <div key={section} style={{ marginBottom:24 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12, marginBottom:16 }}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:T.gold, fontFamily:mono }}>{t(section.toUpperCase(), isArabic)}</div>
                <div style={{ flex:1, height:1, background:T.line }} />
              </div>
              <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, padding:"20px 22px" }}>
                {questions.map((q, i) => renderQ(q, UNIVERSAL_QUESTIONS.indexOf(q)))}
              </div>
            </div>
          ))}

          {/* ── Type-specific questions ── */}
          {clientType && (
            <div style={{ marginBottom:24 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12, marginBottom:16 }}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:T.auth, fontFamily:mono }}>
                  {CLIENT_TYPES_DEF.find(c=>c.id===clientType)?.icon} ABOUT THEIR {clientType.toUpperCase()}
                </div>
                <div style={{ flex:1, height:1, background:T.line }} />
              </div>
              <div style={{ background:T.surface, border:`1px solid ${T.authLine||T.line}`, borderRadius:8, padding:"20px 22px" }}>
                {TYPE_QUESTIONS[clientType].map((q,i) => renderQ(q, UNIVERSAL_QUESTIONS.length + i))}
              </div>
            </div>
          )}

          {/* ── Studio setup ── */}
          <StudioSetupPicker selectedIds={studioSetup} setSelectedIds={setStudioSetup} />

          {/* ── Expertise, Perspectives, Misconceptions, Proof ── */}
          <SectionCard title="Expertise & Topics" sub="What this client has genuine authority on.">
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
              {tags.map(tag => (
                <span key={tag} style={{ fontSize:11, color:T.gold, background:T.goldBg, border:`1px solid ${T.goldLine}`, padding:"3px 10px", borderRadius:2, display:"flex",alignItems:"center",gap:6, fontFamily:mono }}>
                  {tag}
                  <span onClick={() => setTags(p => p.filter(x => x!==tag))} style={{ color:T.dim, cursor:"pointer", fontSize:13 }}>×</span>
                </span>
              ))}
              <button style={{ fontSize:11, color:T.dim, border:`1px dashed ${T.line}`, padding:"3px 10px", borderRadius:2, background:"none", cursor:"pointer", fontFamily:mono }}>+ add</button>
            </div>
            <textarea rows={2} defaultValue="15 years in luxury real estate, licensed in 3 states, sold $200M+ in properties" style={{ ...taSt, fontSize:12, color:T.muted }} />
          </SectionCard>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <SectionCard title="Unique Perspectives" sub="Contrarian angles that create stand-out content.">
              <div style={{ display:"flex",flexDirection:"column", gap:8 }}>
                {persp.map((p,i) => (
                  <div key={i} style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <input defaultValue={p} style={{ ...inputSt, flex:1, fontSize:12 }} />
                    <button onClick={() => setPersp(prev => prev.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:16 }}>×</button>
                  </div>
                ))}
                <button onClick={() => setPersp(p=>[...p,""])} style={{ fontSize:11, color:T.dim, border:`1px dashed ${T.line}`, padding:"7px 12px", borderRadius:2, background:"none", cursor:"pointer", fontFamily:sans, textAlign:"left" }}>+ Add perspective</button>
              </div>
            </SectionCard>
            <SectionCard title="Common Misconceptions" sub="Beliefs this client can authoritatively debunk.">
              <div style={{ display:"flex",flexDirection:"column", gap:10 }}>
                {miscs.map((m,i) => (
                  <div key={i} style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:4, padding:12 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                      <input defaultValue={m.text} style={{ ...inputSt, flex:1, fontSize:12, background:"transparent", border:"none", padding:0 }} />
                      <button onClick={() => setMiscs(p=>p.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:16 }}>×</button>
                    </div>
                    <div style={{ borderTop:`1px solid ${T.line}`, paddingTop:8 }}>
                      <div style={{ fontSize:9, color:T.dim, fontFamily:mono, letterSpacing:"0.1em", marginBottom:4 }}>THE TRUTH IS...</div>
                      <input defaultValue={m.reframe} style={{ ...inputSt, fontSize:12, color:T.conv, background:"transparent", border:"none", padding:0 }} />
                    </div>
                  </div>
                ))}
                <button onClick={() => setMiscs(p=>[...p,{text:"",reframe:""}])} style={{ fontSize:11, color:T.dim, border:`1px dashed ${T.line}`, padding:"7px 12px", borderRadius:2, background:"none", cursor:"pointer", fontFamily:sans, textAlign:"left" }}>+ Add misconception</button>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Proof & Credentials" sub="Numbers, testimonials, and media features for content.">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }}>
              {[
                { label:"Stats & Numbers", color:T.conv,  items:["$200M+ in closed deals","150+ investor clients","12% avg. annual ROI"] },
                { label:"Testimonials",    color:T.reach, items:['"Best investment decision I made." — Mark T.'] },
                { label:"Media & Features",color:T.gold,  items:["Featured in Forbes, 2023","Wall Street Journal, 2022"] },
              ].map(sec => (
                <div key={sec.label}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.15em", color:sec.color, fontFamily:mono, marginBottom:12 }}>{sec.label.toUpperCase()}</div>
                  {sec.items.map((item,i) => (
                    <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:8 }}>
                      <span style={{ width:4, height:4, borderRadius:"50%", background:sec.color, marginTop:6, flexShrink:0 }} />
                      <span style={{ fontSize:12, color:T.muted, flex:1, lineHeight:1.5 }}>{item}</span>
                    </div>
                  ))}
                  <button style={{ fontSize:10, color:T.dim, background:"none", border:"none", cursor:"pointer", fontFamily:mono }}>+ add</button>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── Preview as Client button ── */}
          <div style={{ marginTop:32, paddingTop:24, borderTop:`1px solid ${T.line}`, display:"flex", justifyContent:"center" }}>
            <button onClick={()=>setMode("client")}
              style={{ display:"flex",alignItems:"center",gap:8, background:"transparent", border:`1px solid ${T.line}`, borderRadius:8, padding:"10px 20px", fontSize:12, color:T.dim, cursor:"pointer", fontFamily:sans }}>
              👁 Preview as Client
            </button>
          </div>

        </div>
      </div>

      {/* ── MRF Drawer ── */}
      <div style={{ width:showMRF?400:0, minWidth:showMRF?400:0, transition:"width 0.3s ease, min-width 0.3s ease", borderLeft:showMRF?`1px solid ${T.line}`:"none", background:T.surface, overflow:"hidden", display:"flex",flexDirection:"column", flexShrink:0 }}>
        {showMRF && (
          <div style={{ display:"flex",flexDirection:"column", height:"100%", overflowY:"auto", width:400 }}>
            <div style={{ padding:"18px 20px", borderBottom:`1px solid ${T.line}`, flexShrink:0 }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:T.gold, fontFamily:mono }}>✦ POSITIONING SUMMARY</span>
                <button onClick={() => setShowMRF(false)} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <div style={{ fontSize:13, fontWeight:800, color:T.ink, fontFamily:sans }}>Mental Real Estate Framework</div>
              <div style={{ fontSize:11, color:T.dim, marginTop:3 }}>Derived from Foundation answers</div>
            </div>
            <div style={{ flex:1, padding:"20px", overflowY:"auto" }}>
              {[
                { num:"01", label:"The Trigger",        color:T.gold,    bg:T.goldBg,  border:T.goldLine,     value:mrf.trigger },
                { num:"02", label:"The Enemy",          color:"#f87171", bg:"#2a0a0a", border:"#f8717144",    value:mrf.enemy },
                { num:"03", label:"The Transformation", color:T.conv,    bg:T.convBg,  border:`${T.conv}44`,  value:mrf.transformation },
                { num:"04", label:"The CTA",            color:T.reach,   bg:T.reachBg, border:`${T.reach}44`, value:mrf.cta },
              ].map(f => (
                <div key={f.num} style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:8, padding:"14px 16px", marginBottom:12 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8, marginBottom:10 }}>
                    <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", color:f.color, background:f.bg, border:`1px solid ${f.border}`, borderRadius:2, padding:"2px 7px", fontFamily:mono }}>{f.num}</span>
                    <span style={{ fontSize:11, fontWeight:700, color:T.ink }}>{f.label}</span>
                  </div>
                  <textarea defaultValue={f.value} rows={3} style={{ width:"100%", background:T.base, border:`1px solid ${T.line}`, borderRadius:5, padding:"10px 12px", color:T.muted, fontSize:12, outline:"none", resize:"none", lineHeight:1.6, fontFamily:sans, boxSizing:"border-box", ...inputRTL }} />
                </div>
              ))}
              <div style={{ background:T.goldBg, border:`1px solid ${T.goldLine}`, borderRadius:8, padding:"14px 16px", marginBottom:20 }}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.15em", color:T.gold, fontFamily:mono, marginBottom:8 }}>POSITIONING STATEMENT</div>
                <p style={{ fontSize:12, color:T.ink, margin:0, lineHeight:1.75, fontStyle:"italic" }}>
                  "{mrf.transformation.split('.')[0]}. Every piece of content ends with one ask: {mrf.cta}."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CLIENT BRAIN PANEL ── */}
      <div style={{ width:showBrain?300:0, minWidth:showBrain?300:0, transition:"width 0.3s ease, min-width 0.3s ease", borderLeft:showBrain?`1px solid ${T.line}`:"none", background:T.surface, overflow:"hidden", display:"flex",flexDirection:"column", flexShrink:0 }}>
        {showBrain && (
          <div style={{ width:300, display:"flex",flexDirection:"column", height:"100%", overflowY:"auto", direction:"ltr", fontFamily:"'DM Sans', sans-serif" }}>

            {/* Header */}
            <div style={{ padding:"16px 18px", borderBottom:`1px solid ${T.line}`, flexShrink:0 }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between", marginBottom:2 }}>
                <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                  <span style={{ fontSize:14 }}>🧠</span>
                  <span style={{ fontSize:12, fontWeight:800, color:T.ink, fontFamily:sans }}>Client Brain</span>
                  {hasVoiceData && <span style={{ fontSize:8, letterSpacing:"0.1em", color:"#34d399", background:"#34d39918", border:"1px solid #34d39944", borderRadius:99, padding:"2px 6px", fontFamily:mono }}>ACTIVE</span>}
                </div>
                <button onClick={()=>setShowBrain(false)} style={{ background:"none", border:"none", color:T.ghost, cursor:"pointer", fontSize:16, lineHeight:1 }}>×</button>
              </div>
              <div style={{ fontSize:10, color:T.dim, fontFamily:sans, lineHeight:1.5 }}>Feed calls and sessions to personalise voice, ideas, and scripts for this client.</div>
            </div>

            {/* Asset list */}
            <div style={{ flex:1, overflowY:"auto", padding:"14px 16px" }}>

              {brainAssets.length > 0 && (
                <div style={{ marginBottom:16 }}>
                  {brainAssets.map(asset => {
                    const typeInfo = ASSET_TYPES.find(t=>t.id===asset.type) || ASSET_TYPES[3];
                    const isOpen = activeBrainAsset === asset.id;
                    return (
                      <div key={asset.id} style={{ marginBottom:8, background:T.lift, border:`1px solid ${isOpen ? typeInfo.color+"55" : T.line}`, borderRadius:8, overflow:"hidden", transition:"border-color 0.15s" }}>
                        <div onClick={()=>setActiveBrainAsset(isOpen ? null : asset.id)}
                          style={{ padding:"10px 12px", cursor:"pointer", display:"flex",alignItems:"center",gap:10 }}>
                          <span style={{ fontSize:16, flexShrink:0 }}>{typeInfo.icon}</span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:11, fontWeight:700, color:T.ink, fontFamily:sans, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{asset.name}</div>
                            <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:2 }}>
                              <span style={{ fontSize:9, color:typeInfo.color, fontFamily:mono, letterSpacing:"0.08em" }}>{typeInfo.label.toUpperCase()}</span>
                              <span style={{ fontSize:9, color:T.ghost, fontFamily:mono }}>· {asset.size} · {asset.date}</span>
                            </div>
                          </div>
                          <div style={{ width:6, height:6, borderRadius:"50%", background:"#34d399", flexShrink:0 }} />
                        </div>
                        {isOpen && (
                          <div style={{ padding:"0 12px 12px", borderTop:`1px solid ${T.line}` }}>
                            <div style={{ fontSize:9, letterSpacing:"0.1em", color:T.dim, fontFamily:mono, marginBottom:8, marginTop:10 }}>EXTRACTED INSIGHTS</div>
                            {asset.insights.map((ins,i) => (
                              <div key={i} style={{ display:"flex", gap:7, alignItems:"flex-start", marginBottom:6 }}>
                                <span style={{ color:"#34d399", fontSize:10, marginTop:1, flexShrink:0 }}>✓</span>
                                <span style={{ fontSize:11, color:T.muted, fontFamily:sans, lineHeight:1.5 }}>{ins}</span>
                              </div>
                            ))}
                            <button onClick={()=>setBrainAssets(p=>p.filter(a=>a.id!==asset.id))}
                              style={{ marginTop:8, fontSize:10, color:"#f87171", background:"none", border:"none", cursor:"pointer", fontFamily:sans, padding:0 }}>Remove</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Voice summary pill */}
              {hasVoiceData && (
                <div style={{ background:"#34d39910", border:"1px solid #34d39933", borderRadius:8, padding:"12px 14px", marginBottom:16 }}>
                  <div style={{ fontSize:9, letterSpacing:"0.1em", color:"#34d399", fontFamily:mono, marginBottom:8 }}>VOICE PROFILE ACTIVE</div>
                  <div style={{ fontSize:11, color:T.muted, fontFamily:sans, lineHeight:1.6 }}>Scripts, hooks, and ideas will reflect this client's natural language and communication style.</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10 }}>
                    {["Direct","Numbers-driven","Short sentences","Asks questions"].map(t => (
                      <span key={t} style={{ fontSize:9, color:"#34d399", background:"#34d39918", border:"1px solid #34d39933", borderRadius:99, padding:"2px 8px", fontFamily:mono }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add new */}
              {!brainPasting ? (
                <div>
                  <div style={{ fontSize:9, letterSpacing:"0.12em", color:T.ghost, fontFamily:mono, marginBottom:10 }}>ADD MATERIAL</div>
                  <div style={{ display:"flex",flexDirection:"column", gap:6 }}>
                    {ASSET_TYPES.slice(0,3).map(type => (
                      <button key={type.id} onClick={()=>{ setBrainPasting(type.id); setBrainInputMode(null); }}
                        style={{ display:"flex",alignItems:"center",gap:10, background:T.base, border:`1px dashed ${T.line}`, borderRadius:7, padding:"10px 12px", cursor:"pointer", textAlign:"left" }}>
                        <span style={{ fontSize:14 }}>{type.icon}</span>
                        <div>
                          <div style={{ fontSize:11, fontWeight:600, color:T.muted, fontFamily:sans }}>+ {type.label}</div>
                          <div style={{ fontSize:9, color:T.ghost, fontFamily:sans }}>Upload video or paste transcript</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {/* Header */}
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.ink, fontFamily:sans }}>
                      {ASSET_TYPES.find(t=>t.id===brainPasting)?.icon} {ASSET_TYPES.find(t=>t.id===brainPasting)?.label}
                    </div>
                    <button onClick={()=>{ setBrainPasting(false); setBrainPasteText(""); setBrainInputMode(null); setBrainUploadFile(null); }} style={{ background:"none", border:"none", color:T.ghost, cursor:"pointer", fontSize:14 }}>×</button>
                  </div>

                  {/* Mode picker */}
                  {!brainInputMode && !brainProcessing && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      <button onClick={()=>setBrainInputMode("upload")}
                        style={{ background:T.base, border:`1px solid ${T.line}`, borderRadius:8, padding:"14px 10px", cursor:"pointer", textAlign:"center" }}>
                        <div style={{ fontSize:20, marginBottom:6 }}>🎥</div>
                        <div style={{ fontSize:11, fontWeight:700, color:T.ink, fontFamily:sans, marginBottom:2 }}>Upload Video</div>
                        <div style={{ fontSize:9, color:T.ghost, fontFamily:sans }}>mp4, mov, m4v, mp3</div>
                      </button>
                      <button onClick={()=>setBrainInputMode("paste")}
                        style={{ background:T.base, border:`1px solid ${T.line}`, borderRadius:8, padding:"14px 10px", cursor:"pointer", textAlign:"center" }}>
                        <div style={{ fontSize:20, marginBottom:6 }}>📋</div>
                        <div style={{ fontSize:11, fontWeight:700, color:T.ink, fontFamily:sans, marginBottom:2 }}>Paste Transcript</div>
                        <div style={{ fontSize:9, color:T.ghost, fontFamily:sans }}>Text or summary</div>
                      </button>
                    </div>
                  )}

                  {/* Upload mode */}
                  {brainInputMode === "upload" && !brainProcessing && (
                    <div>
                      <label style={{ display:"flex",flexDirection:"column", alignItems:"center", justifyContent:"center", background:T.base, border:`1px dashed ${T.line}`, borderRadius:8, padding:"24px 12px", cursor:"pointer", textAlign:"center", gap:8 }}>
                        <input type="file" accept="video/*,audio/*,.mp4,.mov,.mp3,.m4a" style={{ display:"none" }}
                          onChange={e=>{ if(e.target.files[0]) handleBrainUpload(e.target.files[0], brainPasting); }} />
                        <div style={{ fontSize:24 }}>📁</div>
                        <div style={{ fontSize:11, fontWeight:600, color:T.muted, fontFamily:sans }}>Click to choose file</div>
                        <div style={{ fontSize:9, color:T.ghost, fontFamily:sans }}>mp4 · mov · mp3 · m4a</div>
                      </label>
                      <button onClick={()=>setBrainInputMode(null)} style={{ width:"100%", marginTop:8, fontSize:10, color:T.ghost, background:"none", border:"none", cursor:"pointer", fontFamily:sans }}>← back</button>
                    </div>
                  )}

                  {/* Processing / upload progress */}
                  {brainProcessing && (
                    <div style={{ background:T.base, border:`1px solid ${T.line}`, borderRadius:8, padding:"18px 14px", textAlign:"center" }}>
                      <div style={{ fontSize:20, marginBottom:10 }}>⚙️</div>
                      <div style={{ fontSize:11, fontWeight:700, color:T.ink, fontFamily:sans, marginBottom:4 }}>
                        {brainUploadFile ? `Processing ${brainUploadFile.name}` : "Processing transcript..."}
                      </div>
                      <div style={{ fontSize:10, color:T.dim, fontFamily:sans, marginBottom:12 }}>Extracting voice patterns and insights</div>
                      <div style={{ height:4, background:T.lift, borderRadius:99, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${Math.min(brainUploadProgress,100)}%`, background:"#c084fc", borderRadius:99, transition:"width 0.2s" }} />
                      </div>
                      <div style={{ fontSize:9, color:T.dim, fontFamily:mono, marginTop:6 }}>{Math.min(Math.round(brainUploadProgress),100)}%</div>
                    </div>
                  )}

                  {/* Paste mode */}
                  {brainInputMode === "paste" && !brainProcessing && (
                    <div>
                      <textarea value={brainPasteText} onChange={e=>setBrainPasteText(e.target.value)} rows={7}
                        placeholder={`Paste the ${ASSET_TYPES.find(t=>t.id===brainPasting)?.label.toLowerCase()} transcript or notes here...`}
                        style={{ width:"100%", background:T.base, border:`1px solid ${T.line}`, borderRadius:6, padding:"10px 12px", color:T.ink, fontSize:11, outline:"none", fontFamily:sans, boxSizing:"border-box", resize:"none", lineHeight:1.65, marginBottom:8 }} />
                      <button onClick={()=>handleBrainPaste(brainPasting)} disabled={!brainPasteText.trim()}
                        style={{ width:"100%", padding:"9px", borderRadius:6, border:"none", background:brainPasteText.trim() ? "#c084fc" : T.ghost, color:"#fff", fontSize:11, fontWeight:700, cursor:brainPasteText.trim() ? "pointer" : "default", fontFamily:sans }}>
                        ⚡ Process & Extract
                      </button>
                      <button onClick={()=>setBrainInputMode(null)} style={{ width:"100%", marginTop:6, fontSize:10, color:T.ghost, background:"none", border:"none", cursor:"pointer", fontFamily:sans }}>← back</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── PASTE SUMMARY MODAL ── */}
      {showPaste && (
        <div style={{ position:"fixed", inset:0, background:"#00000088", zIndex:200, display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>setShowPaste(false)}>
          <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:12, width:620, maxHeight:"80vh", display:"flex",flexDirection:"column", overflow:"hidden" }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.line}`, display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:T.ink, fontFamily:sans }}>⚡ Paste Call Summary</div>
                <div style={{ fontSize:11, color:T.dim, marginTop:3 }}>Paste your Attio summary below. AI will map fields automatically.</div>
              </div>
              <button onClick={()=>setShowPaste(false)} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:20 }}>×</button>
            </div>
            <div style={{ padding:"20px 24px", flex:1, overflowY:"auto" }}>
              <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)} rows={14}
                placeholder="Paste your Attio call summary, notes or transcript here. The AI will detect client type and map answers to Foundation fields automatically."
                style={{ width:"100%", background:T.lift, border:`1px solid ${T.line}`, borderRadius:6, padding:"12px 14px", color:T.ink, fontSize:12, outline:"none", fontFamily:sans, boxSizing:"border-box", resize:"none", lineHeight:1.65 }} />
            </div>
            <div style={{ padding:"16px 24px", borderTop:`1px solid ${T.line}`, display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={()=>setShowPaste(false)} style={{ fontSize:12, padding:"9px 18px", borderRadius:6, border:`1px solid ${T.line}`, background:"transparent", color:T.dim, cursor:"pointer", fontFamily:sans }}>Cancel</button>
              <button onClick={handleAutofill} disabled={!pasteText.trim() || isParsing}
                style={{ fontSize:12, padding:"9px 20px", borderRadius:6, border:"none", background: pasteText.trim() ? T.gold : T.ghost, color:"#fff", cursor:pasteText.trim() ? "pointer" : "default", fontFamily:sans, fontWeight:700, display:"flex",alignItems:"center",gap:8 }}>
                {isParsing ? <>⏳ Analysing...</> : <>⚡ Auto-fill Fields</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SEND INTAKE MODAL ── */}
      {showIntake && (
        <div style={{ position:"fixed", inset:0, background:"#00000088", zIndex:200, display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>setShowIntake(false)}>
          <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:12, width:480, overflow:"hidden" }} onClick={e=>e.stopPropagation()}>

            {/* ── GUARD STEP: client type required ── */}
            {intakeStep === "guard" && !clientType && (
              <>
                <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.line}`, display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:T.ink, fontFamily:sans }}>📤 Send to Client</div>
                    <div style={{ fontSize:11, color:T.dim, marginTop:3 }}>One step needed before we can send.</div>
                  </div>
                  <button onClick={()=>setShowIntake(false)} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:20 }}>×</button>
                </div>
                <div style={{ padding:"24px" }}>
                  <div style={{ background:"#fb923c12", border:"1px solid #fb923c44", borderRadius:8, padding:"14px 16px", marginBottom:20, display:"flex", gap:12, alignItems:"flex-start" }}>
                    <span style={{ fontSize:18, flexShrink:0 }}>⚠️</span>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:"#fb923c", fontFamily:sans, marginBottom:4 }}>Client type not selected</div>
                      <div style={{ fontSize:11, color:T.dim, fontFamily:sans, lineHeight:1.6 }}>The intake form structure depends on client type. Please select one in Step 1 before sending.</div>
                    </div>
                  </div>
                  <div style={{ fontSize:9, letterSpacing:"0.14em", color:T.dim, fontFamily:mono, marginBottom:10 }}>STEP 1 — SELECT CLIENT TYPE</div>
                  <div style={{ display:"flex",flexDirection:"column", gap:8 }}>
                    {CLIENT_TYPES_DEF.map(ct => (
                      <button key={ct.id} onClick={()=>{ setClientType(ct.id); setIntakeStep("confirm"); setShowIntake(false); setTimeout(()=>{ setIntakeStep("confirm"); setShowIntake(true); }, 50); }}
                        style={{ display:"flex",alignItems:"center",gap:12, background:T.lift, border:`1px solid ${T.line}`, borderRadius:8, padding:"12px 14px", cursor:"pointer", textAlign:"left" }}>
                        <span style={{ fontSize:20 }}>{ct.icon}</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:T.ink, fontFamily:sans }}>{ct.label}</div>
                          <div style={{ fontSize:10, color:T.dim, fontFamily:sans }}>{ct.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── CONFIRM STEP (or guard passed) ── */}
            {(intakeStep === "confirm" || (intakeStep === "guard" && clientType)) && !intakeSent && (
              <>
                <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.line}`, display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:T.ink, fontFamily:sans }}>📤 Send to Client</div>
                    <div style={{ fontSize:11, color:T.dim, marginTop:3 }}>Review before sending.</div>
                  </div>
                  <button onClick={()=>setShowIntake(false)} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:20 }}>×</button>
                </div>
                <div style={{ padding:"20px 24px", display:"flex",flexDirection:"column", gap:14 }}>
                  {/* What's being sent */}
                  <div style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:8, padding:"14px 16px" }}>
                    <div style={{ fontSize:9, letterSpacing:"0.12em", color:T.dim, fontFamily:mono, marginBottom:10 }}>WHAT THE CLIENT WILL RECEIVE</div>
                    <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontSize:16 }}>{CLIENT_TYPES_DEF.find(c=>c.id===clientType)?.icon}</span>
                      <div>
                        <div style={{ fontSize:12, fontWeight:700, color:T.ink, fontFamily:sans }}>{CLIENT_TYPES_DEF.find(c=>c.id===clientType)?.label} Intake Form</div>
                        <div style={{ fontSize:10, color:T.dim, fontFamily:sans }}>{UNIVERSAL_QUESTIONS.length + (TYPE_QUESTIONS[clientType]?.length||0)} questions · {filledCount > 0 ? `${filledCount} pre-filled` : "blank form"}</div>
                      </div>
                    </div>
                    {filledCount > 0 && (
                      <div style={{ fontSize:11, color:"#34d399", fontFamily:sans, background:"#34d39910", border:"1px solid #34d39933", borderRadius:6, padding:"7px 10px" }}>
                        ✓ {filledCount} fields pre-filled from what you've already entered
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize:9, letterSpacing:"0.12em", color:T.dim, fontFamily:mono, marginBottom:6 }}>CLIENT EMAIL</div>
                    <input defaultValue="james@whitfieldgroup.com" style={{ width:"100%", background:T.lift, border:`1px solid ${T.line}`, borderRadius:5, padding:"9px 12px", color:T.ink, fontSize:12, outline:"none", fontFamily:sans, boxSizing:"border-box" }} />
                  </div>
                  <div style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:6, padding:"10px 14px", display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                    <div style={{ fontSize:10, color:T.dim, fontFamily:mono }}>clips.agency/onboard/james-whitfield</div>
                    <button style={{ fontSize:9, color:T.gold, background:"none", border:"none", cursor:"pointer", fontFamily:mono }}>COPY</button>
                  </div>
                </div>
                <div style={{ padding:"16px 24px", borderTop:`1px solid ${T.line}`, display:"flex", gap:10, justifyContent:"flex-end" }}>
                  <button onClick={()=>setShowIntake(false)} style={{ fontSize:12, padding:"9px 18px", borderRadius:6, border:`1px solid ${T.line}`, background:"transparent", color:T.dim, cursor:"pointer", fontFamily:sans }}>Cancel</button>
                  <button onClick={()=>setIntakeSent(true)} style={{ fontSize:12, padding:"9px 20px", borderRadius:6, border:"none", background:T.gold, color:"#fff", cursor:"pointer", fontFamily:sans, fontWeight:700 }}>📤 Confirm & Send</button>
                </div>
              </>
            )}

            {/* ── SENT confirmation ── */}
            {intakeSent && (
              <div style={{ padding:"40px 24px", textAlign:"center" }}>
                <div style={{ fontSize:40, marginBottom:16 }}>✅</div>
                <div style={{ fontSize:15, fontWeight:800, color:T.ink, fontFamily:sans, marginBottom:8 }}>Form Sent</div>
                <div style={{ fontSize:12, color:T.dim, fontFamily:sans, lineHeight:1.7, marginBottom:24 }}>james@whitfieldgroup.com will receive a link to their intake form shortly.</div>
                <button onClick={()=>{ setShowIntake(false); setIntakeSent(false); }} style={{ fontSize:12, padding:"9px 24px", borderRadius:6, border:`1px solid ${T.line}`, background:"transparent", color:T.dim, cursor:"pointer", fontFamily:sans }}>Done</button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── SEND FOR SIGN-OFF MODAL ── */}
      {showSignOff && (
        <div style={{ position:"fixed", inset:0, background:"#00000088", zIndex:200, display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>setShowSignOff(false)}>
          <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:12, width:520, overflow:"hidden" }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.line}`, display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:T.ink, fontFamily:sans }}>✓ Send for Client Sign-off</div>
                <div style={{ fontSize:11, color:T.dim, marginTop:3 }}>Client will see a prefilled document to review and confirm.</div>
              </div>
              <button onClick={()=>setShowSignOff(false)} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:20 }}>×</button>
            </div>
            <div style={{ padding:"20px 24px" }}>
              {/* Completion summary */}
              <div style={{ background:T.lift, border:`1px solid ${T.line}`, borderRadius:8, padding:"16px", marginBottom:16 }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:T.ink, fontFamily:sans }}>Foundation Completion</span>
                  <span style={{ fontSize:12, fontWeight:700, color: fillPct>=80 ? T.conv : T.gold, fontFamily:mono }}>{fillPct}%</span>
                </div>
                <div style={{ height:6, background:T.base, borderRadius:99, overflow:"hidden", marginBottom:10 }}>
                  <div style={{ height:"100%", width:`${fillPct}%`, background: fillPct>=80 ? T.conv : T.gold, borderRadius:99 }} />
                </div>
                <div style={{ fontSize:11, color:T.dim, fontFamily:sans }}>
                  {filledCount} of {totalCount} fields filled · {totalCount - filledCount} gaps will be highlighted for the client to complete.
                </div>
              </div>
              <div style={{ background:T.goldBg, border:`1px solid ${T.goldLine}`, borderRadius:8, padding:"12px 14px", fontSize:12, color:T.gold, fontFamily:sans, lineHeight:1.6 }}>
                ✨ The client will see a clean, prefilled version of their foundation. They review, fill any gaps, and confirm — then get prompted to book their kick-off call.
              </div>
            </div>
            <div style={{ padding:"16px 24px", borderTop:`1px solid ${T.line}`, display:"flex", gap:10, justifyContent:"space-between", alignItems:"center" }}>
              <button onClick={()=>{setShowSignOff(false); setMode("client");}} style={{ fontSize:11, color:T.dim, background:"none", border:"none", cursor:"pointer", fontFamily:sans }}>👁 Preview client view first</button>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>setShowSignOff(false)} style={{ fontSize:12, padding:"9px 18px", borderRadius:6, border:`1px solid ${T.line}`, background:"transparent", color:T.dim, cursor:"pointer", fontFamily:sans }}>Cancel</button>
                <button onClick={()=>setShowSignOff(false)} style={{ fontSize:12, padding:"9px 20px", borderRadius:6, border:"none", background:T.gold, color:"#fff", cursor:"pointer", fontFamily:sans, fontWeight:700 }}>✓ Send for Sign-off</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const BIO_PLATFORMS = [
  { id:"instagram", label:"Instagram",  limit:150,  color:"#E1306C", hint:"Short, punchy. Who you are + what you do + CTA. Emojis OK." },
  { id:"tiktok",    label:"TikTok",     limit:80,   color:"#69C9D0", hint:"Ultra-short. Hook in the first line. Emoji-friendly." },
  { id:"youtube",   label:"YouTube",    limit:1000, color:"#FF0000", hint:"Can be longer. Include keywords, links, upload schedule." },
  { id:"linkedin",  label:"LinkedIn",   limit:220,  color:"#0A66C2", hint:"Professional. Lead with value, include credentials & CTA." },
  { id:"twitter",   label:"X (Twitter)",limit:160,  color:"#888",    hint:"One sharp line. What you do + who you help. Link optional." },
];

function BioOptimizer() {
  const mono = "'DM Mono', monospace";
  const [activePlatform, setActivePlatform] = useState("instagram");
  const [bios, setBios] = useState({
    instagram: "Luxury real estate investor 🏙️\nHelping HNWIs build passive income through off-market properties\n📩 DM for a free consultation",
    tiktok:    "Off-market deals only 🔑 | $200M+ closed",
    youtube:   "Welcome to the channel where we break down luxury real estate investing for high-net-worth individuals. New videos every Tuesday — off-market deals, passive income strategies, and behind-the-scenes of closing $1M+ properties. Subscribe and hit the bell.",
    linkedin:  "Luxury Real Estate Strategist | $200M+ in closed transactions | Helping HNW investors acquire off-market properties with a guaranteed 12% ROI. Book a strategy call below.",
    twitter:   "I help HNW investors build passive income through off-market luxury real estate. $200M+ closed.",
  });
  const [tone, setTone] = useState("professional");

  const platform = BIO_PLATFORMS.find(p => p.id === activePlatform);
  const text = bios[activePlatform] || "";
  const count = text.length;
  const limit = platform.limit;
  const pct = Math.min(count / limit, 1);
  const over = count > limit;
  const barColor = over ? "#f87171" : pct > 0.85 ? "#fb923c" : T.conv;

  return (
    <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, overflow:"hidden", marginBottom:14, maxWidth:860 }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 18px", borderBottom:`1px solid ${T.line}` }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Bio Optimizer</div>
          <div style={{ fontSize:10, color:T.dim }}>Platform-specific bios with character limits</div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {["professional","casual","bold"].map(t => (
            <button key={t} onClick={() => setTone(t)}
              style={{ fontSize:9, padding:"3px 10px", borderRadius:2, border:`1px solid ${tone===t?T.goldLine:T.line}`, background:tone===t?T.goldBg:"transparent", color:tone===t?T.gold:T.dim, cursor:"pointer", fontFamily:mono, letterSpacing:"0.08em" }}>
              {t.toUpperCase()}
            </button>
          ))}
          <AIBtn label="Generate" />
        </div>
      </div>

      {/* Platform tabs */}
      <div style={{ display:"flex", borderBottom:`1px solid ${T.line}` }}>
        {BIO_PLATFORMS.map(p => (
          <button key={p.id} onClick={() => setActivePlatform(p.id)}
            style={{ padding:"10px 16px", fontSize:11, fontWeight: activePlatform===p.id ? 700 : 500, color: activePlatform===p.id ? p.color : T.dim, background:"none", border:"none", borderBottom:`2px solid ${activePlatform===p.id ? p.color :"transparent"}`, cursor:"pointer", marginBottom:-1, fontFamily:"'DM Sans',sans-serif", display:"flex",alignItems:"center",gap:6 }}>
            {p.label}
            {/* char indicator dot */}
            {(() => { const c = (bios[p.id]||"").length; const l = p.limit; return c > l ? <span style={{ width:6, height:6, borderRadius:"50%", background:"#f87171", display:"inline-block" }} /> : c > l*0.85 ? <span style={{ width:6, height:6, borderRadius:"50%", background:"#fb923c", display:"inline-block" }} /> : null; })()}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div style={{ padding:"16px 18px" }}>
        <div style={{ fontSize:10, color:T.dim, fontFamily:mono, marginBottom:8, letterSpacing:"0.08em" }}>{platform.hint}</div>
        <textarea
          value={text}
          onChange={e => setBios(p => ({...p, [activePlatform]: e.target.value}))}
          rows={4}
          style={{ ...taSt, marginBottom:10, borderColor: over ? "#f87171" : undefined, resize:"vertical" }}
        />
        {/* Character count bar */}
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ flex:1, height:3, background:T.lift, borderRadius:99, overflow:"hidden" }}>
            <div style={{ width:`${pct*100}%`, height:"100%", background:barColor, borderRadius:99, transition:"width 0.2s, background 0.2s" }} />
          </div>
          <span style={{ fontSize:10, fontFamily:mono, color: over ? "#f87171" : pct > 0.85 ? "#fb923c" : T.dim, fontWeight: over ? 700 : 400, flexShrink:0 }}>
            {count} / {limit}{over && ` (−${count-limit})`}
          </span>
        </div>
      </div>
    </div>
  );
}

function AudienceContent({ avatars, setAvatars, isArabic = false, arabicFont = "'DM Sans', sans-serif" }) {
  const mono = "'DM Mono', monospace";
  const sans = isArabic ? arabicFont : "'DM Sans', sans-serif";

  const [activeAvatarId, setActiveAvatarId] = useState(avatars[0]?.id);
  const [editingName, setEditingName] = useState(null);
  const av = avatars.find(a => a.id === activeAvatarId) || avatars[0];

  const updateAv = (field, val) => setAvatars(p => p.map(a => a.id === av.id ? {...a, [field]: val} : a));
  const addAvatar = () => {
    const newAv = { id: Date.now(), name:"New Avatar", color: AVATAR_COLORS[avatars.length % AVATAR_COLORS.length], age:"", location:"", income:"", occupation:"", fears:[], desires:[], phrases:[], blockers:[] };
    setAvatars(p => [...p, newAv]);
    setActiveAvatarId(newAv.id);
  };
  const deleteAvatar = (id) => {
    if (avatars.length <= 1) return;
    const remaining = avatars.filter(a => a.id !== id);
    setAvatars(remaining);
    setActiveAvatarId(remaining[0].id);
  };


  const ChipList = ({ items, setItems, color, placeholder, isArabic: ar }) => {
    const [adding, setAdding] = useState(false);
    const [val, setVal] = useState("");
    return (
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
        {items.map((item, i) => (
          <span key={i} style={{ display:"flex",alignItems:"center",gap:5, fontSize:11, color, background:color+"18", border:`1px solid ${color}2a`, borderRadius:4, padding:"4px 10px", fontFamily:sans }}>
            {item}
            <button onClick={() => setItems(p => p.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", color:color+"66", cursor:"pointer", fontSize:13, lineHeight:1, padding:0 }}>×</button>
          </span>
        ))}
        {adding
          ? <input autoFocus value={val} onChange={e=>setVal(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&val.trim()){setItems(p=>[...p,val.trim()]);setVal("");setAdding(false);} if(e.key==="Escape"){setAdding(false);setVal("");} }}
              onBlur={()=>{ if(val.trim()) setItems(p=>[...p,val.trim()]); setVal(""); setAdding(false); }}
              placeholder={placeholder}
              style={{ fontSize:11, background:"transparent", border:`1px dashed ${color}44`, borderRadius:4, padding:"4px 12px", color:T.ink, outline:"none", fontFamily:sans, width:160, direction: ar?"rtl":"ltr", textAlign: ar?"right":"left" }} />
          : <button onClick={()=>setAdding(true)} style={{ fontSize:11, color:T.dim, background:"none", border:`1px dashed ${T.line}`, borderRadius:4, padding:"4px 12px", cursor:"pointer", fontFamily:sans }}>{ar ? "+ أضف" : "+ add"}</button>
        }
      </div>
    );
  };

  const inp = { width:"100%", background:T.lift, border:`1px solid ${T.line}`, borderRadius:5, padding:"9px 12px", color:T.ink, fontSize:12, outline:"none", fontFamily:sans, boxSizing:"border-box", ...(isArabic ? { direction:"rtl", textAlign:"right" } : {}) };


  const PsychoCard = ({ icon, label, color, items, field, isArabic: ar, sans: cardSans }) => (
    <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, padding:"16px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:8, marginBottom:12 }}>
        <span style={{ fontSize:14 }}>{icon}</span>
        <span style={{ fontSize:9, letterSpacing:"0.14em", color, fontFamily:mono, fontWeight:700 }}>{label}</span>
      </div>
      <ChipList items={items} setItems={v => updateAv(field, typeof v === "function" ? v(items) : v)} color={color} placeholder={ar?"أضف...":"Add..."} isArabic={ar} />
    </div>
  );

  return (
    <div style={{ flex:1, overflowY:"auto", background:T.base, padding:"28px 28px 60px", direction: isArabic ? "rtl" : "ltr", fontFamily:sans }}>
      <div style={{ maxWidth:900 }}>

        {/* Header + avatar tabs */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between", marginBottom:18 }}>
          <div>
            <div style={{ fontSize:9, letterSpacing:"0.18em", color:T.dim, fontFamily:mono, marginBottom:5 }}>{t("WHO WE'RE TALKING TO", isArabic)}</div>
            <h2 style={{ fontSize:20, fontWeight:800, color:T.ink, margin:0, fontFamily:sans }}>{t("Audience", isArabic)}</h2>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            {avatars.map(a => (
              <button key={a.id} onClick={() => setActiveAvatarId(a.id)}
                style={{ display:"flex",alignItems:"center",gap:7, padding:"6px 12px", borderRadius:6, border:`1px solid ${activeAvatarId===a.id ? a.color+"55" : T.line}`, background:activeAvatarId===a.id ? a.color+"14" :"transparent", cursor:"pointer", transition:"all 0.15s" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:a.color, flexShrink:0 }} />
                <span style={{ fontSize:11, fontWeight:activeAvatarId===a.id?700:400, color:activeAvatarId===a.id?a.color:T.muted, fontFamily:sans, maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.name}</span>
                {avatars.length > 1 && activeAvatarId===a.id && (
                  <span onClick={e=>{e.stopPropagation();deleteAvatar(a.id);}} style={{ color:T.ghost, fontSize:14, lineHeight:1, marginLeft:2, cursor:"pointer" }}>×</span>
                )}
              </button>
            ))}
            <button onClick={addAvatar} style={{ display:"flex",alignItems:"center",gap:5, padding:"6px 12px", borderRadius:6, border:`1px dashed ${T.line}`, background:"transparent", color:T.dim, cursor:"pointer", fontSize:11, fontFamily:sans }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 4v16m8-8H4"/></svg>
              {isArabic ? "إضافة شخصية" : "Add Avatar"}
            </button>
          </div>
        </div>

        {/* Active avatar name hero */}
        <div style={{ background:`linear-gradient(135deg, ${av.color}12, ${T.surface})`, border:`1px solid ${av.color}33`, borderRadius:10, padding:"18px 22px", marginBottom:14, display:"flex",alignItems:"center",gap:16 }}>
          <div style={{ width:44, height:44, borderRadius:10, background:av.color+"1e", border:`1px solid ${av.color}44`, display:"flex",alignItems:"center",justifyContent:"center", flexShrink:0, fontSize:20 }}>🎯</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:9, letterSpacing:"0.18em", color:av.color, fontFamily:mono, marginBottom:6 }}>{t("AVATAR NAME", isArabic)}</div>
            {editingName === av.id
              ? <input autoFocus value={av.name} onChange={e=>updateAv("name",e.target.value)} onBlur={()=>setEditingName(null)} onKeyDown={e=>{if(e.key==="Enter")setEditingName(null);}}
                  style={{ background:"transparent", border:"none", borderBottom:`1px solid ${av.color}66`, color:T.ink, fontSize:18, fontWeight:800, outline:"none", fontFamily:sans, width:"100%", direction: isArabic?"rtl":"ltr" }} />
              : <div onClick={()=>setEditingName(av.id)} style={{ fontSize:18, fontWeight:800, color:T.ink, fontFamily:sans, cursor:"text", letterSpacing:"-0.01em" }}>{av.name} <span style={{ fontSize:11, color:T.ghost, fontWeight:400 }}>{t("click to rename", isArabic)}</span></div>
            }
          </div>
          <div style={{ fontSize:9, color:av.color, background:av.color+"14", border:`1px solid ${av.color}33`, borderRadius:5, padding:"5px 12px", fontFamily:mono, letterSpacing:"0.1em" }}>
            {isArabic ? `الشخصية ${avatars.findIndex(a=>a.id===av.id)+1} من ${avatars.length}` : `AVATAR ${avatars.findIndex(a=>a.id===av.id)+1} OF ${avatars.length}`}
          </div>
        </div>

        {/* Demo stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10, marginBottom:14 }}>
          {[
            { label:"AGE RANGE",  labelAr:"الفئة العمرية",  field:"age",        icon:"📅" },
            { label:"LOCATION",   labelAr:"الموقع",          field:"location",   icon:"📍" },
            { label:"INCOME",     labelAr:"الدخل",           field:"income",     icon:"💰" },
            { label:"OCCUPATION", labelAr:"المهنة",          field:"occupation", icon:"💼" },
          ].map(s => (
            <div key={s.field} style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, padding:"13px 15px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:6, marginBottom:8 }}>
                <span style={{ fontSize:12 }}>{s.icon}</span>
                <span style={{ fontSize:9, letterSpacing:"0.13em", color:T.dim, fontFamily:mono }}>{isArabic ? s.labelAr : s.label}</span>
              </div>
              <input value={av[s.field]} onChange={e=>updateAv(s.field,e.target.value)}
                style={{ width:"100%", background:"transparent", border:"none", color:T.ink, fontSize:12, fontWeight:600, outline:"none", fontFamily:sans, boxSizing:"border-box", direction: isArabic?"rtl":"ltr", textAlign: isArabic?"right":"left" }} />
            </div>
          ))}
        </div>

        {/* Psychographic chips */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:10 }}>
          <PsychoCard icon="▾" label={isArabic?"المخاوف والآلام":"FEARS & PAINS"}     color="#c97b6a" field="fears"    items={av.fears}    isArabic={isArabic} sans={sans} />
          <PsychoCard icon="▴" label={isArabic?"الرغبات والأهداف":"DESIRES & GOALS"}   color="#7aad96" field="desires"  items={av.desires}  isArabic={isArabic} sans={sans} />
          <PsychoCard icon="◈" label={isArabic?"العوائق":"BLOCKERS"}                   color="#a89070" field="blockers" items={av.blockers} isArabic={isArabic} sans={sans} />
        </div>
        <div style={{ marginBottom:32 }}>
          <PsychoCard icon="💬" label={isArabic?"عبارات يقولونها":"PHRASES THEY SAY"}  color="#8b9ec7" field="phrases"  items={av.phrases}  isArabic={isArabic} sans={sans} />
        </div>

      </div>
    </div>
  );
}

function TargetOfferTab({ avatars, setAvatars, isArabic = false, arabicFont = "'DM Sans', sans-serif" }) {
  return <AudienceContent avatars={avatars} setAvatars={setAvatars} isArabic={isArabic} arabicFont={arabicFont} />;
}

const AVATAR_COLORS = ["#c084fc","#38bdf8","#34d399","#f97316","#e879f9","#facc15"];
const INIT_AVATARS = [
  {
    id:1, name:"The Ambitious Investor", color:"#c084fc",
    age:"35–52", location:"Dubai, London, NYC", income:"$250K–$1M+/year", occupation:"Business owner, C-suite exec, surgeon",
    fears:["Losing capital on a bad deal","Being too busy to manage an investment","Getting scammed by a flashy agent"],
    desires:["Passive income that doesn't require their time","A trusted partner who handles everything","Proven ROI with minimal risk"],
    phrases:["I want my money working for me","How do I know this is legit?"],
    blockers:["Don't know who to trust","Had a bad experience before"],
  },
  {
    id:2, name:"The First-Time Buyer", color:"#38bdf8",
    age:"28–38", location:"Dubai, Abu Dhabi", income:"$80K–$200K/year", occupation:"Young professional, expat, entrepreneur",
    fears:["Overpaying in a hot market","Making the wrong first move","Not understanding the process"],
    desires:["Get on the property ladder","A safe reliable investment","Clear simple guidance"],
    phrases:["I don't know where to start","Is now a good time to buy?"],
    blockers:["Thinks they need more savings first","Overwhelmed by the process"],
  },
];

function BriefingTab({ onAddToContent }) {
  const [sub, setSub] = useState("foundation");
  const [avatars, setAvatars] = useState(INIT_AVATARS);
  const [isArabic, setIsArabic] = useState(false);
  const [pillarsRTL, setPillarsRTL] = useState(false);
  const arabicFont = "'Cairo', 'Noto Sans Arabic', sans-serif";
  const dir = isArabic ? "rtl" : "ltr";
  const font = isArabic ? arabicFont : "'DM Sans', sans-serif";

  return (
    <div style={{ flex:1, display:"flex",flexDirection:"column", overflow:"hidden", direction:dir, fontFamily:font }}>
      {/* Sub-tab bar */}
      <div style={{ display:"flex", alignItems:"stretch", borderBottom:`1px solid ${T.line}`, background:T.surface, flexShrink:0, paddingLeft:isArabic?0:28, paddingRight:isArabic?28:0, justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"stretch" }}>
          {[{ id:"foundation", label:"Foundation" },{ id:"pillars", label:"Pillars" },{ id:"audience", label:"Audience" },{ id:"bio", label:"Bio" }].map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setSub(t.id)}
              style={{ padding:"0 20px", height:42, fontSize:12, fontWeight:sub===t.id?700:500, color:sub===t.id?T.gold:T.dim, background:"transparent", border:"none", borderBottom:`2px solid ${sub===t.id?T.gold:"transparent"}`, cursor:"pointer", fontFamily:font, letterSpacing:"0.03em", position:"relative", display:"flex", alignItems:"center", gap:6 }}>
              {t.label}
            </button>
          ))}
        </div>
        {/* Context-aware toggle */}
        <div style={{ display:"flex", alignItems:"center", padding:"0 16px", gap:8 }}>
          {sub === "pillars" ? (
            <button onClick={() => setPillarsRTL(p => !p)}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:5, border:`1px solid ${pillarsRTL ? T.goldLine : T.line}`, background:pillarsRTL ? T.goldBg : "transparent", cursor:"pointer", transition:"all 0.15s" }}>
              <span style={{ fontSize:13 }}>🌐</span>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:pillarsRTL ? T.gold : T.dim, fontFamily:"'DM Mono', monospace" }}>
                {pillarsRTL ? "AR" : "EN"}
              </span>
            </button>
          ) : (
            <button onClick={() => setIsArabic(p => !p)}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:5, border:`1px solid ${isArabic ? T.goldLine : T.line}`, background:isArabic ? T.goldBg : "transparent", cursor:"pointer", transition:"all 0.15s" }}>
              <span style={{ fontSize:13 }}>🌐</span>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:isArabic ? T.gold : T.dim, fontFamily:"'DM Mono', monospace" }}>
                {isArabic ? "AR" : "EN"}
              </span>
            </button>
          )}
        </div>
      </div>
      {/* Sub-tab content */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", direction:dir }}>
        {sub==="foundation" && <KickOffTab isArabic={isArabic} arabicFont={arabicFont} />}
        {sub==="pillars"    && <StrategyTab2 onAddToContent={onAddToContent} rtl={pillarsRTL} arabicFont={arabicFont} />}
        {sub==="audience"   && <TargetOfferTab avatars={avatars} setAvatars={setAvatars} isArabic={isArabic} arabicFont={arabicFont} />}
        {sub==="bio"        && <BioTab isArabic={isArabic} arabicFont={arabicFont} />}
      </div>
    </div>
  );
}

function StrategyTab2({ onAddToContent, isArabic = false, arabicFont = "'DM Sans', sans-serif", rtl = false }) {
  const mono = "'DM Mono', monospace";
  const serif = isArabic ? arabicFont : "'DM Sans', sans-serif";
  const editorDir = (isArabic || rtl) ? "rtl" : "ltr";

  const PILLAR_META = {
    REACH:      { color:T.reach, bg:T.reachBg, border:`${T.reach}33`, num:"01", label:"REACH",      labelAr:"الوصول"   },
    AUTHORITY:  { color:T.auth,  bg:T.authBg,  border:`${T.auth}33`,  num:"02", label:"AUTHORITY",  labelAr:"السلطة"   },
    CONVERSION: { color:T.conv,  bg:T.convBg,  border:`${T.conv}33`,  num:"03", label:"CONVERSION", labelAr:"التحويل"  },
  };

  const SEED = {
    REACH: `<h2>Hook &amp; Discovery</h2><p>Get found by cold audiences who don't know us yet. Pure value, no pitch.</p><h3>Off-Market Myths Debunked</h3><p>You need $1M+ to invest in luxury real estate. Off-market means worse deals. You have to live near the property.</p><h3>Luxury Market Stats &amp; Insights</h3><p>What luxury buyers actually look for in 2025. Markets where off-market deals are surging. Average ROI: listed vs. off-market.</p><h3>First-Time Investor Mistakes</h3><p>Waiting for the perfect market conditions. Buying at the top of their budget with no buffer. Skipping due diligence to move fast.</p>`,
    AUTHORITY: `<h2>Proof &amp; Depth</h2><p>Share knowledge and insights that build genuine expertise in the audience's eyes.</p><h3>Client Deal Breakdowns</h3><p>The $2.3M deal we closed in 11 days. How a client turned $400K into $1.1M in 3 years. The property that looked risky — and returned 18% ROI.</p><h3>ROI Walkthroughs</h3><p>How we calculate projected ROI before recommending a property. The difference between gross yield and net yield.</p><h3>Industry Contrarian Takes</h3><p>Why 'buy and hold forever' is outdated advice. The myth of real estate being passive income.</p>`,
    CONVERSION: `<h2>The Offer</h2><p>Social proof, case studies, CTAs — content that moves warm audiences to take action.</p><h3>What Working With Us Looks Like</h3><p>Our onboarding process from first call to first deal. What a strategy call actually covers — no sales pitch.</p><h3>Results &amp; Transformations</h3><p>From overwhelmed and scrolling Zillow to closing off-market in 45 days. How a busy surgeon built a $3M portfolio without lifting a finger.</p><h3>Objection Handling</h3><p>'I don't have enough capital' — here's the real answer. 'The market is too unpredictable right now' — here's the data.</p>`,
    REACH_AR: `<h2>الجذب والاكتشاف</h2><p>الوصول إلى جمهور جديد لا يعرفنا بعد. قيمة خالصة، بلا عرض تجاري.</p><h3>خرافات السوق الخفي</h3><p>تحتاج مليون دولار+ للاستثمار في العقارات الفاخرة. السوق الخفي يعني صفقات أسوأ.</p><h3>إحصاءات سوق الفخامة</h3><p>ما يبحث عنه مشترو الفخامة فعلياً في ٢٠٢٥. الأسواق التي تتصاعد فيها صفقات السوق الخفي.</p><h3>أخطاء المستثمر المبتدئ</h3><p>انتظار الظروف المثالية للسوق. الشراء بأعلى الميزانية بلا احتياطي.</p>`,
    AUTHORITY_AR: `<h2>الدليل والعمق</h2><p>مشاركة المعرفة والرؤى التي تبني خبرة حقيقية في أعين الجمهور.</p><h3>تحليل صفقات العملاء</h3><p>صفقة ٢.٣ مليون أغلقناها في ١١ يوماً. كيف حوّل عميل ٤٠٠ ألف إلى ١.١ مليون في ٣ سنوات.</p><h3>شرح العائد على الاستثمار</h3><p>كيف نحسب العائد المتوقع قبل التوصية بعقار. الفرق بين العائد الإجمالي والصافي.</p><h3>آراء مخالفة للسائد</h3><p>لماذا نصيحة اشترِ واحتفظ للأبد أصبحت قديمة. خرافة أن العقارات دخل سلبي.</p>`,
    CONVERSION_AR: `<h2>العرض</h2><p>إثبات اجتماعي، دراسات حالة، دعوات للتحرك — محتوى يحرك الجمهور الدافئ نحو الفعل.</p><h3>كيف يبدو العمل معنا</h3><p>عملية التأهيل لدينا من المكالمة الأولى إلى أول صفقة. ما تغطيه مكالمة الاستراتيجية فعلاً.</p><h3>النتائج والتحولات</h3><p>من التصفح المرهق في Zillow إلى إغلاق صفقة خفية في ٤٥ يوماً.</p><h3>معالجة الاعتراضات</h3><p>ليس لدي رأس مال كافٍ — إليك الجواب الحقيقي. السوق غير مستقر — إليك البيانات.</p>`,
  };

  const [pillars, setPillars] = useState([
    { id:"REACH",      ratio:40, expanded:true  },
    { id:"AUTHORITY",  ratio:40, expanded:false },
    { id:"CONVERSION", ratio:20, expanded:false },
  ]);
  const [bubble, setBubble] = useState(null);
  const [flash, setFlash] = useState(null);
  const [activePillar, setActivePillar] = useState(null);
  const refs = { REACH: React.useRef(null), AUTHORITY: React.useRef(null), CONVERSION: React.useRef(null) };

  // Seed editors on mount
  React.useEffect(() => {
    ["REACH","AUTHORITY","CONVERSION"].forEach(id => {
      const el = refs[id].current;
      if (el && !el.dataset.init) { el.innerHTML = isArabic ? SEED[id+"_AR"] : SEED[id]; el.dataset.init = "1"; }
    });
  }, []);

  // Re-seed when language toggles
  const prevArabic = React.useRef(isArabic);
  React.useEffect(() => {
    if (prevArabic.current === isArabic) return;
    prevArabic.current = isArabic;
    ["REACH","AUTHORITY","CONVERSION"].forEach(id => {
      const el = refs[id].current;
      if (el) el.innerHTML = isArabic ? SEED[id+"_AR"] : SEED[id];
    });
  }, [isArabic]);

  const triggerAutoSave = () => {};



  const updatePillar = (id, field, val) => setPillars(p => p.map(x => x.id===id ? {...x,[field]:val} : x));
  const savedRange = React.useRef(null);
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
  };
  const restoreSelection = () => {
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };
  const fmt = (cmd, val = null) => {
    restoreSelection();
    document.execCommand(cmd, false, val);
  };
  const insertBlock = (tag) => {
    restoreSelection();
    document.execCommand("formatBlock", false, tag);
  };

  const insertToggle = () => {
    restoreSelection();
    const sel = window.getSelection();
    const headingText = sel?.toString().trim() || (isArabic ? "عنوان القسم" : "Section heading");
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) document.execCommand("delete", false, null);
    const html = `<details open><summary><span style="font-size:20px;font-weight:700;color:#f0f0f5;letter-spacing:-0.01em;">${headingText}</span></summary><div class="toggle-body" contenteditable="true"><p>${isArabic ? "اكتب هنا..." : "Write here..."}</p></div></details><p><br></p>`;
    document.execCommand("insertHTML", false, html);
    savedRange.current = null;
    setBubble(null);
  };
  const handleSelect = (pillarId) => {
    setActivePillar(pillarId);
    setTimeout(() => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (!text || text.length < 3) { setBubble(null); return; }
      saveSelection();
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setBubble({ text, pillarId, x: rect.left + rect.width / 2, y: rect.top });
    }, 10);
  };

  const handleAdd = () => {
    if (!bubble) return;
    onAddToContent([{ title: bubble.text.slice(0, 120), pillar: bubble.pillarId }]);
    setFlash(bubble.pillarId);
    setTimeout(() => setFlash(null), 900);
    setBubble(null);
    savedRange.current = null;
  };

  const FONTS = [
    { label:"DM Sans",       value:"'DM Sans', sans-serif",                  preview:"Aa" },
    { label:"Cairo",         value:"'Cairo', 'Noto Sans Arabic', sans-serif", preview:"عر", arabic:true },
    { label:"Noto Kufi",     value:"'Noto Kufi Arabic', sans-serif",          preview:"كو", arabic:true },
    { label:"Georgia",       value:"Georgia, serif",                          preview:"Aa" },
    { label:"Courier",       value:"'Courier New', monospace",                preview:"Aa" },
  ];
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value);
  const [fontOpen, setFontOpen] = useState(false);

  const applyFont = (fontValue) => {
    setSelectedFont(fontValue);
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.toString().trim()) {
      document.execCommand("fontName", false, fontValue);
    }
    Object.values(refs).forEach(ref => {
      if (ref.current) ref.current.style.fontFamily = fontValue;
    });
    setFontOpen(false);
  };

  const COLORS = [
    { color:"#c084fc", label:"Purple"  },
    { color:"#38bdf8", label:"Sky"     },
    { color:"#34d399", label:"Green"   },
    { color:"#f97316", label:"Orange"  },
    { color:"#facc15", label:"Yellow"  },
    { color:"#fb7185", label:"Pink"    },
    { color:"#e2e8f0", label:"White"   },
  ];

  const docStyles = `
    .p2editor { outline:none; min-height:100px; caret-color:#c084fc; }
    .p2editor h1 { font-size:26px; font-weight:800; color:#f0f0f5; margin:22px 0 8px; letter-spacing:-0.02em; line-height:1.2; font-family:inherit; }
    .p2editor h2 { font-size:20px; font-weight:700; color:#f0f0f5; margin:20px 0 6px; letter-spacing:-0.01em; font-family:inherit; }
    .p2editor h3 { font-size:11px; font-weight:700; color:#7070a0; margin:16px 0 4px; letter-spacing:0.12em; text-transform:uppercase; font-family:inherit; }
    .p2editor p { font-size:13px; color:#a0a0c0; line-height:1.85; margin:0 0 8px; font-family:inherit; }
    .p2editor b, .p2editor strong { color:#f0f0f5 !important; font-weight:700; }
    .p2editor i, .p2editor em { font-style:italic; }
    .p2editor ::selection { background:#c084fc44; }
    .p2editor ul, .p2editor ol { color:#a0a0c0; font-size:13px; line-height:1.85; margin:4px 0 8px; padding-left:22px; font-family:inherit; }
    .p2editor li { margin-bottom:3px; }
    .p2editor ul li::marker { color:#c084fc; }
    .p2editor ol li::marker { color:#c084fc; font-size:11px; font-family:'DM Mono',monospace; }
    .p2editor details summary { display:flex; align-items:baseline; gap:6px; list-style:none; cursor:pointer; padding:0; margin:0; background:transparent; }
    .p2editor details summary::-webkit-details-marker { display:none; }
    .p2editor details summary::before { content:'▾'; font-size:11px; color:#7070a0; transition:transform 0.15s; flex-shrink:0; margin-top:1px; line-height:inherit; }
    .p2editor details:not([open]) summary::before { content:'▸'; color:#7070a0; }
    .p2editor .toggle-body { padding-left:18px; padding-right:0; margin:0; border-left:1px solid #2a2a3e; margin-left:6px; }
    .p2editor[dir="rtl"] .toggle-body { padding-left:0; padding-right:18px; border-left:none; border-right:1px solid #2a2a3e; margin-left:0; margin-right:6px; }
    .p2tbtn { background:transparent; border:1px solid #1e1e2e; border-radius:3px; color:#7070a0; cursor:pointer; font-size:11px; padding:3px 8px; line-height:1; transition:background 0.1s,color 0.1s; }
    .p2tbtn:hover { background:#1e1e2e; color:#f0f0f5; }
  `;

  const ToolbarBtn = ({ label, cmd, val, tag, style: s }) => (
    <button className="p2tbtn"
      style={s}
      onMouseDown={e => { e.preventDefault(); tag ? insertBlock(tag) : fmt(cmd, val); }}>
      {label}
    </button>
  );

  const totalWords = ["REACH","AUTHORITY","CONVERSION"].reduce((a,id) => {
    const el = refs[id].current;
    return a + (el ? el.innerText.trim().split(/\s+/).filter(Boolean).length : 0);
  }, 0);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:T.base }}>
      <style>{docStyles}</style>

      {/* ── Sticky toolbar ── */}
      <div style={{ flexShrink:0, background:T.surface, borderBottom:`1px solid ${T.line}`, padding:"7px 28px", display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
        <ToolbarBtn label="H1" tag="h1" style={{ fontFamily:mono, fontWeight:800 }} />
        <ToolbarBtn label="H2" tag="h2" style={{ fontFamily:mono, fontWeight:800 }} />
        <ToolbarBtn label="H3" tag="h3" style={{ fontFamily:mono, fontWeight:800 }} />
        <button className="p2tbtn" title={isArabic?"قسم قابل للطي":"Collapsible section"}
          onMouseDown={e => { e.preventDefault(); insertToggle(); }}
          style={{ display:"flex", alignItems:"center", gap:4, fontFamily:mono, letterSpacing:"0.04em" }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          {isArabic ? "طيّ" : "Collapse"}
        </button>
        <div style={{ width:1, height:18, background:T.line, margin:"0 3px" }}/>
        {/* Font selector */}
        <div style={{ position:"relative" }}>
          <button
            onMouseDown={e => { e.preventDefault(); setFontOpen(p => !p); }}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:4, border:`1px solid ${fontOpen ? T.goldLine : T.line}`, background:fontOpen ? T.goldBg : T.lift, cursor:"pointer", minWidth:110 }}>
            <span style={{ fontSize:12, color:T.ink, fontFamily:selectedFont, flex:1, textAlign:"left" }}>
              {FONTS.find(f => f.value === selectedFont)?.label ?? "Font"}
            </span>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={T.dim} strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {fontOpen && (
            <div style={{ position:"absolute", left:0, top:"calc(100% + 4px)", zIndex:400, background:T.raised, border:`1px solid ${T.lineHi}`, borderRadius:6, overflow:"hidden", minWidth:160, boxShadow:"0 8px 24px #00000077" }}>
              {FONTS.map(f => (
                <button key={f.value}
                  onMouseDown={e => { e.preventDefault(); applyFont(f.value); }}
                  style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 14px", background: selectedFont===f.value ? T.goldBg : "transparent", border:"none", cursor:"pointer", textAlign:"left",
                    borderLeft: selectedFont===f.value ? `2px solid ${T.gold}` : "2px solid transparent",
                    transition:"background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.lift}
                  onMouseLeave={e => e.currentTarget.style.background = selectedFont===f.value ? T.goldBg : "transparent"}>
                  <span style={{ fontSize:16, fontFamily:f.value, color: f.arabic ? T.gold : T.ink, minWidth:24, textAlign:"center", lineHeight:1 }}>{f.preview}</span>
                  <div>
                    <div style={{ fontSize:12, color: selectedFont===f.value ? T.gold : T.ink, fontFamily:"'DM Sans',sans-serif", fontWeight: selectedFont===f.value ? 700 : 400 }}>{f.label}</div>
                    {f.arabic && <div style={{ fontSize:9, color:T.dim, fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em" }}>ARABIC</div>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ width:1, height:18, background:T.line, margin:"0 3px" }}/>
        <ToolbarBtn label="B" cmd="bold"   style={{ fontFamily:serif, fontWeight:800, fontSize:13 }} />
        <ToolbarBtn label="I" cmd="italic" style={{ fontFamily:serif, fontStyle:"italic", fontSize:13 }} />
        <div style={{ width:1, height:18, background:T.line, margin:"0 3px" }}/>
        {/* Alignment */}
        {[
          { cmd:"justifyLeft",   title:"Align left",    icon:<><rect x="3" y="6" width="18" height="2" rx="1"/><rect x="3" y="11" width="12" height="2" rx="1"/><rect x="3" y="16" width="15" height="2" rx="1"/></> },
          { cmd:"justifyCenter", title:"Align center",  icon:<><rect x="3" y="6" width="18" height="2" rx="1"/><rect x="6" y="11" width="12" height="2" rx="1"/><rect x="4" y="16" width="16" height="2" rx="1"/></> },
          { cmd:"justifyRight",  title:"Align right",   icon:<><rect x="3" y="6" width="18" height="2" rx="1"/><rect x="9" y="11" width="12" height="2" rx="1"/><rect x="6" y="16" width="15" height="2" rx="1"/></> },
          { cmd:"justifyFull",   title:"Justify",       icon:<><rect x="3" y="6" width="18" height="2" rx="1"/><rect x="3" y="11" width="18" height="2" rx="1"/><rect x="3" y="16" width="18" height="2" rx="1"/></> },
        ].map(({ cmd, title, icon }) => (
          <button key={cmd} title={title}
            onMouseDown={e => { e.preventDefault(); fmt(cmd); }}
            style={{ display:"flex",alignItems:"center",justifyContent:"center", width:26, height:24, borderRadius:3, background:"transparent", border:`1px solid ${T.line}`, cursor:"pointer", flexShrink:0, outline:"none", transition:"background 0.1s" }}
            onMouseEnter={e => e.currentTarget.style.background=T.lift}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={T.dim}>{icon}</svg>
          </button>
        ))}
        <div style={{ width:1, height:18, background:T.line, margin:"0 3px" }}/>
        {/* Lists */}
        <button title="Bullet list"
          onMouseDown={e => { e.preventDefault(); fmt("insertUnorderedList"); }}
          style={{ display:"flex",alignItems:"center",justifyContent:"center", width:26, height:24, borderRadius:3, background:"transparent", border:`1px solid ${T.line}`, cursor:"pointer", flexShrink:0, outline:"none", transition:"background 0.1s" }}
          onMouseEnter={e => e.currentTarget.style.background=T.lift}
          onMouseLeave={e => e.currentTarget.style.background="transparent"}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.dim} strokeWidth="2" strokeLinecap="round">
            <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
            <circle cx="4" cy="6" r="1.5" fill={T.dim} stroke="none"/><circle cx="4" cy="12" r="1.5" fill={T.dim} stroke="none"/><circle cx="4" cy="18" r="1.5" fill={T.dim} stroke="none"/>
          </svg>
        </button>
        <button title="Numbered list"
          onMouseDown={e => { e.preventDefault(); fmt("insertOrderedList"); }}
          style={{ display:"flex",alignItems:"center",justifyContent:"center", width:26, height:24, borderRadius:3, background:"transparent", border:`1px solid ${T.line}`, cursor:"pointer", flexShrink:0, outline:"none", transition:"background 0.1s" }}
          onMouseEnter={e => e.currentTarget.style.background=T.lift}
          onMouseLeave={e => e.currentTarget.style.background="transparent"}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.dim} strokeWidth="2" strokeLinecap="round">
            <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
            <text x="1" y="8" fontSize="7" fill={T.dim} stroke="none" fontFamily="monospace">1</text>
            <text x="1" y="14" fontSize="7" fill={T.dim} stroke="none" fontFamily="monospace">2</text>
            <text x="1" y="20" fontSize="7" fill={T.dim} stroke="none" fontFamily="monospace">3</text>
          </svg>
        </button>
        <div style={{ width:1, height:18, background:T.line, margin:"0 3px" }}/>
        <span style={{ fontSize:9, color:T.ghost, fontFamily:mono, letterSpacing:"0.08em", marginRight:2 }}>{isArabic?"لون":"COLOR"}</span>
        {COLORS.map(({color,label}) => (
          <button key={color} title={label}
            onMouseDown={e => { e.preventDefault(); fmt("foreColor", color); }}
            style={{ width:14, height:14, borderRadius:"50%", background:color, border:"2px solid transparent", cursor:"pointer", flexShrink:0, outline:"none", transition:"transform 0.1s" }}
            onMouseEnter={e => e.currentTarget.style.transform="scale(1.3)"}
            onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
          />
        ))}
        <span style={{ fontSize:9, color:T.ghost, fontFamily:mono, letterSpacing:"0.08em", marginLeft:4, marginRight:2 }}>{isArabic?"تظليل":"HIGHLIGHT"}</span>
        {COLORS.map(({color,label}) => (
          <button key={"h"+color} title={"Highlight "+label}
            onMouseDown={e => { e.preventDefault(); fmt("hiliteColor", color+"44"); }}
            style={{ width:14, height:14, borderRadius:3, background:color+"44", border:`1px solid ${color}88`, cursor:"pointer", flexShrink:0, outline:"none", transition:"transform 0.1s" }}
            onMouseEnter={e => e.currentTarget.style.transform="scale(1.3)"}
            onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
          />
        ))}
        <button title={isArabic?"إزالة التظليل":"Remove highlight"}
          onMouseDown={e => { e.preventDefault(); fmt("hiliteColor", "transparent"); fmt("foreColor", T.muted); }}
          style={{ display:"flex",alignItems:"center",justifyContent:"center", width:18, height:18, borderRadius:3, background:"transparent", border:`1px solid ${T.line}`, cursor:"pointer", flexShrink:0, outline:"none", marginLeft:1, transition:"border-color 0.1s,background 0.1s" }}
          onMouseEnter={e => { e.currentTarget.style.background=T.lift; e.currentTarget.style.borderColor=T.lineHi; }}
          onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=T.line; }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.dim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5"/>
            <path d="M6.5 17.5l-4-4"/>
            <line x1="3" y1="3" x2="21" y2="21" stroke="#fb7185" strokeWidth="2"/>
          </svg>
        </button>
        <div style={{ flex:1 }}/>
        <span style={{ fontSize:9, color:T.ghost, fontFamily:mono }}>{totalWords} {isArabic?"كلمة":"words"}</span>
        <div style={{ width:1, height:18, background:T.line, margin:"0 6px" }}/>
        {/* Save flash indicator */}


      </div>

      {/* ── Doc + History panel ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
      {/* ── Scrollable doc ── */}
      <div style={{ flex:1, overflowY:"auto", position:"relative" }} onClick={() => setBubble(null)}>

        {/* Floating bubble */}
        {bubble && (
          <div onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()}
            style={{ position:"fixed", left:bubble.x, top:bubble.y, transform:"translate(-50%,calc(-100% - 10px))", zIndex:700, background:T.raised, border:`1px solid ${T.goldLine}`, borderRadius:7, padding:"6px 10px", display:"flex", alignItems:"center", gap:6, boxShadow:"0 8px 28px #00000099" }}>
            <span style={{ fontSize:10, color:T.dim, fontFamily:mono, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              "{bubble.text.slice(0,36)}{bubble.text.length>36?"...":""}"
            </span>
            <div style={{ width:1, height:16, background:T.line }}/>
            <button onMouseDown={e=>{e.preventDefault();handleAdd();}}
              style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, color:"#fff", background:T.gold, border:"none", borderRadius:4, padding:"4px 10px", cursor:"pointer", fontFamily:serif, whiteSpace:"nowrap" }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              {isArabic?"أضف للمحتوى":"Add to Content"}
            </button>
            <button onMouseDown={e=>{e.preventDefault();setBubble(null);}}
              style={{ background:"none", border:"none", color:T.ghost, cursor:"pointer", fontSize:15, lineHeight:1, padding:"0 2px" }}>×</button>
          </div>
        )}

        <div style={{ maxWidth:760, margin:"0 auto", padding:"40px 40px 100px", direction:editorDir, fontFamily:serif }}>

          {/* Page title */}
          <div style={{ marginBottom:36, paddingBottom:24, borderBottom:`1px solid ${T.line}` }}>
            <span style={{ fontSize:9, letterSpacing:"0.2em", color:T.gold, fontFamily:mono }}>{isArabic?"استراتيجية المحتوى · وثيقة":"CONTENT STRATEGY · DOC VIEW"}</span>
            <h1 style={{ fontSize:28, fontWeight:800, color:T.ink, margin:"8px 0 6px", fontFamily:serif, letterSpacing:"-0.02em" }}>
              {isArabic?"منظومة ركائز المحتوى":"Content Pillar Strategy"}
            </h1>
            <p style={{ fontSize:12, color:T.dim, margin:0, lineHeight:1.7 }}>
              {isArabic
                ?"اكتب وعدّل وانسخ بحرية — حدد أي نص لتنسيقه أو إضافته إلى قائمة السكريبتات"
                :"Write, edit and paste freely. Select any text to format it or push it to your script queue."}
            </p>
          </div>

          {/* Pillars */}
          {pillars.map((pillar, idx) => {
            const m = PILLAR_META[pillar.id];
            const isF = flash === pillar.id;
            return (
              <div key={pillar.id} style={{ marginBottom:44 }}>

                {/* Pillar header */}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, cursor:"pointer" }}
                  onClick={() => updatePillar(pillar.id,"expanded",!pillar.expanded)}>
                  <div style={{ width:3, height:34, background:m.color, borderRadius:99, flexShrink:0, opacity:pillar.expanded?1:0.3, transition:"opacity 0.2s" }}/>
                  <span style={{ fontSize:9, fontFamily:mono, color:m.color, background:m.bg, border:`1px solid ${m.border}`, borderRadius:2, padding:"2px 7px", letterSpacing:"0.12em" }}>{m.num}</span>
                  <span style={{ fontSize:9, fontFamily:mono, color:m.color, letterSpacing:"0.14em" }}>{isArabic?m.labelAr:m.label}</span>
                  <div style={{ flex:1 }}/>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }} onClick={e=>e.stopPropagation()}>
                    <input type="range" min={5} max={70} step={5} value={pillar.ratio}
                      onChange={e=>updatePillar(pillar.id,"ratio",Number(e.target.value))}
                      style={{ width:56, accentColor:m.color, cursor:"pointer" }} />
                    <span style={{ fontSize:10, fontFamily:mono, color:m.color, minWidth:28, textAlign:"center" }}>{pillar.ratio}%</span>
                  </div>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.dim} strokeWidth="2" strokeLinecap="round"
                    style={{ transform:pillar.expanded?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s", flexShrink:0 }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>

                {/* Editor */}
                {pillar.expanded && (
                  <div style={{ position:"relative", paddingLeft:editorDir==="rtl"?0:18, paddingRight:editorDir==="rtl"?18:0 }}>
                    <div style={{ position:"absolute", [editorDir==="rtl"?"right":"left"]:0, top:4, bottom:4, width:2, background:`linear-gradient(to bottom,${m.color}99,transparent)`, borderRadius:99 }}/>
                    <div
                      ref={refs[pillar.id]}
                      className="p2editor"
                      contentEditable
                      suppressContentEditableWarning
                      onInput={() => triggerAutoSave()}
                      onMouseUp={() => handleSelect(pillar.id)}
                      onKeyUp={e => { triggerAutoSave(); if(e.shiftKey||window.getSelection()?.toString().trim()) handleSelect(pillar.id); else setBubble(null); }}
                      style={{ direction:editorDir, fontFamily:serif, minHeight:100, outline:"none" }}
                    />
                    {isF && <div style={{ position:"absolute", inset:0, background:`${m.color}0d`, borderRadius:4, pointerEvents:"none", border:`1px solid ${m.color}22` }}/>}
                  </div>
                )}

                {/* Collapsed preview */}
                {!pillar.expanded && (
                  <div onClick={() => updatePillar(pillar.id,"expanded",true)}
                    style={{ paddingLeft:editorDir==="rtl"?0:18, paddingRight:editorDir==="rtl"?18:0, color:T.ghost, fontSize:12, fontFamily:serif, lineHeight:1.6, cursor:"pointer" }}>
                    {refs[pillar.id].current?.innerText?.slice(0,100) ?? "..."}…
                  </div>
                )}

                {idx < pillars.length-1 && (
                  <div style={{ height:1, background:`linear-gradient(to ${editorDir==="rtl"?"left":"right"},${m.color}22,transparent)`, marginTop:28 }}/>
                )}
              </div>
            );
          })}

          <div style={{ display:"flex", alignItems:"center", gap:8, opacity:0.3, marginTop:8 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.dim} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <span style={{ fontSize:10, color:T.dim, fontFamily:mono }}>
              {isArabic?"حدد أي نص ← شريط الأدوات يظهر تلقائياً ← أضف إلى قائمة السكريبتات":"Select any text → format it → or add straight to your script queue"}
            </span>
          </div>
          </div>
        </div>

      </div>



      </div>
  );
}


function TemplatesView({ initialFilter, onBack, onUse }) {
  const mono = "'DM Mono', monospace";
  const sans = "'DM Sans', sans-serif";
  const [filter, setFilter] = useState(initialFilter || "All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);
  const [vals, setVals] = useState({});

  const pillars = ["All","AUTHORITY","CONVERSION","REACH"];
  const filtered = TEMPLATES_DATA_SEED.filter(t => {
    const matchPillar = filter === "All" || t.pillar === filter;
    const matchSearch = search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
    return matchPillar && matchSearch;
  });
  const pc = { AUTHORITY: T.auth, CONVERSION: T.conv, REACH: T.reach };

  const tmpl = open ? TEMPLATES_DATA_SEED.find(t => t.id === open) : null;
  const openColor = tmpl ? (pc[tmpl.pillar] || T.gold) : T.gold;

  const fieldSt = { width:"100%", background:T.lift, border:"1px solid "+T.line, borderRadius:5, padding:"9px 12px", color:T.ink, fontSize:12, outline:"none", fontFamily:sans, boxSizing:"border-box", resize:"vertical" };
  const fieldStNR = { width:"100%", background:T.lift, border:"1px solid "+T.line, borderRadius:5, padding:"9px 12px", color:T.ink, fontSize:12, outline:"none", fontFamily:sans, boxSizing:"border-box" };

  if (open && tmpl) {
    return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"14px 24px", borderBottom:"1px solid "+T.line, background:T.surface, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <button onClick={()=>setOpen(null)} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:13, fontFamily:sans }}>{"← Templates"}</button>
          <div style={{ flex:1, fontSize:15, fontWeight:700, color:T.ink, fontFamily:sans }}>{tmpl.name}</div>
          <span style={{ fontSize:9, fontWeight:700, color:openColor, background:openColor+"18", borderRadius:2, padding:"2px 8px", fontFamily:mono, letterSpacing:"0.1em" }}>{tmpl.pillar}</span>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>
          <p style={{ fontSize:12, color:T.dim, marginBottom:24, fontFamily:sans }}>{tmpl.desc}</p>
          {tmpl.fields.map(f => (
            <div key={f.id} style={{ marginBottom:20 }}>
              <div style={{ fontSize:9, letterSpacing:"0.14em", color:openColor, fontFamily:mono, marginBottom:6 }}>{f.label.toUpperCase()}</div>
              {f.hint && <div style={{ fontSize:11, color:T.ghost, fontFamily:sans, marginBottom:6 }}>{f.hint}</div>}
              {(f.type === "textarea" || f.type === "pairs" || f.type === "list") ? (
                <textarea value={vals[f.id]||""} onChange={e => { const v=e.target.value; setVals(p => Object.assign({}, p, {[f.id]: v})); }} rows={f.type === "list" ? 4 : 3} style={fieldSt}/>
              ) : (
                <input value={vals[f.id]||""} onChange={e => { const v=e.target.value; setVals(p => Object.assign({}, p, {[f.id]: v})); }} style={fieldStNR}/>
              )}
            </div>
          ))}
          <button
            onClick={() => { onUse && onUse({...tmpl, vals}); onBack && onBack(); }}
            style={{ width:"100%", padding:"12px", background:openColor, border:"none", borderRadius:6, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:sans, marginTop:8 }}>
            Use This Template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"14px 24px", borderBottom:"1px solid "+T.line, background:T.surface, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        {onBack && (
          <button onClick={onBack} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:13, fontFamily:sans }}>{"← Back"}</button>
        )}
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, letterSpacing:"0.14em", color:T.dim, fontFamily:mono, marginBottom:2 }}>SCRIPT TEMPLATES</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink, fontFamily:sans }}>{filtered.length} templates</div>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..."
          style={{ background:T.lift, border:"1px solid "+T.line, borderRadius:5, padding:"7px 12px", color:T.ink, fontSize:12, outline:"none", fontFamily:sans, width:200 }}/>
      </div>
      <div style={{ display:"flex", gap:0, borderBottom:"1px solid "+T.line, background:T.surface, flexShrink:0 }}>
        {pillars.map(p => {
          const active = filter === p;
          return (
            <button key={p} onClick={() => setFilter(p)}
              style={{ padding:"10px 18px", fontSize:11, fontWeight:active?700:500, color:active?T.gold:T.dim, background:"transparent", border:"none", borderBottom:"2px solid "+(active?T.gold:"transparent"), cursor:"pointer", fontFamily:mono, letterSpacing:"0.06em" }}>
              {p}
            </button>
          );
        })}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:14 }}>
          {filtered.map(tmpl => {
            const color = pc[tmpl.pillar] || T.gold;
            return (
              <div key={tmpl.id} onClick={() => setOpen(tmpl.id)}
                style={{ background:T.surface, border:"1px solid "+T.line, borderRadius:10, padding:"18px", cursor:"pointer" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <span style={{ fontSize:9, fontWeight:700, color, background:color+"18", borderRadius:2, padding:"2px 7px", fontFamily:mono, letterSpacing:"0.1em" }}>{tmpl.pillar}</span>
                  <span style={{ fontSize:9, color:T.ghost, fontFamily:mono }}>{tmpl.duration}</span>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, fontFamily:sans, marginBottom:6 }}>{tmpl.name}</div>
                <div style={{ fontSize:11, color:T.dim, fontFamily:sans, lineHeight:1.5, marginBottom:12 }}>{tmpl.desc}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {tmpl.tags.map(tag => (
                    <span key={tag} style={{ fontSize:9, color:T.ghost, background:T.lift, borderRadius:2, padding:"2px 7px", fontFamily:mono }}>{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScriptEditorDrawer({ script, onClose, onUpdate, scripts, setScripts, avatars = INIT_AVATARS }) {
  const mono = "'DM Mono', monospace";
  const sans = "'DM Sans', sans-serif";
  const [hook, setHook] = useState(script.hook);
  const [body, setBody] = useState(script.body);
  const [cta,  setCta]  = useState(script.cta);
  const [status, setStatus] = useState(script.status);
  const [title, setTitle] = useState(script.title);

  const pillarColor = { AUTHORITY:T.auth, CONVERSION:T.conv, REACH:T.reach };
  const pc = pillarColor[script.pillar] || T.gold;
  const ta = { width:"100%", background:T.lift, border:`1px solid ${T.line}`, borderRadius:5, padding:"9px 12px", color:T.ink, fontSize:12, outline:"none", fontFamily:sans, boxSizing:"border-box", resize:"vertical", lineHeight:1.6 };

  const save = () => {
    const updated = { ...script, hook, body, cta, status, title };
    onUpdate(updated);
  };

  return (
    <div style={{ width:460, borderLeft:`1px solid ${T.line}`, background:T.raised, display:"flex", flexDirection:"column", overflow:"hidden", flexShrink:0 }}>
      <div style={{ padding:"14px 20px", borderBottom:`1px solid ${T.line}`, display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <div style={{ width:3, height:24, background:pc, borderRadius:99 }}/>
        <div style={{ flex:1 }}>
          <input value={title} onChange={e=>setTitle(e.target.value)}
            style={{ background:"transparent", border:"none", color:T.ink, fontSize:14, fontWeight:700, outline:"none", fontFamily:sans, width:"100%" }}/>
          <span style={{ fontSize:9, fontWeight:700, color:pc, background:pc+"18", border:`1px solid ${pc}33`, borderRadius:2, padding:"1px 6px", fontFamily:mono, letterSpacing:"0.1em" }}>{script.pillar}</span>
        </div>
        <select value={status} onChange={e=>{setStatus(e.target.value);}}
          style={{ background:T.surface, border:`1px solid ${T.line}`, color:T.ink, borderRadius:4, padding:"4px 8px", fontSize:10, fontFamily:mono, outline:"none" }}>
          {["DRAFT","REVIEW","APPROVED","DONE"].map(s=><option key={s}>{s}</option>)}
        </select>
        <button onClick={onClose} style={{ background:"none", border:"none", color:T.ghost, cursor:"pointer", fontSize:18, lineHeight:1 }}>×</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"18px 20px" }}>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, letterSpacing:"0.14em", color:T.gold, fontFamily:mono, marginBottom:5 }}>HOOK</div>
          <textarea value={hook} onChange={e=>setHook(e.target.value)} rows={2} style={ta}/>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9, letterSpacing:"0.14em", color:T.reach, fontFamily:mono, marginBottom:5 }}>BODY</div>
          <textarea value={body} onChange={e=>setBody(e.target.value)} rows={5} style={ta}/>
        </div>
        <div>
          <div style={{ fontSize:9, letterSpacing:"0.14em", color:T.conv, fontFamily:mono, marginBottom:5 }}>CALL TO ACTION</div>
          <textarea value={cta} onChange={e=>setCta(e.target.value)} rows={2} style={ta}/>
        </div>
      </div>
      <div style={{ padding:"12px 20px", borderTop:`1px solid ${T.line}`, display:"flex", gap:8, flexShrink:0 }}>
        <button onClick={onClose} style={{ flex:1, padding:"8px", background:"none", border:`1px solid ${T.line}`, borderRadius:5, color:T.dim, fontSize:12, cursor:"pointer", fontFamily:sans }}>Discard</button>
        <button onClick={save} style={{ flex:2, padding:"8px", background:T.gold, border:"none", borderRadius:5, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:sans }}>Save Script</button>
      </div>
    </div>
  );
}

function ContentTab({ scripts, setScripts, avatars = INIT_AVATARS, doctors = null }) {
  const mono = "'DM Mono', monospace";
  const sans = "'DM Sans', sans-serif";
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("sessions");
  const [showTemplates, setShowTemplates] = useState(false);
  const [openEditor, setOpenEditor] = useState(null);
  const [openSession, setOpenSession] = useState(null);
  const [editScript, setEditScript] = useState(null);

  const sessions = [...new Set(scripts.map(s=>s.session))].sort();
  const filteredScripts = filter==="All" ? scripts : scripts.filter(s=>s.pillar===filter);
  const pillarColor = { AUTHORITY:T.auth, CONVERSION:T.conv, REACH:T.reach };
  const pillarBg    = { AUTHORITY:T.authBg, CONVERSION:T.convBg, REACH:T.reachBg };

  const updateScript = (updated) => {
    setScripts(p => p.map(s => s.id===updated.id ? updated : s));
    setEditScript(null);
  };

  const handleUseTemplate = (tmpl) => {
    const s = { id:Date.now()+Math.random(), title:tmpl.name, pillar:tmpl.pillar, status:"DRAFT", session:"Session 1", hook:tmpl.vals?.f1||"", altHooks:[], body:tmpl.vals?.f2||"", cta:tmpl.vals?.f5||tmpl.vals?.f6||"", duration:tmpl.duration||"~30s" };
    setScripts(p=>[...p,s]);
  };

  if (showTemplates) {
    return <TemplatesView onBack={()=>setShowTemplates(false)} onUse={handleUseTemplate}/>;
  }

  return (
    <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Top bar */}
        <div style={{ padding:"12px 24px", borderBottom:`1px solid ${T.line}`, background:T.surface, display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          {["All","AUTHORITY","CONVERSION","REACH"].map(f => (
            <button key={f} onClick={()=>setFilter(f)}
              style={{ fontSize:11, fontWeight:filter===f?700:500, color:filter===f?T.gold:T.dim, background:filter===f?T.goldBg:"transparent", border:`1px solid ${filter===f?T.goldLine:"transparent"}`, borderRadius:4, padding:"5px 12px", cursor:"pointer", fontFamily:mono, letterSpacing:"0.06em" }}>
              {f}
            </button>
          ))}
          <div style={{ flex:1 }}/>
          <button onClick={()=>setShowTemplates(true)}
            style={{ fontSize:11, fontWeight:700, color:T.dim, background:T.lift, border:`1px solid ${T.line}`, borderRadius:5, padding:"6px 14px", cursor:"pointer", fontFamily:mono, letterSpacing:"0.06em" }}>
            Templates
          </button>
          <button onClick={()=>{ const s={id:Date.now(),title:"New Script",pillar:"REACH",status:"DRAFT",session:sessions[0]||"Session 1",hook:"",altHooks:[],body:"",cta:"",duration:"~30s"}; setScripts(p=>[...p,s]); setEditScript(s); }}
            style={{ fontSize:11, fontWeight:700, color:"#fff", background:T.gold, border:"none", borderRadius:5, padding:"6px 14px", cursor:"pointer", fontFamily:mono, letterSpacing:"0.06em" }}>
            + Script
          </button>
        </div>

        {/* Sessions view */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
          {sessions.map(session => {
            const sessScripts = filteredScripts.filter(s=>s.session===session);
            const isOpen = openSession===session;
            return (
              <div key={session} style={{ marginBottom:16 }}>
                <div onClick={()=>setOpenSession(isOpen?null:session)}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, cursor:"pointer", marginBottom: isOpen?0:0 }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=T.lineHi}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=T.line}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T.dim} strokeWidth="2.5"
                    style={{ transform:isOpen?"rotate(90deg)":"rotate(0deg)", transition:"transform 0.15s", flexShrink:0 }}>
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                  <span style={{ fontSize:13, fontWeight:700, color:T.ink, fontFamily:sans, flex:1 }}>{session}</span>
                  <span style={{ fontSize:10, color:T.dim, fontFamily:mono }}>{sessScripts.length} scripts</span>
                  <div style={{ display:"flex", gap:5 }}>
                    {["APPROVED","DRAFT","REVIEW"].map(st => {
                      const count = sessScripts.filter(s=>s.status===st).length;
                      if(!count) return null;
                      const c = st==="APPROVED"?T.conv:st==="REVIEW"?T.gold:T.ghost;
                      return <span key={st} style={{ fontSize:9, color:c, background:c+"18", border:`1px solid ${c}33`, borderRadius:2, padding:"1px 6px", fontFamily:mono }}>{count} {st}</span>;
                    })}
                  </div>
                </div>
                {isOpen && (
                  <div style={{ border:`1px solid ${T.line}`, borderTop:"none", borderRadius:"0 0 8px 8px", overflow:"hidden" }}>
                    {sessScripts.map((s, idx) => {
                      const color = pillarColor[s.pillar] || T.gold;
                      const bg = pillarBg[s.pillar] || T.goldBg;
                      return (
                        <div key={s.id}
                          style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderTop:idx>0?`1px solid ${T.line}`:"none", background:T.lift, cursor:"pointer" }}
                          onClick={()=>setEditScript(s)}
                          onMouseEnter={e=>e.currentTarget.style.background=T.surface}
                          onMouseLeave={e=>e.currentTarget.style.background=T.lift}>
                          <div style={{ width:3, height:32, background:color, borderRadius:99, flexShrink:0 }}/>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:600, color:T.ink, fontFamily:sans, marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                            <div style={{ fontSize:11, color:T.dim, fontFamily:sans, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.hook||"No hook yet…"}</div>
                          </div>
                          <span style={{ fontSize:9, fontWeight:700, color, background:bg, border:`1px solid ${color}33`, borderRadius:2, padding:"2px 7px", fontFamily:mono, letterSpacing:"0.08em", flexShrink:0 }}>{s.pillar}</span>
                          <span style={{ fontSize:9, color:s.status==="APPROVED"?T.conv:T.dim, background:T.lift, border:`1px solid ${T.line}`, borderRadius:2, padding:"2px 7px", fontFamily:mono, flexShrink:0 }}>{s.status}</span>
                        </div>
                      );
                    })}
                    <div style={{ padding:"10px 16px", borderTop:`1px solid ${T.line}`, background:T.surface }}>
                      <button onClick={()=>{ const s={id:Date.now(),title:"New Script",pillar:"REACH",status:"DRAFT",session,hook:"",altHooks:[],body:"",cta:"",duration:"~30s"}; setScripts(p=>[...p,s]); setEditScript(s); }}
                        style={{ fontSize:11, color:T.dim, background:"none", border:`1px dashed ${T.line}`, borderRadius:4, padding:"6px 14px", cursor:"pointer", fontFamily:sans }}>
                        + Add script to {session}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {sessions.length===0 && (
            <div style={{ textAlign:"center", padding:"60px 20px", color:T.ghost, fontFamily:sans, fontSize:13 }}>
              No scripts yet. Use a template or add one manually.
            </div>
          )}
        </div>
      </div>

      {/* Script editor drawer */}
      {editScript && (
        <ScriptEditorDrawer
          script={editScript}
          onClose={()=>setEditScript(null)}
          onUpdate={updateScript}
          scripts={scripts}
          setScripts={setScripts}
          avatars={avatars}
        />
      )}
    </div>
  );
}

function TemplatesManager() {
  const mono = "'DM Mono', monospace";
  const sans = "'DM Sans', sans-serif";
  const [templates, setTemplates] = useState(TEMPLATES_DATA_SEED);
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);

  const filtered = filter==="All" ? templates : templates.filter(t=>t.pillar===filter);
  const pc = { AUTHORITY:T.auth, CONVERSION:T.conv, REACH:T.reach };

  if (editId) {
    const tmpl = templates.find(t=>t.id===editId);
    return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"14px 24px", borderBottom:`1px solid ${T.line}`, background:T.surface, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <button onClick={()=>setEditId(null)} style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:13, fontFamily:sans }}>← Templates</button>
          <span style={{ fontSize:15, fontWeight:700, color:T.ink, fontFamily:sans, flex:1 }}>{tmpl?.name || "Template"}</span>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"24px", color:T.dim, fontFamily:sans, fontSize:13 }}>
          Template editor — coming soon.
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"14px 24px", borderBottom:`1px solid ${T.line}`, background:T.surface, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, letterSpacing:"0.14em", color:T.dim, fontFamily:mono, marginBottom:2 }}>TEMPLATE LIBRARY</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink, fontFamily:sans }}>{templates.length} templates</div>
        </div>
        <button style={{ fontSize:11, fontWeight:700, color:"#fff", background:T.gold, border:"none", borderRadius:5, padding:"7px 16px", cursor:"pointer", fontFamily:mono }}>+ New Template</button>
      </div>
      <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${T.line}`, background:T.surface, flexShrink:0 }}>
        {["All","AUTHORITY","CONVERSION","REACH"].map(p => (
          <button key={p} onClick={()=>setFilter(p)}
            style={{ padding:"10px 18px", fontSize:11, fontWeight:filter===p?700:500, color:filter===p?T.gold:T.dim, background:"transparent", border:"none", borderBottom:`2px solid ${filter===p?T.gold:"transparent"}`, cursor:"pointer", fontFamily:mono, letterSpacing:"0.06em" }}>
            {p}
          </button>
        ))}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px,1fr))", gap:14 }}>
          {filtered.map(tmpl => {
            const color = pc[tmpl.pillar]||T.gold;
            return (
              <div key={tmpl.id} onClick={()=>setEditId(tmpl.id)}
                style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:10, padding:"18px", cursor:"pointer" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=color+"66"}
                onMouseLeave={e=>e.currentTarget.style.borderColor=T.line}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ fontSize:9, fontWeight:700, color, background:color+"18", border:`1px solid ${color}33`, borderRadius:2, padding:"2px 7px", fontFamily:mono, letterSpacing:"0.1em" }}>{tmpl.pillar}</span>
                  <span style={{ fontSize:9, color:T.ghost, fontFamily:mono }}>{tmpl.duration}</span>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, fontFamily:sans, marginBottom:6 }}>{tmpl.name}</div>
                <div style={{ fontSize:11, color:T.dim, fontFamily:sans, lineHeight:1.5 }}>{tmpl.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ResourcesTab() {
  const mono = "'DM Mono', monospace";
  const sans = "'DM Sans', sans-serif";
  const [resources, setResources] = useState(RESOURCES_DATA);
  const [filter, setFilter] = useState("All");
  const [adding, setAdding] = useState(false);
  const [newR, setNewR] = useState({ ref:"", url:"", pillar:"AUTHORITY", platform:"IG Reels", niche:"", views:"", likes:"" });

  const filtered = filter==="All" ? resources : resources.filter(r=>r.pillar===filter);
  const pc = { AUTHORITY:T.auth, CONVERSION:T.conv, REACH:T.reach };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"14px 24px", borderBottom:`1px solid ${T.line}`, background:T.surface, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, letterSpacing:"0.14em", color:T.dim, fontFamily:mono, marginBottom:2 }}>INSPIRATION LIBRARY</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink, fontFamily:sans }}>Resources</div>
        </div>
        <button onClick={()=>setAdding(p=>!p)}
          style={{ fontSize:11, fontWeight:700, color:"#fff", background:T.gold, border:"none", borderRadius:5, padding:"7px 16px", cursor:"pointer", fontFamily:mono }}>+ Add</button>
      </div>
      <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${T.line}`, background:T.surface, flexShrink:0 }}>
        {["All","AUTHORITY","CONVERSION","REACH"].map(p => (
          <button key={p} onClick={()=>setFilter(p)}
            style={{ padding:"10px 18px", fontSize:11, fontWeight:filter===p?700:500, color:filter===p?T.gold:T.dim, background:"transparent", border:"none", borderBottom:`2px solid ${filter===p?T.gold:"transparent"}`, cursor:"pointer", fontFamily:mono, letterSpacing:"0.06em" }}>
            {p}
          </button>
        ))}
      </div>
      {adding && (
        <div style={{ padding:"16px 24px", borderBottom:`1px solid ${T.line}`, background:T.surface, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, flexShrink:0 }}>
          {[["Creator Handle","ref"],["URL","url"],["Platform","platform"],["Niche","niche"],["Views","views"],["Likes","likes"]].map(([label,field]) => (
            <div key={field}>
              <div style={{ fontSize:9, color:T.dim, fontFamily:mono, marginBottom:4 }}>{label.toUpperCase()}</div>
              <input value={newR[field]} onChange={e=>setNewR(p=>({...p,[field]:e.target.value}))}
                style={{ width:"100%", background:T.lift, border:`1px solid ${T.line}`, borderRadius:4, padding:"7px 10px", color:T.ink, fontSize:12, outline:"none", fontFamily:sans, boxSizing:"border-box" }}/>
            </div>
          ))}
          <div>
            <div style={{ fontSize:9, color:T.dim, fontFamily:mono, marginBottom:4 }}>PILLAR</div>
            <select value={newR.pillar} onChange={e=>setNewR(p=>({...p,pillar:e.target.value}))}
              style={{ width:"100%", background:T.lift, border:`1px solid ${T.line}`, borderRadius:4, padding:"7px 10px", color:T.ink, fontSize:12, outline:"none", fontFamily:sans }}>
              {["AUTHORITY","CONVERSION","REACH"].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
            <button onClick={()=>{ setResources(p=>[...p,{...newR, id:Date.now()}]); setAdding(false); setNewR({ref:"",url:"",pillar:"AUTHORITY",platform:"IG Reels",niche:"",views:"",likes:""}); }}
              style={{ flex:1, padding:"8px", background:T.gold, border:"none", borderRadius:4, color:"#fff", fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:mono }}>Save</button>
            <button onClick={()=>setAdding(false)}
              style={{ flex:1, padding:"8px", background:"none", border:`1px solid ${T.line}`, borderRadius:4, color:T.dim, fontSize:11, cursor:"pointer", fontFamily:sans }}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {filtered.map(r => {
            const color = pc[r.pillar]||T.gold;
            return (
              <div key={r.id} style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:10, padding:"16px", display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink, fontFamily:sans, marginBottom:3 }}>{r.ref}</div>
                    <div style={{ fontSize:10, color:T.dim, fontFamily:sans }}>{r.platform} · {r.niche}</div>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color, background:color+"18", border:`1px solid ${color}33`, borderRadius:2, padding:"2px 7px", fontFamily:mono, letterSpacing:"0.1em" }}>{r.pillar}</span>
                </div>
                <div style={{ display:"flex", gap:12 }}>
                  <div style={{ fontSize:12, color:T.muted, fontFamily:mono }}>{r.views} views</div>
                  <div style={{ fontSize:12, color:T.muted, fontFamily:mono }}>{r.likes} likes</div>
                </div>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize:11, color:T.gold, fontFamily:mono, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {r.url}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProductionTab({ scripts: rawScripts, setScripts: setRawScripts }) {
  const mono = "'DM Mono', monospace";
  const sans = "'DM Sans', sans-serif";
  const [filter, setFilter] = useState("All");

  const scripts = filter==="All" ? rawScripts : rawScripts.filter(s=>s.status===filter);
  const pc = { AUTHORITY:T.auth, CONVERSION:T.conv, REACH:T.reach };

  const updateStatus = (id, status) => setRawScripts(p=>p.map(s=>s.id===id?{...s,status}:s));

  const cols = ["DRAFT","REVIEW","APPROVED","DONE"];
  const colColor = { DRAFT:T.dim, REVIEW:T.gold, APPROVED:T.conv, DONE:T.ghost };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"14px 24px", borderBottom:`1px solid ${T.line}`, background:T.surface, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, letterSpacing:"0.14em", color:T.dim, fontFamily:mono, marginBottom:2 }}>PRODUCTION PIPELINE</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink, fontFamily:sans }}>{rawScripts.length} scripts</div>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {cols.map(col => {
          const colScripts = rawScripts.filter(s=>s.status===col);
          const color = colColor[col];
          return (
            <div key={col} style={{ flex:1, display:"flex", flexDirection:"column", borderRight:`1px solid ${T.line}`, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.line}`, background:T.surface, flexShrink:0 }}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.14em", color, fontFamily:mono }}>{col}</div>
                <div style={{ fontSize:11, color:T.ghost, fontFamily:mono, marginTop:2 }}>{colScripts.length} scripts</div>
              </div>
              <div style={{ flex:1, overflowY:"auto", padding:"12px" }}>
                {colScripts.map(s => {
                  const c = pc[s.pillar]||T.gold;
                  return (
                    <div key={s.id} style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:8, padding:"12px", marginBottom:8 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:T.ink, fontFamily:sans, marginBottom:6, lineHeight:1.4 }}>{s.title}</div>
                      <div style={{ fontSize:10, color:T.dim, fontFamily:sans, marginBottom:8, lineHeight:1.4 }}>{s.hook?.slice(0,70)||"No hook"}…</div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:9, fontWeight:700, color:c, background:c+"18", border:`1px solid ${c}33`, borderRadius:2, padding:"1px 6px", fontFamily:mono, letterSpacing:"0.08em" }}>{s.pillar}</span>
                        <div style={{ display:"flex", gap:4 }}>
                          {col !== "DRAFT" && (
                            <button onClick={()=>updateStatus(s.id, cols[cols.indexOf(col)-1])}
                              style={{ fontSize:9, color:T.dim, background:"none", border:`1px solid ${T.line}`, borderRadius:3, padding:"2px 7px", cursor:"pointer", fontFamily:mono }}>←</button>
                          )}
                          {col !== "DONE" && (
                            <button onClick={()=>updateStatus(s.id, cols[cols.indexOf(col)+1])}
                              style={{ fontSize:9, color:T.gold, background:T.goldBg, border:`1px solid ${T.goldLine}`, borderRadius:3, padding:"2px 7px", cursor:"pointer", fontFamily:mono }}>→</button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClientViewTab({ client }) {
  const mono = "'DM Mono', monospace";
  const sans = "'DM Sans', sans-serif";
  const [sub, setSub] = useState("overview");

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"14px 24px", borderBottom:`1px solid ${T.line}`, background:T.surface, display:"flex", alignItems:"center", gap:0, flexShrink:0 }}>
        {["overview","scripts","brief"].map(s => (
          <button key={s} onClick={()=>setSub(s)}
            style={{ padding:"0 18px", height:42, fontSize:12, fontWeight:sub===s?700:500, color:sub===s?T.gold:T.dim, background:"transparent", border:"none", borderBottom:`2px solid ${sub===s?T.gold:"transparent"}`, cursor:"pointer", fontFamily:sans, letterSpacing:"0.03em", textTransform:"capitalize" }}>
            {s}
          </button>
        ))}
        <div style={{ flex:1 }}/>
        <div style={{ fontSize:10, color:T.dim, fontFamily:mono, letterSpacing:"0.1em" }}>CLIENT VIEW</div>
      </div>
      <div style={{ flex:1, overflowY:"auto", background:"#f5f5f8" }}>
        {sub==="overview" && (
          <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 32px" }}>
            <div style={{ background:"#fff", borderRadius:14, padding:"28px 32px", marginBottom:20, boxShadow:"0 2px 12px #0000000a" }}>
              <div style={{ fontSize:22, fontWeight:800, color:"#111", fontFamily:sans, marginBottom:6 }}>{client?.name}</div>
              <div style={{ fontSize:13, color:"#666", fontFamily:sans }}>{client?.type==="team" ? "Team Workspace" : "Individual Workspace"}</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
              {[["Scripts","0 ready","#c084fc"],["Approved","0 approved","#34d399"],["Sessions","1 active","#38bdf8"]].map(([label,val,color]) => (
                <div key={label} style={{ background:"#fff", borderRadius:10, padding:"18px", boxShadow:"0 2px 8px #0000000a" }}>
                  <div style={{ fontSize:9, letterSpacing:"0.14em", color:"#999", fontFamily:mono, marginBottom:4 }}>{label.toUpperCase()}</div>
                  <div style={{ fontSize:20, fontWeight:800, color:"#111", fontFamily:sans }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ background:"#fff", borderRadius:10, padding:"20px 24px", boxShadow:"0 2px 8px #0000000a", textAlign:"center", color:"#aaa", fontFamily:sans, fontSize:13 }}>
              Client portal coming soon — share approved scripts, collect feedback, and manage deliverables.
            </div>
          </div>
        )}
        {sub==="scripts" && (
          <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 32px", textAlign:"center", color:"#aaa", fontFamily:sans, fontSize:13 }}>
            Approved scripts will appear here for client review.
          </div>
        )}
        {sub==="brief" && (
          <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 32px", textAlign:"center", color:"#aaa", fontFamily:sans, fontSize:13 }}>
            Client brief and strategy summary coming soon.
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorProfile({ doctor, onBack, isArabic = false, arabicFont = "'DM Sans', sans-serif" }) {
  const mono = "'DM Mono', monospace";
  const sans = "'DM Sans', sans-serif";
  const [sub, setSub] = useState("pillars");
  const [avatars, setAvatars] = useState(doctor.avatars || []);
  const [pillarsRTL, setPillarsRTL] = useState(false);

  const PILLAR_COLORS = { AUTHORITY: { fg: T.auth, bg: T.authBg }, CONVERSION: { fg: T.conv, bg: T.convBg }, REACH: { fg: T.reach, bg: T.reachBg } };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* Doctor header */}
      <div style={{ padding:"14px 24px", borderBottom:`1px solid ${T.line}`, background:T.surface, display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
        <button onClick={onBack}
          style={{ background:"none", border:"none", color:T.dim, cursor:"pointer", fontSize:13, fontFamily:sans, display:"flex", alignItems:"center", gap:4 }}>
          ← Team
        </button>
        <div style={{ width:36, height:36, borderRadius:10, background:doctor.color+"2a", border:`1px solid ${doctor.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
          {doctor.avatar}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:T.ink, fontFamily:sans }}>{doctor.name}</div>
          <div style={{ fontSize:11, color:T.dim, fontFamily:sans }}>{doctor.role}</div>
        </div>
        {/* Sub tabs */}
        <div style={{ display:"flex", gap:0 }}>
          {["pillars","audience","bio"].map(s => (
            <button key={s} onClick={()=>setSub(s)}
              style={{ padding:"6px 14px", fontSize:11, fontWeight:sub===s?700:500, color:sub===s?T.gold:T.dim, background:"transparent", border:"none", borderBottom:`2px solid ${sub===s?T.gold:"transparent"}`, cursor:"pointer", fontFamily:sans, letterSpacing:"0.03em", textTransform:"capitalize" }}>
              {s}
            </button>
          ))}
        </div>
        {/* AR/EN toggle for pillars */}
        {sub==="pillars" && (
          <button onClick={()=>setPillarsRTL(p=>!p)}
            style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:5, border:`1px solid ${pillarsRTL?T.goldLine:T.line}`, background:pillarsRTL?T.goldBg:"transparent", cursor:"pointer" }}>
            <span style={{ fontSize:13 }}>🌐</span>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:pillarsRTL?T.gold:T.dim, fontFamily:mono }}>
              {pillarsRTL ? "AR" : "EN"}
            </span>
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflow:"hidden" }}>
        {sub === "pillars" && (
          <StrategyTab2 onAddToContent={()=>{}} isArabic={pillarsRTL} arabicFont={arabicFont} />
        )}
        {sub === "audience" && (
          <AudienceContent avatars={avatars} setAvatars={setAvatars} isArabic={isArabic} arabicFont={arabicFont} />
        )}
        {sub === "bio" && (
          <BioTab isArabic={isArabic} arabicFont={arabicFont} />
        )}
      </div>
    </div>
  );
}

function TeamTab({ doctors = REVIVE_DOCTORS }) {
  const mono = "'DM Mono', monospace";
  const sans = "'DM Sans', sans-serif";
  const [activeDoctor, setActiveDoctor] = useState(null);

  if (activeDoctor) {
    return <DoctorProfile doctor={activeDoctor} onBack={()=>setActiveDoctor(null)} />;
  }

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"14px 24px", borderBottom:`1px solid ${T.line}`, background:T.surface, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, letterSpacing:"0.14em", color:T.dim, fontFamily:mono, marginBottom:2 }}>TEAM WORKSPACE</div>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink, fontFamily:sans }}>{doctors.length} Doctors</div>
        </div>
        <button style={{ fontSize:11, fontWeight:700, color:T.dim, background:T.lift, border:`1px solid ${T.line}`, borderRadius:5, padding:"6px 14px", cursor:"pointer", fontFamily:mono }}>+ Add Doctor</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:14 }}>
          {doctors.map(doc => (
            <div key={doc.id} onClick={()=>setActiveDoctor(doc)}
              style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:12, padding:"20px", cursor:"pointer", transition:"border-color 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=doc.color+"66"}
              onMouseLeave={e=>e.currentTarget.style.borderColor=T.line}>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:doc.color+"1e", border:`1px solid ${doc.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
                  {doc.avatar}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.ink, fontFamily:sans }}>{doc.name}</div>
                  <div style={{ fontSize:11, color:T.dim, fontFamily:sans }}>{doc.role}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {(doc.pillars||["AUTHORITY","CONVERSION","REACH"]).map(p => {
                  const pc = { AUTHORITY:T.auth, CONVERSION:T.conv, REACH:T.reach };
                  const c = pc[p]||T.gold;
                  return <span key={p} style={{ fontSize:9, fontWeight:700, color:c, background:c+"18", border:`1px solid ${c}33`, borderRadius:2, padding:"2px 7px", fontFamily:mono, letterSpacing:"0.08em" }}>{p}</span>;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Workspace({ client, initialTab, onTabChange, onBack }) {
  const isTeam = client?.type === "team";
  const [tab, setTab] = useState(initialTab || "strategy");
  const handleSetTab = (t) => { setTab(t); onTabChange?.(t); };
  const [scripts, setScripts] = useState(isTeam ? REVIVE_SCRIPTS : INIT_SCRIPTS);

  const handleAddToContent = (items) => {
    const newScripts = items.map(item => ({
      id: Date.now() + Math.random(),
      title: item.title,
      pillar: item.pillar,
      status: "DRAFT",
      session: "Session 1",
      hook: "",
      altHooks: [],
      body: "",
      cta: "",
      duration: "~30s",
      fromStrategy: true,
    }));
    setScripts(p => [...p, ...newScripts]);
    handleSetTab("content");
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <WorkspaceNav client={client} tab={tab} setTab={handleSetTab} onBack={onBack} />
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {tab==="team"       && <TeamTab doctors={REVIVE_DOCTORS} />}
        {tab==="strategy"   && <BriefingTab onAddToContent={handleAddToContent} />}
        {tab==="content"    && <ContentTab scripts={scripts} setScripts={setScripts} doctors={isTeam ? REVIVE_DOCTORS : null} />}
        {tab==="resources"  && <ResourcesTab />}
        {tab==="production" && <ProductionTab scripts={scripts} setScripts={setScripts} />}
        {tab==="clientview" && <ClientViewTab client={client} />}
      </div>
    </div>
  );
}

export default function App() {
  const [client, setClient] = useState(null);
  const [page, setPage] = useState("studio");
  const [hiredIds, setHiredIds] = useState({ editors:[3], videographers:[2], vas:[2] });
  const [lastTab, setLastTab] = useState({});

  const openClient = (c) => { setClient(c); setPage("studio"); };

  return (
    <div style={{ display:"flex", height:"100vh", background:T.base, color:T.ink, fontFamily:"'DM Sans',sans-serif", overflow:"hidden" }}>
      <GlobalStyles />
      <Sidebar page={page} setPage={setPage} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {(() => {
          if (page === "team") return <MyTeamPage hiredIds={hiredIds} setHiredIds={setHiredIds} />;
          if (page === "talent") return <TalentNetwork hiredIds={hiredIds} setHiredIds={setHiredIds} />;
          if (page === "chat") return <ChatPage hiredIds={hiredIds} />;
          if (client) return <Workspace client={client} initialTab={lastTab[client.id]} onTabChange={(t) => setLastTab(p => ({...p, [client.id]: t}))} onBack={() => setClient(null)} />;
          return <ClientsPage onSelect={openClient} />;
        })()}
      </div>
    </div>
  );
}
