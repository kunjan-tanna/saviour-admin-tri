import * as Types from '../actions/types';

const initialState = {
    getSettingsDetailsData: {},
    editSettingsDetailsData: {},
    loading: false
}
const getSettingsDetails = (state, action) => {
    return {
        ...state,
        getSettingsDetailsData: action.res,
    }
}
const editSettingsDetails = (state, action) => {
    return {
        ...state,
        editSettingsDetailsData: action.res,
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_SETTINGS_DETAILS: return getSettingsDetails(state, action)
        case Types.EDIT_SETTINGS_DETAILS_SUCCESS: return editSettingsDetails(state, action)
        default: return state;
    }
}
export default reducer;