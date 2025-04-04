// Interactivity Logic
export function initInteractivity() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchBar = document.querySelector('.search-bar');
    const closeSearch = document.querySelector('.close-search');
    const header = document.querySelector('.header');
    const backToTop = document.querySelector('.back-to-top');

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

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('fade');
        } else {
            header.classList.remove('fade');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

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
                setTimeout(() => formFeedback.classList.remove('show'), 3000);
            } else {
                formFeedback.textContent = 'Please fill in all fields.';
                formFeedback.classList.add('show');
                setTimeout(() => formFeedback.classList.remove('show'), 3000);
            }
        });
    }

    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        const images = document.querySelectorAll('.hero-image');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.image-nav.prev');
        const nextBtn = document.querySelector('.image-nav.next');
        const imageTitle = document.querySelector('#image-title');
        let currentIndex = 0;
        const intervalTime = 7000;
        const titles = [
            "Grasshopper Scripting for Automation",
            "Grasshopper Scripting for Digital Fabrication",
            "Architectural Parametric Modeling",
            "Parametric Furniture Design"
        ];
        const categories = [
            "automation",
            "fabrication",
            "parametric-modeling",
            "furniture-design"
        ];

        function updateImage(index) {
            images.forEach((image, i) => {
                image.classList.toggle('active', i === index);
                if (i === index) {
                    image.style.animation = 'none'; // Reset animation
                    image.offsetHeight; // Trigger reflow
                    image.style.animation = 'zoomIn 7s linear forwards'; // Reapply animation
                }
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
                const dotCircle = dot.querySelector('.dot-circle');
                const loadingCircle = dot.querySelector('.loading-circle');
                if (i === index) {
                    dotCircle.style.opacity = '1';
                    loadingCircle.style.animation = 'none';
                    loadingCircle.offsetHeight;
                    loadingCircle.style.animation = 'drawCircle 7s linear forwards';
                } else {
                    dotCircle.style.opacity = '0.3';
                    loadingCircle.style.animation = 'none';
                    loadingCircle.setAttribute('stroke-dashoffset', '50.27');
                }
            });
            imageTitle.textContent = titles[index];
            imageTitle.href = `projects.html?category=${categories[index]}`;
            currentIndex = index;
        }

        function nextImage() {
            const newIndex = (currentIndex + 1) % images.length;
            updateImage(newIndex);
        }

        function prevImage() {
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage(newIndex);
        }

        window.addEventListener('load', () => {
            updateImage(0); // Start with first image
            let imageInterval = setInterval(nextImage, intervalTime);

            nextBtn.addEventListener('click', () => {
                clearInterval(imageInterval);
                nextImage();
                imageInterval = setInterval(nextImage, intervalTime);
            });

            prevBtn.addEventListener('click', () => {
                clearInterval(imageInterval);
                prevImage();
                imageInterval = setInterval(nextImage, intervalTime);
            });

            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    clearInterval(imageInterval);
                    const index = parseInt(dot.getAttribute('data-service'));
                    updateImage(index);
                    imageInterval = setInterval(nextImage, intervalTime);
                });
            });
        });
    }

    // Project Tabs Logic
    const projectTabs = document.querySelector('.project-tabs');
    if (projectTabs) {
        const tabButtons = document.querySelectorAll('.tab-button');
        const projectItems = document.querySelectorAll('.project-item');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-tab');

                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                projectItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    item.style.display = category === itemCategory ? 'block' : 'none';
                });
            });
        });

        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            const matchingButton = document.querySelector(`.tab-button[data-tab="${category}"]`);
            if (matchingButton) {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                matchingButton.classList.add('active');
                projectItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    item.style.display = category === itemCategory ? 'block' : 'none';
                });
            }
        } else {
            projectItems.forEach(item => {
                item.style.display = item.getAttribute('data-category') === 'automation' ? 'block' : 'none';
            });
        }
    }

    // Project Detail Logic
    const projectDetailSection = document.querySelector('#project-detail');
    if (projectDetailSection) {
        const projects = {
            'automation1': {
                title: 'Workflow Optimization Tool',
                image: 'images/automation-project1.jpg',
                description: 'A Grasshopper script automating repetitive design tasks, reducing time by 40%. This project leverages computational design to streamline workflows, integrating Rhino and Grasshopper for precision and efficiency.'
            },
            'fabrication1': {
                title: 'Parametric Facade Panels',
                image: 'images/fabrication-project1.jpg',
                description: 'Grasshopper-driven design for CNC-cut facade panels with optimized material use. This project demonstrates the power of parametric modeling in digital fabrication, ensuring both aesthetic appeal and structural integrity.'
            },
            'parametric1': {
                title: 'Complex Roof Structure',
                image: 'images/parametric-project1.jpg',
                description: 'Parametric model of a dynamic roof system adapting to environmental factors. Built with Grasshopper, this project showcases advanced computational techniques for architectural innovation.'
            },
            'furniture1': {
                title: 'Custom Parametric Chair',
                image: 'images/furniture-project1.jpg',
                description: 'A chair design with adjustable parameters for ergonomics and aesthetics. This project uses Grasshopper to create a flexible, user-centric design adaptable to various preferences and needs.'
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        if (projectId && projects[projectId]) {
            document.getElementById('project-title').textContent = projects[projectId].title;
            document.getElementById('project-image').src = projects[projectId].image;
            document.getElementById('project-image').alt = projects[projectId].title;
            document.getElementById('project-description').textContent = projects[projectId].description;
        } else {
            document.getElementById('project-title').textContent = 'Project Not Found';
            document.getElementById('project-description').textContent = 'Sorry, the project you are looking for does not exist.';
        }
    }

    window.addEventListener('load', () => window.scrollTo(0, 0));
}