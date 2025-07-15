import { displayWorks, setupNavigation, fetchGallery } from './general.js';

//CONNEXION TOKEN
const token = localStorage.getItem('token');
document.addEventListener('DOMContentLoaded', async () => {
  const logLink = document.getElementById('Log');

  // Gère le bouton de connexion/déconnexion
  if (token && logLink) {
    logLink.textContent = 'logout';
    logLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token'); // Supprime le token
      window.location.href = './login/login.html'; // Redirige vers la page de connexion
    });
  }

  if (token) {
    document.body.classList.remove('hide-admin');
    document.getElementById('filter').style.display = 'none';
    const { initGalleryAdmin } = await import('./admin/modal.js');
    await initGalleryAdmin(displayWorks); //Appelle la fonction de mise à jour de la galerie

  } else {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    await loadCategories();
  }

  setupNavigation();
});

// --------- Fonction galerie publique avec filtres ---------
//Fonction de filtre de la galerie
async function loadCategories() {
  const response = await fetch('http://localhost:5678/api/categories');
  const categories = await response.json();
  const filterContainer = document.getElementById('filter');

  gallery.innerHTML = '';

  const allBtn = document.createElement('div');
  allBtn.textContent = 'Tous';
  allBtn.classList.add('category');
  filterContainer.appendChild(allBtn);

  const works = await fetchGallery();
  displayWorks(works, { withLink: true });
  allBtn.addEventListener('click', () => {
    displayWorks(works, { withLink: true });
    setActiveFilter(allBtn);
  });

  // Sélectionne le filtre "Tous" par défaut

  setActiveFilter(allBtn);

  categories.forEach(category => {
    const btn = document.createElement('div');
    btn.textContent = category.name;
    btn.classList.add('category');
    btn.classList.add(`category-${category.id}`);
    filterContainer.appendChild(btn);

    btn.addEventListener('click', () => {
      const filtered = works.filter(work => work.categoryId === category.id);
      displayWorks(filtered, { withLink: true });
      setActiveFilter(btn);
    });
  });
}

function setActiveFilter(activeBtn) {
  const buttons = document.querySelectorAll('.category');
  buttons.forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

//Scroll vers la section
document.addEventListener('DOMContentLoaded', () => {
  const contactScroll = window.location.hash; //trouve #contact avec window.location.hash
  if (contactScroll) {
    const ancre = document.querySelector(contactScroll);
    if (ancre) {
      // attend un court délai pour que le contenu soit bien chargé
      setTimeout(() => {
        ancre.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }
});

setupNavigation(); // Appelle la fonction de navigation
