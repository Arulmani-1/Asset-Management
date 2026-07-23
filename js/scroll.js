// Premium Smooth Scroll using Lenis
document.addEventListener('DOMContentLoaded', () => {
    if (typeof Lenis !== 'undefined') {
        // Optimized smooth settings for Awwwards-style feel
        const lenis = new Lenis({
            duration: 1.2, // Faster than 1.5, avoids feeling sluggish
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard ease out quad
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1, // Standard mouse scroll
            smoothTouch: false, // Don't interfere with native touch momentum
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Integrate Lenis with GSAP ScrollTrigger if present
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        }
        
        // Expose lenis globally for AJAX page transitions
        window.lenis = lenis;
    }
});
