import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import Config from "../config";
import { connect } from "react-redux";


class Altitude extends Component {
  lastPosition = null;

  constructor(props) {
    super(props);
    this.state = {
      altitude: 0,
      altitudeUnitSymbol: "",
      altitudeUnitIndex: 0
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
    const altitudeUnit = Config.altitudeUnits[this.state.altitudeUnitIndex];
    const calcAltitude = altitude * altitudeUnit.factor;
    this.state.altitude = calcAltitude.toFixed(calcAltitude < 10 ? 1 : 0);
    this.state.altitudeUnitSymbol = altitudeUnit.symbol;
  };

  changeUnit = () => {
    const units = Config.altitudeUnits.length - 1;
    if (this.state.altitudeUnitIndex < units) this
                                                .state
                                                .altitudeUnitIndex++;
    else this.state.altitudeUnitIndex = 0;
  };

  render() {
    const {} = this.state;
    return (
      <TouchableHighlight onPress={this.changeUnit}>
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
              alignItems: "center",
              padding: 5
            }}
          >
            <Text style={styles.number}>{this.state.altitude}</Text>
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
            <Text style={styles.text}>{this.state.altitudeUnitSymbol}</Text>
          </View>
        </View>
      </TouchableHighlight>
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
