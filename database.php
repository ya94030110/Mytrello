<?php

function connectOurtubeDatabase() {
    return new mysqli('40.121.221.31', 'nthuuser', '1qaz@WSX3edc', 'ourtube');
}

function insertCardAfter(
    $boardId,     //The board id 
    $targetIndex, //Index of target object that the new card insert after
    $content,     // Content of the new card 
    $finalIndex,  // Index of final object of the card array of the board
    $conn
){
    if($conn->connect_error) {
        
        debug_to_console("Connection failed: " . $conn->connect_error);
        if(!is_null($conn)){
            mysqli_close($conn);
        }
        return;
    }
        //move objects after target object to get a space for new card
        moveRowsforInsert($boardId, $targetIndex, $finalIndex, $conn);
        
        // insert the new card
        $checked = 0;
        $newCardIndex = $targetIndex + 1;
        $sql=sprintf("INSERT into js_checklist_item(checklist_id, content, sn, checked) values('%d','%s','%d','%d') ;",$boardId,$content,$newCardIndex,$checked);
        $result = $conn->query($sql);
        if($result===True){
            debug_to_console("Succeeded to insert new card!");
        }
        else{
            debug_to_console("Faile to insert new card!");
        }
    
}

function moveRowsforInsert(
    $board_id,
    $firstIndex,
    $finalIndex,
    $conn
){
    if($conn->connect_error) {
        
        debug_to_console("Connection failed: " . $conn->connect_error);
        if(!is_null($conn)){
            mysqli_close($conn);
        }
        return;
    }
    //move objects after target object to get a space for new card
    $conn->query("SET SQL_SAFE_UPDATES=0");
    $sql= sprintf("UPDATE js_checklist_item SET sn=sn+1 WHERE sn>%d AND sn<%d AND checklist_id=%d",$firstIndex, $finalIndex, $boardId); 
    $result = $conn->query($sql);
        
    if($result!==True){
        debug_to_console("Failed to move objects!");
        return;
    }
    debug_to_console("Succeeded to move objects!");
    $conn->query("SET SQL_SAFE_UPDATES=1");
}

function createBoard(
    $boardId,     //New board id 
    $title,     // Title of the new board 
    $finalIndex,  // Index of final object of the board array
    $conn
){
    if($conn->connect_error) {
        
        debug_to_console("Connection failed: " . $conn->connect_error);
        if(!is_null($conn)){
            mysqli_close($conn);
        }
        return;
    }
        // insert the new board
        $sql=sprintf("INSERT into js_checklist(id, title, sn) values('%d',%s,'%d') ;",$boardId,$title,$finalIndex);
        $result = $conn->query($sql);
        if($result===True){
            debug_to_console("Succeeded to insert new board!");
        }
        else{
            debug_to_console("Faile to insert new board!");
        }
    
}
