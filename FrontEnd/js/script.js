console.log("Bonjour script JS");

// Déclaration de la variable qui contient l'url de l'api
let path_url="http://localhost:5678/api/";

// Déclaration des variables pour récupérer les data de Works et de categories
let worksData; // Déclaration de la variable pour stocker les données 

let categoriesData; // Déclaration de la variable pour stocker les données 


// Création des balises html en  dynamique pour créer l'affichage des projets sur la page accueil

// Récupérer les données Json de Works
async function recupererWorksData() {
    const reponse = await fetch(`${path_url}works`)
    const worksData = await reponse.json()
    return worksData
}

// Créer les éléments dans le DoM dans la balise avec la classe "galery" à partir des données de la BDD Works récupérée
function creatWorksHtml(worksData) {
    for (i = 0; i < worksData.length; i++) {
        const workId = worksData[i]
        // spécifier la balise html existante dans laquelle créer les projets en dynamique
        const containerGallery = document.querySelector(".gallery")

        // Création des balises figures à l'intérieur de gallery
        const figureTag = document.createElement("figure")
        
        // Création des balises img dans les figures
        const imgTag = document.createElement("img")
        imgTag.src = workId.imageUrl

        // Création des balises figcaption dans les figures
        const figureCaptionTag = document.createElement("figcaption")
        figureCaptionTag.innerText = (workId.title)

        // On rattache les balises créées à leur parent
        containerGallery.appendChild(figureTag)
        figureTag.appendChild(imgTag)
        figureTag.appendChild(figureCaptionTag)
 }
}

// Récupération des data catégories 
async function recupererCategoriesData() {
    const reponse = await fetch(`${path_url}categories`)
    const categoriesData = await reponse.json()
    return categoriesData
  }

// Récupération des catégories 
async function recupereCategoriesId() {
    const reponseId = await fetch(`${path_url}categories`)
    const categoriesId = await reponseId.json()
    return categoriesId
}


// fonction pour créer les boutons Filtres par catégorie dans le DOM
function buttonsFiltres(categoriesId) {

    // Sélection de la balise qui va recevoir les boutons filtrer par catégorie
    const sectionFiltres = document.querySelector("#filtres")

    // Ajout de la classe flexButton pour appliquer le style css sur la div qui contient les boutons
    sectionFiltres.classList.add("flexButton")

    // Création des boutons filtres ( balise button ) dans la div de #filtres avec la classe css flexButton__filter
    for (let i = -1; i < categoriesId.length; i++) {
        const buttonElement = document.createElement("button")
        buttonElement.classList.add('flexButton__filter')
        if (i === -1) {
            buttonElement.innerText = "Tous"
        } else {
            buttonElement.innerText = categoriesId[i].name
        }
        sectionFiltres.appendChild(buttonElement)
    }
}


// fonction pour faire un raz  du contenu Works de gallery avant nouvel affichage MAJ filtré par catégorie
function suppressionHtmlGallery() {
    document.querySelector(".gallery").innerHTML = ""
  }
  
  
  // fonction pour chgt de mise forme des boutons ( au clic ) et filtrer la galerie des projets
  function filterWorksGallery() {
      const buttons = document.querySelectorAll(".flexButton__filter");
      for (let i = 0; i < buttons.length; i++) {
          buttons[i].addEventListener("click", function(event) {
              buttons.forEach(button => {
                  if (button.classList.contains('button_selected')) {
                      button.classList.remove('button_selected');
                  }
              });
              // récupération de l'index sur le bouton que l'on clique de l'array buttonIndex
              const buttonIndex = Array.from(buttons).indexOf(event.target)
              if (!buttons[buttonIndex].classList.contains('button_selected')) {
                  buttons[buttonIndex].classList.add('button_selected');
              }
              // mise à jour de la galerie des projets en fonction du filtre
              suppressionHtmlGallery()
              recupererWorksData().then(data => {
                  let filteredWorks
                  if (buttonIndex === 0) {
                      filteredWorks = data
                  } else {
                      filteredWorks = data.filter(work => work.categoryId === (buttonIndex))
                  }
                  creatWorksHtml(filteredWorks, ".gallery")
              })
        })
      }
  }





// lancement des  fonctions pour générer l'affichage des Projets ( works ) dans la balise html avec classe gallery et gérer l'affichage filtré  par categorie ( bouton )

async function majWorks() {
const worksData = await recupererWorksData()
creatWorksHtml(worksData, ".gallery")

const categoriesData = await recupererCategoriesData()
buttonsFiltres(categoriesData)

filterWorksGallery()
}


majWorks()