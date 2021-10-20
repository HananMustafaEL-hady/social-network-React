import React, { useEffect, useContext } from "react";
import { withRouter } from "react-router";
import Page from "./Page";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";
import { useImmerReducer } from "use-immer";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

const EditPost = (props) => {
  //   console.log(props.history.location.state?.id);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const originalState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: props.history.location.state?.id,
    sendCount: 0,
  };
  function Reducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
      case "titleChange":
        draft.title.value = action.value;
        return;

      case "bodyChange":
        draft.body.value = action.value;
        return;

      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
        }

        return;
      case "savedRequestStarted":
        draft.isSaving = true;

        return;
      case "savedRequestFinished":
        draft.isSaving = false;
        return;
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "You must provide a title";
        } else {
          draft.title.hasErrors = false;
        }
        return;
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "You must provide body content";
        } else {
          draft.body.hasErrors = false;
        }
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(Reducer, originalState);
  function submitHandler(e) {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });

    dispatch({ type: "submitRequest" });
  }
  useEffect(() => {
    const outRequest = axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const res = await axios.get(`/post/${state.id}`, {
          cancelToken: outRequest.token,
        });
        console.log(res.data);
        dispatch({ type: "fetchComplete", value: res.data });
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

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "savedRequestStarted" });
      const outRequest = axios.CancelToken.source();
      async function fetchPosts() {
        try {
          const res = await axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: JSON.parse(appState.user)?.token,
            },

            {
              cancelToken: outRequest.token,
            }
          );
          console.log(res.data);
          dispatch({ type: "savedRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Congrats,post updated" });
        } catch (err) {
          console.log("There was a problem or the request was cancelled");
          console.log(err);
        }
      }
      fetchPosts();
      return () => {
        outRequest.cancel();
      };
    }
  }, [state.sendCount]);
  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingIcon />
      </Page>
    );
  return (
    <Page title="Create New Post">
      <Link
        to={{
          pathname: "/post",
          state: { id: state.id },
        }}
        className="btn next round"
      >
        &#8249;{" "}
      </Link>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={state.title.value}
            onChange={(e) =>
              dispatch({ type: "titleChange", value: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "titleRules", value: e.target.value })
            }
          />

          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}{" "}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
            onChange={(e) =>
              dispatch({ type: "bodyChange", value: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "bodyRules", value: e.target.value })
            }
          ></textarea>
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}{" "}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Updates
        </button>
      </form>
    </Page>
  );
};

export default withRouter(EditPost);
