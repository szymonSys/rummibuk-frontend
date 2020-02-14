import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import GameAPI from "../APIs/GameAPI";

const WaitingView = ({ gameKey, playerKey, updateGameState }) => {
  const [playersData, setPlayersData] = useState({});
  useEffect(() => {
    sendRequest();
    return function stopSendingRequest() {
      clearTimeout(timeoutId);
    };
  }, []);

  let timeoutId;

  useEffect(() => {
    if (playersData) {
      updateGameState(playersData.gameName, playersData.slots);
    }
  }, [playersData]);

  const handleResponse = () => {
    GameAPI.getPlayers(gameKey, playerKey)
      // .then(resp => resp.json())
      .then(data => setPlayersData(data))
      .catch(err => console.log(err));
  };

  const sendRequest = () => {
    handleResponse();
    timeoutId = setTimeout(sendRequest, 2000);
  };

  const redirect = () => {
    if (!(gameKey || playerKey)) {
      console.log("waitinh view: ", gameKey, playerKey);
      return <Redirect to={"/"} />;
    }
    if (playersData && playersData.slots && playersData.playersData.length)
      return playersData.slots === playersData.playersData.length ? (
        <Redirect to={"/game"} />
      ) : null;
    return null;
  };

  const createPlayersList = (...players) => {
    if (!playersData.slots) return null;
    const playersList = players.map((player, index) => (
      <li key={index + 1}>{player.name}</li>
    ));
    const freeSlots = playersData.slots - playersList.length;
    if (freeSlots > 0) {
      for (let i = 0; i < freeSlots; i++) {
        playersList.push(<li key={playersList.length + 1}>waiting...</li>);
      }
    }
    return playersList;
  };

  return (
    <div>
      {redirect()}
      <h1>Create the game</h1>
      <p>Waiting for players...</p>
      <div>{"<<waiting-icon>>"}</div>
      <div>
        <h2>
          {playersData && playersData.gameName
            ? playersData.gameName
            : "Game not found"}
        </h2>
        {playersData && playersData.playersData ? (
          <ol>{createPlayersList(...playersData.playersData)}</ol>
        ) : null}
      </div>
    </div>
  );
};

export default WaitingView;
