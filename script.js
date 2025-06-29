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
  const nameChars = data.personalInfo.name.split('').map((char, index) => {
    const delay = index * 0.05; // Staggered delay for each character
    return `<span class="name-char" style="animation-delay: ${delay}s;">${char === ' ' ? '&nbsp;' : char}</span>`;
  }).join('');

  hero.innerHTML = `
    <h1 id="hero-name">${nameChars}</h1>
    <a href="mailto:${data.personalInfo.email}" class="cta-button primary-button">Get In Touch</a>
    <a href="${data.personalInfo.cvUrl}" class="cta-button secondary-button" download>Download CV</a>
    <div class="social-icons">
      <a href="${data.personalInfo.socialLinks.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>
      <a href="${data.personalInfo.socialLinks.github}" target="_blank"><i class="fab fa-github"></i></a>
    </div>
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
  let experienceHtml = `<h2>Experience</h2>`;

  if (data.experience.length > 0) {
    // Display the latest job (first in the array)
    const latestJob = data.experience[0];
    experienceHtml += `
      <div class="job">
        <h3>${latestJob.role} - ${latestJob.company}</h3>
        <p class="period">${latestJob.period}</p>
        <div>
          <ul>
            ${latestJob.responsibilities.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    // If there are more jobs, create the "Other Experience" section
    if (data.experience.length > 1) {
      const otherJobs = data.experience.slice(1);
      experienceHtml += `
        <div class="other-experience-toggle card">
          <h3>Show Other Experiences <i class="fas fa-chevron-down"></i></h3>
        </div>
        <div id="other-experience-content" style="display: none;">
          ${otherJobs.map(job => `
            <div class="job">
              <h3 class="job-header-clickable">${job.role} - ${job.company}</h3>
              <p class="period">${job.period}</p>
              <div class="job-responsibilities-content" style="display: none;">
                <ul>
                  ${job.responsibilities.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }
  experience.innerHTML = experienceHtml;
  setupOtherExperienceToggle(); // Call the new function after building the page
  setupIndividualJobToggles(); // Call the new function to set up individual job toggles

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

  const contact = document.getElementById('contact');
  contact.innerHTML = `
    <h2>Contact Me</h2>
    <p>Feel free to reach out via email or connect with me on social media.</p>
    <p><strong>Email:</strong> <a href="mailto:${data.personalInfo.email}">${data.personalInfo.email}</a></p>
    <p><strong>Phone:</strong> ${data.personalInfo.tel}</p>
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

  setupNameAnimation(); // Call the new function for name animation
}

function setupNameAnimation() {
  const heroName = document.getElementById('hero-name');
  if (!heroName) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        heroName.classList.add('name-animated');
        observer.unobserve(heroName);
      }
    },
    { threshold: 0.5 } // Trigger when 50% of the element is visible
  );

  observer.observe(heroName);
}

function setupOtherExperienceToggle() {
  const toggleButton = document.querySelector('.other-experience-toggle');
  const content = document.getElementById('other-experience-content');
  const icon = toggleButton ? toggleButton.querySelector('i') : null;
  const heading = toggleButton ? toggleButton.querySelector('h3') : null;

  if (toggleButton && content && heading) {
    toggleButton.addEventListener('click', () => {
      if (content.style.display === 'none') {
        content.style.display = 'block';
        if (icon) icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        heading.innerHTML = 'Hide Other Experiences <i class="fas fa-chevron-up"></i>';
      } else {
        content.style.display = 'none';
        if (icon) icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
        heading.innerHTML = 'Show Other Experiences <i class="fas fa-chevron-down"></i>';
      }
    });
  }
}

function setupIndividualJobToggles() {
  const jobHeaders = document.querySelectorAll('.job-header-clickable');

  jobHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling.nextElementSibling; // Get the .job-responsibilities-content div
      if (content) {
        if (content.style.display === 'none') {
          content.style.display = 'block';
        } else {
          content.style.display = 'none';
        }
      }
    });
  });
}
