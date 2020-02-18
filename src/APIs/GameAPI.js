function handleFetch(url, method, requestData = null) {
  const options = {
    method,
    hearers: {
      "Content-Type": "application/json"
    }
  };
  if (method === "post") options.body = JSON.stringify(requestData);
  return fetch(url, options);
}

export default class GameAPI {
  static create(gameName, founderName, type, slots, password) {
    return handleFetch("/create-game", "post", {
      gameName,
      founderName,
      type,
      slots,
      password
    });
  }

  static getAvailable() {
    return handleFetch("/get-games", "get");
  }

  static getRoundData(gameKey, playerKey) {
    return handleFetch("/get-round-data", "post", { gameKey, playerKey });
  }

  static getBoardData(gameKey, playerKey) {
    return handleFetch("/get-board-data", "post", { gameKey, playerKey });
  }

  static getPlayers(gameKey, playerKey) {
    return handleFetch("/get-game-players", "post", { gameKey, playerKey });
  }

  static join(playerName, playerType, gameKey, gamePassword) {
    return handleFetch("/join", "post", {
      playerName,
      playerType,
      gameKey,
      gamePassword
    });
  }

  static checkState(gameKey, playerKey, gameState, boardId) {
    return handleFetch("/check-updates", "post", {
      gameKey,
      playerKey,
      gameState,
      boardId
    });
  }

  static joinAllPlayers(gameKey, founderKey, ...players) {
    return handleFetch("/join-everyone", "post", {
      gameKey,
      founderKey,
      players
    });
  }

  static getRandomBlock(playerKey, gameKey) {
    return handleFetch("/get-block", "post", { gameKey, playerKey });
  }

  static startRound(playerKey, gameKey) {
    return handleFetch("/start-round", "post", { gameKey, playerKey });
  }

  static finishRound(playerKey, gameKey) {
    return handleFetch("/finish-round", "post", { gameKey, playerKey });
  }

  static getPlayerData(gameKey, playerKey) {
    return handleFetch("/get-player-data", "post", { gameKey, playerKey });
  }

  static updateBoard(playerKey, gameKey, setId, replace, blocksIds) {
    return handleFetch("/update-board", "post", {
      gameKey,
      playerKey,
      blocksIds,
      setId,
      replace
    });
  }

  static getData(gameKey, playerKey) {
    return handleFetch("/get-game-data", "post", { gameKey, playerKey });
  }
}
