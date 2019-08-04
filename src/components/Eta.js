import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Touchable from "react-native-platform-touchable";

import Config from "../config";
import { connect } from "react-redux";
import { getDistance } from "geolib";

class Eta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      etaUnitIndex: 0
    };
  }

  changeUnit = () => {
    const units = Config.timeUnits.length - 1;
    const etaUnitIndex =
      this.state.etaUnitIndex < units ? this.state.etaUnitIndex + 1 : 0;
    this.setState({ etaUnitIndex });
  };

  getUnitFactor = () => {
    return Config.timeUnits[this.state.etaUnitIndex].factor;
  };

  getEtaUnit = () => {
    return Config.timeUnits[this.state.etaUnitIndex].symbol;
  };

  getEtaLabel = () => {
    const { coords } = this.props.position;

    if (
      !coords ||
      !coords.latitude ||
      !this.props.oldPosition.coords ||
      !this.props.oldPosition.coords.latitude ||
      !this.props.waypoint
    )
      return "N/A";

    const oldCoords = this.props.oldPosition.coords;

    const distOld = getDistance(
      {
        latitude: oldCoords.latitude,
        longitude: oldCoords.longitude
      },
      {
        latitude: this.props.waypoint.lat,
        longitude: this.props.waypoint.lon
      }
    );

    const distNew = getDistance(
      {
        latitude: coords.latitude,
        longitude: coords.longitude
      },
      {
        latitude: this.props.waypoint.lat,
        longitude: this.props.waypoint.lon
      }
    );

    if (distNew > distOld) return "N/A";

    const distBetween = getDistance(
      {
        latitude: oldCoords.latitude,
        longitude: oldCoords.longitude
      },
      {
        latitude: coords.latitude,
        longitude: coords.longitude
      }
    );
    const timeElapsed =
      this.props.position.timestamp - this.props.oldPosition.timestamp;
    const speed = (distBetween / timeElapsed) * 1000;

    const dist = getDistance(
      {
        latitude: coords.latitude,
        longitude: coords.longitude
      },
      {
        latitude: this.props.waypoint.lat,
        longitude: this.props.waypoint.lon
      }
    );

    const eta = dist / speed;
    const calcEta = eta * this.getUnitFactor();
    return calcEta.toFixed(calcEta < 10 ? 1 : 0);
  };

  render() {
    const etaLabel = this.getEtaLabel();
    const etaUnit = this.getEtaUnit();
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
            <Text style={styles.text}>ETA</Text>
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
            <Text style={styles.number}>{etaLabel}</Text>
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
            <Text style={styles.text}>{etaUnit}</Text>
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
    position: state.gps.position,
    oldPosition: state.gps.oldPosition,
    waypoint: state.config.waypoint
  };
};

export default connect(
  mapStateToProps,
  null
)(Eta);
