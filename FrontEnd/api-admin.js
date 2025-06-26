export { fetchGallery, deleteWork, displayWorks };
import { showGalleryView, updateAllGalleries } from './modal.js';

//TOKEN CONNEXION
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

  const addWorkForm = document.getElementById('add-work-form');
  if (addWorkForm) {
    addWorkForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(addWorkForm);
      try {
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }
        const reponse = await fetch('http://localhost:5678/api/works', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        //Message API pour l'ajout d'une œuvre
        const responseText = await reponse.text(); // <-- récupère la réponse brute (même en cas d'erreur)
        console.log("Réponse brute de l'API :", responseText);
        if (!reponse.ok) {
          throw new Error("Erreur lors de l'ajout de l'œuvre.");
        }

        alert('Œuvre ajoutée avec succès !');
        addWorkForm.reset();
        showGalleryView();

        await updateAllGalleries();

      } catch (error) {
        console.error(error);
        alert('Erreur lors de l’ajout de l’œuvre. Veuillez réessayer.');
      }
    });
  }
});

// Chargement des œuvres
async function loadWorks() {
  const response = await fetch('http://localhost:5678/api/works');
  const works = await response.json();
  displayWorks(works);
  return works;
}
loadWorks();

//API
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

//function de suppression avec l'api 
async function deleteWork(id) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': '*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur de suppression (code ${response.status})`);
    }
    alert('Œuvre supprimer avec succès !');
    console.log(`Œuvre ${id} supprimée`);
  } catch (error) {
    console.error('Erreur :', error);
    alert("Échec de la suppression de l'œuvre.");
  }
}


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