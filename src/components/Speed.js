import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Touchable from "react-native-platform-touchable";

import Config from "../config";
import { connect } from "react-redux";

class Speed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: null,
      speedUnitIndex: 1,
      speedLabel: "",
      speedUnit: ""
    };
  }

  componentDidMount() {
    this.updateLabels();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.position !== this.props.position) {
      this.setPosition(this.props.position);
    }
  }

  setPosition = position => {
    if (
      !position ||
      !position.coords ||
      !position.coords.speed ||
      position.coords.speed == this.speed
    ) {
      this.setState({ speed: null });
    } else {
      this.setState({ speed: position.coords.speed });
    }
    this.updateLabels();
  };

  updateLabels = () => {
    const speedUnit = Config.speedUnits[this.state.speedUnitIndex];
    let speedLabel = "N/A";
    if (this.state.speed) {
      const calcSpeed = this.state.speed * speedUnit.factor;
      speedLabel = calcSpeed.toFixed(calcSpeed < 10 ? 1 : 0);
    }
    this.setState({ speedLabel, speedUnit: speedUnit.symbol });
  };

  changeUnit = () => {
    const units = Config.speedUnits.length - 1;
    if (this.state.speedUnitIndex < units) this.state.speedUnitIndex++;
    else this.state.speedUnitIndex = 0;
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
            <Text style={styles.number}>{this.state.speedLabel}</Text>
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
            <Text style={styles.text}>{this.state.speedUnit}</Text>
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
