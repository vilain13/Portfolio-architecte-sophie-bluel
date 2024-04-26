console.log("Bonjour JS accueil");
console.log(localStorage);


// Récupération des données de Works
async function recupererWorksData() {
    try {
        const response = await fetch(`${path_url}works`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données Works  de l'api");
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error.message);
        return ["Erreur lors de la récupération des données Works  de l'api"];
    }
}

// Création des  éléments dans le DoM dans la balise avec la classe "gallery" à partir des données de la BDD Works récupérée
function createWorksHtml(worksData) {
    const containerGallery = document.querySelector(".gallery");
    containerGallery.innerHTML = ""; // Réinitialisation du contenu

    worksData.forEach(work => {
        const figureTag = document.createElement("figure");
        const imgTag = document.createElement("img");
        imgTag.src = work.imageUrl;
        const figureCaptionTag = document.createElement("figcaption");
        figureCaptionTag.innerText = work.title;

        figureTag.appendChild(imgTag);
        figureTag.appendChild(figureCaptionTag);
        containerGallery.appendChild(figureTag);
    });
}

// Récupération des data  de catégories 
async function recupererCategoriesData() {
    try {
        const response = await fetch(`${path_url}categories`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données catégories de l'API");
        }
        const categoriesData = await response.json();
        
        // Utilisation de l'objet Set pour éliminer les doublons sur le nom des catégories
        const categoriesSet = new Set(categoriesData.map(category => category.name));
        const uniqueCategories = Array.from(categoriesSet).map(categoryName => {
            return categoriesData.find(category => category.name === categoryName);
        });

        return uniqueCategories;
    } catch (error) {
        console.error('Erreur:', error.message);
        return ["Erreur lors de la récupération des données de catégories de l'API"];
    }
}

// Création des  boutons Filtres par catégorie dans le DOM du html
function buttonsFiltres(categoriesData) {
    const sectionFiltres = document.querySelector("#filters");
    sectionFiltres.classList.add("flexButton");

    const buttonElementAll = document.createElement("button");
    buttonElementAll.classList.add('flexButton__filter');
    buttonElementAll.innerText = "Tous";
    sectionFiltres.appendChild(buttonElementAll);

    categoriesData.forEach(category => {
        const buttonElement = document.createElement("button");
        buttonElement.classList.add('flexButton__filter');
        buttonElement.innerText = category.name;
        sectionFiltres.appendChild(buttonElement);
    });
}



// Réinitialisation du contenu de gallery avant un nouvel affichage filtré des projets Works
function suppressionHtmlGallery() {
    document.querySelector(".gallery").innerHTML = "";
}

// Filtrage de la galerie des projets en fonction du bouton de filtre categorie cliqué
function filterWorksGallery() {
    const buttons = document.querySelectorAll(".flexButton__filter");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function(event) {
            const buttonIndex = Array.from(buttons).indexOf(event.target);
            suppressionHtmlGallery(); // Réinitialisation du contenu gallery avant MAJ des projets Works filtrés
            recupererWorksData().then(data => {
                let filteredWorks;
                if (buttonIndex === 0) {
                    filteredWorks = data;
                } else {
                    filteredWorks = data.filter(work => work.categoryId === (buttonIndex));
                }
                createWorksHtml(filteredWorks);
            });
        });
    }
}


// lancement des  fonctions pour générer l'affichage des Projets ( works ) dans la balise html avec classe gallery et gérer l'affichage filtré  par categorie ( bouton )

async function majWorks() {
    const worksData = await recupererWorksData();
    createWorksHtml(worksData);

    const categoriesData = await recupererCategoriesData();
    buttonsFiltres(categoriesData);

    filterWorksGallery();
}

majWorks();



//  récupération du  token qui a été stocké dans localstorage après la connexion reussie via le login,
function modeEdition() {
    console.log("lancement mode édition");

    const tokenId = localStorage.getItem("data");
    console.log(tokenId);
    // Vérification si le token est présent dans le localStorage
    if (tokenId) {
        console.log("Token d'identification récupéré accueil js:", tokenId);
        // Activation du mode Edition des Works
        // Affiche le bandeau Mode Edition dans le header
        const bannerHeader = document.querySelector('.connected-banner');
        bannerHeader.classList.add("display-connect");
      
        //  affiche le lien logout
        const linkLogout = document.querySelector('#logout');
        console.log(linkLogout);
        linkLogout.classList.remove("no-display-connect");
     

        //  cache  le lien login
        const linkLogin = document.querySelector('#login');
        linkLogin.classList.remove("display-connect");
        linkLogin.classList.add("no-display-connect");

        // Affiche le mode Edit ( icone et texte après le titre )
        const editMode = document.querySelector('.edit-mode-title');
        editMode.classList.add("display-connect");
       
        // Cache les boutons filtres
        const sectionFilters = document.getElementById('filters');
        console.log(sectionFilters);
        sectionFilters.classList.add("no-display-connect");


    } else {
        console.log("Aucun token d'identification n'est stocké dans le localStorage.");
    }
}


modeEdition();  // Appel de la fonction passage en mode édition des travaux Works


// Gestion du logout pour sortir du mode Edition des travaux Works

function logout() {
    const clickLogout = document.querySelector("#logout");
    clickLogout.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('lancement fonction logout');

        // RAZ de lolacStorage ( contient le tokenId ) 
      
       //  localStorage.removeItem('tokenId');   pourquoi cette fonction permet elle de récupérer le tokenid après logout puis login et lien projets obligé d'utiliser localStorage.clear()??
        localStorage.clear();

       // Cache le bandeau Mode Edition dans le header
       const bannerHeader = document.querySelector('.connected-banner');
       bannerHeader.classList.remove("display-connect");
     
       //  cache le lien logout
       const linkLogout = document.querySelector('#logout');
       console.log(linkLogout);
       linkLogout.classList.add("no-display-connect");
    
       //  affiche  le lien login
       const linkLogin = document.querySelector('#login');
       linkLogin.classList.add("display-connect");
       linkLogin.classList.remove("no-display-connect");

       // Cache le mode Edit ( icone et texte après le titre )
       const editMode = document.querySelector('.edit-mode-title');
       editMode.classList.remove("display-connect");
      
       // Affiche les boutons filtres
       const sectionFilters = document.getElementById('filters');
       console.log(sectionFilters);
       sectionFilters.classList.remove("no-display-connect");

       // Ferme la modale du mode Edition des Works  en cas de logout et supprime le overlay derriere la modale qui se ferme
        const element  = document.getElementById("modal");
        element.classList.remove("display-modal");
        const overlay = document.getElementById("overlay");
        overlay.classList.remove("overlay"); // supprime le fonds overlay sous la modale
    })
}

logout();



