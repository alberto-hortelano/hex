game.chars = {
  warrior: {
    damage: 1,
    hp: 3,
    mov: 3,
    armor: {
      hp: 1,
      mov: 0
    },
    weapons: {
      hand: {
        damage: 1
      }
    }
  },
  archer: {
    damage: 1,
    hp: 3,
    mov: 3,
    armor: {
      hp: 0,
      mov: 0
    },
    weapons: {
      hand: {
        damage: 0
      },
      shoot: {
        damage: 2,
        range: 10
      }
    }
  }
};
