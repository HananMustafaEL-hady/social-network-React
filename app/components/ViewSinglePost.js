import React, { useEffect, useState, useContext } from "react";
import Page from "./Page";
import axios from "axios";
import getDate from "./DateFormatted";
import { Link, withRouter } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import DispatchContext from "../DispatchContext";

import StateContext from "../StateContext";
const ViewSinglePost = (props) => {
  const appDispatch = useContext(DispatchContext);
  const id = props.history.location.state?.id;

  console.log(props.history.location.state?.id);
  const [isLoading, setisLoading] = useState(true);
  const [post, setPost] = useState();
  const appState = useContext(StateContext);

  useEffect(() => {
    const outRequest = axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const res = await axios.get(`/post/${id}`, {
          cancelToken: outRequest.token,
        });
        console.log(res.data);
        setPost(res.data);
        setisLoading(false);
      } catch (err) {
        console.log("There was a problem or the request was cancelled");
        console.log(err);
      }
    }
    fetchPosts();
    return () => {
      outRequest.cancel();
    };
  }, [id]);
  if (isLoading)
    return (
      <Page title="...">
        <LoadingIcon />
      </Page>
    );
  function isOwner() {
    if (appState.loggedIn) {
      return JSON.parse(appState.user)?.username == post.author.username;
    }
    return false;
  }

  async function deleteHandler() {
    const areYouSure = window.confirm(
      "Do you really want to delete this post? "
    );
    if (areYouSure) {
      try {
        const res = await axios.delete(`/post/${id}`, {
          data: { token: JSON.parse(appState.user).token },
        });

        if (res.data == "Success") {
          appDispatch({
            type: "flashMessage",
            value: "Post was successfully deleted.",
          });
          props.history.push("/profile", {
            username: JSON.parse(appState.user)?.username,
          });
        }
      } catch (err) {
        console.log(err);
        alert("there was a problem");
      }
    }
  }
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={{
                pathname: "/post-edit",
                state: {
                  id: post._id,
                },
              }}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <Link
              to=""
              className="delete-post-button text-danger"
              data-tip="Delete"
              data-for="delete"
              onClick={deleteHandler}
            >
              <i className="fas fa-trash"></i>
            </Link>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link
          to={{
            pathname: "/profile",
            state: {
              username: post?.author?.username,
            },
          }}
        >
          <img className="avatar-tiny" src={post?.author?.avatar} />
        </Link>
        Posted by{" "}
        <Link
          to={{
            pathname: "/profile",
            state: {
              username: post?.author?.username,
            },
          }}
        >
          {post?.author?.username}
        </Link>{" "}
        on {getDate(post.createdDate)}
      </p>

      <div className="body-content">
        <ReactMarkdown
          source={post.body}
          allowedTypes={[
            "paragraph",
            "strong",
            "emphasis",
            "text",
            "heading",
            "list",
            "listItem",
          ]}
        >
          {post.body}
        </ReactMarkdown>
      </div>
    </Page>
  );
};

export default withRouter(ViewSinglePost);
