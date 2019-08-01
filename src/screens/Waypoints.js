import React, { Fragment, Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Text,
  FlatList
} from "react-native";
import Touchable from "react-native-platform-touchable";

import { connect } from "react-redux";
import {
  updateWaypointsAction,
  setWaypointAction
} from "../store/actions/config";

class Waypoints extends Component {
  static navigationOptions = {
    title: "Waypoints"
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Fragment>
        <StatusBar barStyle="light-content" />
        <SafeAreaView>
          <View>
            <Touchable
              onPress={() => {
                navigate("Waypoint", { index: -1 });
              }}
            >
              <Text style={[styles.itemName, { backgroundColor: "#0AF" }]}>
                Add new waypoint
              </Text>
            </Touchable>
            <FlatList
              data={this.props.waypoints}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => (
                <Touchable
                  style={styles.item}
                  onPress={() => {
                    this.props.setWaypoint(item);
                    navigate("Home");
                  }}
                  onLongPress={() => {
                    navigate("Waypoint", { index });
                  }}
                >
                  <Text style={styles.itemName}>{item.name}</Text>
                </Touchable>
              )}
            />
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    height: 50
  },
  itemName: {
    fontSize: 20,
    padding: 10,
    borderBottomColor: "#222",
    borderBottomWidth: 1
  }
});

const mapStateToProps = state => {
  return {
    waypoints: state.config.waypoints
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateWaypoints: waypoints => {
      dispatch(updateWaypointsAction(waypoints));
    },
    setWaypoint: waypoint => {
      dispatch(setWaypointAction(waypoint));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Waypoints);
