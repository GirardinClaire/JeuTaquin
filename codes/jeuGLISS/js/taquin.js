//               ---   Définition des différentes variables utiles   ---               //

// Formulaire du joueur et ses éléments pour le jeu
let form = document.getElementById("form");
let idJeu = form.elements["idJeu"];
let pseudo = form.elements["pseudo"];

// Formulaire du hall Of Fame et ses éléments
let formHoF = document.getElementById("formHoF");
let nomJeu = formHoF.elements["nomJeu"];
let tableauHoF = document.getElementById("tableauHoF");

// Temps de jeu
let chrono = document.getElementById('timer');

let fondMap = document.getElementById("conteneur");

let btnAleatoire = document.getElementById("btnAleatoire");
let nbCoups = document.getElementById("nbCoups");
let div_score = document.getElementById("nbBienPlace");

// Variables utiles
var idjeu = null; // variable bloquant le formulaire si le jeu sélectionné ne change pas (sinon la validation mélange le jeu comme le bouton "mélange aléatoire")
var tuile_bien_place;
var nombre_de_coup = 0;
var items;
var t; // permet d'initialiser le chrono à chaque nouvelle partie

// [div, numImage]
var tabImage = new Map();
// [numImage,numImage_BD]
var NumToPos = new Map([[1, '0_0'], [2, '0_1'], [3, '0_2'], [4, '0_3'], [5, '1_0'], [6, '1_1'], [7, '1_2'], [8, '1_3'], [9, '2_0'], [10, '2_1'], [11, '2_2'], [12, '2_3'], [13, '3_0'], [14, '3_1'], [15, '3_2']]);








//               ---   HALL OF FAME   ---               //



// Choix du nom de jeu pour le Hall Of Fame
fetch('../jeuGLISS/php/choixHoF.php')
.then(response => response.json())
.then(result => {
  nomJeu.innerHTML = "";
  result.forEach((elem) => {
    nomJeu.innerHTML += elem;
  });
})


// Formulaire du Hall Of Fame : écouter de la validation de ce formulaire
formHoF.addEventListener('submit', validationformulaire1);

function validationformulaire1(event) {
  event.preventDefault(); // pour empêcher le rechargement de la page
  afficheHoF(nomJeu.value);
}

// Affichage du HoF par défaut
afficheHoF('Tous');

function afficheHoF(nameJeu) {
  fetch('../jeuGLISS/php/classement.php?nomJeu='+nameJeu)
  .then(result => result.json())
  .then(result => {
    var listHallOfFame = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'];
    for (let i = 1; i <= 10; i++) {
      var id = listHallOfFame[i-1];
      var tableau = document.getElementById(id);
      tableau.innerHTML = '';
    }
    for (let i = 1; i <= result.length; i++) {
        var pseudo = result[i-1]['pseudo'];
        var temps = result[i-1]['temps'];
        var score = result[i-1]['score'];
        var nomjeu = result[i-1]['nomjeu'];
        var id = listHallOfFame[i-1];
        var tableau = document.getElementById(id);
        tableau.innerHTML = '<td>'+i+'</td><td>'+pseudo+'</td><td>'+temps+'</td><td>'+score+'</td><td>'+nomjeu+'</td>';
    }
  })
}








//               ---   SELECTION D'UN JEU POUR JOUER ET FORMULAIRE DE JEU  ---               //



// Proposition de sélection de différents jeux : les 5 derniers crées et 5 autres tirés aléatoirement
fetch('../jeuGLISS/php/name.php')
.then(response => response.json())
.then(result => {
  idJeu.innerHTML = "";
  result.forEach((elem) => {
    idJeu.innerHTML += elem;
  });
})


// Formulaire de jeu
form.addEventListener('submit', validationformulaire2);


function validationformulaire2(event) {
  event.preventDefault(); // empêche le rechargement de la page
  // le formulaire est-il OK?
  let form_OK = true;
  // Jeu bine sélectionné ?
  if(idJeu.value == 'Choisissez un jeu'){
      form_OK = false;
      idJeu.classList.add("erreur");
  }
  else{
    idJeu.classList.remove("erreur");
  }
  if (idJeu.value == idjeu) {
    form_OK = false;
    idJeu.classList.add("erreur");
  }
  else{
    idJeu.classList.remove("erreur");
  }
  if (pseudo.value == '') {
    form_OK = false;
    idJeu.classList.add("erreur");
  }
  else{
    idJeu.classList.remove("erreur");
  }
  // Si form_OK est faux, on affiche un msg d'erreur sous forme de popup pour l'utilisateur
  if (!form_OK){
    alert("Veuillez entrer un pseudo et choisir un jeu (vous pouvez mélanger le jeu choisi autant de fois que vous le désirez).");
  }
  /*
  Sinon appelle de la fonction qui permet :
  - d'envoyer la requête pour obtenir toutes les informations sur le jeu choisi
  - puis d'affichage des imagettes du jeu choisi
  */
  else {
    recupJeu(idJeu);
  }
  
}








