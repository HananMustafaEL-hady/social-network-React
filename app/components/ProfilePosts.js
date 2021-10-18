import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import getDate from "./DateFormatted";
import LoadingIcon from "./LoadingIcon";
const ProfilePosts = (props) => {
  const [isLoading, setisLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get(`/profile/${props.username}/posts`);
        setPosts(res.data);
        setisLoading(false);
      } catch (err) {
        console.log("There was a problem");
      }
    }
    fetchPosts();
  }, []);
  if (isLoading) return <LoadingIcon />;

  return (
    <div className="list-group">
      {posts?.map((post) => {
        return (
          <Link
            key={post._id}
            to={{
              pathname: "/post",
              state: { id: post._id },
            }}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={post.author.avatar} />{" "}
            <strong>{post.title}</strong>{" "}
            <span className="text-muted small">
              on {getDate(post.createdDate)}{" "}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default ProfilePosts;
