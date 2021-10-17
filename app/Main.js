import React, { useState, useReducer, createContext } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";
//my Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";
function Main() {
  const initialState = {
    flashMessages: [],
    loggedIn: Boolean(JSON.parse(localStorage.getItem("user"))?.token),
  };
  function reducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        break;
      case "logout":
        draft.loggedIn = false;
        break;

      case "flashMessage":
        draft.flashMessages.push(action.value);
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {" "}
              {state.loggedIn ? <Home /> : <HomeGuest />}{" "}
            </Route>
            <Route path="/post" component={ViewSinglePost} />

            <Route path="/about-us" exact>
              {" "}
              <About />{" "}
            </Route>
            <Route path="/terms" exact>
              {" "}
              <Terms />{" "}
            </Route>

            <Route path="/create-post" exact>
              {" "}
              <CreatePost />{" "}
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
