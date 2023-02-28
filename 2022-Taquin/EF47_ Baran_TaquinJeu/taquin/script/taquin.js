/**
 * @autor Baran Ilona et Boukbir Ziad
 */

selectJeu = document.getElementById("selectJeu");
fondMap = document.getElementById("conteneur");
btnAleatoire = document.getElementById("btnAleatoire");

nbCoups = document.getElementById("nbCoups");
div_score = document.getElementById("nbBienPlace");

var tuile_bien_place;
var nombre_de_coup;
var items;
var epsilon=5; // Cette variable présente une tolérance sur la difference de hauteur et de largeur entre les cases. Elle est utilisée dans la fonction possibleMove
var tabImage = new Map(); // [div, numImage]
var NumToPos = new Map([[1, '0_0'], [2, '0_1'], [3, '0_2'], [4, '0_3'],
[5, '1_0'], [6, '1_1'], [7, '1_2'], [8, '1_3'], 
[9, '2_0'], [10, '2_1'], [11, '2_2'], [12, '2_3'],
[13, '3_0'], [14, '3_1'], [15, '3_2']]); /* [numImage,numImage_BD] */


/**
 * @autor Baran Ilona
 */
fetch('php/taquin.php')
.then(response => response.json())
.then(result => {
    selectJeu.innerHTML = "";
    result.forEach((elem) => {
        selectJeu.innerHTML += elem;
    });

    var url = new URL(window.location.href);
    var jeu = url.searchParams.get("nJeu");

    if (Number.isInteger(parseInt(jeu))){
        recupNumeroJeu();
    }
})

/**
 * Fonction qui permet d'afficher et de jouer le jeu choisi par le joueur
 * 
 * @autor Baran Ilona et Boukbir Ziad
 */
var recupNumeroJeu = function() {
    var url = new URL(window.location.href);
    var jeu = url.searchParams.get("nJeu");
    var liste = listeAleatoire(1, 16);
    fetch("php/jeu.php?nJeu="+String(jeu))
    .then(r => r.json())
    .then(r => {
      myBD = r;
      let index = 0;
      for (let i = 0; i < 4; i++) {
        for (let k = 0; k < 4; k++) {
          var bulleImage = document.createElement('div');
          var img = document.createElement("img");
          bulleImage.setAttribute("class", "item");
          bulleImage.setAttribute("id", "item_" + i + "_" + k);
          img.setAttribute("draggable", "true");
          if (i != 3 || k != 3) {
            img.src = myBD[0]["img_"+NumToPos.get(liste[index])];
            tabImage.set(bulleImage, liste[index]);
          }
          else {
            img.src = "images/CarreBlanc.jpg";
            tabImage.set(bulleImage, "special");
          }
          bulleImage.appendChild(img);
          fondMap.appendChild(bulleImage);
          index++;
        }
      }
        items = document.querySelectorAll("#conteneur > div.item");
        checkScore(tabImage, items);
        nombre_de_coup = 0;

        items.forEach(item => {
            item.addEventListener('dragend',() => {
                nombre_de_coup += 1;
                nbCoups.innerText = "Vous avez réalisé " + nombre_de_coup + " déplacements";
                possibleMove(item, items, tabImage);
                checkScore(tabImage, items);
            })
        });
    });
}

/**
 * Fonction qui permet de supprimer toutes les imagettes d'un jeu, et d'en ré-afficher un autre avec une autre disposition des imagettes
 * 
 * @autor Baran Ilona
 */
btnAleatoire.onclick = function() {
    while (fondMap.firstChild) {
        fondMap.removeChild(fondMap.firstChild);
      }
    recupNumeroJeu();
};

/**
 * Fonction qui permet de générer une liste de nombre trié aléatoirement
 *
 * @param {int} min Minimum de la liste qu'on souhaite trier
 * @param {int} max Maximum de la liste qu'on souhaite trier
 * @returns Tableau de (max-min) valeur, trié aléatoirement
 * 
 * @autor Baran Ilona
 */
function listeAleatoire(min, max){
    let tableauTrie = [];
    for (min; min < max; min ++){
        tableauTrie.push(min);
    }
    return randomize(tableauTrie);
}

/**
 * Trie un tableau de nombre aléatoirement
 *
 * @param {Array} tab Tableau de valeurs
 * @return {Array} Tableau trié aléatoirement
 *
 * fonction qui provient de : https://www.codegrepper.com/code-examples/javascript/javascript+randomly+shuffle+array
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
















/**
 * fonction qui retourne la position x et position y de la case
 *
 * @param {object} case
 * @return {Array} tableau de 2 elements [position x de la case, position y de la case]
 * 
 * @autor Boukbir Ziad
 */
function getCoordItem(item) {
    var x = item.getBoundingClientRect().x;
    var y = item.getBoundingClientRect().y;
    return [x,y];
}

/**
 * fonction qui permute deux cases
 *
 * @param {object} case 1 
 * @param {object} case 2 
 *
 * @autor Boukbir Ziad
 */
function updateItem(elem1,elem2) {
  var nimage1 = tabImage.get(elem1);
  var nimage2 = tabImage.get(elem2);
  if (nimage1 == 'special') {
    elem1.innerHTML = '<img src=' + myBD[0]["img_" + NumToPos.get(nimage2)] + '>' ;
    tabImage.set(elem1,nimage2);
    elem2.innerHTML = '<img src=images/CarreBlanc.jpg>' ;
    tabImage.set(elem2,"special");
  } else if (nimage2 == 'special') {
    elem2.innerHTML = '<img src=' + myBD[0]["img_" + NumToPos.get(nimage1)] + '>';
    tabImage.set(elem2,nimage1);
    elem1.innerHTML = '<img src=images/CarreBlanc.jpg>' ;
    tabImage.set(elem1,"special");
  } else {
    elem1.innerHTML = '<img src=' + myBD[0]["img_" + NumToPos.get(nimage2)] + '>' ;
    tabImage.set(elem1,nimage2);
    elem2.innerHTML = '<img src=' + myBD[0]["img_" + NumToPos.get(nimage1)] + '>' ;
    tabImage.set(elem2,nimage1);
  }
}

/**
 * fonction qui retourne la clé de la valeur donné en paramètre 
 *
 * @param {Map} map
 * @param {object} searchValue la valeur de la clé à chercher
 * @return {object}  la clé de searchValue
 *
 * @autor Boukbir Ziad
 */
function getItemByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value == searchValue){
      return key;
    }
  }
}

/**
 * Fonction qui gère les permutations des cases
 *
 * @param {object} item la case sélectionné par le joueur
 * @param {object} items la liste des cases
 * @param {Map} tabImage Map qui associe à chaque case le numéro de tuile qu'elle contient
 *
 * @autor Boukbir Ziad
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


/**
 * Fonction qui gère la fin du jeu. Elle verifie si toutes les tuiles sont bien placées
 *
 * @param {Map} tabImage Map qui associe à chaque case le numéro de tuile qu'elle contient
 * @param {object} items la liste des cases
 *
 * @autor Boukbir Ziad
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
    if (tuile_bien_place == 15) {
      div_score.innerText = "Congratulations ! You Won.";
      alert("Congratulations ! You Won.");
      /* remplacer le carre blanc de la div speciale par img_3_3 de la base de donnée pour reconstruire l'image entiere */
      let div_special = getItemByValue(tabImage, "special");
      div_special.innerHTML = '<img src=' + myBD[0]["img_3_3"] + '>';
      tabImage.set(div_special, 16);
    }
  }
