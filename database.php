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
        // update the new content
        $sql=sprintf("UPDATE js_checklist_item SET content='%s' WHERE checklist_id='%d' AND sn='%d';",$content,$boardId,$index);
        $result = $conn->query($sql);
        if($result===True){
            debug_to_console("Succeeded to update id!");
        }
        else{
            debug_to_console("Faile to update title!");
        }
}

function deleteBoard(
    $boardId,    //The boardid
    $index,      //index of the board
    $board_len,  //length of board array
    $conn
){
    if($conn->connect_error) {
        
        debug_to_console("Connection failed: " . $conn->connect_error);
        if(!is_null($conn)){
            mysqli_close($conn);
        }
        return;
    }
        // delete the board
        $conn->query("SET SQL_SAFE_UPDATES=0");
        $sql=sprintf("DELETE FROM js_checklist WHERE id='%d' ;",$boardId);
        $result = $conn->query($sql);
        $sql= sprintf("UPDATE js_checklist SET sn=sn-1 WHERE sn>%d AND sn<%d;",$index, $board_len); 
        $result = $conn->query($sql);
        $sql=sprintf("DELETE FROM js_checklist_item WHERE checklist_id='%d' ;",$boardId);
        $result = $conn->query($sql);
        $conn->query("SET SQL_SAFE_UPDATES=1");
        if($result===True){
            debug_to_console("Succeeded to delete board!");
        }
        else{
            debug_to_console("Faile to delete board!");
        }
}

function deleteCard(
    $boardId,    //boardid of the board where the card
    $index,      //index of the card in card array
    $card_len,   //length of card array
    $conn
){
    if($conn->connect_error) {
        
        debug_to_console("Connection failed: " . $conn->connect_error);
        if(!is_null($conn)){
            mysqli_close($conn);
        }
        return;
    }
        // delete the card
        $conn->query("SET SQL_SAFE_UPDATES=0");
        $sql=sprintf("DELETE FROM js_checklist_item WHERE checklist_id='%d' AND sn='%d';",$boardId,$index);
        $result = $conn->query($sql);
        $sql= sprintf("UPDATE js_checklist_item SET sn=sn-1 WHERE sn>%d AND sn<%d AND checklist_id=%d ;",$index, $card_len, $boardId); 
        $result = $conn->query($sql);
        $conn->query("SET SQL_SAFE_UPDATES=1");
        if($result===True){
            debug_to_console("Succeeded to update id!");
        }
        else{
            debug_to_console("Faile to update title!");
        }
}

function getChecklist($conn) {	
    if($conn->connect_error){
        debug_to_console("Connection failed: ".$conn->connect_error);
        $conn->close();
        return null;
    }
    $sql=sprintf("select id, title, sn from js_checklist order by sn + 0 ASC;");
    // debug_to_console("sql:".$sql);

    $result = $conn->query($sql);
    if(!$result){
        debug_to_console("Failed to select captions data from caption table!" . mysqli_error($conn));
        $conn->close();
        return null;
    }
    $rows=mysqli_num_rows($result);
    // debug_to_console("returned rows:".$rows);
    if($rows!==0){
        $checklist_data = [];
	while($row = $result->fetch_assoc()){
            $board_data = getBoard($row['id']);
            $board_item = [
                'id' => $row['id'],
                'title' => $row['title'],
                'data' => $board_data
	    ];
            array_push($checklist_data, $board_item);    
        }

        $conn->close();
        return json_encode($checklist_data);
    } else {
        return null;
    }

}

function getBoard($boardid)
{
    $conn = connectOurtubeDatabase();
    if($conn->connect_error){
        debug_to_console("Connection failed: ".$conn->connect_error);
        $conn->close();
        return null;
    }
    
    $sql=sprintf("select id, content, sn, checked from js_checklist_item where checklist_id='%d' order by sn + 0 ASC;", $boardid);
    // debug_to_console("sql:".$sqli);
    $result = $conn->query($sql);
    if(!$result){
        debug_to_console("Failed to select captions data from caption table!" . mysqli_error($conn));
        $conn->close();
        return null;
    }
    
    $rows=mysqli_num_rows($result);
    // debug_to_console("returned rows:".$rows);
    if($rows!==0){
	$board_data = [];
        while($row = $result->fetch_assoc()) {
            $board_item = [
                'card_id' => $row['id'],
                'checked' => $row['checked'],
                'content' => $row['content']
            ];

            array_push($board_data, $board_item);    
        }
	$conn->close();
        return $board_data;
    } else {
        return null;
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
