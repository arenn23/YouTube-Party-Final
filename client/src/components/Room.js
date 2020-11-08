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
      roomies:[],
      time: 0
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

    this.socket.emit('syncQueue', {queue: [...this.state.upcomingSongs, this.state.newSong]})
    
  }

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
    });
    this.socket.emit('loadFromQueue', {song: this.state.upcomingSongs[index]})
  };

  handleEnded = () => {
    console.log("ended");
    var pos = this.state.upcomingSongs.indexOf(this.state.currURL);
    if (pos > -1) {
      this.setState({
        currURL: this.state.upcomingSongs[pos + 1],
      });
      this.socket.emit('ended', {currURL: this.state.currURL})
    }
  };

 handlePlay = () => {
    console.log('play')
    this.setState({playing:true})
    this.socket.emit('play', {play: true})
    this.setState({time: (new Date().getTime())})
   }


 handlePause = () => {
   console.log('pause')
   this.socket.emit('pause', {pause: false})
}

sync = status => {
  this.setState(status, () => this.socket.emit('sync', status))
  this.socket.emit('syncStatus', {syncStat: status, currURL: this.state.currURL, playing: this.state.playing, time: this.state.time})
}

  componentDidMount = () => {
    this.socket.emit('register', { id: this.props.feedbackForm.roomName, roomies: this.props.feedbackForm.username})

    this.socket.on('syncRoomies', msg => {
      console.log(msg)
      this.setState({ roomies: msg.roomies })
    })
  
   this.socket.on('syncQueue', msg => {
    this.setState({ upcomingSongs: msg.queue })
    });

   this.socket.on('syncStat', msg => {
     if((!(this.state.currURL === msg.msg.currURL )) && (this.state.currURL === "https://www.youtube.com/watch?v=s21zOyyaBxM&t") ){
       this.setState({currURL: msg.msg.currURL})
     }
     if(msg.msg.time > this.state.time){
     if (Math.abs(this.state.playedSeconds - msg.msg.syncStat.playedSeconds) > 2){
        this.player.seekTo(parseFloat(msg.msg.syncStat.playedSeconds))
        this.setState(msg)
     }}
     this.setState(msg)
   })
   
this.socket.on('loadFromQueue', msg => {
  this.setState({currURL: msg})
})

this.socket.on('pause', msg =>{
 this.setState({playing: msg.pause})
})

this.socket.on('play', msg =>{
  this.setState({playing: msg.play})
})

this.socket.on('ended', msg =>{
  this.setState({currURL: msg.currURL})
})

}

  render() {
    return (
      <>
        <Header 
          roomies={this.state.roomies}
        />
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
              playing = {this.state.playing}
              played = {this.state.played}
              getreference={this.refPlayer}
              handleLoadClick={this.handleLoadClick}
              handlePlay = {this.handlePlay}
              handleSeek = {this.handleSeek}
              handlePause = {this.handlePause}
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
  refPlayer = player => this.player = player;
 
}

export default withRouter(connect(mapStateToProps)(Room));
