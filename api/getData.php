<?php
require_once "../database.php";
// calling database.php function to establish the connection to MySQL server
$conn = connectOurtubeDatabase();
// print the data for debug
// echo $_POST['data'];
$success = 0;
$result = getChecklist(
  $conn
);
  
  exit($result);
}
?>