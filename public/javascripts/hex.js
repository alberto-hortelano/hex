var hexer = {
  hex: function (args) {
    if (!args) {
      args = {};
    }
    var this_hex = this;
    this.blocked = args.blocked || false;
    this.hero = args.hero || false;
    this.bg = args.bg || "hex_green";
    this.classes = args.classes || [];
    this.getClass = function () {
      var classes = this_hex.classes;
      classes.push(this_hex.bg);
      if (this_hex.blocked) classes.push('blocked');
      return classes.join(' ');
    }
    return this;
  },
  // function found on developerfusion.com
  MultiDimensionalArray: function (iRows,iCols) {
    var i;
    var j;
    var a = new Array(iRows);
    for (i=0; i < iRows; i++) {
      a[i] = new Array(iCols);
      for (j=0; j < iCols; j++) {
        a[i][j] = "";
      }
    }
    return(a);
  },

  accessible: function (x,y) {
    return !game.mapArray[x][y].blocked && !game.mapArray[x][y].hero;
  },

  distance: function (x1,y1,x2,y2) {
    dx = Math.abs(x1-x2);
    dy = Math.abs(y2-y1);
    return Math.sqrt((dx*dx) + (dy*dy));
    //dx = Math.abs(x1-x2);
    //dy = Math.abs(y1-y2);
    //return dx + dy;
  },

  getRandomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  hex_ring: function (x, y, radius){
    var results = [];
    var r = radius;
    while(r > 0){ // 1
      results.push(x + r +'_'+ (y + radius - r) );
      r--;
    }
    r = radius;
    while(r > 0){ // 2
      results.push(x + r - radius +'_'+ (y + radius) );
      r--;
    }
    r = radius;
    while(r > 0){ // 3
      results.push(x - radius +'_'+ (y + r) );
      r--;
    }
    r = radius;
    while(r > 0){ // 4
      results.push(x - r +'_'+ (y + r - radius));
      r--;
    }
    r = radius;
    while(r > 0){ // 5
      results.push(x - r + radius +'_'+ (y - radius));
      r--;
    }
    r = radius;
    while(r > 0){ // 6
      results.push(x + radius +'_'+ (y - r));
      r--;
    }
    return results;
  },

  // A* Pathfinding with Manhatan Heuristics for Hexagons.
  path: function (from, to) {
    // Check cases path is impossible from the start.
    var error=0;
    if(from.x == to.x && from.y == to.y) error=1;
    //if(!hexer.accessible(from.x,from.y)) error=1;
    if(!hexer.accessible(to.x,to.y)) error=1;
    if(error==1) {
      $('#message').text('Path is impossible to create.');
      return false;
    }

    // Init
    var openlist = new Array(game.mapsize_x*game.mapsize_y+2);
    var openlist_x = new Array(game.mapsize_x);
    var openlist_y = new Array(game.mapsize_y);
    var statelist = hexer.MultiDimensionalArray(game.mapsize_x+1,game.mapsize_y+1); // current open or closed state
    var openlist_g = hexer.MultiDimensionalArray(game.mapsize_x+1,game.mapsize_y+1);
    var openlist_f = hexer.MultiDimensionalArray(game.mapsize_x+1,game.mapsize_y+1);
    var openlist_h = hexer.MultiDimensionalArray(game.mapsize_x+1,game.mapsize_y+1);
    var parent_x = hexer.MultiDimensionalArray(game.mapsize_x+1,game.mapsize_y+1);
    var parent_y = hexer.MultiDimensionalArray(game.mapsize_x+1,game.mapsize_y+1);
    var path = hexer.MultiDimensionalArray(game.mapsize_x*game.mapsize_y+2,2);

    var select_x = 0;
    var select_y = 0;
    var node_x = 0;
    var node_y = 0;
    var counter = 1; // Openlist_ID counter
    var selected_id = 0; // Actual Openlist ID

    // Add start coordinates to openlist.
    openlist[1] = true;
    openlist_x[1] = from.x;
    openlist_y[1] = from.y;
    openlist_f[from.x][from.y] = 0;
    openlist_h[from.x][from.y] = 0;
    openlist_g[from.x][from.y] = 0;
    statelist[from.x][from.y] = true;

    // Try to find the path until the target coordinate is found
    while (statelist[to.x][to.y] != true) {
      set_first = true;
      // Find lowest F in openlist
      for (var i in openlist) {
        if(openlist[i] == true){
          select_x = openlist_x[i];
          select_y = openlist_y[i];
          if(set_first == true) {
            lowest_found = openlist_f[select_x][select_y];
            set_first = false;
          }
          if (openlist_f[select_x][select_y] <= lowest_found) {
            lowest_found = openlist_f[select_x][select_y];
            lowest_x = openlist_x[i];
            lowest_y = openlist_y[i];
            selected_id = i;
          }
        }
      }
      if(set_first==true) {
        // open_list is empty
        $('#message').text('No possible route can be found.');
        return false;
      }
      // add it lowest F as closed to the statelist and remove from openlist
      statelist[lowest_x][lowest_y] = 2;
      openlist[selected_id]= false;
      // Add connected nodes to the openlist
      for(i=1;i<7;i++) {
        // Run node update for 6 neighbouring tiles.
        switch(i){
          case 1:
            node_x = lowest_x-1;
            node_y = lowest_y;
          break;
          case 2:
            node_x = lowest_x;
            node_y = lowest_y-1;
          break;
          case 3:
            node_x = lowest_x+1;
            node_y = lowest_y-1;
          break;
          case 4:
            node_x = lowest_x+1;
            node_y = lowest_y;
          break;
          case 5:
            node_x = lowest_x;
            node_y = lowest_y+1;
          break;
          case 6:
            node_x = lowest_x-1;
            node_y = lowest_y+1;
          break;
        }
        if (hexer.accessible([node_x],[node_y])) {
          if(statelist[node_x][node_y] == true) {
            if(openlist_g[node_x][node_y] < openlist_g[lowest_x][lowest_y]) {
              parent_x[lowest_x][lowest_y] = node_x;
              parent_y[lowest_x][lowest_y] = node_y;
              openlist_g[lowest_x][lowest_y] = openlist_g[node_x][node_y] + 10;
              openlist_f[lowest_x][lowest_y] = openlist_g[lowest_x][lowest_y] + openlist_h[lowest_x][lowest_y];
            }
          } else if (statelist[node_x][node_y] == 2) {
            // its on closed list do nothing.
          } else {
            counter++;
            // add to open list
            openlist[counter] = true;
            openlist_x[counter] = node_x;
            openlist_y[counter] = node_y;
            statelist[node_x][node_y] = true;
            // Set parent
            parent_x[node_x][node_y] = lowest_x;
            parent_y[node_x][node_y] = lowest_y;
            // update H , G and F
            var ydist = to.y - node_y;
            if ( ydist < 0 ) ydist = ydist*-1;
            var xdist = to.x - node_x;
            if ( xdist < 0 ) xdist = xdist*-1;
            openlist_h[node_x][node_y] = hexer.distance(node_x,node_y,to.x,to.y) * 10;
            openlist_g[node_x][node_y] = openlist_g[lowest_x][lowest_y] + 10;
            openlist_f[node_x][node_y] = openlist_g[node_x][node_y] + openlist_h[node_x][node_y];
          }
        }
      }
    }

    // Get Path
    temp_x=to.x;
    temp_y=to.y;
    counter = 0;
    while(temp_x != from.x || temp_y != from.y) {
      counter++;
      path[counter][1] = temp_x;
      path[counter][2] = temp_y;
      temp_x = parent_x[path[counter][1]][path[counter][2]];
      temp_y = parent_y[path[counter][1]][path[counter][2]];
    }
    counter++;
    path[counter][1] = from.x;
    path[counter][2] = from.y;

    // Draw path.
    var total = counter;
    var fullPath = [];
    while(counter!=0) {
      fullPath.push({x: path[counter][1], y:path[counter][2]});
      //$elem.addClass('path');
      counter--;
      //console.log((total - counter)*200);
      /*
      (function($elem){
        setTimeout(function(){
          $elem.removeClass('path');
        },(total - counter)*100 + 100);
      })($elem);
      */
    }
    return fullPath;
  }
};