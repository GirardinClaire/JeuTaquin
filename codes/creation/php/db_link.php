<?php

$link = pg_connect("host=postgresql-girardinclaire.alwaysdata.net dbname=girardinclaire_taquin_creation user=girardinclaire password=***");

if (!$link) {
    die('Erreur de connexion');
}


?>
