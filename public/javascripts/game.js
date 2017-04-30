var game = {
  state: {
    turn: 'a',
    action: false,
    hex: false,
    $hex: false,
    hero: false,
    set_action: function(action) {
      game.state.action = action;
      console.log('set_action: ',game.state.action.name);
    },
    clear_action: function() {
      game.state.action = false;
      $('.hex.reacheable').removeClass('reacheable');
    },
    run_action: function() {
      if(game.state.action !== false){
        console.log('run_action: ',game.state.action.name);
        game.state.action.run(game.state.action.args);
        console.log(game.getMap());
      }
    },
    load_chars: function() {
      var heroes_cards = '';
      for (var team in game.heroBases) {
        heroes_cards += `<div class="team ${team}">`
        for (var heroe in game.heroBases[team]) {
          heroes_cards += `
            <div class="hero ${heroe}" data-hero_id="${heroe}">
              <h2>${heroe}</h2>
              <div class="hero_preview"></div>
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
        if(game.state.action !== false){
          game.state.run_action();
        }else if($hex.hasClass('hero')){
          game.hero.show_move({radio: 3}, game.state.hex);
          game.state.set_action({
            run: game.hero.move,
            name: 'game.hero.move',
            args: {
              from: game.state.hex
            }
          });
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

      });
    }
  },

  world: {
    drop_hero: function(args) {
      var hex = game.state.hex;
      var $hex = game.state.$hex;
      var newHero = new game.hero(args, $hex);
      game.heroes[game.state.turn][newHero.id] = newHero;
      $hex.addClass('blocked hero hero-'+game.state.turn+' hero-'+args.hero_id);
      game.state.set_action({
        run: newHero.show_move,
        name: 'newHero.show_move',
        args: {
          from: hex
        }
      });
      return;
      $('.hex.reacheable').removeClass('reacheable');
      var hero = new game.hero();
      //var hero = game.heroes[game.state.turn][args.hero_id];
      $hex.addClass('blocked hero hero-'+game.state.turn+' hero-'+args.hero_id);
      hero.show_move({radio: 3}, $hex);
      game.state.set_action({
        run: hero.move,
        name: 'hero.move',
        args: {
          from: $hex
        }
      });
      var this_hero = $.extend({}, game.chars[args.hero_class]);
      this_hero.mov_left = this_hero.mov;
      game.heroes[game.state.turn][args.hero_id] = this_hero;
      console.log(game.heroes, $hex);
    },
    create_hero: function(){

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
