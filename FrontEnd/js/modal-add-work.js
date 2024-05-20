
// Propose la liste des categories de l'API categories dans la selection de la catégorie
async function addOptionsCategory() {
  const selectElement = document.getElementById('category');
  const categories = await recupererCategoriesData();

  // Efface les categories existantes en html
  selectElement.innerHTML = '';

  // Ajoute une categorie par défaut ( neutre )
  const defaultOption = document.createElement('option');
  defaultOption.textContent = '';
  defaultOption.value = '';
  selectElement.appendChild(defaultOption);

  // Propose les options de catégorie existantes récupérées de l'API
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    selectElement.appendChild(option);
  });
}

addOptionsCategory()

// Remplace l'icone par l'image sélectionnée pour ajouter un Work (n incluant le contrôle sur la taille du fichier et le type de fichier )
function getImgAdd() {
  var fileInput = document.getElementById('file-upload');
  var previewImage = document.getElementById('preview-img-add');
  var iconPlaceholder = document.getElementById('icon-placeholder');
  var buttonImageAdd = document.getElementById('button-img-add'); // ajout final


  // S'assure qu'un fichier a été sélectionné
  if (fileInput.files && fileInput.files[0]) {
    var file = fileInput.files[0];

    // Converti la taille en mégaoctets
    var fileSizeMB = file.size / 1024 / 1024;

    // Vérifie si la taille du fichier est supérieure à 4 Mo
    if (fileSizeMB > 4) {
      alert("La taille du fichier doit être inférieure à 4 Mo.");
      // Réinitialise l'input de fichier si le fichier est trop gros
      fileInput.value = "";
      return; // Stoppe l'exécution de la fonction
    }

    var reader = new FileReader();

    reader.onload = function (e) {
      // Affiche l'image dans le <img> cache l'icône et le bouton Ajout Photo
      previewImage.src = e.target.result;
      previewImage.style.display = 'block';
      iconPlaceholder.style.display = 'none';
      buttonImageAdd.style.display = "none"
    };

    reader.readAsDataURL(file);
  }
}


// Soumission du formulaire d'ajout de Work
function addWorkForm() {
    // Partie avant le clic sur le bouton Valider
    // Sélectionnez tous les champs du formulaire
    const fileInput = document.getElementById('file-upload');
    const titreInput = document.getElementById("titre");
    const categoryInput = document.getElementById("category");
    const buttonAddValid = document.getElementById('modal-button-add');
  
    // Ajoutez des écouteurs d'événements à chaque champ
    fileInput.addEventListener("change", checkForm);
    titreInput.addEventListener("change", checkForm);
    categoryInput.addEventListener("change", checkForm);
  
    // Vérifie si tous les champs sont remplis avant soumission du formualaire pour changer la couleur du bouton "Valider"
    function checkForm() {
      const fileSelected = fileInput.files[0];
      const titreValue = titreInput.value.trim();
      const categoryValue = categoryInput.value.trim();
  
      if (fileSelected && titreValue !== "" && categoryValue !== "") {
        // Si tous les champs sont remplis, changee la couleur du bouton Valider
        buttonAddValid.style.backgroundColor = '#1D6154'; // Passe en vert
      } else {
        // Sinon, réinitialisation de  la couleur du bouton à sa valeur d'origine
        buttonAddValid.style.backgroundColor = ''; // ré initiaalise la couleur d'origine
      }
    }

  //Partie au clic sur le bouton Valider
  document.querySelector(".work-add").addEventListener("submit", function (event) {
    event.preventDefault();
    //const fileInput = document.getElementById('file-upload');
    const titrePost = document.getElementById("titre").value.trim();
    const categoryPost = document.getElementById("category").value.trim();
    if (!fileInput.files[0] || categoryPost === "" || titrePost === "") {
      alert("Erreur Formulaire : sélectionnez une image, renseignez le titre et la catégorie !");
    } else {
      
      workPost(fileInput.files[0], titrePost, categoryPost);
  
    }
  });
}

addWorkForm();




































