import "./ReactotronConfig";
import { AppRegistry } from "react-native";
import React from "react";
import { Provider } from "react-redux";
import App from "./src/";
import { name as appName } from "./app.json";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./src/store";

const AppContainer = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppContainer);
