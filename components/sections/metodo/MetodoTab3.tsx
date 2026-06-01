"use client";
import { useEffect, useRef, useCallback } from "react";

const CSS = `
.t3-wrap { width:100%; height:100%; position:relative; overflow:hidden; }
.t3-wrap .stage { position:absolute; top:0; left:0; width:1280px; height:800px; transform-origin:top left; }
.t3-wrap .macbook { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:1120px; }
.t3-wrap .lid {
  position:relative; width:100%; aspect-ratio:16/10;
  border-radius:22px 22px 6px 6px; background:#0a0a0c;
  padding:26px 24px 30px; box-sizing:border-box;
  box-shadow:0 50px 110px -25px rgba(0,0,0,0.75),0 24px 60px -18px rgba(63,200,122,0.08),
    inset 0 0 0 1px rgba(255,255,255,0.06),inset 0 0 0 2.5px #1a1a1c;
}
.t3-wrap .lid::before {
  content:""; position:absolute; top:0; left:50%; transform:translateX(-50%);
  width:150px; height:22px; background:#0a0a0c; border-radius:0 0 12px 12px; z-index:6;
}
.t3-wrap .screen { position:relative; width:100%; height:100%; border-radius:6px; overflow:hidden; background:#080C14; }
.t3-wrap .hinge { width:100%; height:16px; margin-top:-2px; background:linear-gradient(180deg,#3a3a40,#2a2a30 50%,#1a1a20); border-radius:0 0 5px 5px; }
.t3-wrap .base {
  width:116%; margin-left:-8%; height:22px;
  background:linear-gradient(180deg,#4a4a52,#3c3c44 30%,#2a2a30);
  border-radius:0 0 16px 16px;
  box-shadow:0 30px 50px -15px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1);
  position:relative;
}
.t3-wrap .base::after {
  content:""; position:absolute; top:0; left:50%; transform:translateX(-50%);
  width:16%; height:5px; background:#1a1a20; border-radius:0 0 6px 6px;
}
.t3-wrap .stagewrap { position:absolute; inset:0; }
.t3-wrap .view { position:absolute; inset:0; opacity:0; transition:opacity 0.5s ease; pointer-events:none; }
.t3-wrap .view.on { opacity:1; }
.t3-wrap .phase {
  position:absolute; top:22px; left:24px; z-index:20;
  display:inline-flex; align-items:center; gap:10px;
  font-family:var(--font-mono); font-size:13px; letter-spacing:0.16em;
  text-transform:uppercase; color:var(--lg-text-secondary);
  background:rgba(8,12,20,0.7); border:1px solid rgba(255,255,255,0.08);
  padding:8px 16px; border-radius:999px; backdrop-filter:blur(8px);
  opacity:0; transition:opacity 0.4s ease;
}
.t3-wrap .phase.on { opacity:1; }
.t3-wrap .phase .n { color:var(--lg-green); font-weight:500; }
.t3-wrap .phase .sep { width:4px; height:4px; border-radius:50%; background:rgba(255,255,255,0.3); }

/* editor */
.t3-wrap .editor { position:absolute; inset:0; background:#0A0E17; display:grid; grid-template-columns:56px 230px 1fr; font-family:var(--font-mono); }
.t3-wrap .ed-rail { background:#0B1019; border-right:1px solid rgba(255,255,255,0.05); display:flex; flex-direction:column; align-items:center; padding-top:64px; gap:26px; }
.t3-wrap .ed-rail .ic { width:22px; height:22px; color:rgba(255,255,255,0.3); }
.t3-wrap .ed-rail .ic.active { color:var(--lg-green); }
.t3-wrap .ed-tree { background:#0B0F18; border-right:1px solid rgba(255,255,255,0.05); padding:56px 0 0; font-size:13px; color:var(--lg-text-secondary); }
.t3-wrap .ed-tree .grp { padding:6px 18px; color:var(--lg-text-muted); font-size:11px; letter-spacing:0.1em; text-transform:uppercase; }
.t3-wrap .ed-tree .f { padding:5px 18px 5px 32px; display:flex; align-items:center; gap:8px; }
.t3-wrap .ed-tree .f.sel { background:rgba(63,200,122,0.08); color:#fff; border-left:2px solid var(--lg-green); padding-left:30px; }
.t3-wrap .ed-tree .f .dot { width:7px; height:7px; border-radius:2px; }
.t3-wrap .ed-code { background:#080C14; position:relative; overflow:hidden; padding:56px 0 0; }
.t3-wrap .ed-tabs { position:absolute; top:0; left:0; right:0; height:44px; display:flex; align-items:stretch; border-bottom:1px solid rgba(255,255,255,0.05); background:#0A0E17; }
.t3-wrap .ed-tab { display:flex; align-items:center; gap:8px; padding:0 20px; font-size:13px; color:#fff; background:#080C14; border-right:1px solid rgba(255,255,255,0.05); }
.t3-wrap .ed-tab .x { color:var(--lg-text-muted); }
.t3-wrap .code { padding:18px 0 0 24px; font-size:16px; line-height:1.85; counter-reset:ln; }
.t3-wrap .cl { display:block; white-space:pre; }
.t3-wrap .cl::before { counter-increment:ln; content:counter(ln); display:inline-block; width:34px; margin-left:-24px; text-align:right; padding-right:18px; color:rgba(255,255,255,0.2); }
.t3-wrap .kw{color:#C792EA;} .t3-wrap .fn{color:#82AAFF;} .t3-wrap .st{color:#C3E88D;} .t3-wrap .tg{color:#F07178;} .t3-wrap .at{color:#FFCB6B;} .t3-wrap .cm{color:#546E7A;} .t3-wrap .pl{color:#A6ACCD;}
.t3-wrap .typed-cursor { display:inline-block; width:9px; height:19px; background:var(--lg-green); vertical-align:middle; margin-left:1px; animation:t3-blink 1s steps(2) infinite; }
@keyframes t3-blink { 50%{opacity:0;} }

/* pagespeed */
.t3-wrap .ps {
  position:absolute; inset:0;
  background:radial-gradient(ellipse at 25% 12%,rgba(13,31,74,0.4) 0%,transparent 55%),
    radial-gradient(ellipse at 80% 88%,rgba(20,90,50,0.28) 0%,transparent 55%),#080C14;
  display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 70px;
}
.t3-wrap .ps-head { font-family:var(--font-display); font-weight:700; font-size:30px; letter-spacing:-0.02em; margin:0 0 8px; text-align:center; }
.t3-wrap .ps-sub { font-family:var(--font-mono); font-size:13px; letter-spacing:0.16em; text-transform:uppercase; color:var(--lg-text-muted); margin:0 0 50px; }
.t3-wrap .ps-row { display:flex; gap:56px; }
.t3-wrap .ps-metric { display:flex; flex-direction:column; align-items:center; gap:18px; }
.t3-wrap .gauge { position:relative; width:150px; height:150px; }
.t3-wrap .gauge svg { width:100%; height:100%; transform:rotate(-90deg); }
.t3-wrap .gauge .num { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-family:var(--font-mono); font-weight:700; font-size:46px; color:#3FC87A; }
.t3-wrap .ps-label { font-family:var(--font-body); font-size:17px; color:var(--lg-text-secondary); }

/* meta ads */
.t3-wrap .meta { position:absolute; inset:0; background:#0A0E17; display:flex; flex-direction:column; }
.t3-wrap .meta-top { height:64px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; gap:16px; padding:0 28px; background:#0B1019; }
.t3-wrap .meta-logo { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,#4A9EE0,#1877F2); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-weight:700; color:#fff; font-size:18px; }
.t3-wrap .meta-title { font-family:var(--font-body); font-weight:600; font-size:17px; color:#fff; }
.t3-wrap .meta-pill { margin-left:auto; font-family:var(--font-mono); font-size:12px; color:#3FC87A; border:1px solid rgba(63,200,122,0.3); border-radius:999px; padding:6px 14px; display:flex; align-items:center; gap:8px; }
.t3-wrap .meta-pill .live { width:7px; height:7px; border-radius:50%; background:#3FC87A; }
.t3-wrap .meta-body { flex:1; padding:28px 32px; overflow:hidden; }
.t3-wrap .meta-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:26px; }
.t3-wrap .kpi { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:18px 20px; }
.t3-wrap .kpi .k { font-family:var(--font-mono); font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--lg-text-muted); margin-bottom:10px; }
.t3-wrap .kpi .v { font-family:var(--font-mono); font-weight:700; font-size:30px; color:#fff; line-height:1; }
.t3-wrap .kpi .v.up { color:#3FC87A; }
.t3-wrap .kpi .delta { font-family:var(--font-body); font-size:12px; color:#3FC87A; margin-top:8px; }
.t3-wrap .camp { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:14px; overflow:hidden; }
.t3-wrap .camp-row { display:grid; grid-template-columns:28px 1fr 110px 90px 110px; align-items:center; gap:14px; padding:15px 22px; border-bottom:1px solid rgba(255,255,255,0.05); }
.t3-wrap .camp-row:last-child { border-bottom:0; }
.t3-wrap .camp-row.head { font-family:var(--font-mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--lg-text-muted); }
.t3-wrap .camp-row .toggle { width:30px; height:17px; border-radius:999px; background:#3FC87A; position:relative; }
.t3-wrap .camp-row .toggle::after { content:""; position:absolute; top:2px; right:2px; width:13px; height:13px; border-radius:50%; background:#fff; }
.t3-wrap .camp-row .name { font-family:var(--font-body); font-size:15px; color:#fff; }
.t3-wrap .camp-row .name .sub { font-family:var(--font-mono); font-size:11px; color:var(--lg-text-muted); margin-top:3px; }
.t3-wrap .camp-row .cell { font-family:var(--font-mono); font-size:14px; color:var(--lg-text-secondary); }
.t3-wrap .camp-row .cell.good { color:#3FC87A; }
.t3-wrap .spark { display:flex; align-items:flex-end; gap:3px; height:26px; }
.t3-wrap .spark span { width:5px; background:rgba(63,200,122,0.4); border-radius:1px; }
.t3-wrap .spark span.hi { background:#3FC87A; }
.t3-wrap .cursor { position:absolute; z-index:60; width:26px; height:26px; pointer-events:none; left:640px; top:420px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5)); opacity:0; }
.t3-wrap .cursor svg { width:100%; height:100%; }
`;

