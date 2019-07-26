import "./ReactotronConfig"
import { AppRegistry } from "react-native";
import React from "react";
import { Provider } from "react-redux";
import App from "./src/";
import { name as appName } from "./app.json";

import configureStore from "./src/store";
const store = configureStore();

const AppContainer = () => 
  <Provider store={store}>
    <App />
  </Provider>;


AppRegistry.registerComponent(appName, () => AppContainer);
