import { displayWorks, setupNavigation, fetchGallery } from './general.js';


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

loadCategories();
setupNavigation(); // Appel de la fonction de navigation

