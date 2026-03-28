import { useState, useEffect } from "react";

/* ============================================================
   GLOBAL STYLES
============================================================ */
const injectStyles = () => {
  if (document.getElementById("nexcorp-styles")) return;
  const el = document.createElement("style");
  el.id = "nexcorp-styles";
  el.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    :root {
      --navy:   #050d1a;
      --navy2:  #081529;
      --navy3:  #0b1e3d;
      --blue:   #1a56db;
      --blue2:  #2563eb;
      --cyan:   #38bdf8;
      --cyan2:  #7dd3fc;
      --white:  #f0f6ff;
      --muted:  #7a9cc4;
      --border: rgba(56,189,248,0.15);
      --card:   #0c1c35;
    }

    body {
      font-family: 'Outfit', sans-serif;
      background: var(--navy);
      color: var(--white);
      overflow-x: hidden;
      min-height: 100vh;
    }

    @keyframes fadeUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes slideIn  { from{transform:translateX(100%)} to{transform:translateX(0)} }
    @keyframes pulse2   { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(56,189,248,0.2)} 50%{box-shadow:0 0 40px rgba(56,189,248,0.45)} }
    @keyframes rotate   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes scanline { 0%{top:-10%} 100%{top:110%} }

    .au { animation: fadeUp 0.7s ease both; }
    .d1 { animation-delay:.1s } .d2 { animation-delay:.22s }
    .d3 { animation-delay:.34s } .d4 { animation-delay:.46s }

    ::-webkit-scrollbar { width:5px }
    ::-webkit-scrollbar-track { background:var(--navy) }
    ::-webkit-scrollbar-thumb { background:var(--blue);border-radius:99px }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    select:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px var(--navy3) inset !important;
      -webkit-text-fill-color: var(--white) !important;
      caret-color: var(--white);
    }
    select option { background: var(--navy3); color: var(--white); }
  `;
  document.head.appendChild(el);
};

/* ============================================================
   TOKENS
============================================================ */
const C = {
  wrap:  { maxWidth: 1180, margin: "0 auto", padding: "0 1.5rem" },
  sec:   { padding: "6rem 0" },
  tag: {
    display: "inline-block", fontSize: "0.68rem", fontWeight: 600,
    letterSpacing: "0.2em", textTransform: "uppercase",
    color: "var(--cyan)", border: "1px solid rgba(56,189,248,0.35)",
    padding: "0.35rem 1rem", borderRadius: 99, marginBottom: "1.2rem",
    background: "rgba(56,189,248,0.06)",
  },
  h2: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800,
    fontSize: "clamp(1.9rem,4vw,3rem)", lineHeight: 1.12,
    marginBottom: "1rem", color: "var(--white)",
  },
  lead: { color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: "54ch" },
};

/* ============================================================
   REUSABLE UI
============================================================ */
function Tag({ children }) { return <span style={C.tag}>{children}</span>; }

function Btn({ children, variant = "primary", onClick, full }) {
  const [h, sh] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", gap: "0.5rem",
    padding: "0.875rem 2rem", fontSize: "0.85rem", fontWeight: 600,
    letterSpacing: "0.07em", textTransform: "uppercase", borderRadius: 8,
    cursor: "pointer", transition: "all 0.24s", border: "none",
    fontFamily: "'Outfit', sans-serif",
    width: full ? "100%" : "auto", justifyContent: full ? "center" : "flex-start",
  };
  const styles = {
    primary: {
      background: h ? "var(--cyan)" : "var(--blue2)",
      color: h ? "var(--navy)" : "var(--white)",
      boxShadow: h ? "0 8px 28px rgba(37,99,235,0.55)" : "0 4px 16px rgba(37,99,235,0.35)",
      transform: h ? "translateY(-2px)" : "none",
    },
    outline: {
      background: "transparent",
      color: h ? "var(--cyan)" : "var(--white)",
      border: `1px solid ${h ? "var(--cyan)" : "rgba(240,246,255,0.25)"}`,
      transform: h ? "translateY(-2px)" : "none",
    },
    ghost: {
      background: h ? "rgba(56,189,248,0.1)" : "transparent",
      color: h ? "var(--cyan)" : "var(--muted)",
      border: "1px solid transparent",
    },
  };
  return (
    <button style={{ ...base, ...styles[variant] }} onClick={onClick}
      onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}>
      {children}
    </button>
  );
}

function Card({ children, style: extra = {}, glow }) {
  const [h, sh] = useState(false);
  return (
    <div onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
      style={{
        background: "var(--card)", border: `1px solid ${h ? "rgba(56,189,248,0.4)" : "var(--border)"}`,
        borderRadius: 16, padding: "2rem", transition: "all 0.3s",
        boxShadow: h && glow ? "0 0 32px rgba(56,189,248,0.14), 0 4px 24px rgba(0,0,0,0.4)" : "0 2px 16px rgba(0,0,0,0.3)",
        transform: h ? "translateY(-4px)" : "none",
        ...extra,
      }}>
      {children}
    </div>
  );
}

/* ============================================================
   NAVBAR — fixed, opaque, with working close button
============================================================ */
function Navbar({ page, go }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Home", "About", "Contact"];

  const nav = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 2rem", height: 68,
    background: scrolled ? "var(--navy2)" : "var(--navy)",
    borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
    transition: "background 0.35s, border-color 0.35s",
  };

  return (
    <>
      <nav style={nav}>
        {/* Logo */}
        <div onClick={() => { go("home"); setOpen(false); }}
          style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "linear-gradient(135deg, var(--blue2), var(--cyan))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--navy)",
          }}>N</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--white)" }}>
            Nex<span style={{ color: "var(--cyan)" }}>Corp</span>
          </span>
        </div>

        {/* Desktop links */}
        <ul style={{ display: "flex", gap: "0.25rem", listStyle: "none" }} className="desk-nav">
          {links.map(l => (
            <li key={l}>
              <button onClick={() => go(l.toLowerCase())} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "0.5rem 1.1rem", borderRadius: 6,
                fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: "0.9rem",
                color: page === l.toLowerCase() ? "var(--cyan)" : "var(--white)",
                background: page === l.toLowerCase() ? "rgba(56,189,248,0.1)" : "transparent",
                transition: "all 0.2s",
              }}>{l}</button>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="desk-nav">
            <Btn onClick={() => go("contact")}>Get a Quote</Btn>
          </div>
          {/* Hamburger */}
          <button onClick={() => setOpen(o => !o)} className="ham"
            aria-label="Open menu"
            style={{
              display: "none", flexDirection: "column", justifyContent: "center",
              gap: 5, background: "rgba(56,189,248,0.08)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "0.55rem 0.65rem", cursor: "pointer",
            }}>
            <span style={{ display: "block", width: 20, height: 2, background: "var(--cyan)", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "var(--cyan)", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "var(--cyan)", borderRadius: 2 }} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {open && (
        <>
          {/* Backdrop */}
          <div onClick={() => setOpen(false)} style={{
            position: "fixed", inset: 0, zIndex: 1001,
            background: "rgba(5,13,26,0.75)",
            animation: "fadeIn 0.2s ease",
          }} />
          {/* Drawer */}
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0,
            width: "min(300px, 85vw)", zIndex: 1002,
            background: "var(--navy2)",
            borderLeft: "1px solid var(--border)",
            display: "flex", flexDirection: "column",
            animation: "slideIn 0.28s ease",
          }}>
            {/* Drawer header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 1.5rem", height: 68,
              borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "var(--cyan)" }}>
                Menu
              </span>
              {/* ✕ Close button */}
              <button onClick={() => setOpen(false)}
                aria-label="Close menu"
                style={{
                  width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border)",
                  background: "rgba(56,189,248,0.08)", color: "var(--cyan)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: "1.2rem", lineHeight: 1,
                }}>✕</button>
            </div>

            {/* Nav links */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
              {links.map(l => (
                <button key={l} onClick={() => { go(l.toLowerCase()); setOpen(false); }}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "0.95rem 1rem", marginBottom: "0.35rem", borderRadius: 10,
                    background: page === l.toLowerCase() ? "rgba(56,189,248,0.12)" : "transparent",
                    border: `1px solid ${page === l.toLowerCase() ? "rgba(56,189,248,0.35)" : "transparent"}`,
                    color: page === l.toLowerCase() ? "var(--cyan)" : "var(--white)",
                    fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: "1rem",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                  {l === "Home" && "🏠 "}
                  {l === "About" && "💡 "}
                  {l === "Contact" && "📬 "}
                  {l}
                </button>
              ))}
            </div>
            <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border)" }}>
              <Btn full onClick={() => { go("contact"); setOpen(false); }}>Get a Quote →</Btn>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media(max-width:768px){
          .desk-nav{display:none!important}
          .ham{display:flex!important}
        }
      `}</style>
    </>
  );
}

