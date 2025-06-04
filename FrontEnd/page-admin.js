document.addEventListener('DOMContentLoaded', () => {
  const logLink = document.getElementById('Log');
  const token = localStorage.getItem('token');

  if (token && logLink) {
    logLink.textContent = 'logout';
    logLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token'); // Supprime le token
      window.location.href = 'login.html'; // Redirige vers la page d’accueil
    });
  }
});

// Fonction pour afficher les œuvres
function displayWorks(works) {
  const gallery = document.getElementById('gallery');
  if (!gallery) return; // Vérification pour éviter les erreurs

  gallery.innerHTML = ''; // Nettoyage avant affichage

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

// Chargement des œuvres
async function loadWorks() {
  const response = await fetch('http://localhost:5678/api/works');
  const works = await response.json();
  displayWorks(works);
  return works;
}

loadWorks();

// Gestion du modal
const modalContainer = document.querySelector('.modal-container');
const modalTrigger = document.querySelectorAll('.modal-trigger');
const galleryView = document.querySelector('.gallery-view');
const addFormView = document.querySelector('.add-form-view');
const newPictureBtn = document.querySelector('.New-Picture');
const backBtn = document.querySelector('.back-to-gallery');
const validateBtn = document.querySelector('.Valider');
const gallery = document.querySelector('.gallery-modal');
const addWorkForm = document.getElementById('.add-work-form');

modalTrigger.forEach(trigger => trigger.addEventListener('click', toggleModal));

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

function displayGallery(works) {
  const gallery = document.querySelector('.gallery-modal');
  if (!gallery) return; // Vérification

  gallery.innerHTML = ''; // Nettoyage avant affichage

  works.forEach(work => {
    const container = document.createElement('div');
    container.className = 'img-modal';

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    container.appendChild(img);
    gallery.appendChild(container);
  });
}

// Fonction pour ouvrir/fermer le modal et afficher la galerie
async function toggleModal() {
  modalContainer.classList.toggle('active');

  if (modalContainer.classList.contains('active')) {
    const works = await fetchGallery();
    displayGallery(works);
  }
}



newPictureBtn.addEventListener('click', () => {
  if (gallery) gallery.innerHTML = "";
  showFormView();
});

document.addEventListener('DOMContentLoaded', () => {
  const addWorkForm = document.getElementById('add-work-form');
  if (!addWorkForm) return;
  addWorkForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addWorkForm);

    try {
      const reponse = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!reponse.ok) {
        throw new Error("Erreur lors de l'ajout de l'œuvre.");
      }
      const newWork = await reponse.json();
      alert('Œuvre ajoutée avec succès !');
      addWorkForm.reset();
      showGalleryView();
      const works = await fetchGallery();
      displayGallery(works);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l’ajout de l’œuvre. Veuillez réessayer.');
    }
  });
});

async function showGalleryView() {
  addFormView.classList.remove('active');
  galleryView.classList.add('active');
  newPictureBtn.classList.remove('hidden');
  validateBtn.classList.remove('active');

  const works = await fetchGallery();
  displayGallery(works);

}


function showFormView() {
  galleryView.classList.remove('active');
  addFormView.classList.add('active');
  newPictureBtn.classList.add('hidden');
  validateBtn.classList.add('active');
}

backBtn.addEventListener('click', showGalleryView);

function previewImage(e) {
  const input = e.target;
  const image = document.getElementById("preview");
  const label = document.getElementById("imageLabel")

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      image.src = e.target.result;
      image.classList.remove("hidden");
      label.style.display = "none";
    }
    reader.readAsDataURL(input.files[0]);
  }
}
document.getElementById("imageInput").addEventListener("change", previewImage);
