import { initGalleryAdmin, } from './modal.js';
import { displayWorks, setupNavigation, } from '../general.js';

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
  await initGalleryAdmin(displayWorks); //appel de la function de mise a jour de la galerie
});


setupNavigation(); // Appel de la fonction de navigation
