import * as Types from '../actions/types';

const initialState = {
    
    addBulletinDetailsData: {},
    getBulletinDetailsData: {},
    getAllBulletinByIdData: {},
    activeDeactiveBulletinData: {},
    editBulletinDetailsData: {},
    loading: false
}


const addBulletinDetails = (state, action) => {
    return {
        ...state,
        addBulletinDetailsData: action.res,
    }
}
const getAllBulletinList = (state, action) => {
    return {
        ...state,
        getBulletinDetailsData: action.res,
    }
}
const activeDeactiveBulletin = (state, action) => {
    return {
        ...state,
        activeDeactiveBulletinData: action.res,
    }
}
const getAllBulletinById = (state, action) => {
    return {
        ...state,
        getAllBulletinByIdData: action.res,
    }
}
const editBulletinDetails = (state, action) => {
    return {
        ...state,
        editBulletinDetailsData: action.res,
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.ADD_BULLETIN_DETAILS_SUCCESS: return addBulletinDetails(state, action)
        case Types.GET_BULLETIN_DETAILS_SUCCESS: return getAllBulletinList(state, action)
        case Types.ACTIVE_DEACTIVE_BULLETIN_SUCCESS: return activeDeactiveBulletin(state, action)
        case Types.GET_ALL_BULLETIN_BY_ID: return getAllBulletinById(state, action)
        case Types.EDIT_BULLETIN_DETAILS_SUCCESS: return editBulletinDetails(state, action)
        
        
        
        default:
            return state;
    }
}
export default reducer;