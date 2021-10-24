import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import getDate from "./DateFormatted";

const Post = ({ post, onClick, noAuthor }) => {
  return (
    <Link
      to={{
        pathname: "/post",
        state: { id: post._id },
      }}
      className="list-group-item list-group-item-action"
      onClick={onClick}
    >
      <img className="avatar-tiny" src={post.author.avatar} />{" "}
      <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {!noAuthor && <Fragment> by {post.author.username}</Fragment>}
        on {getDate(post.createdDate)}{" "}
      </span>
    </Link>
  );
};

export default Post;
