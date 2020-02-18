import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import PlayerForm from "./PlayerForm";
import Button from "./Button";

const AddPlayers = ({ gameKey, gameType, founderName, setGamePlayers }) => {
  const [currentName, setCurrentName] = useState("");
  const [playersNames, setPlayersNames] = useState([founderName]);
  const [FormPermision, setFormPermision] = useState(true);
  const [done, setDone] = useState(false);
  const [changingName, setChangingName] = useState("");
  const [changingNameIndex, setChangingNameIndex] = useState(-1);
  const [createGamePermision, setCreateGamePermision] = useState(false);
  const [redirectPermision, setRedirectPermision] = useState(false);

  const createPlayerForm = () => (
    <PlayerForm
      playerName={currentName}
      inputChangeHandle={handleInputChange}
    />
  );

  const changeName = name => {
    if (typeof name === "string" && name.length) {
      const index = playersNames.findIndex(oldName => oldName === name);
      if (!index === -1) return;
      setChangingNameIndex(index);
      setChangingName(name);
    }
  };

  const updateChangeName = event => {
    const value = event.target.value;
    if (value) {
      setChangingName(value);
    }
  };

  const saveChangeName = () => {
    const updatedPlayersNames = [...playersNames];
    if (
      !changingNameIndex === -1 ||
      changingNameIndex > updatedPlayersNames.length - 1
    )
      return;
    updatedPlayersNames[changingNameIndex] = changingName;
    setPlayersNames(updatedPlayersNames);
  };

  function confirmPlayerName(newName) {
    if (
      !newName ||
      playersNames.length === 4 ||
      playersNames.findIndex(name => name === newName) !== -1
    )
      return null;
    setPlayersNames([...playersNames, newName]);
  }

  const handleInputChange = event => {
    const targetValue = event.target.value;
    setCurrentName(targetValue);
  };
  const handleNameClick = currentName => {
    if (currentName && typeof currentName === "string") {
      confirmPlayerName(currentName);
      setCurrentName("");
    }
  };

  const createPlayersList = () =>
    playersNames.map((name, index) => {
      const isFounder = name === founderName ? true : false;
      if (changingNameIndex !== -1 && changingNameIndex === index)
        return (
          <li key={index}>
            {" "}
            <PlayerForm
              playerName={changingName}
              inputChangeHandle={updateChangeName}
            />
            <Button text="save" click={saveChangeName} />
            <Button text="cancel" click={cancelNameChange} />
          </li>
        );
      return (
        <li key={index}>
          {name}
          {isFounder ? (
            " (founder)"
          ) : (
            <>
              <Button text="edit" click={() => changeName(name)} />
              <Button text="delete" click={() => deletePlayerName(index)} />
            </>
          )}
        </li>
      );
    });

  const cancelNameChange = () => {
    setChangingNameIndex(-1);
    setChangingName("");
  };

  const makeDone = () => {
    if (playersNames.length > 1 && playersNames.length <= 4) {
      setDone(true);
      if (playersNames.length === 4) return true;
    }
  };

  const handleGameClick = () => {
    if (done) setCreateGamePermision(true);
  };
  const redirect = () => {
    if (!(founderName || gameType) || gameType === "multimplayer" || gameKey)
      return <Redirect to="/" />;
    if (redirectPermision) return <Redirect to="/new-game" />;
  };

  async function updateGameState() {
    const isUpdated = await new Promise((resolve, reject) => {
      let playerType;
      if (gameType === "localgame") {
        playerType = "local";
      } else if (gameType === "singleplayer") {
        playerType = "ai";
      } else {
        return;
      }
      const players = playersNames.map(playerName => ({
        name: playerName,
        type: playerType,
        key: null
      }));
      setGamePlayers(...players);
      resolve(true);
    });
    if (isUpdated) setRedirectPermision(true);
  }

  const deletePlayerName = index => {
    const updatedPlayersNames = [...playersNames];
    updatedPlayersNames.splice(index, 1);
    setPlayersNames(updatedPlayersNames);
  };

  useEffect(() => {
    if (makeDone()) setFormPermision(false);
    if (changingNameIndex !== -1) {
      setChangingName("");
      setChangingNameIndex(-1);
    }
  }, [playersNames]);

  useEffect(() => {
    if (createGamePermision) {
      updateGameState();
    }
  }, [createGamePermision]);

  return (
    <div>
      {redirect()}
      <h2>Adding players</h2>
      <ol>{createPlayersList()}</ol>
      {FormPermision ? createPlayerForm() : null}
      {playersNames.length === 4 ? null : (
        <Button text="+" click={() => handleNameClick(currentName)} />
      )}
      {done ? <Button text="Create game" click={handleGameClick} /> : null}
    </div>
  );
};

export default AddPlayers;
