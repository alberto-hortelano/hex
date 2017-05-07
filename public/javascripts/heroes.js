
game.hero = function (args) {
  var this_hero = this;
  this.id = Date.now();
  this.hex = game.state.hex;
  this.$hex = game.state.$hex;
  this.combat = parseInt(args.combat || 7);
  this.mov = parseInt(args.mov || 7);
  this.mov_left = this.mov;
  this.main = parseInt(args.main || 0);
  this.sec = parseInt(args.sec || 0);
  this.range = parseInt(args.range || 0);
  this.armor = parseInt(args.armor || 0);
  this.head = parseInt(args.head || 1);
  this.orientation = parseInt(args.orientation || 0);
  this.gender = args.gender || 'hero'; // hero || heroine
  this.team = args.team || game.state.turn;
  this.images = [];
  this.charge = 0;

  this.attack = function (target) {
    target.orientation = hexer.orientation(target.hex, this_hero.hex);
    this_hero.orientation = hexer.orientation(this_hero.hex, target.hex);
    this_hero.print();
    target.print();
    var wp_damage = 0;
    switch (this_hero.main) {
      case 4:
        wp_damage = 6;
        break;
      default:
        wp_damage = this_hero.main + 1;
    }
    this_hero.$hex.addClass('attack');
    setTimeout(function(){
      this_hero.$hex.removeClass('attack');
      console.log('attack',this_hero.combat , wp_damage , this_hero.charge);
      target.resist(this_hero.combat + wp_damage + this_hero.charge + 2);
    },600);
  };
  this.resist = function (damage) {
    var received = damage - this_hero.combat - this_hero.armor - this_hero.sec;
    console.log('received',received,damage,- this_hero.combat - this_hero.armor - this_hero.sec);
    while (received > 0) {
      if (this_hero.combat > this_hero.mov) {
        this_hero.combat--;
      } else {
        this_hero.mov--;
      }
      received--;
    }
    this_hero.$hex.find('.combat').css('border-left-width', this_hero.combat * 5);
    this_hero.$hex.find('.mov').css('border-left-width', this_hero.mov * 5);
    console.log(this_hero.combat,this_hero.mov);
  };
  this.show_move = function() {
    $('.hex.reacheable').removeClass('reacheable');
    hexer.movimento_disponible(this_hero.mov_left, this_hero.hex);
    game.state.set_action({
      run: this_hero.move,
      name: 'this_hero.move',
      args: {
        from: game.state.hex
      }
    });
  };
  this.adjacent = function (hex) {
    var adjacents = hexer.adjacents(this_hero.hex, true);
    for (var i = 0; i < adjacents.length; i++) {
      if (adjacents[i].x === hex.x && adjacents[i].y === hex.y) {
        return true;
      }
    }
    return false;
  };
  this.move = function(args) {
    var hex = game.state.hex;
    var $hex = game.state.$hex;
    if ($hex.hasClass('reacheable')) {
      $('.hex.reacheable').removeClass('reacheable');
      var path = hexer.path(args.from, hex);
      if(path.length) {
        game.state.clear_action();
        this_hero.clear();
        this_hero.hex = hex;
        this_hero.$hex = $hex;
        this_hero.mov_left -= parseInt($hex.children('.hex_caption').children('.steps').text());
        game.world.draw_path(path);
        this_hero.charge = (path.length > 3)? path.length - 3: 0;
        this_hero.orientation = hexer.orientation(path[path.length - 2], hex);
        this_hero.print();
      }
      game.state.set_hero(this_hero);
    }else{
      game.state.clear_action();
    }
  };
  this.calc_move = function () {
    this_hero.charge = 0;
    this_hero.mov_left = this_hero.mov - this_hero.armor - +(this_hero.main > 2) - +(this_hero.sec > 1);
  };
  this.shoot_targets = function () {
    /*
      con hex_ring de hex.js
      hace un anillo a distancia - 1 y se meten los hex que coinciden con anillo a distancia 1 de target
      y va creciendo lo distancia de target y decreciendo la de origen.
    */
  };
  this.setImages = function () {
    this_hero.images.push(game.layers.getBG(game.layers.main[this_hero.main],this_hero.gender));
    if (this_hero.sec > 0) this_hero.images.push(game.layers.getBG(game.layers.sec[this_hero.sec],this_hero.gender));
    this_hero.images.push(game.layers.getBG(game.layers.armor[this_hero.armor],this_hero.gender));
    if (this_hero.head > 0) this_hero.images.push(game.layers.getBG(game.layers.head[this_hero.head],this_hero.gender));
  };
  this.print = function () {
    console.log(this_hero.hex);
    game.mapArray[this_hero.hex.x][this_hero.hex.y].hero = this_hero;
    this_hero.$hex.addClass('hero team_'+this.team).find('.hex_caption').css('background-image', this_hero.images.join(','));
    this_hero.$hex.find('.combat').css('border-left-width', this_hero.combat * 5);
    this_hero.$hex.find('.mov').css('border-left-width', this_hero.mov * 5);
    this_hero.$hex.find('.hex_caption').css('background-position-y', game.world.get_orientation(this_hero.orientation)-30);
  };
  this.clear = function () {
    game.mapArray[this_hero.hex.x][this_hero.hex.y].hero = false;
    this_hero.$hex.removeClass('hero active_hero team_a team_b').find('.hex_caption').css('background-image', '');
  };
  this.calc_move();
  return this;
};
game.layers = {
  armor: ['clothes','leather_armor','steel_armor','great_armor'],
  head: [null,'z_head1','z_head2','z_head3'],
  main: ['dagger','shortsword','longsword','greatsword','greataxe'],
  sec: [null, 'buckler','shield'],
  getBG: function (img,gender) {
    if (typeof img === 'string') return 'url("/images/'+gender+'/'+img+'.png")';
  }
};
game.heroBases = {
  a: {
    h1: {
      mov: 3,
      main: 3,
      sec: 2,
      armor: 0,
      gender: 'hero',
      head: 1,
    },
    h2: {
      mov: 4,
      main: 1,
      sec: 1,
      armor: 0,
      gender: 'heroine',
      head: 1,
    },
    h3: {
      main: 2,
      sec: 0,
      armor: 2,
      gender: 'hero',
      head: 2,
    }
  },
  b: {
    h1: {
      attack: 5,
      defense: 3,
      mov: 4,
      mov_left: 4,
      main: 1,
      sec: 2,
      range: 3,
      armor: 0,
      shield: 2
    },
    h2: {
      attack: 5,
      defense: 3,
      mov: 4,
      mov_left: 4,
      main: 1,
      sec: 2,
      range: 3,
      armor: 0,
      shield: 2
    },
    h3: {
      attack: 5,
      defense: 3,
      mov: 4,
      mov_left: 4,
      main: 1,
      sec: 2,
      range: 3,
      armor: 0,
      shield: 2
    }
  }
};
