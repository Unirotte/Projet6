
function displayWorks(works) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  works.forEach(work => {
    const figure = document.createElement('figure');

    const link = document.createElement('a');
    link.href = work.imageUrl; // URL de l'image en grand format
    link.target = '_blank'; // Ouvre dans un nouvel onglet

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement('figcaption');
    caption.textContent = work.title;

    link.appendChild(img); // Ajoute l'image dans le lien
    figure.appendChild(link); // Ajoute le lien dans la figure
    figure.appendChild(caption); // Ajoute la légende

    gallery.appendChild(figure); // Ajoute la figure à la galerie

  });
}
async function loadWorks() {
  const response = await fetch('http://localhost:5678/api/works');
  const works = await response.json();
  displayWorks(works);
  return works;
}

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
    displayWorks(allWorks);
    setActiveFilter(allBtn);
  });

  categories.forEach(category => {
    const btn = document.createElement('div');
    btn.textContent = category.name;
    btn.classList.add('category');
    btn.classList.add(`category-${category.id}`);
    filterContainer.appendChild(btn);

    btn.addEventListener('click', () => {
      const filtered = allWorks.filter(work => work.categoryId === category.id);
      displayWorks(filtered);
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
