
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
game.hero = function (args, $hex) {
  var this_hero = this;
  this.id = Date.now;
  this.$hex = $hex;
  this.attack = args.attack;
  this.defense = args.defense;
  this.mov = args.mov;
  this.mov_left = args.mov;
  this.main = 1;
  this.sec = 2;
  this.range = 3;
  this.armor = 0;
  this.shield = 2;
  this.gender = 'hero';
  this.head = 1;
  this.images = [];
  this.show_move = function() {
    movimento_disponible(this_hero.mov_left, this_hero.$hex, true);
    game.state.set_action({
      run: this_hero.move,
      name: 'this_hero.move',
      args: {
        from: game.state.hex
      }
    });
  },
  this.move = function(args) {
    var hexx = game.state.hex;
    console.log(hexx);
    var $hex = game.state.$hex;
    if ($hex.hasClass('reacheable')) {
      var path = hexer.path(args.from, hexx);
      console.log('path',path);
      if(path.length) {
        game.state.clear_action();
        /*
        var classes = 'blocked hero';
        var chars_keys = Object.keys(game.chars);
        for (var i = 0; i < chars_keys.length; i++) {
          if(args.from.hasClass('hero-' + chars_keys[i])){
            classes += ' hero-' + chars_keys[i];
            break;
          }
        }
        args.from.removeClass(classes);
        $hex.addClass(classes);
        */
      }
    }else{
      game.state.clear_action();
    }
  },
  this.shoot_targets = function () {
    /*
      con hex_ring de hex.js
      hace un anillo a distancia - 1 y se meten los hex que coinciden con anillo a distancia 1 de target
      y va creciendo lo distancia de target y decreciendo la de origen.
    */
  },
  this.print = function () {
    var basePath = '/images/'+this.gender+'/';
    var armor = ['clothes','leather_armor','steel_armor'];
    var head = ['z_head1','z_head2','z_head3'];
    var main = ['dagger','shortsword','longsword','greatsword',];
    var getBG = function (img) {
      return 'url("'+basePath+img+'.png")';
    }
    this_hero.images.push(getBG())
  }
  return this;
};
game.heroBases = {
  a: {
    h1: {
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
