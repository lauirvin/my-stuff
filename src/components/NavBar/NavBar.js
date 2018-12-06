import React from "react";
import { Link, withRouter } from "react-router-dom";
import auth0Client from "../../Auth";

import logo from '../../media/logo.png'

function NavBar(props) {

  // When user clicks sign out button, auth0 signs out:
  const signOut = () => {
    auth0Client.signOut();
    props.history.replace("/");
  };

  return (
    <nav className="navbar-light bg-primary fixed-top">
      <div className="navbar nav-container">
        <Link className="navbar-brand" to="/">
          <img alt="logo" className="nav-bar-logo" src={logo} />
        </Link>
        {!auth0Client.isAuthenticated() && ( // Run when user is authenticated to auth0
          <button className="btn dark-space" onClick={auth0Client.signIn}>
            Sign In
          </button>
        )}
        {auth0Client.isAuthenticated() && (
          <div>
            {/* Fetch and display users name:*/}
            <label className="mr-2 text-white">
              {auth0Client.getProfile().name} 
            </label>
            <button
              className="btn dark-space"
              onClick={() => {
                signOut();
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default withRouter(NavBar);
