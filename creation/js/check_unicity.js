//récupération des éléments de la page HTML
but_val = document.getElementById('but_val');
nom_jeu = document.getElementById('nom_jeu');
msg_erreur = document.getElementById('msg');


/*
Fonction modifiant le nom saisi pour qu'il ne contienne :
- ni de majuscules
- ni d'accents
- ni de caractères spéciaux
- ni d'espaces
*/
function filter_string(name){
  //passage de tous les caractères en minuscules
  name = name.toLowerCase();
  //conversion des accents en lettres non accentuées et suppression des caractères spéciaux
  name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  name = name.replace(/[^\w\s]/gi, '');
  //remplacement des espaces par des underscores
  name = name.replaceAll(" ","_");
  return name;
}


/* 
Fonction désactivant le bouton de validation par défaut, et l'activant si
- le nom saisie est correct (cf fonction filter_string)
et si
- le nom n'existe pas déjà dans la base de données
*/
function check_unicity() {

  // Récupération du nom
  nom_test = nom_jeu.value;

  // Modification du nom
  nom_correct = filter_string(nom_test);

  // Initialisation du msg d'erreur
  msg_erreur.innerHTML = "";

  // Désactivation du bouton de validation par défaut
  but_val.disabled = true;

  if (nom_correct !== nom_test) {
    but_val.disabled = true;
    msg_erreur.innerHTML = "Le nom saisi n'est pas correct. <br>Il ne doit contenir ni de majuscules, ni d'accents, ni de caractères spéciaux, ni d'espace.";  
  }

  if (nom_test == '') {
    but_val.disabled = true;
    msg_erreur.innerHTML = "Veuillez saisir un nom de jeu.";   
  }

  // Stockage du nom dans un format data adapté à l'envoie en POST
  data = "nom_test="+nom_test;

  // Appel asynchrone du script PHP renvoyant le nombre de fois que le nom saisi dans data se trouve dans la base de données
  fetch("../creation/php/check_unicity.php", {
    method: 'post',
    body: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(r => r.json())
  .then(r => {
    // Si il n'existe pas de nom similaire dans la base de données et que le nom est correctement saisi ...
    if (parseInt(r) < 1 && nom_test == nom_correct && nom_test != ''){
      // ... Activation du bouton de validation
      but_val.disabled = false;
      msg_erreur.innerHTML = "";
    }
    // Sinon conservation de l'état désactivé du bouton de validation et modification du msg d'erreur
    else if (parseInt(r) >= 1) {
      but_val.disabled = true;
      msg_erreur.innerHTML = "Le nom saisi existe déjà dans la base de donnée. Veuillez en saisir un autre.";
    }
  })

}


//Ajout d'un eventListener lançant la fonction check_unicity à chaque changement dans le champ de saisi du nom du jeu de données
nom_jeu.addEventListener("input", check_unicity);



