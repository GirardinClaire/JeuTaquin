//récupération des éléments de la page HTML
but_val = document.getElementById('but_val');
nom_jeu = document.getElementById('nom_jeu');
msg_erreur = document.getElementById('msg');

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

class Visualisateur {
//Classe contenant le visualisateur et les méthodes qui lui sont associées
  constructor(x_base, y_base, zoom, elem_name, layer = "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2", format = "image/png"){
  //Constructeur du visualisateur

    //définition de la liste des fonds de carte. un fond de carte est représenté par un dictionnaire contenant le nom de la couche (layer) et le format d'image renvoyé (format)
    this.liste_maps_ = [{layer:"GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2", format:"image/png"}, {layer:"ORTHOIMAGERY.ORTHOPHOTOS", format:"image/jpeg"}];

    //définition de la coordonnée du coin haut gauche initial
    this.x_base_ = x_base;
    this.y_base_ = y_base;

    //définition du niveau de zoom initial
    this.zoom_ = zoom;

    //définition du dictionnaire contenant les url des images affichées, avec comme clé la position au format [ligne]_[colone]
    this.table_url_act_ = {
      "0_0" : "","0_1" : "","0_2" : "","0_3" : "",
      "1_0" : "","1_1" : "","1_2" : "","1_3" : "",
      "2_0" : "","2_1" : "","2_2" : "","2_3" : "",
      "3_0" : "","3_1" : "","3_2" : "","3_3" : "",
    };

    //definition du nom initial du jeu
    this.elem_name_ = elem_name;

    //définition du fond de carte par défaut
    this.layer_ = layer;
    this.format_ = format;

    //chargement des imagettes du visualisateur
    this.loader_carte();
  }

//I : Méthodes directionnelles

  dec_east() {
  //1) Méthode permettant de décaller l'emprise vers l'Est
    //calcul du x_base_ max du niveau de zoom actuel
    let x_base_max = 3;
    for (var i = 0; i < this.zoom_-2; i++) {
      x_base_max = parseInt(x_base_max*2 +1);
    }
    //si la vue souhaitée ne dépasse pas la grille du WMTS, on déplace la vue
    if (this.x_base_ +4  < x_base_max) {
      this.x_base_++;
      this.loader_carte();
    }
  }

  dec_west() {
  //2) Méthode permettant de décaller l'emprise vers l'Ouest
    //si la vue demandé ne dépasse pas la bordure gauche de la grille du WMTS, on déplace la vue
    if (this.x_base_ > 0) {
      this.x_base_--;
      this.loader_carte();
    }
  }

  dec_south() {
  //3) Méthode permettant de décaller l'emprise vers le Sud
    //calcul du y_base_ max du niveau de zoom actuel
    let y_base_max = 3;
    for (var i = 0; i < this.zoom_-2; i++) {
      y_base_max = parseInt(y_base_max*2 +1);
    }
    //si la vue souhaitée ne dépasse pas la grille du WMTS, on déplace la vue
    if (this.y_base_ +4 < y_base_max) {
      this.y_base_++;
      this.loader_carte();
    }
  }

  dec_north() {
  //4) Méthode permettant de décaller l'emprise vers le Nord
    //si la vue demandé ne dépasse pas la bordure haute de la grille du WMTS, on déplace la vue
    if (this.y_base_ > 0) {
      this.y_base_--;
      this.loader_carte();
    }
  }

//II : Méthodes associées au zoom

  zoom_in() {
  //1) zoom en avant
    //zoom en avant
    this.zoom_++;
    //conversion du x_base_ et y_base_ pour le nouveau niveau de zoom
    this.x_base_ = parseInt((this.x_base_+1)*2);
    this.y_base_ = parseInt((this.y_base_+1)*2);
    //actualisation du compteur de zoom
    document.getElementById('num_zoom').innerText = this.zoom_;
    //actualisation de la carte
    this.loader_carte();
  }

  zoom_out() {
  //2) zoom en arrière
    //verification qu'on ne veux pas acceder à un zoom inferieur au zoom minimum (2)
    if (this.zoom_ > 2) {
      //zoom en arrière
      this.zoom_--;

      //conversion du x_base_ et y_base_ pour le nouveau niveau de zoom, en s'assurant de ne pas sortir de la nouvelle grille du WMTS

      //récupération des différentes emprises
      let x_max = this.x_base_ +3;
      let y_max = this.y_base_ +3;

      let x_base_new = parseInt((this.x_base_/2)-1);
      let y_base_new = parseInt((this.y_base_/2)-1);

      let x_max_new = x_base_new+3;
      let y_max_new = y_base_new+3;

      let val_max = 3;
      for (var i = 0; i < this.zoom_-2; i++) {
        val_max = parseInt(val_max*2 +1);
      }

      //compteur conservant le décallage à appliquer en cas de dépassement de la grille
      let add_x = 0;
      let add_y = 0;

      //detection des conflits entre la vue et la grille du WMTS
      if (x_max_new > val_max || y_max_new > val_max || x_base_new < 0 || y_base_new < 0) {
        if (x_max_new > val_max|| y_max_new > val_max) {
          if (x_max_new > val_max) {
            add_x--;
          }
          if (y_max_new > val_max) {
            add_y--;
          }
        }
        if (x_base_new < 0 || y_base_new < 0) {
          if (x_base_new < 0) {
            add_x++;
          }
          if (y_base_new < 0) {
            add_y++;
          }
        }
      }

      //décallage de la vue en fonction des conflits detectés
      this.x_base_ = x_base_new + add_x;
      this.y_base_ = y_base_new + add_y;
      //actualisation du compteur de zoom
      document.getElementById('num_zoom').innerText = this.zoom_;
      //actualisation de la carte
      this.loader_carte();
    }
  }


//III : méthodes liées aux imagettes

