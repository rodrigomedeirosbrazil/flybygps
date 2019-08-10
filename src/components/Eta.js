import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Touchable from "react-native-platform-touchable";
import moment from "moment";

import { connect } from "react-redux";
import { getDistance } from "geolib";

class Eta extends Component {
  Units = [{ symbol: "TIME LEFT" }, { symbol: "ETA" }, { symbol: "KM/H" }];
  constructor(props) {
    super(props);
    this.state = {
      etaUnitIndex: 0
    };
  }

  changeUnit = () => {
    const units = this.Units.length - 1;
    const etaUnitIndex =
      this.state.etaUnitIndex < units ? this.state.etaUnitIndex + 1 : 0;
    this.setState({ etaUnitIndex });
  };

  getEtaUnit = () => {
    return this.Units[this.state.etaUnitIndex].symbol;
  };

  checkPositions = () => {
    if (this.props.positions.length < 5 || !this.props.waypoint) return false;
    let position = this.props.positions.slice(-1)[0];
    if (!position.coords || !position.coords.latitude) return false;
    position = this.props.positions[0];
    if (!position.coords || !position.coords.latitude) return false;
    return true;
  };

  getEtaLabel = () => {
    if (!this.checkPositions()) return "N/A";

    const position = this.props.positions.slice(-1)[0];
    const oldPosition = this.props.positions[0];

    const distOld = getDistance(
      {
        latitude: oldPosition.coords.latitude,
        longitude: oldPosition.coords.longitude
      },
      {
        latitude: this.props.waypoint.lat,
        longitude: this.props.waypoint.lon
      }
    );

    const distNew = getDistance(
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      {
        latitude: this.props.waypoint.lat,
        longitude: this.props.waypoint.lon
      }
    );

    if (distNew > distOld) return "N/A";

    const distBetween = getDistance(
      {
        latitude: oldPosition.coords.latitude,
        longitude: oldPosition.coords.longitude
      },
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    );

    const timeElapsed = position.timestamp - oldPosition.timestamp;
    const speed = (distBetween / timeElapsed) * 1000; // in m/s

    const dist = getDistance(
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      {
        latitude: this.props.waypoint.lat,
        longitude: this.props.waypoint.lon
      }
    );

    const secondsLeft = dist / speed;
    console.tron.log(secondsLeft, dist);

    if (this.state.etaUnitIndex == 0) {
      // TIME LEFT
      return moment()
        .startOf("day")
        .seconds(secondsLeft)
        .format("HH:mm");
    } else if (this.state.etaUnitIndex == 1) {
      // Estimated Time Arrival
      return moment()
        .add(secondsLeft, "seconds")
        .format("HH:mm");
    } else {
      const calcSpeed = speed * 3.6; // m/s to km/h
      return calcSpeed.toFixed(calcSpeed < 10 ? 1 : 0);
    }
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
    positions: state.gps.positions,
    waypoint: state.config.waypoint
  };
};

export default connect(
  mapStateToProps,
  null
)(Eta);
