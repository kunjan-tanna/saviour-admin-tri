import * as Types from '../actions/types';

const initialState = {
    
    getAllUserFeedbackData: {},
    loading: false
}

const getAllUserFeedback = (state, action) => {
    return {
        ...state,
        getAllUserFeedbackData: action.res,
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_SUPPORT_AND_FEEDBACK_LIST_SUCCESS: return getAllUserFeedback(state, action)
        
        default:
            return state;
    }
}
export default reducer;