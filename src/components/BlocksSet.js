import React, { useState, useEffect } from "react";
import Block from "./Block";

const BlocksSet = ({ updateBoard, set, addToTemp }) => {
  const createSet = () => {
    return set.blocks.map((block, index) => {
      return (
        <Block
          key={index}
          {...block}
          click={e => addToTemp(block.id, true, e)}
        />
      );
    });
  };
  return (
    <div
      style={{
        margin: "10px",
        padding: "10px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around"
      }}
      onMouseUp={e => updateBoard(set.id, false, e)}
    >
      {createSet()}
    </div>
  );
};

export default BlocksSet;
