import React, { useState, useEffect } from "react";
import Block from "./Block";

const BlocksSet = ({ updateBoard, set, addToTempFromSet }) => {
  const createSet = () => {
    return set.blocks.map((block, index) => {
      return (
        <Block
          key={index}
          {...block}
          updateBoard={e => updateBoard(set.id, true, e)}
          click={() => addToTempFromSet(set.id, block.id)}
        />
      );
    });
  };
  return (
    <div onMouseUp={e => updateBoard(set.id, false, e)}>{createSet()}</div>
  );
};

export default BlocksSet;
