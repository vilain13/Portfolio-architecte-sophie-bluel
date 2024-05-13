// Déclaration de la variable qui contient l'url de l'api
let path_url="http://localhost:5678/api/";

// Déclaration de la variable qui contiendra les Works de l'api + les ajouts - les suppression 
let globalWorksData = [];  // Initialisation de la variable pour mise à jour des Gallery sans faire appel à l'api après Ajout ou suppression de WORK ( maj de la variable dans la fonction workAdd apres retour API)


// Récupération des data Works de l'api
async function recupererWorksData() {
    try {
        const response = await fetch(`${path_url}works`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données Works de l'API");
        }
        globalWorksData = await response.json();  // Stockage des données récupérées
        return globalWorksData;
    } catch (error) {
        console.error('Erreur:', error.message);
        return [];
    }
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


// Envoi des données de connexion saisies au serveur via l'api et attend la réponse du serveur transforme les données au format exploitable json
async function envoiLogin(user) {
    const response = await fetch(`${path_url}users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user) // transformation des données au format json
      });
      return response;
}

// Mise à jour de l'API Works ( supprimer Work sélectionné) MAJ du contenu html Works de Gallery et de Gallery-Edit ( modale ) 
async function deleteWork(workIdSelect) {
    console.log("lancement fonction deleteWork");
    console.log(workIdSelect);
    // Vérification si logué adm ( token valide )
    try {
        const data = JSON.parse(localStorage.getItem("data"));
        let token;
        if (data) {
            token = data.token;
        }
        if (!token) {
            throw new Error("Token non trouvé le localStorage");
        }
        // Vérification du Token dans localStprage pour autorisation suppression work
        const response = await fetch(`${path_url}works/${workIdSelect}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                },
        });
        if (!response.ok) {
            throw new Error(`la suppression de l'objet a échoué`);
            }
        alert('Projet supprimé avec succès !'); // Feedback utilisateur
        const workIdNum = Number(workIdSelect);
        globalWorksData = globalWorksData.filter(work => work.id !== workIdNum); // mise à jour de la variable pour supprimer id du work  et MAJ de Gallery accueil sans faire appel ) API
        removeWorkModalDom(workIdSelect);    // supprime du html le  Work supprimé de l'api dans le html Dom Gallery de la modale
        removeWorkGalleryDom(workIdSelect);// supprime du html le  Work supprimé de l'api dans le html Dom Gallery-edit  de la page accueil  
    } 
    catch (error) {
        console.error(`une erreur est survenue :`, error.message);
    }
}


// Création d'un Work dans l'API à la soumission du formulaire
// Préparation de l'o-bjet de données pour ajout du Work dans l'api via POST
async function workPost(image, title, category) {
    const workFormData = new FormData();
  
    workFormData.append("image", image);  // Ensure the 'file.name' is included if the API needs the filename
    workFormData.append("title", title);
    workFormData.append("category", category);
  
  
  // Vérification du token pour ajouter le Work dans l'API
    try {
      const data = JSON.parse(localStorage.getItem("data"));
      /*let token;
      if (data) {
        token = data.token;
      }  ces 4 lignes sont remplacées par la ligne ci dessous  */
  
      let token = data ? data.token : null; // condition ? valeurSiVrai : valeurSiFaux; //
  
      // Vérification autorisation tokenId dans le localStorage
      if (!token) {
        throw new Error("Aucun token de connexion login trouvé dans le localStorage");
      }
      const response = await fetch(`${path_url}works`, {
        method: "POST",
        headers: { // pas de content-type quand on utilise un objet formData conseillé pour envoyé un fichier IMG
          accept: `application/json`,
          Authorization: `Bearer ${token}`,
        },
        body: workFormData,
      });
      if (!response.ok) {
        throw new Error(`la création du Projet soumis  a échoué`);
      }
      const result = await response.json();
      // s'assure que categoryId est un nombre ( convertir le format texte de categoryId envoyé à  l'API au format nombre pour traitement dans le filtrage sans faire appel à ÀPI)
      if (result.categoryId && typeof result.categoryId === 'string') {
        result.categoryId = parseInt(result.categoryId, 10);
      }
      globalWorksData.push(result);  // Mise à jour de cette variable en y ajoutant le work créé pour MAJ affichage html Gallery Accueil sans faire appel à l'API lors des filtrages
      alert('Projet ajouté avec succès !'); // feedback utilisateur
      console.log(result);
      console.log(globalWorksData);
  
      // Réinitialisation du formulaire 
      document.querySelector(".work-add").reset();
      const previewImage = document.getElementById('preview-img-add');
      const iconPlaceholder = document.getElementById('icon-placeholder');
  
      // Réinitialise l'image selectionnée prévisualisée ( en cas de deux ajout d'affilée pour supprimer imd du work précedant ajouté )
      previewImage.src = ''; 
      previewImage.style.display = 'none'; // Cache l'élément de prévisualisation de l'image
  
      // Réaffiche l'icône placeholder ( avant affichage img selectionnée )
      iconPlaceholder.style.display = 'block';
  
      // Ajout du nouveau travail dans les galerie HTML sans faire appel à l'API ( page Accueil et modale )
      createWorksHtml(result); // Ajout dans la Gallery de la page accueil du Work créé
      createModalHtml(result); // Ajout dans la Gallery-edit de la modale ( partie 1 )  du Work créé
    }
    
  
    catch (error) {
      console.error(`une erreur est survenue :`, error.message);
    }
  }