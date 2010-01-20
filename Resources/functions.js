/*
  What's Up WordPress? - Monitor your WordPress websites from your desktop
  Copyright (C) 2010 James Dimick <mail@jamesdimick.com> - http://www.JamesDimick.com/

  Project Details: http://www.jamesdimick.com/creations/whats-up-wordpress/

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

jQuery.fn.slideDownFade = function(speed, easing, callback) {
	return this.animate({opacity:'show', height:'show'}, speed, easing, callback);
};

function restore_list_order() {
	var Props = Titanium.App.Properties;
	if(Props.hasProperty('wuw_sortables_order')) {
		var order = Props.getList('wuw_sortables_order');
		if(order && order.length > 1) {
			for(var i in order) {
				var orig = $('#' + order[i])[0];
				if(orig) {
					$('#' + order[i]).remove();
					$('#sites').append(orig);
				}
			}
		}
	}
}

function sortables_fix() {
	$('#sites').sortable('destroy');
	$('#sites').sortable({
		axis: 'y',
		containment: 'parent',
		cursor: 'move',
		handle: $('.move'),
		opacity: 0.9,
		revert: true,
		start: function(event,ui){$('*').addClass('move-cursor');$(ui.helper).addClass('sortable-selected');},
		beforeStop: function(event,ui){$('*').removeClass('move-cursor');$(ui.helper).removeClass('sortable-selected');},
		update: function(event,ui){var order=$('#sites').sortable('toArray'),Props=Titanium.App.Properties;Props.setList('wuw_sortables_order',order);}
	});
}

function fix_links() {
	$('a:not(.move, .edit, .remove)').each(function(){
		var href = $(this).attr('href');
		$(this).attr('title', href);
		$(this).click(function(){Titanium.Desktop.openURL(href);return false;});
	});
}

function fix_actions_hover() {
	$('.move, .edit, .remove').hover(function(){$(this).animate({backgroundColor:'#39f'},100)}, function(){$(this).animate({backgroundColor:'#c0c0c0'},200)});
}

function isArray(obj) {
	return obj.constructor == Array;
}

function loading_dots() {
	if($('#loading').length != 0) {
		if(($('#loading').text().match(/\./g) ? $('#loading').text().match(/\./g).length : 0) < 3) {
			$('#loading').append('.');
		} else {
			$('#loading').html($('#loading').html().replace(/\./g, ''));
		}
		setTimeout(loading_dots, 400);
	}
}

function do_loading() {
	if($('#loading').length == 0) {
		$('body').append('<strong id="loading">Loading...</strong>');
		$('#loading').css('width', $('#loading').width());
		setTimeout(loading_dots, 400);
	}
}

function end_loading() {
	if($('#loading').length != 0) $('#loading').remove();
}

function fade_message(msgTxt) {
	$('body', top.document).append('<strong id="msg"><span>' + msgTxt + '</span></strong>');
	$('#msg span', top.document).css({top:0, left:0, right:0, bottom:0, height:$('#msg span', top.document).height(), width:$('#msg span', top.document).width()});
	$('#msg', top.document).fadeOut(1500, function(){$(this).remove();});
}

function fadeout_new(elem, speed, delay, step) {
	var checkstep = (step == undefined ? 10 : step),
	newstep = (checkstep == 10 ? '1' : (checkstep == 0 ? '0' : '0.' + checkstep));
	$(elem).css('-webkit-box-shadow', 'inset #fff 0 1px 0 0, inset #d5d5d5 0 -1px 0 0, inset #eee 0 0 0 1px, rgba(255, 255, 0, ' + newstep + ') 0 0 5px, rgba(0, 0, 0, 0.3) 0 3px 5px !important');
	if(checkstep == 10 && delay != undefined) {
		checkstep--;
		setTimeout(fadeout_new, delay, elem, speed, delay, checkstep);
	} else if(checkstep >= 0) {
		checkstep--;
		setTimeout(fadeout_new, speed, elem, speed, delay, checkstep);
	} else {
		$(elem).css('-webkit-box-shadow', '');
	}
}

function do_favicon(site_id, url) {
	var tmpImg = new Image();
	$(tmpImg).bind('load', {site_id:site_id,url:url}, function(e){
		$('#site_' + e.data.site_id + ' h3 a').prepend('<img src="' + e.data.url + 'favicon.ico" height="16" width="16" alt="*"> ');
	});
	tmpImg.src = url + 'favicon.ico';
}

function fixedEncodeURIComponent(str) {
	return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
}

function add_class_ifnot(elem, clss) {
	if(elem.hasClass(clss)){return;}else{elem.addClass(clss);}
}

function show_notification(title, msg) {
	var note = Titanium.Notification.createNotification(window);
	note.setIcon('app://icon5.png');
	note.setTitle(title);
	note.setMessage(msg);
	note.setCallback(function(){var win=Titanium.UI.getCurrentWindow();if(!win.isVisible()){win.setVisible(true);show.setState(true);}win.focus();});
	note.show();
}

function show_notification_ifnew(data) {
	var Props = Titanium.App.Properties,
	theNew = new Array();
	theNew.push(data.core_update_available.toString(), data.updatable_plugins.toString(), data.total_posts.toString(), data.total_comments.toString());
	if(Props.hasProperty('wuw_latest_data')) {
		var theOld = Props.getList('wuw_latest_data');
		if(theOld[0] != undefined && theOld[0] != theNew[0]) show_notification('WordPress Upgrade Available!', 'A new version of WordPress is available for ' + data.site_name + '\u2026 \n');
		if(theOld[1] != undefined && theOld[1] != theNew[1]) show_notification('New Plugin Updates Available!', 'There are new plugin updates available for ' + data.site_name + '\u2026 \n');
		if(theOld[2] != undefined && theOld[2] != theNew[2]) show_notification('New Post Submitted!', 'There is a new post at ' + data.site_name + '\u2026 \n');
		if(theOld[3] != undefined && theOld[3] != theNew[3]) show_notification('New Comment Submitted!', 'There is a new comment at ' + data.site_name + '\u2026 \n');
	}
	Props.setList('wuw_latest_data', theNew);
	return false;
}

function sites_empty() {
	if($('#sites').is(':empty')) {
		$('#sites').addClass('none');
		$('#sites').prepend('<li id="nosites"><h3>No Websites Have Been Added&hellip;</h3>Click the &ldquo;<em>Add a New Website</em>&rdquo; button above to get started</li>');
		$('#sites.none li').css({top:0, left:0, right:0, bottom:0, height:$('#sites.none li').height()});
	}
}

function get_sites() {
	var db = Titanium.Database.open('whatsupwordpress'),
	tbl = db.execute('CREATE TABLE IF NOT EXISTS sites (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, user TEXT, pass TEXT)'),
	rows = db.execute('SELECT * FROM sites'),
	sites = [];
	while(rows.isValidRow()) {
		sites.push({'id':rows.fieldByName('id'), 'url':rows.fieldByName('url'), 'user':rows.fieldByName('user'), 'pass':rows.fieldByName('pass')});
		rows.next();
	}
	db.close();
	return (sites.length > 0 ? sites : false);
}

function output_site(site_data, editing) {
	var site_id = site_data.site_id, site_base = (/[\\\/]$/.test(site_data.site_base) ? site_data.site_base : site_data.site_base + '/');
	$('#sites').removeClass('none');
	if(site_data.site_name && site_data.site_url && site_data.site_admin_url && site_data.wordpress_version) {
		var site_name = site_data.site_name,
		site_url = (/[\\\/]$/.test(site_data.site_url) ? site_data.site_url : site_data.site_url + '/'),
		site_admin_url = (/[\\\/]$/.test(site_data.site_admin_url) ? site_data.site_admin_url : site_data.site_admin_url + '/'),
		wordpress_version = site_data.wordpress_version,
		core_update_available = (site_data.core_update_available == 1 ?  '<strong><a href="' + site_admin_url + 'update-core.php" class="important">available</a></strong>' : '<strong>not</strong> available'),
		active_plugins = '<strong><a href="' + site_admin_url + 'plugins.php?plugin_status=active">' + site_data.active_plugins + '</a></strong> active plugin' + (site_data.active_plugins == 1 ? '' : 's'),
		updatable_plugins = (site_data.updatable_plugins > 0 ? '<strong><a href="' + site_admin_url + 'plugins.php?plugin_status=upgrade" class="important">' + site_data.updatable_plugins + '</a></strong> plugin update' + (site_data.updatable_plugins == 1 ? '' : 's') + ' available' : '<strong>no</strong> plugin updates available'),
		total_posts = (site_data.total_posts == 1 ? 'is <strong><a href="' + site_admin_url + 'edit.php">' + site_data.total_posts + '</a></strong> post' : 'are <strong><a href="' + site_admin_url + 'edit.php">' + site_data.total_posts + '</a></strong> posts'),
		total_posts_categories = '<strong><a href="' + site_admin_url + 'categories.php">' + site_data.total_posts_categories + '</a></strong> categor' + (site_data.total_posts_categories == 1 ? 'y' : 'ies'),
		published_posts = site_data.published_posts,
		draft_posts = site_data.draft_posts,
		pending_posts = site_data.pending_posts,
		scheduled_posts = site_data.scheduled_posts,
		trashed_posts = site_data.trashed_posts,
		total_comments = (site_data.total_comments == 1 ? 'is <strong><a href="' + site_admin_url + 'edit-comments.php">' + site_data.total_comments + '</a></strong> comment' : 'are <strong><a href="' + site_admin_url + 'edit-comments.php">' + site_data.total_comments + '</a></strong> comments'),
		approved_comments = site_data.approved_comments,
		pending_comments = site_data.pending_comments,
		spam_comments = site_data.spam_comments,
		trashed_comments = site_data.trashed_comments,
		theInnerHtml = '<h3><a href="' + site_url + '">' + site_name + '</a> <span><a href="" onclick="return false;" class="move" title="Click and Drag to Move">Move</a><a href="" onclick="show_edit_dialog(' + site_id + ');return false;" class="edit" title="Edit">Edit</a><a href="" onclick="show_delete_dialog(' + site_id + ');return false;" class="remove" title="Remove">Remove</a></span></h3>Running WordPress version <strong>' + wordpress_version + '</strong> with ' + active_plugins + '.<br>Core upgrade ' + core_update_available + ' and ' + updatable_plugins + '.<br>There ' + total_posts + ' in ' + total_posts_categories + ' <em>(<strong><a href="' + site_admin_url + 'edit.php?post_status=publish">' + published_posts + '</a></strong> published, <strong><a href="' + site_admin_url + 'edit.php?post_status=draft">' + draft_posts + '</a></strong> drafts, <strong><a href="' + site_admin_url + 'edit.php?post_status=pending">' + pending_posts + '</a></strong> pending, <strong><a href="' + site_admin_url + 'edit.php?post_status=future">' + scheduled_posts + '</a></strong> scheduled, <strong><a href="' + site_admin_url + 'edit.php?post_status=trash">' + trashed_posts + '</a></strong> trashed)</em>.<br>Currently there ' + total_comments + ' <em>(<strong><a href="' + site_admin_url + 'edit-comments.php?comment_status=approved">' + approved_comments + '</a></strong> approved, <strong><a href="' + site_admin_url + 'edit-comments.php?comment_status=moderated">' + pending_comments + '</a></strong> pending, <strong><a href="' + site_admin_url + 'edit-comments.php?comment_status=spam">' + spam_comments + '</a></strong> spam, <strong><a href="' + site_admin_url + 'edit-comments.php?comment_status=trash">' + trashed_comments + '</a></strong> trashed)</em>.';
		if(editing === true) {
			$('#site_' + site_id).html(theInnerHtml);
		} else {
			$('#sites').prepend('<li id="site_' + site_id + '" style="display:none">' + theInnerHtml + '</li>');
			$('#site_' + site_id).slideDownFade('slow');
		}
		do_favicon(site_id, site_url);
	} else {
		var theInnerHtml = '<h3><a href="' + site_base + '">' + site_base + '</a> <span><a href="" onclick="return false;" class="move" title="Click and Drag to Move">Move</a><a href="" onclick="show_edit_dialog(' + site_id + ');return false;" class="edit" title="Edit">Edit</a><a href="" onclick="show_delete_dialog(' + site_id + ');return false;" class="remove" title="Remove">Remove</a></span></h3>An <strong class="important">error</strong> occurred while attempting to display the data from this website. <strong>Please ensure that:</strong><ol><li><span>The website is running <a href="http://www.wordpress.org/">WordPress</a></span></li><li><span>The website has <a href="http://www.jamesdimick.com/creations/whats-up-wordpress/">the required WordPress plugin</a> installed and activated</span></li><li><span>You have permission to access this website</span></li><li><span>Your login credentials are correct</span></li></ol>';
		if(editing === true) {
			$('#site_' + site_id).html(theInnerHtml);
		} else {
			$('#sites').prepend('<li id="site_' + site_id + '" class="error" style="display:none">' + theInnerHtml + '</li>');
			$('#site_' + site_id).slideDownFade('slow');
		}
		do_favicon(site_id, site_base);
	}
}

function populate_list(sites, editing) {
	do_loading();
	var aoe = false;
	if(!isArray(sites)) {
		var aoe = true,
		db = Titanium.Database.open('whatsupwordpress'),
		rows = db.execute('SELECT * FROM sites WHERE id = ?', parseInt(sites)),
		sites = [];
		sites.push({'id':rows.fieldByName('id'), 'url':rows.fieldByName('url'), 'user':rows.fieldByName('user'), 'pass':rows.fieldByName('pass')});
		db.close();
	}
	var xhr = Titanium.Network.createHTTPClient(),
	params = 'whatsupwordpressusername=' + fixedEncodeURIComponent(sites[0].user) + '&whatsupwordpresspassword=' + fixedEncodeURIComponent(sites[0].pass),
	length = String(params.length),
	fixurl = (/^http\:\/\//.test(sites[0].url) ? '' : 'http://') + sites[0].url + (/[\\\/]$/.test(sites[0].url) ? '' : '/');
	xhr.onreadystatechange = function(){
		if(this.readyState == xhr.DONE) {
			var site_data = {};
			try{site_data = Titanium.JSON.parse(this.responseText);}catch(e){site_data.error = 'parse_error';}
			site_data.site_id = sites[0].id;
			site_data.site_base = sites[0].url;
			$('#sites').removeClass('none');
			$('#nosites').remove();
			if(!site_data.error) show_notification_ifnew(site_data);
			if(editing === true) output_site(site_data, true); else output_site(site_data, false);
			if(aoe === true && editing === false) fadeout_new('#site_' + site_data.site_id, 100, 2000);
			if(aoe === false && editing === false) restore_list_order();
			sortables_fix();
			fix_links();
			fix_actions_hover();
			if(aoe === false) sites.splice(0, 1);
			if(aoe === false && sites.length > 0) {
				populate_list(sites, (editing === true ? true : false));
			} else {
				$('#loading').fadeOut('slow', end_loading);
				var freq = (Titanium.App.Properties.getInt('prefs_updatefreq', 5) * 60000);
				sites = get_sites();
				try{clearTimeout(rTimeout);}catch(e){}
				rTimeout = setTimeout(populate_list, freq, sites, true);
			}
		}
	};
	xhr.open('POST', fixurl);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader('Content-length', length);
	xhr.setRequestHeader('Connection', 'close');
	xhr.send(params);
}

function hide_all_dialogs() {
	$('.dialog input', top.document).each(function(){$(this).val($(this).attr('defaultValue')).removeClass('error');});
	$('.dialog .helpbtn', top.document).removeClass('helperr');
	$('.dialog', top.document).fadeOut('fast');
}

function show_add_dialog() {
	if($('#addsite', top.document).css('display') == 'none') {
		hide_all_dialogs();
		$('#addsite', top.document).fadeIn('fast');
		$('#addsite div', top.document).css({bottom:'30px', height:$('#addsite div', top.document).css('height')});
		$('#addsite a', top.document).each(function(){var href=$(this).attr('href');$(this).attr('title',href);$(this).click(function(){Titanium.Desktop.openURL(href);return false;});});
		$('#addsite_url, #addsite_user, #addsite_pass', top.document).bind('blur focus load click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup', function(){if($('#addsite_url',top.document).val()!=''&&$('#addsite_url',top.document).val()!=$('#addsite_url',top.document).attr('defaultValue')&&$('#addsite_user',top.document).val()!=''&&$('#addsite_user',top.document).val()!=$('#addsite_user',top.document).attr('defaultValue')&&$('#addsite_pass',top.document).val()!=''&&$('#addsite_pass',top.document).val()!=$('#addsite_pass',top.document).attr('defaultValue'))$('#addsite_submit',top.document).removeAttr('disabled');else $('#addsite_submit',top.document).attr('disabled','disabled');});
		$('#addsite_cancel', top.document).click(hide_all_dialogs);
		$('#addsite_submit', top.document).click(add_dialog_submit).attr('disabled', 'disabled');
	}
}

function add_dialog_submit() {
	var url = $('#addsite_url', top.document).val(), user = $('#addsite_user', top.document).val(), pass = $('#addsite_pass', top.document).val();
	if(url.length > 4 && user.length > 1 && pass.length > 1) {
		var newurl = (/^http\:\/\//.test(url) ? '' : 'http://') + url + (/[\\\/]$/.test(url) ? '' : '/'), db = Titanium.Database.open('whatsupwordpress');
		db.execute("INSERT INTO sites (id, url, user, pass) VALUES (null, ?, ?, ?)", newurl, user, pass);
		var lastId = db.lastInsertRowId;
		db.close();
		populate_list(lastId, false);
		hide_all_dialogs();
		fade_message('Website Added!');
	} else {
		if(url.length < 4) add_class_ifnot($('#addsite_url', top.document), 'error');
		if(user.length < 1) add_class_ifnot($('#addsite_user', top.document), 'error');
		if(pass.length < 1) add_class_ifnot($('#addsite_pass', top.document), 'error');
		add_class_ifnot($('#addsite .helpbtn', top.document), 'helperr');
		alert('There was an error in your input! Please try again\u2026');
		$('#addsite_submit', top.document).focus();
	}
}

function show_edit_dialog(site_id) {
	if($('#editsite', top.document).css('display') == 'none') {
		hide_all_dialogs();
		$('#editsite', top.document).fadeIn('fast');
		$('#editsite div', top.document).css({bottom:'30px', height:$('#editsite div', top.document).css('height')});
		$('#editsite a', top.document).each(function(){var href=$(this).attr('href');$(this).attr('title',href);$(this).click(function(){Titanium.Desktop.openURL(href);return false;});});
		var db = Titanium.Database.open('whatsupwordpress'),
		rows = db.execute('SELECT * FROM sites WHERE id = ' + site_id + ' LIMIT 1'),
		eurl = rows.fieldByName('url'), euser = rows.fieldByName('user'), epass = rows.fieldByName('pass');
		db.close();
		$('#editsite_url', top.document).val(eurl);
		$('#editsite_user', top.document).val(euser);
		$('#editsite_pass', top.document).val(epass);
		$('#editsite_url, #editsite_user, #editsite_pass', top.document).bind('blur focus load click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup', function(){if($('#editsite_url',top.document).val()!=''&&$('#editsite_user',top.document).val()!=''&&$('#editsite_pass',top.document).val()!='')$('#editsite_submit',top.document).removeAttr('disabled');else $('#editsite_submit',top.document).attr('disabled','disabled');});
		$('#editsite_cancel', top.document).click(hide_all_dialogs);
		$('#editsite_submit', top.document).bind('click', {site_id:site_id}, edit_dialog_submit);
	}
}

function edit_dialog_submit(e) {
	var site_id = e.data.site_id, url = $('#editsite_url', top.document).val(), user = $('#editsite_user', top.document).val(), pass = $('#editsite_pass', top.document).val();
	if(url.length > 4 && user.length > 1 && pass.length > 1) {
		var newurl = (/^http\:\/\//.test(url) ? '' : 'http://') + url + (/[\\\/]$/.test(url) ? '' : '/'), db = Titanium.Database.open('whatsupwordpress');
		db.execute("UPDATE sites SET url = ?, user = ?, pass = ? WHERE id = " + site_id, newurl, user, pass);
		db.close();
		populate_list(site_id, true);
		hide_all_dialogs();
		fade_message('Website Updated!');
	} else {
		if(url.length < 4) add_class_ifnot($('#editsite_url', top.document), 'error');
		if(user.length < 1) add_class_ifnot($('#editsite_user', top.document), 'error');
		if(pass.length < 1) add_class_ifnot($('#editsite_pass', top.document), 'error');
		add_class_ifnot($('#editsite .helpbtn', top.document), 'helperr');
		alert('There was an error in your input! Please try again\u2026');
		$('#editsite_submit', top.document).focus();
	}
}

function show_delete_dialog(site_id) {
	if($('#deletesite', top.document).css('display') == 'none') {
		hide_all_dialogs();
		$('#deletesite', top.document).fadeIn('fast');
		$('#deletesite div', top.document).css({bottom:'30px', height:$('#deletesite div', top.document).css('height')});
		$('#deletesite #no', top.document).click(hide_all_dialogs);
		$('#deletesite #yes', top.document).bind('click', {site_id:site_id}, delete_dialog_submit);
		$('#deletesite #yes', top.document).focus();
	}
}

function delete_dialog_submit(e) {
	var site_id = e.data.site_id, db = Titanium.Database.open('whatsupwordpress');
	db.execute("DELETE FROM sites WHERE id = " + site_id);
	db.close();
	$('#site_' + site_id).addClass('deleting').fadeOut(1500, function(){$(this).remove();sites_empty();});
	hide_all_dialogs();
	fade_message('Website Removed!');
}

function show_pref_dialog() {
	if($('#preferences', top.document).css('display') == 'none') {
		hide_all_dialogs();
		var currFreq = Titanium.App.Properties.getInt('prefs_updatefreq', 5);
		$('#preferences', top.document).fadeIn('fast');
		$('#prefs_updatefreq', top.document).attr('defaultValue', currFreq).spinner({min:1, max:1440, step:1, value:currFreq});
		$('#ui-spinner-prefs_updatefreq, .ui-spinner-button-wrap', top.document).css('height', parseInt($('#prefs_updatefreq', top.document).css('height')) + 'px !important');
		$('#preferences div', top.document).css({bottom:'30px', height:$('#preferences div', top.document).css('height')});
		$('#prefs_cancel', top.document).click(hide_all_dialogs);
		$('#prefs_submit', top.document).click(pref_dialog_submit);
		$('#prefs_submit', top.document).focus();
	}
}

function pref_dialog_submit() {
	var updateFreq = parseInt($('#prefs_updatefreq', top.document).val());
	if(updateFreq >= 1 && updateFreq <= 1440) {
		var Props = Titanium.App.Properties;
		Props.setInt('prefs_updatefreq', updateFreq);
		$('#prefs_updatefreq', top.document).attr('defaultValue', Props.getInt('prefs_updatefreq', 5));
		hide_all_dialogs();
		fade_message('Preferences Updated!');
	} else {
		if(updateFreq < 1 || updateFreq > 1440) add_class_ifnot($('#prefs_updatefreq',top.document), 'error');
		add_class_ifnot($('#preferences .helpbtn',top.document), 'helperr');
		alert('There was an error in your input! Please try again\u2026');
		$('#prefs_submit', top.document).focus();
	}
}

function show_about_dialog() {
	if($('#about', top.document).css('display') == 'none') {
		hide_all_dialogs();
		$('#sites:before').css('display', 'none');
		$('#about', top.document).fadeIn('fast');
		$('#about div', top.document).css({bottom:'30px', height:$('#about div', top.document).css('height')});
		$('#about a', top.document).each(function(){var href = $(this).attr('href');$(this).attr('title', href);$(this).click(function(){Titanium.Desktop.openURL(href);return false;});});
		$('#about #done', top.document).click(hide_all_dialogs);
		$('#about #done', top.document).focus();
	}
}