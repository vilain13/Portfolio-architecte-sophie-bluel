console.log("Bonjour JS accueil");
console.log(localStorage);


// Création du html dans le DOM à partir d'un tableaau d'objets ( pour lapage accueil Gallery ) ou pour l'ajout d'un Work dans la modale ( 1 Work ) 
function createWorksHtml(worksData) { 
    const containerGallery = document.querySelector(".gallery");
    
    const addWork = (work) => {
        const figureTag = document.createElement("figure");
        // Attribuer un ID à la balise figure
        figureTag.id = `work-${work.id}`;
        const imgTag = document.createElement("img");
        imgTag.src = work.imageUrl;
        const figureCaptionTag = document.createElement("figcaption");
        figureCaptionTag.innerText = work.title;

        figureTag.appendChild(imgTag);
        figureTag.appendChild(figureCaptionTag);
        containerGallery.appendChild(figureTag);
    };
    // // Vérifie si worksData est un tableau ou non ( pour utilisation de la même fonction à l'ouverture de la page via Fetch et MAJ d'un element html lors de l'ajout Work)
    if (Array.isArray(worksData)) {
        // Si c'est un tableau, recupère les Works via API pour MAJ Html ( à l'initial )
        worksData.forEach(work => addWork(work));
    } else {
        // Si ce n'est pas un tableau, sert à la MAJ d'un element html
        addWork(worksData);
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

// Réinitialisation du contenu de gallery de la page Accueil
function suppressionHtmlGallery() {
    document.querySelector(".gallery").innerHTML = "";
}

// Affichage de la Gallery page accueil en fonction du filtre sur catégory ( bouton filtre )
function filterWorksGallery(categoriesData) {
    const buttons = document.querySelectorAll(".flexButton__filter");
    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            suppressionHtmlGallery(); // Réinitialisation du contenu gallery avant nouvel affichage filtré
            let filteredWorks;
            if (index === 0) {  // Si le premier bouton ("Tous"), pas de filtrage
                filteredWorks = globalWorksData;
            } else {  // Filtrer selon la catégorie
                const category = categoriesData[index - 1];  // Ajustement d'index car le premier bouton est "Tous"
                filteredWorks = globalWorksData.filter(work => work.categoryId === category.id);
            }
            createWorksHtml(filteredWorks);
        });
    });
}

// affiche Gallery page accueil initial et filtre sur Category sans refaire appel à l'API
async function majWorksInit() {
    await recupererWorksData();  // Charge et stocke les données Works*/
    createWorksHtml(globalWorksData);

    const categoriesData = await recupererCategoriesData();
    buttonsFiltres(categoriesData);
    filterWorksGallery(categoriesData);
}

majWorksInit();


//  récupération du  token qui a été stocké dans localstorage après la connexion reussie via le login, et si OK affichage mode edition
function modeEdition() {

    const tokenId = localStorage.getItem("data");
    // Vérification si le token est présent dans le localStorage
    if (tokenId) {
        // Activation du mode Edition des Works. Plusieurs éléments concernés
        // Affiche le bandeau Mode Edition dans le header
        const bannerHeader = document.querySelector('.connected-banner');
        bannerHeader.classList.add("display-connect");
      
        //  affiche le lien logout
        const linkLogout = document.querySelector('#logout');
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

        // RAZ de localStorage ( contient le tokenId ) 
      
       localStorage.removeItem('data');  
       

       // Cache le bandeau Mode Edition dans le header
       const bannerHeader = document.querySelector('.connected-banner');
       bannerHeader.classList.remove("display-connect");
     
       //  cache le lien logout
       const linkLogout = document.querySelector('#logout');
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
       sectionFilters.classList.remove("no-display-connect");

       // Ferme la modale du mode Edition des Works  en cas de logout et supprime le overlay derriere la modale qui se ferme
        const element  = document.getElementById("modal");
        element.classList.remove("display-modal");
        const overlay = document.getElementById("overlay");
        overlay.classList.remove("overlay"); // supprime le fonds overlay sous la modale
    })
}

logout();



