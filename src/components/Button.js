import React from "react";
// import { Redirect } from "react-router-dom";

const Button = ({ text, click }) => (
  <button
    style={{
      userSelect: "none",
      border: "none",
      margin: 0,
      padding: 0,
      width: "120px",
      height: "60px",
      overflow: "visible",
      borderRadius: "10%",
      fontSize: "16px",
      cursor: "pointer"
    }}
    onClick={click}
  >
    {text}
  </button>
);
export default Button;
