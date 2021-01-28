import React, { Component } from "react";
import ReactPlayer from "react-player";

class Player extends Component {
  handlePlay = () => {
    console.log(`onPlay`);
    if (this.props.playing === false) {
      this.props.sync({
        playing: true,
        played: this.player.getCurrentTime(),
        currURL: this.props.currURL,
      });
    }
  };

  handlePause = () => {
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
        onProgress={this.props.sync}
        ref={(player) => {
          this.player = player;
          this.props.getreference(player);
        }}
        muted={true}
        onPlay={this.handlePlay}
        onPause={this.handlePause}
        onEnded={this.props.handleEnded}
        onReady={this.props.playerReady}
        controls={true}
        playing={this.props.playing}
        url={this.props.currURL}
        onSeek={this.props.handleSeek}
        onProgress={this.props.handleProgress}
      />
    );
  }
}

export default Player;
