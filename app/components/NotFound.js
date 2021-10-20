import React from "react";
import Page from "./Page";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <Page title="Not Found">
      <div className="text-center"></div>
      <h2>Whoops, We can not find that page</h2>
      <p className="lead rext-muted">
        You can always visit the <Link to="/"> homepage</Link> to get a fresh
        start.{" "}
      </p>
    </Page>
  );
};

export default NotFound;
