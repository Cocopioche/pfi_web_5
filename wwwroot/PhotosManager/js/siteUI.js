let contentScrollPosition = 0;
renderAbout()
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
                    <span class="dropdown-item" id="manageUserCm">
                        <i class="menuIcon fas fa-user-cog mx-2"></i>
                        Gestion des usagers
                        </span>
                <div class="dropdown-divider"></div>
                <span class="dropdown-item" id="logoutCmd">
                    <i class="menuIcon fa fa-sign-out mx-2"></i>
                    Déconnexion
                </span>
                <span class="dropdown-item" id="editProfilMenuCmd">
                    <i class="menuIcon fa fa-user-edit mx-2"></i>
                    Modifier votre profil
                </span>
                <div class="dropdown-divider"></div>
                <span class="dropdown-item" id="listPhotosMenuCmd">
                    <i class="menuIcon fa fa-image mx-2"></i>
                    Liste des photos
                </span>
                <div class="dropdown-divider"></div>
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
                    <div class="dropdown-divider"></div>
                    <span class="dropdown-item" id="aboutCmd">
                    <i class="menuIcon fa fa-info-circle mx-2"></i>
                    À propos...
                </span>
            </div>
        `)
    )
}
function renderAbout() {
    timeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("À propos...", "about");

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