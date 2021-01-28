import React, { Component } from "react";
import Header from "./Header";
import { Button, Form, Label, Input } from "reactstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import io from "socket.io-client";
import Player from "./Player";
import Queue from "./Queue";

const mapStateToProps = (state) => {
  return {
    feedbackForm: state.feedbackForm,
  };
};

class Room extends Component {
  socket = io();
  videoEnded = true;
  index = -1;
  constructor(props) {
    super(props);
    this.state = {
      playing: true,
      played: 0,
      upcomingSongs: [],
      newSong: "",
      currURL: "https://www.youtube.com/watch?v=s21zOyyaBxM&t",
      playlistIndex: -1,
      alerts: {},
      roomies: [],
      time: 0,
      ts: 0,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      upcomingSongs: [...this.state.upcomingSongs, this.state.newSong],
      newSong: "",
    });

    this.socket.emit("syncQueue", {
      queue: [...this.state.upcomingSongs, this.state.newSong],
    });
  }

  handleProgress = (progress) => {
    this.setState({ played: progress.playedSeconds });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;

    this.setState({
      newSong: value,
    });
  };

  handlePlayFromQueue = (index) => {
    console.log(index);
    this.setState({
      currURL: this.state.upcomingSongs[index],
      playlistIndex: index,
    });
    this.socket.emit("loadFromQueue", {
      song: this.state.upcomingSongs[index],
      playlistIndex: index,
    });
  };

  handleEnded = () => {
    console.log("ended");
    var pos = this.state.upcomingSongs.indexOf(this.state.currURL);
    if (
      this.state.upcomingSongs.length > 0 &&
      this.state.currURL !== "https://www.youtube.com/watch?v=s21zOyyaBxM&t"
    ) {
      this.state.upcomingSongs.splice(pos, 1);
      this.setState({
        currURL: this.state.upcomingSongs[pos],
      });
    }
    if (
      this.state.currURL === "https://www.youtube.com/watch?v=s21zOyyaBxM&t"
    ) {
      this.setState({
        currURL: this.state.upcomingSongs[0],
      });
    }
    this.socket.emit("ended", {
      currURL: this.state.currURL,
      queue: this.state.upcomingSongs,
    });
  };

  sync = (status) => {
    console.log(status.playing);
    this.setState(status, () => this.socket.emit("sync", status));
  };

  componentDidMount = () => {
    this.socket.emit("register", {
      id: this.props.feedbackForm.roomName,
      roomies: this.props.feedbackForm.username,
    });

    this.socket.on("syncRoomies", (msg) => {
      console.log(msg);
      this.setState({ roomies: msg.roomies });
      this.setState({ playing: false });
      this.setState({ playing: true });
      this.setState({ playing: false });
      this.setState({ playing: true });
    });

    this.socket.on("syncQueue", (msg) => {
      this.setState({ upcomingSongs: msg.queue });
    });

    this.socket.on("sync", (msg) => {
      console.log(msg);
      if (msg.msg !== undefined) {
        if (
          !(this.state.currURL === msg.msg.currURL) &&
          this.state.currURL === "https://www.youtube.com/watch?v=s21zOyyaBxM&t"
        ) {
          this.setState({ currURL: msg.msg.currURL });
        }
        msg.msg.played =
          msg.msg.played + (new Date().getTime() - msg.msg.ts) / 1000;
        if (Math.abs(this.state.played - msg.msg.played) > 2)
          this.player.seekTo(parseFloat(msg.msg.played));
      }
      this.setState(msg.msg);
    });

    this.socket.on("loadFromQueue", (msg) => {
      console.log("hello");
      console.log(msg);
    });

    this.socket.on("pause", (msg) => {
      this.setState({ playing: msg.pause });
    });

    this.socket.on("play", (msg) => {
      this.setState({ playing: msg.play });
    });

    this.socket.on("ended", (msg) => {
      console.log(msg);
      this.setState({ currURL: msg.currURL });
      this.setState({ upcomingSongs: msg.queue });
    });

    this.socket.on("resetRoom", (msg) => {
      this.setState({ upcomingSongs: [] });
      this.setState({
        currURL: "https://www.youtube.com/watch?v=s21zOyyaBxM&t",
      });
    });
  };

  render() {
    return (
      <>
        <Header roomies={this.state.roomies} />
        <div className="container">
          <div className="row justify-content-center">
            <Form className="mt-2 mb-2" inline onSubmit={this.handleSubmit}>
              <Label htmlFor="song" className="mr-2">
                Add Song
              </Label>
              <Input
                className=" mr-2"
                type="text"
                value={this.state.newSong}
                id="song"
                ref={(elem) => (this.songField = elem)}
                name="song"
                placeholder="Enter URL of Song"
                onChange={this.handleInputChange}
              />
              <Button color="info">Add</Button>
            </Form>
          </div>
          <div className="row justify-content-center mt-3">
            <Player
              currURL={this.state.currURL}
              handleEnded={this.handleEnded}
              sync={this.sync}
              playing={this.state.playing}
              played={this.state.played}
              getreference={this.refPlayer}
              handleLoadClick={this.handleLoadClick}
              handlePlay={this.handlePlay}
              handleSeek={this.handleSeek}
              handlePause={this.handlePause}
              playerReady={this.handleOnReady}
              handleProgress={this.handleProgress}
            />
          </div>
        </div>

        <Queue
          handlePlayFromQueue={this.handlePlayFromQueue}
          upcomingSongs={this.state.upcomingSongs}
        />
      </>
    );
  }
  refPlayer = (player) => (this.player = player);
}

export default withRouter(connect(mapStateToProps)(Room));
