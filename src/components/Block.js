import React, { useState, useEffect } from "react";

const Block = ({
  id,
  color,
  value,
  membership,
  playerId,
  setId,
  isTemp,
  isDragging,
  click,
  addToDraggingHandle,
  updateBoard
}) => {
  return (
    <div
      id={`block-${id}`}
      onMouseDown={addToDraggingHandle}
      style={{
        backgroundColor: color,
        position: "relative",
        width: "40px",
        height: "60px",
        textAlign: "center",
        margin: "5px",
        opacity: `${isTemp || isDragging ? 0.5 : 1}`,
        transition: ".1s"
      }}
    >
      <div
        onClick={click}
        style={{
          width: "100%",
          height: "100%",
          padding: "5px 2px"
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default Block;
