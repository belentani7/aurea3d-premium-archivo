import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ÁUREA 3D — Manufactura Aditiva Industrial y Náutica
 * 
 * Diseñado y desarrollado por Pedro Belentani
 * Todos los derechos cedidos a Thiago Luiz
 * 
 * "Para Thiago, com amor de irmão. Sempre estarei aqui." — Pedro
 * 
 * Design: #050505, Glassmorphism (blur 24px), Syne+Inter+JetBrains Mono
 * Animations: IntersectionObserver scroll-reveal (GSAP-pattern)
 * Languages: ES + EN
 * 
 * @author Pedro Belentani <pedro.belentani>
 * @owner Thiago Luiz
 * @license All rights transferred to Thiago Luiz (irrevocable, perpetual)
 * @created July 2025
 */

type Lang = "es" | "en";

const T = {
  es: {
    nav: { cap: "Capacidades", proc: "Proceso", contact: "Consultoría" },
    hero: {
      title: "Manufactura Aditiva y Prototipado Rápido",
      sub: "Precisión Industrial y Náutica en Málaga",
      cta: "Solicitar Consultoría Técnica",
    },
    cap: {
      title: "Capacidades Técnicas",
      sub: "Ingeniería de precisión para industria y náutica",
      items: [
        { t: "Tolerancia ±0.05mm", d: "Precisión dimensional certificada para componentes críticos", s: "FDM / SLA / MJF" },
        { t: "Resolución 25μm", d: "Detalle superficial para piezas de acabado premium", s: "Resina técnica" },
        { t: "PA12 / ASA / PETG", d: "Materiales certificados para entornos marinos y UV", s: "Náutica & Exterior" },
        { t: "Prototipado 48h", d: "De CAD a pieza funcional en ciclos de 48 horas", s: "Iteración rápida" },
        { t: "Post-Procesado CNC", d: "Acabados industriales: lijado, pintura, metalizado", s: "Calidad producción" },
        { t: "Lotes 1–500 uds", d: "Manufactura bajo demanda sin moldes ni utillaje", s: "Sin inversión inicial" },
      ],
    },
    proc: {
      title: "Proceso",
      steps: [
        { n: "01", t: "Consultoría Técnica", d: "Análisis de viabilidad, selección de material y proceso óptimo" },
        { n: "02", t: "Ingeniería & CAD", d: "Diseño paramétrico, optimización topológica, DFAM" },
        { n: "03", t: "Manufactura Aditiva", d: "Producción controlada con monitorización en tiempo real" },
        { n: "04", t: "Post-Procesado & QC", d: "Acabado industrial, verificación dimensional, entrega" },
      ],
    },
    form: {
      title: "Solicitar Consultoría",
      sub: "Cuéntenos su proyecto. Respuesta técnica en 24h.",
      company: "Empresa", contact: "Persona de contacto", email: "Email corporativo",
      phone: "Teléfono", sector: "Sector", desc: "Descripción del proyecto",
      submit: "Enviar Solicitud", sending: "Enviando...",
      sectors: { industrial: "Industrial", nautica: "Náutica", arquitectura: "Arquitectura", otro: "Otro" },
      ok: "Solicitud enviada. Recibirá respuesta técnica en 24h.",
    },
    footer: { loc: "Málaga, España", rights: "Todos los derechos reservados" },
  },
  en: {
    nav: { cap: "Capabilities", proc: "Process", contact: "Consulting" },
    hero: {
      title: "Additive Manufacturing & Rapid Prototyping",
      sub: "Industrial & Nautical Precision in Málaga",
      cta: "Request Technical Consulting",
    },
    cap: {
      title: "Technical Capabilities",
      sub: "Precision engineering for industry and nautical",
      items: [
        { t: "Tolerance ±0.05mm", d: "Certified dimensional precision for critical components", s: "FDM / SLA / MJF" },
        { t: "Resolution 25μm", d: "Surface detail for premium finish parts", s: "Technical resin" },
        { t: "PA12 / ASA / PETG", d: "Certified materials for marine and UV environments", s: "Nautical & Outdoor" },
        { t: "Prototyping 48h", d: "From CAD to functional part in 48-hour cycles", s: "Rapid iteration" },
        { t: "CNC Post-Processing", d: "Industrial finishes: sanding, painting, metalizing", s: "Production quality" },
        { t: "Batches 1–500 units", d: "On-demand manufacturing without molds or tooling", s: "No initial investment" },
      ],
    },
    proc: {
      title: "Process",
      steps: [
        { n: "01", t: "Technical Consulting", d: "Feasibility analysis, material and process selection" },
        { n: "02", t: "Engineering & CAD", d: "Parametric design, topological optimization, DFAM" },
        { n: "03", t: "Additive Manufacturing", d: "Controlled production with real-time monitoring" },
        { n: "04", t: "Post-Processing & QC", d: "Industrial finishing, dimensional verification, delivery" },
      ],
    },
    form: {
      title: "Request Consulting",
      sub: "Tell us about your project. Technical response in 24h.",
      company: "Company", contact: "Contact person", email: "Corporate email",
      phone: "Phone", sector: "Sector", desc: "Project description",
      submit: "Submit Request", sending: "Sending...",
      sectors: { industrial: "Industrial", nautica: "Nautical", arquitectura: "Architecture", otro: "Other" },
      ok: "Request sent. You will receive a technical response in 24h.",
    },
    footer: { loc: "Málaga, Spain", rights: "All rights reserved" },
  },
};

