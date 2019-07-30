import React, { Fragment, Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Text,
  TextInput,
  Button
} from "react-native";

import { connect } from "react-redux";
import { updateWaypointsAction } from "../store/actions/config";
import NumberInput from "../components/NumberInput";

class Waypoint extends Component {
  static navigationOptions = {
    title: "Waypoint"
  };

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      lat: "",
      lon: "",
      alt: ""
    };
  }

  save = () => {
    const index = this.props.navigation.state.params.index;
    const newWaypoint = {
      name: this.state.name,
      lat: this.state.lat,
      lon: this.state.lon,
      alt: this.state.alt
    };
    let waypoints = Object.assign(this.props.waypoints);
    if (index >= 0) waypoints[index] = newWaypoint;
    else waypoints.push(newWaypoint);
    this.props.updateWaypoints(waypoints);
    this.props.navigation.navigate("Waypoints");
  };

  componentDidMount = () => {
    const index = this.props.navigation.state.params.index;
    if (index >= 0)
      this.setState({
        name: this.props.waypoints[index].name,
        lat: this.props.waypoints[index].lat,
        lon: this.props.waypoints[index].lon,
        alt: this.props.waypoints[index].alt
      });
  };

  render() {
    const index = this.props.navigation.state.params.index;
    return (
      <Fragment>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container}>
          <View>
            <Text style={styles.textLabel}>Name:</Text>
            <TextInput
              value={this.state.name}
              style={styles.input}
              onChangeText={name => {
                this.setState({ name });
              }}
            />
          </View>
          <View>
            <Text style={styles.textLabel}>Latitude:</Text>
            <NumberInput
              value={index >= 0 ? this.props.waypoints[index].lat : ""}
              style={styles.input}
              onChange={lat => {
                this.setState({ lat });
              }}
            />
          </View>
          <View>
            <Text style={styles.textLabel}>Longitude:</Text>
            <NumberInput
              value={index >= 0 ? this.props.waypoints[index].lon : ""}
              style={styles.input}
              onChange={lon => {
                this.setState({ lon });
              }}
            />
          </View>
          <View>
            <Text style={styles.textLabel}>Altitude:</Text>
            <NumberInput
              value={index >= 0 ? this.props.waypoints[index].alt : ""}
              style={styles.input}
              onChange={alt => {
                this.setState({ alt });
              }}
            />
          </View>
          <Button onPress={this.save} title="Save" />
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  textLabel: {
    fontSize: 18
  },
  input: {
    fontSize: 22,
    borderWidth: 1,
    marginBottom: 10,
    padding: 5
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Waypoint);
