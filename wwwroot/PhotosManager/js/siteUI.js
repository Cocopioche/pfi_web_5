const PAGES = {
    ABOUT: "about",
    CREATE_PROFIL: "createProfil",
    MODIF_PROFIL: "modifProfil",
    VERIFICATION: "verification",
    CONNECTION: "connection",
    PICTURES: "pictures",
    ADMIN: "admin",
    DELETE: "delete",
};
let pageDict = {
    [PAGES.ABOUT] : renderAbout,
    [PAGES.CREATE_PROFIL]: renderCreateProfil,
    [PAGES.MODIF_PROFIL]: renderModifProfil,
    [PAGES.VERIFICATION]: renderVerification,
    [PAGES.CONNECTION]: renderConnexion,
    [PAGES.PICTURES]: renderMainPage,
    [PAGES.ADMIN]: renderAdmin,
    [PAGES.DELETE]: renderDeleteUser
};

let contentScrollPosition = 0;
if (API.retrieveLoggedUser() !== null && localStorage.getItem('currentPage') !== null){
    pageDict[localStorage.getItem('currentPage')]()
}
else {
    renderMainPage()
}
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

function updateHeader(text,pageName) {
    localStorage.setItem('currentPage',pageName)
    let currentUser = API.retrieveLoggedUser()
    $("#header").empty();
    $("#header").append(
        $(`
            <span title="${text}" id="${pageName + "cmd"}">
                <img src="images/PhotoCloudLogo.png" class="appLogo">
            </span>
            <span class="viewTitle">${text}
                <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>
            </span>
            <div class="headerMenusContainer">
                <span>&nbsp;</span> <!--filler-->
                <i title="Modifier votre profil">
                    <div class="UserAvatarSmall" id="editProfilCmd"
                        style="background-image:url('${currentUser === null ? '' :currentUser.Avatar }')"
                        title="${currentUser === null ? '' :currentUser.Name }">
                    </div>
                </i>
                <div data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="cmdIcon fa fa-ellipsis-vertical"></i>
                </div>
                <div class="dropdown-menu noselect">
<!--                    <div class="dropdown-divider"></div>-->
                </div>
            </div>
        `))

    //Guest
    if (currentUser === null){
        createDropdownItem(".dropdown-menu","fa-sign-in","loginCmd","Connexion",renderConnexion)
        $(".dropdown-menu").append('<div class="dropdown-divider"></div>')
        createDropdownItem(".dropdown-menu","fa-info-circle","aboutCmd","À propos...",renderAbout)
        $("#newPhotoCmd").hide();
    }
    //admin
    else if (currentUser.Authorizations.writeAccess === 2){
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
        createDropdownItem(".dropdown-menu", "fa-user-pen","modifyCmd","Modifier votre profil",renderModifProfil)
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
    updateHeader("À propos...", PAGES.ABOUT);
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
    updateHeader("Inscription", PAGES.CREATE_PROFIL); // mettre à jour l’entête et menu
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

function renderVerification(profil) {

    updateHeader("Connexion", PAGES.VERIFICATION)

    renderConnexion("Votre compte a été créé. Veuillez prendre vos courriels pour réccuperer votre code de vérification qui vous sera demandé lors de votre prochaine connexion", profil.email)
}

function renderModifProfil() {
    let currentUser = API.retrieveLoggedUser()

    if (currentUser) {

    }
}

function renderConnexion(loginMessage = "",defaultEmail = "",emailError = "",passwordError = "" ){
    noTimeout()
    eraseContent()
    updateHeader("Connexion",PAGES.CONNECTION)
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
                if (API.retrieveLoggedUser().VerifyCode !== "verified"){
                    //TODO send to code verification page
                    $("#passwordError").append("Compte non vérifié!")
                    API.logout()
                }
                else {
                    renderMainPage()
                }
            }
        })
    })
}

function renderMainPage(){
    eraseContent()
    updateHeader("Liste des photos",PAGES.PICTURES)

}

function renderAdmin(){
    eraseContent()
    updateHeader("Gestion des usagers",PAGES.ADMIN)
    $("#newPhotoCmd").hide();
    $("#content").append(`
    <div id="Users">

    </div>
    `)
    API.GetAccounts().then((users) => {
        for (let user of users.data) {
            createUserAdminRow("#Users",user)
        }
    })
}

function renderDeleteUser(){
    let isAdmin = API.retrieveLoggedUser().Authorizations.writeAccess === 2
    updateHeader("Retrait de compte",PAGES.DELETE)
}


function getFormData(form) {
    let formData = {};
    form.find('input, select, textarea').each(function() {
        const input = $(this);
        const name = input.attr('name');
        const value = input.val();

        if (name) {
            formData[name] = value;
        }
    });

    return formData;
}

function createProfil(profil) {
    console.log(profil)
    API.register(profil)
        .then((newProfile) => {
            console.log(API.currentStatus)
            if (!newProfile){
                console.log("Profile creation failed");

                if (API.currentStatus === 481){

                }
                else if (API.currentStatus === 482){

                }
                else if (API.currentStatus === 404){
                    //TODO
                }
                else if (API.currentStatus === 409){
                    console.log("horhoorohooorr")
                }
            }
            else {
                console.log("Profile created successfully:", newProfile);
                renderVerification(profil)
            }

        })
        .catch((error) => {
            console.error("Error creating profile:", error);
            renderConnexion("Erreur lors de la création du compte")
        });
}


function clearErrorMessageConnexion(){
    $("#emailError").empty();
    $("#passwordError").empty();
}

function createUserAdminRow(appendString,user){

    let firstClass = user.Authorizations.writeAccess === 2 ? "fa-user-cog" : " fa-user-alt"
    let secondClass = user.Authorizations.writeAccess === 0 ?  "fa-ban redCmd " : "fa-regular fa-circle greenCmd"
    $(appendString).append(`
    <div class="UserContainer">
        <div class="UserLayout">
            <img class="UserAvatar" src="${user.Avatar}">
            <div class="UserInfo">
                <div class="UserName">${user.Name}</div>
                <div class="UserEmail">${user.Email}</div>
            </div>
        </div>
        <div class="UserCommandPanel" id="${user.Id}">
            <i class="fa ${firstClass} dodgerblueCmd cmdIconVisible" ></i>
            <i class="fa ${secondClass} cmdIconVisible"></i>
            <i class="fa fa-user-slash goldenrodCmd cmdIconVisible"></i>
        </div>
    </div>
    `)
    //Delete a User
    $(".goldenrodCmd").click(() => {

        renderAdmin()
    })
    //Unblock User
    $(".redCmd").click(() => {

        renderAdmin()
    })
    //Block User
    $(".greenCmd").click(() => {

        renderAdmin()
    })
    //Promote/unpromote
    $(".dodgerblueCmd").click(() => {

        renderAdmin()
    })
}
