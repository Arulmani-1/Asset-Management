// Premium 3D Effects and Image Parallax
document.addEventListener('DOMContentLoaded', () => {

    const initPremiumEffects = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        // 1. Image Parallax (Backgrounds moving slower than scroll)
        const parallaxImages = document.querySelectorAll('.parallax-image');
        parallaxImages.forEach(img => {
            gsap.to(img, {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // 2. 3D Tilt on Cards (CSS handles the rotation via hover-tilt, but we can add GSAP mousemove for dynamic tilt)
        const tiltCards = document.querySelectorAll('.hover-tilt');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Max tilt 15 degrees
                const rotateX = ((y - centerY) / centerY) * -15; 
                const rotateY = ((x - centerX) / centerX) * 15;
                
                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    ease: "power2.out",
                    duration: 0.5
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    ease: "power2.out",
                    duration: 0.8
                });
            });
        });
    };

    initPremiumEffects();
    window.addEventListener('pageTransitionComplete', initPremiumEffects);
});
