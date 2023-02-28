// récupération du bouton d'aide
aide = document.getElementById('aide');

// ajout d'un popup en cas de clic sur le bouton d'aide
aide.addEventListener('click', function(){
  window.alert("Ceci est un générateur d'imagettes pour la création de jeux de taquin ! Il consiste à se déplacer dans un navigateur montrant les ortho-images du Géoportail. \n\nQuatre flèches directionnelles sont présentes afin de se déplacer, ainsi que deux boutons de zoome / dézoome pour préciser la zone voulue. Le nombre indique le niveau de zoom actuel.\n\nIl convient alors d'entrer un nom pour le jeu de données à créer dans le champs correspondant. Valider aura pour action d'ajouter ce jeu de donnée à la base de données des jeux de taquin. Ce dernier sera alors disponible au jeu dans le site associé !\n\nBONNE CREATION ! ");
})
