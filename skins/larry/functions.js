/**
 * ContextMenu plugin script
 *
 * @licstart  The following is the entire license notice for the
 * JavaScript code in this file.
 *
 * Copyright (C) 2014-2017 Philip Weir
 *
 * The JavaScript code in this page is free software: you can redistribute it
 * and/or modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 */

function rcm_add_menu_text(menu, p) {
    if (menu == 'composeto') {
        if ($(p.item).children('a').hasClass('addto')) {
            $(p.item).children('a').children('span').text($('#compose-contacts div.boxfooter a.addto').attr('title'));
        }
        else if ($(p.item).children('a').hasClass('addcc')) {
            $(p.item).children('a').children('span').text($('#compose-contacts div.boxfooter a.addcc').attr('title'));
        }
        else if ($(p.item).children('a').hasClass('addbcc')) {
            $(p.item).children('a').children('span').text($('#compose-contacts div.boxfooter a.addbcc').attr('title'));
        }
        else if ($(p.item).children('a').hasClass('vcard')) {
            $(p.item).children('a').children('span').text($('#compose-contacts div.boxfooter a.vcard').attr('title'));
        }
    }
    else if (menu == 'contactlist') {
        if ($(p.item).children('a').hasClass('delete')) {
            $(p.item).children('a').children('span').text($('#addresslist div.boxfooter a.delete').attr('title'));
        }
        else if ($(p.item).children('a').hasClass('removegroup')) {
            $(p.item).children('a').children('span').text($('#addresslist div.boxfooter a.removegroup').attr('title'));
        }
    }
}

function rcm_reorder_contact_menu(p) {
    // put export link last
    var ul = p.ref.container.find('ul:first');
    $(p.ref.container).find('a.export').parent('li').appendTo(ul);

    // put assign group link before remove
    $(p.ref.container).find('a.assigngroup').parent('li').insertBefore($(p.ref.container).find('a.removegroup').parent('li'));
}

$(document).ready(function() {
    if (window.rcmail) {
        rcmail.context_menu_settings = $.extend(rcmail.context_menu_settings, {
            popup_pattern: /UI\.toggle_popup\(\'([^\']+)\'/
        });

        if (rcmail.env.task == 'mail' && rcmail.env.action == '') {
            rcmail.addEventListener('insertrow', function(props) { rcm_listmenu_init(props.row.id, {'menu_name': 'messagelist', 'menu_source': '#messagetoolbar'}); } );
            rcmail.add_onload("rcm_foldermenu_init('#mailboxlist li', {'menu_source': ['#rcmFolderMenu', '#mailboxoptionsmenu']})");
        }
        else if (rcmail.env.task == 'mail' && rcmail.env.action == 'compose') {
            rcmail.addEventListener('insertrow', function(props) { rcm_listmenu_init(props.row.id, {'menu_name': 'composeto', 'menu_source': '#compose-contacts div.boxfooter', 'list_object': 'contact_list'}, {'insertitem': function(p) { rcm_add_menu_text('composeto', p); }}); } );
        }
        else if (rcmail.env.task == 'addressbook' && rcmail.env.action == '') {
            rcmail.addEventListener('insertrow', function(props) { rcm_listmenu_init(props.row.id, {'menu_name': 'contactlist', 'menu_source': ['#addressbooktoolbar','#addresslist div.boxfooter a.delete','#addresslist div.boxfooter a.removegroup', '#rcmAddressBookMenu'], 'list_object': 'contact_list'}, {
                'insertitem': function(p) { rcm_add_menu_text('contactlist', p); },
                'init': function(p) { rcm_reorder_contact_menu(p); }
            }); } );
            rcmail.add_onload("rcm_abookmenu_init('#directorylist li, #savedsearchlist li', {'menu_source': ['#directorylist-footer a.add', '#groupoptionsmenu']}, {'insertitem': function(p) { rcm_add_menu_text('abooklist', p); }})");
            rcmail.addEventListener('group_insert', function(props) { rcm_abookmenu_init(props.li, {'menu_source': ['#directorylist-footer', '#groupoptionsmenu']}); } );
            rcmail.addEventListener('abook_search_insert', function(props) { rcm_abookmenu_init(rcmail.savedsearchlist.get_item('S' + props.id), {'menu_source': ['#directorylist-footer', '#groupoptionsmenu']}); } );
        }
    }
});