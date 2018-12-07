import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import auth0Client from "./Auth";
import NavBar from "./components/NavBar/NavBar";
import Item from "./components/Item/Item";
import Items from "./components/Items/Items";
import Callback from "./Callback";
import CreateItem from "./components/CreateItem/CreateItem";
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
        <Route exact path="/" component={Items} />
        <Route exact path="/item/:itemId" component={Item} />
        <Route exact path="/callback" component={Callback} />
        <SecuredRoute
          path="/create-item"
          component={CreateItem}
          checkingSession={this.state.checkingSession}
        />
      </div>
    );
  }
}

export default withRouter(App);
