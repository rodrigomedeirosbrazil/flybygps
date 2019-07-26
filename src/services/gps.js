import { Component } from "react";
import { Platform, PermissionsAndroid } from "react-native";

import { connect } from "react-redux";
import { newPositionAction } from "../store/actions/gps";

import Geolocation from "@react-native-community/geolocation";

class Gps extends Component {
  watchId = null;
  updatesEnabled = false;

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
    if (this.props.isOn) {
      this.getLocation();
      this.getLocationUpdates();
    }
  }

  componentDidUpdate() {
    console.log('component did update GPS')
    if (this.props.isOn && !this.updatesEnabled) {
      this.updatesEnabled = true;
      this.getLocation();
      this.getLocationUpdates();
    } else if (this.props.isOn && this.updatesEnabled) {
      this.updatesEnabled = false;    
      this.removeLocationUpdates();
    }
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
          this.props.newPosition(position);
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
          this.props.newPosition(position);
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
    return null;
  }
}

const mapStateToProps = state => {
  return {
    isOn: state.gps.isOn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    newPosition: position => {
      dispatch(newPositionAction(position));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gps);
