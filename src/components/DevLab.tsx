import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, RotateCcw, Copy, Check, Code2, Eye, Layout } from 'lucide-react';

export const DevLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState(false);

  const presets = {
    particles: {
      name: 'Canvas Matrix Particles',
      html: `<canvas id="canvas"></canvas>
<div class="overlay">
  <h1>Robail DevLab</h1>
  <p>Move mouse to interact with neural particles</p>
</div>`,
      css: `body {
  margin: 0;
  overflow: hidden;
  background: #090d16;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
canvas {
  position: absolute;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
}
.overlay {
  position: relative;
  z-index: 10;
  text-align: center;
  padding-top: 15vh;
  color: white;
  pointer-events: none;
}
h1 {
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
p {
  color: #94a3b8;
  font-size: 0.9rem;
}`,
      js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

const particles = [];
for (let i = 0; i < 70; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    size: Math.random() * 2 + 1
  });
}

let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animate() {
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
      if (dist < 100) {
        ctx.strokeStyle = \`rgba(56, 189, 248, \${1 - dist / 100})\`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}
animate();`,
    },
    clock: {
      name: 'Cyberpunk Neon Clock',
      html: `<div class="clock-card">
  <div class="glow"></div>
  <div class="time" id="clock">00:00:00</div>
  <div class="label">ROBAIL ENGINE ACTIVE</div>
</div>`,
      css: `body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  background: #05070c;
  font-family: monospace;
}
.clock-card {
  position: relative;
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 40px 60px;
  border-radius: 20px;
  box-shadow: 0 0 50px rgba(56, 189, 248, 0.15);
  text-align: center;
}
.time {
  font-size: 3.5rem;
  font-weight: 800;
  color: #38bdf8;
  letter-spacing: 4px;
  text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
}
.label {
  margin-top: 15px;
  font-size: 0.8rem;
  color: #64748b;
  letter-spacing: 3px;
}`,
      js: `function update() {
  const d = new Date();
  document.getElementById('clock').innerText = d.toTimeString().split(' ')[0];
}
setInterval(update, 1000);
update();`,
    },
  };

  const [code, setCode] = useState(presets.particles);
  const [previewSrc, setPreviewSrc] = useState('');

  const buildPreview = () => {
    const combined = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>${code.css}</style>
        </head>
        <body>
          ${code.html}
          <script>${code.js}<\/script>
        </body>
      </html>
    `;
    setPreviewSrc(combined);
  };

  useEffect(() => {
    buildPreview();
  }, [code]);

  const handleCopy = () => {
    const full = `<!-- HTML -->\n${code.html}\n\n/* CSS */\n${code.css}\n\n// JS\n${code.js}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-950 select-none overflow-hidden">
      {/* Top DevLab Toolbar */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-xs text-white">DevLab Studio</span>
          <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-mono">
            Interactive Sandbox
          </span>
        </div>

        {/* Preset Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Presets:</span>
          {Object.entries(presets).map(([k, p]) => (
            <button
              key={k}
              onClick={() => setCode(p)}
              className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-[11px] text-slate-300 hover:text-white transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={buildPreview}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Run</span>
          </button>
          <button
            onClick={handleCopy}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Split: Code Editor Left, Live Preview Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Half */}
        <div className="w-1/2 border-r border-slate-800 flex flex-col bg-slate-950">
          <div className="flex items-center border-b border-slate-800 bg-slate-900/50 px-2 py-1 gap-1">
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                activeTab === 'html' ? 'bg-slate-800 text-orange-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              index.html
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                activeTab === 'css' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              style.css
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                activeTab === 'js' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              script.js
            </button>
          </div>

          <div className="flex-1 p-3">
            <textarea
              value={code[activeTab]}
              onChange={(e) => setCode({ ...code, [activeTab]: e.target.value })}
              className="w-full h-full bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 text-xs font-mono text-slate-200 outline-none resize-none focus:border-emerald-500/50 select-text"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Live Preview Half */}
        <div className="w-1/2 flex flex-col bg-slate-900">
          <div className="h-7 bg-slate-900/80 border-b border-slate-800 px-3 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Realtime Output</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Sandboxed Iframe</span>
          </div>

          <div className="flex-1 bg-white">
            <iframe
              srcDoc={previewSrc}
              title="DevLab Output"
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
