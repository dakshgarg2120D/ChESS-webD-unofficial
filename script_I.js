// INTRO CANVAS - Molecular Animation
(function() {
  const canvas = document.getElementById('intro-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], bubbles = [], time = 0;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const elements = ['H','C','O','N','S','Cl','Fe','Cu','Na','K'];
  const colors = ['#00ff88','#00d4ff','#ff6b00','#ffcc00','#ff3366'];
  for (let i = 0; i < 28; i++) {
    nodes.push({ x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
      vx:(Math.random()-0.5)*0.6, vy:(Math.random()-0.5)*0.6, r:8+Math.random()*14,
      color: colors[Math.floor(Math.random()*colors.length)], label: elements[Math.floor(Math.random()*elements.length)],
      phase: Math.random()*Math.PI*2 });
  }
  for (let i = 0; i < 20; i++) {
    bubbles.push({ x: Math.random()*window.innerWidth, y: window.innerHeight+Math.random()*200,
      r:4+Math.random()*20, speed:0.4+Math.random()*1.2, color: Math.random()>0.5?'#00ff88':'#00d4ff', wobble: Math.random()*Math.PI*2 });
  }
  function drawNode(n, t) {
    const pulse = 1 + 0.08*Math.sin(t*2+n.phase); const r = n.r*pulse;
    const grad = ctx.createRadialGradient(n.x,n.y,r*0.3,n.x,n.y,r*2.5);
    grad.addColorStop(0, n.color+'44'); grad.addColorStop(1, n.color+'00');
    ctx.beginPath(); ctx.arc(n.x,n.y,r*2.5,0,Math.PI*2); ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2); ctx.fillStyle = n.color+'22'; ctx.fill();
    ctx.strokeStyle = n.color; ctx.lineWidth = 1.5; ctx.shadowColor = n.color; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = n.color; ctx.font = `bold ${Math.max(8,r*0.8)}px 'Orbitron', monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n.label, n.x, n.y);
  }
  function drawBond(n1,n2,dist) {
    const alpha = Math.max(0, 1-dist/200);
    ctx.beginPath(); ctx.moveTo(n1.x,n1.y); ctx.lineTo(n2.x,n2.y);
    ctx.strokeStyle = `rgba(0,255,136,${alpha*0.4})`; ctx.lineWidth = 1; ctx.setLineDash([4,6]); ctx.stroke(); ctx.setLineDash([]);
  }
  function drawBubble(b) {
    b.wobble += 0.02; b.x += Math.sin(b.wobble)*0.5; b.y -= b.speed;
    if (b.y < -b.r*2) { b.y = H+b.r; b.x = Math.random()*W; }
    ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.strokeStyle = b.color+'66'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.arc(b.x-b.r*0.3,b.y-b.r*0.3,b.r*0.25,0,Math.PI*2); ctx.fillStyle = b.color+'55'; ctx.fill();
  }
  const formulas = ['2H₂ + O₂ → 2H₂O','ΔG = ΔH − TΔS','PV = nRT','Kₑq = [C][D]/[A][B]','dC/dt = −kC','Re = ρvL/μ'];
  let formulaY = []; for (let i=0;i<formulas.length;i++) formulaY.push(Math.random()*window.innerHeight);
  function animate() {
    time += 0.016; ctx.clearRect(0,0,W,H); ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle = 'rgba(0,255,136,0.04)'; ctx.lineWidth = 1;
    for (let x=0;x<W;x+=50){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y=0;y<H;y+=50){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    bubbles.forEach(b => drawBubble(b));
    formulas.forEach((f,i) => {
      formulaY[i] -= 0.3; if (formulaY[i] < -30) formulaY[i] = H+30;
      ctx.fillStyle = `rgba(0,212,255,${0.06+0.04*Math.sin(time+i)})`; ctx.font = "12px 'Space Mono', monospace";
      ctx.textAlign = 'left'; ctx.fillText(f, 20+(i*150)%(W-200), formulaY[i]);
    });
    for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
      const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, dist=Math.sqrt(dx*dx+dy*dy);
      if (dist < 180) drawBond(nodes[i],nodes[j],dist);
    }
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x<-50) n.x=W+50; if (n.x>W+50) n.x=-50; if (n.y<-50) n.y=H+50; if (n.y>H+50) n.y=-50;
      drawNode(n, time);
    });
    const gr = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,300);
    gr.addColorStop(0, `rgba(0,255,136,${0.04+0.02*Math.sin(time)})`); gr.addColorStop(1,'rgba(0,255,136,0)');
    ctx.fillStyle = gr; ctx.fillRect(0,0,W,H);
    requestAnimationFrame(animate);
  }
  animate();
})();

function enterSite() {
  const intro = document.getElementById('intro');
  const main = document.getElementById('main-site');
  intro.style.transition = 'opacity 1s ease, transform 1s ease';
  intro.style.opacity = '0'; intro.style.transform = 'scale(1.05)';
  setTimeout(() => { intro.style.display = 'none'; main.classList.add('visible'); initHeroCanvas(); }, 900);
}

function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() { W = canvas.width = canvas.parentElement.offsetWidth; H = canvas.height = canvas.parentElement.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i=0;i<80;i++) particles.push({ x:Math.random()*2000, y:Math.random()*1200,
    vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3, r:Math.random()*2+0.5, color: Math.random()>0.5?'#00ff88':'#00d4ff' });
  function draw() {
    ctx.clearRect(0,0,W,H);
    for (let i=0;i<particles.length;i++) {
      const p = particles[i]; p.x+=p.vx; p.y+=p.vy;
      if (p.x<0||p.x>W) p.vx*=-1; if (p.y<0||p.y>H) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle = p.color+'66'; ctx.fill();
      for (let j=i+1;j<particles.length;j++) {
        const q = particles[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.sqrt(dx*dx+dy*dy);
        if (d<120) { ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
          ctx.strokeStyle = `rgba(0,255,136,${(1-d/120)*0.15})`; ctx.lineWidth = 0.5; ctx.stroke(); }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}
// HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});