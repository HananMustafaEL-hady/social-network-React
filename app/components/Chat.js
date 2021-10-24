import React, { Fragment, useContext, useEffect, useRef } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import io from "socket.io-client";
const socket = io("http://localhost:8080");
const Chat = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const chatField = useRef(null);
  const chatLog = useRef(null);

  const user = JSON.parse(appState.user);

  console.log(user);
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [],
  });

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearUnreadChatCount" });
    }
  }, [appState.isChatOpen]);

  function handleFieldChange(e) {
    setState((draft) => {
      draft.fieldValue = e.target.value;
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    //send message to chat server

    socket.emit("chatFromBrowser", {
      message: state.fieldValue,
      token: user.token,
    });

    setState((draft) => {
      // add message to state collection of messages
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: user.username,
        avatar: user.avatar,
      });
      draft.fieldValue = "";
    });
  }

  useEffect(() => {
    socket.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message);
      });
    });
  }, []);
  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (state.chatMessages.length && !appState.isChatOpen) {
      appDispatch({ type: "incrementUnreadChatCount" });
    }
  }, [state.chatMessages]);
  return (
    <Fragment>
      <div
        id="chat-wrapper"
        className={
          "chat-wrapper  shadow border-top border-left border-right " +
          (appState.isChatOpen ? "chat-wrapper--is-visible" : "")
        }
      >
        <div className="chat-title-bar bg-primary">
          Chat
          <span
            onClick={() => appDispatch({ type: "closeChat" })}
            className="chat-title-bar-close"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
        <div id="chat" className="chat-log" ref={chatLog}>
          {state.chatMessages.map((message, index) => {
            if (message.username == user.username) {
              return (
                <div className="chat-self" key={index}>
                  <div className="chat-message">
                    <div className="chat-message-inner">{message.message}</div>
                  </div>
                  <img
                    className="chat-avatar avatar-tiny"
                    src={message.avatar}
                  />
                </div>
              );
            }
            return (
              <div className="chat-other" key={index}>
                <Link
                  to={{
                    pathname: "/profile",
                    state: {
                      username: message.username,
                    },
                  }}
                >
                  <img className="avatar-tiny" src={message.avatar} />
                </Link>
                <div className="chat-message">
                  <div className="chat-message-inner">
                    <Link
                      to={{
                        pathname: "/profile",
                        state: {
                          username: message.username,
                        },
                      }}
                    >
                      <strong>{message.username}: </strong>
                    </Link>
                    {message.message}{" "}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <form
          id="chatForm"
          className="chat-form border-top"
          onSubmit={handleSubmit}
        >
          <input
            ref={chatField}
            type="text"
            className="chat-field"
            id="chatField"
            placeholder="Type a message…"
            autoComplete="off"
            value={state.fieldValue}
            onChange={handleFieldChange}
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Chat;
