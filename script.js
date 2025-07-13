
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            buildPage(data);
            setupScrollAnimations();
            setupActiveNavLinks();
            setupExperienceToggle(); // Initialize the collapsible experience section
            setupMobileMenu(); // Initialize the mobile menu
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
            // You could display a user-friendly error message on the page here
        });
});

function buildPage(data) {
    const { personalInfo, summary, skills, experience, education, certification } = data;

    // Hero Section
    const hero = document.getElementById('hero');
    hero.innerHTML = `
        <div class="hero-text">
            <h1>Hi, I'm ${personalInfo.name.split(' ')[0]} <span>${personalInfo.name.split(' ').slice(1).join(' ')}</span></h1>
            <p class="subtitle">A passionate ${personalInfo.title} based in Hong Kong.</p>
            <div class="hero-buttons">
                <a href="#contact" class="btn primary">Get In Touch</a>
                <a href="${personalInfo.cvUrl}" class="btn secondary" download>Download CV</a>
            </div>
            <div class="social-links">
                <a href="${personalInfo.socialLinks.linkedin}" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                <a href="${personalInfo.socialLinks.github}" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i></a>
            </div>
        </div>
    `;

    // About Section
    const aboutCard = document.querySelector('#about .card');
    aboutCard.innerHTML = `<p>${summary}</p>`;

    // Skills Section
    const skillsGrid = document.querySelector('#skills .skills-grid');
    skillsGrid.innerHTML = skills.map(skill => `<div class="skill-item skill-${skill.category}">${skill.name}</div>`).join('');

    // Experience Section
    const timeline = document.querySelector('#experience .timeline');
    timeline.innerHTML = experience.map((job, index) => `
        <div class="timeline-item">
            <div class="timeline-content">
                <h3>${job.role}</h3>
                <p class="company">${job.company}</p>
                <p class="period">${job.period}</p>
                <ul class="responsibilities">
                    ${job.responsibilities.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');

    // Education Section
    const educationGrid = document.querySelector('#education .education-grid');
    educationGrid.innerHTML = education.map(edu => `
        <div class="card education-item">
            <h3>${edu.degree}</h3>
            <p>${edu.institution}</p>
            <p class="period">${edu.period}</p>
        </div>
    `).join('');

    // Certification Section
    const certificationGrid = document.querySelector('#certification .certification-grid');
    certificationGrid.innerHTML = certification.map(cert => `
        <div class="card certification-item">
            <h3>${cert.name}</h3>
            <p>${cert.issuer}</p>
            <p class="period">${cert.date}</p>
        </div>
    `).join('');

    // Contact Section
    const contactCard = document.querySelector('#contact .card');
    contactCard.innerHTML = `
        <p>I'm currently open to new opportunities. Feel free to reach out!</p>
        <a href="mailto:${personalInfo.email}" class="contact-email-link">${personalInfo.email}</a>
    `;
}

function setupScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
}

function setupActiveNavLinks() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

function setupExperienceToggle() {
    const experienceItems = document.querySelectorAll('#experience .timeline-content');
    experienceItems.forEach(item => {
        item.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') return;
            item.classList.toggle('open');
        });
    });
}

function setupMobileMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    hamburgerMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    });
}
