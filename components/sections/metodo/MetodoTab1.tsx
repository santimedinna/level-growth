"use client";
import { useEffect, useRef, useCallback } from "react";

const CSS = `
.t1-wrap { width:100%; height:100%; position:relative; overflow:hidden; }
.t1-wrap .stage {
  position:absolute; top:0; left:0;
  width:1280px; height:800px;
  transform-origin:top left;
}
.t1-wrap .browser {
  position:absolute; inset:0; border-radius:18px; overflow:hidden;
  background:#0A0E17; border:1px solid rgba(255,255,255,0.08);
  box-shadow:0 40px 100px -20px rgba(0,0,0,0.7),0 20px 60px -10px rgba(63,200,122,0.08),inset 0 0 0 1px rgba(255,255,255,0.02);
  display:flex; flex-direction:column;
}
.t1-wrap .bar {
  height:56px; display:flex; align-items:center; gap:10px; padding:0 22px;
  border-bottom:1px solid rgba(255,255,255,0.06);
  background:linear-gradient(180deg,rgba(255,255,255,0.025) 0%,transparent 100%);
  flex:0 0 auto;
}
.t1-wrap .dots { display:inline-flex; gap:9px; }
.t1-wrap .dots span { width:14px; height:14px; border-radius:999px; }
.t1-wrap .dots span:nth-child(1){background:#EF5F57;}
.t1-wrap .dots span:nth-child(2){background:#F5BD4F;}
.t1-wrap .dots span:nth-child(3){background:#3FC87A;}
.t1-wrap .addr {
  margin-left:16px; flex:1; max-width:560px; height:32px;
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.05);
  border-radius:8px; display:flex; align-items:center; padding:0 16px;
  font-family:var(--font-mono); font-size:14px; color:var(--lg-text-muted); gap:10px;
}
.t1-wrap .addr .lock { color:var(--lg-green); font-size:11px; }
.t1-wrap .viewport {
  flex:1; position:relative; overflow:hidden;
  background:radial-gradient(ellipse at 25% 15%,rgba(13,31,74,0.4) 0%,transparent 55%),
    radial-gradient(ellipse at 80% 85%,rgba(20,90,50,0.28) 0%,transparent 55%),#080C14;
}
.t1-wrap .cursor {
  position:absolute; z-index:50; width:26px; height:26px; pointer-events:none;
  left:640px; top:420px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5)); transition:none;
}
.t1-wrap .cursor svg { width:100%; height:100%; display:block; }
.t1-wrap .cursor.click::after {
  content:""; position:absolute; top:-8px; left:-8px; width:30px; height:30px;
  border-radius:50%; border:2px solid var(--lg-green); animation:t1-ripple 0.5s ease-out;
}
@keyframes t1-ripple { from{transform:scale(0.3);opacity:1;} to{transform:scale(1.6);opacity:0;} }
.t1-wrap .screen {
  position:absolute; inset:0; display:flex; flex-direction:column;
  align-items:center; justify-content:center; padding:0 80px;
  opacity:0; pointer-events:none; transition:opacity 0.4s ease;
}
.t1-wrap .screen.on { opacity:1; }
.t1-wrap .s-eyebrow {
  font-family:var(--font-mono); font-size:13px; letter-spacing:0.2em;
  text-transform:uppercase; color:var(--lg-green);
  border:1px solid rgba(63,200,122,0.3); border-radius:999px;
  padding:7px 16px; margin-bottom:28px;
}
.t1-wrap .s1-title {
  font-family:var(--font-display); font-weight:700; font-size:52px;
  line-height:1.04; letter-spacing:-0.025em; text-align:center; margin:0 0 14px;
}
.t1-wrap .s1-title .grad {
  background:linear-gradient(92deg,#3FC87A 0%,#4A9EE0 80%);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.t1-wrap .s1-sub {
  font-family:var(--font-body); font-size:19px; color:var(--lg-text-secondary);
  text-align:center; margin:0 0 44px; max-width:600px; line-height:1.5;
}
.t1-wrap .input-row { display:flex; gap:14px; width:100%; max-width:720px; }
.t1-wrap .url-field {
  flex:1; height:68px; background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.1); border-radius:12px;
  display:flex; align-items:center; padding:0 24px;
  font-family:var(--font-body); font-size:22px; color:#fff; transition:border-color 0.2s;
}
.t1-wrap .url-field.focus { border-color:rgba(63,200,122,0.5); box-shadow:0 0 0 3px rgba(63,200,122,0.1); }
.t1-wrap .url-field .placeholder { color:rgba(255,255,255,0.3); }
.t1-wrap .url-field .typed { color:#fff; }
.t1-wrap .url-field .caret {
  display:inline-block; width:2px; height:26px; background:var(--lg-green);
  margin-left:2px; animation:t1-blink 1s steps(2) infinite;
}
@keyframes t1-blink { 50%{opacity:0;} }
.t1-wrap .analyze-btn {
  flex:0 0 auto; padding:0 32px; border-radius:12px;
  background:linear-gradient(135deg,#3FC87A 0%,#2BA86A 55%,#1a7a4e 100%);
  color:#fff; font-family:var(--font-body); font-weight:600; font-size:19px;
  display:flex; align-items:center;
  box-shadow:0 0 0 1px rgba(63,200,122,0.4) inset,0 12px 30px -10px rgba(63,200,122,0.5);
  transition:transform 0.15s,filter 0.15s;
}
.t1-wrap .analyze-btn.press { transform:scale(0.96); filter:brightness(0.95); }
.t1-wrap .spinner-wrap { position:relative; width:90px; height:90px; margin-bottom:40px; }
.t1-wrap .spinner { width:90px; height:90px; animation:t1-spin 1.1s steps(12) infinite; }
.t1-wrap .spinner .b {
  position:absolute; top:6px; left:50%; width:7px; height:22px; margin-left:-3.5px;
  border-radius:4px; background:var(--lg-green); transform-origin:3.5px 39px;
}
@keyframes t1-spin { to{transform:rotate(360deg);} }
.t1-wrap .load-steps { display:flex; flex-direction:column; gap:16px; }
.t1-wrap .load-step {
  display:flex; align-items:center; gap:14px;
  font-family:var(--font-body); font-size:20px; color:var(--lg-text-muted); transition:color 0.3s;
}
.t1-wrap .load-step .dot {
  width:10px; height:10px; border-radius:50%;
  border:2px solid var(--lg-text-muted); transition:all 0.3s;
}
.t1-wrap .load-step.done { color:#fff; }
.t1-wrap .load-step.done .dot { background:var(--lg-green); border-color:var(--lg-green); }
.t1-wrap .results { width:100%; max-width:920px; }
.t1-wrap .res-head { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:22px; }
.t1-wrap .res-head .url-label { font-family:var(--font-body); font-size:18px; color:var(--lg-text-secondary); }
.t1-wrap .res-head .url-label b { color:#fff; font-weight:600; }
.t1-wrap .res-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:18px; }
.t1-wrap .res-card {
  background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07);
  border-radius:14px; padding:20px 24px; opacity:0; transform:translateY(12px);
}
.t1-wrap .res-card.in { animation:t1-cardIn 0.4s ease-out forwards; }
@keyframes t1-cardIn { to{opacity:1;transform:translateY(0);} }
.t1-wrap .res-card .lbl {
  font-family:var(--font-mono); font-size:11px; letter-spacing:0.16em;
  text-transform:uppercase; color:var(--lg-text-muted); margin-bottom:8px;
}
.t1-wrap .res-card .score { font-family:var(--font-mono); font-weight:700; font-size:38px; line-height:1; }
.t1-wrap .res-card .score .max { font-size:18px; color:var(--lg-text-muted); }
.t1-wrap .res-card .score.good{color:#3FC87A;} .t1-wrap .res-card .score.warn{color:#F5BD4F;} .t1-wrap .res-card .score.bad{color:#EF5F57;}
.t1-wrap .res-overall {
  background:linear-gradient(135deg,rgba(13,31,74,0.5),rgba(20,90,50,0.3));
  border:1px solid rgba(63,200,122,0.25); border-radius:16px; padding:24px 28px;
  display:flex; align-items:center; justify-content:space-between;
  opacity:0; transform:translateY(12px);
}
.t1-wrap .res-overall.in { animation:t1-cardIn 0.4s 0.3s ease-out forwards; }
.t1-wrap .res-overall .big { font-family:var(--font-mono); font-weight:700; font-size:56px; line-height:1; color:#3FC87A; }
.t1-wrap .res-overall .big .max { font-size:22px; color:var(--lg-text-muted); }
.t1-wrap .res-overall .label { font-family:var(--font-mono); font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--lg-text-muted); }
.t1-wrap .res-cta {
  padding:16px 30px; border-radius:12px;
  background:linear-gradient(135deg,#3FC87A 0%,#2BA86A 55%,#1a7a4e 100%);
  color:#fff; font-family:var(--font-body); font-weight:600; font-size:18px;
  display:inline-flex; align-items:center; gap:10px;
}
.t1-wrap .wa-card {
  width:560px; height:540px; background:#0B141A; border-radius:20px; overflow:hidden;
  display:flex; flex-direction:column;
  border:1px solid rgba(255,255,255,0.08);
  box-shadow:0 40px 90px -25px rgba(0,0,0,0.6),inset 0 0 0 1px rgba(255,255,255,0.02);
}
.t1-wrap .wa-top {
  background:#1F2C33; padding:16px 22px;
  display:flex; align-items:center; gap:14px; flex:0 0 auto;
}
.t1-wrap .wa-avatar {
  width:48px; height:48px; border-radius:50%; background:#0A0E17;
  display:flex; align-items:center; justify-content:center; flex:0 0 auto;
  border:1px solid rgba(63,200,122,0.25);
}
.t1-wrap .wa-name { font-family:var(--font-body); font-weight:600; font-size:18px; color:#fff; }
.t1-wrap .wa-status { font-family:var(--font-body); font-size:13px; color:#3FC87A; margin-top:2px; }
.t1-wrap .wa-body {
  flex:1; background:#0B141A; padding:26px 22px;
  display:flex; flex-direction:column; gap:14px; justify-content:flex-end;
}
.t1-wrap .wa-msg {
  max-width:78%; padding:13px 17px; border-radius:16px;
  font-family:var(--font-body); font-size:17px; line-height:1.4;
  opacity:0; transform:translateY(10px);
}
.t1-wrap .wa-msg.in { animation:t1-cardIn 0.4s ease-out forwards; }
.t1-wrap .wa-msg.sent { align-self:flex-end; background:#144D37; color:#E8F5EE; border-bottom-right-radius:5px; }
.t1-wrap .wa-msg.recv { align-self:flex-start; background:#1F2C33; color:#E8F5EE; border-bottom-left-radius:5px; }
.t1-wrap .wa-msg .time { display:block; font-size:11px; color:rgba(255,255,255,0.45); text-align:right; margin-top:5px; }
.t1-wrap .wa-input { background:#1F2C33; padding:14px 18px; display:flex; align-items:center; gap:12px; flex:0 0 auto; }
.t1-wrap .wa-input .field {
  flex:1; height:42px; background:#2A3942; border-radius:21px;
  display:flex; align-items:center; padding:0 18px;
  font-family:var(--font-body); font-size:15px; color:#8FA0A8;
}
.t1-wrap .wa-input .send {
  width:42px; height:42px; border-radius:50%; background:#3FC87A;
  display:flex; align-items:center; justify-content:center; flex:0 0 auto;
}
`;

