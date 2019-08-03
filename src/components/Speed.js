import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Touchable from "react-native-platform-touchable";

import Config from "../config";
import { connect } from "react-redux";

class Speed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speedUnitIndex: 1
    };
  }

  changeUnit = () => {
    const units = Config.speedUnits.length - 1;
    const speedUnitIndex =
      this.state.speedUnitIndex < units ? this.state.speedUnitIndex + 1 : 0;
    this.setState({ speedUnitIndex });
  };

  getUnitFactor = () => {
    const speedUnit = Config.speedUnits[this.state.speedUnitIndex];
    return speedUnit.factor;
  };

  getSpeedUnit = () => {
    const speedUnit = Config.speedUnits[this.state.speedUnitIndex];
    return speedUnit.symbol;
  };

  getSpeedLabel = () => {
    const { coords } = this.props.position;
    if (!coords || coords.speed === undefined) return "N/A";
    const { speed } = coords;
    const calcSpeed = speed * this.getUnitFactor();
    return calcSpeed.toFixed(calcSpeed < 10 ? 1 : 0);
  };

  render() {
    const speedLabel = this.getSpeedLabel();
    const speedUnit = this.getSpeedUnit();
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
            <Text style={styles.text}>SPEED</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.number}>{speedLabel}</Text>
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
            <Text style={styles.text}>{speedUnit}</Text>
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
)(Speed);
