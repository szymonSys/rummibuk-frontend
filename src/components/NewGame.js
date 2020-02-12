import React from "react";
import { Redirect } from "react-router-dom";
import GameAPI from "../APIs/GameAPI";

const NewGame = ({
  hasKeys,
  gameName,
  founderName,
  type,
  setKeys,
  slots,
  password
}) => {
  const redirect = type => {
    console.log("keys redirect: ", hasKeys);
    if (!hasKeys) return null;
    switch (type) {
      case "multiplayer":
        return <Redirect to="/waiting-for-players" />;
      case "singleplayer":
        return <Redirect to="/game" />;
      case "localgame":
        return <Redirect to="/game" />;
      default:
        return <Redirect to="/error" />;
    }
  };

  const handleResponse = () => {
    GameAPI.create(gameName, founderName, slots, type, password)
      // .then(resp => resp.json())
      .then(data => {
        setKeys(data.founderKey, data.gameKey);
      })
      .catch(err => console.log(err));
  };

  if (!hasKeys) handleResponse();
  return redirect(type);
};

export default NewGame;
