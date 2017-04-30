var game = {
  state: {
    turn: 'a',
    action: false,
    hex: false,
    $hex: false,
    hero: false,
    set_action: function(action) {
      console.log(game.state.action.name, action.name);
      if (game.state.action.name === action.name) {
        game.state.clear_action();
      } else {
        game.state.action = action;
        $('#action').text(game.state.action.name);
        console.log('set_action: ',game.state.action.name);
      }
    },
    clear_action: function() {
      console.log('clear_action: ',game.state.action.name);
      game.state.action = false;
      $('#action').text('_______');
      $('.hex.reacheable').removeClass('reacheable');
    },
    run_action: function() {
      if(game.state.action !== false){
        console.log('run_action: ',game.state.action.name);
        game.state.action.run(game.state.action.args);
        //console.log(game.getMap());
      }
    },
    load_chars: function() {
      var heroes_cards = '';
      for (var team in game.heroBases) {
        heroes_cards += `<div class="team ${team}">`
        for (var hero in game.heroBases[team]) {
          var h = new game.hero(game.heroBases[team][hero]);
          h.setImages();
          var bgs = h.images.join(',');
          heroes_cards += `
            <div class="hero ${hero}" data-hero_id="${hero}">
              <h2>${hero}</h2>
              <div class="hero_preview" style='background-image: ${bgs}'></div>
              <div class="hero_button attack">Attack</div>
              <div class="hero_button move">Move</div>
            </div>`;
        }
        heroes_cards += '</div>';
      }
      $('#heroes').append(heroes_cards);
    },
    bind_events: function(){
      $('.hex_caption').click(function() {
        game.state.$hex = $(this).parent();
        var id = game.state.$hex.attr('id').split('_');
        var $hex = game.state.$hex;
        game.state.hex = {x:parseInt(id[0]), y:parseInt(id[1])};
        if ($hex.hasClass('hero')){
          game.state.hero = game.mapArray[game.state.hex.x][game.state.hex.y].hero;
          console.log(game.state.hero);
          game.state.hero.show_move();
        } else if (game.state.action !== false){
          game.state.run_action();
        }else{
          game.state.clear_action();
        }
      });
      $('#heroes').on('click','.hero',function() {
        $('#mandos').removeClass('visible');
        game.state.set_action({
          run: game.world.drop_hero,
          name: 'game.world.drop_hero',
          args: game.heroBases[game.state.turn][$(this).data('hero_id')]
        });
      });
      $('#next_turn').on('click',function() {
        $('#action').text('next_turn');
        for (var hero in game.heroes[game.state.turn]) {
          console.log(hero);
          if (game.heroes[game.state.turn].hasOwnProperty(hero)) {
            game.heroes[game.state.turn][hero].mov_left = game.heroes[game.state.turn][hero].mov;
          }
        }
        game.state.turn = game.state.turn === 'a'?'b':'a';
      });
    }
  },

  world: {
    drop_hero: function(args) {
      console.log(args);
      var hex = game.state.hex;
      var $hex = game.state.$hex;
      var newHero = new game.hero(args);
      game.heroes[game.state.turn][newHero.id] = newHero;
      newHero.setImages();
      newHero.print();
      //$hex.addClass('blocked hero hero-'+game.state.turn+' hero-'+args.hero_id);
      game.state.set_action({
        run: newHero.show_move,
        name: 'newHero.show_move',
        args: {
          from: hex
        }
      });
    },
    draw_path: function(path){
      for (var i = 0; i < path.length; i++) {
        var $hex = $('#'+path[i].x+'_'+path[i].y);
        $hex.addClass('path');
        (function($hex){
          setTimeout(function(){
            $hex.removeClass('path');
          },i*100 + 100);
        })($hex);
      }
    }
  },

  heroes: {
    a: {

    },
    b: {

    }
  },

  // Setup Hexagon Map
  mapsize_x: 30,
  mapsize_y: 30,

  mapArray: hexer.MultiDimensionalArray(30,30),

  getMap: function (search) {
    if (search === undefined) {
      search = ["hex_green"];
    }
    var response = [];
    for (x=0; x  < game.mapsize_x; x++) {
      for (y=0; y < game.mapsize_y; y++) {
        var hasAll = true;
        var cell = game.mapArray[x][y];
        for (var i = 0; i < search.length; i++) {
          if (!cell.indexOf(search[i])) {
            hasAll = false;
            continue;
          }
        }
        if (hasAll) {
          response.push(cell);
        }
      }
    }
    return response;
  }

}
