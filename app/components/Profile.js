import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router";
import Page from "./Page";
import axios from "axios";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
import { useImmer } from "use-immer";
function Profile() {
  const location = useLocation();
  const { username } = location.state;
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,

    profileData: {
      profileUsername: "",
      profileAvatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSRsfOcYt3SR9V9alSN7mg-z2Q_STmrA94q4YJ44JsT62ykMKgahBOIi-7--RiFrY-0N0&usqp=CAU",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" },
    },
  });
  useEffect(() => {
    const outRequest = axios.CancelToken.source();

    async function fetchData() {
      try {
        const res = await axios.post(
          `/profile/${username}`,
          {
            token: JSON.parse(appState.user)?.token,
          },
          { cancelToken: outRequest.token }
        );
        console.log(res.data);
        setState((draft) => {
          draft.profileData = res.data;
        });
      } catch (e) {
        console.log(e);
        console.log("There was a problem or the request was cancelled");
      }
    }
    fetchData();
    return () => {
      outRequest.cancel();
    };
  }, [username]);
  /////////////////startFollowing////////////////////////////
  function startFollowing() {
    setState((draft) => {
      draft.startFollowingRequestCount++;
    });
  }
  useEffect(() => {
    if (state.startFollowingRequestCount) {
      const outRequest = axios.CancelToken.source();

      setState((draft) => {
        draft.followActionLoading = true;
      });
      async function fetchData() {
        try {
          const res = await axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: JSON.parse(appState.user)?.token,
            },
            { cancelToken: outRequest.token }
          );

          setState((draft) => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (e) {
          console.log(e);
          console.log("There was a problem or the request was cancelled");
        }
      }
      fetchData();
      return () => {
        outRequest.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);

  ///////////////////stopFollowing//////////////////////////
  function stopFollowing() {
    setState((draft) => {
      draft.stopFollowingRequestCount++;
    });
  }
  useEffect(() => {
    const outRequest = axios.CancelToken.source();
    if (state.stopFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      async function fetchData() {
        try {
          const res = await axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: JSON.parse(appState.user)?.token,
            },
            { cancelToken: outRequest.token }
          );

          setState((draft) => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (e) {
          console.log(e);
          console.log("There was a problem or the request was cancelled");
        }
      }
      fetchData();
      return () => {
        outRequest.cancel();
      };
    }
  }, [state.stopFollowingRequestCount]);

  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />{" "}
        {state.profileData.profileUsername}
        {appState.loggedIn &&
          !state.profileData.isFollowing &&
          JSON.parse(appState.user)?.username !=
            state.profileData.profileUsername &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={startFollowing}
              disabled={state.followActionLoading}
              className="btn btn-primary btn-sm ml-2"
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {appState.loggedIn &&
          state.profileData.isFollowing &&
          JSON.parse(appState.user)?.username !=
            state.profileData.profileUsername &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={stopFollowing}
              disabled={state.followActionLoading}
              className="btn btn-danger btn-sm ml-2"
            >
              Unfollowing <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePosts username={username} />
    </Page>
  );
}

export default Profile;
