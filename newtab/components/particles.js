// Particle field — pure DOM/CSS, no canvas
const PARTICLE_COUNT = 10;
const field = document.getElementById('particle-field');
if (!field) throw new Error('particle-field not found');
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = document.createElement('div'); p.className = 'void-particle';
  p.style.left = `${Math.random()*100}%`;
  const drift = (Math.random()-.5)*40; p.style.setProperty('--drift-x',`${drift}px`);
  const duration = 7+Math.random()*8; const delay = -(Math.random()*duration);
  p.style.setProperty('--particle-duration',`${duration}s`);
  p.style.setProperty('--particle-delay',`${delay}s`);
  const size = 1+Math.random()*1.5; p.style.width=`${size}px`; p.style.height=`${size}px`;
  field.appendChild(p);
}
