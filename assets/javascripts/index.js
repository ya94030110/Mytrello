var max_id = 0
var board_array= [];
var editted_title_element;

$(document).ready(function(){
    var add_checklist = document.getElementById("add-checklist");
    tools.addListener(add_checklist, "click", tools.addClicklist)
})

var tools = (function(){
    return{
        
        insertCardAfter: function(boardid, index, content, card_len)
        {
             $.post("./api/card_insert.php",
                {
                    boardid: boardid,
                    index: index,
                    content: content,
                    card_len: card_len
                }
            ).done(function(res){})
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
            ).done(function(res){})
             .fail(function(xhr, status, error) {
                    alert(status + ":" + error);
            });
                
        },
        
        
        addBoard: function(id, title){
            tools.createBoard(id, title, board_array.length);
            
            var trello = document.getElementById("trello");
            var newBoard = document.createElement("li");
            newBoard.setAttribute("class", "check-board");
            
            var title_element = document.createElement("input");
            title_element.setAttribute("type", "text");
            title_element.setAttribute("class", "content");
            title_element.value = title;
            tools.addListener(title_element, "focus", tools.edit_title);
            tools.addListener(title_element, "blur", tools.remove_title_saveButton);
            
            var card_array = document.createElement("ul");
            card_array.setAttribute("class", "card-array");
    
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
            var save_button = document.getElementById("save-title");
            
            board_array.push(new Board(title_input.value));
            $("#title-modal").modal("hide");
            tools.removeListener(save_button, "click", tools.saveTitle);
        },
        
        closeModal: function(){
            var close_button = document.getElementById("close-title");
            
            $("#title-modal").modal("hide");
            tools.removeListener(close_button, "click", tools.closeModal);
        },
        
        edit_mode: function(event){
            var e = event || window.event;
            var saveButton = document.createElement("button");
            saveButton.setAttribute("type", "button");
            saveButton.setAttribute("class", "btn btn-primary btn-sm");
            saveButton.innerHTML = "Save";
            
            tools.addListener(saveButton, "click", function(){
                e.target.blur();
                e.target.parentElement.children[2].remove();
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
                e.target.blur();
                e.target.parentElement.children[1].remove();
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
                if(e.target.value == "") e.target.parentElement.remove();
                else{
                    var cursorPos = Number(tools.getCursurPosition(e.target));
                    var moved_str = e.target.value.slice(cursorPos),
                        reserve_str = e.target.value.slice(0, cursorPos);
                    
                    var target_index = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement);
                    var board_index = Array.prototype.indexOf.call(trello.children, e.target.parentElement.parentElement.parentElement);
                    
                    board_array[board_index].insertCardAfter(target_index, moved_str);
                    
                    e.target.value = reserve_str;
                    e.target.parentElement.parentElement.children[target_index + 1].children[1].value = moved_str;
                    
                    tools.setCursorPosition(e.target.parentElement.parentElement.children[target_index + 1].children[1], 0);
                }
            }
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
        
        getCursurPosition: function(textDom) {
            var cursorPos = 0;
            if (document.selection) {
                // IE Support
                textDom.focus ();
                var selectRange = document.selection.createRange();
                selectRange.moveStart ('character', -textDom.value.length);
                cursorPos = selectRange.text.length;
            }
            else if (textDom.selectionStart || textDom.selectionStart == '0') {
                // Firefox support
                cursorPos = textDom.selectionStart;
            }
            return cursorPos;
        },

        setCursorPosition: function(node, pos) {
            // Modern browsers
            if (node.setSelectionRange) {
                node.focus();
                node.setSelectionRange(pos, pos);
            } 
            // IE8 and below
            else if (node.createTextRange) {
                var range = node.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
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
        tools.addBoard(this.id, this.title);
    };

    Board.prototype = {
        getid: function(){
            return id;
        },
        
        getTitle: function(){
            return title;
        },
        
        insertCardAfter: function(index, content)
        {
            var card_array = document.getElementsByClassName("card-array")[this.index];
            var newCard = tools.createCard(content);
            
            if(index + 1 != this.card_len)
                card_array.insertBefore(newCard,  card_array.children[index + 1]);
            else card_array.appendChild(newCard);
            
            tools.insertCardAfter(this.id, index, content, this.card_len++);
        },
        
        addEmptyCard: function(){
            
            this.insertCardAfter(this.card_len-1, "");
        },
        
    }
    return Board;
}())
