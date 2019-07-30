import React, { Fragment, Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Text,
  FlatList,
  TouchableHighlight
} from "react-native";

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
            <TouchableHighlight>
              <Text style={[styles.itemName, { backgroundColor: "#0AF" }]}>
                Add new waypoint
              </Text>
            </TouchableHighlight>
            <FlatList
              data={this.props.waypoints}
              keyExtractor={(item, index) => index}
              renderItem={({ item }) => (
                <TouchableHighlight
                  style={styles.item}
                  onPress={() => {
                    this.props.setWaypoint(item);
                    navigate("Home");
                  }}
                >
                  <Text style={styles.itemName}>{item.name}</Text>
                </TouchableHighlight>
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
