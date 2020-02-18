import React, { useEffect, useState } from "react";
import Button from "./Button";
import { Redirect } from "react-router-dom";

const GameForm = ({ gameName, gamePassword, slotsChoice, handleChange }) => {
  const [isCreated, setIsCreated] = useState(false);
  const createRatioInputs = (
    choice = slotsChoice,
    handleFn = handleChange,
    quantity = 3
  ) => {
    const inputs = [];
    for (let i = 0; i < quantity; i++) {
      const slotsValue = i + 2;
      inputs.push(
        <label key={i + 1}>
          {slotsValue}
          <input
            type="radio"
            name="slots"
            id={`game-slots${slotsValue}`}
            value={slotsValue}
            onChange={handleFn}
            checked={choice == slotsValue ? true : false}
          />
        </label>
      );
    }
    return inputs;
  };
  const redirect = () => {
    if (window.sessionStorage.getItem("inGame") === "true")
      return <Redirect to={"/game"} />;
    if (window.sessionStorage.getItem("inLobby") === "true")
      return <Redirect to={"/waiting-for-players"} />;
    if (isCreated) return <Redirect to={"/new-game"} />;
    return null;
  };
  const confirmCreation = () => {
    if (
      slotsChoice > 1 &&
      slotsChoice <= 4 &&
      typeof gameName === "string" &&
      gameName.length > 2 &&
      typeof gamePassword === "string"
    ) {
      setIsCreated(true);
    }
  };
  return (
    <div>
      {redirect()}
      <h2>Game Creator</h2>
      <label htmlFor="gameName">
        Game name
        <input
          type="text"
          name="gameName"
          id="game-name-input"
          value={gameName}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="gamePassword">
        Game password (optional)
        <input
          type="password"
          name="gamePassword"
          id="game-password-input"
          value={gamePassword}
          onChange={handleChange}
        />
      </label>
      <p>Slots</p>
      {createRatioInputs()}
      <Button text={"create"} click={confirmCreation} />
    </div>
  );
};

export default GameForm;
