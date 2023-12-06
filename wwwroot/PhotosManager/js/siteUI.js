let contentScrollPosition = 0;
renderMainPage()

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
function createDropdownItem(appendObject,iconClass,cmdId,label,onClickFunction = null){
    $(appendObject).append(getDropdownItem(iconClass,cmdId,label))
    $(`#${cmdId}`).click((event) => {
        event.preventDefault()
        onClickFunction()
    })
}

function createSortDropDownItem(appendObject,sortByDateReturn = null,sortByOwnersReturn = null,sortByLikesReturn = null,sortByMeReturn = null,){
    $(appendObject).append(`
    <span class="dropdown-item" id="sortByDateCmd">
        <i class="menuIcon fa fa-check mx-2"></i>
        <i class="menuIcon fa fa-calendar mx-2"></i>
        Photos par date de création
    </span>
    <span class="dropdown-item" id="sortByOwnersCmd">
        <i class="menuIcon fa fa-fw mx-2"></i>
        <i class="menuIcon fa fa-users mx-2"></i>
        Photos par créateur
    </span>
    <span class="dropdown-item" id="sortByLikesCmd">
        <i class="menuIcon fa fa-fw mx-2"></i>
        <i class="menuIcon fa fa-user mx-2"></i>
        Photos les plus aiméés
    </span>
    <span class="dropdown-item" id="ownerOnlyCmd">
        <i class="menuIcon fa fa-fw mx-2"></i>
        <i class="menuIcon fa fa-user mx-2"></i>
        Mes photos
    </span>
    `)
    $("#sortByDateCmd").click(() => {
        $(".fa-check").removeClass("menuIcon fa-check mx-2").addClass("menuIcon fa-fw mx-2");
        $("#sortByDateCmd .fa-fw").removeClass("menuIcon fa-fw mx-2").addClass("menuIcon fa-check mx-2");
        if (sortByDateReturn !== null) {
            sortByDateReturn();
        }
    });

    $("#sortByOwnersCmd").click(() => {
        $(".fa-check").removeClass("menuIcon fa-check mx-2").addClass("menuIcon fa-fw mx-2");
        $("#sortByOwnersCmd .fa-fw").removeClass("menuIcon fa-fw mx-2").addClass("menuIcon fa-check mx-2");
        if (sortByOwnersReturn !== null) {
            sortByOwnersReturn();
        }
    });

    $("#sortByLikesCmd").click(() => {
        $(".fa-check").removeClass("menuIcon fa-check mx-2").addClass("menuIcon fa-fw mx-2");
        $("#sortByLikesCmd .fa-fw").removeClass("menuIcon fa-fw mx-2").addClass("menuIcon fa-check mx-2");
        if (sortByLikesReturn !== null) {
            sortByLikesReturn();
        }
    });

    $("#ownerOnlyCmd").click(() => {
        $(".fa-check").removeClass("menuIcon fa-check mx-2").addClass("menuIcon fa-fw mx-2");
        $("#ownerOnlyCmd .fa-fw").removeClass("menuIcon fa-fw mx-2").addClass("menuIcon fa-check mx-2");
        if (sortByMeReturn !== null) {
            sortByMeReturn();
        }
    });

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
        `))
    let currentUser = API.retrieveLoggedUser()
    //Guest
    if (currentUser === null){
        createDropdownItem(".dropdown-menu","fa-sign-in","loginCmd","Connexion",renderConnexion)
        $(".dropdown-menu").append('<div class="dropdown-divider"></div>')
        createDropdownItem(".dropdown-menu","fa-info-circle","aboutCmd","À propos...",renderAbout)
        $("#newPhotoCmd").hide();
    }
    //admin
    else if (currentUser.Authorizations.readAccess === 2){
        createDropdownItem(".dropdown-menu", "fa-sign-out","adminManageCmd","Gestion des usagers",renderAdmin)
        $(".dropdown-menu").append('<div class="dropdown-divider"></div>')
        createDropdownItem(".dropdown-menu", "fa-sign-out","logoutCmd","Déconnexion",() => {API.logout().then(() => {renderConnexion()})})
        createDropdownItem(".dropdown-menu", "fa-user-pen","modifyCmd","Modifier votre profil")
        $(".dropdown-menu").append('<div class="dropdown-divider"></div>')
        createDropdownItem(".dropdown-menu", "fa-image","pictureCmd","Liste des photos",renderMainPage)
        $(".dropdown-menu").append('<div class="dropdown-divider"></div>')
        createSortDropDownItem(".dropdown-menu")
        $(".dropdown-menu").append('<div class="dropdown-divider"></div>')
        createDropdownItem(".dropdown-menu", "fa-info-circle","aboutCmd","À propos...",renderAbout)
    }
    //user
    else {
        createDropdownItem(".dropdown-menu", "fa-sign-out","logoutCmd","Déconnexion",() => {API.logout().then(() => {renderConnexion()})})
        createDropdownItem(".dropdown-menu", "fa-user-pen","modifyCmd","Modifier votre profil")
        $(".dropdown-menu").append('<div class="dropdown-divider"></div>')
        createDropdownItem(".dropdown-menu", "fa-image","pictureCmd","Liste des photos",renderMainPage)
        $(".dropdown-menu").append('<div class="dropdown-divider"></div>')
        createSortDropDownItem(".dropdown-menu")
        $(".dropdown-menu").append('<div class="dropdown-divider"></div>')
        createDropdownItem(".dropdown-menu", "fa-info-circle","aboutCmd","À propos...",renderAbout)
    }
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
        clearErrorMessageConnexion()
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
                renderMainPage()
            }
        })
    })
}

function clearErrorMessageConnexion(){
    $("#emailError").empty();
    $("#passwordError").empty();
}

function renderMainPage(){
    eraseContent()
    updateHeader("Liste des photos","pictures")

}

function renderAdmin(){
    eraseContent()
    getUserAdminRow("17988070-7f22-11ee-b433-0bad428eeaac")
    updateHeader("Gestion des usagers","admin")
    $("#newPhotoCmd").hide();
    $("#content").append(`
    <div id="alalal">

    </div>
    `)
    API.GetAccounts().then((users) => {
        for (let user of users.data) {
            console.log(user.Name)
            $("#alalal").append(getUserAdminRow(user))
        }
    })
}
function getUserAdminRow(user){
    return `
    <div class="UserContainer">
        <div class="UserLayout">
            <img class="UserAvatar" src="${user.Avatar}">
            <div class="UserInfo">
                <div class="UserName">${user.Name}</div>
                <div class="UserEmail">${user.Email}</div>
            </div>
        </div>
        <div class="UserCommandPanel">
            <i class="fa fa-user-alt dodgerblueCmd"></i>
            <i class="fa fa-user-alt"></i>
            <i class="fa fa-user-alt"></i>
        </div>
    </div>
    `
}