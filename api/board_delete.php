<?php
require_once "../database.php";
if(isset($_POST['boardid'], $_POST['index'], $_POST['board_len'])) {  //checking the request
  // calling database.php function to establish the connection to MySQL server
  $conn = connectOurtubeDatabase();
  // print the data for debug
  // echo $_POST['data'];
  $boardid = $_POST['boardid'];
  $index = $_POST['index'];
  $board_len = $_POST['board_len'];
  $success = 0;
  $result = deleteBoard(
    $boardid,
    $index,
    $board_len,
    $conn
  );
  if($result === True) {
    $success = 1;
    $discription = 'ok';
  } 
  else {
    $success = 0;
    $discription = mysqli_error($conn);
  }
  $ret = [
    'success' => $success,
    'discription' => $discription
  ];
  
  exit(json_encode($ret));
}
?>