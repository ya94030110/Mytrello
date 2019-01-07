<?php
require_once "../utility.php";
require_once "../database.php";
if(isset($_POST['boardid'], $_POST['index'], $_POST['content'], $_POST['card_len'])) {  //checking the request
  // calling database.php function to establish the connection to MySQL server
  $conn = connectOurtubeDatabase();
  // print the data for debug
  // echo $_POST['data'];
  $boardid = $_POST['boardid'];
  $index = $_POST['index'];
  $content = $_POST['content'];
  $card_len = $_POST['card_len'];
  $success = 0;
  $result = insertVideoCaption(
    $boardid,
    $index,
    $content,
    $card_len,
    $conn
  );
  if($result === True) {
    $success = 1;
  } 
  else {
    $success = 0;
  }
  $ret = [
    'success' => $success,
  ];
  
  exit(json_encode($ret));
}
?>