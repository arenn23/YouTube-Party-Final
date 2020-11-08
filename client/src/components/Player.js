import React, { Component } from "react";
import ReactPlayer from "react-player";

class Player extends Component {

  render() {
    return (
      <ReactPlayer
        onProgress={this.props.sync}
        ref={player => { this.player = player; this.props.getreference(player); }}
        muted={false}
        onPlay={this.props.handlePlay}
        onPause={this.props.handlePause}
        onEnded={this.props.handleEnded}
        onReady={this.props.playerReady}
        controls={true}
        playing={this.props.playing}
        url={this.props.currURL}
        onSeek = {this.props.handleSeek}
      />
    );
  }
}

export default Player;
