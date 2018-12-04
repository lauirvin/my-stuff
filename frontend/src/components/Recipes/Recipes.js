import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Recipes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: null
    };
  }

  async componentDidMount() {
    const recipes = (await axios.get("http://localhost:8081/")).data;

    this.setState({
      recipes
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-4 col-lg-3">
            <Link to="/create-recipe">
              <div className="card text-white light-blue mb-3">
                <div className="card-header">
                <h3>+ New Recipe</h3> 
                </div>
                <div className="card-body">
                  <p className="card-text">Click here to add your own recipe!</p>
                </div>
              </div>
            </Link>
          </div>
          {this.state.recipes === null && <p>Loading recipes...</p>}
          {this.state.recipes &&
            this.state.recipes.map(recipe => (
              <div key={recipe.id} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/recipe/${recipe.id}`}>
                  <div className="card text-white mb-3 moonstone-blue">
                    <div className="card-header">
                      Comments: {recipe.comments}
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">{recipe.title}</h4>
                      <p className="card-text">{recipe.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default Recipes;
