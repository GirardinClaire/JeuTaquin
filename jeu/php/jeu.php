<?php

    include("db_link.php");


    if( isset( $_GET['idJeu'] )) {
        $idJeu = $_GET['idJeu'];

        /*
        // enregistrement du nom du jeu choisi
        $requete = "SELECT nom FROM jeux_donnees WHERE id = {$idJeu}";
        $result = pg_query($link, $requete);
        $nomJeu = pg_fetch_assoc($result);
        $request_insert = "INSERT INTO joueurs (nomjeu) VALUES ('".$nomJeu['nom']."')";
        pg_query($link, $request_insert);
        */
        
        // Sélection de tous les attributs du jeu sélectionné
        $tableau=[];
        $requete = "SELECT * FROM jeux_donnees WHERE id = {$idJeu}";
        if ($result = pg_query($link, $requete)) {
            while ($ligne = pg_fetch_assoc($result)) {
                $tableau[]=$ligne;
            }
        }
        echo json_encode($tableau);
    }


?>



