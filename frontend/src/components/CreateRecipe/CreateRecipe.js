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
      description: "",
      ingredients: ""
    };
  }

  updateIngredients(value) {
    this.setState({
      ingredients: value
    });
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
    var title = document.getElementById("title");
    var description = document.getElementById("descriptionBox");
    var ingredients = document.getElementById("ingredientsBox");

    if (title && !title.value) {
      alert("Please fill in the missing blanks!");
    } else if (description && !description.value) {
      alert("Please fill in the missing blanks!");
    } else if (ingredients && !ingredients.value) {
      alert("Please fill in the missing blanks!");
    } else {
      this.setState({
        disabled: true
      });
      await axios.post(
        "http://localhost:8081",
        {
          title: this.state.title,
          description: this.state.description,
          ingredients: this.state.ingredients
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
        }
      );
      this.props.history.push("/");
    }
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
                    id="title"
                    maxLength="30"
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
                  <textarea
                    id="descriptionBox"
                    disabled={this.state.disabled}
                    type="text"
                    onBlur={e => {
                      this.updateDescription(e.target.value);
                    }}
                    className="form-control"
                    placeholder="Enter the description of your recipe"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ingredients">Ingredients:</label>
                  <textarea
                    id="ingredientsBox"
                    disabled={this.state.disabled}
                    type="text"
                    onBlur={e => {
                      this.updateIngredients(e.target.value);
                    }}
                    className="form-control"
                    placeholder="Enter the ingredients of your recipe"
                  />
                </div>
                <button
                  id="submitButton"
                  disabled={this.state.disabled}
                  className="btn dark-space"
                  onClick={() => {
                    this.submit();
                    document.getElementById("uploadButton").click();
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
