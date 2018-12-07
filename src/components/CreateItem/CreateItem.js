import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import auth0Client from "../../Auth";
import axios from "axios";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

import UploadImage from "./UploadImage";

class CreateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      title: "",
      description: "",
      price: "",
      country: "",
      region: "",
      condition: "",
      currency: ""
    };
  }

  updateCurrency(value) {
    this.setState({
      currency: value
    });
  }

  updatePrice(value) {
    this.setState({
      price: value
    });
  }

  updateCountry(val) {
    this.setState({
      country: val
    });
  }

  updateCondition(val) {
    this.setState({
      condition: val
    });
  }

  updateRegion(val) {
    this.setState({
      region: val
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
    var price = document.getElementById("priceBox");
    var country = document.getElementById("countryBox");
    var region = document.getElementById("regionBox");
    var condition = document.getElementById("conditionBox");
    var currency = document.getElementById("currencyBox");
    console.log(this.state.currency);

    // Return alert if user does not fill in the inputs
    if (title && !title.value) {
      alert("Please fill in the missing blanks!");
    } else if (description && !description.value) {
      alert("Please fill in the missing blanks!");
    } else if (price && !price.value) {
      alert("Please fill in the missing blanks!");
    } else if (country && !country.value) {
      alert("Please fill in the missing blanks!");
    } else if (region && !region.value) {
      alert("Please fill in the missing blanks!");
    } else if (condition && !condition.value) {
      alert("Please fill in the missing blanks!");
    } else if (currency && !currency.value) {
      alert("Please fill in the missing blanks!");
    } else {
      // Post to server if users fill in all the inputs
      this.setState({
        disabled: true
      });
      await axios.post(
        // Passes the following to '/'
        "http://localhost:8081",
        {
          title: this.state.title,
          description: this.state.description,
          price: this.state.price,
          country: this.state.country,
          region: this.state.region,
          condition: this.state.condition,
          currency: this.state.currency
        },
        {
          headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` } // Check authorization and fetch token
        }
      );
      this.props.history.push("/");
    }
  }

  render() {
    const { country, region } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3>Create new item</h3>
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
                    placeholder="Enter item title"
                  />
                </div>
                <UploadImage />
                <div className="form-group">
                  <label htmlFor="price">Price:</label>
                  <br />
                  <select
                    id="currencyBox"
                    onBlur={e => {
                      this.updateCurrency(e.target.value);
                    }}
                  >
                    <option value="" selected disabled>
                      Select currency
                    </option>
                    <option value="$">$</option>
                    <option value="€">€</option>
                    <option value="£">£</option>
                    <option value="¥">¥</option>
                    <option value="₩">₩</option>
                  </select>
                  <input
                    id="priceBox"
                    disabled={this.state.disabled}
                    type="number"
                    min="0"
                    onBlur={e => {
                      this.updatePrice(e.target.value);
                    }}
                    className="form-control"
                    placeholder="Enter the price of your item"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Country & Region:</label>
                  <br />
                  <CountryDropdown
                    id="countryBox"
                    value={country}
                    onChange={val => this.updateCountry(val)}
                  />
                  &nbsp;&nbsp;
                  <RegionDropdown
                    id="regionBox"
                    country={country}
                    value={region}
                    onChange={val => this.updateRegion(val)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="condition">Condition:</label>
                  <br />
                  <select
                    id="conditionBox"
                    onBlur={e => {
                      this.updateCondition(e.target.value);
                    }}
                  >
                    <option value="" selected disabled>
                      Select condition
                    </option>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="For parts or not working">
                      For parts or not working
                    </option>
                  </select>
                </div>
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
                    placeholder="Enter the description of your item"
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

export default withRouter(CreateItem);
