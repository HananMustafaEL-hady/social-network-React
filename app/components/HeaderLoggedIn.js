import React from "react";
import { Link } from "react-router-dom";
function HeaderLoggedIn(props) {
  function handleLogout() {
    props.setLoggedIn(false);
    localStorage.removeItem("user");
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <Link to="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </Link>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <Link to="#" className="mr-2">
        <img
          className="small-header-avatar"
          src={JSON.parse(localStorage.getItem("user"))?.avatar}
        />
      </Link>
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