//               ---   AFFICHAGE D'UN JEU SOLVABLE ET MELANGE  ---               //



// Fonction permettant de récupérer tous les attributs d'un jeu
function recupJeu(idJeu) {
  fetch('../jeuGLISS/php/jeu.php?idJeu='+idJeu.value)
  .then(result => result.json())
  .then(imagettes => {
    affichageImagettes(imagettes);
  })
}


// Fonction affichant les imagettes
function affichageImagettes(imagettes) {
  myBD = imagettes;
  
  tabImage = new Map();

  // Vider la map, pour ne pas avoir de superposition
  while (fondMap.firstChild) {
    fondMap.removeChild(fondMap.firstChild);
  }
  // afficher le dernier jeu sélectionné ou mélangé
  let index = 0;
  var liste = listeSolvable(1, 16);
  for (let i = 0; i < 4; i++) {
    for (let k = 0; k < 4; k++) {
      var bulleImage = document.createElement("div");
      var img = document.createElement("img");
      bulleImage.setAttribute("class", "item");
      bulleImage.setAttribute("id", "item_" + i + "_" + k);
      var I = i+1;
      var K = k+1;
      bulleImage.setAttribute("style", "grid-row : "+I+" ; grid-column : "+K);
      img.setAttribute("draggable", "true");
      if (i != 3 || k != 3) {
        img.src = myBD[0]["img_"+NumToPos.get(liste[index])];
        tabImage.set(bulleImage, liste[index]);
      }
      else {
        img.src = "../jeuGLISS/img/CarreBlanc.jpg";
        tabImage.set(bulleImage, "special");
      }
      bulleImage.appendChild(img);
      fondMap.appendChild(bulleImage);
      index++;
    }
  }

  items = document.querySelectorAll("#conteneur > div.item");

  // Initialisation et lancement du chrono
  clearInterval(t);
  departChrono();

  // Initialisation du nbr d'images bien placées
  checkScore(tabImage, items);

  // Initalisation du nbr de coup à chaque initialisation de la map
  nombre_de_coup = 0;
  nbCoups.innerText = "Vous avez réalisé " + nombre_de_coup + " déplacements.";

  items.forEach(item => {

    // Déplacement par glissement
    item.addEventListener('dragstart', (event) => {
      // Permet de ne compter le nbr de coups uniquement sur les cases déplaçables
      if (Movable(item, tabImage) != 0) {
        // MaJ du nbr de coups
        nombre_de_coup += 1;
        nbCoups.innerText = "Vous avez réalisé " + nombre_de_coup + " déplacements.";

        // Déplacement des cases
        possibleMove(item, tabImage);
        
        // MaJ du nbr de cases bien placées
        checkScore(tabImage, items);
      }
      else {
        event.preventDefault();
      }
    });

  });

}


// Gestion du click du bouton de mélange aléatoire
btnAleatoire.onclick = function() {
  if (idJeu.value == 'Choisissez un jeu' || pseudo.value == ''){
    alert('Veuillez choisir un pseudo et sélectionner un jeu pour pouvoir le mélanger.');
  }
  else {
    recupJeu(idJeu);
  }
};


/*
Fonction vérifiant si item est sur la même ligne ou la même colonne que la case vide (sans être la case vide)
- permet d'écouter les évènements click et drag seulement sur les items déplaçables
- permet ainsi de compter les déplacements correctement
- simplifie les déplacements (savoir si sur la même ligne ou la même colonne)
0 : ni sur la même ligne ni sur la même colonne => pas déplaçable
1 : sur la même ligne (x différents et y égaux)
2 : sur la même colonne (x égaux et y différents)
*/
function Movable(item, tabImage) {
  let test = 0;
  let div_special = getItemByValue(tabImage, "special"); // La div_special est la case vide
  var x_special = div_special.getBoundingClientRect().x; // Coordonnée x de la case vide
  var y_special = div_special.getBoundingClientRect().y; // Coordonnée y de la case vide
  var x = item.getBoundingClientRect().x; // Coordonnée x de la case cliquée
  var y = item.getBoundingClientRect().y; // Coordonnée y de la case cliquée

  if (x != x_special && y == y_special) {
    // même ligne (sans être la case vide)
    test = 1;
  }
  if (x == x_special && y != y_special) {
    // même colonne (sans être la case vide)
    test = 2;
  }
  return test
}


