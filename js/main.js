document.addEventListener('DOMContentLoaded', () => {
    // Component Loader for Navbar and Footer
    const loadComponent = async (id, url) => {
        const el = document.getElementById(id);
        if (!el) return;
        try {
            const response = await fetch(url);
            if (response.ok) {
                const html = await response.text();
                el.innerHTML = html;
                
                // Initialize specific component scripts
                if (id === 'navbar-placeholder') {
                    const script = document.createElement('script');
                    script.src = 'js/navbar.js';
                    document.body.appendChild(script);
                }
            }
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
        }
    };

    // Particles JS Load (if element exists)
    if (document.querySelector('.particles-bg') || document.querySelector('.noise-overlay')) {
        const particlesScript = document.createElement('script');
        particlesScript.src = 'js/particles.js';
        document.body.appendChild(particlesScript);
    }

    // Load Navbar and Footer
    Promise.all([
        loadComponent('navbar-placeholder', 'navbar.html'),
        loadComponent('footer-placeholder', 'footer.html')
    ]).finally(() => {
        // Initialize AOS after components load
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 50,
                easing: 'ease-out-cubic'
            });
        }
        // Tell cursor.js to re-bind magnetic buttons for newly loaded HTML
        window.dispatchEvent(new Event('pageTransitionComplete'));
    });

    // Ripple Effect (Event Delegation to support dynamically loaded components)
    document.body.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-ripple');
        if (!btn) return;
        
        let x = e.clientX - btn.getBoundingClientRect().left;
        let y = e.clientY - btn.getBoundingClientRect().top;
        
        let ripples = document.createElement('span');
        ripples.className = 'ripple';
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        btn.appendChild(ripples);
        
        setTimeout(() => {
            ripples.remove();
        }, 600);
    });
});
