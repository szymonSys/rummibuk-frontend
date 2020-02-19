import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Board from "./Board";
import PlayerPanel from "./PlayerPanel";
import OtherPlayer from "./OtherPlayer";
import InfoBar from "./InfoBar";
import GameAPI from "../APIs/GameAPI";
import deepCopy from "../functions/deepCopy";

class GameView extends Component {
  checkingDataTimeoutId;
  constructor(props) {
    super(props);
    this.state = {
      gameData: null,
      boardData: null,
      roundData: null,
      playerData: null,
      time: null,
      players: [],
      currentPlayerId: null,
      hasCleanSet: false,
      tempComplet: [],
      cursorX: 0,
      cursorY: 0,
      gotBlock: false,
      isDraggingTemp: false,
      isDraggingBlock: false,
      inRound: false,
      isLoaded: false,
      roundBlocksQuantity: null,
      blocksCollection: [],
      draggingBlocks: []
    };
  }

  componentDidMount() {
    const { gameKey, playerKey, inGame } = this.props;
    if (gameKey && playerKey && inGame) {
      window.sessionStorage.setItem("gameKey", gameKey);
      window.sessionStorage.setItem("playerKey", playerKey);
    }
    const sessionGameKey = window.sessionStorage.getItem("gameKey");
    const sessionPlayerKey = window.sessionStorage.getItem("playerKey");
    const sessionInGame = window.sessionStorage.getItem("inGame");
    if (
      !(sessionGameKey || sessionPlayerKey || sessionInGame) ||
      sessionInGame === "false"
    )
      return;
    Promise.all([
      GameAPI.getData(sessionGameKey, sessionPlayerKey),
      GameAPI.getPlayerData(sessionGameKey, sessionPlayerKey),
      GameAPI.getRoundData(sessionGameKey, sessionPlayerKey),
      GameAPI.getBoardData(sessionGameKey, sessionPlayerKey)
    ])
      .then(responses => {
        responses.forEach(resp => {
          resp.json().then(data => {
            for (let property in this.state) {
              data.hasOwnProperty(property) &&
                this.setState({ [property]: data[property] });
            }
          });
        });
      })
      .catch(err => console.log(err));
  }

  componentDidUpdate(_, prevState) {
    if (this.checkIsLoaded(prevState)) {
      this.check();
      this.setState({
        blocksCollection: this.state.playerData.blocks,
        isLoaded: true
      });
      this.setInRound();
    }
    if (
      this.state.isLoaded &&
      prevState.playerData.blocks !== this.state.playerData.blocks
    ) {
      this.setState({ blocksCollection: this.state.playerData.blocks });
    }
    if (this.state.isLoaded && !this.state.roundData.isOngoing) {
      this.startRound();
    }

    if (
      this.state.isLoaded &&
      this.state.roundData.isOngoing &&
      prevState.roundData.number !== this.state.roundData.number
    ) {
      this.setInRound();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.checkingDataTimeoutId);
  }

  checkIsLoaded = prevState => {
    if (this.state.isLoaded) return false;
    const keys = ["boardData", "playerData", "gameData", "roundData"];
    for (let key of keys) {
      if (!this.state[key] && prevState[key] === this.state[key]) {
        return false;
      }
    }
    return true;
  };

  check = () => {
    const { gameData, playerData, boardData, roundData } = this.state;
    GameAPI.checkState(
      gameData.key,
      playerData.playerKey,
      gameData.state,
      boardData.stateId
    )
      .then(resp => resp.json())
      .then(data => {
        const responses = [];
        if (data.gameIsChanged)
          responses.push(GameAPI.getData(gameData.key, playerData.playerKey));
        if (data.boardIsChanged)
          responses.push(
            GameAPI.getBoardData(gameData.key, playerData.playerKey)
          );
        if (data.number !== roundData.number)
          responses.push(
            GameAPI.getRoundData(gameData.key, playerData.playerKey)
          );

        responses.forEach(resp => {
          Promise.resolve(resp)
            .then(resp => resp.json())
            .then(data => {
              for (let property in this.state) {
                data.hasOwnProperty(property) &&
                  this.state[property] !== data[property] &&
                  this.setState({ [property]: data[property] });
              }
            });
        });
      })
      .catch(err => console.log(err));
    this.checkingDataTimeoutId = setTimeout(this.check, 2000);
  };

