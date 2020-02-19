import React, { useState, useEffect } from "react";

const InfoBar = ({ inRound, playerName, gameName }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "16px",
        height: "100px"
      }}
    >
      <p>
        <span style={{ fontWeight: "bold" }}>game: </span> {gameName}
      </p>
      <p style={{ fontWeight: "bold", fontSize: "32px" }}>
        {inRound && "Your round"}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>player: </span> {playerName}
      </p>
    </div>
  );
};

export default InfoBar;
