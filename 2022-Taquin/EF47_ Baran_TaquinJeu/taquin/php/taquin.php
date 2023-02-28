<!-- Réalisé par Ilona Baran -->

<?php
    include("connexion.php");
    $options = [];

    array_push($options, "<option>Choississez un jeu</option");

    $requete = "SELECT id, nom_jeu FROM table_jeux_donnees ORDER BY RANDOM() LIMIT 5";
    if ($result = pg_query($link, $requete)) {
        while ($ligne = pg_fetch_assoc($result)) {
            array_push($options, "<option value = {$ligne['id']}>{$ligne['nom_jeu']}</option");
        }
    } else {
        echo "Erreur de requête de base de données.";
    }

    echo json_encode($options);
?>
