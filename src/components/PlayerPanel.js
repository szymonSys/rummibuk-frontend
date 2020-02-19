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
  drewBlock,
  isDraggingTemp
}) => {
  const blocksIds = [];
  const createBlocksCollection = (
    blocks,
    handleClick,
    addToDraggingHandle,
    isTempComplet = false
  ) => {
    if (Array.isArray(blocks) && blocks.length) {
      const sortingCallback = (a, b) => a.value - b.value;
      if (isTempComplet) blocks.sort(sortingCallback);
      return blocks.map((block, index) => {
        const {
          id,
          color,
          value,
          membership,
          player_id: playerId,
          set_id: setId,
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
    <div
      style={{
        backgroundColor: "#222",
        padding: "5px 30px",
        borderRadius: "3%"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20px 0"
        }}
      >
        {inRound && !drewBlock ? (
          <Button text="Get block" click={getRandomBlockHandle} />
        ) : (
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
              opacity: 0.5,
              fontSize: "16px",
              cursor: "not-allowed"
            }}
          >
            Get block
          </button>
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
        >
          {" "}
          <div
            onMouseDown={() => addToDraggingHandle(true, ...blocksIds)}
            onDrag={event => event.preventDefault()}
            style={{
              backgroundColor: "#fff",
              width: "60px",
              height: "60px",
              borderRadius: "100%",
              margin: "0 0 0 5px",
              cursor: "grab",
              color: "green",
              border: "1px solid green",
              textAlign: "center",
              lineHeight: "60px"
            }}
          >
            grab
          </div>
        </TempComplet>
        {inRound ? (
          <Button text="Finish round" click={finishRoundHandle} />
        ) : (
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
              opacity: 0.5,
              fontSize: "16px",
              cursor: "not-allowed"
            }}
          >
            Finish round
          </button>
        )}
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
