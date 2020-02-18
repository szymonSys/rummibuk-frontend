import React from "react";
import Button from "./Button";
import GameAPI from "../APIs/GameAPI";

const Game = ({ game, setHasKeys, setKeys, playerName }) => {
  const handleJoin = (playerName, gameKey, gamePassword) => {
    GameAPI.join(playerName, "net", gameKey, gamePassword)
      .then(resp => resp.json())
      .then(data => setKeys(data.playerData.playerKey, data.gameData.key))
      .then(() => setHasKeys(true))
      .catch(err => console.log(err));
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <div>{game.name}</div>
      <div>{game.founderName}</div>
      <div>
        {game.playersData.length}/{game.slots}
      </div>
      <div>
        <Button
          text="join"
          click={() => handleJoin(playerName, game.key, game.password)}
        />
      </div>
    </div>
  );
};

export default Game;
