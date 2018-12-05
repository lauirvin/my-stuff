import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import auth0Client from "../../Auth";
import axios from "axios";

import UploadImage from "./UploadImage";

class CreateRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      title: "",
      description: ""
    };
  }

  updateDescription(value) {
    this.setState({
      description: value
    });
  }

  updateTitle(value) {
    this.setState({
      title: value
    });
  }

  async submit() {
    this.setState({
      disabled: true
    });

    await axios.post(
      "http://localhost:8081",
      {
        title: this.state.title,
        description: this.state.description
      },
      {
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      }
    );

    this.props.history.push("/");
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3>Create new recipe</h3>
              </div>
              <div className="card-body text-left">
                <div className="form-group">
                  <label htmlFor="title">Title:</label>
                  <input
                    disabled={this.state.disabled}
                    type="text"
                    onBlur={e => {
                      this.updateTitle(e.target.value);
                    }}
                    className="form-control"
                    placeholder="Enter recipe title"
                  />
                </div>
                <UploadImage />
                <div className="form-group">
                  <label htmlFor="description">Description:</label>
                  <input
                    disabled={this.state.disabled}
                    type="text"
                    onBlur={e => {
                      this.updateDescription(e.target.value);
                    }}
                    className="form-control"
                    placeholder="Please enter the description of your recipe"
                  />
                </div>
                <button
                  disabled={this.state.disabled}
                  className="btn dark-space"
                  onClick={() => {
                    this.submit();
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateRecipe);
