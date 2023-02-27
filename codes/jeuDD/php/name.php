<?php

    // Récupère des jeux pour pouvoir jouer

    include("db_link.php");

    $options = [];

    array_push($options, "<option>Choisissez un jeu</option>");

    // Les 5 derniers crées
    $requete = "SELECT id, nom FROM jeux_donnees ORDER BY id DESC LIMIT 5";
    if ($result = pg_query($link, $requete)) {
        while ($ligne = pg_fetch_assoc($result)) {
            array_push($options, "<option value = {$ligne['id']}>{$ligne['nom']}</option>");
        }
    } else {
        echo "Erreur de requête de base de données.";
    }

    // Et 5 autres aléatoires
    $requete = "SELECT id, nom FROM jeux_donnees WHERE (id, nom) NOT IN (SELECT id, nom FROM jeux_donnees ORDER BY id DESC LIMIT 5) ORDER BY RANDOM() LIMIT 5 ";
    if ($result = pg_query($link, $requete)) {
        while ($ligne = pg_fetch_assoc($result)) {
            array_push($options, "<option value = {$ligne['id']}>{$ligne['nom']}</option>");
        }
    } else {
        echo "Erreur de requête de base de données.";
    }

    echo json_encode($options);
?>
