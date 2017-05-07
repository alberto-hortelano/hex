var game = {
  state: {
    turn: 'a',
    action: false,
    hex: false,
    $hex: false,
    hero: false,
    set_action: function(action) {
      console.log(game.state.action.name, action.name);
      game.state.action = action;
      $('#action').text(game.state.action.name);
      console.log('set_action: ',game.state.action.name);
    },
    clear_action: function() {
      console.log('clear_action: ',game.state.action.name);
      game.state.action = false;
      $('#action').text('_______');
    },
    run_action: function() {
      if(game.state.action !== false){
        console.log('run_action: ',game.state.action.name);
        game.state.action.run(game.state.action.args);
        //console.log(game.getMap());
      }
    },
    set_hero: function(hero) {
      if (game.heroes[game.state.turn][hero.id] !== undefined) { // Clicked same team hero
        game.state.clear_hero();
        game.state.hero = hero;
        game.state.hero.show_move();
        hero.$hex.addClass('active_hero');
      }
    },
    clear_hero: function() {
      if(game.state.hero !== false) game.state.hero.$hex.removeClass('active_hero');
      $('.hex.reacheable').removeClass('reacheable');
      game.state.hero = false;
    },
    print_preview: function() {
      var args = {};
      var $inputs = $('#heroes .stats input,#heroes .stats select');
      $inputs.each(function () {
        args[$(this).attr('id')] = $(this).val();
      });
      args.orientation = $('#orientation').val();
      var newHero = new game.hero(args);
      newHero.setImages();
      $('#heroes .hero_preview').css('background-image', newHero.images.join(','));
      return args;
    },
    bind_events: function(){
      $('#tablero').addClass('turn_'+game.state.turn);
      $('.hex_caption').click(function() {
        game.state.$hex = $(this).parent();
        var id = game.state.$hex.attr('id').split('_');
        var $hex = game.state.$hex;
        game.state.hex = {x:parseInt(id[0]), y:parseInt(id[1])};
        if ($hex.hasClass('hero')){
          var targetHero = game.mapArray[game.state.hex.x][game.state.hex.y].hero;
          if (game.heroes[game.state.turn][targetHero.id] !== undefined) { // Clicked same team hero
            game.state.set_hero(targetHero);
          } else if (game.state.hero) { // Clicked other team hero
            if (game.state.hero.adjacent(game.state.hex)) {
              game.state.hero.attack(targetHero);
              console.log('ATTACK!!!');
            }
          }
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
          name: 'game.world.drop_hero'
        });
      });
      $('#next_turn').on('click',function() {
        $('#action').text('next_turn');
        for (var hero in game.heroes[game.state.turn]) {
          if (game.heroes[game.state.turn].hasOwnProperty(hero)) {
            game.heroes[game.state.turn][hero].calc_move();
          }
        }
        var turn_ant = game.state.turn;
        game.state.turn = game.state.turn === 'a'?'b':'a';
        game.state.clear_hero();
        $(this).text('Turn: '+game.state.turn.toUpperCase());
        $('#tablero').removeClass('turn_'+turn_ant).addClass('turn_'+game.state.turn);
      });
      $('#heroes .stats select').change(game.state.print_preview);
      $('#orientation').on('input',function () {
        $('#heroes .hero_preview').css('background-position-y', game.world.get_orientation(parseInt($(this).val()),192));
      });
    }
  },

  world: {
    drop_hero: function() {
      var args = game.state.print_preview();
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
    },
    get_orientation: function (val, step) {
      step = step || 128;
      var orientation = 0;
      switch (val) {
        case 1:
          orientation = step * 6;
          break;
        case 2:
          orientation = step * 7;
          break;
        case 3:
          orientation = step * 1;
          break;
        case 4:
          orientation = step * 2;
          break;
        case 5:
          orientation = step * 3;
          break;
        case 6:
          orientation = step * 5;
          break;
        default:
          orientation = step * 6;
      }
      return orientation;
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
