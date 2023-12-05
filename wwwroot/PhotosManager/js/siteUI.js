let contentScrollPosition = 0;
renderConnexion()

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering


function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"));
}
function eraseContent() {
    $("#content").empty();
}
function saveContentScrollPosition() {
    contentScrollPosition = $("#content")[0].scrollTop;
}
function restoreContentScrollPosition() {
    $("#content")[0].scrollTop = contentScrollPosition;
}

function getDropdownItem(iconClass,cmdId,label){
    return `
            <span class="dropdown-item" id="${cmdId}">
                <i class="menuIcon fa ${iconClass} mx-2"></i>
                ${label}
            </span>`
}
function updateHeader(text,cmd) {
    $("#header").empty();
    $("#header").append(
        $(`
            <span title="${text}" id="${cmd + "cmd"}">
                <img src="images/PhotoCloudLogo.png" class="appLogo">
            </span>
            <span class="viewTitle">${text}
                <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>
            </span>
            <div class="headerMenusContainer">
                <span>&nbsp;</span> <!--filler-->
            <div class="dropdown ms-auto dropdownLayout">
            <!-- Articles de menu -->
            </div>
                <div data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
                </div>
                <div class="dropdown-menu noselect">
<!--                    <div class="dropdown-divider"></div>-->
                    
                </div>
            </div>
        `)
    )
}
function renderAbout() {
    timeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("À propos...", "about");
    $("#newPhotoCmd").hide();

    $("#content").append(
        $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de photos</h2>
                <hr>
                <p>
                    Petite application de gestion de photos multiusagers à titre de démonstration
                    d'interface utilisateur monopage réactive.
                </p>
                <p>
                    Auteurs: Jean-Christophe Rochon et Noah Gendron
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `))
}

function renderCreateProfil() {
    noTimeout(); // ne pas limiter le temps d’inactivité
    eraseContent(); // effacer le conteneur #content
    updateHeader("Inscription", "createProfil"); // mettre à jour l’entête et menu
    $("#newPhotoCmd").hide(); // camouffler l’icone de commande d’ajout de photo
    $("#content").append(`
    <form class="form" id="createProfilForm">
      <fieldset>
        <legend>Adresse de courriel</legend>
        <input
          type="email"
          class="form-control Email"
          name="Email"
          id="Email"
          placeholder="Courriel"
          required
          RequireMessage='Veuillez entrer votre courriel'
          InvalidMessage='Courriel invalide'
          CustomErrorMessage="Ce courriel est déjà utilisé"
        />
        <input
          class="form-control MatchedInput"
          type="text"
          matchedInputId="Email"
          name="matchedEmail"
          id="matchedEmail"
          placeholder="Vérification"
          required
          RequireMessage='Veuillez entrez de nouveau votre courriel'
          InvalidMessage="Les courriels ne correspondent pas"
        />
      </fieldset>
  
      <fieldset>
        <legend>Mot de passe</legend>
        <input
          type="password"
          class="form-control"
          name="Password"
          id="Password"
          placeholder="Mot de passe"
          required
          RequireMessage='Veuillez entrer un mot de passe'
          InvalidMessage='Mot de passe trop court'
        />
        <input
          class="form-control MatchedInput"
          type="password"
          matchedInputId="Password"
          name="matchedPassword"
          id="matchedPassword"
          placeholder="Vérification"
          required
          InvalidMessage="Ne correspond pas au mot de passe"
        />
      </fieldset>
  
      <fieldset>
        <legend>Nom</legend>
        <input
          type="text"
          class="form-control Alpha"
          name="Name"
          id="Name"
          placeholder="Nom"
          required
          RequireMessage='Veuillez entrer votre nom'
          InvalidMessage='Nom invalide'
        />
      </fieldset>
  
      <fieldset>
        <legend>Avatar</legend>
        <div class='imageUploader' newImage='true' controlId='Avatar' imageSrc='images/no-avatar.png' waitingImage="images/Loading_icon.gif"></div>
      </fieldset>
  
      <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer" class="form-control btn-primary">
    </form>
  
    <div class="cancel">
      <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>
  `);
  
    $('#loginCmd').on('click', renderConnexion); // call back sur clic
    initFormValidation();
    initImageUploaders();
    $('#abortCmd').on('click', renderConnexion); // call back sur clic
    // ajouter le mécanisme de vérification de doublon de courriel
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');
    // call back la soumission du formulaire
    $('#createProfilForm').on("submit", function (event) {
        let profil = getFormData($('#createProfilForm'));
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        event.preventDefault();// empêcher le fureteur de soumettre une requête de soumission
        showWaitingGif(); // afficher GIF d’attente
        createProfil(profil); // commander la création au service API
    });
}

function createProfil(profil) {
    API.register(profil).then(r =>{
        if (!r){
            console.log(API.currentStatus)
            if (API.currentStatus === 481){
                $("#emailError").append("Courriel invalide")
            }
            else if (API.currentStatus === 482){
                $("#passwordError").append("Mot de passe incorrect")
            }
            else if (API.currentStatus === 404){
                //TODO
            }
        }
        else {
            console.log("Création du profile successful")

            API.verifyEmail(r.id, )
        }
    })
}

function renderConnexion(loginMessage = "",defaultEmail = "",emailError = "",passwordError = "" ){
    noTimeout()
    eraseContent()
    updateHeader("Connexion","profil")
    $("#newPhotoCmd").hide();
    $(".dropdown-menu").append(getDropdownItem("fa-sign-in","loginCmd","Connexion"))
    $(".dropdown-menu").append('<div class="dropdown-divider"></div>')
    $(".dropdown-menu").append(getDropdownItem("fa-info-circle","aboutCmd","À propos..."))
    $("#content").append(`
        <h3>${loginMessage}</h3>
        <form class="form" id="loginForm">
            <input type='email'
                name='Email'
                class="form-control"
                required
                RequireMessage = 'Veuillez entrer votre courriel'
                InvalidMessage = 'Courriel invalide'
                placeholder="adresse de courriel"
                value='${defaultEmail}'>
            <span id="emailError" style='color:red'>${emailError}</span>
            <input type='password'
                name='Password'
                placeholder='Mot de passe'
                class="form-control"
                required
                RequireMessage = 'Veuillez entrer votre mot de passe'>
            <span id="passwordError" style='color:red'>${passwordError}</span>
            <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
        </form>
        <div class="form">
        <hr>
        <button class="form-control btn-info" id="createProfilCmd">Nouveau compte</button>
        </div>
    `)

    $("#createProfilCmd").on("click",renderCreateProfil)
    $("#loginForm").submit((event) => {
        clearErrorMessage()
        event.preventDefault()
        API.login($("#loginForm input[name='Email']").val(),$("#loginForm input[name='Password']").val()).then(r =>{
            if (!r){
                console.log(API.currentStatus)
                if (API.currentStatus === 481){
                    $("#emailError").append("Courriel invalide")
                }
                else if (API.currentStatus === 482){
                    $("#passwordError").append("Mot de passe incorrect")
                }
                else if (API.currentStatus === 404){
                    //TODO
                }
            }
            else {
                console.log("Noice")
            }
        })
    })
}

function clearErrorMessage(){
    $("#emailError").empty();
    $("#passwordError").empty();
}