"use client";
import { useEffect, useRef, useCallback } from "react";

const CSS = `
.t4-wrap { width:100%; height:100%; position:relative; overflow:hidden; }
.t4-wrap .stage { position:absolute; top:0; left:0; width:1280px; height:800px; transform-origin:top left; }
.t4-wrap .macbook { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:1120px; }
.t4-wrap .lid {
  position:relative; width:100%; aspect-ratio:16/10;
  border-radius:22px 22px 6px 6px; background:#0a0a0c;
  padding:26px 24px 30px; box-sizing:border-box;
  box-shadow:0 50px 110px -25px rgba(0,0,0,0.75),0 24px 60px -18px rgba(63,200,122,0.08),
    inset 0 0 0 1px rgba(255,255,255,0.06),inset 0 0 0 2.5px #1a1a1c;
}
.t4-wrap .lid::before { content:""; position:absolute; top:0; left:50%; transform:translateX(-50%); width:150px; height:22px; background:#0a0a0c; border-radius:0 0 12px 12px; z-index:6; }
.t4-wrap .screen { position:relative; width:100%; height:100%; border-radius:6px; overflow:hidden; background:#080C14; }
.t4-wrap .hinge { width:100%; height:16px; margin-top:-2px; background:linear-gradient(180deg,#3a3a40,#2a2a30 50%,#1a1a20); border-radius:0 0 5px 5px; }
.t4-wrap .base { width:116%; margin-left:-8%; height:22px; background:linear-gradient(180deg,#4a4a52,#3c3c44 30%,#2a2a30); border-radius:0 0 16px 16px; box-shadow:0 30px 50px -15px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1); position:relative; }
.t4-wrap .base::after { content:""; position:absolute; top:0; left:50%; transform:translateX(-50%); width:16%; height:5px; background:#1a1a20; border-radius:0 0 6px 6px; }
.t4-wrap .toolbar {
  position:absolute; top:0; left:0; right:0; height:52px;
  display:flex; align-items:center; gap:14px; padding:0 20px;
  background:#0B1019; border-bottom:1px solid rgba(255,255,255,0.06); z-index:30;
}
.t4-wrap .lights { display:flex; gap:8px; }
.t4-wrap .lights span { width:12px; height:12px; border-radius:50%; }
.t4-wrap .lights span:nth-child(1){background:#ff5f57;} .t4-wrap .lights span:nth-child(2){background:#ffbd2e;} .t4-wrap .lights span:nth-child(3){background:#28c840;}
.t4-wrap .urlbar {
  flex:1; max-width:560px; margin:0 auto; height:30px; border-radius:8px;
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.06);
  display:flex; align-items:center; gap:10px; padding:0 14px;
  font-family:var(--font-mono); font-size:13px; color:var(--lg-text-secondary);
}
.t4-wrap .urlbar .tool-ico { width:16px; height:16px; border-radius:4px; flex:0 0 auto; }
.t4-wrap .urlbar .tool-name { color:#fff; transition:opacity .3s; }
.t4-wrap .urlbar .tool-path { color:var(--lg-text-muted); }
.t4-wrap .stagewrap { position:absolute; inset:52px 0 0 0; }
.t4-wrap .view { position:absolute; inset:0; opacity:0; transition:opacity .5s ease; pointer-events:none; }
.t4-wrap .view.on { opacity:1; }
/* heatmap */
.t4-wrap .heat { position:absolute; inset:0; background:#0E1320; display:flex; }
.t4-wrap .heat-side { width:230px; border-right:1px solid rgba(255,255,255,0.06); padding:22px 18px; background:#0B1019; }
.t4-wrap .heat-side .lbl { font-family:var(--font-mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--lg-text-muted); margin-bottom:14px; }
.t4-wrap .heat-stat { margin-bottom:22px; }
.t4-wrap .heat-stat .v { font-family:var(--font-mono); font-weight:700; font-size:30px; color:#fff; }
.t4-wrap .heat-stat .k { font-family:var(--font-body); font-size:12px; color:var(--lg-text-secondary); margin-top:2px; }
.t4-wrap .heat-legend { display:flex; align-items:center; gap:8px; margin-top:26px; font-family:var(--font-mono); font-size:10px; color:var(--lg-text-muted); }
.t4-wrap .heat-legend .bar { flex:1; height:8px; border-radius:4px; background:linear-gradient(90deg,#E2483D,#F5BD4F,#3FC87A,#4A9EE0,#6C5CE7); }
.t4-wrap .heat-canvas { flex:1; position:relative; overflow:hidden; padding:30px 40px; }
.t4-wrap .ml { position:absolute; inset:30px 40px; background:#111626; border-radius:10px; border:1px solid rgba(255,255,255,0.06); overflow:hidden; }
.t4-wrap .ml-nav { height:44px; display:flex; align-items:center; justify-content:space-between; padding:0 22px; border-bottom:1px solid rgba(255,255,255,0.05); }
.t4-wrap .ml-logo { font-family:var(--font-display); font-weight:700; font-size:15px; color:#fff; }
.t4-wrap .ml-logo span { color:var(--lg-green); }
.t4-wrap .ml-nav .links { display:flex; gap:16px; }
.t4-wrap .ml-nav .links i { width:42px; height:7px; border-radius:3px; background:rgba(255,255,255,0.12); display:block; }
.t4-wrap .ml-hero { padding:50px 60px; text-align:center; }
.t4-wrap .ml-h1 { height:22px; width:70%; margin:0 auto 14px; border-radius:5px; background:rgba(255,255,255,0.16); }
.t4-wrap .ml-h2 { height:22px; width:50%; margin:0 auto 28px; border-radius:5px; background:rgba(255,255,255,0.16); }
.t4-wrap .ml-cta { height:40px; width:200px; margin:0 auto; border-radius:8px; background:rgba(63,200,122,0.25); border:1px solid rgba(63,200,122,0.4); }
.t4-wrap .ml-rows { padding:36px 60px; display:flex; flex-direction:column; gap:14px; }
.t4-wrap .ml-rows i { height:12px; border-radius:4px; background:rgba(255,255,255,0.07); display:block; }
.t4-wrap .ml-rows i:nth-child(1){width:90%;} .t4-wrap .ml-rows i:nth-child(2){width:80%;} .t4-wrap .ml-rows i:nth-child(3){width:86%;}
.t4-wrap .blob { position:absolute; border-radius:50%; filter:blur(22px); pointer-events:none; opacity:0; transition:opacity 1s ease; }
.t4-wrap .blob.show { opacity:1; }
.t4-wrap .blob.hot   { background:radial-gradient(circle,rgba(226,72,61,0.85) 0%,rgba(245,189,79,0.4) 50%,transparent 75%); }
.t4-wrap .blob.warm  { background:radial-gradient(circle,rgba(245,189,79,0.6) 0%,transparent 70%); }
.t4-wrap .blob.cold  { background:radial-gradient(circle,rgba(74,158,224,0.4) 0%,transparent 70%); }
.t4-wrap .tooltip {
  position:absolute; z-index:25; background:#fff; color:#0A0E17;
  font-family:var(--font-mono); font-size:13px; font-weight:600;
  padding:8px 14px; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.4);
  opacity:0; transform:translateY(6px); transition:opacity .3s,transform .3s; white-space:nowrap;
}
.t4-wrap .tooltip::after { content:""; position:absolute; bottom:-5px; left:24px; width:10px; height:10px; background:#fff; transform:rotate(45deg); }
.t4-wrap .tooltip.show { opacity:1; transform:translateY(0); }
/* A/B */
.t4-wrap .ab { position:absolute; inset:0; background:#0A0E17; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 70px; gap:34px; }
.t4-wrap .ab-title { font-family:var(--font-display); font-weight:700; font-size:26px; letter-spacing:-0.02em; }
.t4-wrap .ab-row { display:flex; gap:36px; }
.t4-wrap .ab-card { width:340px; border-radius:18px; overflow:hidden; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); transition:border-color .4s,box-shadow .4s,transform .4s; }
.t4-wrap .ab-card .thumb { height:170px; position:relative; display:flex; align-items:center; justify-content:center; }
.t4-wrap .ab-card.a .thumb { background:linear-gradient(135deg,#2A3140,#1A1F2E); }
.t4-wrap .ab-card.b .thumb { background:linear-gradient(135deg,#14342A,#0E2118); }
.t4-wrap .ab-card .thumb .tag { position:absolute; top:14px; left:14px; font-family:var(--font-mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:#fff; background:rgba(0,0,0,0.4); padding:5px 10px; border-radius:6px; }
.t4-wrap .ab-card .thumb .mock-ad { width:78%; }
.t4-wrap .ab-card .thumb .mock-ad .l { height:10px; border-radius:3px; background:rgba(255,255,255,0.2); margin-bottom:8px; }
.t4-wrap .ab-card .thumb .mock-ad .l.t { width:80%; height:14px; background:rgba(255,255,255,0.32); }
.t4-wrap .ab-card .thumb .mock-ad .btn { margin-top:14px; height:26px; width:120px; border-radius:6px; background:rgba(63,200,122,0.3); border:1px solid rgba(63,200,122,0.5); }
.t4-wrap .ab-card .stats { padding:20px 22px; display:flex; justify-content:space-between; }
.t4-wrap .ab-stat .v { font-family:var(--font-mono); font-weight:700; font-size:26px; color:#fff; }
.t4-wrap .ab-stat .v.good { color:#3FC87A; }
.t4-wrap .ab-stat .k { font-family:var(--font-mono); font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--lg-text-muted); margin-top:4px; }
.t4-wrap .ab-card.win { border-color:rgba(63,200,122,0.5); box-shadow:0 0 50px rgba(63,200,122,0.18); transform:translateY(-6px); }
.t4-wrap .ab-card .winbadge { opacity:0; transition:opacity .4s; text-align:center; padding:0 0 16px; font-family:var(--font-mono); font-size:12px; letter-spacing:.16em; text-transform:uppercase; color:#3FC87A; }
.t4-wrap .ab-card.win .winbadge { opacity:1; }
.t4-wrap .applied { opacity:0; transform:scale(0.8); transition:opacity .4s,transform .4s; display:inline-flex; align-items:center; gap:10px; font-family:var(--font-body); font-weight:600; font-size:17px; color:#fff; background:linear-gradient(135deg,#3FC87A,#2BA86A); padding:13px 26px; border-radius:12px; box-shadow:0 12px 36px -10px rgba(63,200,122,0.5); }
.t4-wrap .applied.show { opacity:1; transform:scale(1); }
/* opt list */
.t4-wrap .opt { position:absolute; inset:0; background:radial-gradient(ellipse at 80% 90%,rgba(20,90,50,0.22) 0%,transparent 55%),#080C14; padding:54px 90px; display:flex; flex-direction:column; }
.t4-wrap .opt-head { font-family:var(--font-display); font-weight:700; font-size:30px; letter-spacing:-0.02em; margin:0 0 30px; }
.t4-wrap .opt-list { display:flex; flex-direction:column; gap:14px; }
.t4-wrap .opt-item { display:flex; align-items:center; gap:18px; padding:16px 22px; border-radius:12px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); opacity:0; transform:translateX(-12px); transition:opacity .45s ease,transform .45s ease; }
.t4-wrap .opt-item.show { opacity:1; transform:translateX(0); }
.t4-wrap .opt-item .check { width:30px; height:30px; border-radius:50%; flex:0 0 auto; background:rgba(63,200,122,0.14); border:1px solid rgba(63,200,122,0.4); display:flex; align-items:center; justify-content:center; color:#3FC87A; }
.t4-wrap .opt-item .check svg { width:16px; height:16px; }
.t4-wrap .opt-item.next .check { background:rgba(74,158,224,0.12); border-color:rgba(74,158,224,0.4); color:#4A9EE0; }
.t4-wrap .opt-item .txt { font-family:var(--font-body); font-size:18px; color:#fff; flex:1; }
.t4-wrap .opt-item.next .txt { color:var(--lg-text-secondary); }
.t4-wrap .opt-item .gain { font-family:var(--font-mono); font-weight:600; font-size:16px; color:#3FC87A; }
.t4-wrap .opt-total { margin-top:auto; display:flex; align-items:center; gap:14px; padding-top:26px; border-top:1px solid rgba(255,255,255,0.08); opacity:0; transform:translateY(10px); transition:opacity .5s,transform .5s; }
.t4-wrap .opt-total.show { opacity:1; transform:translateY(0); }
.t4-wrap .opt-total .dot { width:9px; height:9px; border-radius:50%; background:#3FC87A; box-shadow:0 0 0 4px rgba(63,200,122,0.18); flex:0 0 auto; }
.t4-wrap .opt-total .l { font-family:var(--font-body); font-size:19px; color:#fff; font-weight:500; }
.t4-wrap .opt-total .l span { color:var(--lg-text-secondary); font-weight:400; }
.t4-wrap .cursor { position:absolute; z-index:60; width:26px; height:26px; pointer-events:none; left:700px; top:400px; opacity:0; transition:left .9s cubic-bezier(0.4,0,0.2,1),top .9s cubic-bezier(0.4,0,0.2,1),opacity .3s; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
.t4-wrap .cursor svg { width:100%; height:100%; }
`;

