import { displayWorks, setupNavigation, fetchGallery } from './general.js';
import { initGalleryAdmin,
} from './admin/modal.js';


//TOKEN CONNEXION
const token = localStorage.getItem('token');
document.addEventListener('DOMContentLoaded', async () => {
  const logLink = document.getElementById('Log');

  // gère le bouton login/logout
  if (token && logLink) {
    logLink.textContent = 'logout';
    logLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token'); // Supprime le token
      window.location.href = './login/login.html'; // Redirige vers la page d’accueil
    });
  }

  if (token) {
    document.querySelectorAll('.admin-only').forEach(el => el.computedStyleMap.display = 'block');
    document.getElementById('filter').style.display = 'none';
    const { initGalleryAdmin } = await import('./admin/modal.js');
    await initGalleryAdmin(displayWorks); //appel de la function de mise a jour de la galerie

  } else {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    await loadCategories();
  }

  setupNavigation();
});

// --------- Fonction galerie publique avec filtres ---------
//function du filtre de la galerie
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

  // Selectionne le filtre "Tous" par défaut

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

//scroll en direction de la section
document.addEventListener('DOMContentLoaded', () => {
  const contactScroll = window.location.hash; //trouve le #contact grâce au w.l.hash 
  if (contactScroll) {
    const ancre = document.querySelector(contactScroll);
    if (ancre) {
      // attendre un petit délai que le contenu soit bien chargé
      setTimeout(() => {
        ancre.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }
});

initGalleryAdmin();
setupNavigation(); // Appel de la fonction de navigation

