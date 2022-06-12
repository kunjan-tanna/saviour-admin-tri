import * as Types from './types';
import * as common from '../api/index';

export const addAppointementDetails = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'addAppointementDetails', Types.ADD_APPOINTEMENT_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.ADD_APPOINTEMENT_DETAILS_SUCCESS,
            res: response
        });
    }
}
export const getAllAppointementList = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getAllAppointementList', Types.GET_APPOINTEMENT_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.GET_APPOINTEMENT_DETAILS_SUCCESS,
            res: response
        });
    }
}

export const activeDeactiveAppointement = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'activeDeactiveAppointement', Types.ACTIVE_DEACTIVE_APPOINTEMENT_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.ACTIVE_DEACTIVE_APPOINTEMENT_SUCCESS,
            res: response
        });
    }
}
export const getAllAppointementListById = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getAllAppointementListById', Types.GET_ALL_APPOINTEMENT_BY_ID, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.GET_ALL_APPOINTEMENT_BY_ID,
            res: response
        });
    }
}
export const deleteAppointement = (reqData) => {
        return async (dispatch) => {
            let response = await common.apiCall('POST', 'deleteAppointement', Types.DELETE_APPOINTEMENT_SUCCESS, reqData)
            console.log('Response::::', response)
            dispatch({
                type: Types.DELETE_APPOINTEMENT_SUCCESS,
                res: response
            });
        }
}
export const editAppointementDetails = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'editAppointementDetails', Types.EDIT_APPOINTEMENT_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.EDIT_APPOINTEMENT_DETAILS_SUCCESS,
            res: response
        });
    }
}




