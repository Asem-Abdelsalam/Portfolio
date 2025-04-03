export function initInteractivity() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchBar = document.querySelector('.search-bar');
    const closeSearch = document.querySelector('.close-search');

    const toggleSearch = () => {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            document.querySelector('#search-input').focus();
        }
    };

    searchToggle.addEventListener('click', toggleSearch);
    closeSearch.addEventListener('click', toggleSearch);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchBar.classList.contains('active')) {
            toggleSearch();
        }
    });

    const elementsToAnimate = document.querySelectorAll('.section, .project-item, .skills-grid li, .languages-grid li');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });

    const contactForm = document.querySelector('#contact-form');
    const formFeedback = document.querySelector('#form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.querySelector('#name').value.trim();
            const email = document.querySelector('#email').value.trim();
            const message = document.querySelector('#message').value.trim();

            if (name && email && message) {
                formFeedback.textContent = 'Message sent successfully.';
                formFeedback.classList.add('show');
                contactForm.reset();
                setTimeout(() => {
                    formFeedback.classList.remove('show');
                }, 3000);
            } else {
                formFeedback.textContent = 'Please fill in all fields.';
                formFeedback.classList.add('show');
                setTimeout(() => {
                    formFeedback.classList.remove('show');
                }, 3000);
            }
        });
    }

    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
        const videos = document.querySelectorAll('.hero-video');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.video-nav.prev');
        const nextBtn = document.querySelector('.video-nav.next');
        const videoTitle = document.querySelector('#video-title');
        let currentIndex = 0;
        const intervalTime = 7000;

        const titles = [
            "Parametric Design Study",
            "Structural Optimization",
            "Fabrication Process"
        ];

        function updateVideo(index) {
            videos.forEach((video, i) => {
                video.classList.toggle('active', i === index);
                if (i === index) {
                    video.play().catch(() => {
                        console.log('Video playback failed.');
                    });
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            videoTitle.textContent = titles[index];
            currentIndex = index;
        }

        function nextVideo() {
            const newIndex = (currentIndex + 1) % videos.length;
            updateVideo(newIndex);
        }

        function prevVideo() {
            const newIndex = (currentIndex - 1 + videos.length) % videos.length;
            updateVideo(newIndex);
        }

        window.addEventListener('load', () => {
            videos[0].play().catch(() => {
                console.log('Initial video playback failed.');
            });
            let videoInterval = setInterval(nextVideo, intervalTime);

            nextBtn.addEventListener('click', () => {
                clearInterval(videoInterval);
                nextVideo();
                videoInterval = setInterval(nextVideo, intervalTime);
            });

            prevBtn.addEventListener('click', () => {
                clearInterval(videoInterval);
                prevVideo();
                videoInterval = setInterval(nextVideo, intervalTime);
            });

            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    clearInterval(videoInterval);
                    const index = parseInt(dot.getAttribute('data-index'));
                    updateVideo(index);
                    videoInterval = setInterval(nextVideo, intervalTime);
                });
            });
        });
    }

    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
    });
}