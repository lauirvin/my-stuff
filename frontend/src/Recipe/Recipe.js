import React, {Component} from 'react';
import axios from 'axios';
import SubmitAnswer from './SubmitAnswer';
import auth0Client from '../Auth';

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe: null,
    };

    this.submitAnswer = this.submitAnswer.bind(this);
  }

  async componentDidMount() {
    await this.refreshRecipe();
  }

  async refreshRecipe() {
    const { match: { params } } = this.props;
    const recipe = (await axios.get(`http://localhost:8081/${params.recipeId}`)).data;
    this.setState({
      recipe,
    });
  }

  async submitAnswer(answer) {
    await axios.post(`http://localhost:8081/answer/${this.state.recipe.id}`, {
      answer,
    }, {
      headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
    });
    await this.refreshRecipe();
  }

  render() {
    const {recipe} = this.state;
    if (recipe === null) return <p>Loading ...</p>;
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
            <h1 className="display-3">{recipe.title}</h1>
            <p className="lead">{recipe.description}</p>
            <hr className="my-4" />
            <SubmitAnswer recipe={recipe.id} submitAnswer={this.submitAnswer} />
            <p>Answers:</p>
            {
              recipe.answers.map((answer, idx) => (
                <p className="lead" key={idx}>{answer.answer}</p>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Recipe;
