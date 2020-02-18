import React, { useEffect } from "react";
import PlayerForm from "./PlayerForm";
import Button from "./Button";
import { Link } from "react-router-dom";
// import { Redirect } from "react-router-dom";

// { inputChangeHandle, btnClickHandle, playerName }

const MainView = ({
  gameKey,
  checkKeys,
  btnClickHandle,
  resetGameType,
  ...rest
}) => {
  useEffect(() => {
    if (window.location.pathname === "/" && !checkKeys()) resetGameType();
  });

  const createLinks = () => {
    if (window.sessionStorage.getItem("inGame") === "true")
      return (
        <>
          <h1>You aleady belong to game.</h1>
          <Link to="/game">Game view</Link>
        </>
      );
    if (window.sessionStorage.getItem("inLobby") === "true")
      return (
        <>
          <h1>You aleady belong to game.</h1>
          <Link to="/waiting-for-players">Lobby</Link>
        </>
      );
    return false;
  };
  return (
    <div>
      {createLinks() || (
        <>
          <h1>Welcome to The Rummikub Online game.</h1>
          <p>
            Please enter your name and choose game mode below to start playing.
          </p>
          <PlayerForm {...rest} />
          <div>
            <h2>Games modes</h2>
            <Button
              text="Network"
              click={() => btnClickHandle("multiplayer")}
            />
            <Button text="Local" click={() => btnClickHandle("localgame")} />
            <Button
              text="Single"
              click={() => btnClickHandle("singleplayer")}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MainView;
