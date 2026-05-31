"use client";

/* Tab 2 — Diagnóstico: pure CSS animation, no JS loop needed.
   isActive controls animation-play-state via CSS custom property. */

const CSS = `
.t2-wrap {
  width:100%; height:100%; position:relative; overflow:hidden;
  --play-state: running;
}
.t2-wrap .stage {
  position:absolute; top:0; left:0;
  width:1280px; height:800px; transform-origin:top left;
  background:#080C14; overflow:hidden;
  display:flex; align-items:center; justify-content:center;
}
.t2-wrap .stage::before {
  content:""; position:absolute;
  top:50%; left:50%; transform:translate(-50%,-50%);
  width:900px; height:600px;
  background:radial-gradient(ellipse at center,rgba(63,200,122,0.06) 0%,transparent 60%);
  pointer-events:none;
}
.t2-wrap .timeline {
  position:relative; width:1000px;
  display:grid; grid-template-columns:repeat(4,1fr); z-index:2;
}
.t2-wrap .spine {
  position:absolute; top:30px; left:125px; right:125px; height:3px;
  transform:translateY(-50%);
  background:rgba(255,255,255,0.08); border-radius:3px; overflow:visible;
}
.t2-wrap .spine-fill {
  position:absolute; top:0; left:0; bottom:0; width:0%;
  background:linear-gradient(90deg,#3FC87A 0%,#4A9EE0 100%);
  border-radius:3px;
  animation:t2-spine-grow 12s linear infinite;
  animation-play-state:var(--play-state);
}
.t2-wrap .spine-fill::after {
  content:""; position:absolute; right:-5px; top:50%;
  width:12px; height:12px; transform:translateY(-50%);
  border-radius:50%; background:#4A9EE0;
  box-shadow:0 0 16px 4px rgba(74,158,224,0.6),0 0 6px 1px rgba(63,200,122,0.5);
  opacity:0;
  animation:t2-tip-show 12s linear infinite;
  animation-play-state:var(--play-state);
}
@keyframes t2-spine-grow {
  0%{width:0%;}8%{width:0%;}18%{width:4%;}27%{width:33%;}37%{width:37%;}
  46%{width:62%;}56%{width:66%;}65%{width:90%;}75%{width:94%;}84%{width:100%;}100%{width:100%;}
}
@keyframes t2-tip-show {
  0%,7%{opacity:0;}9%{opacity:1;}84%{opacity:1;}88%,100%{opacity:0;}
}
.t2-wrap .node-col { position:relative; display:flex; flex-direction:column; align-items:center; text-align:center; }
.t2-wrap .node {
  position:relative; z-index:2; width:60px; height:60px; border-radius:50%;
  background:#0D1221; border:2px solid rgba(255,255,255,0.15);
  display:flex; align-items:center; justify-content:center;
}
.t2-wrap .node .num { position:absolute; font-family:var(--font-mono); font-size:16px; font-weight:500; color:var(--lg-text-muted); }
.t2-wrap .node .check { position:absolute; opacity:0; transform:scale(0.5); }
.t2-wrap .node .check svg { width:28px; height:28px; display:block; }
.t2-wrap .node-title {
  margin-top:26px; font-family:var(--font-display); font-weight:600;
  font-size:22px; letter-spacing:-0.012em; color:var(--lg-text-secondary);
  max-width:200px; line-height:1.25; transition:color .4s ease;
}
.t2-wrap .n1 { animation:t2-state1 12s linear infinite; animation-play-state:var(--play-state); }
.t2-wrap .n2 { animation:t2-state2 12s linear infinite; animation-play-state:var(--play-state); }
.t2-wrap .n3 { animation:t2-state3 12s linear infinite; animation-play-state:var(--play-state); }
.t2-wrap .n4 { animation:t2-state4 12s linear infinite; animation-play-state:var(--play-state); }
@keyframes t2-state1 {
  0%,17%{background:#0D1221;border-color:rgba(255,255,255,0.15);box-shadow:none;transform:scale(1);}
  18%{background:linear-gradient(135deg,#3FC87A,#4A9EE0);border-color:#3FC87A;box-shadow:0 0 24px rgba(63,200,122,0.4);transform:scale(1);}
  21%{transform:scale(1.08);}24%{transform:scale(1);}
  26%{background:linear-gradient(135deg,#3FC87A,#4A9EE0);border-color:#3FC87A;box-shadow:0 0 24px rgba(63,200,122,0.4);}
  27%,100%{background:#3FC87A;border-color:#3FC87A;box-shadow:0 0 14px rgba(63,200,122,0.28);transform:scale(1);}
}
@keyframes t2-state2 {
  0%,36%{background:#0D1221;border-color:rgba(255,255,255,0.15);box-shadow:none;transform:scale(1);}
  37%{background:linear-gradient(135deg,#3FC87A,#4A9EE0);border-color:#3FC87A;box-shadow:0 0 24px rgba(63,200,122,0.4);transform:scale(1);}
  40%{transform:scale(1.08);}43%{transform:scale(1);}
  45%{background:linear-gradient(135deg,#3FC87A,#4A9EE0);border-color:#3FC87A;box-shadow:0 0 24px rgba(63,200,122,0.4);}
  46%,100%{background:#3FC87A;border-color:#3FC87A;box-shadow:0 0 14px rgba(63,200,122,0.28);transform:scale(1);}
}
@keyframes t2-state3 {
  0%,55%{background:#0D1221;border-color:rgba(255,255,255,0.15);box-shadow:none;transform:scale(1);}
  56%{background:linear-gradient(135deg,#3FC87A,#4A9EE0);border-color:#3FC87A;box-shadow:0 0 24px rgba(63,200,122,0.4);transform:scale(1);}
  59%{transform:scale(1.08);}62%{transform:scale(1);}
  64%{background:linear-gradient(135deg,#3FC87A,#4A9EE0);border-color:#3FC87A;box-shadow:0 0 24px rgba(63,200,122,0.4);}
  65%,100%{background:#3FC87A;border-color:#3FC87A;box-shadow:0 0 14px rgba(63,200,122,0.28);transform:scale(1);}
}
@keyframes t2-state4 {
  0%,74%{background:#0D1221;border-color:rgba(255,255,255,0.15);box-shadow:none;transform:scale(1);}
  75%{background:linear-gradient(135deg,#3FC87A,#4A9EE0);border-color:#3FC87A;box-shadow:0 0 24px rgba(63,200,122,0.4);transform:scale(1);}
  78%{transform:scale(1.08);}81%{transform:scale(1);}
  83%{background:linear-gradient(135deg,#3FC87A,#4A9EE0);border-color:#3FC87A;box-shadow:0 0 24px rgba(63,200,122,0.4);}
  84%,100%{background:#3FC87A;border-color:#3FC87A;box-shadow:0 0 14px rgba(63,200,122,0.28);transform:scale(1);}
}
.t2-wrap .num1{animation:t2-num1 12s linear infinite;animation-play-state:var(--play-state);}
.t2-wrap .num2{animation:t2-num2 12s linear infinite;animation-play-state:var(--play-state);}
.t2-wrap .num3{animation:t2-num3 12s linear infinite;animation-play-state:var(--play-state);}
.t2-wrap .num4{animation:t2-num4 12s linear infinite;animation-play-state:var(--play-state);}
@keyframes t2-num1{0%,17%{color:var(--lg-text-muted);opacity:1;}18%,26%{color:#fff;opacity:1;}27%,100%{opacity:0;}}
@keyframes t2-num2{0%,36%{color:var(--lg-text-muted);opacity:1;}37%,45%{color:#fff;opacity:1;}46%,100%{opacity:0;}}
@keyframes t2-num3{0%,55%{color:var(--lg-text-muted);opacity:1;}56%,64%{color:#fff;opacity:1;}65%,100%{opacity:0;}}
@keyframes t2-num4{0%,74%{color:var(--lg-text-muted);opacity:1;}75%,83%{color:#fff;opacity:1;}84%,100%{opacity:0;}}
.t2-wrap .chk1{animation:t2-chk1 12s linear infinite;animation-play-state:var(--play-state);}
.t2-wrap .chk2{animation:t2-chk2 12s linear infinite;animation-play-state:var(--play-state);}
.t2-wrap .chk3{animation:t2-chk3 12s linear infinite;animation-play-state:var(--play-state);}
.t2-wrap .chk4{animation:t2-chk4 12s linear infinite;animation-play-state:var(--play-state);}
@keyframes t2-chk1{0%,26%{opacity:0;transform:scale(0.5);}28%,100%{opacity:1;transform:scale(1);}}
@keyframes t2-chk2{0%,45%{opacity:0;transform:scale(0.5);}47%,100%{opacity:1;transform:scale(1);}}
@keyframes t2-chk3{0%,64%{opacity:0;transform:scale(0.5);}66%,100%{opacity:1;transform:scale(1);}}
@keyframes t2-chk4{0%,83%{opacity:0;transform:scale(0.5);}85%,100%{opacity:1;transform:scale(1);}}
.t2-wrap .t1c{animation:t2-txt1 12s linear infinite;animation-play-state:var(--play-state);}
.t2-wrap .t2c{animation:t2-txt2 12s linear infinite;animation-play-state:var(--play-state);}
.t2-wrap .t3c{animation:t2-txt3 12s linear infinite;animation-play-state:var(--play-state);}
.t2-wrap .t4c{animation:t2-txt4 12s linear infinite;animation-play-state:var(--play-state);}
@keyframes t2-txt1{0%,17%{color:var(--lg-text-secondary);}18%,100%{color:#fff;}}
@keyframes t2-txt2{0%,36%{color:var(--lg-text-secondary);}37%,100%{color:#fff;}}
@keyframes t2-txt3{0%,55%{color:var(--lg-text-secondary);}56%,100%{color:#fff;}}
@keyframes t2-txt4{0%,74%{color:var(--lg-text-secondary);}75%,100%{color:#fff;}}
`;

