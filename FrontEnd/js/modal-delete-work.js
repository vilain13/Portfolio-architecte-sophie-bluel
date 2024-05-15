console.log("Hello modale-delete-work.js");

// Fonction pour récupérer l'id du Work à supprimer en cliquant sur son icône Trash et lancer la fonction de suppression du Work
function getIdWorkDelete() {
    // Utilisation de la délégation d'événements pour gérer les clics sur les icônes de suppression
    document.querySelector('.gallery-edit').addEventListener('click', function(event) {
        let target = event.target;
        // Cible l'icône de la poubelle même si le clic est sur un enfant de l'icône
        while (target != this && !target.classList.contains('fa-trash-can')) {
            target = target.parentNode;
        }
        if (target.classList.contains('fa-trash-can')) {
            const workIdSelect = target.id;
            deleteWork(workIdSelect);
        }
    });
}
    

//  suppression du Work à supprimer  dans le html DOM Gallery ( accueil ) et Gallery-edit  (modale partie 1 ) sans recharger API

// suppression de l'element html Partie Gallery de la page Accueil
function removeWorkGalleryDom(workIdSelect) {
    const workElement = document.getElementById(`work-${workIdSelect}`);
    if (workElement) {
        workElement.parentNode.removeChild(workElement);
    } else {
        console.error("L'élément à supprimer n'a pas été trouvé dans le DOM de Gallery de la page accueil.");
    }
}

// suppression de l'element html Gallery-edit de la partie 1 modale
function removeWorkModalDom(workIdSelect) {
    const iconElement = document.getElementById(workIdSelect);
    if (iconElement) {
        const figureElement = iconElement.closest('.gallery-edit figure'); // Remonte jusqu'à trouver l'élément figure parent
        if (figureElement) {
            figureElement.parentNode.removeChild(figureElement); // Supprime l'élément figure du DOM
        } else {
            console.error("L'élément à supprimer n'a pas été trouvé dans le DOM de Gallery-edit de la modale.");
        }
    } 
}

// lancement récupération id à supprimer et suppression du work de l'api et maj html Gallery Accueil et gallery modale
async function startGetIdWorkDelete() {
    
    const worksData =   await majModalWorks();
    getIdWorkDelete(worksData); 
}

startGetIdWorkDelete();

