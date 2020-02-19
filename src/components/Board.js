import React, { useState, useEffect } from "react";
import BlocksSet from "./BlocksSet";

const Board = ({ sets, updateBoard, addToTemp }) => {
  const createSets = () =>
    sets.map((set, index) => (
      <BlocksSet
        updateBoard={updateBoard}
        key={index}
        set={set}
        addToTemp={addToTemp}
      />
    ));
  return (
    <div
      style={{
        width: "100%",
        minHeight: "64vh",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "left",
        alignItems: "flex-start",
        alignContent: "flex-start"
      }}
      onMouseUp={e => updateBoard(null, false, e)}
    >
      {createSets()}
    </div>
  );
};

export default Board;
