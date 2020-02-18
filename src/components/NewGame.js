import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import GameAPI from "../APIs/GameAPI";

const NewGame = ({
  hasKeys,
  gameName,
  founderName,
  type,
  setKeys,
  setIsFounder,
  slots,
  gameKey,
  founderKey,
  players,
  updatePlayersData,
  password,
  inLobby,
  inGame,
  setInLobby,
  setInGame
}) => {
  const [done, setDone] = useState(false);
  const redirect = type => {
    if (!(founderName || slots)) return <Redirect to="/" />;
    switch (type) {
      case "singleplayer":
      case "localgame":
        return inGame ? <Redirect to="/game" /> : null;
      case "multiplayer":
        return inLobby ? <Redirect to="/waiting-for-players" /> : null;
      default:
        return <Redirect to="/error" />;
    }
  };

  const handleJoinAllPlayers = () => {
    if (hasKeys && players.length)
      GameAPI.joinAllPlayers(gameKey, founderKey, ...players)
        .then(resp => resp.json())
        .then(data => updatePlayersData(...data.playersData))
        .catch(err => console.log(err));
  };

  const handleCreateGame = () => {
    GameAPI.create(gameName, founderName, type, parseInt(slots), password)
      .then(resp => resp.json())
      .then(data => setKeys(data.founderKey, data.gameKey))
      .then(setIsFounder)
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (hasKeys && !done) {
      if ((players.length && type === "singleplayer") || type === "localgame") {
        Promise.resolve(handleJoinAllPlayers())
          .then(setDone(true))
          .then(setInGame)
          .catch(err => console.log(err));
      } else if (type === "multiplayer") {
        Promise.resolve(setInLobby)
          .then(setDone(true))
          .then(setInLobby);
      }
    }
  });

  if (!hasKeys && slots && founderName) {
    handleCreateGame();
  }
  return redirect(type);
};

export default NewGame;
