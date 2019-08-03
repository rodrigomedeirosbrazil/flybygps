import React, { Component } from "react";
import { View } from "react-native";

import Svg, { Circle, Text as TextSVG, G, Polygon } from "react-native-svg";
import { connect } from "react-redux";
import { getRhumbLineBearing } from "geolib";

class Compass extends Component {
  constructor(props) {
    super(props);
  }

  getCompassRotation = () => {
    const { coords } = this.props.position;
    if (!coords || coords.heading === undefined) return 0;
    const { heading } = coords;
    const rotation = 360 - heading;
    const compassRotation =
      rotation < 0 ? Math.trunc(rotation) + 360 : Math.trunc(rotation) % 360;

    const needleRotation = this.getNeedleRotation(compassRotation);

    return { compassRotation, needleRotation };
  };

  getNeedleRotation = compassRotation => {
    const { coords } = this.props.position;
    if (!coords || !this.props.waypoint) return 0;
    const bearing = getRhumbLineBearing(
      {
        latitude: coords.latitude,
        longitude: coords.longitude
      },
      {
        latitude: this.props.waypoint.lat,
        longitude: this.props.waypoint.lon
      }
    );
    let newRotation = 360 - bearing;
    newRotation = compassRotation - newRotation;

    return newRotation < 0
      ? Math.trunc(newRotation) + 360
      : Math.trunc(newRotation) % 360;
  };

  render() {
    const { compassRotation, needleRotation } = this.getCompassRotation();
    return (
      <View>
        <Svg height="200" width="200" viewBox="0 0 100 100">
          <G
            rotation={compassRotation}
            origin="50, 50"
            id="compass"
            // opacity={this.state.heading !== null ? "1" : "0.3"}
          >
            <Circle
              cx="50"
              cy="50"
              r="50"
              stroke="#222"
              strokeWidth="1"
              fillOpacity="0"
            />
            <Circle
              cx="50"
              cy="50"
              r="35"
              stroke="#222"
              strokeWidth="1"
              fillOpacity="0"
            />
            <TextSVG x="46" y="12" fill="#222" fontWeight="bold">
              N
            </TextSVG>
            <TextSVG x="46" y="96" fill="#222" fontWeight="bold">
              S
            </TextSVG>
            <TextSVG x="4" y="54" fill="#222" fontWeight="bold">
              O
            </TextSVG>
            <TextSVG x="88" y="54" fill="#222" fontWeight="bold">
              L
            </TextSVG>
          </G>
          <G rotation={needleRotation} origin="50, 50" id="needle">
            <Polygon
              points="50,25 30,65 50,55 70,65"
              stroke="#222"
              strokeWidth="1"
              fillOpacity="0"
            />
          </G>
        </Svg>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    position: state.gps.position,
    waypoint: state.config.waypoint
  };
};

export default connect(
  mapStateToProps,
  null
)(Compass);
