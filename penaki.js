document.addEventListener('DOMContentLoaded', function() {
    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        function createDots() {
            slides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function goToSlide(slideIndex) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (slideIndex + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            updateDots();
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function startInterval() {
            slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
        }

        createDots();
        startInterval();
    }

    // Scroll Fade-in Animation Observer
    const fadeElements = document.querySelectorAll('.scroll-fade');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // When the element leaves the viewport, remove the 'visible' class. -uvw
                // This resets its state, allowing the animation to restart the next time it enters.
                entry.target.classList.remove('visible');
            }
        });
    }, {
        // A threshold of 0 means the callback will run as soon as the element
        // enters or leaves the viewport. This ensures the animation restarts
        // every time it's scrolled completely out of view and back in. -Utsav 
        threshold: 0
    });
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // File Upload UI
    const fileInput = document.getElementById('file-upload');
    const fileChosen = document.getElementById('file-chosen');

    if (fileInput && fileChosen) {
        fileInput.addEventListener('change', function() {
            fileChosen.textContent = this.files.length > 0 ? this.files[0].name : 'No file chosen';
        });
    }

    // Scroll-controlled Video
    const scrollVideo = document.querySelector('.scroll-video-section video');
    const scrollVideoContainer = document.querySelector('.scroll-video-container');

    if (scrollVideo && scrollVideoContainer) {
        scrollVideo.addEventListener('loadedmetadata', () => {
            scrollVideo.pause();

            function updateVideoOnScroll() {
                const { top } = scrollVideoContainer.getBoundingClientRect();
                const scrollDistance = scrollVideoContainer.offsetHeight - window.innerHeight;

                if (top <= 0 && top >= -scrollDistance) {
                    const progress = Math.max(0, Math.min(1, -top / scrollDistance));
                    if (scrollVideo.duration) {
                        scrollVideo.currentTime = scrollVideo.duration * progress;
                    }
                }
            }

            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateVideoOnScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
            updateVideoOnScroll();
        });
    }

    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });
    }
});