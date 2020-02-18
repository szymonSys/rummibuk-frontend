import React, { useEffect, useState } from "react";
import Game from "./Game";
import GameAPI from "../APIs/GameAPI";
import { Redirect } from "react-router-dom";

const GamesList = ({ inGame, setInLobby, setKeys, playerName, gameKey }) => {
  const [gamesList, setGamesList] = useState([]);
  const [hasKeys, setHasKeys] = useState(false);
  const handleResponse = () => {
    GameAPI.getAvailable()
      .then(resp => resp.json())
      .then(data => setGamesList(data.gamesData))
      .catch(err => console.log(err));
  };

  const redirect = () =>
    hasKeys ? <Redirect to={"/waiting-for-players"} /> : null;

  const createList = () => {
    return gamesList.map((game, index) => (
      <Game
        key={index}
        game={game}
        setKeys={setKeys}
        setHasKeys={setHasKeys}
        playerName={playerName}
      />
    ));
  };

  useEffect(() => {
    if (gamesList && !gamesList.length) handleResponse();
  }, []);

  useEffect(() => {
    const sessionInGame = window.sessionStorage.getItem("inGame");
    // if (!(sessionInGame || sessionInGame === "true")) setInLobby();
    console.log(sessionInGame, hasKeys);
    if (!(sessionInGame || sessionInGame === "true") && hasKeys) setInLobby();
  });

  return (
    <div>
      {window.sessionStorage.getItem("inLobby") && redirect()}
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
