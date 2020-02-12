import React, { Component } from "react";
import MainView from "./MainView";
import NewGame from "./NewGame";
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
      // helloes: [],
      playerName: "",
      playerKey: null,
      gameType: null,
      gameKey: null,
      gameName: "",
      gamePassword: null,
      isFounder: false,
      slots: null,
      otherPlayers: []
    };
    // this.addHello.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {}

  // makeHello = () => {
  //   return this.state.helloes.map((hello, index) => <p key={index}>{hello}</p>);
  // };

  // getHelloes = () => {
  //   fetch("/hello")
  //     .then(resp => resp.json())
  //     .then(resp => {
  //       console.log(resp);
  //       const helloes = resp.msg;
  //       this.setState({ helloes: helloes });
  //     });
  // };

  // addHello = data => {
  //   fetch("/hello", {
  //     method: "post",
  //     body: JSON.stringify(JSON.stringify(data)),
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   })
  //     .then(resp => resp.json())
  //     .then(resp => {
  //       const helloes = resp.msg;
  //       this.setState({ helloes: helloes });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  resetGameType = () => {
    if (this.state.gameType) {
      console.log("wtf");
      this.setState({ gameType: null });
    }
  };

  inputChangeHandle = event => {
    const playerName = event.target.value;
    this.setState(() => ({
      playerName
    }));
  };

  btnClickHandle = type => {
    if (!this.state.playerName) return;
    if (this._validType(type)) {
      this.setState(() => ({
        gameType: type
      }));
    }
  };

  setPlayerKey = playerKey => {
    this.setState({ playerKey });
  };

  redirect = () => {
    // return this._validType(this.state.gameType) ? (
    //   <Redirect push to="/new-game" />
    // ) : null;
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

  render() {
    console.log("render");
    return (
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
              />
            )}
          ></Route>
          <Route
            path="/game-management"
            render={() => (
              <GameManagement
                playerName={this.state.playerName}
                gameType={this.state.gameType}
                setKeys={this.setKeys}
              />
            )}
          ></Route>
          <Route path="/waiting-for-players" component={null}></Route>
          <Route
            path="/new-game"
            render={() => (
              <NewGame
                hasKeys={this.checkKeys()}
                gameName={this.state.gameName}
                founderName={this.state.playerName}
                type={this.state.gameType}
                slots={this.state.slots}
                password={this.state.gamePassword}
                setKeys={this.setKeys}
              />
            )}
          ></Route>
          <Route path="/add-players" component={null}></Route>
          <Route path="/game" component={null}></Route>
        </Switch>
        {/* <div>
          <button
            onClick={this.addHello.bind(this, {
              hello: `Hello-${this.state.helloes.length}`
            })}
          >
            Add hello!
          </button>
          <div className="App">
            {this.state.helloes.length && this.makeHello()}
          </div>
        </div> */}
      </Router>
    );
  }
}

export default App;
