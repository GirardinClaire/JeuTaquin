//   --- Obtention des différents éléments ---   //

// Formulaire et ses éléments
let form = document.getElementById("form");
let idJeu = form.elements["idJeu"]

let fondMap = document.getElementById("conteneur");

let btnAleatoire = document.getElementById("btnAleatoire");
let nbCoups = document.getElementById("nbCoups");
let div_score = document.getElementById("nbBienPlace");

/*
variables utiles
*/
var idjeu = null; // variable bloquant le formulaire si le jeu sélectionné ne change pas (sinon la validation mélange le jeu comme le bonton)
var tuile_bien_place;
var nombre_de_coup = 0;
var items;
var epsilon=5; // Cette variable présente une tolérance sur la difference de hauteur et de largeur entre les cases. Elle est utilisée dans la fonction possibleMove

// [div, numImage]
var tabImage = new Map();
// [numImage,numImage_BD]
var NumToPos = new Map([[1, '0_0'], [2, '0_1'], [3, '0_2'], [4, '0_3'], [5, '1_0'], [6, '1_1'], [7, '1_2'], [8, '1_3'], [9, '2_0'], [10, '2_1'], [11, '2_2'], [12, '2_3'], [13, '3_0'], [14, '3_1'], [15, '3_2']]);


// Proposition de sélection de différents jeux
fetch('../jeu/php/name.php')
.then(response => response.json())
.then(result => {
  idJeu.innerHTML = "";
  result.forEach((elem) => {
    idJeu.innerHTML += elem;
  });
})


// Validation du formulaire
form.addEventListener('submit', validationformulaire);

function validationformulaire(event) {
  console.log(idjeu);
  event.preventDefault();
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
  // Si form_OK est faux, on affiche un msg d'erreur sous forme de popup pour l'utilisateur
  if (!form_OK){
    alert("Veuillez choisir un jeu ou mélanger le jeu choisi autant de fois que vous le désirez.");
  }
  /*
  Sinon on l'envoie :
  - enregsitrement du nom du jeu choisi
  - requête pour obtenir toutes les informations sur le jeu choisi
  PUIS
  affichage des imagettes du jeu choisi
  */
  else {
    console.log(idjeu);
    idjeu = idJeu.value;
    recupJeu(idJeu);
  }
  
}

/*
Fonction permettant de récupérer tous les attributs d'un jeu
*/
function recupJeu(idJeu) {
  fetch('../jeu/php/jeu.php?idJeu='+idJeu.value)
  .then(result => result.json())
  .then(imagettes => {
    affichageImagettes(imagettes);
  })
}


function affichageImagettes(imagettes) {
  myBD = imagettes;
  
  tabImage = new Map();

  console.log('coucou1');
  // Vider la map, pour ne pas avoir de superposition
  while (fondMap.firstChild) {
    fondMap.removeChild(fondMap.firstChild);
    console.log('coucou2');
  }
  // afficher le dernier jeu sélectionné ou mélangé
  let index = 0;
  var liste = listeAleatoire(1, 16);
  for (let i = 0; i < 4; i++) {
    for (let k = 0; k < 4; k++) {
      console.log('coucou3');
      var bulleImage = document.createElement("div");
      var img = document.createElement("img");
      bulleImage.setAttribute("class", "item");
      bulleImage.setAttribute("id", "item_" + i + "_" + k);
      img.setAttribute("draggable", "false");
      if (i != 3 || k != 3) {
        img.src = myBD[0]["img_"+NumToPos.get(liste[index])];
        tabImage.set(bulleImage, liste[index]);
      }
      else {
        img.src = "../jeu/img/CarreBlanc.jpg";
        tabImage.set(bulleImage, "special");
      }
      bulleImage.appendChild(img);
      fondMap.appendChild(bulleImage);
      index++;
    }
  }
  console.log('coucou4');

  items = document.querySelectorAll("#conteneur > div.item");
  
  console.log(tabImage);
  console.log(items);
  checkScore(tabImage, items);

/*
Il faut mieux gérer le nombre de coup.
idée : bloquer le click si pas sur la ligne ou la colonne de la case blanche
*/
  // Initalisation du nbr de coup à chaque initialisation de la map
  nombre_de_coup = 0;
  nbCoups.innerText = "Vous avez réalisé " + nombre_de_coup + " déplacements";

  items.forEach(item => {
    item.addEventListener('dragend',(event) => { event.preventDefault;});
    item.addEventListener('click',() => {
      console.log(Movable(item, tabImage))
      if (Movable(item, tabImage) == true) {
        nombre_de_coup += 1;
        nbCoups.innerText = "Vous avez réalisé " + nombre_de_coup + " déplacements";
        possibleMove(item, items, tabImage);
        checkScore(tabImage, items);
      }
      console.log(nombre_de_coup);
    })
  });

  

}