// Permet de générer une liste solvable mélangée aléatoirement
function listeSolvable(min, max) {
  var tab = CreationListe(min, max);
  tab = randomize(tab);
  while (soluble(tab) == false) {
    tab = randomize(tab);
  }
  return tab
}


// Permet de générer une liste d'entier [min, max[
function CreationListe(min, max){
  let tab = [];
  for (min; min < max; min ++){
    tab.push(min);
  }
  return tab;
}


/**
Trie un tableau de nombre aléatoirement
@param {Array} tab Tableau de valeurs
@return {Array} Tableau trié aléatoirement
 */
function randomize(tab) {
  for (var i = tab.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      [tab[i], tab[j]] = [tab[j], tab[i]];
  }
  return tab;
}


/*
Détermine si le mélange est solvable ou non :
Calcul de la signature de la permutation (en prenant en compte l'ordre du jeu du taquin)
cf : http://images.math.cnrs.fr/Le-jeu-de-taquin-du-cote-de-chez-Galois
*/
function soluble(tab) {
  var copy = Array.from(tab);
  [copy[0], copy[3]] = [copy[3], copy[0]];
  [copy[1], copy[2]] = [copy[2], copy[1]];
  [copy[8], copy[11]] = [copy[11], copy[8]];
  [copy[9], copy[10]] = [copy[10], copy[9]];
  var signature = 1;
  for (var i = 1; i <= 16; i++) {
    for (var j = i+1; j <= 15; j++) {
      if (i != j) {
        signature *= (copy[j-1]-copy[i-1]) / (j-i);
      }
    }
  }
  // permutation paire si signature = 1
  if (Math.round(signature) == 1) {
    return true;
  }
  // permutation impaire si signature = -1 
  else {
    return false;
  }
}








//               ---   INFORMATIONS LIEES A LA PARTIE EN COURS : chrono, nombre de coups et nombre d'imagettes bien placées  ---               //



// Fonction permettant de lancer le chrono à chaque début de jeu
function departChrono() {
  var nb_min = 0; // nb de minutes au départ
  var nb_sec = 0; // nb de secondes au départ
  var duration = nb_min * 60 + nb_sec; // temps au départ (en secondes)

  chrono.textContent = `${paddedFormat(nb_min)}:${paddedFormat(nb_sec)}`;
  let min = 0;
  let sec = 0;
  t = setInterval(function () {
    min = parseInt(duration / 60);
    sec = parseInt(duration % 60);
    chrono.textContent = `${paddedFormat(min)}:${paddedFormat(sec)}`;
    duration += 1 ;
  } , 1000);//pour executer le timer après chaque seconde (1000 milisecondes)
}

function paddedFormat(num) {
    // Renvoie le nombre complété d'un zéro si <10
    return num < 10 ? "0" + num : num; 
}


/**
Fonction qui met à jour le nombre de tuile bien placées et qui GERE LA FIN DU JEU.
@param {Map} tabImage Map qui associe à chaque case le numéro de tuile qu'elle contient
@param {object} items la liste des cases
*/
function checkScore(tabImage, items) {
  tuile_bien_place = 0;
  for (let index = 0; index < tabImage.size; index++) {
    if (tabImage.get(items[index]) == index + 1) {
      tuile_bien_place += 1;
    }
  }
  div_score.innerText = "Nombre d'images bien placées : " + tuile_bien_place;
  
  // GESTION FIN DE JEU : partie finie si toutes les cases sont à leur place
  if (tuile_bien_place == 15) {
    // remplacer le carre blanc de la div speciale par img_3_3 de la base de donnée pour reconstruire l'image entiere
    let div_special = getItemByValue(tabImage, "special");
    div_special.innerHTML = '<img src=' + myBD[0]["img_3_3"] + '>';
    tabImage.set(div_special, 16);
    // Enregistrer toutes les infos et afficher le msg de fin
    fetch('../jeuGLISS/php/save.php?idJeu='+idJeu.value+'&pseudo='+pseudo.value+'&nbCoups='+nombre_de_coup+'&temps='+chrono.textContent);
    setTimeout(function() {
      alert('Bravo vous avez gagné ! On continue à jouer ?')
      window.location.href = 'index.php';
    }, 2000);   
  }
}








//               ---   DEPLACEMENT DES IMAGETTES  ---               //




/**
fonction qui retourne la clé de la valeur donné en paramètre 
@param {Map} map
@param {object} searchValue la valeur de la clé à chercher
@return {object}  la clé de searchValue
*/
function getItemByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value == searchValue){
      return key;
    }
  }
}


