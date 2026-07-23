document.addEventListener('DOMContentLoaded', () => {
    // CountUp.js Initialization
    if (typeof countUp !== 'undefined') {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            
            // Setup intersection observer to start counting only when visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    const numAnim = new countUp.CountUp(counter, target, {
                        duration: 3,
                        useEasing: true,
                        useGrouping: true,
                        decimalPlaces: target % 1 !== 0 ? 1 : 0 // auto detect decimals
                    });
                    
                    if (!numAnim.error) {
                        numAnim.start();
                    } else {
                        console.error(numAnim.error);
                    }
                    // Stop observing once started
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }
});
