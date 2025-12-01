// Navigation toggle and scroll spy
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section');

  // Toggle mobile navigation
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // Close nav when link clicked (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });

  // Scroll spy to highlight current nav link
  function setActiveNav() {
    let index = sections.length;
    while (--index && window.scrollY + 120 < sections[index].offsetTop) {}
    navLinks.forEach(link => link.classList.remove('active'));
    if (sections[index]) {
      const id = sections[index].getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  }
  setActiveNav();
  window.addEventListener('scroll', setActiveNav);

  // Copy to clipboard functionality
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy');
      const text = document.getElementById(targetId).innerText.trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          // show a checkmark after successful copy
          btn.textContent = '✔';
          setTimeout(() => {
            // revert back to clipboard symbol
            btn.textContent = '📋';
          }, 2000);
        }).catch(() => {
          console.warn('Clipboard write failed');
        });
      }
    });
  });

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});