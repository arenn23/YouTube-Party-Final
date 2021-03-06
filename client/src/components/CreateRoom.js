import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Control, Form, Errors } from "react-redux-form";
import { Button, Label, Col, Row, FormGroup } from "reactstrap";
import { withRouter } from "react-router-dom";

//Function to check if field is blank
const required = (val) => val && val.length;
//Function to check if field is greater than max length
const maxLength = (len) => (val) => !val || val.length <= len;
//Function to check if field is less than max length
const minLength = (len) => (val) => val && val.length >= len;

class CreateRoom extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.history.push("/room");
  }

  handleAlternate(e) {
    this.props.history.push("/");
  }

  render() {
    return (
      <>
        <Header />
        <div className="row row-content justify-content-center">
          <Form
            model="feedbackForm"
            onSubmit={(values) => this.handleSubmit(values)}
          >
            <Row className="form-group">
              <Label className="mt-4 ml-3" htmlFor="roomName">
                Room Name
              </Label>
              <Col md={12}>
                <Control.text
                  model=".roomName"
                  id="roomName"
                  name="roomName"
                  placeholder="Room Name"
                  className="form-control"
                  // call the validating functions above. Passes in min and max length as parameters
                  validators={{
                    required,
                    minLength: minLength(2),
                    maxLength: maxLength(15),
                  }}
                />
                {/* Gives errors that populate below the field after the user has touched the input field  */}
                <Errors
                  className="text-danger"
                  model=".roomName"
                  show="touched"
                  component="div"
                  messages={{
                    required: "Required",
                    minLength: "Must be at least 2 characters",
                    maxLength: "Must be 15 characters or less",
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Label className="mt-1 ml-3" htmlFor="username">
                Username
              </Label>
            </Row>
            <Row>
              <Col md={12}>
                <Control.text
                  model=".username"
                  id="username"
                  name="username"
                  placeholder="Username"
                  className="form-control"
                  validators={{
                    required,
                    minLength: minLength(2),
                    maxLength: maxLength(15),
                  }}
                />
                <Errors
                  className="text-danger"
                  model=".username"
                  show="touched"
                  component="div"
                  messages={{
                    required: "Required",
                    minLength: "Must be at least 2 characters",
                    maxLength: "Must be 15 characters or less",
                  }}
                />
              </Col>
            </Row>
            <FormGroup className="mt-3">
              <Button type="submit" size="lg" color="secondary">
                Enter
              </Button>
              <Button
                onClick={this.handleAlternate.bind(this)}
                className="ml-5"
                size="lg"
                color="danger"
              >
                Cancel
              </Button>
            </FormGroup>
          </Form>
        </div>
        <Footer />
      </>
    );
  }
}

export default withRouter(CreateRoom);
