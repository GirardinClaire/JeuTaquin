<?php

// PHP de connexion à la base de données AlwaysData avec le compte de Claire Girardin

$link = pg_connect("host=postgresql-girardinclaire.alwaysdata.net dbname=girardinclaire_taquin_creation user=girardinclaire password=***");

if (!$link) {
    die('Erreur de connexion');
}

?>
