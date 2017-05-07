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

if (document.fullscreenEnabled) {
	requestFullscreen(document.documentElement);
}

$(document).ready(function() {
  draw_map();
  document.oncontextmenu = function() {return false;};

  $(document).mousedown(function(e){
    if( e.button == 2 ) {
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

  game.state.bind_events();

  game.state.print_preview();

  return;
  var radius = hex_ring(8, 6, 3);
  console.log(radius);
  for (var i = 0; i < radius.length; i++) {
    $('#'+radius[i]).addClass('reacheable');
  }

  //$('#tablero').animate({ scrollTop: $('#tablero')[0].scrollHeight});
});

// Draw the map of Hexagons into the div map
function draw_map() {
  hex_width = 74;
  hex_tiles = "";
  row_type = 1;
  hex_offset = 15;
  offset= ((game.mapsize_x/2)*(hex_width-hex_offset));
  console.log(offset);
  z_index=game.mapsize_x;
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
      hex_tiles +='<span class="hex_coords">'+x+','+y+'</span>';
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
}

var map1 = {
  '9,0':{t:'t',}
}