/**
Fonction qui gère les permutations des cases
@param {object} item la case sélectionné par le joueur
@param {Map} tabImage Map qui associe à chaque case le numéro de tuile qu'elle contient
*/
function possibleMove(item, tabImage) {
  var div_special = getItemByValue(tabImage, "special"); // La div_special est la case vide
  var x_special = div_special.getBoundingClientRect().x; // Coordonnée x de la case vide
  var y_special = div_special.getBoundingClientRect().y; // Coordonnée y de la case vide
  var x = item.getBoundingClientRect().x; // Coordonnée x de la case cliquée
  var y = item.getBoundingClientRect().y; // Coordonnée y de la case cliquée
  var long = 88;
  /*
  var hauteur = item.offsetHeight; // Hauteur de la case cliquée : fixe à 88
  var largeur = item.offsetWidth; // Largeur de la case cliquée : fixe à 88
  */

  if (Movable(item, tabImage) == 1) { // cas où la case cliquée et la case vide sont sur la même ligne
    var diffX = Math.floor(Math.abs(x_special-x) / long) + 1 // écart sur la ligne entre les cases
    if (x < x_special) { // case cliquée à gauche de la case blanche
      MoveXgauche(diffX, item);
    }
    if (x_special < x) { // case cliquée à droite de la case blanche
      MoveXdroite(diffX, item);
    }
  }

  if (Movable(item, tabImage) == 2) { // cas où la case cliquée et la case vide sont sur la même colonne
    var diffY = Math.floor(Math.abs(y_special-y) / long) + 1 // écart sur la colonne entre les cases
    if (y < y_special) { // case cliquée au dessus de la case blanche
      MoveYhaut(diffY, item);
    }
    if (y_special < y) { // case cliquée en dessous de la case blanche
      MoveYbas(diffY, item);
    }
  }
}


function MoveXgauche(diff, item) {
  var j = Number(item.id[7]) // colonne de l'item cliqué
  for (let k = j+diff-1 ; k >= j; k--) {
    var item1 = document.getElementById(item.id.substr(0, 7)+k);
    var item2 = document.getElementById(item.id.substr(0, 7)+(k+1));
    var img1 = tabImage.get(item1);
    item2.innerHTML = '<img src=' + myBD[0]["img_" + NumToPos.get(img1)] + '>' ;
    tabImage.set(item2,img1);
  }
  item.innerHTML = '<img src=../jeuGLISS/img/CarreBlanc.jpg>';
  tabImage.set(item,"special");
}


function MoveXdroite(diff, item) {
  var j = Number(item.id[7]) // colonne de l'item cliqué
  for (let k = j-diff+1 ; k <= j; k++) {
    var item1 = document.getElementById(item.id.substr(0, 7)+k);
    var item2 = document.getElementById(item.id.substr(0, 7)+(k-1));
    var img1 = tabImage.get(item1);
    item2.innerHTML = '<img src=' + myBD[0]["img_" + NumToPos.get(img1)] + '>' ;
    tabImage.set(item2,img1);
  }
  item.innerHTML = '<img src=../jeuGLISS/img/CarreBlanc.jpg>';
  tabImage.set(item,"special");
}


function MoveYhaut(diff, item) {
  var i = Number(item.id[5]) // colonne de l'item cliqué
  for (let k = i+diff-1 ; k >= i; k--) {
    var item1 = document.getElementById(item.id.substr(0, 5) + k + item.id.substr(6));
    var item2 = document.getElementById(item.id.substr(0, 5) + (k+1) + item.id.substr(6));
    var img1 = tabImage.get(item1);
    item2.innerHTML = '<img src=' + myBD[0]["img_" + NumToPos.get(img1)] + '>' ;
    tabImage.set(item2,img1);
  }
  item.innerHTML = '<img src=../jeuGLISS/img/CarreBlanc.jpg>';
  tabImage.set(item,"special");
}


function MoveYbas(diff, item) {
  var i = Number(item.id[5]) // colonne de l'item cliqué
  for (let k = i-diff+1 ; k <= i; k++) {
    var item1 = document.getElementById(item.id.substr(0, 5) + k + item.id.substr(6));
    var item2 = document.getElementById(item.id.substr(0, 5) + (k-1) + item.id.substr(6));
    var img1 = tabImage.get(item1);
    item2.innerHTML = '<img src=' + myBD[0]["img_" + NumToPos.get(img1)] + '>' ;
    tabImage.set(item2,img1);
  }
  item.innerHTML = '<img src=../jeuGLISS/img/CarreBlanc.jpg>';
  tabImage.set(item,"special");
}





