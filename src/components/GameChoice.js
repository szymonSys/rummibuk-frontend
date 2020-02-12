import React from "react";
import Button from "./Button";

const GameChoice = ({ firstText, secText, btnText, handleClick }) => {
  return (
    <>
      <div>
        <span>{firstText}</span>
        <Button text={btnText} click={handleClick} />
        <span>{secText}</span>
      </div>
    </>
  );
};

export default GameChoice;
