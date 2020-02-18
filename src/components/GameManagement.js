import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect, Link } from "react-router-dom";
import GameForm from "./GameForm";
import GamesList from "./GamesList";
import GameChoice from "./GameChoice";

const GameManagement = ({
  setInLobby,
  inGame,
  gameKey,
  playerName,
  gameType,
  setKeys,
  ...rest
}) => {
  const [wayOfPlaying, setWayOfPlaying] = useState(null);

  useEffect(() => {
    if (window.location.pathname === "/game-management") setWayOfPlaying(null);
  });

  const showGameForm = () => {
    setWayOfPlaying("create");
  };

  const showGamesList = () => {
    setWayOfPlaying("join");
  };

  const redirect = () => {
    if (!playerName || !gameType) return <Redirect to={"/"} />;
    if (wayOfPlaying === "join") {
      return <Redirect push to={"/game-management/games-list"} />;
    }
    if (wayOfPlaying === "create")
      return <Redirect push to={"/game-management/game-creator"} />;
    return null;
  };
  return (
    <>
      <h1>Game management</h1>
      <GameChoice
        firstText="You can"
        btnText="create"
        secText="a new game"
        handleClick={showGameForm}
      />
      <GameChoice
        firstText="or"
        btnText="join"
        secText="an existing one"
        handleClick={showGamesList}
      />
      {redirect()}
      {window.sessionStorage.getItem("inGame") === "true" ||
      window.sessionStorage.getItem("inLobby") === "true" ? (
        <h2>You already belong to game.</h2>
      ) : null}
      <Switch>
        <Route
          exact
          path={"/game-management/games-list"}
          render={() => (
            <GamesList
              inGame={inGame}
              setInLobby={setInLobby}
              setKeys={setKeys}
              playerName={playerName}
              gameKey={gameKey}
            />
          )}
        />
        <Route
          exact
          path={"/game-management/game-creator"}
          render={() => <GameForm {...rest} />}
        />
      </Switch>
    </>
  );
};

export default GameManagement;
