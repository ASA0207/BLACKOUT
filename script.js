const inviteUrl = 'https://discord.gg/jGuxkSbkNn';

const introScreen = document.getElementById('introScreen');
const enterBtn = document.getElementById('enterBtn');
const ambientBtn = document.getElementById('ambientBtn');
const flashOverlay = document.getElementById('flashOverlay');
const focusRulesBtn = document.getElementById('focusRulesBtn');
const expandAllBtn = document.getElementById('expandAllBtn');
const ruleSearch = document.getElementById('ruleSearch');
const ruleCards = [...document.querySelectorAll('.rule-card')];
const scrollTopFab = document.getElementById('scrollTopFab');
const secretModal = document.getElementById('secretModal');
const closeSecretBtn = document.getElementById('closeSecretBtn');
const backTopBtn = document.getElementById('backTopBtn');

const joinLinks = [
  document.getElementById('joinLinkTop'),
  document.getElementById('joinLinkHero'),
  document.getElementById('joinLinkBottom')
].filter(Boolean);
joinLinks.forEach(link => link.href = inviteUrl);

document.body.classList.add('lock-scroll');

function flash() {
  flashOverlay.classList.add('active');
  setTimeout(() => flashOverlay.classList.remove('active'), 900);
}

function enterSite(withEffect = true) {
  if (withEffect) flash();
  introScreen.classList.add('hidden');
  introScreen.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock-scroll');
}

const bgMusic = document.getElementById('bgMusic');
const playToggle = document.getElementById('playToggle');
const muteToggle = document.getElementById('muteToggle');
const volumeSlider = document.getElementById('volumeSlider');
const volumeLabel = document.getElementById('volumeLabel');
const musicConsole = document.getElementById('musicConsole');
const MUSIC_START = 17;
let initialSeek = false;
let audioContext, analyser, sourceNode, freqData;
let shouldPlay = false;
bgMusic.volume = .23;
function applyStart(){ if(!initialSeek && Number.isFinite(bgMusic.duration) && bgMusic.duration > MUSIC_START+5){bgMusic.currentTime = MUSIC_START; initialSeek=true;} }
bgMusic.addEventListener('loadedmetadata',applyStart);
function updateAudioUI(){const playing = !bgMusic.paused;playToggle.textContent = playing ? 'Ⅱ' : '▶';playToggle.setAttribute('aria-label', playing ? '음악 일시정지' : '음악 재생');musicConsole.classList.toggle('playing',playing);muteToggle.textContent = bgMusic.muted ? '×' : '♫';}
function initAnalyzer(){try{const AC=window.AudioContext || window.webkitAudioContext;if(!AC)return;if(!audioContext){audioContext=new AC();analyser=audioContext.createAnalyser();analyser.fftSize=128;sourceNode=audioContext.createMediaElementSource(bgMusic);sourceNode.connect(analyser);analyser.connect(audioContext.destination);freqData=new Uint8Array(analyser.frequencyBinCount);}if(audioContext.state==='suspended')audioContext.resume();}catch(e){/* audio still works without visualizer */}}
async function startMusic(){shouldPlay=true;applyStart();initAnalyzer();try{await bgMusic.play();}catch(e){shouldPlay=false;}updateAudioUI();}
enterBtn?.addEventListener('click', () => { enterSite(true); startMusic(); });
ambientBtn?.addEventListener('click', () => {enterSite(false);bgMusic.pause();updateAudioUI();});
playToggle.addEventListener('click',()=>{if(bgMusic.paused)startMusic();else bgMusic.pause();updateAudioUI();});
muteToggle.addEventListener('click',()=>{bgMusic.muted=!bgMusic.muted;updateAudioUI();});
volumeSlider.addEventListener('input',()=>{bgMusic.volume=Number(volumeSlider.value)/100;bgMusic.muted=false;volumeLabel.textContent=volumeSlider.value+'%';updateAudioUI();});
bgMusic.addEventListener('play',updateAudioUI);bgMusic.addEventListener('pause',updateAudioUI);
window.addEventListener('pointermove',e=>{const glow=document.getElementById('cursorGlow');glow.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;},{passive:true});

focusRulesBtn?.addEventListener('click', () => document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' }));

let expanded = false;
expandAllBtn?.addEventListener('click', () => {
  expanded = !expanded;
  ruleCards.forEach(card => card.open = expanded);
  expandAllBtn.textContent = expanded ? '모두 접기' : '모두 펼치기';
});

ruleSearch?.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  ruleCards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(q) ? '' : 'none';
  });
});

window.addEventListener('scroll', () => {
  scrollTopFab.classList.toggle('show', window.scrollY > 500);
});
scrollTopFab?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
backTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

function triggerSecretRitual() {
  document.body.classList.add('infernal-awakened', 'ritual-shake');
  secretModal.classList.add('show');
  secretModal.setAttribute('aria-hidden', 'false');
  flash();
  setTimeout(() => document.body.classList.remove('ritual-shake'), 600);
  burstParticles(240);
  document.querySelectorAll('.secret-runes span').forEach((r,i)=>r.style.animationDelay=(i*.12)+'s');
}

function closeSecretRitual() {
  secretModal.classList.remove('show');
  secretModal.setAttribute('aria-hidden', 'true');
}

let codeBuffer = '';
const secretCode = 'blackout';
window.addEventListener('keydown', (e) => {
  if (e.key.length === 1) {
    codeBuffer = (codeBuffer + e.key.toLowerCase()).slice(-secretCode.length);
    if (codeBuffer === secretCode) {
      triggerSecretRitual();
      codeBuffer = '';
    }
  }
  if (e.key === 'Escape') closeSecretRitual();
});
closeSecretBtn?.addEventListener('click', closeSecretRitual);

const canvas = document.getElementById('embers');
const ctx = canvas.getContext('2d');
let particles = [];
let bursts = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function makeParticle() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * canvas.height,
    r: Math.random() * 2.4 + 0.7,
    vy: Math.random() * 0.85 + 0.35,
    vx: (Math.random() - 0.5) * 0.35,
    a: Math.random() * 0.65 + 0.14,
    color: Math.random() > 0.84 ? '255,190,160' : '255,72,92'
  };
}

function initParticles() {
  const count = Math.min(140, Math.floor(window.innerWidth / 9));
  particles = Array.from({ length: count }, makeParticle);
}

function burstParticles(count = 50) {
  for (let i = 0; i < count; i++) {
    bursts.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: Math.random() * 40 + 28,
      r: Math.random() * 2.6 + 0.8,
      color: Math.random() > 0.4 ? '255,70,90' : '255,210,190'
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y -= p.vy;
    if (p.y < -10) Object.assign(p, makeParticle());
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color}, ${p.a})`;
    ctx.fill();
  });

  bursts = bursts.filter(b => b.life > 0);
  bursts.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
    b.life -= 1;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${b.color}, ${Math.max(0, b.life / 60)})`;
    ctx.fill();
  });

  if(analyser && freqData && !bgMusic.paused){analyser.getByteFrequencyData(freqData); const energy=freqData.slice(2,24).reduce((a,b)=>a+b,0)/22/255;document.documentElement.style.setProperty('--beat',energy.toFixed(3));document.querySelectorAll('#eqBars i').forEach((b,i)=>{const v=freqData[i*3+2]/255;b.style.height=`${Math.round(5+v*25)}px`;});}
  else {document.documentElement.style.setProperty('--beat','0');}
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
initParticles();
drawParticles();
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});
