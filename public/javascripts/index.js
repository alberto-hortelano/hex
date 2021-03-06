document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;

function requestFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
}

var socket = io();
$(document).ready(function() {

  socket.on('newPlayer', function(players,id){
		console.log('newPlayer',players);
		if (players.a === id) {
			$('#message').text('A');
			$('#tablero').addClass('player_a');
		} else {
			$('#message').text('B');
			$('#tablero').addClass('player_b');
		}
  });
  socket.on('enemyClick', function(id){
		console.log('enemyClick',id);
		game.onClick($('#'+id));
  });
  socket.on('next_turn', function(){
		game.next_turn();
  });
  socket.on('connect', function(){
    socket.emit('requestOldPlayers', {});
  });
	socket.on('drawMap', function (trees) {
		console.log(trees);
		draw_map(trees);
	});
  document.oncontextmenu = function() {return false;};

  $(document).mousedown(function(e){
    if( e.button == 2 ) {
			var id = $(e.target).parent().attr('id');
			if (id !== undefined && id.length > 2 && id.indexOf('_') > 0) {
				var split = id.split('_');
				var hero = game.mapArray[split[0]][split[1]].hero;
				if (hero !== false) {
					console.log(hero);
		      var $inputs = $('#heroes .stats input,#heroes .stats select');
		      $inputs.each(function () {
						$(this).val(hero[$(this).attr('id')]);
		      });
					game.state.print_preview();
				}
			}
      $('#mandos').toggleClass('visible');
      return false;
    }
    return true;
  });
  $('#select_hero').click(function(e){
    $('#mandos').toggleClass('visible');
  });

  $('#toggle_coords').click(function () {
    $('#map').toggleClass('show_coords');
  });

  $(window).bind('mousewheel DOMMouseScroll', function (event) {
    if (event.ctrlKey == true) {
      console.log(event);
      event.preventDefault();
    }
  });

  if (document.fullscreenEnabled) {
  	$('#full_screen').click(function () {
  	  requestFullscreen(document.documentElement);
  	});
  }

  $(document).keydown(function(event) {
    switch (event.which) {
      case 87: // w
        $('#tablero').scrollTop($('#tablero').scrollTop()-166);
        break;
      case 83: // w
        $('#tablero').scrollTop($('#tablero').scrollTop()+166);
        break;
      case 65: // w
        $('#tablero').scrollLeft($('#tablero').scrollLeft()-300);
        break;
      case 68: // w
        $('#tablero').scrollLeft($('#tablero').scrollLeft()+300);
        break;
      default:

    }
  });

  //$('#map').draggable({ containment: "parent" });


});

// Draw the map of Hexagons into the div map
function draw_map(trees) {
  hex_width = 74;
  hex_tiles = "";
  row_type = 1;
  hex_offset = 15;
  offset= ((game.mapsize_x/2)*(hex_width-hex_offset));
  console.log(offset);
  z_index=game.mapsize_x;
	game.mapArray = hexer.MultiDimensionalArray(30,30);
	for (x=0; x  < game.mapsize_x; x++) {
	  for (y=0; y < game.mapsize_y; y++) {
	    var hasTree = trees[x][y];
	    if (hasTree < 2) {
	      game.mapArray[x][y] = new hexer.hex({blocked:true,classes:["tree","tree_1"]});
	    } else if(hasTree < 5) {
	      game.mapArray[x][y] = new hexer.hex({blocked:true,classes:["tree","tree_2"]});
	    } else if(hasTree < 10) {
	      game.mapArray[x][y] = new hexer.hex({blocked:true,classes:["tree","tree_3"]});
	    } else {
	      game.mapArray[x][y] = new hexer.hex();
	    }
	  }
	}
  for (x=0; x < game.mapsize_x; x++) {
    for (y=0; y < game.mapsize_y; y++) {
      if (x + y < hex_offset || x + y >= 2*game.mapsize_x - hex_offset) {
        delete game.mapArray[x][y];
        continue;
      }
      if (x - y > hex_offset || y - x > hex_offset) {
        delete game.mapArray[x][y];
        continue;
      }
      var hex = game.mapArray[x][y];
      hex_x = ((x-hex_offset) * hex_width)+(y*hex_width);
      hex_y = (y-x)*43+offset/3 + 360;
      //hex_y = (x-hex_offset * -43)+(y-hex_offset*43)+offset ;
      hex_tiles +='<div id="'+ x + '_' + y +'" class="hex '+hex.getClass()+'" style="position:absolute;z-index:'+z_index+';left:' + hex_x + 'px;top:' + hex_y + 'px;">';
      hex_tiles +='<div id="hex_' + x + '_' + y + '" class="hex_caption">';
      hex_tiles +='<span class="hex_coords">'+x+','+y+'</span><span class="steps"></span>';
      hex_tiles +='</div>';
      hex_tiles += '<div class="hex_l"><div class="hex_r"><div class="hex_inner"';
        if(hex.classes.length === 1) hex_tiles += ' style="background-position:'+hexer.getRandomInt(0,101)+'% '+hexer.getRandomInt(0,101)+'%;"';
      hex_tiles += '><span class="combat"></span><span class="mov"></span></div></div></div>';
      hex_tiles += '</div>';
    }
    z_index--;
  }
  document.getElementById('map').innerHTML += hex_tiles;
  var round = 0;
  setInterval(function () {
    round--;
    //$('.hero_preview').css('background-position-x', (250*round-50)+'px');
  },180);
	game.heroes['a'] = {};
	game.heroes['b'] = {};
	for (var i = 0; i < game.heroBases.length; i++) {
		var newHero = new game.hero(game.heroBases[i]);
		game.heroes[newHero.team][newHero.id] = newHero;
		newHero.setImages();
		newHero.print();
	}
  game.state.bind_events();

  game.state.print_preview();
}

var map1 = {
  '9,0':{t:'t',}
}
