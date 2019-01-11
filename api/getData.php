<?php
require_once "../database.php";
echo "123";
// calling database.php function to establish the connection to MySQL server
$conn = connectOurtubeDatabase();
// print the data for debug
// echo $_POST['data'];
$result = getChecklist(
  $conn
);
exit($result);
?>
