import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";
const ProfileFollow = (props) => {
  const [isLoading, setisLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  console.log(props);
  useEffect(() => {
    const outRequest = axios.CancelToken.source();

    async function fetchPosts() {
      try {
        const res = await axios.get(
          `/profile/${props.username}/${props.action}`,
          {
            cancelToken: outRequest.token,
          }
        );
        setPosts(res.data);
        setisLoading(false);
      } catch (err) {
        console.log("There was a problem");
      }
    }
    fetchPosts();
    return () => {
      outRequest.cancel();
    };
  }, [props.username]);
  if (isLoading) return <LoadingIcon />;

  return (
    <div className="list-group">
      {posts?.map((follower, index) => {
        return (
          <Link
            key={index}
            to={{
              pathname: "/profile",
              state: {
                username: follower.username,
              },
            }}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={follower.avatar} /> {""}
            {follower.username}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileFollow;
