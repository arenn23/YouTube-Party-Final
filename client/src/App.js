import React, { Component } from "react";
import Routing from "./components/Routing";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { ConfigureStore } from "./redux/configureStore";
import { Provider } from "react-redux";

const store = ConfigureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            {/* returns component with all routes in it */}
            <Routing />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
