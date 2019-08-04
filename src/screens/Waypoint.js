import React, { Fragment, Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import Touchable from "react-native-platform-touchable";
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

  componentDidMount = () => {
    const index = this.props.navigation.state.params.index;
    if (index >= 0)
      this.setState({
        name: this.props.waypoints[index].name,
        lat: this.props.waypoints[index].lat,
        lon: this.props.waypoints[index].lon,
        alt: this.props.waypoints[index].alt
      });
    // else
    //   this.setState({
    //     lat: this.props.position.coords.latitude,
    //     lon: this.props.position.coords.longitude,
    //     alt: this.props.position.coords.altitude
    //   });
  };

  save = () => {
    const index = this.props.navigation.state.params.index;
    const newWaypoint = {
      name: this.state.name,
      lat: this.state.lat,
      lon: this.state.lon,
      alt: this.state.alt
    };
    if (index >= 0) this.props.waypoints[index] = newWaypoint;
    else this.props.waypoints.push(newWaypoint);
    this.props.navigation.goBack();
    this.props.updateWaypoints(this.props.waypoints);
  };

  delete = () => {
    const index = this.props.navigation.state.params.index;
    this.props.navigation.goBack();
    this.props.waypoints.splice(index, 1);
    this.props.updateWaypoints(this.props.waypoints);
  };

  render() {
    const index = this.props.navigation.state.params.index;
    const waypoint = this.props.waypoints[index];
    return (
      <Fragment>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <KeyboardAvoidingView
              behavior={Platform.select({
                ios: "padding",
                android: "padding"
              })}
            >
              <View>
                <Text style={styles.textLabel}>Name:</Text>
                <TextInput
                  value={this.state.name}
                  style={styles.input}
                  onChangeText={name => {
                    this.setState({ name });
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.latRef.focus();
                  }}
                  blurOnSubmit={false}
                />
              </View>
              <View>
                <Text style={styles.textLabel}>Latitude:</Text>
                <NumberInput
                  onRef={ref => (this.latRef = ref)}
                  value={index >= 0 && waypoint ? waypoint.lat : this.state.lat}
                  style={styles.input}
                  onChange={lat => {
                    this.setState({ lat });
                  }}
                />
              </View>
              <View>
                <Text style={styles.textLabel}>Longitude:</Text>
                <NumberInput
                  onRef={ref => (this.lonRef = ref)}
                  value={index >= 0 && waypoint ? waypoint.lon : this.state.lon}
                  style={styles.input}
                  onChange={lon => {
                    this.setState({ lon });
                  }}
                />
              </View>
              <View>
                <Text style={styles.textLabel}>Altitude:</Text>
                <NumberInput
                  onRef={ref => (this.altRef = ref)}
                  value={index >= 0 && waypoint ? waypoint.alt : this.state.alt}
                  style={styles.input}
                  onChange={alt => {
                    this.setState({ alt });
                  }}
                />
              </View>
              <Button onPress={this.save} title="Save" />
              {index >= 0 && (
                <Touchable
                  onPress={this.delete}
                  style={{
                    backgroundColor: "#f00",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                    height: 35
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#fff" }}>DELETE</Text>
                </Touchable>
              )}
            </KeyboardAvoidingView>
          </ScrollView>
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
    marginBottom: 10
    // padding: 5
  }
});

const mapStateToProps = state => {
  return {
    position: state.gps.position,
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
