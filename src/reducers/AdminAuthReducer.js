import * as Types from "../actions/types";

const initialState = {
  user: localStorage.getItem("user_id"),
  signInData: {},
  changePasswordData: {},
  forgetPasswordData: {},
  checkLinkData: {},
  resetPasswordData: {},
  notificationsData: {},
  readNotificationsData: {},
  DashboardCountsData: {},
  loading: false,
};

const signInUser = (state, action) => {
  return {
    ...state,
    signInData: action.res,
  };
};
const changePassword = (state, action) => {
  return {
    ...state,
    changePasswordData: action.res,
  };
};
const forgetPassword = (state, action) => {
  return {
    ...state,
    forgetPasswordData: action.res,
  };
};
const checkLink = (state, action) => {
  return {
    ...state,
    checkLinkData: action.res,
  };
};
const resetPassword = (state, action) => {
  return {
    ...state,
    resetPasswordData: action.res,
  };
};
const getNotifications = (state, action) => {
  return {
    ...state,
    notificationsData: action.res,
  };
};
const readNotifications = (state, action) => {
  return {
    ...state,
    readNotificationsData: action.res,
  };
};
const getDashboardCounts = (state, action) => {
  return {
    ...state,
    DashboardCountsData: action.res,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.LOGIN_USER:
      return signInUser(state, action);
    case Types.CHANGE_PASSWORD_SUCCESS:
      return changePassword(state, action);
    case Types.FORGOT_PASSWORD_SUCCESS:
      return forgetPassword(state, action);
    case Types.CHECK_LINK_SUCCESS:
      return checkLink(state, action);
    case Types.RESET_PASSWORD_SUCCESS:
      return resetPassword(state, action);
    case Types.GET_NOTIFICATIONS_LIST_RESPONSE:
      return getNotifications(state, action);
    case Types.READ_NOTIFICATIONS_RESPONSE:
      return readNotifications(state, action);
    case Types.DASHBOARD_COUNT_RESPONSE:
      return getDashboardCounts(state, action);
    case Types.START_LOADER:
      return {
        ...state,
        loading: true,
      };
    case Types.STOP_LOADER:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
export default reducer;
