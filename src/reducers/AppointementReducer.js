import * as Types from '../actions/types';

const initialState = {
    
    addAppointementDetailsData: {},
    getAppointementDetailsData: {},
    getAllAppointementByIdData: {},
    activeDeactiveAppointementData: {},
    editAppointementDetailsData: {},
    loading: false
}


const addAppointementDetails = (state, action) => {
    return {
        ...state,
        addAppointementDetailsData: action.res,
    }
}
const getAllAppointementLists = (state, action) => {
    return {
        ...state,
        getAppointementDetailsData: action.res,
    }
}
const activeDeactiveAppointement = (state, action) => {
    return {
        ...state,
        activeDeactiveAppointementData: action.res,
    }
}
const getAllAppointementById = (state, action) => {
    return {
        ...state,
        getAllAppointementByIdData: action.res,
    }
}
const editAppointementDetails = (state, action) => {
    return {
        ...state,
        editAppointementDetailsData: action.res,
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.ADD_APPOINTEMENT_DETAILS_SUCCESS: return addAppointementDetails(state, action)
        case Types.GET_APPOINTEMENT_DETAILS_SUCCESS: return getAllAppointementLists(state, action)
        case Types.ACTIVE_DEACTIVE_APPOINTEMENT_SUCCESS: return activeDeactiveAppointement(state, action)
        case Types.GET_ALL_APPOINTEMENT_BY_ID: return getAllAppointementById(state, action)
        case Types.EDIT_APPOINTEMENT_DETAILS_SUCCESS: return editAppointementDetails(state, action)
        
        
        
        default:
            return state;
    }
}
export default reducer;