/*
Fonction vérifiant si item est sur la même ligne ou la même colonne que la case vide (sans être la case vide)
permet d'écouter les évènements click et dragend seulement sur les item déplaçable
et permet ainsi de compter les déplacements correctement
*/
function Movable(item, tabImage) {
  let test = false;
  let div_special = getItemByValue(tabImage, "special"); // La div_special est la case vide
  let x_special = getCoordItem(div_special)[0]; // Coordonnée x de la case vide
  let y_special = getCoordItem(div_special)[1]; // Coordonnée y de la case vide
  let x = getCoordItem(item)[0]; // Coordonnée x de la case cliquée
  let y = getCoordItem(item)[1]; // Coordonnée y de la case cliquée
  if ((x == x_special && y != y_special) || (x != x_special && y == y_special)) {
    test = true;
  }
  return test
}


/*
Fonction qui permet de supprimer toutes les imagettes d'un jeu, et d'en ré-afficher un autre avec une autre disposition des imagettes
- récupère l'id du jeu sélectionné (si pas de jeu sélectionné, alors affichage d'un msg d'erreur)
- supprimer le jeu affiché
- affiche de nouveau en mélangeant le jeu
*/
btnAleatoire.onclick = function() { 
  console.log(idJeu.value);
  if (idJeu.value == 'Choisissez un jeu'){
    alert('Veuillez sélectionner un jeu pour pouvoir le mélanger');
  }
  else {
    recupJeu(idJeu);
  }
};



/**
Fonction qui met à jour le nombre de tuile bien placées et qui gère la fin du jeu.
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

  /* Win if score=15 */

/*
ajouter un popup avec Formulaire pour enregistrer le nom du joueur et supprimer les lignes NULL d'avant
(si le jeu a été rechergé plusieurs fois etc)
*/

  if (tuile_bien_place == 15) {
    div_score.innerText = "Congratulations ! You Won.";
    alert("Congratulations ! You Won.");
    /* remplacer le carre blanc de la div speciale par img_3_3 de la base de donnée pour reconstruire l'image entiere */
    let div_special = getItemByValue(tabImage, "special");
    div_special.innerHTML = '<img src=' + imagettes[0]["img_3_3"] + '>';
    tabImage.set(div_special, 16);
  }
}




// Permet de générer une liste de nombre trié aléatoirement 
function listeAleatoire(min, max){
  let tableauTrie = [];
  for (min; min < max; min ++){
      tableauTrie.push(min);
  }
  return randomize(tableauTrie);
}


/**
Trie un tableau de nombre aléatoirement
@param {Array} tab Tableau de valeurs
@return {Array} Tableau trié aléatoirement
fonction qui provient de : https://www.codegrepper.com/code-examples/javascript/javascript+randomly+shuffle+array
 */
function randomize(tab) {
  var i, j, tmp;
  for (i = tab.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      tmp = tab[i];
      tab[i] = tab[j];
      tab[j] = tmp;
  }
  return tab;
}





////////////////////////////////////////////////////////////////////////////////////
/*

revoir ces fonctions et notamment bloquer directement le click si pas sur la bonne ligne ou colonne

*/
////////////////////////////////////////////////////////////////////////////////////


/**
fonction qui retourne la position x et position y de la case
@param {object} case
@return {Array} tableau de 2 elements [position x de la case, position y de la case]
*/
function getCoordItem(item) {
  var x = item.getBoundingClientRect().x;
  var y = item.getBoundingClientRect().y;
  return [x,y];
}


