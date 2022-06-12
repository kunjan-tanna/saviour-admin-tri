import * as Types from './types';
import * as common from '../api/index';

export const getProgramStageList = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getProgramStageList', Types.GET_PROGRAM_STAGE_LIST_SUCCESS, reqData)
        dispatch({
            type: Types.GET_PROGRAM_STAGE_LIST_SUCCESS,
            res: response
        });
    }
}

export const deleteProgramCommitmentStage = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'deleteProgramCommitmentStage', Types.DELETE_PROGRAM_STAGE_SUCCESS, reqData)
        dispatch({
            type: Types.DELETE_PROGRAM_STAGE_SUCCESS,
            res: response
        });
    }
}

export const getProgramCommitmentStage = (reqData) => {
    return async (dispatch) => {

        console.log("REQ DATA:", reqData)
        let response = await common.apiCall('POST', 'getProgramCommitmentStage', Types.GET_PROGRAM_STAGE_SUCCESS, reqData)
        dispatch({
            type: Types.GET_PROGRAM_STAGE_SUCCESS,
            res: response
        });
    }
}

export const addProgramCommitmentStage = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'addProgramCommitmentStage', Types.ADD_COMMITMENT_STAGE_SUCCESS, reqData)
        dispatch({
            type: Types.ADD_COMMITMENT_STAGE_SUCCESS,
            res: response
        });
    }
}

export const editProgramCommitmentStage = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'editProgramCommitmentStage', Types.EDIT_COMMITMENT_STAGE_SUCCESS, reqData)
        dispatch({
            type: Types.EDIT_COMMITMENT_STAGE_SUCCESS,
            res: response
        });
    }
}

export const addStageCategory = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'addStageCategory', Types.ADD_STAGE_CATEGORY_SUCCESS, reqData)
        dispatch({
            type: Types.ADD_STAGE_CATEGORY_SUCCESS,
            res: response
        });
    }
}

export const editStageCategory = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'editStageCategory', Types.EDIT_STAGE_CATEGORY_SUCCESS, reqData)
        dispatch({
            type: Types.EDIT_STAGE_CATEGORY_SUCCESS,
            res: response
        });
    }
}

export const deleteStageCategory = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'deleteStageCategory', Types.DELETE_STAGE_CATEGORY_SUCCESS, reqData)
        dispatch({
            type: Types.DELETE_STAGE_CATEGORY_SUCCESS,
            res: response
        });
    }
}

export const addCommitmentStageDetail = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'addCommitmentStageDetail', Types.ADD_STAGE_SUB_CATEGORY_SUCCESS, reqData)
        dispatch({
            type: Types.ADD_STAGE_SUB_CATEGORY_SUCCESS,
            res: response
        });
    }
}

export const editCommitmentStageDetail = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'editCommitmentStageDetail', Types.EDIT_STAGE_SUB_CATEGORY_SUCCESS, reqData)
        dispatch({
            type: Types.EDIT_STAGE_SUB_CATEGORY_SUCCESS,
            res: response
        });
    }
}

export const deleteSubCategory = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'deleteSubCategory', Types.DELETE_STAGE_SUB_CATEGORY_SUCCESS, reqData)
        dispatch({
            type: Types.DELETE_STAGE_SUB_CATEGORY_SUCCESS,
            res: response
        });
    }
}

export const addSupportingMaterial = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'addSupportingMaterial', Types.ADD_SUPPORTING_MATERIAL_SUCCESS, reqData)
        dispatch({
            type: Types.ADD_SUPPORTING_MATERIAL_SUCCESS,
            res: response
        });
    }
}

export const getSupportingMaterial = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getSupportingMaterial', Types.GET_SUPPORTING_MATERIAL_SUCCESS, reqData)
        dispatch({
            type: Types.GET_SUPPORTING_MATERIAL_SUCCESS,
            res: response
        });
    }
}

export const editSupportingMaterial = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'editSupportingMaterial', Types.EDIT_SUPPORTING_MATERIAL_SUCCESS, reqData)
        dispatch({
            type: Types.EDIT_SUPPORTING_MATERIAL_SUCCESS,
            res: response
        });
    }
}

export const deleteSupportingMaterial = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'deleteSupportingMaterial', Types.DELETE_SUPPORTING_MATERIAL_SUCCESS, reqData)
        dispatch({
            type: Types.DELETE_SUPPORTING_MATERIAL_SUCCESS,
            res: response
        });
    }
}