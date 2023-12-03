let contentScrollPosition = 0;
renderConnexion()
console.log("here")

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
                    Auteur: Nicolas Chourot
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
    $("#content").append(`…html du formulaire…`);//TODO
    $('#loginCmd').on('click', renderLoginForm); // call back sur clic
    initFormValidation();
    initImageUploaders();
    $('#abortCmd').on('click', renderLoginForm); // call back sur clic
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

function renderConnexion(){
    noTimeout()
    eraseContent()
    updateHeader("Connexion","profil")
    $("#newPhotoCmd").hide();
    $(".dropdown-menu").append(getDropdownItem("fa-sign-in","loginCmd","Connexion"))
    $(".dropdown-menu").append('<div class="dropdown-divider"></div>')
    $(".dropdown-menu").append(getDropdownItem("fa-info-circle","aboutCmd","À propos..."))
}