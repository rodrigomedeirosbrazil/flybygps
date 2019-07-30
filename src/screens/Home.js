import React, { Fragment, Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Text,
  TouchableHighlight
} from "react-native";

import { connect } from "react-redux";
import { toggleGpsAction, newPositionAction } from "../store/actions/gps";
import { getDistance, getRhumbLineBearing } from "geolib";

import GpsService from "../services/gps";
import Compass from "../components/Compass";
import Speed from "../components/Speed";
import Altitude from "../components/Altitude";

class Home extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.toggleGps(true);
  }

  getDistanceTo = () => {
    if (
      this.props.position &&
      this.props.position.coords &&
      this.props.waypoint
    ) {
      return getDistance(
        {
          latitude: this.props.position.coords.latitude,
          longitude: this.props.position.coords.longitude
        },
        {
          latitude: this.props.waypoint.lat,
          longitude: this.props.waypoint.lon
        }
      );
    }
    return "N/A";
  };

  getBearingTo = () => {
    if (
      this.props.position &&
      this.props.position.coords &&
      this.props.waypoint
    ) {
      return getRhumbLineBearing(
        {
          latitude: this.props.position.coords.latitude,
          longitude: this.props.position.coords.longitude
        },
        {
          latitude: this.props.waypoint.lat,
          longitude: this.props.waypoint.lon
        }
      );
    }
    return "N/A";
  };

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
              <TouchableHighlight onLongPress={() => navigate("Waypoints")}>
                <Compass />
              </TouchableHighlight>
            </View>
            <Text>{JSON.stringify(this.props.position, null, 4)}</Text>
            <Text>GPS is: {this.props.isOn ? "ON" : "OFF"}</Text>
            {this.props.waypoint && (
              <Text>
                Distance to {this.props.waypoint.name}: {this.getDistanceTo()}{" "}
                Bearing:
                {this.getBearingTo()}
              </Text>
            )}
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
    flex: 1
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
