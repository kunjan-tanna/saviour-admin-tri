/**
 * Main App
 */
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

// css
import "./lib/reactifyCss";

// app component
import App from "./container/App";
// import { configureStore } from './store';
import store from "./util/store";
import history from "./util/history";
// import 'file-loader?name=firebase-messaging-sw.js!../public/firebase-messaging-sw.js';

const MainApp = () => (
  <Provider store={store}>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Router history={history}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </Router>
    </MuiPickersUtilsProvider>
  </Provider>
);

export default MainApp;
