import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import auth0Client from "./Auth";
import NavBar from "./components/NavBar/NavBar";
import Recipe from "./components/Recipe/Recipe";
import Recipes from "./components/Recipes/Recipes";
import Callback from "./Callback";
import CreateRecipe from "./components/CreateRecipe/CreateRecipe";
import SecuredRoute from "./components/SecuredRoute/SecuredRoute";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true
    };
  }

  async componentDidMount() {
    if (this.props.location.pathname === "/callback") {
      this.setState({ checkingSession: false });
      return;
    }
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== "login_required") console.log(err.error);
    }
    this.setState({ checkingSession: false });
  }

  render() {
    return (
      <div>
        <NavBar />
        <Route exact path="/" component={Recipes} />
        <Route exact path="/recipe/:recipeId" component={Recipe} />
        <Route exact path="/callback" component={Callback} />
        <SecuredRoute
          path="/create-recipe"
          component={CreateRecipe}
          checkingSession={this.state.checkingSession}
        />
      </div>
    );
  }
}

export default withRouter(App);
