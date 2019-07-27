import React, { Fragment, Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Text,
  Button
} from "react-native";

import { connect } from "react-redux";
import { toggleGpsAction, newPositionAction } from "./store/actions/gps";

import GpsService from "./services/gps"
import Compass from "./components/Compass";
import Speed from "./components/Speed";
import Altitude from "./components/Altitude";


class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.toggleGps(true);
  }

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container}>
          <GpsService />
          <View style={styles.col}>
            <Compass />
              <Speed />
              <Altitude />
              <Text>{JSON.stringify(this.props.position, null, 4)}</Text>
              <Text>GPS is: {this.props.isOn ? "ON" : "OFF"}</Text>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8EBCD"
  },
  row: {
    flex: 1,
    flexDirection: "row"
  },
  col: {
    flex: 1
  }
});

const mapStateToProps = state => {
  return {
    position: state.gps.position,
    isOn: state.gps.isOn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleGps: isOn => {
      dispatch(toggleGpsAction(isOn));
    },
    newPosition: position => {
      dispatch(newPositionAction(position));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
