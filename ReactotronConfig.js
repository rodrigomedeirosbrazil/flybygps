import Reactotron from "reactotron-react-native";

Reactotron
  .configure({ name: 'FlyBy', host: "192.168.1.20" }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!) // controls connection & communication settings

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear();

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  console.tron = Reactotron;

