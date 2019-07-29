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
      altitudeUnitIndex: 0,
      altitudeLabel: "",
      altitudeUnit: ""
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
    ) {
      this.setState({ altitude: null });
    } else {
      this.setState({ altitude: position.coords.altitude });
    }
    this.updateLabels();
  };

  updateLabels = () => {
    const altitudeUnit = Config.altitudeUnits[this.state.altitudeUnitIndex];
    let altitudeLabel = "N/A";
    if (this.state.altitude) {
      const calcAltitude = this.state.altitude * altitudeUnit.factor;
      altitudeLabel = calcAltitude.toFixed(calcAltitude < 10 ? 1 : 0);
    }
    this.setState({ altitudeLabel, altitudeUnit: altitudeUnit.symbol });
  };

  changeUnit = () => {
    const units = Config.altitudeUnits.length - 1;
    if (this.state.altitudeUnitIndex < units) this.state.altitudeUnitIndex++;
    else this.state.altitudeUnitIndex = 0;
    this.updateLabels();
  };

  render() {
    const {} = this.state;
    return (
      <TouchableHighlight onPress={this.changeUnit} style={styles.button}>
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              padding: 5
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
            <Text style={styles.number}>{this.state.altitudeLabel}</Text>
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
            <Text style={styles.text}>{this.state.altitudeUnit}</Text>
          </View>
        </View>
      </TouchableHighlight>
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
