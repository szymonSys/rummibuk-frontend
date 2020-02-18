import React, { useState, useEffect } from "react";
import BlocksSet from "./BlocksSet";

const Board = ({ sets, updateBoard }) => {
  const createSets = () =>
    sets.map((set, index) => (
      <BlocksSet updateBoard={updateBoard} key={index} set={set} />
    ));
  return (
    <div
      style={{ width: "100%", height: "70vh" }}
      onMouseUp={e => updateBoard(null, false, e)}
      onMouseOver={() => console.log("ok")}
    >
      {createSets()}
    </div>
  );
};

export default Board;
