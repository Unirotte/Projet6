
function displayWorks(works) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  works.forEach(work => {
    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement('figcaption');
    caption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
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

