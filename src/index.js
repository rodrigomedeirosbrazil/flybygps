import React, { Fragment, Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  Platform,
  PermissionsAndroid,
  Animated
} from "react-native";

import Svg, {
  Circle,
  Text as TextSVG,
  G,
  Polygon,
  Line
} from "react-native-svg";

import Geolocation from "@react-native-community/geolocation";

class App extends Component {
  watchId = null;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      updatesEnabled: false,
      location: {},
      compassAnimation: new Animated.Value(0),
      compassRotation: 0,
      needleAnimation: new Animated.Value(0),
      needleRotation: 0
    };

    this.state.compassAnimation.addListener(p => {
      this.setCompass(p.value);
    });

    //this.getLocation();
    this.getLocationUpdates();
  }

  setCompass = rotation => {
    const newRotation =
      rotation < 0 ? Math.trunc(rotation) + 360 : Math.trunc(rotation) % 360;
    //console.log("rotation", newRotation);
    this.setState({
      compassRotation: newRotation
    });
  };

  setHeading = position => {
    this.setState({ location: position });

    let newRotation = position.coords.heading
      ? 360 - position.coords.heading
      : 0;

    const calcOldRotation = 360 - this.state.compassRotation;
    const calcNewRotation = 360 - newRotation;
    let dif = calcOldRotation - calcNewRotation;

    // escolhe a direção mais curta para girar
    if (dif >= 0 && dif > 180) {
      dif = (360 - dif) * -1;
    } else if (dif < 0 && dif < -180) {
      dif = dif + 360;
    }
    const toValue = this.state.compassRotation + dif;

    // console.log(
    //   position.coords.heading,
    //   this.state.compassRotation,
    //   newRotation,
    //   dif,
    //   toValue
    // );
    Animated.timing(this.state.compassAnimation).stop();
    Animated.timing(this.state.compassAnimation, {
      toValue: toValue,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

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
          this.setState({
            location: position,
            compass_rotation: position.coords.heading - 360,
            loading: false
          });
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
      this.watchId = Geolocation.watchPosition(position => {
        this.setState({
          location: position
        });
        this.setHeading(position);
      });
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
            <Svg height="50%" width="50%" viewBox="0 0 100 100">
              <G
                rotation={this.state.compassRotation}
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
                rotation={this.state.needleRotation}
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
          <View style={styles.container}>
            <Button title="Roda a roda" onPress={this.roda} />
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
