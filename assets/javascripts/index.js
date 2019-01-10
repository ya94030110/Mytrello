var max_id = 0
var board_array= [];
var editted_title_element;
var max_cardid = 0;
var edit_content = 0;


$(document).ready(function(){
    $( "#trello" ).sortable();
    var add_checklist = document.getElementById("add-checklist");
    tools.addListener(add_checklist, "click", tools.addClicklist);
})

var tools = (function(){
    return{
        
        insertCardAfter: function(boardid, index, content, card_len, board_index)
        {
             $.post("./api/card_insert.php",
                {
                    cardid: max_cardid,
                    boardid: boardid,
                    index: index,
                    content: content,
                    card_len: card_len
                }
            ).done(function(res){
                res = tools.json_preprocess(res);
                response = JSON.parse(res);
                if(response['discription'].length > 0)
                {
                    alert(response['discription']);
                    return;
                }
                max_cardid++;
                board_array[board_index].insertCardAfter(index, content);
            })
             .fail(function(xhr, status, error) {
                    alert(status + ":" + error);
            });
        },
        
        createBoard: function(boardid, title, board_len)
        {
            $.post("./api/board_create.php",
                {
                    boardid: boardid,
                    title:title,
                    board_len: board_len
                }
            ).done(function(res){
                res = tools.json_preprocess(res);
                response = JSON.parse(res);
                if(response['discription'].length > 0)
                {
                    alert(response['discription']);
                    return;
                }
                tools.addBoard(boardid, title);
            })
             .fail(function(xhr, status, error) {
                    alert(status + ":" + error);
            });
                
        },
        
        updateTitle: function(boardid, title, edit_node)
        {
            $.post("./api/title_update.php",
                {
                    boardid: boardid,
                    title:title
                }
            ).done(function(res){
                res = tools.json_preprocess(res);
                response = JSON.parse(res);
                if(response['discription'].length > 0)
                {
                    alert(response['discription']);
                    edit_node.value = edit_content;
                    edit_node.focus();
                    return;
                }
                edit_content = title;
                edit_node.parentElement.children[1].remove();
                edit_node.blur();
            })
             .fail(function(xhr, status, error) {
                    alert(status + ":" + error);
                    edit_node.value = edit_content;
                    edit_node.focus();
            });
        },
        
        updateContent: function(boardid, content, index, edit_node)
        {
            $.post("./api/content_update.php",
                {
                    boardid: boardid,
                    content: content,
                    index: index
                }
            ).done(function(res){
                res = tools.json_preprocess(res);
                response = JSON.parse(res);
                if(response['discription'].length > 0)
                {
                    alert(response['discription']);
                    edit_node.value = edit_content;
                    edit_node.focus();
                    return;
                }
                edit_content = content;
                edit_node.parentElement.children[2].remove();
                edit_node.blur();
            })
             .fail(function(xhr, status, error) {
                    alert(status + ":" + error);
                    edit_node.value = edit_content;
                    edit_node.focus();
            });
        },
        
        addBoard: function(id, title){
            
            var trello = document.getElementById("trello");
            var newBoard = document.createElement("li");
            newBoard.setAttribute("class", "check-board ui-state-default ui-sortable-handle");
            
            var title_element = document.createElement("input");
            title_element.setAttribute("type", "text");
            title_element.setAttribute("class", "content");
            title_element.value = title;
            tools.addListener(title_element, "focus", tools.edit_title);
            tools.addListener(title_element, "blur", tools.remove_title_saveButton);
            tools.addListener(title_element, "change", tools.onchangeHandler);
            
            var card_array = document.createElement("ul");
            card_array.setAttribute("class", "card-array ui-sortable");
            card_array.setAttribute("id", "sortable");
            $( "#sortable" ).sortable();
    
            var addButton = document.createElement("button");
            addButton.setAttribute("type", "button");
            addButton.setAttribute("class", "btn btn-primary");
            addButton.innerHTML = "Add Item";
            tools.addListener(addButton, "click", tools.addEmptyCard);
            
            var deleteButton = document.createElement("button");
            deleteButton.setAttribute("type", "button");
            deleteButton.setAttribute("class", "btn btn-danger");
            deleteButton.innerHTML = "Delete Checklist";
            tools.addListener(deleteButton, "click", tools.deleteChecklist);
            
            var emptyParagragh = document.createElement("p");
            
            newBoard.appendChild(title_element);
            newBoard.appendChild(card_array);
            newBoard.appendChild(addButton);
            newBoard.appendChild(deleteButton);
            newBoard.appendChild(emptyParagragh);
            trello.appendChild(newBoard);
            
        },
        
        addClicklist: function(){
            var title_input = document.getElementById("title-input");
            var save_button = document.getElementById("save-title");
            var close_button = document.getElementById("close-title");
            
            tools.removeListener(save_button, "click", tools.saveTitle);
            tools.removeListener(close_button, "click", tools.closeModal);
            
            tools.addListener(save_button, "click", tools.saveTitle);
            tools.addListener(close_button, "click", tools.closeModal);
            $("#title-modal").modal("show");
        },
        
        deleteChecklist: function(event){
            var e = event || window.event;
            e.target.parentElement.remove();
        },
        
        deleteCard: function(event){
            var e = event || window.event;
            e.target.parentElement.remove();
        },
        
        addEmptyCard: function(event){
            var e = event || window.event;
            var index = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement);
            //console.log(index);
            board_array[index].addEmptyCard();
        },

        createCard: function(content){
            var newCard = document.createElement("li");
            newCard.setAttribute("class", "check-card");
    
            var check_input = document.createElement("input");
            check_input.setAttribute("type", "checkbox");
            tools.addListener(check_input, "click", tools.checkbox_check);
            
            var content_input = document.createElement("input");
            content_input.setAttribute("type", "text");
            content_input.setAttribute("class", "content");
            tools.addListener(content_input, "focus", tools.edit_mode);
            tools.addListener(content_input, "blur", tools.remove_saveButton);
            tools.addListener(content_input, "keydown", tools.content_keydown);
            
            var deleteButton = document.createElement("button");
            deleteButton.setAttribute("type", "button");
            deleteButton.setAttribute("class", "btn btn-danger btn-sm");
            deleteButton.innerHTML = "Delete";
            tools.addListener(deleteButton, "click", tools.deleteCard);
            
            newCard.appendChild(check_input);
            newCard.appendChild(content_input);
            newCard.appendChild(deleteButton);
           
            return newCard;
        },
        
        saveTitle: function(){
            var title_input = document.getElementById("title-input");
            
            board_array.push(new Board(title_input.value));
            $("#title-modal").modal("hide");
            
        },
        
        closeModal: function(){
            $("#title-modal").modal("hide");
        },
        
        edit_mode: function(event){
            var e = event || window.event;
            edit_content = e.target.value;
            
            var saveButton = document.createElement("button");
            saveButton.setAttribute("type", "button");
            saveButton.setAttribute("class", "btn btn-primary btn-sm");
            saveButton.innerHTML = "Save";
            
            tools.addListener(saveButton, "click", function(){
                var trello = document.getElementById("trello");
                var card_index = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement);
                var board_index = Array.prototype.indexOf.call(trello.children, e.target.parentElement.parentElement.parentElement);
                updateTitle(board_array[board_index].id, e.target.value, card_index, e.target);
            });
            
            e.target.parentElement.insertBefore(saveButton, e.target.parentElement.children[2]);
        },
        
        remove_saveButton: function(event){
            var e = event || window.event;
            if(e.target.parentElement.children.length == 4) e.target.parentElement.children[2].remove();
        },
        
        edit_title: function(event){
            var e = event || window.event;
            var saveButton = document.createElement("button");
            saveButton.setAttribute("type", "button");
            saveButton.setAttribute("class", "btn btn-primary btn-sm");
            saveButton.innerHTML = "Save";
            
            tools.addListener(saveButton, "click", function(){
                var board_index = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement);
                updateTitle(board_array[board_index].id, e.target.value, e.target);
            });
            
            e.target.parentElement.insertBefore(saveButton, e.target.parentElement.children[1]);
        },
        
        remove_title_saveButton: function(event){
            var e = event || window.event;
            if(e.target.parentElement.children.length == 6) e.target.parentElement.children[1].remove();
        },
        
        content_keydown: function(event){
            var e = event || window.event;
            if(e.key == "Enter")
            {
                var trello = document.getElementById("trello");
                    
                var target_index = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement);
                
                if(target_index + 1 != e.target.parentElement.parentElement.children.length) return;
                
                var board_index = Array.prototype.indexOf.call(trello.children, e.target.parentElement.parentElement.parentElement);
                board_array[board_index].addEmptyCard();
                e.target.blur();
                e.target.parentElement.nextSibling.children[1].focus();
            }
        },
        onchangeHandler: function(event)
        {
            var e = event || window.event;
            e.target.value = edit_content;
        },
        
        checkbox_check: function(event){
            var e = event || window.event;
            if(e.target.checked == true)
            {
                e.target.parentElement.children[1].disabled = true;
            }
            else
            {
                e.target.parentElement.children[1].disabled = false;
            }
        },
        
        replaceBoard(index1, index2)
        {
            var board1 = board_array[index1],
                board2 = board_array[index2];
            
            board1.index = index2;
            board2.index = index1;
            array[index1] = obj2;
            array[index2] = obj1;
        },
        
        json_preprocess: function(response)
        {
            for(i = 0; i < response.length; i++)
            {
                if(response[i] == "{") return response.substring(i);
            }
        },
        
        addListener: function(object, addEvent, handler)
        {
            object.addEventListener(addEvent, handler);
        },
        
        removeListener: function(object, addEvent, handler)
        {
            object.removeEventListener(addEvent, handler);
        }
        
    }
}())

var Board = (function(){
    var title;
    var id;
    var index;
    var card_len;
    
    //constructor
    var Board = function (board_title) {
        this.title = board_title;
        this.id = ++max_id;
        this.index = board_array.length;
        this.card_len = 0;
        tools.createBoard(this.id, this.title, board_array.length);
    };

    Board.prototype = {
        getid: function(){
            return id;
        },
        
        getTitle: function(){
            return title;
        },
        
        insertCardAfter_ajax: function(index, content)
        {
            tools.insertCardAfter(this.id, index, content, this.card_len, this.index)
        },
        
        insertCardAfter: function(index, content)
        {
            var card_array = document.getElementsByClassName("card-array")[this.index];
            var newCard = tools.createCard(content);
            
            if(index + 1 != this.card_len)
                card_array.insertBefore(newCard,  card_array.children[index + 1]);
            else card_array.appendChild(newCard);
            this.card_len++;
        },
        
        addEmptyCard: function(){
            
            this.insertCardAfter_ajax(this.card_len-1, "");
        },
        
    }
    return Board;
}())
