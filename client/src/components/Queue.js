import React, { Component } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import Player from "react-player";

class Queue extends Component {
  showQueue = () => {
    //Maps through upcomingSongs array and displays them in a ListGroupItem. Each item has a small Player component inside of it.
    //the player-wrapper-small css class is responsible for this
    return this.props.upcomingSongs.map((item, index) => {
      return (
        <ListGroupItem
          //Sends index data back to parent component to fire handlePlayFromQueue.
          onClick={() => this.props.handlePlayFromQueue(index)}
          key={item}
          //see App.css. Wraps player into small thumbnail
          className="player-wrapper-small"
          style={{ padding: "2px" }}
        >
          <div style={{ marginBottom: "20px", pointerEvents: "auto" }}>
            Creates
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