  updateBoard = (setId = null, a = false, event) => {
    event.stopPropagation();
    let replace = false;
    let permision = true;
    if (!this.state.inRound) permision = false;
    const { playerData, draggingBlocks } = this.state;
    if (!this.state.draggingBlocks.length) permision = false;
    if (
      setId === null &&
      draggingBlocks.length < 3 &&
      !(setId || setId == 0) &&
      permision
    )
      permision = false;
    if (replace && draggingBlocks.length !== 1 && permision) permision = false;
    const blocksIds = permision ? draggingBlocks.map(block => block.id) : null;

    if (setId !== null && draggingBlocks.length === 1 && permision) {
      const set = this.state.boardData.sets.find(set => setId === set.id);
      if (set) {
        const jokerIndex = set.blocks.findIndex(block => block.value === 0);
        if (jokerIndex !== -1) {
          const [updater] = draggingBlocks;
          if (
            set.type === "collection" &&
            set.blocks.some(block => block.value === updater.value)
          )
            replace = true;
          const compareJoker = (val = 1) =>
            set.blocks[jokerIndex + 1 * val].value ===
              updater.value + 1 * val && true;
          if (jokerIndex == 0) {
            replace = compareJoker();
          } else if (jokerIndex == draggingBlocks.length - 1) {
            replace = compareJoker(-1);
          } else {
            replace = compareJoker() && compareJoker(-1);
          }
        }
      }
    }

    console.log(setId);
    console.log(replace);
    console.log(blocksIds);
    permision &&
      GameAPI.updateBoard(
        playerData.playerKey,
        playerData.gameKey,
        setId,
        replace,
        blocksIds
      )
        .then(resp => resp.json())
        .then(data => {
          data.isUpdated && this.setState({ boardData: data.boardData });
          return data.isUpdated;
        })
        .then(isUpdated => {
          isUpdated &&
            GameAPI.getPlayerData(playerData.gameKey, playerData.playerKey)
              .then(resp => resp.json())
              .then(data =>
                this.setState({
                  playerData: data.playerData,
                  tempComplet: [],
                  updateInRound: true
                })
              );
        });
    console.log(permision);
    this.removeFromDragging();
  };

  addToTemp = (blockId, fromBoard = false) => {
    let isBlocksSet = false;
    let isBlocksCollection = false;
    let blockIndex = null;
    let setIndex = null;
    let target = null;
    let tempBlock = null;

    if (!fromBoard) {
      target = [...this.state.blocksCollection];
      isBlocksCollection = true;
      tempBlock = target.find((block, i) => {
        blockIndex = i;
        return block.id === blockId;
      });
    } else {
      const sets = this.state.boardData.sets;
      for (let sIndex in sets) {
        for (let bIndex in sets[sIndex].blocks) {
          if (sets[sIndex].blocks[bIndex].id === blockId) {
            tempBlock = sets[sIndex].blocks[bIndex];
            isBlocksSet = true;
            target = [...sets[sIndex].blocks];
            blockIndex = bIndex;
            setIndex = sIndex;
          }
        }
      }
    }

    if (tempBlock) {
      const tempIndex = this.state.tempComplet.findIndex(
        block => block.id === tempBlock.id
      );
      if (tempIndex === -1) {
        if (blockIndex == 0 || blockIndex) {
          const modyfiedBlock = { ...target[blockIndex] };
          const tempComplet = [...this.state.tempComplet, tempBlock];
          modyfiedBlock.isTemp = true;
          target[blockIndex] = modyfiedBlock;

          const newState = { tempComplet };
          if (isBlocksSet && setIndex !== null) {
            const boardData = { ...this.state.boardData };
            boardData.sets[setIndex].blocks = target;
            newState.boardData = boardData;
          } else if (isBlocksCollection) {
            newState.blocksCollection = target;
          }
          this.setState(newState);
        }
      }
    }
  };

