//Helper Functions
function createObjFromTemplate(templatename, data) {
    var rawhtml = $('#' + templatename).html();
    rawhtml = rawhtml.replace(/\{\{[a-zA-Z1-9_]+\}\}/g, function(placeholder) {
        return data[placeholder.substring(2, placeholder.length-2)];
    });
    rawhtml = jQuery.trim(rawhtml);
    return $($.parseHTML(rawhtml)[0]);
}

function createNewNotif(data) {
    var template = createObjFromTemplate('notif-template', data);
    setTimeout(function () {
        template.remove();
    }, 2000);
    $('#notif-container').append(template);
}


//bound functions
function toggleEntryOptions(e) {
    e.preventDefault();
    var entryItem = $(event.target).parents('.entry-item');
    if (entryItem.hasClass('entry-options-active')) {
        //leave editmode
        if (entryItem.hasClass('editmode')) {
            entryItem.removeClass('editmode');
        }
        //hide options
        entryItem.removeClass('entry-options-active');
        entryItem.find("[class^='entry-option-'],[class*=' entry-option-']").addClass(
            'invisible').removeClass('visible');
    } else {
        //show options
        entryItem.addClass('entry-options-active');
        entryItem.find('.entry-option-edit').html('E');
        entryItem.find('.entry-option-delete').html('D');
        entryItem.find("[class^='entry-option-'],[class*=' entry-option-']").removeClass(
            'invisible');
    }
}

function confirmEntryEdit(e) {
    e.preventDefault();
    var entryItem = $(event.target).parents('.entry-item');
    if (entryItem.hasClass('editmode')) { //Confirm Edit
        //submit or post
        $.post('/entry/' + entryItem.find('.entry-id').val(), {
            entryContent: entryItem.find('.entry-content-edit').val()
        });
        //exit editmode
        entryItem.removeClass('editmode');
        //reset edit btn to edit
        entryItem.find('.entry-option-edit').html('E');
    } else {
        //trying to confirm without editmode
        createNewNotif({
            notiftext: 'no no'
        });
    }
}

function enterEntryEditMode(e) {
    e.preventDefault();
    var entryItem = $(event.target).parents('.entry-item');
    if (entryItem.hasClass('editmode')) {
        //exit editmode
        entryItem.removeClass('editmode');
        //reset edit btn to edit
        entryItem.find('.entry-option-edit').html('E');
    } else {
        //enter edit mode
        entryItem.addClass('editmode');
        //change edit btn to cancel edit
        entryItem.find('.entry-option-edit').html('CE');
        //copy view value to edit field
        entryItem.find('.entry-content-edit').val(entryItem.find('.entry-content-vd')
            .html());
    }
}

function confirmEntryDelete(e) {
    e.preventDefault();
    var entryItem = $(event.target).parents('.entry-item');
    if (entryItem.find('.entry-option-confirmdelete').hasClass('visible')) {
        //delete entry
        $.post('/deleteEntry', {
            deleteEntryId: entryItem.find('.entry-id').val()
        });
    } else {
        //trying to delete on invisible btn
        createNewNotif({
            notiftext: 'how pls'
        });
    }
}

function toggleEntryDelete(e) {
    e.preventDefault();
    var entryItem = $(event.target).parents('.entry-item');
    if (entryItem.find('.entry-option-confirmdelete').hasClass('visible')) {
        //reset delte btn to delete
        entryItem.find('.entry-option-delete').html('D');
        //hide confirmdelete btn
        entryItem.find('.entry-option-confirmdelete').removeClass('visible');
    } else {
        //change delete btn to cancel delete
        entryItem.find('.entry-option-delete').html('CD');
        //show confirmdelete btn
        entryItem.find('.entry-option-confirmdelete').addClass('visible');
    }
}

function confirmChatEdit(e) {
    e.preventDefault();
    var chatItem = $(event.target).parents('.chat-item');
    if (chatItem.hasClass('editmode')) { //Confirm Edit
        //post edit
        $.post('/chat/' + chatItem.find('.chat-id').val(), {
            chatContent: chatItem.find('.chat-content-edit').val()
        });
        //exit editmode
        chatItem.removeClass('editmode');
        //reset edit btn to edit
        chatItem.find('.chat-option-edit').html('E');
    } else {
        //trying to confirm without editmode
        createNewNotif({
            notiftext: 'no no'
        });
    }
}

function enterChatEditMode(e) {
    e.preventDefault();
    var chatItem = $(event.target).parents('.chat-item');
    if (chatItem.hasClass('editmode')) {
        //exit editmode
        chatItem.removeClass('editmode');
        //reset edit btn to edit
        chatItem.find('.chat-option-edit').html('E');
    } else {
        //enter edit mode
        chatItem.addClass('editmode');
        //change edit btn to cancel edit
        chatItem.find('.chat-option-edit').html('CE');
        //copy view value to edit field
        chatItem.find('.chat-content-edit').val(chatItem.find('.chat-content-vd')
            .html());
    }
}

function deleteChat(e) {
    e.preventDefault();
    var chatItem = $(event.target).parents('.chat-item');
    //Send delete POST
    $.post('/deleteChat', {
        deleteChatId: chatItem.find('.chat-id').val()
    });
}

