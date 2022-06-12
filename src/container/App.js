/**
 * App.js Layout Start Here
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

// rct theme provider
import RctThemeProvider from "./RctThemeProvider";

//Main App
import RctDefaultLayout from "./DefaultLayout";

// async components
import {
  AsyncSessionLoginComponent,
  AsyncSessionForgotPasswordComponent,
  AsyncSessionPage404Component,
  AsyncSessionPage500Component,
  AsyncSessionResetPasswordComponent,
} from "Components/AsyncComponent/AsyncComponent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Terms from "Routes/TermsCondition";
const InitialPath = ({ component: Component, adminAuthReducer, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      adminAuthReducer ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

class App extends Component {
  render() {
    const user_type = localStorage.getItem("user_type");
    const { location, match, user, loading } = this.props;

    if (location.pathname === "/") {
      if (user === null) {
        return <Redirect to={"/login"} />;
      } else {
        return <Redirect to={"/app/dashboard"} />;
      }
    }
    return (
      <RctThemeProvider>
        {loading && (
          <div className="loading">
            <CircularProgress />
          </div>
        )}
        {localStorage.getItem("auth_token") ? (
          <Switch>
            <Route
              path={`${match.url}app`}
              name="Dashboard"
              render={(props) => (
                <RctDefaultLayout {...props} loading={loading} />
              )}
            />
            <Redirect to={"/app/dashboard"} />
          </Switch>
        ) : (
          <Switch>
            <Route
              exact
              path="/terms-conditions"
              render={(props) => <Terms {...props} />}
            />
            <Route
              path="/login"
              name="Login"
              render={(props) => <AsyncSessionLoginComponent {...props} />}
            />

            <Route
              path="/forgot-password"
              render={(props) => (
                <AsyncSessionForgotPasswordComponent {...props} />
              )}
            />

            <Route
              path="/session/404"
              render={(props) => <AsyncSessionPage404Component {...props} />}
            />
            <Route
              path="/session/500"
              render={(props) => <AsyncSessionPage500Component {...props} />}
            />
            <Route
              exact
              path="/reset-password/:guid"
              render={(props) => (
                <AsyncSessionResetPasswordComponent {...props} />
              )}
            />
            <Route
              path="/callback"
              render={(props) => {
                handleAuthentication(props);
                return <Callback {...props} />;
              }}
            />
            <Redirect to={"/login"} />
          </Switch>
        )}
      </RctThemeProvider>
    );
  }
}

// map state to props
const mapStateToProps = ({ adminAuthReducer }) => {
  const { user, loading } = adminAuthReducer;
  return { user, loading };
};

export default connect(mapStateToProps)(App);
