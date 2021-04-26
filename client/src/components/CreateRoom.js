import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { Control, Form, Errors } from "react-redux-form";
import { Button, Label, Col, Row, FormGroup } from "reactstrap";
import { withRouter } from "react-router-dom";

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

class CreateRoom extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.history.push("/room");
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
                  validators={{
                    required,
                    minLength: minLength(2),
                    maxLength: maxLength(15),
                  }}
                />
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
            </FormGroup>
          </Form>
          <Link to="/createroom">
            <Button className="ml-5" size="lg" color="danger">
              Cancel
            </Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }
}

export default withRouter(CreateRoom);
