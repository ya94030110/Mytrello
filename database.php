<?php

function connectOurtubeDatabase() {
    return new mysqli('40.121.221.31', 'nthuuser', '1qaz@WSX3edc', 'ourtube');
}

function insertCardAfter(
    $cardId,      // The card id
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
        $sql=sprintf("INSERT into js_checklist_item(card_id, checklist_id, content, sn, checked) values('%d','%d','%s','%d','%d') ;",$cardId,$boardId,$content,$newCardIndex,$checked);
        $result = $conn->query($sql);
        if($result===True){
            $debug_message = sprintf("cardid: '%d' boardid: '%d'",$cardId, boardId);
            debug_to_console($debug_message);
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
    $sql= sprintf("UPDATE js_checklist_item SET sn=sn+1 WHERE sn>%d AND sn<%d AND checklist_id=%d ;",$firstIndex, $finalIndex, $boardId); 
    $result = $conn->query($sql);
        
    if($result!==True){
        debug_to_console("Failed to move objects!");
        return;
    }
    debug_to_console("Succeeded to move objects!");
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

function updateTitle(
    $boardId,    //The boardid
    $title,    //new title
    $conn
){
    if($conn->connect_error) {
        
        debug_to_console("Connection failed: " . $conn->connect_error);
        if(!is_null($conn)){
            mysqli_close($conn);
        }
        return;
    }
        // update the new title
        $sql=sprintf("UPDATE js_checklist SET title='%s' WHERE id='%d' ;",$title,$boardId);
        $result = $conn->query($sql);
        if($result===True){
            debug_to_console("Succeeded to update id!");
        }
        else{
            debug_to_console("Faile to update title!");
        }
}

function updateContent(
    $boardId,    //boardid of the board where the card
    $index,      //index of the card in card array
    $content,    //new content
    $conn
){
    if($conn->connect_error) {
        
        debug_to_console("Connection failed: " . $conn->connect_error);
        if(!is_null($conn)){
            mysqli_close($conn);
        }
        return;
    }
        // update the new title
        $sql=sprintf("UPDATE js_checklist_item SET content='%s' WHERE checklist_id='%d' AND sn='%d';",$content,$boardId,$index);
        $result = $conn->query($sql);
        if($result===True){
            debug_to_console("Succeeded to update id!");
        }
        else{
            debug_to_console("Faile to update title!");
        }
}

function debug_to_console( $data, $context = 'Debug in Console' ) {

    // Buffering to solve problems frameworks, like header() in this and not a solid return.
    ob_start();

    $output  = 'console.info( \'' . $context . ':\' );';
    $output .= 'console.log(' . json_encode( $data ) . ');';
    $output  = sprintf( '<script>%s</script>', $output );

    echo $output;
}
