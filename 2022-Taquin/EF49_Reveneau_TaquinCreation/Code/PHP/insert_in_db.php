<?php

include("db_link.php");

$nom = $_POST['nom_jeu'];
$img_0_0 = $_POST['img_0_0'];
$img_0_0 = str_replace('|||','&',$img_0_0);
$img_0_1 = $_POST['img_0_1'];
$img_0_1 = str_replace('|||','&',$img_0_1);
$img_0_2 = $_POST['img_0_2'];
$img_0_2 = str_replace('|||','&',$img_0_2);
$img_0_3 = $_POST['img_0_3'];
$img_0_3 = str_replace('|||','&',$img_0_3);
$img_1_0 = $_POST['img_1_0'];
$img_1_0 = str_replace('|||','&',$img_1_0);
$img_1_1 = $_POST['img_1_1'];
$img_1_1 = str_replace('|||','&',$img_1_1);
$img_1_2 = $_POST['img_1_2'];
$img_1_2 = str_replace('|||','&',$img_1_2);
$img_1_3 = $_POST['img_1_3'];
$img_1_3 = str_replace('|||','&',$img_1_3);
$img_2_0 = $_POST['img_2_0'];
$img_2_0 = str_replace('|||','&',$img_2_0);
$img_2_1 = $_POST['img_2_1'];
$img_2_1 = str_replace('|||','&',$img_2_1);
$img_2_2 = $_POST['img_2_2'];
$img_2_2 = str_replace('|||','&',$img_2_2);
$img_2_3 = $_POST['img_2_3'];
$img_2_3 = str_replace('|||','&',$img_2_3);
$img_3_0 = $_POST['img_3_0'];
$img_3_0 = str_replace('|||','&',$img_3_0);
$img_3_1 = $_POST['img_3_1'];
$img_3_1 = str_replace('|||','&',$img_3_1);
$img_3_2 = $_POST['img_3_2'];
$img_3_2 = str_replace('|||','&',$img_3_2);
$img_3_3 = $_POST['img_3_3'];
$img_3_3 = str_replace('|||','&',$img_3_3);


$liste_noms_col = array(
  "img_0_0",
  "img_0_1",
  "img_0_2",
  "img_0_3",
  "img_1_0",
  "img_1_1",
  "img_1_2",
  "img_1_3",
  "img_2_0",
  "img_2_1",
  "img_2_2",
  "img_2_3",
  "img_3_0",
  "img_3_1",
  "img_3_2",
  "img_3_3");

$liste_urls = array(
$img_0_0,
$img_0_1,
$img_0_2,
$img_0_3,
$img_1_0,
$img_1_1,
$img_1_2,
$img_1_3,
$img_2_0,
$img_2_1,
$img_2_2,
$img_2_3,
$img_3_0,
$img_3_1,
$img_3_2,
$img_3_3);


$requete_reg = "INSERT INTO table_jeux_donnees (nom_jeu) VALUES ('".$nom."')";
// $requete_reg = "SELECT * FROM table_jeux_donnees";
if ($result =pg_query($link, $requete_reg)) {
  for ($i=0; $i < 16; $i++) {
    $col = $liste_noms_col[$i];
    $url = $liste_urls[$i];
    $requete_reg = "UPDATE table_jeux_donnees SET ".$col." = '".$url."' WHERE nom_jeu = '".$nom."'";
    $result =pg_query($link, $requete_reg);
  }
  echo json_encode("Succes de l'insert db !");
}
else {
  echo json_encode("Echec de l'insert db...");
}




 ?>
