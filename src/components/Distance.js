import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Touchable from "react-native-platform-touchable";

import Config from "../config";
import { connect } from "react-redux";
import { getDistance } from "geolib";

class Distance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      distUnitIndex: 0
    };
  }

  changeUnit = () => {
    const units = Config.distanceUnits.length - 1;
    const distUnitIndex =
      this.state.distUnitIndex < units ? this.state.distUnitIndex + 1 : 0;
    this.setState({ distUnitIndex });
  };

  getUnitFactor = () => {
    const distUnit = Config.distanceUnits[this.state.distUnitIndex];
    return distUnit.factor;
  };

  getDistUnit = () => {
    const distUnit = Config.distanceUnits[this.state.distUnitIndex];
    return distUnit.symbol;
  };

  getDistLabel = () => {
    const { coords } = this.props.position;
    if (!coords || !coords.latitude || !this.props.waypoint) return "N/A";
    const { latitude, longitude } = coords;
    const dist = getDistance(
      {
        latitude,
        longitude
      },
      {
        latitude: this.props.waypoint.lat,
        longitude: this.props.waypoint.lon
      }
    );
    const calcdist = dist * this.getUnitFactor();
    return calcdist.toFixed(calcdist < 10 ? 1 : 0);
  };

  render() {
    const distLabel = this.getDistLabel();
    const distUnit = this.getDistUnit();
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
            <Text style={styles.text}>Distance</Text>
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
            <Text style={styles.number}>{distLabel}</Text>
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
            <Text style={styles.text}>{distUnit}</Text>
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
    waypoint: state.config.waypoint
  };
};

export default connect(
  mapStateToProps,
  null
)(Distance);
