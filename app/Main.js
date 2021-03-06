import React, { useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL =
  process.env.BACKENDURL || "https://myappreact12.herokuapp.com";
import { CSSTransition } from "react-transition-group";
//my Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
const CreatePost = React.lazy(() => import("./components/CreatePost"));
import FlashMessages from "./components/FlashMessages";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));
import LoadingIcon from "./components/LoadingIcon";
function Main() {
  const initialState = {
    flashMessages: [],
    loggedIn: Boolean(JSON.parse(localStorage.getItem("user"))?.token),
    user: localStorage.getItem("user"),
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
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
      case "incrementUnreadChatCount":
        draft.unreadChatCount++;
        break;
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0;
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
          <Suspense fallback={<LoadingIcon />}>
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
          </Suspense>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
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
