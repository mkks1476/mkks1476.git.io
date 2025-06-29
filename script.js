document.documentElement.classList.remove('no-js');

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      buildPage(data);
      setupAnimations();
    });
});

function buildPage(data) {
  // Hero Section
  const hero = document.getElementById('hero');
  hero.innerHTML = `
    <h1>${data.personalInfo.name}</h1>
    <p>${data.personalInfo.title}</p>
    <a href="mailto:${data.personalInfo.email}" class="cta-button">Get In Touch</a>
    <a href="${data.personalInfo.cvUrl}" class="cta-button" download>Download CV</a>
  `;

  // About Section
  const about = document.getElementById('about');
  about.innerHTML = `
    <h2>About Me</h2>
    <p>${data.summary}</p>
  `;

  // Skills Section
  const skills = document.getElementById('skills');
  skills.innerHTML = `
    <h2>Skills</h2>
    <ul class="skills-list">${data.skills.map(skill => `<li>${skill}</li>`).join('')}</ul>
  `;

  // Experience Section
  const experience = document.getElementById('experience');
  experience.innerHTML = `
    <h2>Experience</h2>
    ${data.experience.map(job => `
      <div class="job">
        <h3>${job.role} - ${job.company}</h3>
        <p class="period">${job.period}</p>
        <ul>
          ${job.responsibilities.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  `;

  // Education Section
  const education = document.getElementById('education');
  education.innerHTML = `
    <h2>Education</h2>
    ${data.education.map(edu => `
      <div class="education-item">
        <h3>${edu.degree}</h3>
        <p>${edu.institution}</p>
        <p class="period">${edu.period}</p>
      </div>
    `).join('')}
  `;
  
    // Certification Section
  const certification = document.getElementById('certification');
  certification.innerHTML = `
    <h2>Certification</h2>
    ${data.certification.map(cert => `
      <div class="certification-item">
        <h3>${cert.name}</h3>
        <p>${cert.issuer}</p>
        <p class="period">${cert.date}</p>
      </div>
    `).join('')}
  `;

  // Contact Section
  const contact = document.getElementById('contact');
  contact.innerHTML = `
    <h2>Contact</h2>
    <p>Email: <a href="mailto:${data.personalInfo.email}">${data.personalInfo.email}</a></p>
    <p>Phone: ${data.personalInfo.tel}</p>
  `;
}

function setupAnimations() {
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
