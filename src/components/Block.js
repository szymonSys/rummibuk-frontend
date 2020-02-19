import React, { useState, useEffect } from "react";

const Block = ({
  id,
  color,
  value,
  isTemp,
  isDragging,
  click,
  addToDraggingHandle
}) => {
  const colors = {
    red: "#ff6060",
    green: "#60ff70",
    blue: "#60b7ff",
    yellow: "#ffcc60",
    purple: "#bd60ff"
  };
  return (
    <div
      id={`block-${id}`}
      onMouseDown={addToDraggingHandle}
      style={{
        userSelect: "none",
        backgroundColor: `${colors[color]}`,
        position: "relative",
        width: "40px",
        height: "60px",
        textAlign: "center",
        margin: "5px",
        color: "#333",
        fontSize: "20px",
        fontWeight: "bold",
        opacity: `${isTemp || isDragging ? 0.3 : 1}`,
        transition: ".1s",
        borderRadius: "20%",
        boxShadow: "0px 4px 7px 1px rgba(0,0,0,0.75)",
        cursor: "pointer"
      }}
    >
      <div
        onClick={click}
        style={{
          width: "100%",
          height: "100%",
          padding: "10px 0"
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default Block;