export function MetodoTab4({ isActive }: { isActive: boolean }) {
  const wrapRef    = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const stageEl = el.querySelector<HTMLElement>(".stage")!;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      stageEl.style.transform = `scale(${Math.min(width / 1280, height / 800)})`;
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    stoppedRef.current = false;
    const root = wrapRef.current;
    if (!root) return;

    const views: Record<number, HTMLElement> = {
      1: root.querySelector("#t4-v1")!,
      2: root.querySelector("#t4-v2")!,
      3: root.querySelector("#t4-v3")!,
    };
    const cursor   = root.querySelector<HTMLElement>("#t4-cursor")!;
    const toolIco  = root.querySelector<HTMLElement>("#t4-toolIco")!;
    const toolName = root.querySelector<HTMLElement>("#t4-toolName")!;
    const toolPath = root.querySelector<HTMLElement>("#t4-toolPath")!;

    function setView(n: number) {
      Object.values(views).forEach(v => v.classList.remove("on"));
      views[n].classList.add("on");
    }
    function setTool(ico: string, name: string, path: string) {
      toolName.style.opacity = "0"; toolPath.style.opacity = "0";
      setTimeout(() => {
        toolIco.style.background = ico;
        toolName.textContent = name;
        toolPath.textContent = path;
        toolName.style.opacity = "1";
        toolPath.style.opacity = "1";
      }, 280);
    }
    function moveCursor(x: number, y: number) {
      cursor.style.opacity = "1";
      cursor.style.left = x + "px";
      cursor.style.top = y + "px";
    }

    const run = async () => {
      try {
        while (true) {
          /* Scene 1 — Heatmap */
          setTool("linear-gradient(135deg,#6C5CE7,#4A9EE0)", "Microsoft Clarity", "· mapa de calor");
          setView(1);
          root.querySelectorAll<HTMLElement>("#t4-v1 .blob").forEach(b => b.classList.remove("show"));
          root.querySelector<HTMLElement>("#t4-tip")!.classList.remove("show");
          moveCursor(760, 460);
          await sleep(500);
          root.querySelectorAll<HTMLElement>("#t4-v1 .blob").forEach((b, i) =>
            setTimeout(() => b.classList.add("show"), i * 220)
          );
          await sleep(1100);
          moveCursor(560, 360);
          await sleep(900);
          const tip = root.querySelector<HTMLElement>("#t4-tip")!;
          tip.style.left = "430px"; tip.style.top = "300px";
          tip.classList.add("show");
          await sleep(2200);
          tip.classList.remove("show");
          await sleep(500);

          /* Scene 2 — A/B */
          setTool("linear-gradient(135deg,#4A9EE0,#1877F2)", "Meta Ads Manager", "· test de creativos");
          setView(2);
          root.querySelector<HTMLElement>("#t4-cardA")!.classList.remove("win");
          root.querySelector<HTMLElement>("#t4-cardB")!.classList.remove("win");
          root.querySelector<HTMLElement>("#t4-applied")!.classList.remove("show");
          cursor.style.opacity = "0";
          await sleep(700);
          moveCursor(560, 340);
          await sleep(400);
          root.querySelector<HTMLElement>("#t4-cardB")!.classList.add("win");
          await sleep(1400);
          moveCursor(610, 600);
          await sleep(800);
          root.querySelector<HTMLElement>("#t4-applied")!.classList.add("show");
          await sleep(2400);
          cursor.style.opacity = "0";

          /* Scene 3 — Opt list */
          setTool("linear-gradient(135deg,#3FC87A,#2BA86A)", "Level Growth", "· reporte semanal");
          setView(3);
          const items = root.querySelectorAll<HTMLElement>("#t4-optList .opt-item");
          const total = root.querySelector<HTMLElement>("#t4-optTotal")!;
          items.forEach(it => it.classList.remove("show"));
          total.classList.remove("show");
          await sleep(500);
          for (let i = 0; i < items.length; i++) { items[i].classList.add("show"); await sleep(620); }
          await sleep(400);
          total.classList.add("show");
          await sleep(3200);
        }
      } catch { /* stopped */ }
    };
    run();
    return () => { stoppedRef.current = true; };
  }, [sleep]);

  const chk = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
  const arrow = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div ref={wrapRef} className="t4-wrap">
        <div className="stage">
          <div className="macbook">
            <div className="lid">
              <div className="screen">
                <div className="toolbar">
                  <div className="lights"><span /><span /><span /></div>
                  <div className="urlbar">
                    <span className="tool-ico" id="t4-toolIco" style={{ background: "linear-gradient(135deg,#6C5CE7,#4A9EE0)" }} />
                    <span className="tool-name" id="t4-toolName">Microsoft Clarity</span>
                    <span className="tool-path" id="t4-toolPath">· mapa de calor</span>
                  </div>
                </div>
                <div className="stagewrap">
                  {/* View 1 — Heatmap */}
                  <div className="view" id="t4-v1">
                    <div className="heat">
                      <div className="heat-side">
                        <div className="lbl">Sesiones · 7 días</div>
                        <div className="heat-stat"><div className="v">3.842</div><div className="k">Sesiones grabadas</div></div>
                        <div className="heat-stat"><div className="v" style={{ color: "#3FC87A" }}>18.2%</div><div className="k">CTR en el héroe</div></div>
                        <div className="heat-stat"><div className="v">42s</div><div className="k">Tiempo medio</div></div>
                        <div className="heat-legend"><span>+</span><span className="bar" /><span>−</span></div>
                      </div>
                      <div className="heat-canvas">
                        <div className="ml">
                          <div className="ml-nav">
                            <div className="ml-logo">Level<span>Growth</span></div>
                            <div className="links"><i /><i /><i /></div>
                          </div>
                          <div className="ml-hero">
                            <div className="ml-h1" />
                            <div className="ml-h2" />
                            <div className="ml-cta" />
                          </div>
                          <div className="ml-rows"><i /><i /><i /></div>
                        </div>
                        <div className="blob hot" style={{ width: "240px", height: "130px", left: "50%", top: "300px", transform: "translateX(-50%)" }} />
                        <div className="blob hot" style={{ width: "300px", height: "120px", left: "50%", top: "175px", transform: "translateX(-50%)" }} />
                        <div className="blob warm" style={{ width: "200px", height: "90px", right: "70px", top: "55px" }} />
                        <div className="blob cold" style={{ width: "280px", height: "120px", left: "50%", top: "430px", transform: "translateX(-50%)" }} />
                        <div className="tooltip" id="t4-tip">1.247 clicks · 18.2% CTR</div>
                      </div>
                    </div>
                  </div>
                  {/* View 2 — A/B */}
                  <div className="view" id="t4-v2">
                    <div className="ab">
                      <div className="ab-title">Test A/B · Creativos</div>
                      <div className="ab-row">
                        <div className="ab-card a" id="t4-cardA">
                          <div className="thumb">
                            <span className="tag">Creativo A</span>
                            <div className="mock-ad"><div className="l t" /><div className="l" style={{ width: "60%" }} /><div className="btn" /></div>
                          </div>
                          <div className="stats">
                            <div className="ab-stat"><div className="v">2.1%</div><div className="k">CTR</div></div>
                            <div className="ab-stat"><div className="v">0.43</div><div className="k">USD · CPL</div></div>
                          </div>
                          <div className="winbadge">—</div>
                        </div>
                        <div className="ab-card b" id="t4-cardB">
                          <div className="thumb">
                            <span className="tag">Creativo B</span>
                            <div className="mock-ad"><div className="l t" /><div className="l" style={{ width: "70%" }} /><div className="btn" /></div>
                          </div>
                          <div className="stats">
                            <div className="ab-stat"><div className="v good">3.4%</div><div className="k">CTR</div></div>
                            <div className="ab-stat"><div className="v good">0.28</div><div className="k">USD · CPL</div></div>
                          </div>
                          <div className="winbadge">✓ Ganador</div>
                        </div>
                      </div>
                      <span className="applied" id="t4-applied">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        Pausar A · Escalar B
                      </span>
                    </div>
                  </div>
                  {/* View 3 — Opt list */}
                  <div className="view" id="t4-v3">
                    <div className="opt">
                      <h2 className="opt-head">Optimizaciones aplicadas esta semana</h2>
                      <div className="opt-list" id="t4-optList">
                        <div className="opt-item"><span className="check">{chk}</span><span className="txt">Etiquetas de accesibilidad</span><span className="gain">+15%</span></div>
                        <div className="opt-item"><span className="check">{chk}</span><span className="txt">CTA optimizado</span><span className="gain">+18%</span></div>
                        <div className="opt-item"><span className="check">{chk}</span><span className="txt">Pruebas sociales agregadas</span><span className="gain">+20%</span></div>
                        <div className="opt-item"><span className="check">{chk}</span><span className="txt">Producción de creativos</span><span className="gain">+34%</span></div>
                        <div className="opt-item next"><span className="check">{arrow}</span><span className="txt">Próximo: Test de headline en página de precios</span></div>
                      </div>
                      <div className="opt-total" id="t4-optTotal">
                        <span className="dot" />
                        <span className="l">Mejora continua, <span>cada semana.</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="cursor" id="t4-cursor">
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
