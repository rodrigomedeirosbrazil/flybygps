import React, { Fragment, Component } from "react";
import { SafeAreaView, StyleSheet, View, StatusBar, Text } from "react-native";
import Touchable from "react-native-platform-touchable";
import KeepAwake from "react-native-keep-awake";

import { connect } from "react-redux";
import { toggleGpsAction, newPositionAction } from "../store/actions/gps";

import GpsService from "../services/gps";
import Compass from "../components/Compass";
import Speed from "../components/Speed";
import Altitude from "../components/Altitude";
import Distance from "../components/Distance";
import Eta from "../components/Eta";

class Home extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.toggleGps(true);
    KeepAwake.activate();
  }

  componentWillUnmount() {
    this.props.toggleGps(false);
    KeepAwake.deactivate();
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Fragment>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container}>
          <GpsService />
          <View style={styles.col}>
            <View style={styles.row}>
              <Speed />
              <Altitude />
            </View>
            <View style={{ alignItems: "center", padding: 10 }}>
              <Touchable onLongPress={() => navigate("Waypoints")}>
                <Compass />
              </Touchable>
            </View>
            {this.props.waypoint && (
              <View style={{ justifyContent: "center" }}>
                <View>
                  <Text style={{ borderWidth: 1 }}>
                    Waypoint: {this.props.waypoint.name}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Distance />
                  <Eta />
                </View>
              </View>
            )}
            {/* <Text style={{ fontSize: 10 }}>
              {JSON.stringify(this.props.position, null, 4)}
            </Text> */}
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
    flexDirection: "row"
  },
  col: {
    flex: 1,
    justifyContent: "space-between"
  }
});

const mapStateToProps = state => {
  return {
    position: state.gps.position,
    isOn: state.gps.isOn,
    waypoint: state.config.waypoint
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
)(Home);
