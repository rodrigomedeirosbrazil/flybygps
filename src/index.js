import React, { Fragment, Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  Platform,
  PermissionsAndroid
} from "react-native";

import Compass from "./components/Compass";

import Geolocation from "@react-native-community/geolocation";

class App extends Component {
  watchId = null;

  getLocationOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 10000,
    distanceFilter: 1,
    forceRequestLocation: true,
    showLocationDialog: true
  };

  watchPositionOptions = {
    enableHighAccuracy: true,
    distanceFilter: 1,
    interval: 1000,
    fastInterval: 900,
    showLocationDialog: true,
    forceRequestLocation: true
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      updatesEnabled: false,
      location: {}
    };

    // this.getLocation();
    // this.getLocationUpdates();
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
          this.compass.setPosition(position);
        },
        error => {
          this.setState({ location: error, loading: false });
          console.log(error);
        },
        this.getLocationOptions
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
          this.compass.setPosition(position);
        },
        error => {
          this.setState({ location: error, loading: false });
          console.log(error);
        },
        this.watchPositionOptions
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
          <Compass onRef={ref => (this.compass = ref)} />
          <View style={styles.container}>
            <Button
              title="300 graus"
              onPress={() => {
                this.compass.setPosition({
                  coords: {
                    heading: 300
                  }
                });
              }}
            />
            <Button
              title="15 graus"
              onPress={() => {
                this.compass.setPosition({
                  coords: {
                    heading: 15
                  }
                });
              }}
            />
            <Button
              title="Get Location"
              onPress={this.getLocation}
              disabled={loading || updatesEnabled}
            />
            <View style={styles.buttons}>
              <Button
                title="Start Observing"
                onPress={this.getLocationUpdates}
                disabled={updatesEnabled}
              />
              <Button
                title="Stop Observing"
                onPress={this.removeLocationUpdates}
                disabled={!updatesEnabled}
              />
            </View>

            <View style={styles.result}>
              <Text>{JSON.stringify(location, null, 4)}</Text>
            </View>
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
