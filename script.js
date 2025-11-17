        // Custom Cursor
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .work-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });

        // GSAP Animations
        gsap.registerPlugin(ScrollTrigger);

        // Hero text animation
        const heroLines = document.querySelectorAll('.hero__title span > span');
        gsap.to(heroLines, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out',
            delay: 0.5
        });

        // Video Scroll Logic
        const videoScrollSection = document.querySelector('.video-scroll');
        const videoItems = document.querySelectorAll('.video-scroll__item');
        const totalVideos = videoItems.length;

        ScrollTrigger.create({
            trigger: videoScrollSection,
            start: 'top top',
            end: 'bottom bottom',
            pin: '.video-scroll__container',
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const currentIndex = Math.floor(progress * totalVideos);
                const clampedIndex = Math.min(currentIndex, totalVideos - 1);

                videoItems.forEach((item, index) => {
                    if (index === clampedIndex) {
                        item.classList.add('active');
                        const video = item.querySelector('video');
                        if (video.paused) {
                            video.play().catch(e => console.log('Video play prevented'));
                        }
                    } else {
                        item.classList.remove('active');
                        const video = item.querySelector('video');
                        video.pause();
                    }
                });
            }
        });

        // Play first video
        const firstVideo = videoItems[0].querySelector('video');
        firstVideo.play().catch(e => console.log('First video play prevented'));

        // Fade in animations
        gsap.utils.toArray('.service, .work-item, .testimonial').forEach(element => {
            gsap.from(element, {
                y: 100,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    end: 'top 60%',
                    scrub: 1
                }
            });
        });

        // Stats counter
        gsap.utils.toArray('.stat__number').forEach(stat => {
            const finalValue = stat.textContent;
            const numericValue = parseInt(finalValue);
            
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 80%',
                onEnter: () => {
                    gsap.from(stat, {
                        innerText: 0,
                        duration: 2,
                        snap: { innerText: 1 },
                        onUpdate: function() {
                            stat.innerText = Math.ceil(this.targets()[0].innerText) + (finalValue.includes('+') ? '+' : '');
                        }
                    });
                }
            });
        });

        // Work item video hover
        document.querySelectorAll('.work-item').forEach(item => {
            const video = item.querySelector('video');
            
            item.addEventListener('mouseenter', () => {
                if (video.paused) {
                    video.play().catch(e => {});
                }
            });

            item.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        });

        // Contact form
        document.getElementById('contactForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('.contact__submit');
            const message = document.getElementById('formMessage');
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            message.classList.add('show');
            e.target.reset();

            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;

            setTimeout(() => {
                message.classList.remove('show');
            }, 5000);
        });

        // Smooth scroll for navigation
        document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Parallax hero video
        gsap.to('.hero__video', {
            y: 300,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Section titles animation
        gsap.utils.toArray('.about__title, .services__title, .work__title, .testimonials__title, .contact__title').forEach(title => {
            gsap.from(title, {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%'
                }
            });
        });

        // Mobile cursor handling
        if (window.innerWidth <= 768) {
            cursor.style.display = 'none';
            cursorFollower.style.display = 'none';
        }

        // Showreel Player Controls
        const showreelVideo = document.getElementById('showreelVideo');
        const playBtn = document.getElementById('playBtn');
        const progressFill = document.getElementById('progressFill');
        const timeDisplay = document.getElementById('timeDisplay');
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');

        // Play/Pause toggle
        playBtn.addEventListener('click', () => {
            if (showreelVideo.paused) {
                showreelVideo.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                showreelVideo.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        });

        // Click video to play/pause
        showreelVideo.addEventListener('click', () => {
            playBtn.click();
        });

        // Update progress bar
        showreelVideo.addEventListener('timeupdate', () => {
            const progress = (showreelVideo.currentTime / showreelVideo.duration) * 100;
            progressFill.style.width = progress + '%';
            
            // Update time display
            const currentMinutes = Math.floor(showreelVideo.currentTime / 60);
            const currentSeconds = Math.floor(showreelVideo.currentTime % 60);
            const durationMinutes = Math.floor(showreelVideo.duration / 60);
            const durationSeconds = Math.floor(showreelVideo.duration % 60);
            
            timeDisplay.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
        });

        // Click progress bar to seek
        const progressBar = document.querySelector('.showreel__progress-bar');
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            showreelVideo.currentTime = percentage * showreelVideo.duration;
        });

        // Video ended
        showreelVideo.addEventListener('ended', () => {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        });

        // Showreel scroll animation
        gsap.from('.showreel__player', {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: '.showreel',
                start: 'top 70%'
            }
        });

        // Marquee animation on scroll
        gsap.from('.marquee__content', {
            opacity: 0,
            y: 100,
            duration: 1,
            scrollTrigger: {
                trigger: '.marquee-section',
                start: 'top 80%'
            }
        });

        // Card Stack Carousel Functionality
        const cardStackWrapper = document.getElementById('cardStackWrapper');
        const stackCards = document.querySelectorAll('.stack-card');
        const cardPrev = document.getElementById('cardPrev');
        const cardNext = document.getElementById('cardNext');
        const cardStackCarousel = document.getElementById('cardStackCarousel');
        
        let currentCardIndex = 2; // Start with middle card active
        let isCardDragging = false;
        let cardStartX = 0;

        function updateCardPositions() {
            stackCards.forEach((card, index) => {
                const video = card.querySelector('.stack-card-video');
                
                // Remove all position classes
                card.classList.remove('active', 'left-1', 'left-2', 'right-1', 'right-2', 'hidden');
                
                const diff = index - currentCardIndex;
                
                if (diff === 0) {
                    card.classList.add('active');
                    video.play().catch(e => {});
                } else if (diff === -1) {
                    card.classList.add('left-1');
                    video.pause();
                } else if (diff === -2) {
                    card.classList.add('left-2');
                    video.pause();
                } else if (diff === 1) {
                    card.classList.add('right-1');
                    video.pause();
                } else if (diff === 2) {
                    card.classList.add('right-2');
                    video.pause();
                } else {
                    card.classList.add('hidden');
                    video.pause();
                }
            });
        }

        function goToCard(index) {
            if (index < 0) index = 0;
            if (index >= stackCards.length) index = stackCards.length - 1;
            currentCardIndex = index;
            updateCardPositions();
        }

        // Arrow navigation
        cardPrev.addEventListener('click', () => {
            goToCard(currentCardIndex - 1);
        });

        cardNext.addEventListener('click', () => {
            goToCard(currentCardIndex + 1);
        });

        // Mouse drag
        cardStackCarousel.addEventListener('mousedown', (e) => {
            isCardDragging = true;
            cardStartX = e.clientX;
            cardStackCarousel.style.cursor = 'grabbing';
        });

        cardStackCarousel.addEventListener('mousemove', (e) => {
            if (!isCardDragging) return;
            const currentX = e.clientX;
            const diff = currentX - cardStartX;
            
            if (Math.abs(diff) > 100) {
                if (diff > 0) {
                    goToCard(currentCardIndex - 1);
                } else {
                    goToCard(currentCardIndex + 1);
                }
                isCardDragging = false;
                cardStackCarousel.style.cursor = 'grab';
            }
        });

        cardStackCarousel.addEventListener('mouseup', () => {
            isCardDragging = false;
            cardStackCarousel.style.cursor = 'grab';
        });

        cardStackCarousel.addEventListener('mouseleave', () => {
            isCardDragging = false;
            cardStackCarousel.style.cursor = 'grab';
        });

        // Touch support
        let touchStartX = 0;

        cardStackCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        cardStackCarousel.addEventListener('touchmove', (e) => {
            if (!touchStartX) return;
            const touchEndX = e.touches[0].clientX;
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > 80) {
                if (diff > 0) {
                    goToCard(currentCardIndex - 1);
                } else {
                    goToCard(currentCardIndex + 1);
                }
                touchStartX = 0;
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                goToCard(currentCardIndex - 1);
            } else if (e.key === 'ArrowRight') {
                goToCard(currentCardIndex + 1);
            }
        });

        // Mouse wheel
        cardStackCarousel.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                goToCard(currentCardIndex + 1);
            } else {
                goToCard(currentCardIndex - 1);
            }
        }, { passive: false });

        // Initialize
        updateCardPositions();

        // Scroll animation
        gsap.from('.card-stack-section', {
            opacity: 0,
            y: 100,
            duration: 1,
            scrollTrigger: {
                trigger: '.card-stack-section',
                start: 'top 70%'
            }
        });