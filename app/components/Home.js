import React, { Fragment, useContext, useEffect } from "react";
import Page from "./Page";
import StateContext from "../StateContext";
import { useImmer } from "use-immer";
import axios from "axios";
import LoadingIcon from "./LoadingIcon";
import FeedEmpty from "./FeedEmpty";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import getDate from "./DateFormatted";
import Post from "./Post";

function Home() {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });
  const appDispatch = useContext(DispatchContext);

  useEffect(() => {
    const outRequest = axios.CancelToken.source();

    async function fetchData() {
      try {
        const res = await axios.post(
          "/getHomeFeed",
          {
            token: JSON.parse(appState.user)?.token,
          },
          { cancelToken: outRequest.token }
        );
        console.log(res.data);
        setState((draft) => {
          draft.isLoading = false;
          draft.feed = res.data;
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
  }, []);

  if (state.isLoading) {
    return <LoadingIcon />;
  }
  return (
    <Page title="Your Feed">
      {state.feed.length == 0 ? (
        <FeedEmpty />
      ) : (
        <Fragment>
          <h2 className="text-center mb-4">The Latest From Those You Follow</h2>
          <div className="list-group">
            {state.feed?.map((post) => {
              return <Post post={post} key={post._id} />;
            })}
          </div>
        </Fragment>
      )}
    </Page>
  );
}

export default Home;
