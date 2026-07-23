// Advanced Magnetic Custom Cursor
document.addEventListener('DOMContentLoaded', () => {
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.classList.add('premium-cursor');
    
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('premium-cursor-dot');
    
    const cursorText = document.createElement('div');
    cursorText.classList.add('premium-cursor-text');
    cursor.appendChild(cursorText);
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);
    
    // Inject Styles
    const style = document.createElement('style');
    style.innerHTML = `
        .premium-cursor {
            position: fixed;
            top: 0; left: 0;
            width: 40px; height: 40px;
            border: 1px solid rgba(255,255,255,0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            display: flex;
            justify-content: center;
            align-items: center;
            mix-blend-mode: difference;
            transition: width 0.3s, height 0.3s, background-color 0.3s, border-color 0.3s;
        }
        .premium-cursor-dot {
            position: fixed;
            top: 0; left: 0;
            width: 6px; height: 6px;
            background: #fff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
            transition: width 0.3s, height 0.3s;
        }
        .premium-cursor-text {
            color: #000;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1px;
            opacity: 0;
            transform: scale(0);
            transition: opacity 0.3s, transform 0.3s;
            text-transform: uppercase;
        }
        /* Hover States */
        .premium-cursor.hover-link {
            width: 60px; height: 60px;
            background-color: #fff;
            border-color: transparent;
            mix-blend-mode: difference;
        }
        .premium-cursor.hover-text {
            width: 80px; height: 80px;
            background-color: #fff;
            border-color: transparent;
            mix-blend-mode: normal;
        }
        .premium-cursor.hover-text .premium-cursor-text {
            opacity: 1;
            transform: scale(1);
        }
        /* Hide default cursor on desktop */
        @media (pointer: fine) {
            body { cursor: none; }
            a, button, input, .glass-card { cursor: none; }
        }
    `;
    document.head.appendChild(style);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let dotX = mouseX;
    let dotY = mouseY;
    
    let isHoveringMagnetic = false;
    let magneticTarget = null;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const render = () => {
        // Smooth lerp for outer circle
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        // Faster lerp for dot
        dotX += (mouseX - dotX) * 0.5;
        dotY += (mouseY - dotY) * 0.5;
        
        if (isHoveringMagnetic && magneticTarget) {
            // Magnetic effect logic
            const rect = magneticTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Pull cursor towards center of element
            const distanceX = mouseX - centerX;
            const distanceY = mouseY - centerY;
            
            magneticTarget.style.transform = `translate(${distanceX * 0.3}px, ${distanceY * 0.3}px)`;
            
            // Magnetize cursor to the button
            cursor.style.transform = `translate(calc(-50% + ${(centerX - cursorX) * 0.1}px), calc(-50% + ${(centerY - cursorY) * 0.1}px))`;
        } else {
            cursor.style.transform = `translate(-50%, -50%)`;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }

        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        
        requestAnimationFrame(render);
    };
    render();

    // Setup interactables
    const setupInteractables = () => {
        // Links and standard hover
        document.querySelectorAll('a:not(.btn-primary-gradient):not(.btn-glass)').forEach(el => {
            if (el.dataset.cursorBound) return;
            el.dataset.cursorBound = "true";
            
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover-link');
                cursorDot.style.opacity = '0';
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover-link');
                cursorDot.style.opacity = '1';
            });
        });
        
        // Magnetic Buttons and Cards
        document.querySelectorAll('.magnetic-btn, .magnetic-card, .btn-primary-gradient, .btn-glass').forEach(el => {
            if (el.dataset.cursorBound) return;
            el.dataset.cursorBound = "true";
            
            el.addEventListener('mouseenter', (e) => {
                isHoveringMagnetic = true;
                magneticTarget = el;
                el.style.transition = 'none';
                cursor.classList.add('hover-link');
                cursorDot.style.opacity = '0';
            });
            el.addEventListener('mouseleave', (e) => {
                isHoveringMagnetic = false;
                magneticTarget = null;
                cursor.classList.remove('hover-link');
                cursorDot.style.opacity = '1';
                
                // Reset button position
                el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                el.style.transform = 'translate(0px, 0px)';
            });
        });

        // Text reveal cursor on specific images/cards
        document.querySelectorAll('.service-card, .service-detail-card').forEach(el => {
            if (el.dataset.cursorBound) return;
            el.dataset.cursorBound = "true";
            
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover-text');
                cursorText.innerText = 'Explore';
                cursorDot.style.opacity = '0';
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover-text');
                cursorDot.style.opacity = '1';
            });
        });
    };

    setupInteractables();
    
    // Re-run setup on AJAX page load
    window.addEventListener('pageTransitionComplete', setupInteractables);
    
    // Click Ripple Effect
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        document.body.appendChild(ripple);
        
        ripple.style.position = 'fixed';
        ripple.style.left = \`\${e.clientX}px\`;
        ripple.style.top = \`\${e.clientY}px\`;
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.border = '2px solid rgba(255,255,255,0.8)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9998';
        
        gsap.to(ripple, {
            width: 100,
            height: 100,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                ripple.remove();
            }
        });
    });
});
