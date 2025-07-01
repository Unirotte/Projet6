import { showGalleryView, displayGallery } from './modal.js';
import { displayWorks, setupNavigation, fetchGallery, } from '../general.js';

//TOKEN CONNEXION
document.addEventListener('DOMContentLoaded', async () => {
  const logLink = document.getElementById('Log');
  const token = localStorage.getItem('token');

  if (token && logLink) {
    logLink.textContent = 'logout';
    logLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token'); // Supprime le token
      window.location.href = '../login/login.html'; // Redirige vers la page d’accueil
    });
  }

  const works = await fetchGallery()
  displayWorks(works)
  console.log(works)
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
        const responseJson = await reponse.json(); // <-- récupère la réponse brute (même en cas d'erreur)
        const updateGallery = [...works,responseJson]
        displayGallery(updateGallery);
        displayWorks(updateGallery);
        console.log("Réponse brute de l'API :", responseJson);
        if (!reponse.ok) {
          throw new Error("Erreur lors de l'ajout de l'œuvre.");
        }
        alert('Œuvre ajoutée avec succès !');
        addWorkForm.reset();
        showGalleryView();
      } catch (error) {
        console.error(error);
        alert('Erreur lors de l’ajout de l’œuvre. Veuillez réessayer.');
      }
    });
  }
});


setupNavigation(); // Appel de la fonction de navigation
