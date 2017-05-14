
game.hero = function (args) {
  var this_hero = this;
  this.id = Math.floor((Math.random() * 10000000) + 1);
  this.hex = args.hex || game.state.hex;
  this.$hex = args.$hex || (args.hex !== undefined)? $('#'+args.hex.x+'_'+args.hex.y): game.state.$hex;
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
  this.origin = this.hex;
  this.ko = false;
  this.attack = function (target) {
    target.orientation = hexer.orientation(target.hex, this_hero.hex);
    this_hero.orientation = hexer.orientation(this_hero.hex, target.hex);
    this_hero.print();
    target.print();
    var extra_damage = 0;
    var charge = Math.max(0,hexer.min_path(this_hero.origin,target.hex) - 4);
    switch (this_hero.main) {
      case 4:
        extra_damage = 1 + charge;
        break;
      default:
        extra_damage = Math.floor(charge/2);
    }
    var enemies = hexer.adjacents(this_hero.hex, 'enemies').length - 1;
    console.log('enemies',enemies,extra_damage);
    extra_damage -= enemies;
    this_hero.$hex.addClass('attack');
    this.origin = this.hex;
    setTimeout(function(){
      this_hero.$hex.removeClass('attack');
      console.log('attack',this_hero.combat + this_hero.main , extra_damage, enemies , charge);
      target.resist(this_hero.combat + this_hero.main + extra_damage,this_hero);
    },600);
  };
  this.resist = function (damage,attacker) {
    var factor = 2;
    var received = Math.round(10 * (damage + factor) / (this_hero.combat + this_hero.armor + this_hero.sec + factor));
    received -= 7;
    var enemies = hexer.adjacents(this_hero.hex, 'enemies').length - 1;
    console.log('enemies',enemies);
    received += enemies;
    console.log('received',received,damage, this_hero.combat + this_hero.armor + this_hero.sec);
    while (received > 0) {
      if (this_hero.mov > this_hero.combat) {
        this_hero.mov--;
      } else {
        this_hero.combat--;
      }
      received--;
    }
    if (this_hero.mov < 1) {
      this_hero.fall();
      attacker.show_move();
    }
    this_hero.calc_move();
    this_hero.$hex.find('.combat').css('border-left-width', Math.max(0,this_hero.combat * 5));
    this_hero.$hex.find('.mov').css('border-left-width', Math.max(0,this_hero.mov * 5));
  };
  this.fall = function () {
    this_hero.ko = true;
    this_hero.$hex.addClass('fall');
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
        this_hero.orientation = hexer.orientation(path[path.length - 2], hex);
        this_hero.print();
      }
      game.state.set_hero(this_hero);
    }else{
      game.state.clear_action();
    }
  };
  this.new_turn = function () {
    this_hero.origin = this_hero.hex;
    this_hero.calc_move();
  }
  this.calc_move = function () {
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
    console.log(this_hero);
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
game.heroBases = [
  {
    team: 'a',
    hex: {x:12,y:6},
    main: 3,
    sec: 2,
    armor: 3,
    orientation: 5
  },{
    team: 'a',
    hex: {x:13,y:5},
    main: 3,
    sec: 2,
    armor: 3,
    orientation: 5
  },{
    team: 'a',
    hex: {x:14,y:4},
    main: 3,
    sec: 2,
    armor: 3,
    orientation: 5
  },{
    team: 'a',
    hex: {x:11,y:7},
    main: 3,
    sec: 2,
    armor: 3,
    orientation: 5
  },{
    team: 'b',
    hex: {x:18,y:10},
    main: 2,
    sec: 2,
    armor: 3,
    orientation: 3
  },{
    team: 'b',
    hex: {x:17,y:11},
    main: 4,
    sec: 0,
    armor: 0,
    orientation: 3
  },{
    team: 'b',
    hex: {x:16,y:12},
    main: 2,
    sec: 2,
    armor: 2,
    orientation: 3
  },{
    team: 'b',
    hex: {x:15,y:13},
    main: 3,
    sec: 2,
    armor: 1,
    orientation: 3
  }
];
