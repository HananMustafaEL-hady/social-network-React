import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import Post from "./Post";
import LoadingIcon from "./LoadingIcon";
const ProfilePosts = (props) => {
  const [isLoading, setisLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const outRequest = axios.CancelToken.source();

    async function fetchPosts() {
      try {
        const res = await axios.get(`/profile/${props.username}/posts`, {
          cancelToken: outRequest.token,
        });
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
      {posts?.map((post) => {
        return <Post noAuthor={true} post={post} key={post._id} />;
      })}
    </div>
  );
};

export default ProfilePosts;