  removeFromTemp = blockId => {
    const removedBlock = this.state.tempComplet.find(
      (block, i) => block.id === blockId
    );
    if (removedBlock) {
      const tempComplet = [...this.state.tempComplet];
      let isBlocksSet = null;
      let isBlocksCollection = null;
      let setIndex = null;
      const chooseBlocksCollection = () => {
        isBlocksCollection = true;
        return [...this.state.blocksCollection];
      };
      const chooseBoardSet = () => {
        setIndex = this.state.boardData.sets.findIndex(
          set => set.id === removedBlock.set_id
        );
        isBlocksSet = true;

        return [...this.state.boardData.sets[setIndex].blocks];
      };
      const target =
        removedBlock.membership === "player"
          ? chooseBlocksCollection()
          : chooseBoardSet();
      const blockIndex = target.findIndex(
        block => removedBlock.id === block.id
      );
      if (!target) return;
      target[blockIndex].isTemp = false;
      tempComplet.splice(tempComplet.indexOf(removedBlock), 1);
      const newState = { tempComplet };
      if (isBlocksSet && setIndex !== null) {
        const boardData = { ...this.state.boardData };
        boardData.sets[setIndex].blocks = target;
        newState.boardData = boardData;
      } else if (isBlocksCollection) {
        newState.blocksCollection = target;
      }
      this.setState(newState);
    }
  };

  removeBoardBlocksFromTemp = () => {
    const tempComplet = this.state.tempComplet.filter(
      block => block.membership !== "set"
    );
    this.setState({ tempComplet });
  };

  startRound = () => {
    const { playerKey, gameKey } = this.state.playerData;
    GameAPI.startRound(playerKey, gameKey)
      .then(resp => resp.json())
      .then(data => {
        const playerData = deepCopy(this.state.playerData);
        playerData.drewBlock = data.drewBlock;
        this.setState({
          roundData: data.roundData,
          playerData,
          roundBlocksQuantity: this.state.playerData.blocks.length
        });
      })
      .catch(err => console.log(err));
  };

  setInRound = () => {
    const inRound =
      this.state.playerData.id === this.state.roundData.playerId ? true : false;
    this.setState({ inRound });
  };

  finishRound = () => {
    const { playerKey, gameKey } = this.state.playerData;
    this.removeBoardBlocksFromTemp();
    console.log(
      this.state.roundBlocksQuantity,
      this.state.playerData.blocks.length
    );
    if (
      !this.state.drewBlock &&
      this.state.roundBlocksQuantity === this.state.playerData.blocks.length
    ) {
      this.getRandomBlock();
    }
    GameAPI.finishRound(playerKey, gameKey)
      .then(resp => resp.json())
      .then(roundData => this.setState({ roundData }))
      .catch(err => console.log(err));
  };

  getRandomBlock = () => {
    const { playerKey, gameKey } = this.state.playerData;
    const playerData = deepCopy(this.state.playerData);
    GameAPI.getRandomBlock(playerKey, gameKey)
      .then(resp => resp.json())
      .then(data => {
        playerData.blocks = data.blocks;
        playerData.drewBlock = data.drewBlock;
        this.setState({ playerData });
      })
      .catch(err => console.log(err));
  };

  addToDragging = (isTemp, ...ids) => {
    if (!ids.length) return;
    const blocksCollection = [...this.state.blocksCollection];
    const idsCopy = [...ids];
    let draggingBlocks = ids
      .map((id, index) =>
        blocksCollection.filter(block => {
          if (id === block.id) {
            idsCopy.splice(idsCopy.indexOf(id), 1);
            block.isDragging = true;
          }
          return id === block.id;
        })
      )
      .flat();

    let sets = null;
    if (isTemp) {
      sets = [...this.state.boardData.sets];
      for (let idIndex in idsCopy) {
        sets.forEach(set => {
          draggingBlocks = draggingBlocks.concat(
            set.blocks.filter(block => {
              if (idsCopy[idIndex] === block.id) block.isDragging = true;
              return idsCopy[idIndex] === block.id;
            })
          );
        });
      }
    }

    const newState = { draggingBlocks, blocksCollection };
    if (isTemp && sets) {
      const boardData = { ...this.boardData };
      boardData.sets = sets;
      newState.boardData = boardData;
    }
    if (isTemp) {
      newState.isDraggingTemp = true;
    } else {
      newState.isDraggingBlock = true;
    }
    this.setState(newState);
  };

