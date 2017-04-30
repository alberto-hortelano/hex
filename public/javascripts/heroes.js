
/*
  attack: 5,
  defense: 3,
  mov: 4,
  main: 1,
  sec: 2,
  range: 3,
  armor: 0,
  shield: 2,
  mov_left: 4,
  gender: 1,
  head: 1,
 */
game.hero = function (args) {
  var this_hero = this;
  this.id = Date.now();
  this.hex = game.state.hex;
  this.$hex = game.state.$hex;
  this.attack = args.attack || 3;
  this.defense = args.defense || 3;
  this.mov = args.mov || 7;
  this.mov_left = this.mov;
  this.main = args.main || 0;
  this.sec = args.sec || 0;
  this.range = args.range || 0;
  this.armor = args.armor || 0;
  this.gender = args.gender || 'hero';
  this.head = args.head || 1;
  this.images = [];
  this.show_move = function() {
    hexer.movimento_disponible(this_hero.mov_left, this_hero.hex);
    game.state.set_action({
      run: this_hero.move,
      name: 'this_hero.move',
      args: {
        from: game.state.hex
      }
    });
  };
  this.move = function(args) {
    var hex = game.state.hex;
    var $hex = game.state.$hex;
    if ($hex.hasClass('reacheable')) {
      var path = hexer.path(args.from, hex);
      if(path.length) {
        game.state.clear_action();
        this_hero.clear();
        this_hero.hex = hex;
        this_hero.$hex = $hex;
        this_hero.mov_left -= path.length-1;
        game.world.draw_path(path);
        this_hero.print();
      }
    }else{
      game.state.clear_action();
    }
  };
  this.shoot_targets = function () {
    /*
      con hex_ring de hex.js
      hace un anillo a distancia - 1 y se meten los hex que coinciden con anillo a distancia 1 de target
      y va creciendo lo distancia de target y decreciendo la de origen.
    */
  };
  this.setImages = function () {
    this_hero.images.push(game.layers.getBG(game.layers.armor[this.armor],this_hero.gender));
    this_hero.images.push(game.layers.getBG(game.layers.head[this.head],this_hero.gender));
    this_hero.images.push(game.layers.getBG(game.layers.main[this.main],this_hero.gender));
    this_hero.images.push(game.layers.getBG(game.layers.sec[this.sec],this_hero.gender));
  };
  this.print = function () {
    console.log(this_hero.hex);
    game.mapArray[this_hero.hex.x][this_hero.hex.y].hero = this_hero;
    this_hero.$hex.addClass('hero').find('.hex_caption').css('background-image', this_hero.images.join(','));
  };
  this.clear = function () {
    game.mapArray[this_hero.hex.x][this_hero.hex.y].hero = false;
    this_hero.$hex.removeClass('hero').find('.hex_caption').css('background-image', '');
  };
  return this;
};
game.layers = {
  armor: ['clothes','leather_armor','steel_armor'],
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
      main: 3,
      sec: 2,
      armor: 0,
      gender: 'hero',
      head: 1,
    },
    h2: {
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
