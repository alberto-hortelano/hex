

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
for (x=0; x  < game.mapsize_x; x++) {
  for (y=0; y < game.mapsize_y; y++) {
    var hasTree = getRandomInt(0,100);
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
/*
game.mapArray[15][13] = new hexer.hex({blocked:true,classes:["wall"]});
game.mapArray[16][13] = new hexer.hex({blocked:true,classes:["wall"]});
game.mapArray[17][13] = new hexer.hex({blocked:true,classes:["wall"]});
game.mapArray[18][13] = new hexer.hex({blocked:true,classes:["wall"]});
game.mapArray[19][13] = new hexer.hex({blocked:true,classes:["wall"]});
game.mapArray[20][13] = new hexer.hex({blocked:true,classes:["wall"]});
game.mapArray[15][10] = new hexer.hex({blocked:true,classes:["wall"]});
game.mapArray[15][11] = new hexer.hex({blocked:true,classes:["wall"]});
game.mapArray[15][12] = new hexer.hex({blocked:true,classes:["wall"]});


game.mapArray[9][2] = new hexer.hex({blocked:true,classes:["tree","tree_1"]});
game.mapArray[9][4] = new hexer.hex({blocked:true,classes:["tree","tree_1"]});
game.mapArray[7][8] = new hexer.hex({blocked:true,classes:["tree","tree_2"]});
game.mapArray[12][6] = new hexer.hex({blocked:true,classes:["tree","tree_3"]});
game.mapArray[12][5] = new hexer.hex({blocked:true,classes:["tree","tree_1"]});
game.mapArray[13][6] = new hexer.hex({blocked:true,classes:["tree","tree_3"]});
game.mapArray[13][4] = new hexer.hex({blocked:true,classes:["tree","tree_1"]});
game.mapArray[14][4] = new hexer.hex({blocked:true,classes:["tree","tree_1"]});
game.mapArray[5][11] = new hexer.hex({blocked:true,classes:["tree","tree_3"]});
game.mapArray[3][12] = new hexer.hex({blocked:true,classes:["tree","tree_1"]});
game.mapArray[3][10] = new hexer.hex({blocked:true,classes:["tree","tree_2"]});
game.mapArray[0][6] = new hexer.hex({blocked:true,classes:["tree","tree_2"]});
*/