  switch_map(map_num){
  //1) Changement de fond de carte pour le fond au rang map_num de la liste des fonds de carte
    this.layer_ = this.liste_maps_[map_num]['layer'];
    this.format_ = this.liste_maps_[map_num]['format'];
    this.loader_carte();
  }



  loader_carte() {
  //2) chargement de toutes les imagettes de l'emprise
    //déclaration du controller et de son signal
    var controller = new AbortController();
    var signal = controller.signal;
    //passage en revu des 16 imagettes
    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        //stockage de la position de l'imagette voulue dans la grille WMTS
        var abs = x+this.x_base_;
        var ord = y+this.y_base_;

        //création de l'URL correspondant à cette image
        var requete = "https://wxs.ign.fr/pratique/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal&LAYER="+this.layer_+"&FORMAT="+this.format_+"&TILEMATRIXSET=PM&TILEMATRIX="+this.zoom_+"&TILEROW="+ord+"&TILECOL="+abs+"&";
        //essai de chargemement de cette tuile
        this.load_tile(x,y,requete,controller,signal);
      }
    }
  }

  async load_tile(x,y,url,controller,signal) {
  //3) chargement si possible d'une tuile
    //appel fetch de l'URL de la tuile
    fetch(url,{signal: signal}).then( r => {
      //si l'URL est fonctionnelle
      if (r.status == 200){
        //ajout de l'imagette dans son emplacement du navigateur
        document.getElementById('i'+y+'_'+x).src = url;
        //ajout de l'URL dans la liste des URLs actuelles
        this.table_url_act_[y+'_'+x] = url;
      }
      //en cas d'echec de l'appel de l'URL
      else {
        //avortement des 15 autres appels de la fonction load_tile(...)
        controller.abort();
        //zoome en arrère
        this.zoom_out();
        //affichage d'un message d'erreur
        console.log("Abortion !");

      }
    })

  }

  async upload_all_tile() {
  // 4) envoie de l'url de toutes les tuiles dans la base de données
    //récupération du nom saisi
    let nom_jeu_donnee = this.elem_name_.value;
    //filtrage de ce nom
    nom_jeu_donnee = filter_string(nom_jeu_donnee);
    //remplissage de la variable data qui sera passer par la suite en methode post
    let data = "nom_jeu="+nom_jeu_donnee;
    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        let url_act = this.table_url_act_[y+'_'+x];
        let url = url_act.replace(/&/g,'|||');
        data = data+"&img_"+y+"_"+x+"="+url;
      }
    }
    //appel en fetch du fichier insert_in_db.php
    fetch("../creation/php/insert_in_db.php", {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(r => r.text())
    .then(r => {
      // Affichage dans la console du résultat (réussite ou échec) de l'insertion dans la base de données du jeu d'imagettes
      console.log(r);

      // Comportement suivant le résultat de l'insertion :
      if (r == 1) {
        // Simulation d'un nouvel évènement de saisi dans le champs de saisi afin de lancer à nouveau un check_unicity
        but_val.disabled = true;
        nom_jeu.value = '';
        alert("Votre jeu d'imagettes a bien été enregistré !");
        this.elem_name_.dispatchEvent(new Event("input"));
      }
      else {
        alert("Votre jeu d'imagettes n'a pas été enregistré car il en existe déjà un identique ... \n Zoomez et/ou déplacez-vous sur la carte pour en créer un autre !");
      }
    })
  }
}



//Déclaration d'un visualisateur
carte = new Visualisateur(0, 0, 2,document.getElementById('nom_jeu'));

//Ajout d'eventListeners sur les boutons du site avec leurs méthodes associées de la classe Visualisateur
document.getElementById('north').addEventListener('click', function(){carte.dec_north()});
document.getElementById('south').addEventListener('click', function(){carte.dec_south()});
document.getElementById('east').addEventListener('click', function(){carte.dec_east()});
document.getElementById('west').addEventListener('click', function(){carte.dec_west()});
document.getElementById('zoomp').addEventListener('click', function(){carte.zoom_in()});
document.getElementById('zoomm').addEventListener('click', function(){carte.zoom_out()});
document.getElementById('but_val').addEventListener('click',function(){carte.upload_all_tile()});
document.getElementById('PLANIGNV2').addEventListener('click',function(){carte.switch_map(0)})
document.getElementById('ORTHOPHOTOS').addEventListener('click',function(){carte.switch_map(1)})

//Envoie d'un popup à l'ouverture du site indiquant le fonctionnement du visualisateur
window.alert("Cette page vous permet de créer votre propre jeu d'imagettes avec des ortho-images du Géoportail et d'alimenter les possibilités d'images de notre jeu du taquin ! Pour cela, quatre flèches directionnelles sont présentes afin de se déplacer, ainsi que deux boutons de zoome / dézoome pour préciser la zone voulue. Le nombre indique le niveau de zoom actuel.\n\nIl convient alors d'entrer un nom pour le jeu de données à créer dans le champs correspondant. Valider aura pour action d'ajouter ce jeu de donnée à la base de données des jeux de taquin. Ce dernier sera alors disponible au jeu dans le site associé !\n\nBONNE CREATION ! \n\n PS : ce message est disponible à nouveau à l'aide du bouton aide (?)");