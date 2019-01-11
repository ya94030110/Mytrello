<?php
require_once "../database.php";
if(isset($_POST['boardid'], $_POST['checked'], $_POST['index'])) {  //checking the request
  // calling database.php function to establish the connection to MySQL server
  $conn = connectOurtubeDatabase();
  // print the data for debug
  // echo $_POST['data'];
  $boardid = $_POST['boardid'];
  $content = $_POST['checked'];
  $index = $_POST['index'];
  $success = 0;
  $result = updateChecked(
    $boardid,
    $index,
    $checked,
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