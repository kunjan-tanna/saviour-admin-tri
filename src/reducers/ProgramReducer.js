import * as Types from '../actions/types';

const initialState = {
    
    addProgramDetailsData: {},
    getProgramDetailsData: {},
    getAllProgramByIdData: {},
    activeDeactiveProgramData: {},
    editProgramDetailsData: {},
    getProgramFeedback: {},
    loading: false
}


const addProgramDetails = (state, action) => {
    return {
        ...state,
        addProgramDetailsData: action.res,
    }
}
const getAllProgramList = (state, action) => {
    return {
        ...state,
        getProgramDetailsData: action.res,
    }
}
const activeDeactiveProgram = (state, action) => {
    return {
        ...state,
        activeDeactiveProgramData: action.res,
    }
}
const getAllProgramById = (state, action) => {
    return {
        ...state,
        getAllProgramByIdData: action.res,
    }
}
const editProgramDetails = (state, action) => {
    return {
        ...state,
        editProgramDetailsData: action.res,
    }
}
const getProgramFeedback = (state, action) => {
    return {
        ...state,
        getProgramFeedback: action.res,
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.ADD_PROGRAM_DETAILS_SUCCESS: return addProgramDetails(state, action)
        case Types.GET_PROGRAM_DETAILS_SUCCESS: return getAllProgramList(state, action)
        case Types.ACTIVE_DEACTIVE_PROGRAM_SUCCESS: return activeDeactiveProgram(state, action)
        case Types.GET_ALL_PROGRAM_BY_ID: return getAllProgramById(state, action)
        case Types.EDIT_PROGRAM_DETAILS_SUCCESS: return editProgramDetails(state, action)
        case Types.PROGRAM_FEEDBACK: return getProgramFeedback(state, action)
        
        
        
        default:
            return state;
    }
}
export default reducer;