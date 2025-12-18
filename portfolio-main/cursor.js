// Advanced Cursor Animation System

class CursorAnimation {
  constructor() {
    this.cursorDot = document.getElementById('cursor-dot');
    this.cursorTrail = document.getElementById('cursor-trail');
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.dotX = 0;
    this.dotY = 0;
    
    this.particles = [];
    this.maxParticles = 12;
    this.particleDelay = 2;
    this.frameCount = 0;
    
    this.isHoveringInteractive = false;
    
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseenter', () => this.showCursor());
    document.addEventListener('mouseleave', () => this.hideCursor());
    
    // Interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.isHoveringInteractive = true;
      });
      el.addEventListener('mouseleave', () => {
        this.isHoveringInteractive = false;
      });
    });
    
    // Animate
    this.animate();
  }

  handleMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    
    // Create particles on movement
    if (this.frameCount % this.particleDelay === 0) {
      this.createParticle(this.mouseX, this.mouseY);
    }
    
    this.frameCount++;
  }

  showCursor() {
    this.cursorDot.classList.add('active');
  }

  hideCursor() {
    this.cursorDot.classList.remove('active');
    this.particles.forEach(p => p.remove());
    this.particles = [];
  }

  createParticle(x, y) {
    if (this.particles.length >= this.maxParticles) {
      const oldParticle = this.particles.shift();
      oldParticle.remove();
    }
    
    const particle = document.createElement('div');
    particle.className = 'cursor-trail-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    this.cursorTrail.appendChild(particle);
    this.particles.push(particle);
    
    // Animate particle
    let opacity = 1;
    let scale = 1;
    let offsetX = (Math.random() - 0.5) * 20;
    let offsetY = (Math.random() - 0.5) * 20;
    let frame = 0;
    const totalFrames = 30;
    
    const animateParticle = () => {
      frame++;
      opacity = 1 - frame / totalFrames;
      scale = 1 + frame / totalFrames * 0.5;
      
      particle.style.transform = `translate(calc(-50% + ${offsetX * frame / totalFrames}px), calc(-50% + ${offsetY * frame / totalFrames}px)) scale(${scale})`;
      particle.style.opacity = opacity;
      
      if (frame < totalFrames) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
        this.particles = this.particles.filter(p => p !== particle);
      }
    };
    
    animateParticle();
  }

  animate() {
    // Smooth cursor dot movement with easing
    const ease = 0.15;
    this.dotX += (this.mouseX - this.dotX) * ease;
    this.dotY += (this.mouseY - this.dotY) * ease;
    
    this.cursorDot.style.transform = `translate(${this.dotX}px, ${this.dotY}px)`;
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CursorAnimation();
  });
} else {
  new CursorAnimation();
}
