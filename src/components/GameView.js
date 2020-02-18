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

  updateBoard = (setId = null, replace = false, event) => {
    event.stopPropagation();
    let permision = true;
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
          console.log(data);
          data.isUpdated && this.setState({ boardData: data.boardData });
          return data.isUpdated;
        })
        .then(isUpdated => {
          isUpdated &&
            GameAPI.getPlayerData(playerData.gameKey, playerData.playerKey)
              .then(resp => resp.json())
              .then(data =>
                this.setState({ playerData: data.playerData, tempComplet: [] })
              );
        });
    console.log(permision);
    this.removeFromDragging();
  };

  addToTemp = blockId => {
    let index;
    const tempBlock = this.state.blocksCollection.find((block, i) => {
      index = i;
      return block.id === blockId;
    });
    if (tempBlock) {
      const tempIndex = this.state.tempComplet.findIndex(
        block => block.id === tempBlock.id
      );
      if (tempIndex === -1) {
        if (index == 0 || index) {
          const modyfiedBlock = { ...this.state.blocksCollection[index] };
          const tempComplet = [...this.state.tempComplet, tempBlock];
          const blocksCollection = [...this.state.blocksCollection];
          modyfiedBlock.isTemp = true;
          blocksCollection[index] = modyfiedBlock;
          this.setState({ tempComplet, blocksCollection });
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
      const blockIndex = this.state.blocksCollection.findIndex(
        block => removedBlock.id === block.id
      );
      const blocksCollection = [...this.state.blocksCollection];
      blocksCollection[blockIndex].isTemp = false;
      tempComplet.splice(tempComplet.indexOf(removedBlock), 1);
      this.setState({ tempComplet, blocksCollection });
    }
  };

  startRound = () => {
    const { playerKey, gameKey } = this.state.playerData;
    GameAPI.startRound(playerKey, gameKey)
      .then(resp => resp.json())
      .then(roundData => this.setState({ roundData, gotBlock: false }))
      .catch(err => console.log(err));
  };

  setInRound = () => {
    const inRound =
      this.state.playerData.id === this.state.roundData.playerId ? true : false;
    this.setState({ inRound });
  };

  finishRound = () => {
    const { playerKey, gameKey } = this.state.playerData;
    GameAPI.finishRound(playerKey, gameKey)
      .then(resp => resp.json())
      .then(roundData => this.setState({ roundData }))
      .catch(err => console.log(err));
  };

  getFromSet = () => {};

  getRandomBlock = () => {
    const { playerKey, gameKey } = this.state.playerData;
    const playerData = deepCopy(this.state.playerData);
    GameAPI.getRandomBlock(playerKey, gameKey)
      .then(resp => resp.json())
      .then(data => {
        playerData.blocks = data.blocks;
        this.setState({ playerData, gotBlock: true });
      })
      .catch(err => console.log(err));
  };

  moveDraggingElem = () => {};
  addToDragging = (isTemp, ...ids) => {
    if (!ids.length) return;
    const draggingBlocks = ids
      .map(id => this.state.blocksCollection.filter(block => id === block.id))
      .flat();

    const blocksCollection = [...this.state.blocksCollection];
    draggingBlocks.forEach(draggingBlock => {
      blocksCollection.forEach(block => {
        if (block.id === draggingBlock.id) block.isDragging = true;
      });
    });

    const newState = { draggingBlocks, blocksCollection };
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

  createView = () => {
    const {
      cursorY,
      cursorX,
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
        style={{ position: "relative" }}
        onMouseMove={this.setCursorPosition}
        onMouseUp={this.removeFromDragging}
      >
        <InfoBar />
        {isDraggingTemp && (
          <div
            onMouseUp={event => console.log(event.target)}
            style={{
              position: "absolute",
              // transform: "translate(-50%, -50%)",
              top: `${cursorY + 1}px`,
              left: `${cursorX + 1}px`
            }}
          >
            {draggingBlocks.map((block, index) => {
              const { id, color, value } = block;
              return (
                <div
                  id={`dragging-block${id}`}
                  key={index}
                  style={{
                    display: "inline-block",
                    backgroundColor: color,
                    position: "relative",
                    width: "40px",
                    height: "60px",
                    margin: "10px",
                    textAlign: "center",
                    margin: "5px",
                    opacity: 0.7,
                    transition: ".1s"
                  }}
                >
                  {value}
                </div>
              );
            })}
          </div>
        )}
        {isDraggingBlock && (
          <div
            style={{
              position: "absolute",
              top: `${cursorY + 1}px`,
              left: `${cursorX + 1}px`
            }}
          >
            {draggingBlocks.map((block, index) => {
              const { id, color, value } = block;
              return (
                <div
                  id={`dragging-block${id}`}
                  key={index}
                  style={{
                    display: "inline-block",
                    backgroundColor: color,
                    position: "relative",
                    width: "40px",
                    height: "60px",
                    margin: "10px",
                    textAlign: "center",
                    margin: "5px",
                    opacity: 0.4,
                    transition: ".1s"
                  }}
                >
                  {value}
                </div>
              );
            })}
          </div>
        )}
        <Board sets={[...boardData.sets]} updateBoard={this.updateBoard} />
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
          gotBlock={gotBlock}
        />
      </div>
    );
  };

  render() {
    return this.state.isLoaded ? this.createView() : null;
  }
}

export default GameView;
