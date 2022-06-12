import * as Types from "./types";
import * as common from "../api/index";

export const getAllUsersList = (reqData) => {
  return async (dispatch) => {
    let response = await common.apiCall(
      "POST",
      "getAllUsersList",
      Types.GET_USER_DETAILS_SUCCESS,
      reqData
    );
    // console.log('Response::::', response)
    dispatch({
      type: Types.GET_USER_DETAILS_SUCCESS,
      res: response,
    });
  };
};
export const deleteUser = (reqData) => {
  return async (dispatch) => {
    let response = await common.apiCall(
      "POST",
      "deleteUser",
      Types.DELETE_LOAD_SUCCESS,
      reqData
    );
    console.log("Response::::", response);
    dispatch({
      type: Types.DELETE_LOAD_SUCCESS,
      res: response,
    });
  };
};
export const activeDeactiveUser = (reqData) => {
  return async (dispatch) => {
    let response = await common.apiCall(
      "POST",
      "activeDeactiveUser",
      Types.ACTIVE_DEACTIVE_USER_SUCCESS,
      reqData
    );
    console.log("Response::::----kuj", response);
    dispatch({
      type: Types.ACTIVE_DEACTIVE_USER_SUCCESS,
      res: response,
    });
  };
};

export const getAllUserListById = (reqData) => {
  return async (dispatch) => {
    let response = await common.apiCall(
      "POST",
      "getAllUserListById",
      Types.GET_ALL_USER_BY_ID,
      reqData
    );
    console.log("Response::::", response);
    dispatch({
      type: Types.GET_ALL_USER_BY_ID,
      res: response,
    });
  };
};
