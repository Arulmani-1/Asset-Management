// Simple floating particles for background elements (if needed in other pages)
document.addEventListener('DOMContentLoaded', () => {
    const createParticles = () => {
        const mesh = document.querySelector('.bg-mesh');
        if (!mesh) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 4 + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = 'rgba(255,255,255,0.2)';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.pointerEvents = 'none';
            
            // Animation
            const duration = Math.random() * 20 + 10;
            const yDistance = Math.random() * -100 - 50;
            
            particle.animate([
                { transform: 'translateY(0)', opacity: 0 },
                { opacity: 1, offset: 0.1 },
                { opacity: 1, offset: 0.9 },
                { transform: `translateY(${yDistance}px)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                iterations: Infinity,
                easing: 'linear'
            });
            
            mesh.appendChild(particle);
        }
    };
    
    // Only run if not heavily using Three.js for performance
    if (!document.getElementById('hero-canvas')) {
        createParticles();
    }
});
