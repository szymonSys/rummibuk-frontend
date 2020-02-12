const keys = { founderKey: "ovhrvhr0vh", gameKey: "wpcvhgwpv98hv9" };

const gamesData = {
  games: [
    {
      name: "Moja Gra",
      founderName: "szymon",
      slots: 4,
      hasPassword: false,
      type: "multiplayer",
      state: "init",
      key: "Ou87fO&8h78hpUHi7scnoG",
      playersData: [
        {
          name: "szymon",
          id: 1,
          blocksQuantity: 0
        },
        {
          name: "karol",
          id: 2,
          blocksQuantity: 0
        }
      ]
    },
    {
      name: "Giereczka",
      founderName: "magda",
      slots: 3,
      hasPassword: true,
      type: "multiplayer",
      state: "init",
      key: "OhiuhUJOIJuhnoG",
      playersData: [
        {
          name: "magda",
          id: 1,
          blocksQuantity: 0
        },
        {
          name: "darek",
          id: 2,
          blocksQuantity: 0
        }
      ]
    }
  ]
};

export default class GameAPI {
  static create(
    gameName,
    founderName,
    type,
    callback,
    slots = 4,
    password = null
  ) {
    return new Promise((resolve, reject) => {
      resolve(keys);
    });
  }

  static getAvailable() {
    return new Promise((resolve, reject) => {
      resolve(gamesData);
    });
  }

  static join(playerName, playerType, gameKey, gamePassword) {
    return new Promise((resolve, reject) => {
      resolve(keys);
    });
  }
}
