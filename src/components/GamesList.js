import React, { useEffect, useState } from "react";
import Game from "./Game";
import GameAPI from "../APIs/GameAPI";
import { Redirect } from "react-router-dom";

const GamesList = ({ setKeys, playerName }) => {
  const [gamesList, setGamesList] = useState([]);
  const [hasKeys, setHasKeys] = useState(false);
  const handleResponse = () => {
    GameAPI.getAvailable()
      // .then(resp => resp.json())
      .then(data => setGamesList(data.games))
      .catch(err => console.log(err));
  };

  const handleJoin = (playerName, gameKey, gamePassword) => {
    GameAPI.join(playerName, "net", gameKey, gamePassword)
      .then(data => setKeys(data.founderKey, data.gameKey))
      .then(() => setHasKeys(true))
      .catch(err => console.log(err));
  };

  const redirect = () =>
    hasKeys ? <Redirect to={"/waiting-for-players"} /> : null;

  const createList = () => {
    return gamesList.map((game, index) => (
      <Game
        key={index}
        game={game}
        handleJoin={handleJoin}
        playerName={playerName}
      />
    ));
  };

  if (!gamesList.length) handleResponse();

  return (
    <div>
      {redirect()}
      <h2>Games List</h2>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>name</div>
        <div>founder</div>
        <div>slots</div>
        <div>action</div>
      </div>
      {gamesList.length ? createList() : <p>Games not found</p>}
    </div>
  );
};

export default GamesList;
