// Handles various interactive features like search bar, animations, and sliders
export function initInteractivity() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchBar = document.querySelector('.search-bar');
    const closeSearch = document.querySelector('.close-search');
    const header = document.querySelector('.header');
    const backToTop = document.querySelector('.back-to-top');

    // Toggles the search bar visibility
    const toggleSearch = () => {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            document.querySelector('#search-input').focus();
        }
    };

    searchToggle.addEventListener('click', toggleSearch);
    closeSearch.addEventListener('click', toggleSearch);

    // Closes the search bar on pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchBar.classList.contains('active')) {
            toggleSearch();
        }
    });

    // Adds a fade effect to the header on scroll
    window.addEventListener('scroll', () => {
        header.classList.toggle('fade', window.scrollY > 50);
    });

    // Smooth scroll to top
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Animates elements when they come into view
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

    // Handles contact form submission
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

    // Image slider logic for hero section
    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        const images = document.querySelectorAll('.hero-image');
        const progressBars = document.querySelectorAll('.progress-bar');
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

        // Updates the active image and progress bar in the slider
        function updateImage(index) {
            images.forEach((image, i) => {
                image.classList.toggle('active', i === index);
                if (i === index) {
                    image.style.animation = 'none';
                    image.offsetHeight; // Trigger reflow
                    image.style.animation = 'zoomIn 7s ease-in-out forwards';
                } else {
                    image.style.animation = 'none';
                }
            });

            progressBars.forEach((bar, i) => {
                bar.classList.toggle('active', i === index);
                const fill = bar.querySelector('.progress-fill');
                if (i === index) {
                    fill.style.animation = 'none';
                    fill.style.width = '0';
                    fill.offsetHeight; // Trigger reflow
                    setTimeout(() => {
                        fill.style.animation = 'fillBar 7s ease-in-out forwards';
                    }, 10);
                } else {
                    fill.style.animation = 'none';
                    fill.style.width = '0';
                }
            });

            imageTitle.textContent = titles[index];
            imageTitle.href = `projects.html?category=${categories[index]}`;
            currentIndex = index;
        }

        // Moves to the next image in the slider
        function nextImage() {
            const newIndex = (currentIndex + 1) % images.length;
            updateImage(newIndex);
        }

        // Moves to the previous image in the slider
        function prevImage() {
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage(newIndex);
        }

        // Initializes the slider on page load
        window.addEventListener('load', () => {
            updateImage(0);
            let imageInterval = setInterval(nextImage, intervalTime);

            // Prev/Next button clicks
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

            // Progress bar clicks
            progressBars.forEach(bar => {
                bar.addEventListener('click', () => {
                    clearInterval(imageInterval);
                    const index = parseInt(bar.getAttribute('data-service'));
                    updateImage(index);
                    imageInterval = setInterval(nextImage, intervalTime);
                });
            });

            // Keyboard arrow key support
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    clearInterval(imageInterval);
                    nextImage();
                    imageInterval = setInterval(nextImage, intervalTime);
                } else if (e.key === 'ArrowLeft') {
                    clearInterval(imageInterval);
                    prevImage();
                    imageInterval = setInterval(nextImage, intervalTime);
                }
            });

            // Mouse swipe support
            let isDragging = false;
            let startX = 0;

            imageContainer.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                imageContainer.style.cursor = 'grabbing'; // Visual feedback
            });

            imageContainer.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const deltaX = e.clientX - startX;
                if (Math.abs(deltaX) > 50) { // Threshold for swipe
                    clearInterval(imageInterval);
                    if (deltaX > 0) {
                        prevImage();
                    } else {
                        nextImage();
                    }
                    isDragging = false; // Reset after swipe
                    imageInterval = setInterval(nextImage, intervalTime);
                }
            });

            imageContainer.addEventListener('mouseup', () => {
                isDragging = false;
                imageContainer.style.cursor = 'grab'; // Reset cursor
            });

            imageContainer.addEventListener('mouseleave', () => {
                isDragging = false;
                imageContainer.style.cursor = 'grab';
            });

            // Touch swipe support for mobile
            imageContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            imageContainer.addEventListener('touchmove', (e) => {
                const deltaX = e.touches[0].clientX - startX;
                if (Math.abs(deltaX) > 50) { // Threshold for swipe
                    clearInterval(imageInterval);
                    if (deltaX > 0) {
                        prevImage();
                    } else {
                        nextImage();
                    }
                    imageInterval = setInterval(nextImage, intervalTime);
                }
            });

            imageContainer.addEventListener('touchend', () => {
                // No action needed, swipe handled in touchmove
            });
        });
    }

    // Project tabs logic for filtering projects
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

    // Project detail logic for displaying project-specific information
    const projectDetailSection = document.querySelector('#project-detail');
    if (projectDetailSection) {
        const projects = {
            'automation1': {
                title: 'Product Detail Drawings Automation',
                inputImage: 'images/projects/Automation/productdetails/before.png',
                outputImage: 'images/projects/Automation/productdetails/after.png',
                overview: 'Creating a complete product detail with schedule by inputting one or more detail models.',
                logic: 'This script automates the generation of detailed drawings and schedules by parsing input models, extracting key parameters, and organizing them into a structured output using Grasshopper and Rhino APIs.',
                inputModel: 'models\model.glb',
                outputModel: 'models\model.glb'
            },
            'automation2': {
                title: '2D Product Cutfiles to 3D Models',
                inputImage: 'images/automation2-before.jpg',
                outputImage: 'images/automation2-after.jpg',
                overview: 'A script that reads cutfiles to produce detail models.',
                logic: 'The script interprets 2D cutfile data (e.g., DXF files), reconstructs the geometry in 3D space using parametric rules, and outputs a fully detailed 3D model in Grasshopper.',
                inputModel: 'models/automation2-before.glb',
                outputModel: 'models/automation2-after.glb'
            },
            'automation3': {
                title: '3D Models to 2D Product Cutfiles',
                inputImage: 'images/automation3-before.jpg',
                outputImage: 'images/automation3-after.jpg',
                overview: 'A script that reads detail models and outputs cutfiles.',
                logic: 'This script deconstructs 3D models into planar sections, generates 2D cut patterns, and exports them as cutfiles (e.g., DXF) optimized for fabrication, leveraging Grasshopper’s geometric analysis.',
                inputModel: 'models/automation3-before.glb',
                outputModel: 'models/automation3-after.glb'
            },
            'automation4': {
                title: 'Controlled Angle Chamfer',
                inputImage: 'images/automation4-before.jpg',
                outputImage: 'images/automation4-after.jpg',
                overview: 'Beveling the edges with any degree or depth when modeling.',
                logic: 'The script applies parametric chamfering to model edges, allowing users to specify angle and depth via inputs, and dynamically updates the geometry using Grasshopper’s computational framework.',
                inputModel: 'models/automation4-before.glb',
                outputModel: 'models/automation4-after.glb'
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
            const project = projects[projectId];
            document.getElementById('project-title').textContent = project.title;

            if (project.inputImage && project.outputImage) {
                document.getElementById('input-image').src = project.inputImage;
                document.getElementById('output-image').src = project.outputImage;
                document.getElementById('project-overview').textContent = project.overview;
                document.getElementById('project-logic').textContent = project.logic;

                // Three.js Setup for Input Viewer
                const inputCanvas = document.getElementById('input-viewer');
                const inputScene = new THREE.Scene();
                inputScene.background = new THREE.Color(0x707070);
                const inputCamera = new THREE.PerspectiveCamera(75, inputCanvas.clientWidth / inputCanvas.clientHeight, 0.1, 1000);
                const inputRenderer = new THREE.WebGLRenderer({ canvas: inputCanvas, antialias: true });
                inputRenderer.setSize(inputCanvas.clientWidth, inputCanvas.clientHeight);
                inputRenderer.gammaFactor = 2.2;
                inputRenderer.gammaOutput = true;
                inputRenderer.toneMapping = THREE.ACESFilmicToneMapping;
                inputRenderer.toneMappingExposure = 1.0;

                const inputGrid = new THREE.GridHelper(50, 50, 0xffffff, 0x888888);
                inputScene.add(inputGrid);

                const inputControls = new THREE.OrbitControls(inputCamera, inputRenderer.domElement);
                inputControls.enableDamping = true;
                inputControls.dampingFactor = 0.1;
                inputControls.screenSpacePanning = true;
                inputControls.minDistance = 1;
                inputControls.maxDistance = 100;

                const inputHemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
                inputScene.add(inputHemiLight);
                const inputDirLight = new THREE.DirectionalLight(0xffffff, 1.5);
                inputDirLight.position.set(10, 10, 10);
                inputScene.add(inputDirLight);
                const inputBackDirLight = new THREE.DirectionalLight(0xffffff, 1);
                inputBackDirLight.position.set(-10, -10, -10);
                inputScene.add(inputBackDirLight);

                const inputLoader = new THREE.GLTFLoader();
                const dracoLoader = new THREE.DRACOLoader();
                dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/');
                inputLoader.setDRACOLoader(dracoLoader);

                inputLoader.load(project.inputModel, (gltf) => {
                    const model = gltf.scene;
                    inputScene.add(model);
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    const maxSize = Math.max(size.x, size.y, size.z);
                    const distance = maxSize * 2.5;
                    inputCamera.position.set(center.x, center.y + maxSize * 1.5, center.z + distance);
                    inputCamera.up = new THREE.Vector3(0, 1, 0);
                    inputCamera.lookAt(center);
                    inputControls.target.set(center.x, center.y, center.z);
                    inputControls.update();

                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.geometry.computeVertexNormals();
                            const material = new THREE.MeshStandardMaterial({
                                roughness: 0.5,
                                metalness: 0.2,
                                color: child.material.color || 0xaaaaaa,
                                map: child.material.map,
                                emissive: child.material.emissive,
                                normalMap: child.material.normalMap,
                                bumpMap: child.material.bumpMap,
                                side: THREE.DoubleSide,
                                transparent: child.material.transparent || false,
                                opacity: child.material.opacity !== undefined ? child.material.opacity : 1
                            });
                            child.material = material;
                        }
                    });
                }, undefined, (error) => {
                    console.error('Error loading input model:', error);
                });

                function animateInput() {
                    requestAnimationFrame(animateInput);
                    inputControls.update();
                    inputRenderer.render(inputScene, inputCamera);
                }
                animateInput();

                // Three.js Setup for Output Viewer
                const outputCanvas = document.getElementById('output-viewer');
                const outputScene = new THREE.Scene();
                outputScene.background = new THREE.Color(0x707070);
                const outputCamera = new THREE.PerspectiveCamera(75, outputCanvas.clientWidth / outputCanvas.clientHeight, 0.1, 1000);
                const outputRenderer = new THREE.WebGLRenderer({ canvas: outputCanvas, antialias: true });
                outputRenderer.setSize(outputCanvas.clientWidth, outputCanvas.clientHeight);
                outputRenderer.gammaFactor = 2.2;
                outputRenderer.gammaOutput = true;
                outputRenderer.toneMapping = THREE.ACESFilmicToneMapping;
                outputRenderer.toneMappingExposure = 1.0;

                const outputGrid = new THREE.GridHelper(50, 50, 0xffffff, 0x888888);
                outputScene.add(outputGrid);

                const outputControls = new THREE.OrbitControls(outputCamera, outputRenderer.domElement);
                outputControls.enableDamping = true;
                outputControls.dampingFactor = 0.1;
                outputControls.screenSpacePanning = true;
                outputControls.minDistance = 1;
                outputControls.maxDistance = 100;

                const outputHemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
                outputScene.add(outputHemiLight);
                const outputDirLight = new THREE.DirectionalLight(0xffffff, 1.5);
                outputDirLight.position.set(10, 10, 10);
                outputScene.add(outputDirLight);
                const outputBackDirLight = new THREE.DirectionalLight(0xffffff, 1);
                outputBackDirLight.position.set(-10, -10, -10);
                outputScene.add(outputBackDirLight);

                const outputLoader = new THREE.GLTFLoader();
                outputLoader.setDRACOLoader(dracoLoader);

                outputLoader.load(project.outputModel, (gltf) => {
                    const model = gltf.scene;
                    outputScene.add(model);
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    const maxSize = Math.max(size.x, size.y, size.z);
                    const distance = maxSize * 2.5;
                    outputCamera.position.set(center.x, center.y + maxSize * 1.5, center.z + distance);
                    outputCamera.up = new THREE.Vector3(0, 1, 0);
                    outputCamera.lookAt(center);
                    outputControls.target.set(center.x, center.y, center.z);
                    outputControls.update();

                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.geometry.computeVertexNormals();
                            const material = new THREE.MeshStandardMaterial({
                                roughness: 0.5,
                                metalness: 0.2,
                                color: child.material.color || 0xaaaaaa,
                                map: child.material.map,
                                emissive: child.material.emissive,
                                normalMap: child.material.normalMap,
                                bumpMap: child.material.bumpMap,
                                side: THREE.DoubleSide,
                                transparent: child.material.transparent || false,
                                opacity: child.material.opacity !== undefined ? child.material.opacity : 1
                            });
                            child.material = material;
                        }
                    });
                }, undefined, (error) => {
                    console.error('Error loading output model:', error);
                });

                function animateOutput() {
                    requestAnimationFrame(animateOutput);
                    outputControls.update();
                    outputRenderer.render(outputScene, outputCamera);
                }
                animateOutput();

                // Extend/Contract Logic for 3D Viewers
                const extendButtons = document.querySelectorAll('.extend-btn');
                extendButtons.forEach(button => {
                    const viewerType = button.getAttribute('data-viewer');
                    const canvas = document.getElementById(`${viewerType}-viewer`);
                    const originalContainer = canvas.parentElement; // Store original container reference
                    const originalSize = { width: originalContainer.clientWidth, height: originalContainer.clientHeight }; // Store original size
                    let modalDiv = null;
                    let backdrop = null;

                    button.addEventListener('click', () => {
                        const isExpanded = canvas.parentElement.classList.contains('viewer-modal');

                        if (!isExpanded) {
                            // Expand logic
                            modalDiv = document.createElement('div');
                            modalDiv.classList.add('viewer-modal');
                            modalDiv.appendChild(canvas);

                            backdrop = document.createElement('div');
                            backdrop.classList.add('viewer-modal-backdrop');
                            document.body.appendChild(backdrop);
                            document.body.appendChild(modalDiv);

                            button.innerHTML = `
                                <svg class="contract-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="9" y1="3" x2="9" y2="21"></line>
                                    <line x1="15" y1="3" x2="15" y2="21"></line>
                                </svg>
                            `;
                            button.setAttribute('aria-label', 'Contract Viewer');
                            modalDiv.appendChild(button);

                            resizeCanvas(modalDiv, viewerType);

                            backdrop.addEventListener('click', contractViewer);
                        } else {
                            // Contract logic
                            contractViewer();
                        }
                    });

                    function contractViewer() {
                        if (!originalContainer) {
                            console.error(`Original container not defined for ${viewerType}`);
                            return;
                        }
                        originalContainer.appendChild(canvas);
                        originalContainer.appendChild(button);
                        if (modalDiv) modalDiv.remove();
                        if (backdrop) backdrop.remove();

                        button.innerHTML = `
                            <svg class="expand-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="3" y1="9" x2="21" y2="9"></line>
                                <line x1="3" y1="15" x2="21" y2="15"></line>
                            </svg>
                        `;
                        button.setAttribute('aria-label', 'Expand Viewer');

                        resizeCanvas(originalContainer, viewerType, originalSize);
                    }

                    function resizeCanvas(container, viewerType, size = null) {
                        const width = size ? size.width : container.clientWidth;
                        const height = size ? size.height : container.clientHeight;

                        if (viewerType === 'input') {
                            inputCamera.aspect = width / height;
                            inputCamera.updateProjectionMatrix();
                            inputRenderer.setSize(width, height);
                        } else {
                            outputCamera.aspect = width / height;
                            outputCamera.updateProjectionMatrix();
                            outputRenderer.setSize(width, height);
                        }
                    }

                    // Ensure canvas resizes correctly on window resize
                    window.addEventListener('resize', () => {
                        if (canvas.parentElement.classList.contains('viewer-modal')) {
                            resizeCanvas(modalDiv, viewerType);
                        } else {
                            resizeCanvas(originalContainer, viewerType, originalSize);
                        }
                    });
                });

                // Resize event for both viewers
                window.addEventListener('resize', () => {
                    if (!inputCanvas.parentElement.classList.contains('viewer-modal')) {
                        inputCamera.aspect = inputCanvas.clientWidth / inputCanvas.clientHeight;
                        inputCamera.updateProjectionMatrix();
                        inputRenderer.setSize(inputCanvas.clientWidth, inputCanvas.clientHeight);
                    } else {
                        const modal = inputCanvas.parentElement;
                        inputCamera.aspect = modal.clientWidth / modal.clientHeight;
                        inputCamera.updateProjectionMatrix();
                        inputRenderer.setSize(modal.clientWidth, modal.clientHeight);
                    }

                    if (!outputCanvas.parentElement.classList.contains('viewer-modal')) {
                        outputCamera.aspect = outputCanvas.clientWidth / outputCanvas.clientHeight;
                        outputCamera.updateProjectionMatrix();
                        outputRenderer.setSize(outputCanvas.clientWidth, outputCanvas.clientHeight);
                    } else {
                        const modal = outputCanvas.parentElement;
                        outputCamera.aspect = modal.clientWidth / modal.clientHeight;
                        outputCamera.updateProjectionMatrix();
                        outputRenderer.setSize(modal.clientWidth, modal.clientHeight);
                    }
                });
            } else {
                document.getElementById('input-image').style.display = 'none';
                document.getElementById('output-image').style.display = 'none';
                document.querySelector('.image-slider').style.display = 'none';
                document.querySelector('.project-overview').style.display = 'none';
                document.querySelector('.project-logic').style.display = 'none';
                document.querySelector('.model-viewers').style.display = 'none';
                document.getElementById('project-overview').textContent = project.description;
            }
        } else {
            document.getElementById('project-title').textContent = 'Project Not Found';
            document.querySelector('.image-slider').style.display = 'none';
            document.querySelector('.project-overview').textContent = 'Sorry, the project you are looking for does not exist.';
            document.querySelector('.project-logic').style.display = 'none';
            document.querySelector('.model-viewers').style.display = 'none';
        }

        // Image Slider Logic (unchanged)
        const sliderHandle = document.querySelector('.slider-handle');
        const sliderContainer = document.querySelector('.slider-container');
        const inputImage = document.querySelector('.slider-image.input');
        if (sliderHandle && sliderContainer && inputImage) {
            let isDragging = false;

            sliderHandle.addEventListener('mousedown', () => {
                isDragging = true;
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const rect = sliderContainer.getBoundingClientRect();
                let x = e.clientX - rect.left;
                if (x < 0) x = 0;
                if (x > rect.width) x = rect.width;
                sliderHandle.style.left = `${x}px`;
                inputImage.style.clipPath = `inset(0 ${rect.width - x}px 0 0)`;
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            sliderHandle.addEventListener('touchstart', () => {
                isDragging = true;
            });

            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const rect = sliderContainer.getBoundingClientRect();
                let x = e.touches[0].clientX - rect.left;
                if (x < 0) x = 0;
                if (x > rect.width) x = rect.width;
                sliderHandle.style.left = `${x}px`;
                inputImage.style.clipPath = `inset(0 ${rect.width - x}px 0 0)`;
            });

            document.addEventListener('touchend', () => {
                isDragging = false;
            });

            const rect = sliderContainer.getBoundingClientRect();
            sliderHandle.style.left = `${rect.width / 2}px`;
            inputImage.style.clipPath = `inset(0 ${rect.width / 2}px 0 0)`;
        }
    }

    // Scroll to top on page load
    window.addEventListener('load', () => window.scrollTo(0, 0));
}