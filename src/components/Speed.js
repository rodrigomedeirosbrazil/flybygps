import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Config from "../config";
import { connect } from "react-redux";


class Speed extends Component {
  lastPosition = null;

  constructor(props) {
    super(props);
    this.state = {
      speed: 0
    };
  }

  componentDidUpdate() {
    if (this.lastPosition !== this.props.position) {
      this.lastPosition = this.props.position;
      this.setPosition(this.props.position);
    }
  }

  setPosition = position => {
    if (
      !position ||
      !position.coords ||
      !position.coords.speed ||
      position.coords.speed == this.speed
    )
      return;

    this.setSpeed(position.coords.speed);
  };

  setSpeed = speed => {
    this.state.speed = speed.toFixed(speed < 10 ? 1 : 0);
  };

  render() {
    const {} = this.state;
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Text style={styles.speedText}>SPEED</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={styles.speedNumber}>{this.state.speed}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <Text style={styles.speedText}>KM/H</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: 150,
    height: 100,
    // alignItems: "center",
    // justifyContent: "center"
  },
  speedNumber: {
    fontSize: 50,
    fontWeight: "bold"
  },
  speedText: {
    fontSize: 12,
    alignItems: "flex-start"
  }
});

const mapStateToProps = state => {
  return {
    position: state.gps.position,
  };
};

export default connect(
  mapStateToProps, null
)(Speed);
