import React, { useState, useEffect, Children } from "react";

const TempComplet = ({ blocks, children }) => {
  return (
    <div
      style={{
        width: "60vw",
        height: "70px",
        padding: "5px 5px",
        margin: "0 10px",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "left",
        backgroundColor: "#333",
        borderRadius: "2%"
      }}
    >
      {children}
      {blocks}
    </div>
  );
};

export default TempComplet;
