import * as Types from './types';
import * as common from '../api/index';

export const addBulletinDetails = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'addBulletinDetails', Types.ADD_BULLETIN_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.ADD_BULLETIN_DETAILS_SUCCESS,
            res: response
        });
    }
}
export const getAllBulletinList = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getAllBulletinList', Types.GET_BULLETIN_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.GET_BULLETIN_DETAILS_SUCCESS,
            res: response
        });
    }
}

export const activeDeactiveBulletin = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'activeDeactiveBulletin', Types.ACTIVE_DEACTIVE_BULLETIN_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.ACTIVE_DEACTIVE_BULLETIN_SUCCESS,
            res: response
        });
    }
}
export const getAllBulletinListById = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getAllBulletinListById', Types.GET_ALL_BULLETIN_BY_ID, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.GET_ALL_BULLETIN_BY_ID,
            res: response
        });
    }
}
export const deleteBulletin = (reqData) => {
        return async (dispatch) => {
            let response = await common.apiCall('POST', 'deleteBulletin', Types.DELETE_BULLETIN_SUCCESS, reqData)
            console.log('Response::::', response)
            dispatch({
                type: Types.DELETE_BULLETIN_SUCCESS,
                res: response
            });
        }
}
export const editBulletinDetails = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'editBulletinDetails', Types.EDIT_BULLETIN_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.EDIT_BULLETIN_DETAILS_SUCCESS,
            res: response
        });
    }
}




