<!DOCTYPE html>
<html lang="fr" dir="ltr">
  <head>
    <meta charset="UTF-8">
    <meta name="description" content="Page principale du jeu 'Taquin' de Hugo, Ziad et Ilona">
    <link rel="stylesheet" href="css/style_jeu.css">
    <link rel="icon" href="img/logo.png">
    <title>Webmapping : Taquin</title>
    </head>

  <body>
    <div id="contener1">
      <h1 id="titre"> Le Jeu du Taquin </h1>
    </div>

    <div id="contener2">

      <div id="contexte" class='contour'>
        <br>
        <a href="https://girardinclaire.alwaysdata.net/creation"><strong> Cliquez ici pour créer votre propre jeu d'image !</strong></a> 
        <br>
        <p><strong> Consignes et déroulement du jeu </strong></p>  
        <p>Pour jouer, il vous faut saisir un pseudonyme et sélectionner un jeu dans le cadre de droite. Les jeux proposés sont les 5 derniers crées et 5 autres tirés aléatoirement parmi tous les jeux crées. Ainsi, il vous suffit de recharger la page pour avoir la possibilité de choisir encore d'autres jeux.</p>
        <p>Il vous est également indiqué le nombre de coups effectués durant votre partie, votre temps de jeu et, pour vous aider, le nombre d'imagettes bien placées !</p>
        <p>Le bouton "mélange aléatoire" permet de mélanger le jeu autant de fois que vous le désirez. Votre partie redémarre ainsi à 0 !</p>
        <p>Une fois les 15 imagettes bien placées, la partie est gagnée et enregistrée !</p>
        <p>Le Hall Of Fame permet de visualiser les meilleurs partie en fonction du jeu joué. La vôtre fera-t-elle partie des 10 meilleures ?</p>
        <p><strong> BON JEU A TOUS !! </strong></p>
        <br>
        <p> Ce jeu du Taquin a été réalisé par 4 élèves ingénieurs de deuxième année de l'Ecole Nationale des Sciences Géographiques (ENSG).</p>
        <p>PS :<br> Si vous rencontrez un problème (par exemple un jeu non solvable ...) ou que vous avez des remarques, critiques ou pistes d'amélioration sur ces pages de jeu, vous pouvez me contacter à l'adresse mail : <br> claire-girardin@hotmail.fr </p>
         
        <!--
        ___________________________________________
        <p><strong> Consignes et déroulement du jeu </strong></p>       
        <p>Avant de commencer à jouer, il vous faut rentrer un pseudonyme dont le nombre de caractères doit être compris entre 1 et 20. Vous pourrez 
          ensuite séléctionner le jeu auquel vous voulez jouer. Validez, le jeu peut commencer ! </p>
        <p>Si la disposition des imagettes ne vous satisfaits pas, vous pouvez modifier leur disposition grâce à un bouton
          situé sur la droite "tirage aléatoire".</p>
        <p> Le nombre de tuiles bien placées ainsi que le nombre de coups déjà réalisés sont donnés à titre indicatif.</p>
        <p><strong> Bon jeu ! </strong></p>
        -->
      </div>

      <div id="score" class='contour'>

        <div class="titreScore">Hall Of Fame</div>
        <div id="HoF">
          <form id="formHoF" action=# method="get">
            <fieldset id="fieldset">
              <legend>Classement par jeu</legend>
              <select id="nomJeu" type="text" name="nomJeu">
                <!-- <option>Choisissez un jeu</option> -->
              </select>
              <input type="submit" name="envoi" value="OK">
            </fieldset>
          </form>
        </div>
        
        <div id="presentation">
          <table id="table">
            <thead>
              <th>Classement</th>
              <th>Pseudo</th>
              <th>Temps</th>
              <th>Nombre de coups</th>
              <th>Nom du jeu</th>
            </thead>
            <tbody>
              <tr id="p1">
                <!-- <td>1</td><td>pseudo1</td><td>tps1</td><td>Score1</td><td>nomJeu1</td> -->
              </tr>
              <tr id="p2">
                <!-- <td>2</td><td>pseudo2</td><td>tps2</td><td>Score2</td><td>nomJeu2</td> -->
              </tr>
              <tr id="p3">
                <!-- <td>3</td><td>pseudo3</td><td>tps3</td><td>Score3</td><td>nomJeu3</td> -->
              </tr>
              <tr id="p4">
                <!-- <td>4</td><td>pseudo4</td><td>tps4</td><td>Score4</td><td>nomJeu4</td> -->
              </tr>
              <tr id="p5">
                <!-- <td>5</td><td>pseudo5</td><td>tps5</td><td>Score5</td><td>nomJeu5</td> -->
              </tr>
              <tr id="p6">
                <!-- <td>6</td><td>pseudo6</td><td>tps6</td><td>Score6</td><td>nomJeu6</td> -->
              </tr>
              <tr id="p7">
                <!-- <td>5</td><td>pseudo5</td><td>tps5</td><td>Score7</td><td>nomJeu7</td> -->
              </tr>
              <tr id="p8">
                <!-- <td>5</td><td>pseudo5</td><td>tps5</td><td>Score8</td><td>nomJeu8</td> -->
              </tr>
              <tr id="p9">
                <!-- <td>5</td><td>pseudo5</td><td>tps5</td><td>Score9</td><td>nomJeu9</td> -->
              </tr>
              <tr id="p10">
                <!-- <td>5</td><td>pseudo5</td><td>tps5</td><td>Score10</td><td>nomJeu10</td> -->
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <div id="fondMap" class="content">
        <div id ="conteneur"></div>
      </div>

      <div id= "progression" class='contour'>
        <form id="form" action=# method="get">
          <fieldset id="field">
            <legend>Début de la partie</legend>
            <input type="text" name="pseudo" placeholder="Saisissez un pseudo">
            <select id="selectJeu" type="text" name="idJeu">
              <!-- <option>Choisissez un jeu</option> -->
            </select>
            <input type="submit" name="envoi" value="OK">
          </fieldset>
        </form>
        <button id="btnAleatoire">Mélange aléatoire</button>
        <br>
        <div id="nbCoups">Vous avez réalisé 0 déplacement.</div>
        <br>
        <div id="nbBienPlace"> Nombre d'imagettes bien placées : </div>
        <br>
        <div id="timerTxt"> Temps de jeu :</div>
        <div id="timer">00:00</div>

      </div>
    </div>

    <footer>
      <a href="html/planDuSite.html" target="_blank"> Plan du Site</a>
      -
      <a href="html/mentionsLegales.html" target="_blank"> Mentions légales </a>
      -
      <a href="html/credits.html" target="_blank"> Crédits </a>
    </footer>

    <script src="js/taquin.js"></script>

  </body>
</html>



