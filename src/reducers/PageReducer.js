import * as Types from '../actions/types';

const initialState = {
    
    addPageDetailsData: {},
    getPageDetailsData: {},
    getAllPageByIdData: {},
    activeDeactivePageData: {},
    editPageDetailsData: {},
    loading: false
}


const addPageDetails = (state, action) => {
    return {
        ...state,
        addPageDetailsData: action.res,
    }
}
const getAllPageList = (state, action) => {
    return {
        ...state,
        getPageDetailsData: action.res,
    }
}
const activeDeactivePage = (state, action) => {
    return {
        ...state,
        activeDeactivePageData: action.res,
    }
}
const getAllPageById = (state, action) => {
    return {
        ...state,
        getAllPageByIdData: action.res,
    }
}
const editPageDetails = (state, action) => {
    return {
        ...state,
        editPageDetailsData: action.res,
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.ADD_PAGE_DETAILS_SUCCESS: return addPageDetails(state, action)
        case Types.GET_PAGE_DETAILS_SUCCESS: return getAllPageList(state, action)
        case Types.ACTIVE_DEACTIVE_PAGE_SUCCESS: return activeDeactivePage(state, action)
        case Types.GET_ALL_PAGE_BY_ID: return getAllPageById(state, action)
        case Types.EDIT_PAGE_DETAILS_SUCCESS: return editPageDetails(state, action)
        
        
        
        default:
            return state;
    }
}
export default reducer;