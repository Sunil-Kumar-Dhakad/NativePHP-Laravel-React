import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   GLOBAL STYLES injected once
───────────────────────────────────────── */
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }

      :root {
        --ink: #0d0d0d;
        --cream: #f5f0e8;
        --gold: #c8a96e;
        --gold-light: #e8d5aa;
        --muted: #7a7570;
        --border: rgba(200,169,110,0.22);
        --glass: rgba(245,240,232,0.04);
        --card-bg: #111109;
      }

      body {
        font-family: 'DM Sans', sans-serif;
        background: var(--ink);
        color: var(--cream);
        overflow-x: hidden;
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes floatIn {
        from { opacity: 0; transform: translateY(20px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes pulse {
        0%,100% { box-shadow: 0 0 0 3px rgba(72,187,120,0.25); }
        50%      { box-shadow: 0 0 0 7px rgba(72,187,120,0.08); }
      }
      @keyframes shimmer {
        from { background-position: -200% center; }
        to   { background-position: 200% center; }
      }

      .anim-fadeup { animation: fadeUp 0.75s ease both; }
      .anim-d1 { animation-delay: 0.1s; }
      .anim-d2 { animation-delay: 0.22s; }
      .anim-d3 { animation-delay: 0.34s; }
      .anim-d4 { animation-delay: 0.46s; }

      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: var(--ink); }
      ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

/* ─────────────────────────────────────────
   DESIGN TOKENS (inline style objects)
───────────────────────────────────────── */
const s = {
  container: { maxWidth: 1160, margin: "0 auto", padding: "0 1.75rem" },
  section:   { padding: "5.5rem 0" },
  tag: {
    display: "inline-block", fontSize: "0.68rem", letterSpacing: "0.22em",
    textTransform: "uppercase", color: "var(--gold)",
    border: "1px solid var(--border)", padding: "0.35rem 1rem",
    borderRadius: 999, marginBottom: "1.4rem",
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(1.9rem, 4vw, 3rem)",
    lineHeight: 1.15, marginBottom: "1rem",
  },
  lead: {
    color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.78,
    maxWidth: "52ch", marginBottom: "0",
  },
};

/* ─────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────── */
function Tag({ children }) {
  return <span style={s.tag}>{children}</span>;
}

function Btn({ children, variant = "primary", onClick, style: extra = {}, href }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: "0.45rem",
    padding: "0.85rem 2rem", fontSize: "0.82rem", fontWeight: 500,
    letterSpacing: "0.09em", textTransform: "uppercase",
    borderRadius: 6, cursor: "pointer", transition: "all 0.25s",
    textDecoration: "none", border: "none", fontFamily: "'DM Sans', sans-serif",
  };
  const primary = { background: "var(--gold)", color: "var(--ink)" };
  const outline = {
    background: "transparent", color: "var(--cream)",
    border: "1px solid rgba(245,240,232,0.28)",
  };
  const [hov, setHov] = useState(false);
  const hovStyle = hov
    ? variant === "primary"
      ? { background: "var(--gold-light)", transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(200,169,110,0.32)" }
      : { borderColor: "var(--gold)", color: "var(--gold)", transform: "translateY(-2px)" }
    : {};
  const merged = { ...base, ...(variant === "primary" ? primary : outline), ...hovStyle, ...extra };
  return (
    <button style={merged} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
function Navbar({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
    padding: "1.15rem 2rem",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: scrolled ? "rgba(13,13,13,0.92)" : "rgba(13,13,13,0.7)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid var(--border)",
    transition: "background 0.3s",
  };

  const links = ["Home", "About", "Contact"];

  return (
    <nav style={nav}>
      {/* Logo */}
      <span onClick={() => { setPage("home"); setOpen(false); }}
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem",
          color: "var(--gold)", cursor: "pointer", letterSpacing: "0.03em" }}>
        Luminary
      </span>

      {/* Desktop links */}
      <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", margin: 0,
        "@media(max-width:768px)": { display: "none" } }} className="desktop-nav">
        {links.map(l => (
          <li key={l}>
            <NavLink active={page === l.toLowerCase()} onClick={() => setPage(l.toLowerCase())}>
              {l}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Hamburger */}
      <button onClick={() => setOpen(o => !o)} style={{
        display: "none", flexDirection: "column", gap: 5, background: "none",
        border: "none", cursor: "pointer", padding: 4,
      }} className="ham-btn" aria-label="menu">
        {[0,1,2].map(i => (
          <span key={i} style={{ display: "block", width: 24, height: 2,
            background: "var(--cream)", transition: "all 0.3s",
            transform: open && i === 0 ? "rotate(45deg) translate(5px,5px)"
              : open && i === 2 ? "rotate(-45deg) translate(5px,-5px)"
              : open && i === 1 ? "opacity:0;scaleX(0)" : "none",
            opacity: open && i === 1 ? 0 : 1,
          }} />
        ))}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: "72vw", maxWidth: 300,
          background: "#130f0c", borderLeft: "1px solid var(--border)",
          display: "flex", flexDirection: "column", padding: "5rem 2rem 2rem",
          zIndex: 300, animation: "floatIn 0.25s ease",
        }}>
          {links.map(l => (
            <button key={l} onClick={() => { setPage(l.toLowerCase()); setOpen(false); }}
              style={{
                background: "none", border: "none", borderBottom: "1px solid var(--border)",
                color: page === l.toLowerCase() ? "var(--gold)" : "var(--cream)",
                fontFamily: "'DM Sans', sans-serif", fontSize: "1.1rem",
                fontWeight: 500, letterSpacing: "0.08em", padding: "1rem 0",
                cursor: "pointer", textAlign: "left", textTransform: "uppercase",
              }}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .ham-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

function NavLink({ children, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: "none", border: "none", cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
        fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
        color: active || hov ? "var(--gold)" : "var(--cream)",
        opacity: active || hov ? 1 : 0.7, transition: "all 0.2s",
      }}>
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
function Footer({ setPage }) {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)", padding: "2.5rem 2rem",
      display: "flex", flexWrap: "wrap", gap: "1rem",
      justifyContent: "space-between", alignItems: "center",
    }}>
      <span style={{ fontFamily: "'Playfair Display', serif", color: "var(--gold)", fontSize: "1.1rem" }}>
        Luminary
      </span>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        {["Home","About","Contact"].map(l => (
          <button key={l} onClick={() => setPage(l.toLowerCase())}
            style={{ background: "none", border: "none", cursor: "pointer",
              color: "var(--muted)", fontSize: "0.8rem", letterSpacing: "0.08em",
              textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.2s" }}>
            {l}
          </button>
        ))}
      </div>
      <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
        © {new Date().getFullYear()} Luminary Studio. All rights reserved.
      </span>
    </footer>
  );
}

/* ─────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────── */
function HomePage({ setPage }) {
  const services = [
    { icon: "🎨", title: "UI/UX Design", desc: "User-centered interfaces grounded in research, refined through iteration, and built to convert." },
    { icon: "⚙️", title: "Web Development", desc: "Laravel-powered backends, fast frontends, and integrations that scale with your ambitions." },
    { icon: "📱", title: "Mobile Apps", desc: "Cross-platform applications that deliver native performance with a fraction of the cost." },
    { icon: "📈", title: "Growth Strategy", desc: "Data-informed roadmaps that align your digital product with real business outcomes." },
  ];

  const stats = [
    { num: "150+", label: "Projects Delivered" },
    { num: "98%",  label: "Client Satisfaction" },
    { num: "8 yrs", label: "Industry Experience" },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden", padding: "7rem 0 4rem",
      }}>
        {/* Background glows */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 55% 60% at 75% 45%, rgba(200,169,110,0.13) 0%, transparent 65%), radial-gradient(ellipse 40% 70% at 15% 80%, rgba(200,169,110,0.07) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(var(--cream) 1px, transparent 1px), linear-gradient(90deg, var(--cream) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />

        <div style={{ ...s.container, position: "relative", zIndex: 2, width: "100%" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center",
          }} className="hero-grid">
            {/* Text */}
            <div>
              <p className="anim-fadeup" style={{ ...s.tag, display: "inline-block" }}>Digital Studio</p>
              <h1 className="anim-fadeup anim-d1" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.8rem, 5.5vw, 4.8rem)",
                lineHeight: 1.1, marginBottom: "1.4rem", letterSpacing: "-0.02em",
              }}>
                We craft{" "}
                <em style={{ fontStyle: "italic", color: "var(--gold)" }}>digital</em>
                {" "}experiences that matter
              </h1>
              <p className="anim-fadeup anim-d2" style={{ ...s.lead, marginBottom: "2.5rem", maxWidth: "44ch" }}>
                From strategy to launch, we partner with ambitious brands to build beautiful, high-performing web products.
              </p>
              <div className="anim-fadeup anim-d3" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Btn onClick={() => setPage("contact")}>Start a Project ↗</Btn>
                <Btn variant="outline" onClick={() => setPage("about")}>Our Story</Btn>
              </div>
            </div>

            {/* Stats cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {stats.map((stat, i) => (
                <StatCard key={i} stat={stat} delay={i * 140} offset={i === 1 ? 40 : 0} />
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          }
        `}</style>
      </section>

      {/* ── SERVICES ── */}
      <section style={s.section}>
        <div style={s.container}>
          <Tag>What We Do</Tag>
          <h2 style={s.sectionTitle}>Services built for<br />modern businesses</h2>
          <p style={{ ...s.lead, marginBottom: "3.5rem" }}>
            We combine thoughtful design with robust engineering to deliver products your users love.
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1px", background: "var(--border)",
            border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden",
          }}>
            {services.map((svc, i) => <ServiceCard key={i} svc={svc} />)}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={{
            background: "rgba(200,169,110,0.05)", borderRadius: 20, padding: "4.5rem",
            border: "1px solid var(--border)",
          }} className="testimonial-wrap">
            <Tag>Client Voice</Tag>
            <blockquote style={{
              fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 2.8vw, 1.9rem)",
              lineHeight: 1.45, fontStyle: "italic", marginBottom: "2rem", maxWidth: "68ch",
            }}>
              "Luminary didn't just build our platform — they shaped our vision and turned it into something far beyond what we imagined."
            </blockquote>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--gold), #8a6a3e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, color: "var(--ink)", fontSize: "0.85rem",
              }}>SN</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>Sofia Navarro</div>
                <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>CEO, Atelier Group</div>
              </div>
            </div>
          </div>
          <style>{`@media(max-width:640px){.testimonial-wrap{padding:2.5rem 1.5rem!important}}`}</style>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={{
            textAlign: "center", padding: "5rem 2rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(5rem, 15vw, 11rem)",
              color: "rgba(200,169,110,0.05)", whiteSpace: "nowrap",
              pointerEvents: "none", letterSpacing: "0.1em", userSelect: "none",
            }}>LUMINARY</div>
            <Tag>Ready to Begin?</Tag>
            <h2 style={{ ...s.sectionTitle, position: "relative" }}>
              Let's build something{" "}
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>remarkable</em>
            </h2>
            <p style={{ ...s.lead, margin: "0 auto 2.5rem", textAlign: "center" }}>
              Tell us about your project and we'll get back to you within 24 hours.
            </p>
            <Btn onClick={() => setPage("contact")} style={{ position: "relative" }}>
              Get in Touch ↗
            </Btn>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ stat, delay, offset }) {
  return (
    <div style={{
      background: "var(--glass)", border: "1px solid var(--border)",
      borderRadius: 14, padding: "1.75rem 2rem",
      backdropFilter: "blur(8px)",
      marginLeft: offset ? offset : 0,
      animation: `floatIn 0.75s ease both`,
      animationDelay: `${delay}ms`,
    }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", color: "var(--gold)" }}>
        {stat.num}
      </div>
      <div style={{ fontSize: "0.78rem", color: "var(--muted)", letterSpacing: "0.1em", marginTop: "0.25rem", textTransform: "uppercase" }}>
        {stat.label}
      </div>
    </div>
  );
}

function ServiceCard({ svc }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#161612" : "var(--ink)", padding: "2.5rem",
        transition: "background 0.3s",
      }}>
      <div style={{
        width: 48, height: 48, borderRadius: 10,
        background: "rgba(200,169,110,0.1)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.4rem", marginBottom: "1.25rem",
      }}>{svc.icon}</div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", marginBottom: "0.6rem" }}>
        {svc.title}
      </h3>
      <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.65 }}>{svc.desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   ABOUT PAGE
───────────────────────────────────────── */
function AboutPage({ setPage }) {
  const values = [
    { n: "01", title: "Craftsmanship", desc: "We sweat the details most skip. Every pixel, every query, every interaction — handled with intention." },
    { n: "02", title: "Transparency",  desc: "No surprises, no smoke. Clear timelines, honest communication, and shared visibility throughout." },
    { n: "03", title: "Curiosity",     desc: "We ask the uncomfortable questions early so the answers don't derail projects late." },
    { n: "04", title: "Impact",        desc: "We measure success by your success — not by deliverables checked off a list." },
  ];
  const team = [
    { initials: "MC", name: "Marcus Chen",    role: "Co-Founder & Creative Director", color: "#1c1a14,#2a2310" },
    { initials: "AO", name: "Amara Osei",     role: "Co-Founder & Head of Engineering", color: "#141c1a,#102320" },
    { initials: "LR", name: "Leila Rossetti", role: "Lead Product Designer", color: "#1a1419,#231021" },
  ];

  return (
    <div style={{ paddingTop: "72px" }}>
      {/* ABOUT HERO */}
      <section style={{ padding: "5.5rem 0 3rem", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", right: "-8%", top: "10%", bottom: "10%", width: "40%",
          background: "radial-gradient(ellipse, rgba(200,169,110,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={s.container}>
          <div style={{ maxWidth: 680 }}>
            <Tag>Our Story</Tag>
            <h1 className="anim-fadeup" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.15, marginBottom: "1.25rem",
            }}>
              We're a studio obsessed with{" "}
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>craft</em>
            </h1>
            <p className="anim-fadeup anim-d1" style={s.lead}>
              Founded in 2016, Luminary was built on a simple belief: that beautiful technology and serious business outcomes aren't in conflict — they reinforce each other.
            </p>
          </div>
        </div>
      </section>

      {/* STORY SPLIT */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="story-grid">
            {/* Visual block */}
            <div style={{ position: "relative" }}>
              <div style={{
                aspectRatio: "4/5", background: "linear-gradient(135deg, #1a1a14 0%, #1f1e18 100%)",
                border: "1px solid var(--border)", borderRadius: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", position: "relative",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "radial-gradient(ellipse at 30% 40%, rgba(200,169,110,0.15), transparent 60%)",
                }} />
                <span style={{ fontSize: "5rem", opacity: 0.22 }}>🏛</span>
              </div>
              <div style={{
                position: "absolute", bottom: "-1rem", right: "-1rem",
                background: "var(--gold)", color: "var(--ink)",
                borderRadius: 14, padding: "1.2rem 1.5rem",
                fontFamily: "'Playfair Display', serif",
                textAlign: "center", boxShadow: "0 12px 32px rgba(200,169,110,0.32)",
              }}>
                <strong style={{ display: "block", fontSize: "2rem" }}>8+</strong>
                <span style={{ fontSize: "0.72rem", letterSpacing: "0.1em" }}>Years of craft</span>
              </div>
            </div>
            {/* Text */}
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.7rem, 3vw, 2.4rem)", marginBottom: "1.2rem" }}>
                Where passion meets precision
              </h2>
              <p style={{ ...s.lead, marginBottom: "1rem", maxWidth: "none" }}>
                What started as a two-person consultancy has grown into a full-service digital studio of 24 specialists. We've worked with startups and Fortune 500s alike — bringing the same obsessive attention to every engagement.
              </p>
              <p style={{ ...s.lead, marginBottom: "1.75rem", maxWidth: "none" }}>
                We believe in long-term partnerships, not one-time transactions. Over 70% of our revenue comes from returning clients — a number we're proud of.
              </p>
              <Btn variant="outline" onClick={() => setPage("contact")}>Work with us ↗</Btn>
            </div>
          </div>
          <style>{`@media(max-width:900px){.story-grid{grid-template-columns:1fr!important;gap:3rem!important}}`}</style>
        </div>
      </section>

      {/* VALUES */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={{
            background: "rgba(255,255,255,0.02)", borderRadius: 22,
            padding: "4rem", border: "1px solid var(--border)",
          }} className="values-pad">
            <div style={{ marginBottom: "3rem" }}>
              <Tag>What drives us</Tag>
              <h2 style={{ ...s.sectionTitle, marginBottom: 0 }}>Our values</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "2rem" }}>
              {values.map((v, i) => (
                <div key={i} style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: "var(--gold)", marginBottom: "0.65rem" }}>{v.n}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", marginBottom: "0.5rem" }}>{v.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.65 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <style>{`@media(max-width:640px){.values-pad{padding:2.5rem 1.5rem!important}}`}</style>
        </div>
      </section>

      {/* TEAM */}
      <section style={s.section}>
        <div style={s.container}>
          <Tag>The People</Tag>
          <h2 style={s.sectionTitle}>Meet the team</h2>
          <p style={{ ...s.lead, marginBottom: "3rem" }}>
            A diverse group of designers, engineers, and strategists united by a love of making things work beautifully.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {team.map((member, i) => <TeamCard key={i} member={member} />)}
          </div>
        </div>
      </section>
    </div>
  );
}

function TeamCard({ member }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden",
        transition: "transform 0.3s, box-shadow 0.3s",
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov ? "0 20px 40px rgba(0,0,0,0.35)" : "none",
      }}>
      <div style={{
        height: 200,
        background: `linear-gradient(135deg, #${member.color.split(",")[0].replace("#","")}, #${member.color.split(",")[1].replace("#","")})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <div style={{ fontSize: "2.8rem", position: "relative", zIndex: 2 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "rgba(200,169,110,0.18)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Playfair Display', serif", color: "var(--gold)", fontSize: "1.4rem", fontWeight: 700,
          }}>{member.initials}</div>
        </div>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 40%, rgba(13,13,13,0.85))",
        }} />
      </div>
      <div style={{ padding: "1.25rem", borderTop: "1px solid var(--border)" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", marginBottom: "0.25rem" }}>{member.name}</h3>
        <p style={{ color: "var(--gold)", fontSize: "0.78rem", letterSpacing: "0.07em" }}>{member.role}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CONTACT PAGE
───────────────────────────────────────── */
function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", company: "", service: "", budget: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const services = ["UI/UX Design", "Web Development", "Mobile App", "Growth Strategy", "Other"];

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.message.trim() || form.message.trim().length < 20) e.message = "Please write at least 20 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSubmitted(true); }, 1400);
  };

  const inputStyle = (err) => ({
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: `1px solid ${err ? "rgba(252,129,74,0.6)" : "rgba(200,169,110,0.2)"}`,
    borderRadius: 8, padding: "0.875rem 1rem", color: "var(--cream)",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem",
    outline: "none", resize: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

  const labelStyle = {
    display: "block", fontSize: "0.75rem", letterSpacing: "0.12em",
    textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.55rem",
  };

  const errStyle = { color: "#fc814a", fontSize: "0.78rem", marginTop: "0.3rem" };

  const infoItems = [
    { icon: "✉️", label: "Email", value: "hello@luminary.studio" },
    { icon: "📞", label: "Phone", value: "+1 (555) 240-8800" },
    { icon: "📍", label: "Studio", value: "350 Fifth Ave, New York, NY" },
    { icon: "🕐", label: "Hours", value: "Mon–Fri, 9am – 6pm EST" },
  ];

  return (
    <div style={{ paddingTop: "72px" }}>
      {/* HERO */}
      <section style={{ padding: "5.5rem 0 2.5rem" }}>
        <div style={s.container}>
          <Tag>Let's Talk</Tag>
          <h1 className="anim-fadeup" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.15, marginBottom: "1rem",
          }}>
            Start a <em style={{ fontStyle: "italic", color: "var(--gold)" }}>conversation</em>
          </h1>
          <p className="anim-fadeup anim-d1" style={s.lead}>
            Whether you have a project in mind or just want to explore possibilities — we're always happy to chat.
          </p>
        </div>
      </section>

      {/* BODY */}
      <section style={{ padding: "2rem 0 6rem" }}>
        <div style={s.container}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.65fr", gap: "5rem", alignItems: "start" }} className="contact-grid">

            {/* INFO SIDEBAR */}
            <div style={{ position: "sticky", top: 100 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", marginBottom: "1.5rem" }}>
                Get in touch
              </h2>
              {infoItems.map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: "1rem", alignItems: "flex-start",
                  padding: "1.25rem 0", borderBottom: i < infoItems.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                    background: "rgba(200,169,110,0.1)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.3rem" }}>{item.label}</div>
                    <div style={{ fontSize: "0.92rem", color: "var(--cream)" }}>{item.value}</div>
                  </div>
                </div>
              ))}

              {/* Availability badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "rgba(72,187,120,0.1)", border: "1px solid rgba(72,187,120,0.3)",
                borderRadius: 999, padding: "0.4rem 1rem",
                fontSize: "0.78rem", color: "#68d391", marginTop: "1.75rem",
              }}>
                <span style={{
                  display: "block", width: 7, height: 7, background: "#68d391",
                  borderRadius: "50%", animation: "pulse 2s infinite",
                }} />
                Currently accepting new projects
              </div>
            </div>

            {/* FORM */}
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
              borderRadius: 22, padding: "3rem",
            }} className="form-card">
              {submitted ? (
                <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>✅</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", marginBottom: "0.75rem" }}>
                    Message sent!
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
                    Thanks for reaching out. We'll be in touch within one business day.
                  </p>
                </div>
              ) : (
                <>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", marginBottom: "0.4rem" }}>
                    Send us a message
                  </h2>
                  <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "2rem" }}>
                    We'll respond within one business day.
                  </p>

                  {/* Name row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="name-row">
                    <div>
                      <label style={labelStyle}>First name</label>
                      <input style={inputStyle(errors.firstName)} placeholder="Marcus"
                        value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                      {errors.firstName && <p style={errStyle}>{errors.firstName}</p>}
                    </div>
                    <div>
                      <label style={labelStyle}>Last name</label>
                      <input style={inputStyle(errors.lastName)} placeholder="Chen"
                        value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                      {errors.lastName && <p style={errStyle}>{errors.lastName}</p>}
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={labelStyle}>Email address</label>
                    <input style={inputStyle(errors.email)} placeholder="you@company.com" type="email"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <p style={errStyle}>{errors.email}</p>}
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={labelStyle}>Company (optional)</label>
                    <input style={inputStyle(false)} placeholder="Acme Inc."
                      value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                  </div>

                  {/* Service pills */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={labelStyle}>Service interested in</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                      {services.map(svc => (
                        <ServicePill key={svc} label={svc}
                          selected={form.service === svc}
                          onClick={() => setForm({ ...form, service: svc })} />
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={labelStyle}>Approximate budget</label>
                    <select style={{ ...inputStyle(false), cursor: "pointer" }}
                      value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
                      <option value="">Select a range</option>
                      <option value="<5k">&lt; $5,000</option>
                      <option value="5-15k">$5,000 – $15,000</option>
                      <option value="15-50k">$15,000 – $50,000</option>
                      <option value="50k+">$50,000+</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={labelStyle}>Tell us about your project</label>
                    <textarea rows={5} style={inputStyle(errors.message)}
                      placeholder="Briefly describe your goals, timeline, and any context that would help us..."
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                    {errors.message && <p style={errStyle}>{errors.message}</p>}
                  </div>

                  <SubmitBtn onClick={handleSubmit} loading={sending} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:960px){.contact-grid{grid-template-columns:1fr!important;gap:3rem!important}}
        @media(max-width:580px){.name-row{grid-template-columns:1fr!important}.form-card{padding:2rem 1.25rem!important}}
        select option{background:#1a1a14;color:var(--cream)}
      `}</style>
    </div>
  );
}

