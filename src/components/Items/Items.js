import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: null // Empty items
    };
  }

  async componentDidMount() {
    // Fetch items from server
    const items = (await axios.get("http://localhost:8081/")).data;
    this.setState({
      items // Update items with data fetched from server
    });
  }

  render() {
    return (
      <div className="container">
        <h1 className="page-title">Items for sale!</h1>
        <hr />
        {/* Add new item card button */}
        <div className="row">
          <div className="col-sm-12 col-md-4 col-lg-3">
            <Link to="/create-item">
              <div className="card text-white light-blue mb-3">
                <div className="card-header">
                  <h3>+ New Item</h3>
                </div>
                <div className="card-body">
                  <p className="card-text">Click here list your item!</p>
                </div>
              </div>
            </Link>
          </div>
          {/* Display item data to card: */}
          {this.state.items &&
            this.state.items.map(item => (
              <div key={item.id} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/item/${item.id}`}>
                  <div className="card text-white mb-3 moonstone-blue">
                    <div className="card-header">Price: {item.currency}{item.price}</div>
                    <div className="card-header">Country: {item.country}, {item.region}</div>
                    <div className="card-body">
                      <h4 className="card-title items-title">{item.title}</h4>
                      <p className="card-text items-subtitle">
                        {item.comments}
                      </p>
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

export default items;