import { useEffect, useRef } from "react";

export function MetodoTab2({ isActive }: { isActive: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  /* Scale stage to fit wrapper */
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

  const check = (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div
        ref={wrapRef}
        className="t2-wrap"
        style={{ "--play-state": isActive ? "running" : "paused" } as React.CSSProperties}
      >
        <div className="stage">
          <div className="timeline">
            <div className="spine"><div className="spine-fill" /></div>
            {/* Node 1 */}
            <div className="node-col">
              <div className="node n1">
                <span className="num num1">01</span>
                <span className="check chk1">{check}</span>
              </div>
              <div className="node-title t1c">Revisión de landing</div>
            </div>
            {/* Node 2 */}
            <div className="node-col">
              <div className="node n2">
                <span className="num num2">02</span>
                <span className="check chk2">{check}</span>
              </div>
              <div className="node-title t2c">Auditoría de campañas</div>
            </div>
            {/* Node 3 */}
            <div className="node-col">
              <div className="node n3">
                <span className="num num3">03</span>
                <span className="check chk3">{check}</span>
              </div>
              <div className="node-title t3c">Nueva estructura</div>
            </div>
            {/* Node 4 */}
            <div className="node-col">
              <div className="node n4">
                <span className="num num4">04</span>
                <span className="check chk4">{check}</span>
              </div>
              <div className="node-title t4c">Manos a la obra</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
