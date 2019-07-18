import React, { Fragment, Component } from "react";
import { SafeAreaView, StyleSheet, View, Text, StatusBar } from "react-native";

import Svg, {
  Circle,
  Text as TextSVG,
  G,
  Polygon,
  Line
} from "react-native-svg";

import Geolocation from "react-native-geolocation-service";

class App extends Component {
  watchId = null;

  state = {
    loading: false,
    updatesEnabled: false,
    location: {},
    compass_rotation: 0,
    needle_rotation: 45
  };

  constructor(props) {
    super(props);
  }

  hasLocationPermission = async () => {
    if (
      Platform.OS === "ios" ||
      (Platform.OS === "android" && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        "Location permission denied by user.",
        ToastAndroid.LONG
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        "Location permission revoked by user.",
        ToastAndroid.LONG
      );
    }

    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({ location: position, loading: false });
          console.log(position);
        },
        error => {
          this.setState({ location: error, loading: false });
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 50,
          forceRequestLocation: true
        }
      );
    });
  };

  getLocationUpdates = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ updatesEnabled: true }, () => {
      this.watchId = Geolocation.watchPosition(
        position => {
          this.setState({ location: position });
          console.log(position);
        },
        error => {
          this.setState({ location: error });
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 5000,
          fastestInterval: 2000
        }
      );
    });
  };

  removeLocationUpdates = () => {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.setState({ updatesEnabled: false });
    }
  };

  render() {
    const { loading, location, updatesEnabled } = this.state;
    return (
      <Fragment>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.container}>
          <View>
            <View style={styles.result}>
              <Text>{JSON.stringify(location, null, 4)}</Text>
            </View>
            <Svg height="50%" width="50%" viewBox="0 0 100 100">
              <G
                rotation={this.state.compass_rotation}
                origin="50, 50"
                id="compass"
              >
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
              <G
                rotation={this.state.needle_rotation}
                origin="50, 50"
                id="needle"
              >
                <Polygon
                  points="50,25 30,65 50,55 70,65"
                  stroke="#222"
                  strokeWidth="1"
                  fillOpacity="0"
                />
              </G>
            </Svg>
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
  }
});

export default App;
