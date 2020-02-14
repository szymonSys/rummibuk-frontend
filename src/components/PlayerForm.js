import React from "react";

const PlayerForm = ({ inputChangeHandle, playerName }) => (
  <input
    type="text"
    name="playerName"
    id="player-name-input-1"
    value={playerName}
    onChange={inputChangeHandle}
  />
);

export default PlayerForm;
