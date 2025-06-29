//Gestion de la navigation
export function setupNavigation() {
  document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
   
    navLinks.forEach(link => {   
      link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active')); // Enlève l'active des autres
        link.classList.add('active'); // Active le lien cliqué
      });
    });
    //active le lien correspondant à la page au chargement
    navLinks.forEach(link => {
      if (window.location.pathname.includes(link.getAttribute('href'))) {
        link.classList.add('active');
      }
    });
  });
}

//gallery
function displayWorks(works, { withLink = false } = {}) {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  gallery.innerHTML = '';

  works.forEach(work => {
    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement('figcaption');
    caption.textContent = work.title;

    if (withLink) {
      const link = document.createElement('a');
      link.href = work.imageUrl;
      link.target = '_blank';
      link.appendChild(img);
      figure.appendChild(link);
    } else {
      figure.appendChild(img);
    }

    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

async function fetchGallery() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) throw new Error('Erreur lors de la récupération des données');
    const works = await response.json();
    return works;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export { displayWorks, fetchGallery };