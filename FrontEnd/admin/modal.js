
import { fetchGallery, displayWorks, } from '../general.js';

// Sélection des éléments du DOM
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


// Supprimer une œuvre
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

    } catch (error) {
        console.error('Erreur :', error);
        alert("Échec de la suppression de l'œuvre.");
    }
}

// Mettre à jour la galerie
async function updateGallery(withLink = false) {
    try {
        const works = await fetchGallery();
        displayWorks(works, withLink);
    } catch (error) {
        console.error("Erreur lors du chargement de la galerie :", error);
    }
}

// Affichage de la galerie dans la modale + icône de suppression
function displayGallery(works) {
    if (!gallery) {
        console.warn("Élément .gallery-modal introuvable !");
        return;
    }
    gallery.innerHTML = "";
    backBtn.style.display = 'none';

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
            const updatedWorks = await fetchGallery();
            showGalleryView(updatedWorks); // Réafficher la galerie après suppression
            displayWorks(updatedWorks, { withLink: true });
        });

        container.appendChild(img);
        container.appendChild(deleteIcon);
        gallery.appendChild(container);
    });
}

// Afficher la vue galerie (ajout d'œuvre)
async function showGalleryView(works = null) {
    addFormView.classList.remove('active');
    galleryView.classList.add('active');
    newPictureBtn.classList.remove('hidden');
    validateBtn.classList.remove('active');

    gallery.innerHTML = "";
    const galleryWorks = works || await fetchGallery();
    displayGallery(galleryWorks);
}

// Réactiver la galerie avec la corbeille
function showFormView() {
    galleryView.classList.remove('active');
    addFormView.classList.add('active');
    newPictureBtn.classList.add('hidden');
    validateBtn.classList.add('active');
    resetAddWorkForm();
}

// === FONCTIONS DE GESTION DU FORMULAIRE ===

// Réinitialiser tous les champs du formulaire d'ajout d'œuvre et nettoyer si retour
function resetAddWorkForm() {
    const imageInput = document.getElementById('imageInput');
    const previewImage = document.getElementById('preview');
    const imageLabel = document.getElementById('imageLabel');

    if (!addWorkForm || !imageInput || !previewImage || !imageLabel) return;

    addWorkForm.reset();              // reset text, select fields etc
    imageInput.value = "";            // clear the file input (otherwise the file remains selected)
    previewImage.src = "";            // clear the image preview
    previewImage.classList.add('hidden');  // hide the image preview
    imageLabel.classList.remove("image-only");
    updateValidateButtonState(); // update the state of the validate button
}

// Gérer l'aperçu de l'image dans la modale d'ajout d'œuvre
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
        // If the image is deleted, show the placeholder again
        image.src = "";
        image.classList.add("hidden");
    }
}

// Fonction pour activer/désactiver le bouton valider
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

// Croix (bouton de fermeture)
function closeModal() {
    // Fermer la modale
    modalContainer.classList.remove('active');

    // Réinitialiser le formulaire
    resetAddWorkForm();

    // Nettoyer les champs ajoutés
    const imagePreview = document.querySelector('.preview');
    if (imagePreview) imagePreview.innerHTML = '';

    // Réinitialiser les états actifs de la galerie modale
    addFormView.classList.remove('active');
    galleryView.classList.add('active');
    newPictureBtn.classList.remove('hidden');
    validateBtn.classList.remove('active');
}

// Fonction pour ouvrir/fermer la modale
async function toggleModal() {
    modalContainer.classList.toggle('active');

    if (modalContainer.classList.contains('active')) {
        const works = await fetchGallery();
        showGalleryView(works);
    }
}

// === INITIALISATION ===
// Initialisation de la galerie admin, gestion de l'ajout d'œuvres
async function initGalleryAdmin() {
    await updateGallery(true);

    if (addWorkForm) {
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
                alert('Œuvre ajoutée avec succès !');
                addWorkForm.reset();
                

                const updatedWorks = await fetchGallery()
                displayWorks(updatedWorks, true);
                displayGallery(updatedWorks);
                showGalleryView(updatedWorks);


            } catch (error) {
                console.error(error);
                alert('Erreur lors de l’ajout de l’œuvre. Veuillez réessayer.');
            }
        });
    }
}

// ========== ÉVÉNEMENTS ========== //
// Gérer la réinitialisation correcte de la modale après ajout d'une image sans envoi
modalTrigger.forEach(trigger => trigger.addEventListener('click', toggleModal));
closeModalBtn.addEventListener('click', () => {
    closeModal(); // appel correct de la fonction de fermeture
});
backBtn.addEventListener('click', async () => {
    const updatedWorks = await fetchGallery();
    showGalleryView(updatedWorks);
});
// Ajouter le bouton retour dans la modale d'ajout d'œuvre
newPictureBtn.addEventListener('click', () => {
    if (gallery) gallery.innerHTML = "";
    backBtn.style.display = 'block';
    showFormView();
});

document.getElementById('imageInput').addEventListener('click', (e) => {
    e.target.value = ''; // réinitialiser la valeur pour permettre une nouvelle sélection

});

document.getElementById("imageInput").addEventListener("change", previewImage);

['change', 'input'].forEach(evt => {
    document.getElementById('imageInput').addEventListener(evt, updateValidateButtonState);
    document.getElementById('textModal').addEventListener(evt, updateValidateButtonState);
    document.getElementById('selectModal').addEventListener(evt, updateValidateButtonState);
});
document.addEventListener('DOMContentLoaded', updateValidateButtonState);

// ========== EXPORTS ========== //
export {
    resetAddWorkForm,
    showGalleryView,
    displayGallery,
    initGalleryAdmin,
}

