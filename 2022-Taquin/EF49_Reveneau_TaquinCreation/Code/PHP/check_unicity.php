<?php

include("db_link.php");



$nom_test = $_POST['nom_test'];
$requete_reg = "SELECT count(*) FROM table_jeux_donnees WHERE nom_jeu = '".$nom_test."'";

if ($result =pg_query($link, $requete_reg)) {
  while ($ligne = pg_fetch_assoc($result)) {
    $output = $ligne['count'];
  }
}

echo json_encode($output);



 ?>
