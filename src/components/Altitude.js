import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Config from "../config";
import { connect } from "react-redux";


class Altitude extends Component {
  lastPosition = null;

  constructor(props) {
    super(props);
    this.state = {
      altitude: 0
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
      !position.coords.altitude ||
      position.coords.altitude == this.altitude
    )
      return;

    this.setAltitude(position.coords.altitude);
  };

  setAltitude = altitude => {
    this.state.altitude = altitude.toFixed(altitude < 10 ? 1 : 0);
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
          <Text style={styles.text}>ALTITUDE</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={styles.number}>{this.state.altitude}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <Text style={styles.text}>m</Text>
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
  number: {
    fontSize: 50,
    fontWeight: "bold"
  },
  text: {
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
)(Altitude);
