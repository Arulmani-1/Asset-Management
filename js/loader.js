// Luxury Preloader
document.addEventListener('DOMContentLoaded', () => {
    // Inject Preloader HTML
    const loaderHTML = `
        <div id="premium-preloader">
            <div class="preloader-bg"></div>
            <div class="particles-container" id="loader-particles"></div>
            
            <div class="loader-content">
                <div class="loader-logo-wrapper">
                    <h2 class="loader-logo" data-text="STACKLY">STACKLY<span class="dot">.</span></h2>
                    <div class="logo-glow"></div>
                </div>
                
                <div class="loader-progress-wrapper">
                    <div class="progress-bar-container">
                        <div id="loader-progress-bar"></div>
                    </div>
                </div>
            </div>
        </div>
        <style>
            #premium-preloader {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: #0B1220;
                overflow: hidden;
            }
            .preloader-bg {
                position: absolute;
                top: -50%; left: -50%; width: 200%; height: 200%;
                background: radial-gradient(circle at center, rgba(37, 99, 235, 0.15) 0%, transparent 60%);
                animation: pulseBg 4s infinite alternate ease-in-out;
            }
            @keyframes pulseBg {
                0% { transform: scale(1); }
                100% { transform: scale(1.1); }
            }
            .particles-container {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none;
            }
            .loader-content {
                position: relative;
                z-index: 2;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 3rem;
            }
            .loader-logo-wrapper {
                position: relative;
            }
            .loader-logo {
                font-family: 'Poppins', sans-serif;
                font-size: 3.5rem;
                font-weight: 800;
                color: transparent;
                -webkit-text-stroke: 1px rgba(255,255,255,0.2);
                margin: 0;
                position: relative;
                letter-spacing: 4px;
            }
            .loader-logo::before {
                content: attr(data-text);
                position: absolute;
                top: 0; left: 0;
                width: 0%;
                height: 100%;
                color: #fff;
                -webkit-text-stroke: 0px transparent;
                overflow: hidden;
                white-space: nowrap;
                transition: width 0.1s;
                border-right: 2px solid #38BDF8;
                filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.8));
            }
            .loader-logo .dot {
                color: #38BDF8;
                -webkit-text-stroke: 0px transparent;
            }
            .logo-glow {
                position: absolute;
                top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                width: 150px; height: 50px;
                background: rgba(56, 189, 248, 0.4);
                filter: blur(40px);
                border-radius: 50%;
                z-index: -1;
                opacity: 0;
                transition: opacity 0.5s;
            }
            .loader-progress-wrapper {
                width: 300px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .progress-bar-container {
                width: 100%;
                height: 2px;
                background: rgba(255,255,255,0.1);
                border-radius: 2px;
                overflow: hidden;
                position: relative;
            }
            #loader-progress-bar {
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, #2563EB, #38BDF8);
                box-shadow: 0 0 10px #38BDF8;
                transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .progress-stats {
                display: flex;
                justify-content: space-between;
                font-family: 'Plus Jakarta Sans', sans-serif;
                font-size: 0.75rem;
                font-weight: 600;
                letter-spacing: 2px;
                color: rgba(255,255,255,0.5);
            }
            #loader-percentage {
                color: #fff;
                font-weight: 700;
            }
        </style>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);

    const preloader = document.getElementById('premium-preloader');
    const progressBar = document.getElementById('loader-progress-bar');
    const logoFill = document.querySelector('.loader-logo');
    const logoGlow = document.querySelector('.logo-glow');
    
    let progress = 0;
    
    // Simulate loading
    const simulateLoad = () => {
        // Random increment to feel realistic
        const increment = Math.random() * 15;
        progress += increment;
        
        if (progress > 100) progress = 100;
        
        // Update UI
        progressBar.style.width = `${progress}%`;
        
        // Inject dynamic style for logo fill
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `.loader-logo::before { width: ${progress}% !important; }`;
        document.head.appendChild(styleSheet);
        
        logoGlow.style.opacity = progress / 100;
        
        if (progress < 100) {
            setTimeout(simulateLoad, 50 + Math.random() * 150);
        } else {
            // Loading Complete Animation
            completeLoading();
        }
    };
    
    const completeLoading = () => {
        if(typeof gsap !== 'undefined') {
            const tl = gsap.timeline();
            tl.to('.progress-stats', { y: 10, opacity: 0, duration: 0.4, ease: "power2.in" })
              .to('.progress-bar-container', { scaleX: 0, opacity: 0, duration: 0.4, ease: "power3.in" }, "-=0.2")
              .to('.loader-logo', { scale: 1.1, filter: 'blur(10px)', opacity: 0, duration: 0.6, ease: "power3.in" })
              .to(preloader, { 
                  yPercent: -100, 
                  duration: 1.2, 
                  ease: "expo.inOut",
                  onComplete: () => {
                      preloader.remove();
                      // Trigger page entry animations here if needed
                      window.dispatchEvent(new Event('loaderComplete'));
                  }
              }, "-=0.3");
        } else {
            // Fallback
            setTimeout(() => {
                preloader.style.opacity = 0;
                preloader.style.transition = 'opacity 0.8s ease';
                setTimeout(() => preloader.remove(), 800);
            }, 500);
        }
    };
    
    // Start loader
    setTimeout(simulateLoad, 100);
});
