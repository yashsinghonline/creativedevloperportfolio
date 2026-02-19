  // ==================== LOADER ====================
        let percent = 0;
        const percentEl = document.getElementById('loaderPercent');
        const loader = document.getElementById('loader');
        
        const loadInterval = setInterval(() => {
            percent++;
            percentEl.textContent = percent;
            if (percent >= 100) {
                clearInterval(loadInterval);
                setTimeout(() => {
                    loader.classList.add('hidden');
                    initAnimations();
                }, 300);
            }
        }, 15);

        // ==================== NAVIGATION ====================
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const navbar = document.getElementById('navbar');

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        function closeMobileMenu() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            updateScrollProgress();
            toggleScrollTop();
        });

        // ==================== PAGE NAVIGATION ====================
        const pageTransition = document.getElementById('pageTransition');

        function navigateTo(pageName) {
            const currentPage = document.querySelector('.page.active');
            const targetPage = document.getElementById(`page-${pageName}`);
            
            if (!targetPage || currentPage === targetPage) return;
            
            // Start transition
            pageTransition.classList.add('active');
            
            setTimeout(() => {
                currentPage.classList.remove('active');
                targetPage.classList.add('active');
                window.scrollTo(0, 0);
                
                // Exit transition
                pageTransition.classList.remove('active');
                pageTransition.classList.add('exit');
                
                setTimeout(() => {
                    pageTransition.classList.remove('exit');
                    initAnimations();
                }, 600);
            }, 600);
            
            closeMobileMenu();
        }

        function scrollToSection(sectionId) {
            // First go to home if not there
            const homePage = document.getElementById('page-home');
            if (!homePage.classList.contains('active')) {
                navigateTo('home');
                setTimeout(() => {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 700);
            } else {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
            closeMobileMenu();
        }

        // ==================== SCROLL PROGRESS ====================
        function updateScrollProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            document.getElementById('scrollProgress').style.width = progress + '%';
        }

        // ==================== SCROLL TO TOP ====================
        const scrollTopBtn = document.getElementById('scrollTop');

        function toggleScrollTop() {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ==================== REVEAL ANIMATIONS ====================
        function initAnimations() {
            const reveals = document.querySelectorAll('.reveal');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            reveals.forEach(el => {
                el.classList.remove('active');
                observer.observe(el);
            });
            
            // Animate counters
            animateCounters();
        }

        // ==================== COUNTER ANIMATION ====================
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                if (!target) return;
                
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        let current = 0;
                        const increment = target / 50;
                        
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.textContent = Math.floor(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target;
                            }
                        };
                        
                        updateCounter();
                        observer.disconnect();
                    }
                }, { threshold: 0.5 });
                
                observer.observe(counter);
            });
        }

        // ==================== FORM HANDLING ====================
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const btn = this.querySelector('button[type="submit"]');
                const originalHTML = btn.innerHTML;
                
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                    btn.style.background = '#22c55e';
                    
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.style.background = '';
                        btn.disabled = false;
                        this.reset();
                    }, 2000);
                }, 1500);
            });
        }

        // ==================== SMOOTH SCROLL ====================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // ==================== KEYBOARD NAVIGATION ====================
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        document.addEventListener('DOMContentLoaded', () => {
    const ghost = document.querySelector('.ghost-wrapper');
    const ghostBody = document.querySelector('.ghost-body');
    const ghostFace = document.querySelector('.ghost-face');
    const bubble = document.querySelector('.ghost-speech-bubble');
    const heroSection = document.querySelector('.hero'); // Ensure this matches your parent container class

    const HAPPY_DISTANCE = 300;
    let isBubbleOpen = false;

    // 1. RANDOM FLOATING LOGIC
    function moveRandomly() {
        if (!heroSection || !ghost) return;

        // Get Hero Boundaries
        const parentW = heroSection.offsetWidth;
        const parentH = heroSection.offsetHeight;

        // Set Safety Margins (so it doesn't clip edge)
        const padX = 100;
        const padY = 100;

        // Generate Random X/Y within boundaries
        const randomX = Math.floor(Math.random() * (parentW - (padX * 2))) + padX;
        const randomY = Math.floor(Math.random() * (parentH - (padY * 2))) + padY;

        // Apply Position
        ghost.style.left = `${randomX}px`;
        ghost.style.top = `${randomY}px`;

        // Loop movement every 4 to 6 seconds
        const nextTime = Math.random() * 2000 + 4000;
        setTimeout(moveRandomly, nextTime);
    }

    // Start Moving
    moveRandomly();

    // 2. MOUSE FACE TRACKING
    document.addEventListener('mousemove', (e) => {
        if (!ghost) return;

        const rect = ghost.getBoundingClientRect();
        const ghostX = rect.left + rect.width / 2;
        const ghostY = rect.top + rect.height / 2;

        const dx = e.clientX - ghostX;
        const dy = e.clientY - ghostY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Move Face
        const xMove = Math.min(Math.max(dx / 20, -12), 12);
        const yMove = Math.min(Math.max(dy / 20, -10), 10);
        ghostFace.style.transform = `translate(${xMove}px, ${yMove}px)`;

        // Happy Expression
        if (distance < HAPPY_DISTANCE) {
            ghostBody.classList.add('happy');
        } else {
            ghostBody.classList.remove('happy');
        }
    });

    // 3. CLICK TO SHOW SOCIAL BUBBLE
    ghost.addEventListener('click', (e) => {
        // Prevent closing if clicking links inside bubble
        if (e.target.closest('.ghost-speech-bubble')) return;

        isBubbleOpen = !isBubbleOpen;
        
        if (isBubbleOpen) {
            bubble.classList.add('visible');
            // Little jump effect
            ghostBody.style.transform = "scale(1.05) translateY(-10px)";
            setTimeout(() => ghostBody.style.transform = "", 200);
        } else {
            bubble.classList.remove('visible');
        }
    });

    // Close bubble when clicking anywhere else on page
    document.addEventListener('click', (e) => {
        if (isBubbleOpen && !ghost.contains(e.target)) {
            isBubbleOpen = false;
            bubble.classList.remove('visible');
        }
    });
});
       
