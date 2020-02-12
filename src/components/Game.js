import React from "react";
import Button from "./Button";

const Game = ({ game, handleJoin, playerName }) => (
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

export default Game;
