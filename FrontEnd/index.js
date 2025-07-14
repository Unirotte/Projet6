import { displayWorks, setupNavigation, fetchGallery } from './general.js';

//TOKEN CONNECTION
const token = localStorage.getItem('token');
document.addEventListener('DOMContentLoaded', async () => {
  const logLink = document.getElementById('Log');

  // Handles the login/logout button
  if (token && logLink) {
    logLink.textContent = 'logout';
    logLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token'); // Removes the token
      window.location.href = './login/login.html'; // Redirects to the home page
    });
  }

  if (token) {
    document.body.classList.remove('hide-admin');
    document.getElementById('filter').style.display = 'none';
    const { initGalleryAdmin } = await import('./admin/modal.js');
    await initGalleryAdmin(displayWorks); //Call the gallery update function

  } else {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    await loadCategories();
  }

  setupNavigation();
});

// --------- Public gallery function with filters ---------
//Gallery filter function
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

  // Selects the "All" filter by default

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

//Scroll towards the section
document.addEventListener('DOMContentLoaded', () => {
  const contactScroll = window.location.hash; //finds #contact using w.l.hash 
  if (contactScroll) {
    const ancre = document.querySelector(contactScroll);
    if (ancre) {
      // wait a short delay for the content to be fully loaded
      setTimeout(() => {
        ancre.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }
});

setupNavigation(); // Call the navigation function
