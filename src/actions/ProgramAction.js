import * as Types from './types';
import * as common from '../api/index';

export const addProgramDetails = (reqData) => {
    return async (dispatch) => {

        console.log("REQ DATA:::", reqData)
        let response = await common.apiCall('POST', 'addProgramDetails', Types.ADD_PROGRAM_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.ADD_PROGRAM_DETAILS_SUCCESS,
            res: response
        });
    }
}
export const getAllProgramList = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getAllProgramList', Types.GET_PROGRAM_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.GET_PROGRAM_DETAILS_SUCCESS,
            res: response
        });
    }
}

export const activeDeactiveProgram = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'activeDeactiveProgram', Types.ACTIVE_DEACTIVE_PROGRAM_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.ACTIVE_DEACTIVE_PROGRAM_SUCCESS,
            res: response
        });
    }
}
export const getAllProgramListById = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getAllProgramListById', Types.GET_ALL_PROGRAM_BY_ID, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.GET_ALL_PROGRAM_BY_ID,
            res: response
        });
    }
}
export const deleteProgram = (reqData) => {
        return async (dispatch) => {
            let response = await common.apiCall('POST', 'deleteProgram', Types.DELETE_PROGRAM_SUCCESS, reqData)
            console.log('Response::::', response)
            dispatch({
                type: Types.DELETE_PROGRAM_SUCCESS,
                res: response
            });
        }
}
export const editProgramDetails = (reqData) => {

    console.log("EDIT REQ DATA:", reqData)
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'editProgramDetails', Types.EDIT_PROGRAM_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.EDIT_PROGRAM_DETAILS_SUCCESS,
            res: response
        });
    }
}
export const getAllProgramFeedback = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getAllProgramFeedback', Types.PROGRAM_FEEDBACK, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.PROGRAM_FEEDBACK,
            res: response
        });
    }
}