export default function HomeSupremePremium() {
  const { language: lang, toggleLanguage } = useLanguage();
  const [fd, setFd] = useState({ companyName: "", contactName: "", email: "", phone: "", sector: "industrial" as const, notes: "" });
  const [sending, setSending] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const createLead = trpc.crm.createLead.useMutation();
  const i = T[lang];

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("rv"); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    rootRef.current?.querySelectorAll(".ro").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang]);

  // GSAP aporta el parallax del ambiente; Framer Motion gestiona AutomationPanel.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(".hero-ambient", { opacity: 0, scale: 0.82 }, { opacity: 1, scale: 1.08, duration: 1.2, ease: "power3.out" });
      gsap.to(".hero-ambient", {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: ".hero-ambient", start: "top top", end: "bottom top", scrub: 0.8 },
      });
    }, rootRef);
    return () => context.revert();
  }, [lang]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fd.companyName || !fd.contactName || !fd.email) return;
    setSending(true);
    try {
      await createLead.mutateAsync({ companyName: fd.companyName, contactName: fd.contactName, email: fd.email, phone: fd.phone || undefined, sector: fd.sector, notes: fd.notes || undefined });
      toast.success(i.form.ok);
      setFd({ companyName: "", contactName: "", email: "", phone: "", sector: "industrial", notes: "" });
    } catch { toast.error(lang === "es" ? "No se pudo enviar la solicitud. Inténtelo de nuevo." : "Could not send your request. Please try again."); }
    finally { setSending(false); }
  };

  return (
    <div className="ar" ref={rootRef} lang={lang}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400&display=swap');
        .ar{--bg:#050505;--bg2:#0a0a0a;--gl:rgba(10,10,10,0.72);--g:#C9A96E;--gd:rgba(201,169,110,0.2);--gg:rgba(201,169,110,0.06);--bz:#8A734E;--t1:#F5F1E8;--t2:rgba(245,241,232,0.6);--t3:rgba(245,241,232,0.3);--bd:rgba(201,169,110,0.1);--bdh:rgba(201,169,110,0.28);font-family:'Inter',sans-serif;background:var(--bg);color:var(--t1);min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
        .sy{font-family:'Syne',sans-serif}.mn{font-family:'JetBrains Mono',monospace}
        .gl{background:var(--gl);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid var(--bd);border-top-color:var(--gd)}
        .gc{background:rgba(10,10,10,0.55);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--bd);border-radius:16px;transition:all .45s cubic-bezier(.23,1,.32,1)}
        .gc:hover{border-color:var(--bdh);transform:translateY(-5px);box-shadow:0 24px 64px rgba(201,169,110,.05)}
        .ro{opacity:0;transform:translateY(36px);transition:opacity .85s cubic-bezier(.23,1,.32,1),transform .85s cubic-bezier(.23,1,.32,1)}
        .rv{opacity:1;transform:translateY(0)}
        .s1{transition-delay:.08s}.s2{transition-delay:.16s}.s3{transition-delay:.24s}.s4{transition-delay:.32s}.s5{transition-delay:.4s}.s6{transition-delay:.48s}
        .ht span{display:inline-block;animation:sr 1.1s cubic-bezier(.23,1,.32,1) forwards;opacity:0;transform:translateY(100%)}
        .ht span:nth-child(2){animation-delay:.12s}.ht span:nth-child(3){animation-delay:.24s}.ht span:nth-child(4){animation-delay:.36s}.ht span:nth-child(5){animation-delay:.48s}
        @keyframes sr{to{opacity:1;transform:translateY(0)}}
        .bp{background:transparent;border:1px solid var(--g);color:var(--g);padding:15px 38px;font-family:'Inter',sans-serif;font-weight:500;font-size:13px;letter-spacing:.06em;text-transform:uppercase;border-radius:60px;cursor:pointer;transition:all .4s cubic-bezier(.23,1,.32,1);position:relative;overflow:hidden}
        .bp::before{content:'';position:absolute;inset:0;background:var(--g);transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.23,1,.32,1);border-radius:60px}
        .bp:hover{color:var(--bg);border-color:var(--g)}.bp:hover::before{transform:scaleX(1)}.bp:active{transform:scale(.97)}.bp span{position:relative;z-index:1}
        .bp:disabled{opacity:.5;cursor:not-allowed}
        .if{background:rgba(10,10,10,.85);border:1px solid var(--bd);border-radius:12px;padding:14px 18px;color:var(--t1);font-family:'Inter',sans-serif;font-size:14px;width:100%;transition:border-color .3s;outline:none}
        .if:focus{border-color:var(--g);box-shadow:0 0 0 3px var(--gd)}.if::placeholder{color:var(--t3)}
        .ar :focus-visible{outline:2px solid var(--g);outline-offset:3px}
        .ar .if{min-width:0}
        .sb{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--g);background:var(--gg);padding:4px 10px;border-radius:20px;border:1px solid var(--gd);letter-spacing:.02em}
        .pl{position:absolute;left:24px;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,transparent,var(--gd),transparent)}
        html{scroll-behavior:smooth}::selection{background:var(--gd);color:var(--t1)}
        @media (max-width:640px){.ar .ar-form-grid{grid-template-columns:1fr!important}.ar nav>div{flex-wrap:wrap;row-gap:10px}.ar nav>div>div{gap:12px;flex-wrap:wrap;justify-content:flex-end}.ar nav a.sy{white-space:nowrap}.ar .ht{font-size:clamp(1.8rem,8.8vw,3.4rem)!important;line-height:1.08;padding-inline:8px}}
        @media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}.ro{opacity:1;transform:none}}
      `}</style>

      {/* Nav */}
      <nav className="gl" style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"14px 0"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <a href="#" className="sy" style={{fontSize:18,fontWeight:700,color:"var(--g)",letterSpacing:"-0.02em",textDecoration:"none"}}>ÁUREA 3D</a>
          <div style={{display:"flex",gap:28,alignItems:"center"}}>
            <a href="#cap" style={{color:"var(--t2)",textDecoration:"none",fontSize:13,letterSpacing:".03em"}}>{i.nav.cap}</a>
            <a href="#proc" style={{color:"var(--t2)",textDecoration:"none",fontSize:13,letterSpacing:".03em"}}>{i.nav.proc}</a>
            <a href="#form" style={{color:"var(--t2)",textDecoration:"none",fontSize:13,letterSpacing:".03em"}}>{i.nav.contact}</a>
            <a href="/portfolio" style={{color:"var(--t2)",textDecoration:"none",fontSize:13,letterSpacing:".03em"}}>Portfolio</a>
            <button type="button" onClick={toggleLanguage} aria-label={lang === "es" ? "Switch to English" : "Cambiar a español"} className="mn" style={{background:"transparent",border:"1px solid var(--bd)",borderRadius:20,padding:"5px 12px",color:"var(--t2)",fontSize:11,cursor:"pointer"}}>{lang.toUpperCase()}</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 24px 80px",position:"relative"}}>
        <div className="hero-ambient" style={{position:"absolute",top:"20%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:600,background:"radial-gradient(ellipse,rgba(201,169,110,.035) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:880,textAlign:"center",position:"relative"}}>
          <h1 className="ht sy" style={{fontSize:"clamp(2.4rem,5.5vw,4.2rem)",fontWeight:800,lineHeight:1.05,letterSpacing:"-0.03em",marginBottom:22}}>
            {i.hero.title.split(" ").map((w,j)=><span key={j} style={{marginRight:".28em"}}>{w}</span>)}
          </h1>
          <p style={{color:"var(--t2)",fontSize:17,lineHeight:1.6,marginBottom:44,maxWidth:580,margin:"0 auto 44px"}}>{i.hero.sub}</p>
          <a href="#form" className="bp" style={{display:"inline-block",textDecoration:"none"}}><span>{i.hero.cta}</span></a>
        </div>
      </section>

      {/* Capabilities */}
      <section id="cap" style={{padding:"120px 24px",maxWidth:1200,margin:"0 auto"}}>
        <div className="ro" style={{marginBottom:56}}>
          <h2 className="sy" style={{fontSize:"clamp(1.8rem,3.5vw,2.8rem)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:10}}>{i.cap.title}</h2>
          <p style={{color:"var(--t2)",fontSize:15}}>{i.cap.sub}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:18}}>
          {i.cap.items.map((c,j)=>(
            <div key={j} className={`gc ro s${j+1}`} style={{padding:28}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <h3 className="sy" style={{fontSize:16,fontWeight:600}}>{c.t}</h3>
                <span className="sb">{c.s}</span>
              </div>
              <p style={{color:"var(--t2)",fontSize:13,lineHeight:1.6}}>{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="proc" style={{padding:"120px 24px",maxWidth:760,margin:"0 auto"}}>
        <div className="ro" style={{marginBottom:56}}>
          <h2 className="sy" style={{fontSize:"clamp(1.8rem,3.5vw,2.8rem)",fontWeight:700,letterSpacing:"-0.02em"}}>{i.proc.title}</h2>
        </div>
        <div style={{position:"relative",paddingLeft:60}}>
          <div className="pl"/>
          {i.proc.steps.map((s,j)=>(
            <div key={j} className={`ro s${j+1}`} style={{marginBottom:52,position:"relative"}}>
              <div style={{position:"absolute",left:-42,top:7,width:9,height:9,borderRadius:"50%",background:"var(--g)",boxShadow:"0 0 10px var(--gd)"}}/>
              <span className="mn" style={{fontSize:11,color:"var(--g)",display:"block",marginBottom:6}}>{s.n}</span>
              <h3 className="sy" style={{fontSize:18,fontWeight:600,marginBottom:6}}>{s.t}</h3>
              <p style={{color:"var(--t2)",fontSize:13,lineHeight:1.6}}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section id="form" style={{padding:"120px 24px",maxWidth:660,margin:"0 auto"}}>
        <div className="ro" style={{marginBottom:40}}>
          <h2 className="sy" style={{fontSize:"clamp(1.8rem,3.5vw,2.8rem)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:10}}>{i.form.title}</h2>
          <p style={{color:"var(--t2)",fontSize:15}}>{i.form.sub}</p>
        </div>
        <form onSubmit={submit} className="gc ro" style={{padding:36}}>
          <div className="ar-form-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <input className="if" aria-label={i.form.company} autoComplete="organization" placeholder={i.form.company} value={fd.companyName} onChange={e=>setFd({...fd,companyName:e.target.value})} required/>
            <input className="if" aria-label={i.form.contact} autoComplete="name" placeholder={i.form.contact} value={fd.contactName} onChange={e=>setFd({...fd,contactName:e.target.value})} required/>
          </div>
          <div className="ar-form-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <input className="if" type="email" aria-label={i.form.email} autoComplete="email" placeholder={i.form.email} value={fd.email} onChange={e=>setFd({...fd,email:e.target.value})} required/>
            <input className="if" type="tel" aria-label={i.form.phone} autoComplete="tel" placeholder={i.form.phone} value={fd.phone} onChange={e=>setFd({...fd,phone:e.target.value})}/>
          </div>
          <div style={{marginBottom:14}}>
            <select className="if" aria-label={i.form.sector} value={fd.sector} onChange={e=>setFd({...fd,sector:e.target.value as any})}>
              {Object.entries(i.form.sectors).map(([k,v])=><option key={k} value={k} style={{background:"#0a0a0a"}}>{v}</option>)}
            </select>
          </div>
          <div style={{marginBottom:22}}>
            <textarea className="if" aria-label={i.form.desc} placeholder={i.form.desc} value={fd.notes} onChange={e=>setFd({...fd,notes:e.target.value})} style={{minHeight:110,resize:"vertical"}}/>
          </div>
          <button type="submit" className="bp" disabled={sending} style={{width:"100%"}}><span>{sending?i.form.sending:i.form.submit}</span></button>
        </form>
      </section>

      {/* Footer */}
      <footer style={{padding:"44px 24px",borderTop:"1px solid var(--bd)",textAlign:"center"}}>
        <p className="sy" style={{color:"var(--g)",fontSize:15,fontWeight:600,marginBottom:10}}>ÁUREA 3D</p>
        <p className="mn" style={{color:"var(--t3)",fontSize:11,marginBottom:4}}>info@aurea3d.com · {i.footer.loc}</p>
        <p className="mn" style={{color:"var(--t3)",fontSize:10,marginBottom:14}}>© {new Date().getFullYear()} ÁUREA 3D. {i.footer.rights}.</p>
        <p style={{color:"#1a1a1a",fontSize:9,letterSpacing:"0.05em",fontFamily:"var(--f-mono)"}}>Diseñado con precisión. Construido con propósito.</p>
      </footer>
    </div>
  );
}
