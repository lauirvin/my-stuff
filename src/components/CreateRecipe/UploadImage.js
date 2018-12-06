import React from "react";
import axios from "axios";

export default class UploadImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myImage", this.state.file); // Add image to form data
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    axios
      .post("http://localhost:8081/upload", formData, config) // Post to '/upload' on the server
      .then(response => {
        alert("Recipe created!"); // Alert if recipe is created 
      })
      .catch(error => {}); // Return error if recipe failed to create
  }
  onChange(e) {
    this.setState({ file: e.target.files[0] }); // Update state to one file only (first file)
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <label htmlFor="fileupload">Upload Image:</label>
        <br />
        <label id="myImageLabel" htmlFor="myImage" className="btn btn-primary ">
          Choose image
        </label>
        <input
          id="myImage"
          type="file"
          name="myImage"
          accept="image/x-png,image/jpeg"
          onChange={this.onChange}
        />
        <button id="uploadButton" className="btn btn-success" type="submit">
          Upload
        </button>
      </form>
    );
  }
}
