<?php

    include("db_link.php");

    // Permet d'obtenir toutes les informations du jeu sélectionné
    if( isset( $_GET['idJeu'] )) {
        $idJeu = $_GET['idJeu'];

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



