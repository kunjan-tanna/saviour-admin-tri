import * as Types from '../actions/types';

const initialState = {
    
    addBlogPostDetailsData: {},
    getBlogPostDetailsData: {},
    getAllBlogPostByIdData: {},
    activeDeactiveBlogPostData: {},
    editBlogPostDetailsData: {},
    loading: false
}


const addBlogPostDetails = (state, action) => {
    return {
        ...state,
        addBlogPostDetailsData: action.res,
    }
}
const getAllBlogPostList = (state, action) => {
    return {
        ...state,
        getBlogPostDetailsData: action.res,
    }
}
const activeDeactiveBlogPost = (state, action) => {
    return {
        ...state,
        activeDeactiveBlogPostData: action.res,
    }
}
const getAllBlogPostById = (state, action) => {
    return {
        ...state,
        getAllBlogPostByIdData: action.res,
    }
}
const editBlogPostDetails = (state, action) => {
    return {
        ...state,
        editBlogPostDetailsData: action.res,
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.ADD_BLOG_POST_DETAILS_SUCCESS: return addBlogPostDetails(state, action)
        case Types.GET_BLOG_POST_DETAILS_SUCCESS: return getAllBlogPostList(state, action)
        case Types.ACTIVE_DEACTIVE_BLOG_POST_SUCCESS: return activeDeactiveBlogPost(state, action)
        case Types.GET_ALL_BLOG_POST_BY_ID: return getAllBlogPostById(state, action)
        case Types.EDIT_BLOG_POST_DETAILS_SUCCESS: return editBlogPostDetails(state, action)
        
        
        
        default:
            return state;
    }
}
export default reducer;