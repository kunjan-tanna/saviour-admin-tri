import * as Types from './types';
import * as common from '../api/index';

export const getSettingsDetails = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getSettingsDetail', Types.GET_SETTINGS_DETAILS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.GET_SETTINGS_DETAILS,
            res: response
        });
    }
}
export const editSettingsDetail = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'editSettingsDetail', Types.EDIT_SETTINGS_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.EDIT_SETTINGS_DETAILS_SUCCESS,
            res: response
        });
    }
}




