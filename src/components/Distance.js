import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import Config from "../config";
import { connect } from "react-redux";
import { getDistance } from "geolib";

class Distance extends Component {
  lastPosition = null;

  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lon: 0,
      dist: null,
      distUnitIndex: 0,
      distLabel: "",
      distUnit: ""
    };
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
        lon: position.coords.longitude
      });
    }
    this.updateLabels();
  };

  updateLabels = () => {
    const distUnit = Config.distanceUnits[this.state.distUnitIndex];
    let distLabel = "N/A";
    if (this.state.lat && this.state.lon && this.props.waypoint) {
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

      const calcdist = dist * distUnit.factor;
      distLabel = calcdist.toFixed(calcdist < 10 ? 1 : 0);
    }
    this.setState({ distLabel, distUnit: distUnit.symbol });
  };

  changeUnit = () => {
    const units = Config.distanceUnits.length - 1;
    if (this.state.distUnitIndex < units) this.state.distUnitIndex++;
    else this.state.distUnitIndex = 0;
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
            <Text style={styles.number}>{this.state.distLabel}</Text>
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
            <Text style={styles.text}>{this.state.distUnit}</Text>
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
    position: state.gps.position,
    waypoint: state.config.waypoint
  };
};

export default connect(
  mapStateToProps,
  null
)(Distance);
