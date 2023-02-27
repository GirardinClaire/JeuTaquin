<?php

    include("db_link.php");

    $nomjeu = $_GET['nomJeu'];

    // Classement des 5 meilleurs joueurs en fonction du temps, et pour un temps égal en fonction du score

    // Classement "total"
    if ($nomjeu == 'Tous') {
        $requete = "SELECT pseudo, score, temps, nomjeu FROM joueurs ORDER BY temps ASC, score ASC LIMIT 10";
    }
    
    // Classement en fonction du nom de jeu
    else {
        $requete = "SELECT pseudo, score, temps, nomjeu FROM joueurs WHERE nomjeu = '$nomjeu' ORDER BY temps ASC, score ASC LIMIT 10";
    }

    $tableau_classement = [];

    if ($result = pg_query($link, $requete)) {
        while ($ligne = pg_fetch_assoc($result)) {
            array_push($tableau_classement, [
                "pseudo" => $ligne['pseudo'],
                "score" => $ligne['score'],
                "temps" => $ligne['temps'],
                "nomjeu" => $ligne['nomjeu'],
            ]);
        }
    }

    echo json_encode($tableau_classement, JSON_NUMERIC_CHECK); // pour que tout ne soit pas en chaine de caractère => bon retour JSON !

    
?>
