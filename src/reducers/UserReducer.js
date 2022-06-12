import * as Types from '../actions/types';

const initialState = {
    
    getUsersDetailsData: {},
    activeDeactiveUserData: {},
    getAllUserByIdData: {},
    loading: false
}



const getAllUsersList = (state, action) => {
    return {
        ...state,
        getUsersDetailsData: action.res,
    }
}
const activeDeactiveUser = (state, action) => {
    return {
        ...state,
        activeDeactiveUserData: action.res,
    }
}
const getAllUserListById = (state, action) => {
    return {
        ...state,
        getAllUserByIdData: action.res,
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_USER_DETAILS_SUCCESS: return getAllUsersList(state, action)
        case Types.ACTIVE_DEACTIVE_USER_SUCCESS: return activeDeactiveUser(state, action)
        case Types.GET_ALL_USER_BY_ID: return getAllUserListById(state, action)
        
        default:
            return state;
    }
}
export default reducer;