import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import Page from "./Page";
import axios from "axios";
import getDate from "./DateFormatted";
import { Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";
const ViewSinglePost = (props) => {
  console.log(props.history.location.state?.id);
  const [isLoading, setisLoading] = useState(true);
  const [post, setPost] = useState();
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get(
          `/post/${props.history.location.state?.id}`
        );
        console.log(res.data);
        setPost(res.data);
        setisLoading(false);
      } catch (err) {
        console.log("There was a problem");
        console.log(err);
      }
    }
    fetchPosts();
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
          <Link href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </Link>
          <Link LinklassName="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </Link>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link
          to={{
            pathname: "/yourProfile",
            state: {
              username: post.author.username,
            },
          }}
        >
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link
          to={{
            pathname: "/yourProfile",
            state: {
              username: post.author.username,
            },
          }}
        >
          {post.author.username}
        </Link>{" "}
        on {getDate(post.createdDate)}
      </p>

      <div className="body-content">{post.body}</div>
    </Page>
  );
};

export default withRouter(ViewSinglePost);
