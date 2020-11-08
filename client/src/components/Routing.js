import React, { Component } from "react";
import HomePage from "./HomePage";
import CreateRoom from "./CreateRoom";
import { Switch, Route } from "react-router-dom";
import Room from "./Room";

class Routing extends Component {
  render() {
    return (
      <>
        <Switch className="body">
          <Route exact path="/" render={() => <HomePage />} />
          <Route exact path="/createroom" render={(props) => <CreateRoom />} />
          <Route exact path="/room" render={(props) => <Room />} />
        </Switch>
      </>
    );
  }
}

export default Routing;
