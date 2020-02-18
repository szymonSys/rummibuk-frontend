import React, { useState, useEffect } from "react";

const TempComplet = ({ blocks }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "left"
      }}
    >
      {blocks}
    </div>
  );
};

export default TempComplet;