  removeFromDragging = e => {
    const blocksCollection = [...this.state.blocksCollection];
    this.state.draggingBlocks.forEach(draggingBlock => {
      blocksCollection.forEach(block => {
        if (block.id === draggingBlock.id) block.isDragging = false;
      });
    });
    this.setState({
      isDraggingTemp: false,
      isDraggingBlock: false,
      draggingBlocks: [],
      blocksCollection
    });
  };

  setCursorPosition = event => {
    this.setState({ cursorX: event.clientX, cursorY: event.clientY });
  };

  createDraggingBlocks = () => {
    const colors = {
      red: "#ff6060",
      green: "#60ff70",
      blue: "#60b7ff",
      yellow: "#ffcc60",
      purple: "#bd60ff"
    };
    return (
      <div
        style={{
          position: "absolute",
          top: `${this.state.cursorY + 1}px`,
          left: `${this.state.cursorX + 1}px`
        }}
      >
        {this.state.draggingBlocks.map((block, index) => {
          const { id, color, value } = block;
          return (
            <div
              id={`dragging-block${id}`}
              key={index}
              style={{
                display: "inline-block",
                backgroundColor: `${colors[color]}`,
                position: "relative",
                width: "40px",
                height: "60px",
                margin: "10px",
                textAlign: "center",
                margin: "5px",
                opacity: 0.1,
                transition: ".1s",
                borderRadius: "20%",
                color: "#333",
                fontSize: "20px",
                fontWeight: "bold",
                boxShadow: "0px 4px 7px 1px rgba(0,0,0,0.75)",
                cursor: "grabbing"
              }}
            >
              {value}
            </div>
          );
        })}
      </div>
    );
  };

  createView = () => {
    const {
      isDraggingTemp,
      isDraggingBlock,
      boardData,
      playerData,
      roundData,
      gameData,
      draggingBlocks,
      inRound,
      gotBlock,
      tempComplet,
      blocksCollection
    } = this.state;
    return (
      <div
        style={{
          position: "relative",
          userSelect: "none",
          backgroundColor: "#444",
          overflow: "hidden",
          minHeight: "100vh",
          color: "#eee",
          padding: "10px 8%",
          boxSizing: "border-box",
          cursor: `${
            isDraggingBlock || isDraggingTemp ? "grabbing" : "default"
          }`
        }}
        onMouseMove={this.setCursorPosition}
        onMouseUp={this.removeFromDragging}
      >
        <InfoBar
          inRound={inRound}
          playerName={this.state.playerData.name}
          gameName={this.state.gameData.name}
        />
        {(isDraggingTemp || isDraggingBlock) && this.createDraggingBlocks()}
        <Board
          sets={[...boardData.sets]}
          updateBoard={this.updateBoard}
          addToTemp={this.addToTemp}
          blocksColors={this.blocksColors}
        />
        <PlayerPanel
          inRound={inRound}
          blocks={[...blocksCollection]}
          tempBlocks={[...tempComplet]}
          addToTemp={this.addToTemp}
          removeFromTemp={this.removeFromTemp}
          getRandomBlockHandle={this.getRandomBlock}
          finishRoundHandle={this.finishRound}
          addToDraggingHandle={this.addToDragging}
          removeFromDraggingHandle={this.removeFromDragging}
          drewBlock={playerData.drewBlock}
          isDraggingTemp={isDraggingTemp}
        />
      </div>
    );
  };

  render() {
    return this.state.isLoaded ? this.createView() : null;
  }
}

export default GameView;
