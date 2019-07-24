import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Config from "../config";

class Speed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: 0
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
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
        <Text style={styles.speed}>{this.state.speed}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: 100,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  speed: {
    fontSize: 22
  }
});

export default Speed;
