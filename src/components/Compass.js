import React, { Component } from "react";
import { View, Animated } from "react-native";

import Svg, { Circle, Text as TextSVG, G, Polygon } from "react-native-svg";
import { connect } from "react-redux";

class Compass extends Component {
  compassAnimation = null;
  needleAnimation = null;
  lastPosition = null;

  constructor(props) {
    super(props);
    this.state = {
      heading: 0,
      compassRotation: 0,
      needleRotation: 0
    };
  }

  componentDidUpdate() {
    if (this.lastPosition !== this.props.position){
      this.lastPosition = this.props.position;
      this.setPosition(this.props.position);
    }
  }

  setCompass = rotation => {
    const newRotation =
      rotation < 0 ? Math.trunc(rotation) + 360 : Math.trunc(rotation) % 360;
    console.log(rotation, newRotation);
    this.setState({
      compassRotation: newRotation
    });
  };

  setPosition = position => {
    if (
      !position ||
      !position.coords ||
      !position.coords.heading ||
      position.coords.heading == this.heading
    )
      return;

    this.setHeading(position.coords.heading);
  };

  setHeading = newHeading => {
    let newRotation = newHeading ? 360 - newHeading : 0;
    if (newRotation == this.state.compassRotation) return;

    const toValue =
      this.state.compassRotation +
      this.calcNearTurn(this.state.compassRotation, newRotation);

    if (this.compassAnimation) Animated.timing(this.compassAnimation).stop();
    (this.compassAnimation = new Animated.Value(this.state.compassRotation)),
      this.compassAnimation.addListener(param => {
        this.setCompass(param.value);
      });

    Animated.timing(this.compassAnimation, {
      toValue: toValue,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  calcNearTurn = (oldPos, newPos) => {
    const calcOldPos = 360 - oldPos;
    const calcNewPos = 360 - newPos;
    let dif = calcOldPos - calcNewPos;

    // escolhe a direção mais curta para girar
    if (dif >= 0 && dif > 180) {
      dif = (360 - dif) * -1;
    } else if (dif < 0 && dif < -180) {
      dif = dif + 360;
    }

    return dif;
  };

  render() {
    return (
      <View>
        <Svg
          height="200"
          width="200"
          viewBox="0 0 100 100"
          style={{ borderColor: "#fa0", borderWidth: 5 }}
        >
          <G rotation={this.state.compassRotation} origin="50, 50" id="compass">
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
          <G rotation={this.state.needleRotation} origin="50, 50" id="needle">
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
  };
};

export default connect(
  mapStateToProps, null
)(Compass);
