<html lang="fr">
  <!-- /* Réalisé par Ilona Baran */ -->


  <head>
    <meta charset="UTF-8">
    <meta name="description" content="Page principale du jeu 'Taquin' de Hugo, Ziad et Ilona">
    <link rel="stylesheet" href="style/index.css">
    <link rel="icon" href="images/logo.png">
    <title>Webmapping : Taquin</title>
    </head>

  <body>
    <div id="contener1">
        <div class="titre">Jeu : Taquin</div>
    </div>

    <div id="contener2">
        <div id="contexte" class='contour'>
            <p> Ce jeu Taquin a été réalisé par Hugo, Ziad et Ilona, trois elèves ingénieurs deuxième année à l'Ecole Nationale des Sciences Géographiques.</p>
            <a href="https://hugoreveneau2.alwaysdata.net/creation"><strong> Cliquez ici pour créer votre propre jeu d'image  </strong></a>   
            ___________________________________________
            <p><strong> Consignes et déroulement du jeu </strong></p>       
            <p>Avant de commencer à jouer, il vous faut rentrer un pseudonyme dont le nombre de caractères doit être compris entre 1 et 20. Vous pourrez 
              ensuite séléctionner le jeu auquel vous voulez jouer. Validez, le jeu peut commencer ! </p>
            <p>Si la disposition des imagettes ne vous satisfaits pas, vous pouvez modifier leur disposition grâce à un bouton
              situé sur la droite "tirage aléatoire".</p>
            <p> Le nombre de tuiles bien placées ainsi que le nombre de coups déjà réalisés sont donnés à titre indicatif.</p>
            <p><strong> Bon jeu ! </strong></p>

        </div>

        <div id="score" class='contour'>
            <div class="titreScore">Hall Of Fame</div>
            <?php include("php/classement.php"); ?>
        </div>

        <div id="fondMap" class="content">
          <div id ="conteneur"></div>
        </div>    

        <div id= "progression">
          <div id="connexion" class='contour'> 
              <form id="pseudo" method="get" action="index.php">
                  <input type="text" required minlength="1" maxlength="20" size="20" placeholder="Rentrez un pseudo" value="login">
                  <label for="jeu"> Selectionne ton jeu : <select id="selectJeu" type="text" name="nJeu"></select></label>
                  <input type="submit" value="Valider">
              </form>
          </div>

          <button id="btnAleatoire">Tirage aléatoire</button> 
          <div id="nbCoups">Vous avez réalisé 0 déplacement</div>
          <div id="nbBienPlace"> Nombre d'imagettes bien placées : </div>

          <div id="finJeu">
            <form method="get" action="index.php" id="fin">
              <button id="btnFin">Fin du jeu</button>
            </form>
          </div>
        </div>
    </div>

    <footer>
        <a href="html/planDuSite.html" target="_blank"> Plan du Site</a>
        -
        <a href="html/mentionsLegales.html" target="_blank"> Mentions légales </a>
        -
        <a href="html/credits.html" target="_blank"> Crédits </a>
    </footer>

    <script src="script/taquin.js"></script>
  </body>
</html>