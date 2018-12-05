import React, { Component } from "react";
import axios from "axios";
import SubmitComment from "./SubmitComment";
import auth0Client from "../../Auth";

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe: null,
      image: null
    };

    this.submitComment = this.submitComment.bind(this);
  }

  async componentDidMount() {
    await this.refreshRecipe();
  }

  async refreshRecipe() {
    const {
      match: { params }
    } = this.props;
    const recipe = (await axios.get(`http://localhost:8081/${params.recipeId}`))
      .data;
    const image = (await axios.get(
      `http://localhost:8081/upload/${params.recipeId}`
    )).data;
    this.setState({
      recipe,
      image
    });
    console.log(image);
    console.log(recipe);
  }

  async submitComment(comment) {
    await axios.post(
      `http://localhost:8081/comment/${this.state.recipe.id}`,
      {
        comment
      },
      {
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      }
    );
    await this.refreshRecipe();
  }

  render() {
    const { recipe, image } = this.state;

    if ((recipe, image === null)) return <p>Loading ...</p>;
    const imagePath =
      "http://localhost:8081/" + image.file.replace("public/", "");

    console.log(imagePath);
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
            <h1 className="display-3">{recipe.title}</h1>
            <div className="recipe-image-container">
              <img className="" src={imagePath} />
            </div>
            <hr className="my-4"/>
            <p className="lead">{recipe.description}</p>
            <hr className="my-4" />
            <SubmitComment
              recipeId={recipe.id}
              submitComment={this.submitComment}
            />
            <p>Comments:</p>
            {recipe.comments.map((comment, idx) => (
              <p className="lead" key={idx}>
                {comment.comment}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Recipe;
