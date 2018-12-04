import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Recipes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: null,
    };
  }

  async componentDidMount() {
    const recipes = (await axios.get('http://localhost:8081/')).data;
    this.setState({
      recipes,
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <Link to="/create-recipe">
            <div className="card text-white bg-secondary mb-3">
              <div className="card-body">
                <h4 className="card-title">+ New Recipe</h4>
                <p className="card-text">Click here to add your own recipe!</p>
              </div>
            </div>
          </Link>
          {this.state.recipes === null && <p>Loading recipes...</p>}
          {
            this.state.recipes && this.state.recipes.map(recipe => (
              <div key={recipe.id} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/recipe/${recipe.id}`}>
                  <div className="card text-white bg-success mb-3">
                    <div className="card-header">Answers: {recipe.answers}</div>
                    <div className="card-body">
                      <h4 className="card-title">{recipe.title}</h4>
                      <p className="card-text">{recipe.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default Recipes;