const CODE_LINES = [
  '<span class="cm">// app/page.tsx — Level Growth</span>',
  '<span class="kw">import</span> <span class="pl">{ Hero }</span> <span class="kw">from</span> <span class="st">"@/components/Hero"</span>',
  '<span class="kw">import</span> <span class="pl">{ Cta }</span> <span class="kw">from</span> <span class="st">"@/components/Cta"</span>',
  "",
  '<span class="kw">export default function</span> <span class="fn">Page</span>() {',
  "  <span class=\"kw\">return</span> (",
  '    <span class="tg">&lt;main</span> <span class="at">className</span>=<span class="st">"bg-lg-bg"</span><span class="tg">&gt;</span>',
  '      <span class="tg">&lt;Hero</span> <span class="at">title</span>=<span class="st">"Tu web que vende"</span> <span class="tg">/&gt;</span>',
  '      <span class="tg">&lt;Cta</span> <span class="at">href</span>=<span class="st">"/auditoria"</span> <span class="tg">/&gt;</span>',
  '    <span class="tg">&lt;/main&gt;</span>',
  "  )",
  "}",
];

export function MetodoTab3({ isActive }: { isActive: boolean }) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const stageRef   = useRef<HTMLDivElement>(null);
  const stoppedRef = useRef(false);
  const pausedRef  = useRef(!isActive);

  useEffect(() => { pausedRef.current = !isActive; }, [isActive]);

  const sleep = useCallback((ms: number): Promise<void> =>
    new Promise((res, rej) => {
      if (stoppedRef.current) { rej(new Error("stopped")); return; }
      const t = setTimeout(() => {
        if (stoppedRef.current) { rej(new Error("stopped")); return; }
        if (!pausedRef.current) { res(); return; }
        const p = setInterval(() => {
          if (stoppedRef.current) { clearInterval(p); rej(new Error("stopped")); }
          else if (!pausedRef.current) { clearInterval(p); res(); }
        }, 50);
      }, ms);
      void t;
    }), []);

  /* Scale stage to fit wrapper and center */
  useEffect(() => {
    const container = wrapRef.current;
    const stage     = stageRef.current;
    if (!container || !stage) return;
    const fitStage = () => {
      const { width, height } = container.getBoundingClientRect();
      const scale   = Math.min(width / 1280, height / 800);
      const offsetX = (width  - 1280 * scale) / 2;
      const offsetY = (height - 800  * scale) / 2;
      stage.style.transform       = `scale(${scale})`;
      stage.style.transformOrigin = "top left";
      stage.style.left            = `${offsetX}px`;
      stage.style.top             = `${offsetY}px`;
    };
    const ro = new ResizeObserver(fitStage);
    ro.observe(container);
    fitStage();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    stoppedRef.current = false;
    const root = wrapRef.current;
    if (!root) return;

    const views: Record<number, HTMLElement> = {
      1: root.querySelector("#t3-v1")!,
      2: root.querySelector("#t3-v2")!,
      3: root.querySelector("#t3-v3")!,
    };
    const phase  = root.querySelector<HTMLElement>("#t3-phase")!;
    const phaseN = root.querySelector<HTMLElement>("#t3-phaseN")!;
    const phaseT = root.querySelector<HTMLElement>("#t3-phaseT")!;

    function showView(n: number, num: string, title: string) {
      Object.values(views).forEach(v => v.classList.remove("on"));
      views[n].classList.add("on");
      phaseN.textContent = num;
      phaseT.textContent = title;
      phase.classList.add("on");
    }

    async function typeCode() {
      const codeEl = root!.querySelector<HTMLElement>("#t3-code")!;
      codeEl.innerHTML = "";
      for (let i = 0; i < CODE_LINES.length; i++) {
        if (stoppedRef.current) throw new Error("stopped");
        const line = document.createElement("span");
        line.className = "cl";
        codeEl.appendChild(line);
        const html = CODE_LINES[i];
        if (html === "") { line.innerHTML = " "; await sleep(90); continue; }
        const chunks = html.split(/(<[^>]+>)/).filter(Boolean);
        let acc = "";
        for (const ch of chunks) {
          if (stoppedRef.current) throw new Error("stopped");
          acc += ch;
          line.innerHTML = acc + '<span class="typed-cursor"></span>';
          await sleep(ch.startsWith("<") ? 10 : 55);
        }
        line.innerHTML = acc;
        await sleep(80);
      }
    }

    function buildGauges() {
      const rowEl = root!.querySelector<HTMLElement>("#t3-psRow")!;
      rowEl.innerHTML = "";
      const metrics = [
        { label: "Accesibilidad", val: 99 },
        { label: "Rendimiento", val: 100 },
        { label: "Prácticas", val: 100 },
        { label: "SEO", val: 100 },
      ];
      const R = 64, C = 2 * Math.PI * R;
      metrics.forEach(m => {
        const wrap = document.createElement("div");
        wrap.className = "ps-metric";
        wrap.innerHTML = `
          <div class="gauge">
            <svg viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="${R}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="9"/>
              <circle class="arc" cx="75" cy="75" r="${R}" fill="none" stroke="#3FC87A" stroke-width="9"
                stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"
                data-target="${C * (1 - m.val / 100)}"/>
            </svg>
            <div class="num" data-target="${m.val}">0</div>
          </div>
          <div class="ps-label">${m.label}</div>`;
        rowEl.appendChild(wrap);
      });
    }

    async function animateGauges() {
      const arcs = root!.querySelectorAll<SVGCircleElement>("#t3-psRow .arc");
      const nums = root!.querySelectorAll<HTMLElement>("#t3-psRow .num");
      arcs.forEach(a => {
        a.style.transition = "stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)";
        a.style.strokeDashoffset = (a as unknown as HTMLElement).dataset.target!;
      });
      const start = performance.now();
      await new Promise<void>(r => {
        const tick = (now: number) => {
          if (stoppedRef.current) { r(); return; }
          const t = Math.min((now - start) / 1300, 1);
          const e = 1 - Math.pow(1 - t, 3);
          nums.forEach(n => { n.textContent = String(Math.round(e * +n.dataset.target!)); });
          if (t < 1) requestAnimationFrame(tick); else r();
        };
        requestAnimationFrame(tick);
      });
    }

    function countUp(el: HTMLElement, target: number, suffix = "", prefix = "", dur = 1200): Promise<void> {
      const start = performance.now();
      return new Promise(r => {
        const tick = (now: number) => {
          if (stoppedRef.current) { r(); return; }
          const t = Math.min((now - start) / dur, 1);
          const e = 1 - Math.pow(1 - t, 3);
          el.textContent = prefix + Math.round(e * target).toLocaleString("es-AR") + suffix;
          if (t < 1) requestAnimationFrame(tick); else r();
        };
        requestAnimationFrame(tick);
      });
    }

    const run = async () => {
      try {
        while (true) {
          showView(1, "01", "Desarrollo");
          await sleep(400);
          await typeCode();
          await sleep(1800);

          showView(2, "02", "Rendimiento");
          buildGauges();
          await sleep(600);
          await animateGauges();
          await sleep(2600);

          showView(3, "03", "Publicidad");
          const k1 = root.querySelector<HTMLElement>("#t3-k1")!;
          const k2 = root.querySelector<HTMLElement>("#t3-k2")!;
          const k3 = root.querySelector<HTMLElement>("#t3-k3")!;
          const k4 = root.querySelector<HTMLElement>("#t3-k4")!;
          k1.textContent = "0"; k2.textContent = "0"; k3.textContent = "$0"; k4.textContent = "0x";
          await sleep(500);
          await Promise.all([
            countUp(k1, 84200, "", "", 1300),
            countUp(k2, 3120, "", "", 1300),
            countUp(k3, 410, "", "$", 1300),
            countUp(k4, 4, "x", "", 1300),
          ]);
          await sleep(3400);
        }
      } catch { /* stopped */ }
    };
    run();
    return () => { stoppedRef.current = true; };
  }, [sleep]);

  function Spark({ heights }: { heights: number[] }) {
    return (
      <span className="spark">
        {heights.map((h, i) => <span key={i} style={{ height: `${h}%` }} className={h >= 72 ? "hi" : ""} />)}
      </span>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div ref={wrapRef} className="t3-wrap">
        <div ref={stageRef} className="stage">
          <div className="macbook">
            <div className="lid">
              <div className="screen">
                <div className="stagewrap">
                  <div className="phase" id="t3-phase" style={{ display: "none" }}>
                    <span className="n" id="t3-phaseN" />
                    <span className="sep" />
                    <span id="t3-phaseT" />
                  </div>
                  {/* View 1 — Code editor */}
                  <div className="view" id="t3-v1">
                    <div className="editor">
                      <div className="ed-rail">
                        <svg className="ic active" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h18M3 12h18M3 19h18" /></svg>
                        <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
                        <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 3v12M6 21a3 3 0 100-6 3 3 0 000 6zM18 9a3 3 0 100-6 3 3 0 000 6zM18 6c0 7-12 3-12 9" /></svg>
                      </div>
                      <div className="ed-tree">
                        <div className="grp">levelgrowth-web</div>
                        <div className="f"><span className="dot" style={{ background: "#4A9EE0" }} />layout.tsx</div>
                        <div className="f sel"><span className="dot" style={{ background: "#3FC87A" }} />page.tsx</div>
                        <div className="f"><span className="dot" style={{ background: "#F5BD4F" }} />globals.css</div>
                        <div className="f"><span className="dot" style={{ background: "#C792EA" }} />Hero.tsx</div>
                        <div className="f"><span className="dot" style={{ background: "#4A9EE0" }} />Cta.tsx</div>
                      </div>
                      <div className="ed-code">
                        <div className="ed-tabs">
                          <div className="ed-tab">page.tsx <span className="x">×</span></div>
                        </div>
                        <div className="code" id="t3-code" />
                      </div>
                    </div>
                  </div>
                  {/* View 2 — PageSpeed */}
                  <div className="view" id="t3-v2">
                    <div className="ps">
                      <h2 className="ps-head">Rendimiento auditado</h2>
                      <p className="ps-sub">Google PageSpeed Insights · Mobile</p>
                      <div className="ps-row" id="t3-psRow" />
                    </div>
                  </div>
                  {/* View 3 — Meta Ads */}
                  <div className="view" id="t3-v3">
                    <div className="meta">
                      <div className="meta-top">
                        <div className="meta-logo">∞</div>
                        <div className="meta-title">Administrador de anuncios</div>
                        <div className="meta-pill"><span className="live" />Campañas activas</div>
                      </div>
                      <div className="meta-body">
                        <div className="meta-kpis">
                          <div className="kpi"><div className="k">Alcance</div><div className="v up" id="t3-k1">0</div><div className="delta">▲ 38% sem.</div></div>
                          <div className="kpi"><div className="k">Clics</div><div className="v" id="t3-k2">0</div><div className="delta">▲ 21% sem.</div></div>
                          <div className="kpi"><div className="k">Costo / result.</div><div className="v" id="t3-k3">$0</div><div className="delta">▼ 32% más barato</div></div>
                          <div className="kpi"><div className="k">ROAS</div><div className="v up" id="t3-k4">0x</div><div className="delta">▲ Rentable</div></div>
                        </div>
                        <div className="camp">
                          <div className="camp-row head"><span /><span>Campaña</span><span>Resultados</span><span>CTR</span><span>Tendencia</span></div>
                          <div className="camp-row"><span className="toggle" /><span className="name">Conversiones · Web<div className="sub">CABA + GBA · 25-45</div></span><span className="cell good">142</span><span className="cell">3.8%</span><Spark heights={[30,45,40,62,78,95]} /></div>
                          <div className="camp-row"><span className="toggle" /><span className="name">Tráfico · Landing<div className="sub">Intereses: pymes</div></span><span className="cell good">2.140</span><span className="cell">2.6%</span><Spark heights={[40,55,50,68,72,88]} /></div>
                          <div className="camp-row"><span className="toggle" /><span className="name">Remarketing · 30d<div className="sub">Visitantes web</div></span><span className="cell good">86</span><span className="cell">5.1%</span><Spark heights={[50,48,64,70,85,100]} /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cursor" id="t3-cursor">
                    <svg viewBox="0 0 24 24" fill="#fff" stroke="#08110A" strokeWidth="1.5"><path d="M4 2l6 18 2.5-7L20 10.5 4 2z" /></svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="hinge" />
            <div className="base" />
          </div>
        </div>
      </div>
    </>
  );
}
