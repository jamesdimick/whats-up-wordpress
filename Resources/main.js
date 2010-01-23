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

$(function(){
	var win = Titanium.UI.getCurrentWindow(),
	icon = Titanium.UI.setIcon('app://icon.ico'),
	dock = Titanium.UI.setDockIcon('app://icon.ico'),
	tray = Titanium.UI.addTray('app://icon.ico'),
	menu = Titanium.UI.createMenu(),
	show = menu.addCheckItem('Visible', function(){if(win.isVisible()){hide_all_dialogs();win.setVisible(false);show.setState(false);}else{win.setVisible(true);show.setState(true);win.focus();}}),
	sep1 = menu.addSeparatorItem(),
	prefs = menu.addItem('Preferences', function(){show_pref_dialog();if(!win.isVisible()){win.setVisible(true);show.setState(true);}win.focus();}),
	about = menu.addItem('About', function(){show_about_dialog();if(!win.isVisible()){win.setVisible(true);show.setState(true);}win.focus();}),
	sep2 = menu.addSeparatorItem(),
	exit = menu.addItem('Exit', function(){Titanium.App.exit();}),
	sites = get_sites();
	win.setTitle('What\u2019s Up WordPress?');
	win.addEventListener(Titanium.CLOSE, function(e){e.preventDefault();hide_all_dialogs();win.setVisible(false);show.setState(false);});
	tray.setHint('What\u2019s Up WordPress?');
	tray.setMenu(menu);
	$('.navbtn input', top.document).hover(function(){$(this).parent().find('span.normal').stop().fadeTo(100, 0).parent().find('span.hover').stop().fadeTo(100, 1)}, function(){$(this).parent().find('span.normal').stop().fadeTo(200, 1).parent().find('span.hover').stop().fadeTo(200, 0)});
	$('#navaddbtn', top.document).click(show_add_dialog);
	$('#navprefbtn', top.document).click(show_pref_dialog);
	$('#navaboutbtn', top.document).click(show_about_dialog);
	$('#donate', top.document).click(function(){Titanium.Desktop.openURL($(this).attr('href'));return false;});
	$('#sites').html('').removeClass('none');
	if(sites !== false) {
		populate_list(sites, false);
	} else {
		$('#sites').addClass('none');
		$('#sites').prepend('<li id="nosites"><h3>No Websites Have Been Added&hellip;</h3>Click the &ldquo;<em>Add a New Website</em>&rdquo; button above to get started</li>');
		$('#sites.none li').css({top:0, left:0, right:0, bottom:0, height:$('#sites.none li').height()});
	}
});