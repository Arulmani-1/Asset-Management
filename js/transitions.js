// Seamless Page Transitions via AJAX & GSAP
document.addEventListener('DOMContentLoaded', () => {
    // Inject Transition Overlay HTML
    const transitionOverlay = document.createElement('div');
    transitionOverlay.id = 'page-transition-overlay';
    document.body.appendChild(transitionOverlay);

    const style = document.createElement('style');
    style.innerHTML = `
        #page-transition-overlay {
            position: fixed;
            top: 100%; left: 0;
            width: 100%; height: 100%;
            background: #0B1220;
            z-index: 999998;
            pointer-events: none;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            border-top-left-radius: 50% 10%;
            border-top-right-radius: 50% 10%;
            border-bottom-left-radius: 50% 10%;
            border-bottom-right-radius: 50% 10%;
        }
        .transition-loader {
            opacity: 0;
            color: #38BDF8;
            font-size: 2rem;
            font-family: 'Poppins', sans-serif;
            font-weight: 800;
            letter-spacing: 5px;
        }
    `;
    document.head.appendChild(style);

    const overlay = document.getElementById('page-transition-overlay');
    
    // Add loader text inside overlay
    const loaderText = document.createElement('div');
    loaderText.className = 'transition-loader';
    loaderText.innerText = 'STACKLY';
    overlay.appendChild(loaderText);

    let isAnimating = false;

    // Attach click listeners to all internal links
    const setupLinks = () => {
        document.querySelectorAll('a').forEach(link => {
            if (link.hostname === window.location.hostname && 
                !link.hash && 
                link.getAttribute('target') !== '_blank') {
                
                // Remove old listeners to avoid duplicates
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                newLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (isAnimating) return;
                    
                    const targetUrl = newLink.href;
                    if (targetUrl === window.location.href) return;
                    
                    leavePage(targetUrl);
                });
            }
        });
    };

    setupLinks();

    const leavePage = (url) => {
        isAnimating = true;
        
        const tl = gsap.timeline();
        
        // Ensure overlay is at bottom
        gsap.set(overlay, { top: '100%', borderRadius: '50% 10% 0 0' });
        
        tl.to(overlay, {
            top: '0%',
            borderRadius: '0%',
            duration: 0.8,
            ease: "power4.inOut"
        })
        .to('.transition-loader', {
            opacity: 1,
            y: -20,
            duration: 0.4,
            ease: "power2.out"
        }, "-=0.2")
        .call(() => {
            fetchPage(url);
        });
    };

    const fetchPage = async (url) => {
        try {
            const response = await fetch(url);
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract main content, title, and body classes
            const newMain = doc.querySelector('#main-content');
            const newTitle = doc.querySelector('title').innerText;
            
            if (newMain) {
                document.title = newTitle;
                document.querySelector('#main-content').innerHTML = newMain.innerHTML;
                
                // Update URL without reload
                window.history.pushState({}, newTitle, url);
                
                // Scroll to top
                window.scrollTo(0, 0);
                if (window.lenis) {
                    window.lenis.scrollTo(0, { immediate: true });
                }
                
                enterPage();
            } else {
                window.location.href = url; // Fallback
            }
        } catch (error) {
            window.location.href = url; // Fallback
        }
    };

    const enterPage = () => {
        // Dispatch event for other scripts to re-initialize
        window.dispatchEvent(new Event('pageTransitionComplete'));
        setupLinks();
        
        const tl = gsap.timeline();
        
        tl.to('.transition-loader', {
            opacity: 0,
            y: -40,
            duration: 0.3,
            ease: "power2.in"
        })
        .to(overlay, {
            top: '-100%',
            borderRadius: '0 0 50% 10%',
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
                gsap.set(overlay, { top: '100%', borderRadius: '50% 10% 0 0' });
                isAnimating = false;
            }
        });
        
        // Trigger enter animations on main content
        gsap.fromTo('#main-content', 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out" }
        );
    };

    // Handle Back/Forward browser buttons
    window.addEventListener('popstate', () => {
        leavePage(window.location.href);
    });
});