$(document).ready(function () {
    const globalSkt = io();
    const listNsp = io('/listNsp');
    const userNsp = io('/userNsp');
    //scroll chat down
    $('#chat-items').prop({
        scrollTop: $('#chat-items').prop('scrollHeight')
    });

    //window size functions
    if (window.matchMedia("screen and (min-width: 992px) and (orientation: landscape)")
        .matches) { //shows sidebar on big boy screens
        $('#lists-container').addClass('visible');
        $('#lists-container').removeClass('invisible');
    } else { //hides chat on smol screens
        $('#chat-container').removeClass('visible').addClass('invisible');
    }
    window.onresize = function () {
        if (!window.matchMedia("screen and (min-width: 992px) and (orientation: landscape)")
            .matches) { //removes fixed class from chat if window is too smol
            $('#chat-container').removeClass('chatfixed');
        }
    }

    //posts ajax post form
    $('.ajaxForm').submit(function (e) {
        e.preventDefault();
        var req = $.post($(this).attr('action'), $(this).serialize(), function (res) {
            //cool it worked
        }).fail(function (res) {
            console.log(res);
        });
        $(this).find('.clearOnSubmit').val('');
    });

    //entry status bind
    $('.entryCheck').change(function (e) {
        var status = 0;
        if (this.checked)
            status = 1;
        listNsp.emit('checkEntryChange', {
            id: e.target.getAttribute("value"),
            st: status
        });
        return false;
    });
    //entry option binds
    $('.toggleEntryOptions').click(toggleEntryOptions);
    $('.entry-option-confirmedit').click(confirmEntryEdit);
    $('.entry-option-edit').click(enterEntryEditMode);
    $('.entry-option-confirmdelete').click(confirmEntryDelete);
    $('.entry-option-delete').click(toggleEntryDelete);

    //chat option binds
    $('.chat-option-confirmedit').click(confirmChatEdit);
    $('.chat-option-edit').click(enterChatEditMode);
    $('.chat-option-delete').click(deleteChat);


    //toggle binds
    $('#toggleChat').click(function (e) {
        e.preventDefault();
        if ($('#chat-container').css('display') != 'none') { //hide
            $('#chat-container').addClass('invisible');
        } else { //show
            $('#chat-container').removeClass('invisible');
        }
    });
    $('#fixChat').click(function (e) {
        e.preventDefault();
        if ($('#chat-container').hasClass('chatfixed')) {
            $('#chat-container').removeClass('chatfixed');
        } else {
            $('#chat-container').addClass('chatfixed');
        }
    });
    $('#toggleLists').click(function (e) {
        e.preventDefault();
        if ($('#lists-container').css('display') != 'none') { //hide
            $('#lists-container').removeClass('visible');
            $('#lists-container').addClass('invisible');
        } else { //show
            $('#lists-container').addClass('visible');
            $('#lists-container').removeClass('invisible');
        }
    });


    //-----SOCKETS-----
    //room join msgs
    userNsp.emit('connectUser', {
        rid: 'U' + window.sessionStorage.getItem('accountId')
    });
    listNsp.emit('joinRoom', {
        rid: 'L' + window.location.href.substr(window.location.href.lastIndexOf('/') + 1)
    });

    userNsp.on('notifMsg', function (msg) {
        createNewNotif({
            notiftext: msg.sender + ': ' + msg.message + ' in ' + msg.listid
        });
    });
    //Status Change
    listNsp.on('checkEntryChange', function (msg) {
        var checked = true;
        if (msg.st == 0)
            checked = false;
        $('#entryCheck' + msg.id).prop('checked', checked);
    });
    listNsp.on('newChatMsg', function (msg) {
        var newChat = createObjFromTemplate('chat-template', msg);
        //mark as chat-self if message is from myself
        if (window.sessionStorage.getItem('accountId') == msg.senderId) {
            newChat.addClass('chat-self');
        }
        //bind functions
        newChat.find('.chat-option-confirmedit').on('click', confirmChatEdit);
        newChat.find('.chat-option-edit').on('click', enterChatEditMode);
        newChat.find('.chat-option-delete').on('click', deleteChat);
        //append
        $('#chat-items').append(newChat);
        $('#chat-items').animate({
            scrollTop: $('#chat-items').prop('scrollHeight')
        }, 500);
    });
    listNsp.on('deleteChatMsg', function (msg) {
        //remove chat-item div with chat-id hidden input of deleteChatId in msg
        $('#chat-items').find('[value=' + msg.deleteChatId + ']').parents('.chat-item')
            .remove();
    });
    listNsp.on('editChatMsg', function (msg) {
        //edit Chat
        $('#chat-items').find('[value=' + msg.updatedChatId + ']').parents('.chat-item').find(
            '.chat-content-vd').html(msg.updatedChatMessage);
    });
    listNsp.on('newEntryMsg', function (msg) {
        msg.checkedString=(msg.status==0) ? '' : 'checked';
        console.log(msg);
        var newEntry = createObjFromTemplate('entry-template', msg);
        //bind functions
        newEntry.find('.toggleEntryOptions').click(toggleEntryOptions);
        newEntry.find('.entry-option-confirmedit').click(confirmEntryEdit);
        newEntry.find('.entry-option-edit').click(enterEntryEditMode);
        newEntry.find('.entry-option-confirmdelete').click(confirmEntryDelete);
        newEntry.find('.entry-option-delete').click(toggleEntryDelete);
        //append
        $('#entries-container').append(newEntry);
    });
    listNsp.on('deleteEntryMsg', function (msg) {
        //delete Entry
        $('#entries-container').find('[value=' + msg.deleteEntryId + ']').parents('.entry-item')
            .remove();
    });
    listNsp.on('editEntryMsg', function (msg) {
        //updated Entry Name in entryitem with id from msg
        $('#entries-container').find('[value=' + msg.updatedEntryId + ']').parents(
            '.entry-item').find('.entry-content-vd').html(msg.updatedEntryName);
    });
});