function ServicePill({ label, selected, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "0.45rem 1rem", borderRadius: 999, fontSize: "0.8rem",
        border: `1px solid ${selected || hov ? "var(--gold)" : "rgba(200,169,110,0.25)"}`,
        background: selected ? "rgba(200,169,110,0.15)" : "transparent",
        color: selected || hov ? "var(--gold)" : "var(--muted)",
        cursor: "pointer", transition: "all 0.2s",
        fontFamily: "'DM Sans', sans-serif",
      }}>
      {label}
    </button>
  );
}

function SubmitBtn({ onClick, loading }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", padding: "1rem", fontSize: "0.88rem", fontWeight: 500,
        letterSpacing: "0.1em", textTransform: "uppercase",
        background: hov ? "var(--gold-light)" : "var(--gold)",
        color: "var(--ink)", border: "none", borderRadius: 8,
        cursor: "pointer", transition: "all 0.25s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 8px 24px rgba(200,169,110,0.3)" : "none",
        fontFamily: "'DM Sans', sans-serif",
        opacity: loading ? 0.7 : 1,
      }}>
      {loading ? "Sending…" : "Send Message ↗"}
    </button>
  );
}

/* ─────────────────────────────────────────
   ROOT APP
───────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("home");

  const changePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <GlobalStyles />
      <Navbar page={page} setPage={changePage} />
      <main>
        {page === "home"    && <HomePage setPage={changePage} />}
        {page === "about"   && <AboutPage setPage={changePage} />}
        {page === "contact" && <ContactPage />}
      </main>
      <Footer setPage={changePage} />
    </>
  );
}
