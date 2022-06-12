import * as Types from './types';
import * as common from '../api/index';


export const getAllUserFeedback = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getAllUserFeedback', Types.GET_SUPPORT_AND_FEEDBACK_LIST_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.GET_SUPPORT_AND_FEEDBACK_LIST_SUCCESS,
            res: response
        });
    }
}






