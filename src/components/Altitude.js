import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Touchable from "react-native-platform-touchable";

import Config from "../config";
import { connect } from "react-redux";

class Altitude extends Component {
  constructor(props) {
    super(props);
    this.state = {
      altitudeUnitIndex: 0
    };
  }

  changeUnit = () => {
    const units = Config.altitudeUnits.length - 1;
    const altitudeUnitIndex =
      this.state.altitudeUnitIndex < units
        ? this.state.altitudeUnitIndex + 1
        : 0;
    this.setState({ altitudeUnitIndex });
  };

  getUnitFactor = () => {
    const altitudeUnit = Config.altitudeUnits[this.state.altitudeUnitIndex];
    return altitudeUnit.factor;
  };

  getAltitudeUnit = () => {
    const altitudeUnit = Config.altitudeUnits[this.state.altitudeUnitIndex];
    return altitudeUnit.symbol;
  };

  getAltitudeLabel = () => {
    const { coords } = this.props.position;
    if (!coords || coords.altitude === undefined) return "N/A";
    const { altitude } = coords;
    const calcAltitude = altitude * this.getUnitFactor();
    return calcAltitude.toFixed(calcAltitude < 10 ? 1 : 0);
  };

  render() {
    const altitudeLabel = this.getAltitudeLabel();
    const altitudeUnit = this.getAltitudeUnit();
    return (
      <Touchable onPress={this.changeUnit} style={styles.button}>
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              padding: 5
            }}
          >
            <Text style={styles.text}>Altitude</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.number}>{altitudeLabel}</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: 5
            }}
          >
            <Text style={styles.text}>{altitudeUnit}</Text>
          </View>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: "50%",
    height: 100,
    borderColor: "#222",
    borderWidth: 1
  },
  container: {
    width: "100%",
    height: "100%"
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
    position: state.gps.position
  };
};

export default connect(
  mapStateToProps,
  null
)(Altitude);
