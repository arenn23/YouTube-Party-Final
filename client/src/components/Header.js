import React from "react";
import { Jumbotron, Row, Col } from "reactstrap";
import logo from "../Images/templogo.jpg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import RoomiesModal from './RoomiesModal'

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
                <img src={logo} alt="logo"></img>
              </Link>
              <h1>
                YouTube <span>Party</span>
              </h1>
            </div>
            <div id="roomName" className="col-lg-6">
              {props.feedbackForm.roomName && location.pathname === "/room" ? (
                <h2>
                  Hello! Welcome to the{" "}
                  <span> {props.feedbackForm.roomName}</span> Room
                </h2>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </Jumbotron>
      <Row className="blackBar">
        <Col>
        {location.pathname === "/room" ? (
          <div style={{color: 'white', paddingLeft: 20}}> 
            <RoomiesModal 
            roomies = {props.roomies}
            />
           </div>) 
           : 
          ( <div></div>  )}
          </Col>
      </Row>
    </React.Fragment>
  );
}

export default connect(mapStateToProps)(Header);
