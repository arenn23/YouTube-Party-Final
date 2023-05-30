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
  //Start socketio client
  socket = io();
  videoEnded = true;
  index = -1;
  constructor(props) {
    super(props);
    this.state = {
      //video is playing: true of false
      playing: true,
      //How many seconds have played in the video
      played: 0,
      //Songs stored in the upcoming song queue
      upcomingSongs: [],
      //Form field value. Used to update upcomingSongs array
      newSong: "",
      //URL of current video playing. Default URL below to Gareth Emery video
      currURL: "https://www.youtube.com/watch?v=s21zOyyaBxM&t",
      //Index of selected video of upComingSongs array. Intialized at -1
      playlistIndex: -1,
      alerts: {},
      //Roomies in room
      roomies: [],
      time: 0,
      //timestamp
      ts: 0,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    //Adds new song to queue
    this.setState({
      upcomingSongs: [...this.state.upcomingSongs, this.state.newSong],
      newSong: "",
    });

    //emits queue data to other clients
    this.socket.emit("syncQueue", {
      queue: [...this.state.upcomingSongs, this.state.newSong],
    });
  }

  //updates played state variable with how many seconds have been played in video.
  //Function is passed to Player component
  handleProgress = (progress) => {
    this.setState({ played: progress.playedSeconds });
  };

  //Updates state variable newSong with song URL. Once submitted, newSong is appended to upcomingSongs array
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;

    this.setState({
      newSong: value,
    });
  };

  //Function that allows a video to be selected to play from the queue. Index is the array index of the song.
  //Passed as props to the Queue component
  handlePlayFromQueue = (index) => {
    //Sets the currURL to the video. Updates playlistIndex with array index of current video.
    this.setState({
      currURL: this.state.upcomingSongs[index],
      playlistIndex: index,
    });
    //Emits the selected song and index to the other clients
    this.socket.emit("loadFromQueue", {
      song: this.state.upcomingSongs[index],
      playlistIndex: index,
    });
  };

  //Fires when video ends. Passed to Player component as props.
  handleEnded = () => {
    //Pos gives index of the current video in the upcomingSongs array
    var pos = this.state.upcomingSongs.indexOf(this.state.currURL);
    //checks to see if there are vidoes in the upcomingSongs array and checks to see if the current video is the default video.
    if (
      this.state.upcomingSongs.length > 0 &&
      this.state.currURL !== "https://www.youtube.com/watch?v=s21zOyyaBxM&t"
    ) {
      //Splices current video out of array
      this.state.upcomingSongs.splice(pos, 1);
      //Sets currURL to the next video in the array (which now has the same position because of the splice)
      this.setState({
        currURL: this.state.upcomingSongs[pos],
      });
    }
    //checks to see if default video was playing
    if (
      this.state.currURL === "https://www.youtube.com/watch?v=s21zOyyaBxM&t"
    ) {
      //if so, sets currURL to first video in playlist
      this.setState({
        currURL: this.state.upcomingSongs[0],
      });
    }
    //emits currURL and upcomingSongs array to other clients
    this.socket.emit("ended", {
      currURL: this.state.currURL,
      queue: this.state.upcomingSongs,
    });
  };

  //Sync is called when a video is paused or started.
  sync = (status) => {
    //Updates the following state variables: playing, played, and currURL. Then, sends this data to the other clients.
    this.setState(status, () => this.socket.emit("sync", status));
  };

  //Socket.on means data is being received from server. Socket.emit means being sent to server.
  //General data flow once client updates -> socket.emit to server with udpated data ->
  //server receives data with socket.on -> server sends data with another socket emit ->
  //the other clients receive data with socket.on and update their state to match other udpated client
  componentDidMount = () => {
    //Fires as soon as component mounts. Sends room and roomie name to server and other clients.
    this.socket.emit("register", {
      id: this.props.feedbackForm.roomName,
      roomies: this.props.feedbackForm.username,
    });

    //Fires when another roommate enters the room. Updates roomies state variable with other roomies.
    this.socket.on("syncRoomies", (msg) => {
      this.setState({ roomies: msg.roomies });
      //Fires the sync function above a few times to make sure new roomie gets to the right video.
      this.setState({ playing: false });
      this.setState({ playing: true });
      this.setState({ playing: false });
      this.setState({ playing: true });
    });

    //Fires when another person updates the queue.
    this.socket.on("syncQueue", (msg) => {
      //Updates upComingSongs state variable
      this.setState({ upcomingSongs: msg.queue });
    });

    //Fires when another client pauses or plays the video (fires when someone seeks as well)
    this.socket.on("sync", (msg) => {
      if (msg.msg !== undefined) {
        //checks to see if state currURL matches other clients URL. These will not match when somoene first joins the room
        if (
          !(this.state.currURL === msg.msg.currURL) &&
          this.state.currURL === "https://www.youtube.com/watch?v=s21zOyyaBxM&t"
        ) {
          //Updates to the new roomie with the correct URL of the other clients
          this.setState({ currURL: msg.msg.currURL });
        }

        //If this state played seconds is different than the msg played seconds, then another client has updated their time.
        //State played seconds is updated to reflect change
        if (Math.abs(this.state.played - msg.msg.played) > 2)
          this.player.seekTo(parseFloat(msg.msg.played));
      }
      //updates the other variables in the state as well
      this.setState(msg.msg);
    });

    //Fires when another client has loaded a video from the queue
    this.socket.on("loadFromQueue", (msg) => {
      //Updates currURL to selected video
      this.setState({ currURL: msg.song });
    });

    //Fires when a video has ended on another client
    this.socket.on("ended", (msg) => {
      //Updates currURL to next video
      this.setState({ currURL: msg.currURL });
      //Updates the queue
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
        {/* Calls header prop with the roomies array. Roomies array is passed all the way to the RoomieModal */}
        <Header roomies={this.state.roomies} />
        <div className="container">
          <div className="row justify-content-center">
            <Form className="mt-2 mb-2" inline onSubmit={this.handleSubmit}>
              <Label htmlFor="song" className="mr-2">
                Add Song
              </Label>
              {/* Form with one input. This input is used to update the newSong state variable. Once form is submitted,
              the newSong variable updates the upComingSongs array. Then data is transferred to other clients.  */}
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
  //Creates a ref to refernce player
  refPlayer = (player) => (this.player = player);
}

export default withRouter(connect(mapStateToProps)(Room));
