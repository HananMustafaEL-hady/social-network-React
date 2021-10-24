import React, { useState, useReducer, createContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080";
import { CSSTransition } from "react-transition-group";
//my Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Search from "./components/Search";
import Chat from "./components/Chat";
function Main() {
  const initialState = {
    flashMessages: [],
    loggedIn: Boolean(JSON.parse(localStorage.getItem("user"))?.token),
    user: localStorage.getItem("user"),
    isSearchOpen: false,
    isChatOpen: false,
  };
  function reducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        break;
      case "logout":
        draft.loggedIn = false;
        break;

      case "flashMessage":
        draft.flashMessages.push(action.value);
        break;

      case "openSearch":
        draft.isSearchOpen = true;
        break;

      case "closeSearch":
        draft.isSearchOpen = false;
        break;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        break;
      case "closeChat":
        draft.isChatOpen = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("user", state.user);
    } else {
      localStorage.removeItem("user");
    }
  }, [state.loggedIn]);

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
            <Route path="/profile" exact>
              {" "}
              <Profile />{" "}
            </Route>
            <Route path="/profile/followers" exact>
              {" "}
              <Profile />{" "}
            </Route>
            <Route path="/profile/following" exact>
              {" "}
              <Profile />{" "}
            </Route>
            <Route path="/post-edit" exact>
              {" "}
              <EditPost />{" "}
            </Route>
            <Route path="*" component={NotFound} />
          </Switch>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <Search />
          </CSSTransition>
          <Chat />
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
