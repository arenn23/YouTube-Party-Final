import React, { Component } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import Player from "react-player";

class Queue extends Component {
  showQueue = () => {
    return this.props.upcomingSongs.map((item, index) => {
      return (
        <ListGroupItem
          onClick={() => this.props.handlePlayFromQueue(index)}
          key={item}
          className="player-wrapper-small"
          style={{ padding: "2px" }}
        >
          <div style={{ marginBottom: "20px", pointerEvents: "auto" }}>
            <Player
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
              width="100%"
              height="100%"
              url={item}
            />
          </div>
        </ListGroupItem>
      );
    });
  };

  render() {
    return (
      <div>
        <ListGroup className="list-group-queue" horizontal>
          {this.showQueue()}
        </ListGroup>
      </div>
    );
  }
}

export default Queue;
