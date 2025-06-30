
import { fetchGallery, displayWorks, } from '../general.js';

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

// Modal de la galerie 

//Galery modal + trash 
function displayGallery(works) {
    if (!gallery) return; // Vérification

    backBtn.style.display = 'none';

    gallery.innerHTML = ''; // Nettoyage avant affichage

    works.forEach(work => {
        const container = document.createElement('div');
        container.className = 'img-modal';

        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa-solid fa-trash-can delete-icon';
        deleteIcon.dataset.id = work.id;

        deleteIcon.addEventListener('click', async () => {
            await deleteWork(work.id);
            const worksUpdate = works.filter((w) => w.id !== work.id);
            displayGallery(worksUpdate)
            displayWorks(worksUpdate)

        });

        container.appendChild(img);
        container.appendChild(deleteIcon);
        gallery.appendChild(container);
    });
}


//Affichage de la galerie d'ajout d'oeuvre
async function showGalleryView() {
    addFormView.classList.remove('active');
    galleryView.classList.add('active');
    newPictureBtn.classList.remove('hidden');
    validateBtn.classList.remove('active');
    
    const works = await fetchGallery();
    displayGallery(works);
}

//Vue d'ajout d'œuvre

//reactive la galerie avec la poubelle 
function showFormView() {
    galleryView.classList.remove('active');
    addFormView.classList.add('active');
    newPictureBtn.classList.add('hidden');
    validateBtn.classList.add('active');
    resetAddWorkForm();
}

// Vide tout les champs de l'ajout d'oeuvre et remove en cas de retour en arrière
function resetAddWorkForm() {
    const imageInput = document.getElementById('imageInput');
    const previewImage = document.getElementById('preview');
    const imageLabel = document.getElementById('imageLabel');

    if (!addWorkForm || !imageInput || !previewImage || !imageLabel) return;

    addWorkForm.reset();              // reset les champs texte, select etc
    imageInput.value = "";            // vide le input file (sinon le fichier reste sélectionné)
    previewImage.src = "";            // vide la preview de l'image
    previewImage.classList.add('hidden');  // cache l'image preview
    imageLabel.classList.remove("image-only");
}

// Gestion de l'aperçu de l'image dans le modal d'ajout d'œuvre
function previewImage(e) {
    const input = e.target;
    const image = document.getElementById("preview");
    const label = document.getElementById("imageLabel")

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            image.src = e.target.result;
            image.classList.remove("hidden");
            label.classList.add("image-only");
        }
        reader.readAsDataURL(input.files[0]);
    } else {
        // Si on supprime l'image, on réaffiche le placeholder
        image.src = "";
        image.classList.add("hidden");
    }
}

// function de bloquage du bouton valider
function updateValidateButtonState() {
    const imageInput = document.getElementById('imageInput');

    const isImageSelected = imageInput.files.length > 0;
    const isTitleFilled = titleInput.value.trim() !== '';
    const isCategorySelected = categorySelect.value !== '';

    if (isImageSelected && isTitleFilled && isCategorySelected) {
        validateBtn.disabled = false;
        validateBtn.classList.add('active');
        validateBtn.classList.remove('disabled');
    } else {
        validateBtn.disabled = true;
        validateBtn.classList.add('disabled');
        validateBtn.classList.remove('active');
    }
}

function closeModal() {
    //  Fermer la modale
    modalContainer.classList.remove('active');

    //  Réinitialiser le formulaire 
    resetAddWorkForm();

    //  Nettoyer les champs ajoutés 
    const imagePreview = document.querySelector('.preview');
    if (imagePreview) imagePreview.innerHTML = '';

    // Remet les active de la galerie de la modale 
    addFormView.classList.remove('active');
    galleryView.classList.add('active');
    newPictureBtn.classList.remove('hidden');
    validateBtn.classList.remove('active');
}

async function toggleModal() {
    modalContainer.classList.toggle('active');

    if (modalContainer.classList.contains('active')) {
        const works = await fetchGallery();
        displayGallery(works);
    }
}

const modalContainer = document.querySelector('.modal-container');
const modalTrigger = document.querySelectorAll('.modal-trigger');
const galleryView = document.querySelector('.gallery-view');
const addFormView = document.querySelector('.add-form-view');
const newPictureBtn = document.querySelector('.New-Picture');
const backBtn = document.querySelector('.back-to-gallery');
const validateBtn = document.querySelector('.Valider');
const gallery = document.querySelector('.gallery-modal');
const addWorkForm = document.getElementById('add-work-form');
const titleInput = document.getElementById('textModal');
const categorySelect = document.getElementById('selectModal');
const closeModalBtn = document.querySelector('.close-modal');

// Gestion pour le redémarrage propre du modal après ajout d'une image sans envoie 
modalTrigger.forEach(trigger => trigger.addEventListener('click', toggleModal));
closeModalBtn.addEventListener('click', () => {
    closeModal(); // on appelle la fonction de fermeture proprement
});
backBtn.addEventListener('click', showGalleryView);
//Ajout du bouton retour dans la modal d'ajour d'oeuvre
newPictureBtn.addEventListener('click', () => {
    if (gallery) gallery.innerHTML = "";
    backBtn.style.display = 'block';
    showFormView();
});

document.getElementById('imageInput').addEventListener('click', (e) => {
    e.target.value = ''; // réinitialise la valeur pour autoriser un nouveau choix
});

document.getElementById("imageInput").addEventListener("change", previewImage);

['change', 'input'].forEach(evt => {
    document.getElementById('imageInput').addEventListener(evt, updateValidateButtonState);
    document.getElementById('textModal').addEventListener(evt, updateValidateButtonState);
    document.getElementById('selectModal').addEventListener(evt, updateValidateButtonState);
});
document.addEventListener('DOMContentLoaded', updateValidateButtonState);


export {
    resetAddWorkForm,
    showGalleryView,
    displayGallery,
}