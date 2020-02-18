import React, { useState, useEffect } from "react";
import Button from "./Button";
import TimeBar from "./TimeBar";
import TempComplet from "./TempComplet";
import BlocksCollection from "./BlocksCollection";
import Block from "./Block";

const PlayerPanel = ({
  blocks,
  tempBlocks,
  finishRoundHandle,
  getRandomBlockHandle,
  inRound,
  addToTemp,
  removeFromTemp,
  addToDraggingHandle,
  gotBlock
}) => {
  const blocksIds = [];
  const createBlocksCollection = (
    blocks,
    handleClick,
    addToDraggingHandle,
    isTempComplet = false
  ) => {
    if (Array.isArray(blocks) && blocks.length) {
      return blocks.map((block, index) => {
        const {
          id,
          color,
          value,
          membership,
          playerId,
          setId,
          isTemp,
          isDragging
        } = block;
        isTempComplet && Array.isArray(blocksIds) && blocksIds.push(id);
        return (
          <Block
            key={index}
            id={id}
            value={value}
            color={color}
            membership={membership}
            playerId={playerId}
            setId={setId}
            isTemp={isTemp}
            isDragging={isDragging}
            addToDraggingHandle={() => addToDraggingHandle(false, id)}
            click={() => handleClick(id)}
          />
        );
      });
    }
  };
  return (
    <div>
      <div>
        {inRound && !gotBlock && (
          <Button text="Get block" click={getRandomBlockHandle} />
        )}
        <TempComplet
          blocks={createBlocksCollection(
            tempBlocks,
            removeFromTemp,
            addToDraggingHandle,
            true
          )}
          blocksIds={blocksIds}
          addToDraggingHandle={addToDraggingHandle}
        />
        <div
          onMouseDown={() => addToDraggingHandle(true, ...blocksIds)}
          onDrag={event => event.preventDefault()}
          style={{ backgroundColor: "black", width: "50px", height: "50px" }}
        ></div>
        {inRound && <Button text="Finish round" click={finishRoundHandle} />}
      </div>
      <div>
        <TimeBar />
      </div>
      <div>
        <BlocksCollection
          blocks={createBlocksCollection(
            blocks,
            addToTemp,
            addToDraggingHandle
          )}
        />
      </div>
    </div>
  );
};

export default PlayerPanel;
