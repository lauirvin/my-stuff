import React, { Component } from "react";
import axios from "axios";
import SubmitComment from "./SubmitComment";
import auth0Client from "../../Auth";

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null
    };
    this.submitComment = this.submitComment.bind(this);
  }

  async componentDidMount() {
    await this.refreshItem();
  }

  async refreshItem() {
    const {
      match: { params }
    } = this.props;
    const item = (await axios.get(`http://ec2-18-130-97-126.eu-west-2.compute.amazonaws.com:9000/${params.itemId}`)) // Fetch item data
      .data;
    this.setState({
      item
    });
  }

  async submitComment(comment) {
    // Post comment to server
    await axios.post(
      `http://localhost:8081/comment/${this.state.item.id}`,
      {
        comment
      },
      {
        // Fetch ID token from Auth0 to check if comment is authorized
        headers: { Authorization: `Bearer ${auth0Client.getIdToken()}` }
      }
    );
    await this.refreshItem(); // Refresh page to fetch new data due to new comments
  }

  render() {
    const { item } = this.state;
    if (item === null) return <p>Loading ...</p>;
    const imagePath = item.image.replace("public/", "../");
    console.log(imagePath);
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
            <h1 className="display-3">{item.title}</h1>
            <div className="item-image-container">
              <img alt="" src={imagePath} />
            </div>
            <hr className="my-4" />
            <h2 className="item-subtitle">
              <b>Price:</b> &nbsp; &nbsp; {item.price}
            </h2>
            <hr className="my-4" />
            <h2 className="item-subtitle">
              <b>Location:</b> &nbsp; &nbsp; {item.region}, {item.country}
            </h2>
            <hr className="my-4" />
            <h2 className="item-subtitle">
              <b>Condition:</b> &nbsp; &nbsp; {item.condition}
            </h2>
            <hr className="my-4" />
            <h2 className="item-subtitle">
              <b>Description:</b>
            </h2>
            <p className="lead">{item.description}</p>
            <hr className="my-4" />
            <h2 className="item-subtitle">
              <b>Comments:</b>
            </h2>
            {item.comments.map((comment, idx) => (
              <li className="lead" key={idx}>
                {comment.comment}
              </li>
            ))}
            <SubmitComment
              itemId={item.id}
              submitComment={this.submitComment}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Item;
