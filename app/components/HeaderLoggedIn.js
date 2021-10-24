import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogout() {
    appDispatch({ type: "logout" });
  }
  function handleSearch(e) {
    e.preventDefault();

    appDispatch({ type: "openSearch" });
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <Link
        to="#"
        onClick={handleSearch}
        className="text-white mr-2 header-search-icon"
        data-for="search"
        data-tip="Search"
      >
        <i className="fas fa-search"></i>
      </Link>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />{" "}
      <span
        className={
          "mr-2 header-chat-icon " +
          (appState.unreadChatCount ? "text-danger" : "text-white")
        }
        data-for="chat"
        data-tip="Chat"
        onClick={() => appDispatch({ type: "toggleChat" })}
      >
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? (
          <span className="chat-count-badge text-white">
            {" "}
            {appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}
          </span>
        ) : (
          " "
        )}
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
      <Link
        to={{
          pathname: "/profile",
          state: {
            username: JSON.parse(appState.user)?.username,
          },
        }}
        className="mr-2"
        data-for="profile"
        data-tip="My Profile"
      >
        <img
          className="small-header-avatar"
          // src={JSON.parse(localStorage.getItem("user"))?.avatar}
          src={JSON.parse(appState.user)?.avatar}
        />
      </Link>
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />{" "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
}

export default HeaderLoggedIn;
