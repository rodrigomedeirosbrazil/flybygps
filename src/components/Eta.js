import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Touchable from "react-native-platform-touchable";

import Config from "../config";
import { connect } from "react-redux";
import { getDistance } from "geolib";

class Eta extends Component {
  lastPosition = null;

  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lon: 0,
      speed: 0,
      dist: null,
      etaUnitIndex: 0,
      etaLabel: "",
      etaUnit: ""
    };
  }

  componentDidMount() {
    this.updateLabels();
  }

  componentDidUpdate() {
    if (this.lastPosition !== this.props.position) {
      this.lastPosition = this.props.position;
      this.setPosition(this.props.position);
    }
  }

  setPosition = position => {
    if (!position || !position.coords || !position.coords.latitude) {
      this.setState({ lat: null, lon: null });
    } else {
      this.setState({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        speed: position.coords.speed
      });
    }
    this.updateLabels();
  };

  updateLabels = () => {
    const etaUnit = Config.timeUnits[this.state.etaUnitIndex];
    let etaLabel = "N/A";
    if (
      this.state.lat &&
      this.state.lon &&
      this.state.speed &&
      this.props.waypoint
    ) {
      const dist = getDistance(
        {
          latitude: this.state.lat,
          longitude: this.state.lon
        },
        {
          latitude: this.props.waypoint.lat,
          longitude: this.props.waypoint.lon
        }
      );
      this.setState({ dist });
      const eta = dist / this.state.speed;

      const calceta = eta * etaUnit.factor;
      etaLabel = calceta.toFixed(calceta < 10 ? 1 : 0);
    }
    this.setState({ etaLabel, etaUnit: etaUnit.symbol });
  };

  changeUnit = () => {
    const units = Config.timeUnits.length - 1;
    if (this.state.etaUnitIndex < units) this.state.etaUnitIndex++;
    else this.state.etaUnitIndex = 0;
    this.updateLabels();
  };

  render() {
    const {} = this.state;
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
            <Text style={styles.number}>{this.state.etaLabel}</Text>
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
            <Text style={styles.text}>{this.state.etaUnit}</Text>
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
)(Eta);
