import { setupNavigation } from '../general.js';

const loginForm = document.querySelector('#connexion');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevents the page from reloading when clicking submit.

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ email, password }) // Converts the data to JSON text
    });

    if (response.ok) {
      const data = await response.json(); // Retrieves the token and userId
      localStorage.setItem('token', data.token); // Stores the token for future requests
      window.location.href = '../index.html'; // Redirects to the connected user page
  } else {
    const errorMsg = document.getElementById('error');
    errorMsg.textContent = 'Erreur de connexion : email ou mot de passe incorrect.';
  }

} catch (error) {
  console.error('Erreur lors de la requête :', error);
  document.getElementById("error").textContent = "Erreur de connexion au serveur.";
}
});

setupNavigation(); // Call the navigation function
