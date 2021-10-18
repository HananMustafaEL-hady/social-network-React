import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import Page from "./Page";
import axios from "axios";
import getDate from "./DateFormatted";
import { Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
const ViewSinglePost = (props) => {
  console.log(props.history.location.state?.id);
  const [isLoading, setisLoading] = useState(true);
  const [post, setPost] = useState();
  useEffect(() => {
    const outRequest = axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const res = await axios.get(
          `/post/${props.history.location.state?.id}`,
          { cancelToken: outRequest.token }
        );
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
  }, []);
  if (isLoading)
    return (
      <Page title="...">
        <LoadingIcon />
      </Page>
    );
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
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
          >
            <i className="fas fa-trash"></i>
          </Link>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link
          to={{
            pathname: "/yourProfile",
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
            pathname: "/yourProfile",
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
