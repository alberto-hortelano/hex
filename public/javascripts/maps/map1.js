

for (x=0; x  < game.mapsize_x; x++) {
  for (y=0; y < game.mapsize_y; y++) {
    game.mapArray[x][y] = new hexer.hex();
  }
}
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
game.mapArray[5][11] = new hexer.hex({blocked:true,classes:["tree","tree_3"]});
game.mapArray[3][12] = new hexer.hex({blocked:true,classes:["tree","tree_1"]});
game.mapArray[3][10] = new hexer.hex({blocked:true,classes:["tree","tree_2"]});
game.mapArray[0][6] = new hexer.hex({blocked:true,classes:["tree","tree_2"]});

game.mapArray[12][10] = new hexer.hex({blocked:true,classes:["dead"]});
game.mapArray[11][10] = new hexer.hex({blocked:true,classes:["dead"]});
game.mapArray[7][11] = new hexer.hex({blocked:true,classes:["dead"]});
game.mapArray[5][10] = new hexer.hex({blocked:true,classes:["dead"]});
