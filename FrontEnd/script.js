import { displayWorks, setupNavigation } from './general.js';


async function loadWorks() {
  const response = await fetch('http://localhost:5678/api/works');
  const works = await response.json();
  displayWorks(works, { withLink: true });
  return works;
}

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

  const allWorks = await loadWorks();

  allBtn.addEventListener('click', () => {
    displayWorks(allWorks, { withLink: true });
    setActiveFilter(allBtn);
  });
 
  // Selectionne le filtre "Tous" par défaut
  displayWorks(allWorks, { withLink: true });
  setActiveFilter(allBtn);

  categories.forEach(category => {
    const btn = document.createElement('div');
    btn.textContent = category.name;
    btn.classList.add('category');
    btn.classList.add(`category-${category.id}`);
    filterContainer.appendChild(btn);

    btn.addEventListener('click', () => {
      const filtered = allWorks.filter(work => work.categoryId === category.id);
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

loadWorks();
loadCategories();
setupNavigation(); // Appel de la fonction de navigation
//Function de la galerie
displayWorks(works, { withLink: true })

