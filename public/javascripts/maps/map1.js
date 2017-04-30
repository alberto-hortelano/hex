

for (x=0; x  < game.mapsize_x; x++) {
  for (y=0; y < game.mapsize_y; y++) {
    game.mapArray[x][y] = ["hex_green"];
  }
}
game.mapArray[15][13] = ["blocked","wall"];
game.mapArray[16][13] = ["blocked","wall"];
game.mapArray[17][13] = ["blocked","wall"];
game.mapArray[18][13] = ["blocked","wall"];
game.mapArray[19][13] = ["blocked","wall"];
game.mapArray[20][13] = ["blocked","wall"];
game.mapArray[15][10] = ["blocked","wall"];
game.mapArray[15][11] = ["blocked","wall"];
game.mapArray[15][12] = ["blocked","wall"];

game.mapArray[9][2] = ["blocked","tree","tree_1"];
game.mapArray[9][4] = ["blocked","tree","tree_1"];
game.mapArray[7][8] = ["blocked","tree","tree_2"];
game.mapArray[12][6] = ["blocked","tree","tree_3"];
game.mapArray[12][5] = ["blocked","tree","tree_1"];
game.mapArray[5][11] = ["blocked","tree","tree_3"];
game.mapArray[3][12] = ["blocked","tree","tree_1"];
game.mapArray[3][10] = ["blocked","tree","tree_2"];
game.mapArray[0][6] = ["blocked","tree","tree_2"];

game.mapArray[12][10] = ["blocked","dead"];
game.mapArray[11][10] = ["blocked","dead"];
game.mapArray[7][11] = ["blocked","dead"];
game.mapArray[5][10] = ["blocked","dead"];
