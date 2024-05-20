
// Récupération des valeurs saisies dans le formulaire de connexion et les envoi sous forme d'un objet

function getDataForms() {
    const email = document.querySelector('#email-connect').value;
    const password = document.querySelector('#password').value;
    return { email, password }; 
}

//  Contrôle des infos login soumises avec la bdd users de l'api pour connexion au compte

  async function ctrlLogin() {
    const connexion = document.querySelector("#connect-login");
    connexion.addEventListener('submit', async function(event) {
        event.preventDefault();
        const user = getDataForms();
        const reponseIdToken = await envoiLogin(user);
        if (reponseIdToken.status === 200) {
            const data = await reponseIdToken.json();
            // stockage du résultat dans le localStorage pour une utilisation ultérieure  : déclenchement du mode édition
            const dataString = JSON.stringify(data);
            window.localStorage.setItem("data", dataString);
            // re direction vers la page accueil
            window.location.href = "index.html";
        } else {
            // Affichage d' un message d'erreur lorsque le couple identifiant & mot de passe est incorrect
            let errorLog = document.querySelector('.erreur-login');
            errorLog.classList.add('erreur-login-visible');
        }
    })
    }
    

// Lancement de la fonction de connexion aux bdd de l'api
async function startCtrlLogin() {
    await ctrlLogin();
}

startCtrlLogin();
