const authSections = document.querySelectorAll('.page-auth-login, .page-auth-reg');

function initAuthAccordion() {
  authSections.forEach((section) => {
    const header = section.querySelector('div');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = section.classList.contains('open');
      authSections.forEach((otherSection) => otherSection.classList.remove('open'));
      if (!isOpen) {
        section.classList.add('open');
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthAccordion);
} else {
  initAuthAccordion();
}
