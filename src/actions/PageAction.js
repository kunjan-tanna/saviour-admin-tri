import * as Types from './types';
import * as common from '../api/index';

export const addPageDetails = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'addPageDetails', Types.ADD_PAGE_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.ADD_PAGE_DETAILS_SUCCESS,
            res: response
        });
    }
}
export const getAllPageList = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getAllPageList', Types.GET_PAGE_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.GET_PAGE_DETAILS_SUCCESS,
            res: response
        });
    }
}

export const activeDeactivePage = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'activeDeactivePage', Types.ACTIVE_DEACTIVE_PAGE_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.ACTIVE_DEACTIVE_PAGE_SUCCESS,
            res: response
        });
    }
}
export const getAllPageListById = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getAllPageListById', Types.GET_ALL_PAGE_BY_ID, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.GET_ALL_PAGE_BY_ID,
            res: response
        });
    }
}

export const deletePage = (reqData) => {
        return async (dispatch) => {
            let response = await common.apiCall('POST', 'deletePage', Types.DELETE_PAGE_SUCCESS, reqData)
            console.log('Response::::', response)
            dispatch({
                type: Types.DELETE_PAGE_SUCCESS,
                res: response
            });
        }
}
export const editPageDetails = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'editPageDetails', Types.EDIT_PAGE_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.EDIT_PAGE_DETAILS_SUCCESS,
            res: response
        });
    }
}




