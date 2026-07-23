window.initNavbar = () => {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add scrolled background, permanently fixed at top
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Navbar body scroll lock
    const navbarCollapse = document.getElementById('navbarNav');
    const toggler = document.querySelector('.navbar-toggler');
    
    const toggleScrollLock = () => {
        const isExpanded = toggler && toggler.getAttribute('aria-expanded') === 'true';
        if (isExpanded || (navbarCollapse && navbarCollapse.classList.contains('show'))) {
            if (!document.body.classList.contains('nav-open')) {
                const scrollY = window.scrollY;
                document.body.style.position = 'fixed';
                document.body.style.top = `-${scrollY}px`;
                document.body.style.width = '100%';
                document.body.style.overflow = 'hidden';
                document.body.classList.add('nav-open');
                navbar.classList.add('scrolled');
            }
        } else {
            if (document.body.classList.contains('nav-open')) {
                const scrollY = document.body.style.top;
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                document.body.classList.remove('nav-open');
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
                
                if (window.scrollY <= 50) {
                    navbar.classList.remove('scrolled');
                }
            }
        }
    };

    if (toggler) {
        toggler.addEventListener('click', () => setTimeout(toggleScrollLock, 50));
    }
    
    if (navbarCollapse) {
        navbarCollapse.addEventListener('show.bs.collapse', toggleScrollLock);
        navbarCollapse.addEventListener('hide.bs.collapse', toggleScrollLock);
        navbarCollapse.addEventListener('hidden.bs.collapse', toggleScrollLock);
    }
    // Auto-highlight active link based on current URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = navbar.querySelectorAll('.nav-link, .dropdown-item');
    
    // First, remove active from all links (in case it was hardcoded)
    navLinks.forEach(link => {
        link.classList.remove('active');
        // If it's a dropdown toggle, we also might need to remove active
        if (link.classList.contains('dropdown-toggle')) {
             link.classList.remove('active');
        }
    });

    navLinks.forEach(link => {
        let href = link.getAttribute('href');
        if (href && currentPath === href.split('/').pop().split('#')[0]) {
            link.classList.add('active');
            
            // If the link is inside a dropdown, highlight the parent dropdown toggle as well
            const dropdownMenu = link.closest('.dropdown-menu');
            if (dropdownMenu) {
                const toggle = dropdownMenu.previousElementSibling;
                if (toggle && toggle.classList.contains('dropdown-toggle')) {
                    toggle.classList.add('active');
                }
            }
        }
    });
};

if (document.getElementById('mainNavbar')) window.initNavbar();
