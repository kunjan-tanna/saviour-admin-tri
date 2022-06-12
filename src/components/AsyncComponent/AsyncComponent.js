/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
import React from "react";
import Loadable from "react-loadable";

// rct page loader
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";

// ecommerce dashboard
const AsyncEcommerceDashboardComponent = Loadable({
  loader: () => import("Routes/dashboard/"),
  loading: () => <RctPageLoader />,
});

/*---------------- Session ------------------*/

// Session Login
const AsyncSessionLoginComponent = Loadable({
  loader: () => import("Routes/session/login"),
  loading: () => <RctPageLoader />,
});

// Session Lock Screen
const AsyncSessionLockScreenComponent = Loadable({
  loader: () => import("Routes/session/lock-screen"),
  loading: () => <RctPageLoader />,
});

// Session Forgot Password
const AsyncSessionForgotPasswordComponent = Loadable({
  loader: () => import("Routes/session/forgot-password"),
  loading: () => <RctPageLoader />,
});

// Session Reset Password
const AsyncSessionResetPasswordComponent = Loadable({
  loader: () => import("Routes/session/reset-password"),
  loading: () => <RctPageLoader />,
});

// Session Page 404
const AsyncSessionPage404Component = Loadable({
  loader: () => import("Routes/session/404"),
  loading: () => <RctPageLoader />,
});

// Session Page 404
const AsyncSessionPage500Component = Loadable({
  loader: () => import("Routes/session/500"),
  loading: () => <RctPageLoader />,
});

export {
  AsyncSessionLoginComponent,
  AsyncSessionLockScreenComponent,
  AsyncSessionForgotPasswordComponent,
  AsyncSessionPage404Component,
  AsyncSessionPage500Component,
  AsyncEcommerceDashboardComponent,
  AsyncSessionResetPasswordComponent,
};
