import * as Types from './types';
import * as common from '../api/index';

export const signInUser = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'signin', Types.LOGIN_USER, reqData)
        dispatch({
            type: Types.LOGIN_USER,
            res: response
        });
    }
}
export const changePassword = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'changePassword', Types.CHANGE_PASSWORD_SUCCESS, reqData)
        dispatch({
            type: Types.CHANGE_PASSWORD_SUCCESS,
            res: response
        });
    }
}
export const forgetPassword = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'forgetPassword', Types.FORGOT_PASSWORD_SUCCESS, reqData)
        dispatch({
            type: Types.FORGOT_PASSWORD_SUCCESS,
            res: response
        });
    }
}
export const checkLink = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'checkLink', Types.CHECK_LINK_SUCCESS, reqData)
        dispatch({
            type: Types.CHECK_LINK_SUCCESS,
            res: response
        });
    }
}
export const resetPassword = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'resetPassword', Types.RESET_PASSWORD_SUCCESS, reqData)
        dispatch({
            type: Types.RESET_PASSWORD_SUCCESS,
            res: response
        });
    }
}

export const getNotifications = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getNotifications', Types.GET_NOTIFICATIONS_LIST_RESPONSE, reqData);
        dispatch({
            type: Types.GET_NOTIFICATIONS_LIST_RESPONSE,
            res: response
        });
    }
}

export const readNotifications = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'readNotifications', Types.READ_NOTIFICATIONS_RESPONSE, reqData);
        dispatch({
            type: Types.READ_NOTIFICATIONS_RESPONSE,
            res: response
        });
    }
}

export const getDashboardCounts = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getDashboardCounts', Types.DASHBOARD_COUNT_RESPONSE, reqData);

        dispatch({
            type: Types.DASHBOARD_COUNT_RESPONSE,
            res: response
        });
    }
}

