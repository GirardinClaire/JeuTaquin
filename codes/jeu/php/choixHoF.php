<?php

    include("db_link.php");

    $options = [];

    array_push($options, "<option>Tous</option>");

    // Permet de récupérer tous les noms des jeux disponibles (i.e. crées)
    $requete = "SELECT nom FROM jeux_donnees ORDER BY nom";
    if ($result = pg_query($link, $requete)) {
        while ($ligne = pg_fetch_assoc($result)) {
            array_push($options, "<option value = {$ligne['nom']}>{$ligne['nom']}</option>");
        }
    }
    else {
        echo "Erreur de requête de base de données.";
    }

    echo json_encode($options);
?>
