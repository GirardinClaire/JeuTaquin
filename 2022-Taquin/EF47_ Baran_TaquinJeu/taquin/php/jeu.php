<!-- Réalisé par Ilona Baran -->

<?php
    $link = pg_connect("host=postgresql-hugoreveneau2.alwaysdata.net dbname=hugoreveneau2_taquin_creation user=hugoreveneau2 password=PYK+77!21n0xtt/]k,s7F");
    if (!$link) {
        die('Erreur de connexion');
    }
    if(isset($_GET['nJeu'])){
        $tableau=[];
        $requete = "SELECT * FROM table_jeux_donnees WHERE id = {$_GET['nJeu']}";
        if ($result = pg_query($link, $requete)) {
            while ($ligne = pg_fetch_assoc($result)) {
                $tableau[]=$ligne;
            }
        }
        echo json_encode($tableau);
    }

?>




