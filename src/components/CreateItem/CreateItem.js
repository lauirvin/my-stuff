import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import auth0Client from "../../Auth";
import axios from "axios";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

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
      currency: "",
      image: []
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
    var data = {
      title: this.state.title,
      description: this.state.description,
      price: this.state.price,
      country: this.state.country,
      region: this.state.region,
      condition: this.state.condition,
      currency: this.state.currency
    };

    const formData = new FormData();
    formData.append("imageBox", this.state.image); // Add image to form data

    for (var key in data) {
      formData.append(key, data[key]);
    }

    const config = {
      headers: {
        Authorization: `Bearer ${auth0Client.getIdToken()}`, // Check authorization and fetch token
        "content-type": "multipart/form-data"
      }
    };
    this.setState({
      disabled: true
    });

    await axios.post("http://ec2-18-130-97-126.eu-west-2.compute.amazonaws.com:9000/", formData, config); // Post to '/upload' on the server
    this.props.history.push("/");
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
                    name="title"
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
                <div className="form-group">
                  <label
                    id="imageBoxLabel"
                    htmlFor="imageBox"
                    className="btn btn-primary "
                  >
                    Choose image
                  </label>
                  <input
                    type="file"
                    name="imageBox"
                    id="imageBox"
                    accept="image/*"
                    onChange={e => {
                      this.setState({ image: e.target.files[0] });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price:</label>
                  <br />
                  <select
                    id="currencyBox"
                    defaultValue="default"
                    onBlur={e => {
                      this.updateCurrency(e.target.value);
                    }}
                  >
                    <option value="default" disabled>
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
                    defaultValue="default"
                    id="conditionBox"
                    onBlur={e => {
                      this.updateCondition(e.target.value);
                    }}
                  >
                    <option value="default" disabled>
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