/* ============================================================
   HOME PAGE
============================================================ */
function HomePage({ go }) {
  const services = [
    { icon: "🖥️", title: "Cloud Infrastructure", desc: "Scalable AWS, Azure & GCP solutions engineered for uptime, security, and cost efficiency." },
    { icon: "🔐", title: "Cybersecurity", desc: "End-to-end threat protection, penetration testing, and compliance auditing for modern enterprises." },
    { icon: "⚙️", title: "Software Engineering", desc: "Custom web and mobile applications built with modern stacks and delivered on schedule." },
    { icon: "📊", title: "Data & Analytics", desc: "Business intelligence dashboards, data pipelines, and ML models that surface actionable insights." },
    { icon: "🤖", title: "AI Integration", desc: "LLM-powered workflows, automation bots, and predictive engines embedded into your systems." },
    { icon: "🛡️", title: "IT Managed Services", desc: "24/7 monitoring, helpdesk, patching, and proactive IT management so you can focus on growth." },
  ];
  const stats = [
    { n: "500+", l: "Projects Completed" },
    { n: "120+", l: "Enterprise Clients" },
    { n: "99.9%", l: "Uptime SLA" },
    { n: "12 yrs", l: "Industry Experience" },
  ];
  const partners = ["Google Cloud", "AWS", "Microsoft", "Cisco", "Fortinet", "Oracle"];

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden", padding: "8rem 0 5rem",
      }}>
        {/* BG mesh */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{
            position: "absolute", top: "-20%", right: "-10%",
            width: 700, height: 700, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 65%)",
          }} />
          <div style={{
            position: "absolute", bottom: "-15%", left: "-8%",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 65%)",
          }} />
          {/* Grid */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: "linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }} />
          {/* Scanline effect */}
          <div style={{
            position: "absolute", left: 0, right: 0, height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)",
            animation: "scanline 6s linear infinite",
          }} />
        </div>

        <div style={{ ...C.wrap, position: "relative", zIndex: 2, width: "100%" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "4rem", alignItems: "center",
          }} className="hero-g">
            <div>
              <div className="au" style={{ ...C.tag, display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--cyan)", animation: "pulse2 1.5s infinite" }} />
                Trusted IT Partner Since 2012
              </div>
              <h1 className="au d1" style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 800,
                fontSize: "clamp(2.6rem,5.5vw,4.8rem)", lineHeight: 1.08,
                marginBottom: "1.5rem", letterSpacing: "-0.02em",
              }}>
                Engineering the<br />
                <span style={{
                  background: "linear-gradient(90deg, var(--blue2), var(--cyan))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Digital Future</span>
              </h1>
              <p className="au d2" style={{ ...C.lead, marginBottom: "2.5rem", maxWidth: "46ch" }}>
                NexCorp delivers enterprise-grade cloud, security, and software solutions that power businesses across industries. Reliable. Scalable. Modern.
              </p>
              <div className="au d3" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Btn onClick={() => go("contact")}>Start a Project →</Btn>
                <Btn variant="outline" onClick={() => go("about")}>How We Work</Btn>
              </div>
            </div>

            {/* Tech dashboard visual */}
            <div className="au d2" style={{ position: "relative" }}>
              <div style={{
                background: "var(--navy3)", border: "1px solid var(--border)",
                borderRadius: 20, padding: "1.75rem", position: "relative", overflow: "hidden",
                boxShadow: "0 0 60px rgba(37,99,235,0.18), 0 8px 40px rgba(0,0,0,0.5)",
                animation: "glow 4s ease-in-out infinite",
              }}>
                {/* Window bar */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  {["#ff5f56","#ffbd2e","#27c93f"].map(c => (
                    <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                  ))}
                  <div style={{ flex: 1, height: 12, background: "rgba(255,255,255,0.06)", borderRadius: 6, marginLeft: "0.5rem" }} />
                </div>
                {/* Fake metrics */}
                {[
                  { label: "System Uptime", val: "99.98%", color: "#22d3ee", w: "96%" },
                  { label: "Threat Blocked", val: "14,320", color: "#4ade80", w: "88%" },
                  { label: "CPU Load",       val: "23%",   color: "#f472b6", w: "23%" },
                  { label: "Data Processed", val: "4.7 TB",color: "#a78bfa", w: "72%" },
                ].map((m, i) => (
                  <div key={i} style={{ marginBottom: "1.1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{m.label}</span>
                      <span style={{ fontSize: "0.78rem", color: m.color, fontWeight: 600 }}>{m.val}</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 99 }}>
                      <div style={{
                        height: "100%", width: m.w, borderRadius: 99,
                        background: `linear-gradient(90deg, ${m.color}88, ${m.color})`,
                        transition: "width 1s ease",
                      }} />
                    </div>
                  </div>
                ))}
                <div style={{
                  marginTop: "1.5rem", padding: "0.85rem",
                  background: "rgba(56,189,248,0.06)", borderRadius: 10, border: "1px solid rgba(56,189,248,0.18)",
                  display: "flex", alignItems: "center", gap: "0.75rem",
                }}>
                  <span style={{ fontSize: "1.2rem" }}>🔐</span>
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--cyan)" }}>Security Status: Protected</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Last scan: 2 min ago · 0 threats found</div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div style={{
                position: "absolute", top: "-1rem", right: "-1rem",
                background: "linear-gradient(135deg, var(--blue2), var(--cyan))",
                borderRadius: 12, padding: "0.7rem 1.1rem",
                fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.8rem",
                color: "var(--navy)", boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
              }}>ISO 27001<br /><span style={{ fontWeight: 400, fontSize: "0.7rem" }}>Certified</span></div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:880px){.hero-g{grid-template-columns:1fr!important;gap:3rem!important}}`}</style>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "var(--navy2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "3rem 0" }}>
        <div style={C.wrap}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Syne',sans-serif", fontWeight: 800,
                  fontSize: "2.4rem", color: "var(--cyan)", marginBottom: "0.3rem",
                }}>{s.n}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={C.sec}>
        <div style={C.wrap}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <Tag>What We Do</Tag>
            <h2 style={{ ...C.h2, maxWidth: "none" }}>Full-Spectrum IT Services</h2>
            <p style={{ ...C.lead, margin: "0 auto" }}>
              From cloud migration to AI integration — we cover every layer of your technology stack.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.25rem" }}>
            {services.map((sv, i) => (
              <Card key={i} glow>
                <div style={{
                  width: 50, height: 50, borderRadius: 12,
                  background: "linear-gradient(135deg, rgba(37,99,235,0.25), rgba(56,189,248,0.12))",
                  border: "1px solid rgba(56,189,248,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", marginBottom: "1.25rem",
                }}>{sv.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.6rem" }}>{sv.title}</h3>
                <p style={{ ...C.lead, fontSize: "0.88rem", maxWidth: "none" }}>{sv.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <section style={{ background: "var(--navy2)", padding: "3rem 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={C.wrap}>
          <p style={{ textAlign: "center", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "2rem" }}>
            Trusted Technology Partners
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
            {partners.map(p => (
              <div key={p} style={{
                padding: "0.6rem 1.4rem", borderRadius: 8,
                background: "var(--card)", border: "1px solid var(--border)",
                fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)",
                letterSpacing: "0.05em",
              }}>{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section style={C.sec}>
        <div style={C.wrap}>
          <Card style={{ padding: "3.5rem", maxWidth: 860, margin: "0 auto" }} glow>
            <div style={{ fontSize: "3rem", marginBottom: "1.25rem", color: "var(--blue2)" }}>"</div>
            <blockquote style={{
              fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.2rem,2.5vw,1.65rem)",
              fontWeight: 600, lineHeight: 1.45, marginBottom: "2rem", color: "var(--white)",
            }}>
              NexCorp transformed our legacy infrastructure into a modern cloud-native platform. Our deployment time dropped from 3 days to 4 hours.
            </blockquote>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: 46, height: 46, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--blue2), var(--cyan))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, color: "var(--navy)", fontSize: "0.9rem",
                fontFamily: "'Syne',sans-serif",
              }}>RK</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Rajiv Kapoor</div>
                <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>CTO, FinScale Pvt. Ltd.</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: "0.25rem" }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#fbbf24", fontSize: "1rem" }}>★</span>)}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "5rem 0" }}>
        <div style={C.wrap}>
          <div style={{
            background: "linear-gradient(135deg, var(--navy3) 0%, #0d2352 100%)",
            border: "1px solid var(--border)", borderRadius: 24,
            padding: "4.5rem 3rem", textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-40%", right: "-10%",
              width: 500, height: 500, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />
            <Tag>Ready to Upgrade?</Tag>
            <h2 style={{ ...C.h2, fontSize: "clamp(2rem,4vw,3rem)", position: "relative" }}>
              Let's Build Your Next<br />Technology Milestone
            </h2>
            <p style={{ ...C.lead, margin: "0 auto 2.5rem", textAlign: "center", position: "relative" }}>
              Schedule a free 45-minute strategy session with our engineering team.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", position: "relative" }}>
              <Btn onClick={() => go("contact")}>Get a Free Consultation →</Btn>
              <Btn variant="outline" onClick={() => go("about")}>Learn About Us</Btn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   ABOUT PAGE
============================================================ */
function AboutPage({ go }) {
  const values = [
    { icon: "🎯", title: "Precision", desc: "We engineer solutions that are accurate, reliable, and built to specification — every time." },
    { icon: "🔒", title: "Security First", desc: "Security isn't an add-on. It's baked into every layer of everything we build." },
    { icon: "📈", title: "Scalability", desc: "Systems that grow with you — from startup to enterprise without costly rewrites." },
    { icon: "🤝", title: "Partnership", desc: "We embed with your team and take ownership of outcomes, not just deliverables." },
  ];
  const team = [
    { init: "AK", name: "Arjun Kapoor", role: "CEO & Co-Founder", exp: "18 yrs", g: "135deg,#1a3c8f,#0b1e3d" },
    { init: "PS", name: "Priya Sharma", role: "CTO", exp: "14 yrs", g: "135deg,#0e3460,#0b2d52" },
    { init: "MT", name: "Marcus Tran", role: "Head of Security", exp: "12 yrs", g: "135deg,#0d2a5e,#081529" },
    { init: "SO", name: "Sara Okafor", role: "Lead Architect", exp: "10 yrs", g: "135deg,#143370,#0c1e45" },
  ];
  const timeline = [
    { y: "2012", t: "Founded", d: "Started as a 4-person IT consulting firm in Bangalore." },
    { y: "2015", t: "Cloud Practice", d: "Launched dedicated cloud migration and DevOps practice." },
    { y: "2018", t: "ISO Certified", d: "Achieved ISO 27001 certification and expanded to 5 cities." },
    { y: "2021", t: "AI Division", d: "Opened AI/ML division serving Fortune 500 clients." },
    { y: "2024", t: "Global Reach", d: "Crossed 120 enterprise clients across 18 countries." },
  ];

  return (
    <div style={{ paddingTop: 68 }}>
      {/* HERO */}
      <section style={{ padding: "5rem 0 4rem", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 70% at 80% 40%, rgba(37,99,235,0.15) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={C.wrap}>
          <Tag>About NexCorp</Tag>
          <h1 className="au" style={{
            fontFamily: "'Syne',sans-serif", fontWeight: 800,
            fontSize: "clamp(2.4rem,5vw,4rem)", lineHeight: 1.1,
            marginBottom: "1.25rem", maxWidth: "14ch",
          }}>
            We're an IT Company That <span style={{ color: "var(--cyan)" }}>Gets It Done</span>
          </h1>
          <p className="au d1" style={{ ...C.lead, marginBottom: "2.5rem" }}>
            Founded in 2012, NexCorp has grown from a lean consulting outfit to a 200+ engineer IT powerhouse. We build, secure, and scale technology for enterprises that can't afford to fail.
          </p>
          <div className="au d2" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Btn onClick={() => go("contact")}>Talk to Our Team →</Btn>
            <Btn variant="outline" onClick={() => go("home")}>Our Services</Btn>
          </div>
        </div>
      </section>

      {/* SPLIT — story */}
      <section style={C.sec}>
        <div style={C.wrap}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="story-split">
            <div>
              <Tag>Our Story</Tag>
              <h2 style={C.h2}>Built by engineers, for engineers</h2>
              <p style={{ ...C.lead, marginBottom: "1rem", maxWidth: "none" }}>
                NexCorp was born from frustration with IT vendors who over-promised and under-delivered. Our founders — engineers themselves — set out to build a company with a different DNA: technical excellence above all.
              </p>
              <p style={{ ...C.lead, marginBottom: "2rem", maxWidth: "none" }}>
                Today, our 200-strong team operates from 6 offices and serves 120+ enterprise clients. We've maintained a 97% client retention rate because we treat every engagement like a long-term partnership.
              </p>
              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                {[{ n: "200+", l: "Engineers" }, { n: "6", l: "Offices" }, { n: "97%", l: "Retention" }].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--cyan)" }}>{s.n}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted)", letterSpacing: "0.08em" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Timeline */}
            <div>
              {timeline.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: "1.25rem", marginBottom: "1.5rem", position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, var(--blue2), var(--cyan))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.7rem",
                      color: "var(--navy)",
                    }}>{t.y}</div>
                    {i < timeline.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: "var(--border)", marginTop: "0.5rem" }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: "0.5rem" }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: "0.25rem" }}>{t.t}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{t.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style>{`@media(max-width:880px){.story-split{grid-template-columns:1fr!important;gap:3rem!important}}`}</style>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ ...C.sec, background: "var(--navy2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={C.wrap}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <Tag>Our Principles</Tag>
            <h2 style={{ ...C.h2, maxWidth: "none" }}>Values We Engineer By</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
            {values.map((v, i) => (
              <Card key={i} glow>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{v.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>{v.title}</h3>
                <p style={{ ...C.lead, fontSize: "0.88rem", maxWidth: "none" }}>{v.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={C.sec}>
        <div style={C.wrap}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <Tag>The Leadership</Tag>
            <h2 style={{ ...C.h2, maxWidth: "none" }}>Meet the Minds Behind NexCorp</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
            {team.map((m, i) => <TeamCard key={i} m={m} />)}
          </div>
        </div>
      </section>
    </div>
  );
}

function TeamCard({ m }) {
  const [h, sh] = useState(false);
  return (
    <div onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
      style={{
        background: "var(--card)", border: `1px solid ${h ? "rgba(56,189,248,0.4)" : "var(--border)"}`,
        borderRadius: 16, overflow: "hidden", transition: "all 0.3s",
        transform: h ? "translateY(-5px)" : "none",
        boxShadow: h ? "0 16px 40px rgba(0,0,0,0.4)" : "none",
      }}>
      <div style={{
        height: 160,
        background: `linear-gradient(${m.g})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--blue2), var(--cyan))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.4rem",
          color: "var(--navy)",
        }}>{m.init}</div>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 50%, rgba(11,21,41,0.9))",
        }} />
      </div>
      <div style={{ padding: "1.25rem" }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "0.2rem" }}>{m.name}</h3>
        <p style={{ color: "var(--cyan)", fontSize: "0.78rem", fontWeight: 500, marginBottom: "0.5rem" }}>{m.role}</p>
        <p style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
          <span style={{ color: "var(--white)", fontWeight: 600 }}>{m.exp}</span> experience
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   CONTACT PAGE — no overlapping, stack on mobile
============================================================ */
function ContactPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    company: "", service: "", budget: "", message: "",
  });
  const [errors, setErrors]   = useState({});
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const services = ["Cloud Services", "Cybersecurity", "Software Dev", "Data & Analytics", "AI Integration", "Managed IT"];

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())  e.firstName = "First name is required";
    if (!form.lastName.trim())   e.lastName  = "Last name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim() || form.message.length < 20) e.message = "Write at least 20 characters";
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  const field = (err) => ({
    width: "100%", padding: "0.85rem 1rem",
    background: "var(--navy3)", color: "var(--white)",
    border: `1px solid ${err ? "#f87171" : "rgba(56,189,248,0.2)"}`,
    borderRadius: 9, fontFamily: "'Outfit',sans-serif", fontSize: "0.95rem",
    outline: "none", transition: "border-color 0.2s",
    resize: "none", appearance: "none",
  });

  const label = {
    display: "block", fontSize: "0.75rem", fontWeight: 600,
    letterSpacing: "0.12em", textTransform: "uppercase",
    color: "var(--muted)", marginBottom: "0.5rem",
  };

  const errMsg = { color: "#f87171", fontSize: "0.77rem", marginTop: "0.3rem" };

  const info = [
    { icon: "✉️", t: "Email",   v: "hello@nexcorp.io" },
    { icon: "📞", t: "Phone",   v: "+91 98765 43210" },
    { icon: "📍", t: "Office",  v: "Cyber Hub, Gurugram, Haryana" },
    { icon: "🕐", t: "Hours",   v: "Mon–Fri, 9:00 AM – 7:00 PM IST" },
  ];

  return (
    <div style={{ paddingTop: 68 }}>
      {/* HERO */}
      <section style={{ padding: "5rem 0 3rem" }}>
        <div style={C.wrap}>
          <Tag>Get in Touch</Tag>
          <h1 className="au" style={{
            fontFamily: "'Syne',sans-serif", fontWeight: 800,
            fontSize: "clamp(2.2rem,5vw,3.8rem)", lineHeight: 1.1, marginBottom: "1rem",
          }}>
            Let's Build Something <span style={{ color: "var(--cyan)" }}>Great Together</span>
          </h1>
          <p className="au d1" style={C.lead}>
            Tell us about your project. We'll respond within 1 business day with a tailored plan.
          </p>
        </div>
      </section>

      {/* BODY — stacks on mobile */}
      <section style={{ padding: "0 0 6rem" }}>
        <div style={C.wrap}>
          {/* Outer container: column on mobile, row on desktop */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }} className="contact-outer">

            {/* INFO ROW — horizontal cards on desktop, vertical list on mobile */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: "1rem",
            }}>
              {info.map((item, i) => (
                <div key={i} style={{
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "1.25rem",
                  display: "flex", gap: "0.9rem", alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                    background: "rgba(37,99,235,0.18)", border: "1px solid rgba(56,189,248,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{item.t}</div>
                    <div style={{ fontSize: "0.88rem", color: "var(--white)", fontWeight: 500 }}>{item.v}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* FORM CARD */}
            <div style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 20, padding: "2.5rem",
            }} className="form-pad">
              {sent ? (
                <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
                  <div style={{
                    width: 70, height: 70, borderRadius: "50%", margin: "0 auto 1.5rem",
                    background: "rgba(34,211,238,0.12)", border: "2px solid var(--cyan)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "2rem",
                  }}>✓</div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.6rem", marginBottom: "0.75rem" }}>Message Sent!</h3>
                  <p style={{ color: "var(--muted)" }}>Our team will get back to you within one business day.</p>
                </div>
              ) : (
                <>
                  <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.4rem", marginBottom: "0.4rem" }}>Send Us a Message</h2>
                  <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "2rem" }}>All fields marked are required.</p>

                  {/* Name row — stacks on small screens */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="name-row">
                    <div>
                      <label style={label}>First Name *</label>
                      <input style={field(errors.firstName)} placeholder="Arjun"
                        value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                      {errors.firstName && <p style={errMsg}>{errors.firstName}</p>}
                    </div>
                    <div>
                      <label style={label}>Last Name *</label>
                      <input style={field(errors.lastName)} placeholder="Kapoor"
                        value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                      {errors.lastName && <p style={errMsg}>{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="name-row">
                    <div>
                      <label style={label}>Email Address *</label>
                      <input style={field(errors.email)} placeholder="you@company.com" type="email"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                      {errors.email && <p style={errMsg}>{errors.email}</p>}
                    </div>
                    <div>
                      <label style={label}>Phone Number</label>
                      <input style={field(false)} placeholder="+91 98765 43210" type="tel"
                        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>

                  {/* Company */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={label}>Company Name</label>
                    <input style={field(false)} placeholder="Your company"
                      value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                  </div>

                  {/* Service pills */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={label}>Service Required</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "0.25rem" }}>
                      {services.map(s => <SvcPill key={s} label={s} sel={form.service === s} onClick={() => setForm({ ...form, service: s })} />)}
                    </div>
                  </div>

                  {/* Budget */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={label}>Project Budget</label>
                    <select style={{ ...field(false), cursor: "pointer" }}
                      value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
                      <option value="">Select a range</option>
                      <option value="<50k">Under ₹50,000</option>
                      <option value="50-2l">₹50,000 – ₹2 Lakhs</option>
                      <option value="2-10l">₹2 Lakhs – ₹10 Lakhs</option>
                      <option value="10l+">₹10 Lakhs+</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: "2rem" }}>
                    <label style={label}>Project Details *</label>
                    <textarea rows={5} style={field(errors.message)}
                      placeholder="Describe your project goals, timeline, existing infrastructure, and any specific requirements..."
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                    {errors.message && <p style={errMsg}>{errors.message}</p>}
                  </div>

                  {/* Availability badge */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.25)",
                    borderRadius: 99, padding: "0.4rem 1rem",
                    fontSize: "0.78rem", color: "var(--cyan)", marginBottom: "1.25rem",
                  }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: "var(--cyan)", animation: "pulse2 1.5s infinite",
                      display: "inline-block",
                    }} />
                    Currently accepting new projects
                  </div>

                  <br />
                  <SubmitBtn onClick={submit} loading={loading} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:580px){
          .name-row  { grid-template-columns:1fr !important; }
          .form-pad  { padding:1.5rem !important; }
        }
      `}</style>
    </div>
  );
}

function SvcPill({ label, sel, onClick }) {
  const [h, sh] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
      style={{
        padding: "0.45rem 1rem", borderRadius: 99, fontSize: "0.8rem", fontWeight: 500,
        cursor: "pointer", transition: "all 0.2s", fontFamily: "'Outfit',sans-serif",
        background: sel ? "rgba(37,99,235,0.25)" : h ? "rgba(56,189,248,0.08)" : "transparent",
        border: `1px solid ${sel ? "var(--blue2)" : h ? "rgba(56,189,248,0.4)" : "rgba(56,189,248,0.2)"}`,
        color: sel ? "var(--cyan)" : h ? "var(--cyan)" : "var(--muted)",
      }}>
      {label}
    </button>
  );
}

function SubmitBtn({ onClick, loading }) {
  const [h, sh] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => sh(true)} onMouseLeave={() => sh(false)}
      disabled={loading}
      style={{
        width: "100%", padding: "1rem", fontSize: "0.9rem", fontWeight: 600,
        letterSpacing: "0.1em", textTransform: "uppercase",
        background: loading ? "var(--navy3)" : h ? "var(--cyan)" : "var(--blue2)",
        color: loading ? "var(--muted)" : h ? "var(--navy)" : "var(--white)",
        border: "none", borderRadius: 9, cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.25s", fontFamily: "'Outfit',sans-serif",
        transform: !loading && h ? "translateY(-2px)" : "none",
        boxShadow: !loading && h ? "0 8px 28px rgba(37,99,235,0.5)" : "none",
      }}>
      {loading ? "Sending…" : "Submit Request →"}
    </button>
  );
}

/* ============================================================
   FOOTER
============================================================ */
function Footer({ go }) {
  const cols = [
    { h: "Services", l: ["Cloud Infrastructure", "Cybersecurity", "Software Dev", "Data & Analytics", "AI Integration"] },
    { h: "Company",  l: ["About Us", "Careers", "Blog", "Case Studies", "Partners"] },
    { h: "Support",  l: ["Documentation", "Status Page", "Contact Us", "Privacy Policy", "Terms of Service"] },
  ];
  return (
    <footer style={{ background: "var(--navy2)", borderTop: "1px solid var(--border)", padding: "4rem 0 2rem" }}>
      <div style={C.wrap}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "2.5rem", marginBottom: "3rem" }} className="footer-g">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 7,
                background: "linear-gradient(135deg, var(--blue2), var(--cyan))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "var(--navy)",
              }}>N</div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.15rem" }}>
                Nex<span style={{ color: "var(--cyan)" }}>Corp</span>
              </span>
            </div>
            <p style={{ ...C.lead, fontSize: "0.88rem", maxWidth: "32ch" }}>
              Engineering the digital future — one enterprise at a time.
            </p>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem",
                letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--white)", marginBottom: "1rem" }}>
                {col.h}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {col.l.map(link => (
                  <li key={link}>
                    <button onClick={() => {}} style={{
                      background: "none", border: "none", cursor: "pointer", padding: 0,
                      color: "var(--muted)", fontSize: "0.85rem", fontFamily: "'Outfit',sans-serif",
                      textAlign: "left", transition: "color 0.2s",
                    }}
                    onMouseEnter={e => e.target.style.color = "var(--cyan)"}
                    onMouseLeave={e => e.target.style.color = "var(--muted)"}>
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
            © {new Date().getFullYear()} NexCorp Technologies Pvt. Ltd. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Home","About","Contact"].map(l => (
              <button key={l} onClick={() => go(l.toLowerCase())} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--muted)", fontSize: "0.8rem",
                fontFamily: "'Outfit',sans-serif", transition: "color 0.2s",
              }}
              onMouseEnter={e => e.target.style.color = "var(--cyan)"}
              onMouseLeave={e => e.target.style.color = "var(--muted)"}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:760px){.footer-g{grid-template-columns:1fr 1fr!important}}`}</style>
    </footer>
  );
}

/* ============================================================
   APP ROOT
============================================================ */
export default function App() {
  const [page, setPage] = useState("home");
  useEffect(() => { injectStyles(); }, []);

  const go = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <Navbar page={page} go={go} />
      <main style={{ minHeight: "calc(100vh - 68px)" }}>
        {page === "home"    && <HomePage go={go} />}
        {page === "about"   && <AboutPage go={go} />}
        {page === "contact" && <ContactPage />}
      </main>
      <Footer go={go} />
    </>
  );
}
