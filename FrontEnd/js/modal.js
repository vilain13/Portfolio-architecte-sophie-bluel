console.log("Bonjour modale.js");


// Création des  éléments dans le DoM dans la section modale  avec la classe "modal-gallery" à partir des données de la BDD Works récupérée
function createModalHtml(worksData) {
    const containerModalGallery = document.querySelector(".gallery-edit");
    containerModalGallery.innerHTML = ""; // Réinitialisation du contenu Gallery-edit
    console.log (worksData);
    worksData.forEach(modalWork => {
        //const link = document.createElement("a");
        const figure = document.createElement("figure");
        const imgFigure = document.createElement("img");
        const divFigure = document.createElement("div");
        const iconFigure = document.createElement("i");
        imgFigure.src = modalWork.imageUrl;
       
        //link.appendChild(article);
        figure.appendChild(imgFigure);
        figure.appendChild(divFigure);
        divFigure.appendChild(iconFigure);
        
       
        containerModalGallery.appendChild(figure);
        
        divFigure.classList.add("logo");
        iconFigure.classList.add("fa-solid", "fa-trash-can");
    });
}


// Affichage de la modale gestion des Works au click sur le libellé "modifier" en mode édiiton

// Lancement de la création de  la structure html avec les données works dans la modale
async function majModalWorks() {
    const worksData = await recupererWorksData();
    createModalHtml(worksData); 
}

majModalWorks();

// Ouverture de la modale
async function displayModal() {
    const connexion = document.querySelector("#edit-mode");
    connexion.addEventListener('click', async function(event) {
        event.preventDefault();
        const element  = document.getElementById("modal");
        element.classList.add("display-modal");

          // ajout opacité sur page accueil en dehors de la modale
        const overlay = document.getElementById("overlay");
        overlay.classList.add("overlay");
    })
}

// Lancement de la fonction d'ouverture de la modale
async function startDisplayModal() {
    await displayModal();
}

startDisplayModal();


// Fermeture  de la modale gestion des Works au click sur la croix "fermeture de la modale"  ou en dehors de la modale sauf balise pour lancement du mode édition 
async function closeModal() {
    // au clic sur la croix
    const connexion = document.querySelector("#modal-cross");
    const overlay = document.getElementById("overlay");
    connexion.addEventListener('click', async function(event) {
        event.preventDefault();
        const element  = document.getElementById("modal");
        element.classList.remove("display-modal");
        overlay.classList.remove("overlay"); // supprime le fonds overlay sous la modale
    })
    
    // au clic en dehors de la modale sauf sur la balise mode edition pour l'ouvrir 
    document.addEventListener('click', function(event) {
        
        const element = document.getElementById("modal");
        const editMode = document.getElementById("edit-mode");
        const overlay = document.getElementById("overlay");

        // Vérifie si le clic est en dehors de la modale et pas sur "edit-mode"
        if (!element.contains(event.target) && !editMode.contains(event.target)) {
            // const element  = document.getElementById("modal");
            element.classList.remove("display-modal");
            overlay.classList.remove("overlay"); // supprime le fonds overlay sous la modale
        }
    });
}

        // Lancement de la fonction de fermeture de la modale
async function startCloseModal() {
    await closeModal();
}

startCloseModal();