import React, { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router";
import Page from "./Page";
import axios from "axios";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
function Profile() {
  const location = useLocation();
  const { username } = location.state;
  const appState = useContext(StateContext);
  const [profileData, setProfileData] = useState({
    profileUsername: "",
    profileAvatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSRsfOcYt3SR9V9alSN7mg-z2Q_STmrA94q4YJ44JsT62ykMKgahBOIi-7--RiFrY-0N0&usqp=CAU",
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.post(`/profile/${username}`, {
          token: JSON.parse(appState.user)?.token,
        });
        // console.log(res.data);
        setProfileData(res.data);
      } catch (e) {
        console.log(e);
        console.log("There was a problem");
      }
    }
    fetchData();
  }, []);
  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} />{" "}
        {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePosts username={username} />
    </Page>
  );
}

export default Profile;
