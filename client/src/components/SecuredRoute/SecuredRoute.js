import React from "react";
import { Route } from "react-router-dom";
import auth0Client from "../../Auth";

function SecuredRoute(props) {
  const { component: Component, path, checkingSession } = props;
  return (
    <Route
      path={path}
      render={() => {
        if (checkingSession) // If user is not authenticated: 
          return (
            <div className="container">
              <div className="text-center">
                <h2 className="error-message-padding">
                  Please sign in to create a new recipe
                </h2>
                <button className="btn dark-space" onClick={auth0Client.signIn}>
                  Sign In
                </button>
              </div>
            </div>
          );

        if (!auth0Client.isAuthenticated()) {
          auth0Client.signIn();
          return <div />;
        }
        return <Component />;
      }}
    />
  );
}

export default SecuredRoute;
