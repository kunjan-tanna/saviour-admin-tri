import * as Types from '../actions/types';

const initialState = {
    getProgramStageListData: {},
    deleteProgramStageData: {},
    getProgramStageData: {},
    addProgramCommitmentStageData: {},
    editProgramCommitmentStageData: {},
    addStageCategoryData: {},
    editStageCategoryData: {},
    deleteStageCategoryData: {},
    addCommitmentStageDetailData: {},
    editCommitmentStageDetailData: {},
    deleteSubCategoryData: {},
    addSupportingMaterialData: {},
    getSupportingMaterialData: {},
    editSupportingMaterialData: {},
    deleteSupportingMaterialData: {}
}

const getProgramStageList = (state, action) => {
    return {
        ...state,
        getProgramStageListData: action.res,
    }
}

const deleteProgramStage = (state, action) => {
    return {
        ...state,
        deleteProgramStageData: action.res,
    }
}

const getProgramStage = (state, action) => {
    return {
        ...state,
        getProgramStageData: action.res,
    }
}

const addProgramCommitmentStage = (state, action) => {
    return {
        ...state,
        addProgramCommitmentStageData: action.res,
    }
}

const editProgramCommitmentStage = (state, action) => {
    return {
        ...state,
        editProgramCommitmentStageData: action.res,
    }
}

const addStageCategory = (state, action) => {
    return {
        ...state,
        addStageCategoryData: action.res,
    }
}

const editStageCategory = (state, action) => {
    return {
        ...state,
        editStageCategoryData: action.res,
    }
}

const deleteStageCategory = (state, action) => {
    return {
        ...state,
        deleteStageCategoryData: action.res,
    }
}

const addStageSubCategory = (state, action) => {
    return {
        ...state,
        addCommitmentStageDetailData: action.res,
    }
}

const editStageSubCategory = (state, action) => {
    return {
        ...state,
        editCommitmentStageDetailData: action.res,
    }
}

const deleteSubCategory = (state, action) => {
    return {
        ...state,
        deleteSubCategoryData: action.res,
    }
}

const addSupportingMaterial = (state, action) => {
    return {
        ...state,
        addSupportingMaterialData: action.res,
    }
}

const getSupportingMaterial = (state, action) => {
    return {
        ...state,
        getSupportingMaterialData: action.res,
    }
}

const editSupportingMaterial = (state, action) => {
    return {
        ...state,
        editSupportingMaterialData: action.res,
    }
}

const deleteSupportingMaterial = (state, action) => {
    return {
        ...state,
        deleteSupportingMaterialData: action.res,
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_PROGRAM_STAGE_LIST_SUCCESS: return getProgramStageList(state, action)
        case Types.DELETE_PROGRAM_STAGE_SUCCESS: return deleteProgramStage(state, action)
        case Types.GET_PROGRAM_STAGE_SUCCESS: return getProgramStage(state, action)
        case Types.ADD_COMMITMENT_STAGE_SUCCESS: return addProgramCommitmentStage(state, action)
        case Types.EDIT_COMMITMENT_STAGE_SUCCESS: return editProgramCommitmentStage(state, action)
        case Types.ADD_STAGE_CATEGORY_SUCCESS: return addStageCategory(state, action)
        case Types.EDIT_STAGE_CATEGORY_SUCCESS: return editStageCategory(state, action)
        case Types.DELETE_STAGE_CATEGORY_SUCCESS: return deleteStageCategory(state, action)
        case Types.ADD_STAGE_SUB_CATEGORY_SUCCESS: return addStageSubCategory(state, action)
        case Types.EDIT_STAGE_SUB_CATEGORY_SUCCESS: return editStageSubCategory(state, action)
        case Types.DELETE_STAGE_SUB_CATEGORY_SUCCESS: return deleteSubCategory(state, action)
        case Types.ADD_SUPPORTING_MATERIAL_SUCCESS: return addSupportingMaterial(state, action)
        case Types.GET_SUPPORTING_MATERIAL_SUCCESS: return getSupportingMaterial(state, action)
        case Types.EDIT_SUPPORTING_MATERIAL_SUCCESS: return editSupportingMaterial(state, action)
        case Types.DELETE_SUPPORTING_MATERIAL_SUCCESS: return deleteSupportingMaterial(state, action)
        default: return state;
    }
}
export default reducer;