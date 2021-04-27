import React from "react";
import { Jumbotron, Row, Col } from "reactstrap";
import logo from "../Images/templogo.jpg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import RoomiesModal from "./RoomiesModal";

//Access the props information held in Redux form
const mapStateToProps = (state) => {
  return {
    feedbackForm: state.feedbackForm,
  };
};

function Header(props) {
  let location = useLocation();
  return (
    <React.Fragment>
      <Jumbotron>
        <div className="container">
          <div className="row">
            <div className="col col-lg-6">
              <Link to="/">
                {/* YouTube Party Logo */}
                <img src={logo} alt="logo"></img>
              </Link>
              <h1>
                YouTube <span>Party</span>
              </h1>
            </div>
            {/* Conditional rendering. Looking for is there is data in the Redux
              form and the path is /room */}
            <div id="roomName" className="col-lg-6">
              {props.feedbackForm.roomName && location.pathname === "/room" ? (
                // If both conditions are true, return room name in jumbotron
                <h2 id="roomHeader">
                  Hello! Welcome to the
                  <span> {props.feedbackForm.roomName}</span> Room
                </h2>
              ) : (
                // else return a blank div
                <div></div>
              )}
            </div>
          </div>
        </div>
      </Jumbotron>
      <Row className="blackBar">
        <Col>
          {/* Conditional rendering to show roomie modal. If file path = /room */}
          {location.pathname === "/room" ? (
            //Render RoomiesModal passing roomies array into it
            <div style={{ color: "white", paddingLeft: 20 }}>
              <RoomiesModal roomies={props.roomies} />
            </div>
          ) : (
            //else render a blank div
            <div></div>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default connect(mapStateToProps)(Header);
