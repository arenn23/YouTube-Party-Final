import React, { Component } from "react";
import ReactPlayer from "react-player";

class Player extends Component {
  //Fires when video is started or unpaused.
  handlePlay = () => {
    console.log(`onPlay`);

    if (this.props.playing === false) {
      //Calls sync prop function to update the playing, played, and currURL state variable of parent component.
      this.props.sync({
        playing: true,
        //getCurrentTime is a React Player method that allows access to curren time in video
        played: this.player.getCurrentTime(),
        currURL: this.props.currURL,
      });
    }
  };

  handlePause = () => {
    //does the same thing as handleplay but pauses the video.
    console.log("pause");
    if (this.props.playing === true) {
      this.props.sync({
        playing: false,
        played: this.player.getCurrentTime(),
        currURL: this.props.currURL,
      });
    }
  };

  render() {
    return (
      <ReactPlayer
        ref={(player) => {
          this.player = player;
          this.props.getreference(player);
        }}
        muted={true}
        //Call back props made by React Player. Fire when certain actions occur.
        //For example, onPlay fires when a video is started or unpaused. When the video is unpaused,
        //the this.handlePlay function is called, which passes info back to parent component.
        onPlay={this.handlePlay}
        onPause={this.handlePause}
        onEnded={this.props.handleEnded}
        controls={true}
        playing={this.props.playing}
        url={this.props.currURL}
        onProgress={this.props.handleProgress}
      />
    );
  }
}

export default Player;
