console.log("Bonjour modale.js");

// Affichage de la modale à l'initial avec le résultat du retour de l'api et lancement ajout d'un element html ( ajout Work ) sans relncer l'API
function createModalHtml(worksData) {
    const containerModalGallery = document.querySelector(".gallery-edit");

    // Fonction pour ajouter un seul travail à la galerie modal
    const addModalWork = (modalWork) => {
        const figure = document.createElement("figure");
        const imgFigure = document.createElement("img");
        const divFigure = document.createElement("div");
        const iconFigure = document.createElement("i");
        imgFigure.src = modalWork.imageUrl;

        figure.appendChild(imgFigure);
        figure.appendChild(divFigure);
        divFigure.appendChild(iconFigure);

        containerModalGallery.appendChild(figure);

        divFigure.classList.add("logo");
        iconFigure.classList.add("fa-solid", "fa-trash-can");
        iconFigure.id = modalWork.id; // Assignation de l'icone à l'icone trash correspondant
        console.log(iconFigure.id);
    };

    // Vérifie si worksData est un tableau ou non ( pour utilisation de la même fonction à l'ouverture de la page via Fetch et MAJ d'un element html lors de l'ajout Work)
    if (Array.isArray(worksData)) {
        // Si c'est un tableau ( résultat du retour de l'API initial ), construire l'httml initial
        worksData.forEach(modalWork => addModalWork(modalWork));
    } else {
        // Ajout d'un element Html en cas d'ajout de Work sans faire Appel à l'API ( si la variable à traiter n'est pas un tablaau )
        addModalWork(worksData);
    }
}


// Affichage des Works dans la modale  au click sur le libellé "modifier" en mode édiiton

// Lancement de la création de  la structure html avec les  données works dans la modale ( 1° ouverture ) sans relancer  l'appel API
async function majModalWorks() {
    const worksData = await recupererWorksData();
    createModalHtml(worksData); 
}


// Gestion de l'ouverture et fermeture de la modale et sous modale
document.addEventListener("DOMContentLoaded", function() {
    const modalContainer = document.querySelector(".modal-container");
    var modal = document.getElementById('modal');
    var modalAdd = document.getElementById('modal-add');
    var overlay = document.getElementsByClassName('overlay')[0];
    var returnModal = document.getElementById('return-modal');

    function openModal(whichModal) {
        modalContainer.classList.add('modal-container-visible');
        whichModal.classList.add('visible');
        whichModal.classList.remove('hidden');
        overlay.classList.add('visible');
        overlay.classList.remove('hidden');
    }

    function closeModal() {
        modalContainer.classList.remove('modal-container-visible');
        modal.classList.add('hidden');
        modal.classList.remove('visible');
        modalAdd.classList.add('hidden');
        modalAdd.classList.remove('visible');
        overlay.classList.add('hidden');
        overlay.classList.remove('visible');
    }

    // Ferme modal-add et ouvre modal gallery  au clic  sur fleche gauche
    returnModal.addEventListener('click', function() {
        closeModal(); // Ferme toutes les modales ouvertes et l'overlay
        openModal(modal); // Ouvre la modale modal
        reinitForm(); // Réinitialisation du formulaire en cas de saisie partielle

    });

    // Écouteur pour fermer les modales si l'utilisateur clique sur l'overlay
    overlay.addEventListener('click', closeModal);

    // Empêche la fermeture de la modale lorsqu'on clique à l'intérieur
    modal.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    modalAdd.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // gestion de  la fermeture de la modale au clic sur les icones croix
    document.getElementById('modal-cross').addEventListener('click', closeModal);
    document.getElementById('modal-cross-add').addEventListener('click', closeModal);

    // gestion de l'ouverture de la modale gallery ( partie 1 )  au clic sur #edit-mode
    document.getElementById('edit-mode').addEventListener('click', function() {
        closeModal(); // Ferme toutes les modales ouvertes
        openModal(modal); // ouvre la modale gallery-edit ( partie 1 modale )
    });

    // gestion de l'ouverture de la modale #modal-add et fermeture de #modal ( modale gallery ) au clic sur #modal-add-valid
    document.getElementById('modal-add-valid').addEventListener('click', function() {
        closeModal(); // Ferme #modal si elle est ouverte
        openModal(modalAdd);
    });
});

// Réinitialisation du formulaire
function reinitForm() {
        // Réinitialisation du formulaire 
        document.querySelector(".work-add").reset();
        const previewImage = document.getElementById('preview-img-add');
        const iconPlaceholder = document.getElementById('icon-placeholder');
        const buttonImageAdd = document.getElementById('button-img-add');
        // Réinitialise l'image selectionnée prévisualisée ( en cas de deux ajout d'affilée pour supprimer imd du work précedant ajouté )
        previewImage.src = ''; 
        previewImage.style.display = 'none'; // Cache l'élément de prévisualisation de l'image
    
        // Réaffiche l'icône placeholder ( avant affichage img selectionnée )
        iconPlaceholder.style.display = 'block';
  
        // Réaffiche le bouton "Ajputer Photo " ( avant affichage img selectionnée )
        buttonImageAdd.style.display = 'block';

}