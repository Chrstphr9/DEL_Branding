document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const closeIcon = document.getElementById('closeIcon');
    const servicesLink = document.getElementById('servicesLink');
    const servicesDropdown = document.getElementById('servicesDropdown');
    const sections = document.querySelectorAll('section');
    const navLinkElements = document.querySelectorAll('.nav-links a');

    // Navbar scroll behavior - only shows at top of page
    function handleNavbarScroll() {
        if (!navbar) return;
        
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 10) {
            navbar.classList.remove('hide');
            navbar.classList.add('show');
        } else {
            navbar.classList.remove('show');
            navbar.classList.add('hide');
        }
    }

    // Active link highlighting based on scroll position
    function updateActiveLinks() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinkElements.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Combined scroll handler for performance
    function handleScroll() {
        handleNavbarScroll();
        updateActiveLinks();
    }

    // Mobile menu functions
    function openMobileMenu() {
        if (!navLinks || !hamburgerIcon || !closeIcon) return;
        
        navLinks.classList.add('open');
        hamburgerIcon.classList.add('open');
        closeIcon.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!navLinks || !hamburgerIcon || !closeIcon) return;
        
        navLinks.classList.remove('open');
        hamburgerIcon.classList.remove('open');
        closeIcon.classList.remove('open');
        document.body.style.overflow = '';
    }

    function toggleMobileMenu() {
        if (navLinks && navLinks.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Services dropdown functions
    function showServicesDropdown() {
        if (servicesDropdown && window.innerWidth > 768) {
            // Position dropdown to not affect navbar height
            servicesDropdown.style.position = 'absolute';
            servicesDropdown.style.top = '100%';
            servicesDropdown.style.left = '0';
            servicesDropdown.style.zIndex = '1000';
            servicesDropdown.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            servicesDropdown.style.backdropFilter = 'blur(10px)';
            servicesDropdown.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            servicesDropdown.style.borderRadius = '6px';
            servicesDropdown.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            servicesDropdown.style.minWidth = '180px';
            servicesDropdown.style.padding = '8px 0';
            servicesDropdown.style.display = 'block';
        }
    }

    function toggleServicesDropdown(e) {
        e.preventDefault();
        
        if (window.innerWidth > 768) {
            // Desktop behavior - toggle display style with positioning
            if (servicesDropdown) {
                const isVisible = servicesDropdown.style.display === 'block';
                if (isVisible) {
                    servicesDropdown.style.display = 'none';
                } else {
                    showServicesDropdown();
                }
            }
        } else {
            // Mobile behavior - toggle active class
            if (servicesLink && servicesLink.parentElement) {
                servicesLink.parentElement.classList.toggle('active');
            }
        }
    }

    function hideServicesDropdown() {
        if (servicesDropdown) {
            servicesDropdown.style.display = 'none';
        }
        
        // Also remove mobile active class
        if (servicesLink && servicesLink.parentElement) {
            servicesLink.parentElement.classList.remove('active');
        }
    }

    // Event Listeners
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Close mobile menu when clicking navigation links (except services)
    document.querySelectorAll('.nav-links a:not(#servicesLink)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Services dropdown functionality
    if (servicesLink && servicesDropdown) {
        // Desktop hover behavior
        servicesLink.addEventListener('mouseenter', showServicesDropdown);
        
        // Hide on mouse leave from both link and dropdown
        servicesLink.addEventListener('mouseleave', (e) => {
            // Small delay to allow moving to dropdown
            setTimeout(() => {
                if (!servicesDropdown.matches(':hover') && !servicesLink.matches(':hover')) {
                    hideServicesDropdown();
                }
            }, 100);
        });
        
        servicesDropdown.addEventListener('mouseleave', () => {
            if (!servicesLink.matches(':hover')) {
                hideServicesDropdown();
            }
        });
        
        // Click behavior for both desktop and mobile
        servicesLink.addEventListener('click', toggleServicesDropdown);
    }

    // Global click handler for closing menus/dropdowns
    document.addEventListener('click', (e) => {
        const clickedElement = e.target;
        const isNavbarClick = clickedElement.closest('.navbar');
        const isDropdownClick = clickedElement.closest('.dropdown');
        
        // Close mobile menu when clicking outside navbar
        if (!isNavbarClick && navLinks && navLinks.classList.contains('open')) {
            closeMobileMenu();
        }
        
        // Close services dropdown on desktop when clicking outside
        if (window.innerWidth > 768 && 
            !isDropdownClick && 
            servicesDropdown && 
            servicesDropdown.style.display === 'block') {
            hideServicesDropdown();
        }
        
        // Close mobile dropdown when clicking outside
        if (window.innerWidth <= 768 && 
            !isDropdownClick && 
            navLinks && 
            navLinks.classList.contains('open')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Handle window resize to ensure proper behavior across breakpoints
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Close mobile menu if window is resized to desktop
            closeMobileMenu();
            
            // Reset dropdown display
            if (servicesDropdown) {
                servicesDropdown.style.display = 'none';
            }
        }
    });

    // Initialize navbar state
    handleNavbarScroll();
});