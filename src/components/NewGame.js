import React from "react";
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
  password
}) => {
  const redirect = type => {
    if (!(gameName || founderName || slots)) return <Redirect to="/" />;
    switch (type) {
      case "multiplayer":
        return <Redirect to="/waiting-for-players" />;
      case "singleplayer":
      case "localgame":
        return <Redirect to="/game" />;
      default:
        return <Redirect to="/error" />;
    }
  };

  const handleResponse = () => {
    GameAPI.create(gameName, founderName, slots, type, password)
      // .then(resp => resp.json())
      .then(data => setKeys(data.founderKey, data.gameKey))
      .then(setIsFounder)
      .catch(err => console.log(err));
  };

  if (!hasKeys) handleResponse();
  return hasKeys ? redirect(type) : null;
};

export default NewGame;
