const loginForm = document.querySelector('#connexion');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page quand on clic sur submit.

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ email, password }) // On transforme les données en texte JSON
    });

    if (response.ok) {
      const data = await response.json(); // Récupère le token et l'userId
      localStorage.setItem('token', data.token); // Stocke le token pour les prochaines requêtes
      window.location.href = 'page-admin.html'; // Redirige vers la page utilisateur connecté (à créer toi-même)
  } else {
    const errorMsg = document.getElementById('error');
    errorMsg.textContent = 'Erreur de connexion : email ou mot de passe incorrect.';
    errorMsg.style.color = 'red';
  }

} catch (error) {
  console.error('Erreur lors de la requête :', error);
  document.getElementById("error").textContent = "Erreur de connexion au serveur.";
}
});