const URL_TEXT = "miempresa.com";

export function MetodoTab1({ isActive }: { isActive: boolean }) {
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

  /* Animation loop */
  useEffect(() => {
    stoppedRef.current = false;
    const root = wrapRef.current;
    if (!root) return;

    /* Build spinner bars */
    const spinner = root.querySelector<HTMLElement>(".spinner")!;
    spinner.innerHTML = "";
    for (let i = 0; i < 12; i++) {
      const b = document.createElement("div");
      b.className = "b";
      b.style.transform = `rotate(${i * 30}deg)`;
      b.style.opacity = (1 - i * 0.07).toFixed(2);
      spinner.appendChild(b);
    }

    const cursor   = root.querySelector<HTMLElement>(".cursor")!;
    const viewport = root.querySelector<HTMLElement>(".viewport")!;
    const screens: Record<number, HTMLElement> = {
      1: root.querySelector("#t1-s1")!,
      2: root.querySelector("#t1-s2")!,
      3: root.querySelector("#t1-s3")!,
      4: root.querySelector("#t1-s4")!,
    };

    function showScreen(n: number) {
      Object.values(screens).forEach(s => s.classList.remove("on"));
      screens[n].classList.add("on");
    }
    function centerOf(el: HTMLElement) {
      let x = 0, y = 0, node: HTMLElement | null = el;
      while (node && node !== viewport) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
      return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 };
    }
    function moveCursor(x: number, y: number, ms = 700) {
      cursor.style.transition = `left ${ms}ms cubic-bezier(0.4,0,0.2,1),top ${ms}ms cubic-bezier(0.4,0,0.2,1)`;
      cursor.style.left = (x - 3) + "px";
      cursor.style.top  = (y - 2) + "px";
    }
    async function moveTo(el: HTMLElement, ms = 700) {
      const c = centerOf(el);
      moveCursor(c.x, c.y, ms);
      await sleep(ms + 60);
    }
    function clickFx() {
      cursor.classList.add("click");
      setTimeout(() => cursor.classList.remove("click"), 500);
    }

    const run = async () => {
      try {
        while (true) {
          /* Screen 1 — input */
          showScreen(1);
          const typed    = root.querySelector<HTMLElement>("#t1-typed")!;
          const ph       = root.querySelector<HTMLElement>("#t1-ph")!;
          const caret    = root.querySelector<HTMLElement>("#t1-caret")!;
          const urlField = root.querySelector<HTMLElement>("#t1-urlField")!;
          const analyzeBtn = root.querySelector<HTMLElement>("#t1-analyzeBtn")!;
          typed.textContent = "";
          ph.style.display = "";
          caret.style.display = "none";
          urlField.classList.remove("focus");
          analyzeBtn.classList.remove("press");
          cursor.style.opacity = "1";
          moveCursor(680, 520, 0);
          await sleep(600);

          await moveTo(urlField, 700);
          clickFx();
          urlField.classList.add("focus");
          ph.style.display = "none";
          caret.style.display = "inline-block";
          await sleep(400);

          for (let i = 0; i < URL_TEXT.length; i++) {
            typed.textContent += URL_TEXT[i];
            await sleep(85);
          }
          await sleep(500);

          await moveTo(analyzeBtn, 600);
          clickFx();
          analyzeBtn.classList.add("press");
          await sleep(200);
          analyzeBtn.classList.remove("press");
          cursor.style.opacity = "0";
          await sleep(300);

          /* Screen 2 — loading */
          showScreen(2);
          const steps = root.querySelectorAll<HTMLElement>("#t1-s2 .load-step");
          steps.forEach(s => s.classList.remove("done"));
          await sleep(500);
          for (const s of Array.from(steps)) { s.classList.add("done"); await sleep(620); }
          await sleep(500);

          /* Screen 3 — results */
          showScreen(3);
          const cards   = root.querySelectorAll<HTMLElement>("#t1-s3 .res-card");
          const overall = root.querySelector<HTMLElement>("#t1-overall")!;
          cards.forEach(c => c.classList.remove("in"));
          overall.classList.remove("in");
          await sleep(100);
          cards.forEach((c, i) => { c.style.animationDelay = (i * 0.12) + "s"; c.classList.add("in"); });
          overall.classList.add("in");
          await sleep(2600);

          cursor.style.opacity = "1";
          await moveTo(root.querySelector<HTMLElement>("#t1-s3 .res-cta")!, 700);
          clickFx();
          await sleep(400);
          cursor.style.opacity = "0";
          await sleep(300);

          /* Screen 4 — WhatsApp */
          showScreen(4);
          const msgs = root.querySelectorAll<HTMLElement>("#t1-s4 .wa-msg");
          msgs.forEach(m => m.classList.remove("in"));
          await sleep(400);
          msgs[0].classList.add("in");
          await sleep(1100);
          msgs[1].classList.add("in");
          await sleep(3000);
        }
      } catch { /* stopped */ }
    };
    run();
    return () => { stoppedRef.current = true; };
  }, [sleep]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div ref={wrapRef} className="t1-wrap">
        <div ref={stageRef} className="stage">
          <div className="browser">
            <div className="bar">
              <div className="dots"><span /><span /><span /></div>
              <div className="addr">
                <span className="lock">🔒</span>
                <span id="t1-addrText">levelgrowthagency.com/auditoria-web-gratis</span>
              </div>
            </div>
            <div className="viewport">
              {/* Screen 1 — input */}
              <div className="screen" id="t1-s1">
                <span className="s-eyebrow">Herramienta gratuita</span>
                <h2 className="s1-title">Descubrí dónde tu sitio<br /><span className="grad">pierde clientes</span></h2>
                <p className="s1-sub">Ingresá la URL de tu sitio y en menos de 60 segundos te mostramos qué frena tus ventas.</p>
                <div className="input-row">
                  <div className="url-field" id="t1-urlField">
                    <span className="placeholder" id="t1-ph">tuempresa.com</span>
                    <span className="typed" id="t1-typed" />
                    <span className="caret" id="t1-caret" style={{ display: "none" }} />
                  </div>
                  <div className="analyze-btn" id="t1-analyzeBtn">Analizar mi sitio gratis</div>
                </div>
              </div>
              {/* Screen 2 — loading */}
              <div className="screen" id="t1-s2">
                <div className="spinner-wrap"><div className="spinner" /></div>
                <div className="load-steps">
                  <div className="load-step"><span className="dot" />Midiendo velocidad de carga</div>
                  <div className="load-step"><span className="dot" />Analizando copy y SEO</div>
                  <div className="load-step"><span className="dot" />Revisando CTAs y fricción</div>
                </div>
              </div>
              {/* Screen 3 — results */}
              <div className="screen" id="t1-s3">
                <div className="results">
                  <div className="res-head">
                    <span className="url-label">Análisis de <b>miempresa.com</b></span>
                  </div>
                  <div className="res-grid">
                    <div className="res-card" data-d="0"><div className="lbl">Velocidad</div><div className="score good">9<span className="max">/10</span></div></div>
                    <div className="res-card" data-d="1"><div className="lbl">SEO</div><div className="score good">8<span className="max">/10</span></div></div>
                    <div className="res-card" data-d="2"><div className="lbl">Mensaje</div><div className="score warn">6<span className="max">/10</span></div></div>
                    <div className="res-card" data-d="3"><div className="lbl">Llamadas a la acción</div><div className="score bad">4<span className="max">/10</span></div></div>
                  </div>
                  <div className="res-overall" id="t1-overall">
                    <div>
                      <div className="label">Puntaje general</div>
                      <div className="big">67<span className="max">/100</span></div>
                    </div>
                    <div className="res-cta">Quiero recuperar esos clientes →</div>
                  </div>
                </div>
              </div>
              {/* Screen 4 — WhatsApp */}
              <div className="screen" id="t1-s4">
                <div className="wa-card">
                  <div className="wa-top">
                    <div className="wa-avatar">
                      <svg viewBox="0 0 80 80" width="30" height="30">
                        <defs><linearGradient id="t1-avg" x1="0" y1="80" x2="80" y2="0"><stop offset="0" stopColor="#3FC87A" /><stop offset="1" stopColor="#4A9EE0" /></linearGradient></defs>
                        <path d="M14 8 L14 66 L60 66" stroke="url(#t1-avg)" strokeWidth="14" strokeLinecap="square" fill="none" />
                        <circle cx="63" cy="17" r="11" fill="url(#t1-avg)" />
                      </svg>
                    </div>
                    <div>
                      <div className="wa-name">Santi</div>
                      <div className="wa-status">en línea</div>
                    </div>
                  </div>
                  <div className="wa-body" id="t1-waBody">
                    <div className="wa-msg sent" data-d="0">Hola! Hice la auditoría y me dio 67/100. Quiero recuperar esos clientes 🚀<span className="time">14:32 ✓✓</span></div>
                    <div className="wa-msg recv" data-d="1">¡Genial! En 24hs te paso un diagnóstico completo. ¿Cuál es tu rubro?<span className="time">14:32</span></div>
                  </div>
                  <div className="wa-input">
                    <div className="field">Escribí un mensaje…</div>
                    <div className="send">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#08110A"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
                    </div>
                  </div>
                </div>
              </div>
              {/* Cursor */}
              <div className="cursor" id="t1-cursor">
                <svg viewBox="0 0 24 24" fill="#fff" stroke="#08110A" strokeWidth="1.5"><path d="M4 2l6 18 2.5-7L20 10.5 4 2z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
