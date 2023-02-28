
function filter_string(string){
//fonction convertissant une chaine de caractère de saisie en chaine de format standard

  //passage de tous les caractères en minuscules
  string = string.toLowerCase();

  //conversion des accents en lettres non accentuées et suppression des caractères spéciaux
  string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  string = string.replace(/[^\w\s]/gi, '');

  //remplacement des espaces par des underscores
  string = string.replaceAll(" ","_");

  return string;
}

//récupération des widgets du formulaire
but_val = document.getElementById('but_val');
nom_jeu = document.getElementById('nom_jeu');


function check_unicity() {
//fonction désactivant le bouton de validation par défaut, et l'activant si le nom saisie converti par filter_string n'existe pas dans la base de données

  //désactivation du bouton de validation
  but_val.disabled = true;

  //récupération et filtrage du nom saisi
  nom_test = nom_jeu.value;
  nom_test = filter_string(nom_test);

  //stockage du nom dans un format data adapté à l'envoie en POST
  data = "nom_test="+nom_test;

  //appel asynchrone du script php renvoyant le nombre de fois que le nom saisi dan data se trouve dans la base de données
  fetch("../PHP/check_unicity.php", {
    method: 'post',
    body: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(r => r.json())
  .then(r => {
    //Si Il n'existe pas de nom similaire dans la base de données
    if (parseInt(r) < 1){
      //activation du bouton de validation
      but_val.disabled = false;
    }
    //Sinon
    else {
      //Conservation de l'état désactivé du bouton de validation
      but_val.disabled = true;

    }
  })
}

//Ajout d'un eventListener lançant la fonction check_unicity à chaque changement dans le champ de saisi du nom du jeu de données
nom_jeu.addEventListener("input", check_unicity);
