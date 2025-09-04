document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    
    const populateContent = () => {
        document.getElementById('welcome-greeting').textContent = portfolioData.welcome.greeting;
        document.getElementById('profile-photo').src = portfolioData.about.photo;
        document.getElementById('about-description').textContent = portfolioData.about.description;
        
        const aboutDetailsList = document.getElementById('about-details');
        portfolioData.about.details.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `${item.svg} <span>${item.text}</span>`;
            aboutDetailsList.appendChild(li);
        });

        const createSkillItem = (skill) => `
            <div class="skill-item">
                <p><span>${skill.name}</span><span>${skill.level}</span></p>
                <div class="progress-bar">
                    <div class="progress" data-level="${skill.level}"></div>
                </div>
            </div>`;

        document.getElementById('frontend-skills').innerHTML = portfolioData.skills.frontend.map(createSkillItem).join('');
        document.getElementById('backend-skills').innerHTML = portfolioData.skills.backend.map(createSkillItem).join('');

        const istriGallery = document.getElementById('istri-gallery');
        portfolioData.istri.forEach(item => {
            const card = document.createElement('div');
            card.className = 'istri-card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="istri-card-name">${item.name}</div>
                <div class="istri-card-overlay">
                    <div class="istri-card-info">
                        <h4>${item.name}</h4>
                        <p class="series">${item.series}</p>
                        <p class="description">${item.description}</p>
                    </div>
                </div>`;
            istriGallery.appendChild(card);
        });
        
        document.getElementById('contact-intro').textContent = portfolioData.contact.intro;
        const contactList = document.getElementById('contact-channels');
        portfolioData.contact.channels.forEach(item => {
            const link = document.createElement('a');
            link.className = 'contact-item';
            link.href = item.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.innerHTML = `
                ${item.svg}
                <div class="contact-item-text">
                    <div class="contact-text">${item.text}</div>
                    <div class="contact-handle">${item.handle}</div>
                </div>`;
            contactList.appendChild(link);
        });

        document.getElementById('year').textContent = new Date().getFullYear();
    };

    const typeRoleText = async () => {
        const el = document.getElementById('role-text');
        const roles = portfolioData.welcome.roles;
        let roleIndex = 0;
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        while (true) {
            let currentRole = roles[roleIndex];
            for (let i = 0; i < currentRole.length; i++) {
                el.textContent = currentRole.substring(0, i + 1);
                await sleep(100);
            }
            await sleep(2000);
            for (let i = currentRole.length; i > 0; i--) {
                el.textContent = currentRole.substring(0, i - 1);
                await sleep(50);
            }
            await sleep(500);
            roleIndex = (roleIndex + 1) % roles.length;
        }
    };
    
    const setupTheme = () => {
        const themeSwitcher = document.getElementById('theme-switcher');
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);

        themeSwitcher.addEventListener('click', () => {
            const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    };

    const setupNavbar = () => {
        const hamburgerMenu = document.getElementById('hamburger-menu');
        const navbar = document.querySelector('.navbar');
        const header = document.querySelector('.header');
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navbar a');

        const updateActiveLink = () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - header.offsetHeight - 80) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active-link');
                }
            });
        };

        hamburgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            navbar.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !hamburgerMenu.contains(e.target)) {
                navbar.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            }
        });

        document.querySelectorAll('.navbar a, .logo, .scroll-down, .back-to-top').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navbar.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
            updateActiveLink();
        });
        updateActiveLink();
    };

    const setupAnimations = () => {
        const backToTop = document.querySelector('.back-to-top');
        const revealElements = document.querySelectorAll('.reveal');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.id === 'skills') {
                        entry.target.querySelectorAll('.progress').forEach(bar => {
                            bar.style.width = bar.dataset.level;
                        });
                    }
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));

        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 300);
        });
    };

    const setupInteractiveElements = () => {
        const photoContainer = document.getElementById('photo-container');
        const photo = document.getElementById('profile-photo');
        const shapes = ['shape-hexagon', 'shape-square', 'shape-circle'];
        let currentShapeIndex = 0;

        photoContainer.addEventListener('click', () => {
            if (photo.classList.contains('is-changing')) return;

            photo.classList.add('is-changing');

            setTimeout(() => {
                currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
                photo.className = '';
                photo.classList.add(shapes[currentShapeIndex]);
                
                setTimeout(() => {
                    photo.classList.remove('is-changing');
                }, 50);
            }, 300);
        });

        const istriGallery = document.getElementById('istri-gallery');
        istriGallery.addEventListener('click', (e) => {
            const card = e.target.closest('.istri-card');
            if (!card) return;

            const wasActive = card.classList.contains('active');
            document.querySelectorAll('.istri-card.active').forEach(c => c.classList.remove('active'));
            if (!wasActive) card.classList.add('active');
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.istri-card')) {
                document.querySelectorAll('.istri-card.active').forEach(c => c.classList.remove('active'));
            }
        });
    };
    
    const setupBackgrounds = () => {
        const pCanvas = document.getElementById('particle-canvas');
        const mCanvas = document.getElementById('meteor-canvas');
        const pCtx = pCanvas.getContext('2d');
        const mCtx = mCanvas.getContext('2d');
        let particles = [];
        let meteors = [];
        let width = pCanvas.width = mCanvas.width = window.innerWidth;
        let height = pCanvas.height = mCanvas.height = window.innerHeight;

        class Particle {
            constructor() { this.x = Math.random() * width; this.y = Math.random() * height; this.vx = Math.random() * 0.4 - 0.2; this.vy = Math.random() * 0.4 - 0.2; this.radius = Math.random() * 1.5 + 0.5; }
            draw(ctx) {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                const isDark = html.getAttribute('data-theme') === 'dark';
                const color = isDark ? `rgba(160, 160, 192, ${Math.random() * 0.5 + 0.2})` : `rgba(106, 90, 205, ${Math.random() * 0.5 + 0.2})`;
                ctx.fillStyle = color; ctx.fill();
            }
            update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > width) this.vx *= -1; if (this.y < 0 || this.y > height) this.vy *= -1; }
        }

        class Meteor {
            constructor() {
                this.x = Math.random() * width;
                this.y = -10;
                this.length = Math.random() * 80 + 20;
                this.speed = Math.random() * 5 + 3;
                this.angle = Math.PI / 5;
            }
            draw(ctx) {
                ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
                const gradient = ctx.createLinearGradient(0, 0, -this.length, 0);
                gradient.addColorStop(0, 'rgba(127, 90, 240, 0.7)');
                gradient.addColorStop(1, 'rgba(127, 90, 240, 0)');
                ctx.strokeStyle = gradient; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-this.length, 0); ctx.stroke(); ctx.restore();
            }
            update() {
                this.x += this.speed * Math.cos(this.angle);
                this.y += this.speed * Math.sin(this.angle);
            }
            isOffScreen() {
                return this.y > height + 100 || this.x > width + 100;
            }
        }
        
        function spawnMeteor() {
            if (meteors.length < 4) { 
                meteors.push(new Meteor());
            }
            setTimeout(spawnMeteor, Math.random() * 4000 + 1000);
        }

        function init() {
            particles = [];
            const pCount = window.innerWidth < 768 ? 40 : 80;
            for (let i = 0; i < pCount; i++) particles.push(new Particle());
            spawnMeteor();
        }

        function animate() {
            pCtx.clearRect(0, 0, width, height);
            mCtx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(pCtx); });
            
            if (html.getAttribute('data-theme') === 'dark') {
                meteors.forEach(m => { m.update(); m.draw(mCtx); });
                meteors = meteors.filter(m => !m.isOffScreen());
            }
            
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => { width = pCanvas.width = mCanvas.width = window.innerWidth; height = pCanvas.height = mCanvas.height = window.innerHeight; init(); });
        
        init();
        animate();
    };

    populateContent();
    typeRoleText();
    setupTheme();
    setupNavbar();
    setupAnimations();
    setupInteractiveElements();
    setupBackgrounds();
});