/**
fonction qui permute deux cases
@param {object} case 1 
@param {object} case 2 
*/
function updateItem(elem1,elem2) {
  var nimage1 = tabImage.get(elem1);
  var nimage2 = tabImage.get(elem2);
  if (nimage1 == 'special') {
    elem1.innerHTML = '<img src=' + myBD[0]["img_" + NumToPos.get(nimage2)] + '>' ;
    tabImage.set(elem1,nimage2);
    elem2.innerHTML = '<img src=../jeu/img/CarreBlanc.jpg>' ;
    tabImage.set(elem2,"special");
  } else if (nimage2 == 'special') {
    elem2.innerHTML = '<img src=' + myBD[0]["img_" + NumToPos.get(nimage1)] + '>';
    tabImage.set(elem2,nimage1);
    elem1.innerHTML = '<img src=../jeu/img/CarreBlanc.jpg>' ;
    tabImage.set(elem1,"special");
  } else {
    elem1.innerHTML = '<img src=' + myBD[0]["img_" + NumToPos.get(nimage2)] + '>' ;
    tabImage.set(elem1,nimage2);
    elem2.innerHTML = '<img src=' + myBD[0]["img_" + NumToPos.get(nimage1)] + '>' ;
    tabImage.set(elem2,nimage1);
  }
}

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
@param {object} items la liste des cases
@param {Map} tabImage Map qui associe à chaque case le numéro de tuile qu'elle contient
*/
function possibleMove(item,items,tabImage) {
  var xmin=items[0].getBoundingClientRect().x; // xmin de la grille des cases
  var xmax=items[15].getBoundingClientRect().x; // xmax de la grille des cases
  var ymin=items[0].getBoundingClientRect().y; // ymin de la grille des cases
  var ymax=items[15].getBoundingClientRect().y; // ymax de la grille des cases
  var div_special = getItemByValue(tabImage, "special"); // La div_special est la case vide
  var x_special = getCoordItem(div_special)[0]; // Coordonnée x de la case vide
  var y_special = getCoordItem(div_special)[1]; // Coordonnée y de la case vide
  var x = getCoordItem(item)[0]; // Coordonnée x de la case cliquée
  var y = getCoordItem(item)[1]; // Coordonnée y de la case cliquée
  var hauteur = item.offsetHeight; // Hauteur de la case cliquée
  var largeur = item.offsetWidth; // Largeur de la case cliquée
  if (x == x_special) { // Le cas où la case cliquée est sur la meme colonne que la case vide
    if (y_special == ymin) { // Le cas où la case vide est sur la premiere ligne
      if (y >= y_special + hauteur - epsilon && y <= y_special + hauteur + epsilon) { // Le cas où la case cliquée est collée à la case vide
        updateItem(div_special, item); // on permute la case cliquée avec la case vide 
      }
      else if (y >= y_special + 2 * hauteur - epsilon && y <= y_special + 2 * hauteur + epsilon) { // Le cas où il y a une case entre la case cliquée et la case vide
        var item_y_100 = document.getElementById(item.id.substr(0, 5) + (Number(item.id[5]) - 1) + item.id.substr(6)); // La case entre les deux
        // on permute la case cliquée avec la case vide 
        // enfin la case cliquée avec la case entre les deux
        updateItem(div_special, item);
        updateItem(div_special, item_y_100);
      }
      else if (y >= y_special + 3 * hauteur - epsilon && y <= y_special + 3 * hauteur + epsilon) { // Le cas où il y a deux case entre la case cliquée et la case vide
        var item_y_100=document.getElementById(item.id.substr(0, 5) + (Number(item.id[5]) - 1) + item.id.substr(6)); // La premiere case entre les deux
        var item_y_200=document.getElementById(item.id.substr(0, 5) + (Number(item.id[5]) - 2) + item.id.substr(6)); // La deuxieme case entre les deux
        // on permute la case cliquée avec la case vide 
        // ensuite la case cliquée avec la premiere case intermediaire 
        // enfin la premiere case intermediaire avec la deuxieme case intermediaire
        updateItem(div_special, item);
        updateItem(div_special, item_y_100);
        updateItem(div_special, item_y_200);
      }
    }
    else if (y_special >= ymin + hauteur - epsilon && y_special <= ymin + hauteur + epsilon) { // Le cas où la case vide est sur la deuxieme ligne
      if (y >= y_special - hauteur - epsilon && y <= y_special - hauteur + epsilon || y >= y_special + hauteur - epsilon && y <= y_special + hauteur + epsilon) { // Le cas où la case cliquée est collée à la case vide
        updateItem(div_special, item); // on permute la case cliquée avec la case vide 
      }
      else if (y >= y_special + 2 * hauteur - epsilon && y <= y_special + 2 * hauteur + epsilon) { // Le cas où il y a une case entre la case cliquée et la case vide
        var item_y_100 = document.getElementById(item.id.substr(0, 5) + (Number(item.id[5]) - 1) + item.id.substr(6)); // La case entre les deux
        // on permute la case cliquée avec la case vide 
        // enfin la case cliquée avec la case entre les deux
        updateItem(div_special, item);
        updateItem(div_special, item_y_100);
      }
    }
    else if (y_special >= ymin + 2 * hauteur - epsilon && y_special <= ymin + 2 * hauteur + epsilon) { // Le cas où la case vide est sur la troisieme ligne
      if (y >= y_special - hauteur - epsilon && y <= y_special - hauteur + epsilon || y >= y_special + hauteur - epsilon && y <= y_special + hauteur + epsilon) { // Le cas où la case cliquée est collée à la case vide
        updateItem(div_special, item); // on permute la case cliquée avec la case vide 
      }
      else if (y >= y_special - 2  * hauteur - epsilon && y <= y_special - 2 * hauteur + epsilon) { // Le cas où il y a une case entre la case cliquée et la case vide
        var item_y_100 = document.getElementById(item.id.substr(0, 5) + (Number(item.id[5]) + 1) + item.id.substr(6)); // La case entre les deux
        // on permute la case cliquée avec la case vide 
        // enfin la case cliquée avec la case entre les deux
        updateItem(div_special, item);
        updateItem(div_special, item_y_100);
      }
    }
    else if (y_special == ymax) { // Le cas où la case vide est sur la derniere ligne
      if (y >= y_special - hauteur - epsilon && y <= y_special - hauteur + epsilon) { // Le cas où la case cliquée est collée à la case vide
        updateItem(div_special, item); // on permute la case cliquée avec la case vide 
      }
      else if (y >= y_special - 2 * hauteur - epsilon && y <= y_special - 2 * hauteur + epsilon) { // Le cas où il y a une case entre la case cliquée et la case vide
        var item_y_100 = document.getElementById(item.id.substr(0, 5) + (Number(item.id[5]) + 1) + item.id.substr(6)); // La case entre les deux
        // on permute la case cliquée avec la case vide 
        // enfin la case cliquée avec la case entre les deux
        updateItem(div_special, item);
        updateItem(div_special, item_y_100);
      }
      else if (y >= y_special - 3 * hauteur - epsilon && y <= y_special - 3 * hauteur + epsilon) { // Le cas où il y a deux case entre la case cliquée et la case vide
        var item_y_100 = document.getElementById(item.id.substr(0, 5) + (Number(item.id[5]) + 1) + item.id.substr(6)); // La premiere case entre les deux
        var item_y_200 = document.getElementById(item.id.substr(0, 5) + (Number(item.id[5]) + 2) + item.id.substr(6)); // La deuxieme case entre les deux
        // on permute la case cliquée avec la case vide 
        // ensuite la case cliquée avec la premiere case intermediaire 
        // enfin la premiere case intermediaire avec la deuxieme case intermediaire
        updateItem(div_special, item);
        updateItem(div_special, item_y_100);
        updateItem(div_special, item_y_200);
      }
    }
  }
  else if (y == y_special) { // Le cas où la case cliquée est sur la meme ligne que la case vide
    if (x_special == xmin) { // Le cas où la case vide est sur la premiere colonne
      if (x >= x_special + largeur - epsilon && x <= x_special + largeur + epsilon) { // Le cas où la case cliquée est collée à la case vide
        updateItem(div_special, item); // on permute la case cliquée avec la case vide 
      }
      else if (x >= x_special + 2 * largeur - epsilon && x <= x_special + 2 * largeur + epsilon) { // Le cas où il y a une case entre la case cliquée et la case vide
        var item_x_100 = document.getElementById(item.id.substr(0, 7) + (Number(item.id[7]) - 1)); // La case entre les deux
        // on permute la case cliquée avec la case vide 
        // enfin la case cliquée avec la case entre les deux
        updateItem(div_special, item);
        updateItem(div_special, item_x_100);
      }
      else if (x >= x_special + 3 * largeur - epsilon && x <= x_special + 3 * largeur + epsilon) { // Le cas où il y a deux case entre la case cliquée et la case vide
        var item_x_100 = document.getElementById(item.id.substr(0, 7) + (Number(item.id[7]) - 1)); // La premiere case entre les deux
        var item_x_200 = document.getElementById(item.id.substr(0, 7) + (Number(item.id[7]) - 2)); // La deuxieme case entre les deux
        // on permute la case cliquée avec la case vide 
        // ensuite la case cliquée avec la premiere case intermediaire 
        // enfin la premiere case intermediaire avec la deuxieme case intermediaire
        updateItem(div_special, item);
        updateItem(div_special, item_x_100);
        updateItem(div_special, item_x_200);
      }
    }
    else if (x_special >= xmin + largeur - epsilon && x_special <= xmin + largeur + epsilon) { // Le cas où la case vide est sur la deuxieme colonne
      if (x >= x_special - largeur - epsilon && x <= x_special - largeur + epsilon || x >= x_special + largeur - epsilon && x <= x_special + largeur + epsilon) { // Le cas où la case cliquée est collée à la case vide
        updateItem(div_special, item); // on permute la case cliquée avec la case vide 
      }
      else if (x >= x_special + 2 * largeur - epsilon && x <= x_special + 2 * largeur + epsilon) { // Le cas où il y a une case entre la case cliquée et la case vide
        var item_x_100 = document.getElementById(item.id.substr(0, 7) + (Number(item.id[7]) - 1)); // La case entre les deux
        // on permute la case cliquée avec la case vide 
        // enfin la case cliquée avec la case entre les deux
        updateItem(div_special, item);
        updateItem(div_special, item_x_100);
      }
    }
    else if (x_special >= xmin + 2 * largeur - epsilon && x_special <= xmin + 2 * largeur + epsilon) { // Le cas où la case vide est sur la troisieme colonne
      if (x >= x_special - largeur - epsilon && x <= x_special - largeur + epsilon || x >= x_special + largeur - epsilon && x <= x_special + largeur + epsilon) { // Le cas où la case cliquée est collée à la case vide
        updateItem(div_special, item); // on permute la case cliquée avec la case vide 
      }
      else if (x >= x_special - 2 * largeur - epsilon && x <= x_special - 2 * largeur + epsilon) { // Le cas où il y a une case entre la case cliquée et la case vide
        var item_x_100 = document.getElementById(item.id.substr(0, 7) + (Number(item.id[7]) + 1)); // La case entre les deux
        // on permute la case cliquée avec la case vide 
        // enfin la case cliquée avec la case entre les deux
        updateItem(div_special, item);
        updateItem(div_special, item_x_100);
      }
    }
    else if (x_special == xmax) { // Le cas où la case vide est sur la derniere colonne
      if (x >= x_special - largeur - epsilon && x <= x_special - largeur + epsilon) { // Le cas où la case cliquée est collée à la case vide
        updateItem(div_special, item); // on permute la case cliquée avec la case vide 
      }
      else if (x >= x_special - 2 * largeur - epsilon && x <= x_special - 2 * largeur + epsilon) { // Le cas où il y a une case entre la case cliquée et la case vide
        var item_x_100 = document.getElementById(item.id.substr(0, 7) + (Number(item.id[7]) + 1)); // La case entre les deux
        // on permute la case cliquée avec la case vide 
        // enfin la case cliquée avec la case entre les deux
        updateItem(div_special, item);
        updateItem(div_special, item_x_100);
      }
      else if (x >= x_special - 3 * largeur - epsilon && x <= x_special - 3 * largeur + epsilon) { // Le cas où il y a deux case entre la case cliquée et la case vide
        var item_x_100 = document.getElementById(item.id.substr(0, 7) + (Number(item.id[7]) + 1)); // La premiere case entre les deux
        var item_x_200 = document.getElementById(item.id.substr(0, 7) + (Number(item.id[7]) + 2)); // La deuxieme case entre les deux
        // on permute la case cliquée avec la case vide 
        // ensuite la case cliquée avec la premiere case intermediaire 
        // enfin la premiere case intermediaire avec la deuxieme case intermediaire
        updateItem(div_special, item);
        updateItem(div_special, item_x_100);
        updateItem(div_special, item_x_200);
      }
    }
  }
}
