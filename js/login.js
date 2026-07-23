document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    
    if(form) {
        form.addEventListener('submit', event => {
            event.preventDefault();
            
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Authenticating...';
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Connection Secured';
                btn.classList.add('bg-success');
                
                // Simulate redirect
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }, 2000);
            
        }, false);
    }
});
