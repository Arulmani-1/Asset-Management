document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Reveal
        gsap.from(".hero-content .reveal-text span", {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out",
            delay: 0.5
        });

        // Horizontal Timeline Scroll for "How We Work" section
        const timelinePanels = gsap.utils.toArray('.timeline-panel');
        if (timelinePanels.length > 0) {
            gsap.to(timelinePanels, {
                xPercent: -100 * (timelinePanels.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: ".timeline-section",
                    pin: true,
                    scrub: 1,
                    snap: 1 / (timelinePanels.length - 1),
                    end: () => "+=" + document.querySelector(".timeline-track").offsetWidth
                }
            });
        }
    }

    // Typed.js Initialization
    if (document.getElementById('typed-text') && typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: ['Asset Management.', 'Investment.', 'Portfolio Architecture.', 'Financial Planning.'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            cursorChar: '|'
        });
    }

    // Swiper.js Initialization
    if (document.querySelector('.client-swiper') && typeof Swiper !== 'undefined') {
        new Swiper('.client-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            coverflowEffect: {
                rotate: 15,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: true,
            },
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            }
        });
    }
});
