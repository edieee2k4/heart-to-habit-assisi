document.addEventListener('DOMContentLoaded', () => {
    
    // Force browser to start at the absolute top of the page on load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // --- Phase 1: Entrance Doors ---
    const ropeButton = document.getElementById('rope-button');
    const doorOverlay = document.getElementById('door-overlay');
    const body = document.body;

    ropeButton.addEventListener('click', () => {
        // Start untying animation
        ropeButton.classList.add('untying');
        
        // After untying finishes, open doors
        setTimeout(() => {
            doorOverlay.classList.add('open');
            
            // Allow scrolling after doors open
            setTimeout(() => {
                body.classList.remove('locked-scroll');
                // Ensure they are at the top when doors open
                window.scrollTo(0, 0);
            }, 1800); // Wait for 3D door animation
        }, 800); // Wait for SVG rope animation
    });

    // --- Phase 1.5: Envelope Interaction ---
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    if (envelopeWrapper) {
        envelopeWrapper.addEventListener('click', () => {
            envelopeWrapper.classList.toggle('open');
        });
    }

    // --- Phase 2: Fade-in on Scroll ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve once shown
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeSections = document.querySelectorAll('.fade-in-section');
    fadeSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Phase 3: Quote Carousel ---
    const quoteCards = document.querySelectorAll('.quote-card');
    const dots = document.querySelectorAll('.dot');
    let currentQuote = 0;
    const totalQuotes = quoteCards.length;
    let carouselInterval;

    function showQuote(index) {
        // Remove active class from all
        quoteCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active to current
        quoteCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentQuote = index;
    }

    function nextQuote() {
        let nextIndex = (currentQuote + 1) % totalQuotes;
        showQuote(nextIndex);
    }

    // Auto cycle every 5 seconds
    carouselInterval = setInterval(nextQuote, 5000);

    // Allow manual click on dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(carouselInterval); // pause auto-rotate
            showQuote(index);
            carouselInterval = setInterval(nextQuote, 5000); // restart auto-rotate
        });
    });

    // --- Phase 4: Video Autoplay on Scroll ---
    const videoElement = document.getElementById('vocation-video');
    const unmuteBadge = document.getElementById('unmute-badge');
    const videoWrapper = document.querySelector('.video-wrapper-interactive');

    if (videoElement) {
        // Toggle sound visually cleanly via clicks
        if (videoWrapper) {
            videoWrapper.addEventListener('click', () => {
                if (videoElement.muted) {
                    videoElement.muted = false;
                    if (unmuteBadge) unmuteBadge.classList.add('hidden');
                } else {
                    videoElement.muted = true;
                    if (unmuteBadge) unmuteBadge.classList.remove('hidden');
                }
            });
        }

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    videoElement.muted = true; // Guarantee muted state for autoplay
                    videoElement.play().catch(e => {
                        console.log('Autoplay prevented by browser policies:', e);
                    });
                } else {
                    videoElement.pause();
                }
            });
        }, { threshold: 0.1 }); // Trigger as soon as 10% is visible
        
        videoObserver.observe(videoElement);
    }

});
