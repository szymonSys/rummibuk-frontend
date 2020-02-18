import React, { Component } from "react";
import MainView from "./MainView";
import NewGame from "./NewGame";
import WaitingView from "./WaitingView";
import AddPlayers from "./AddPlayers";
import GameView from "./GameView";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  NavLink,
  Redirect
} from "react-router-dom";
import "./App.css";
import GameManagement from "./GameManagement";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: "",
      playerKey: null,
      gameType: null,
      gameKey: null,
      gameName: "",
      gamePassword: "",
      isFounder: false,
      slots: null,
      gamePlayers: [],
      inLobby: false,
      inGame: false
    };
  }

  componentDidMount() {
    window.onbeforeunload = this.logit;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.inGame !== this.state.inGame) {
      window.sessionStorage.setItem("inGame", this.state.inGame);
    }
    if (prevState.inLobby !== this.state.inLobby) {
      window.sessionStorage.setItem("inLobby", this.state.inLobby);
    }
  }

  resetGameType = () => {
    if (this.state.gameType) {
      this.setState({ gameType: null });
    }
  };

  inputChangeHandle = event => {
    const playerName = event.target.value;
    this.setState(() => ({
      playerName
    }));
  };

  handleChange = event => {
    const value = event.target.value;
    const key = event.target.name;
    this.setState({ [key]: value });
  };

  btnClickHandle = type => {
    if (!this.state.playerName) return;
    if (this._validType(type)) {
      this.setState(() => ({
        gameType: type
      }));
    }
  };

  setIsFounder = () => {
    this.setState({ isFounder: true });
  };

  setPlayerKey = playerKey => {
    this.setState({ playerKey });
  };

  setGamePlayers = (...gamePlayers) => {
    this.setState({
      gamePlayers,
      slots: gamePlayers.length
    });
  };

  redirect = () => {
    switch (this.state.gameType) {
      case "multiplayer":
        return <Redirect push to="/game-management" />;
      case "singleplayer":
        return <Redirect push to="/add-players" />;
      case "localgame":
        return <Redirect push to="/add-players" />;
      default:
        return null;
    }
  };

  setKeys = (playerKey, gameKey) => {
    if (!(typeof playerKey && typeof gameKey)) {
      throw new Error("invalid type of player key. It must be string.");
    }
    this.setState({ playerKey, gameKey });
  };

  _validType(type) {
    return (
      type === "multiplayer" || type === "singleplayer" || type === "localgame"
    );
  }

  checkKeys = () => {
    if (this.state.gameKey && this.state.playerKey) return true;
    return false;
  };

  setSlotsAndGameName = (gameName, slots) => {
    if (!this.state.gameName) this.setState(() => ({ gameName }));
    if (!this.state.slots) this.setState(() => ({ slots: parseInt(slots) }));
  };

  updatePlayersData = (...gamePlayers) => {
    this.setState({ gamePlayers });
  };

  setInLobby = () => this.setState({ inLobby: true });
  setInGame = () => {
    const newState = { inGame: true };
    if (this.state.inLobby) newState.inLobby = false;
    this.setState(newState);
  };

  logit = event => {
    event.preventDefault();
    console.log("bambam");
  };

  render() {
    return (
      <div>
        <Router>
          {this.redirect()}
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <MainView
                  checkKeys={this.checkKeys}
                  resetGameType={this.resetGameType}
                  inputChangeHandle={this.inputChangeHandle}
                  btnClickHandle={this.btnClickHandle}
                  playerName={this.state.playerName}
                  gameKey={this.state.gameKey}
                />
              )}
            ></Route>
            <Route
              path="/game-management"
              render={() => (
                <GameManagement
                  inGame={this.state.inGame}
                  setInLobby={this.setInLobby}
                  playerName={this.state.playerName}
                  gameType={this.state.gameType}
                  gameName={this.state.gameName}
                  gamePassword={this.state.gamePassword}
                  gameKey={this.state.gameKey}
                  slotsChoice={this.state.slots}
                  setKeys={this.setKeys}
                  handleChange={this.handleChange}
                />
              )}
            ></Route>
            <Route
              path="/waiting-for-players"
              render={() => (
                <WaitingView
                  setInGame={this.setInGame}
                  gameKey={this.state.gameKey}
                  playerKey={this.state.playerKey}
                  updateGameState={this.setSlotsAndGameName}
                  inLobby={this.state.inLobby}
                  inGame={this.state.inGame}
                />
              )}
            ></Route>
            <Route
              path="/new-game"
              render={() => (
                <NewGame
                  gameName={this.state.gameName}
                  founderName={this.state.playerName}
                  type={this.state.gameType}
                  slots={this.state.slots}
                  password={this.state.gamePassword}
                  founderKey={this.state.playerKey}
                  gameKey={this.state.gameKey}
                  players={[...this.state.gamePlayers]}
                  inLobby={this.state.inLobby}
                  inGame={this.state.inGame}
                  hasKeys={this.checkKeys()}
                  setInLobby={this.setInLobby}
                  setInGame={this.setInGame}
                  updatePlayersData={this.updatePlayersData}
                  setKeys={this.setKeys}
                  setIsFounder={this.setIsFounder}
                />
              )}
            ></Route>
            <Route
              path="/add-players"
              render={() => (
                <AddPlayers
                  gameType={this.state.gameType}
                  founderName={this.state.playerName}
                  setGamePlayers={this.setGamePlayers}
                  gameKey={this.state.gameKey}
                />
              )}
            ></Route>
            <Route
              path="/game"
              render={() => (
                <GameView
                  gameKey={this.state.gameKey}
                  playerKey={this.state.playerKey}
                  inGame={this.state.inGame}
                />
              )}
            ></Route>
            )
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
