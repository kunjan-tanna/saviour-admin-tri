import * as Types from './types';
import * as common from '../api/index';

export const addBlogPostDetails = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'addBlogPostDetails', Types.ADD_BLOG_POST_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.ADD_BLOG_POST_DETAILS_SUCCESS,
            res: response
        });
    }
}
export const getAllBlogPostList = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getAllBlogPostList', Types.GET_BLOG_POST_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.GET_BLOG_POST_DETAILS_SUCCESS,
            res: response
        });
    }
}

export const activeDeactiveBlogPost = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'activeDeactiveBlogPost', Types.ACTIVE_DEACTIVE_BLOG_POST_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.ACTIVE_DEACTIVE_BLOG_POST_SUCCESS,
            res: response
        });
    }
}
export const getAllBlogPostListById = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'getAllBlogPostListById', Types.GET_ALL_BLOG_POST_BY_ID, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.GET_ALL_BLOG_POST_BY_ID,
            res: response
        });
    }
}
export const deleteBlogPost = (reqData) => {
        return async (dispatch) => {
            let response = await common.apiCall('POST', 'deleteBlogPost', Types.DELETE_BLOG_POST_SUCCESS, reqData)
            console.log('Response::::', response)
            dispatch({
                type: Types.DELETE_BLOG_POST_SUCCESS,
                res: response
            });
        }
}
export const editBlogPostDetails = (reqData) => {
    return async (dispatch) => {
        let response = await common.apiCall('POST', 'editBlogPostDetails', Types.EDIT_BLOG_POST_DETAILS_SUCCESS, reqData)
        console.log('Response::::', response)
        dispatch({
            type: Types.EDIT_BLOG_POST_DETAILS_SUCCESS,
            res: response
        });
    }
}




