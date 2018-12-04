import React, { Component } from "react";

export default class Error extends Component {
  render() {
    return (
      <div className="container">
        <div className="text-center">
          <h2 className="error-message-padding">
            ERROR: Page not found!
          </h2>
        </div>
      </div>
    );
  }
}
