//Gestion de la navigation
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active')); // Enlève l'active des autres
      link.classList.add('active'); // Active le lien cliqué
    });
  });
});
document.querySelectorAll('nav a').forEach(link => {
  if (window.location.href.includes(link.getAttribute('href'))) {
    link.classList.add('active');
  }
});
