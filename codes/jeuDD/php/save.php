<?php

// Enregistrement du nom du jeu choisi, du pseudo, du nbr de coups (i.e. du score) et du temps de la partie : une fois qu'elle est terminée !!

    include("db_link.php");

    if( isset( $_GET['idJeu'] )) {
        $idJeu = $_GET['idJeu'];
        $pseudo = $_GET['pseudo'];
        $nbCoups = $_GET['nbCoups'];
        $temps = $_GET['temps'];

        $requete = "SELECT nom FROM jeux_donnees WHERE id = {$idJeu}";
        $result = pg_query($link, $requete);
        $nomJeu = pg_fetch_assoc($result);
        $request_insert = "INSERT INTO joueurs (nomjeu, pseudo, score, temps) VALUES ('".$nomJeu['nom']."', '".$pseudo."', '".$nbCoups."', '".$temps."')";
        pg_query($link, $request_insert);

    }
    
?>




