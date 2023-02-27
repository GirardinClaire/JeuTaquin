//            Drag & Drop fait main pour le jeu du Taquin : début de recherche         //




/*

Déroulé du jeu

*/

let majjeu = MaJduJeu(); // Initialisation du jeu
carreBlanc = majjeu[0];
var ligne = carreBlanc.id[0];
var colonne = carreBlanc.id[2];

carresMove = majjeu[1];

deplacement(); // écoute des évènements de déplacement 


/*
Fonctions utiles
*/

// Fonction à lancer au départ et à chaque fois que des carrés sont déplacés
function MaJduJeu() {
  // Récupérer le carré blanc
  var carreBlanc = document.querySelectorAll('.special');
  carreBlanc = [...carreBlanc][0];
  var id = carreBlanc.id;
  var ligne = id[0];
  var colonne = id[2];


  // Récupérer tous les carrés autre que le blanc et déterminer s'ils peuvent bouger ou non
  // i.e. est-ce qu'ils sont sur la même ligne ou la même colonne que le carré blanc
  var carres = document.querySelectorAll('.carre');
  carres = [...carres];

  var carresMove = [];
  var carresBloc = [];

  carres.forEach( carre => {
    if (carre.id[0] == ligne || carre.id[2] == colonne) {
      carresMove.push(carre);
    }
    else {
      carresBloc.push(carre);
    }
  })

  // Empêcher le drag&drop par défaut du navigateur pour tous les carrés
  carreBlanc.addEventListener('dragstart', function( event ) { event.preventDefault(); });
  carres.forEach(carre => {
    carre.addEventListener('dragstart', function( event ) { event.preventDefault(); });
  })

  return [carreBlanc, carresMove]

}



// Fonction permettant de déplacer les carrés déplaçables (1 seul ou 2 en même temps)
function deplacement() {
  carresMove.forEach( carre => {
    // Si carré sur la même ligne que le carré blanc : déplacement selon la ligne
    if (carre.id[0] == ligne) {
      if (Math.abs(carre.id[2] - colonne) == 1) {
        // Move X 1 carré
        carre.addEventListener('mousedown', function(event) {  DownX1(event, carre) })
        carre.addEventListener('mouseup', function() { UpX1(carre) })
      }

      if (Math.abs(carre.id[2] - colonne) == 2) {
        // Move X 2 carrés
        if (colonne < carre.id[2]) {
          // Bouger le carré à sa DROITE en même temps
          const idBis = `${ligne}_${Number(carre.id[2]) - 1}`
          let carreBis = document.getElementById(idBis);
          carre.addEventListener('mousedown', function(event) { DownX2(event, carre, carreBis) })
          carre.addEventListener('mouseup', function() { UpX2(carre, carreBis) })
        }
        else {
          // Bouger le carré à sa GAUCHE en même temps
          const idBis = `${ligne}_${Number(carre.id[2]) + 1}`
          let carreBis = document.getElementById(idBis);
          carre.addEventListener('mousedown', function(event) { DownX2(event, carre, carreBis) })
          carre.addEventListener('mouseup', function() { UpX2(carre, carreBis) })
        }

      }

      /* Dans le cas d'un 4x4
      if (Math.abs(carre.id[0] - colonne) == 3) {
        // Move X 3 carrés
        carre.addEventListener('mousedown', function(event) { DownX3(event, carre) })
        carre.addEventListener('mouseup', function() { UpX3(carre) })
      }
      */
    }

    /*
    // Si carré sur la même colonne que le carré blanc : déplacement selon la colonne
    if (carre.id[2] == colonne) {
      if (Math.abs(carre.id[0] - ligne) == 1) {
        // Move Y 1 carré
        carre.addEventListener('mousedown', function(event) { DownY1(event, carre) })
        carre.addEventListener('mouseup', function() { UpY1(carre) })
      }
      if (Math.abs(carre.id[0] - ligne) == 2) {
        // Move Y 2 carrés
        carre.addEventListener('mousedown', function(event) { DownY2(event, carre) })
        carre.addEventListener('mouseup', function() { UpY2(carre) })
      }
      // Dans le cas d'un 4x4
      if (Math.abs(carre.id[0] - ligne) == 3) {
        // Move Y 3 carrés
        carre.addEventListener('mousedown', function(event) { DownY3(event, carre) })
        carre.addEventListener('mouseup', function() { UpY3(carre) })
      }
    }
    */

  })
}

var _test1 ;
var _test2 ;

// Fonctions DOWN
function DownX1(event, carre) {
  let Dxf = 0;
  let Dyf = 0;
  Xo = event.clientX;
  Yo = event.clientY;
  _test1 = function(event) { MOVE1(event, carre, Dxf, Dyf) }
  carre.addEventListener('mousemove', _test1);
}

function DownX2(event, carre, carreBis) {
  let Dxf = 0;
  let Dyf = 0;
  Xo = event.clientX;
  Yo = event.clientY;
  _test2 = function(event) { MOVE2(event, carre, carreBis, Dxf, Dyf) }
  carre.addEventListener('mousemove', _test2);
}


// Fonctions UP

// Fonction à revoir !!!!! 
/*
il faut tester si dans la bonne case :
Si oui, changement des carrés
Sinon, remise en l'état
*/
function UpX1(carre) {
  //Dxf = Dx;
  //Dyf = Dy;
  carre.removeEventListener('mousemove', _test1);
}
function UpX2(carre) {
  Dxf = Dx;
  Dyf = Dy;
  carre.removeEventListener('mousemove', _test2);
}



// Fonctions MOVE
function MOVE1(event, carre, Dxf, Dyf) {
  Xm = event.clientX;
  Ym = event.clientY;
  Dx = Xm - Xo + Dxf;
  Dy = Ym - Yo + Dyf;
  carre.style.transform = `translate(${Dx}px,${Dy}px)`;
}

function MOVE2(event, carre, carreBis, Dxf, Dyf) {
  Xm = event.clientX;
  Ym = event.clientY;
  Dx = Xm - Xo + Dxf;
  Dy = Ym - Yo + Dyf;
  carre.style.transform = `translate(${Dx}px,${Dy}px)`;
  carreBis.style.transform = `translate(${Dx}px,${Dy}px)`;
}







































