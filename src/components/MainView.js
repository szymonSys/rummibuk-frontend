import React, { useEffect } from "react";
import PlayerForm from "./PlayerForm";
import Button from "./Button";
// import { Redirect } from "react-router-dom";

// { inputChangeHandle, btnClickHandle, playerName }

const MainView = ({ checkKeys, btnClickHandle, resetGameType, ...rest }) => {
  useEffect(() => {
    if (window.location.pathname === "/" && !checkKeys()) resetGameType();
  });
  return (
    <>
      <h1>Welcome to The Rummikub Online game.</h1>
      <p>Please enter your name and choose game mode below to start playing.</p>
      <PlayerForm {...rest} />
      <div>
        <h2>Games modes</h2>
        <Button text="Network" click={() => btnClickHandle("multiplayer")} />
        <Button text="Local" click={() => btnClickHandle("localgame")} />
        <Button text="Single" click={() => btnClickHandle("singleplayer")} />
      </div>
    </>
  );
};

export default MainView;
