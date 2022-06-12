import Joi from "joi-browser";
import config from "../util/config";
import history from "../history";
import * as crypto from "crypto-js";
import axios from "axios";
import alertify from "alertifyjs";
import * as Types from "../actions/types";
import store from "../util/store";
import AppConfig from "../constants/AppConfig";

const CancelToken = axios.CancelToken;
var cancel;
export const buildSchema = (attributes) => {
  const joiKeys = {};
  for (const key in attributes) {
    let myJoi = Joi;
    if (
      attributes[key].type === "String" ||
      ((attributes[key].type === "Reference" ||
        attributes[key].type === "Select") &&
        attributes[key].multiple === false)
    ) {
      myJoi = myJoi.string().strict().trim();
    }
    if (
      (attributes[key].type === "Reference" ||
        attributes[key].type === "Select") &&
      attributes[key].multiple === true
    ) {
      myJoi = myJoi.array().items();
    }
    if (attributes[key].type === "Number") {
      myJoi = myJoi.number();
    }
    if (attributes[key].type === "Integer") {
      myJoi = myJoi.number().integer();
    }
    if (attributes[key].type === "Email") {
      myJoi = myJoi.string().strict().trim().email({ minDomainSegments: 2 });
    }
    if (attributes[key].type === "Boolean") {
      myJoi = myJoi.boolean().strict();
    }
    if (attributes[key].pattern) {
      myJoi = myJoi.pattern(attributes[key].pattern);
    }
    if (
      attributes[key].min &&
      (attributes[key].type === "String" ||
        attributes[key].type === "Number" ||
        attributes[key].type === "Integer" ||
        ((attributes[key].type === "Reference" ||
          attributes[key].type === "Select") &&
          attributes[key].multiple === false))
    ) {
      myJoi = myJoi.min(attributes[key].min);
    }
    if (
      attributes[key].max &&
      (attributes[key].type === "String" ||
        attributes[key].type === "Number" ||
        attributes[key].type === "Integer" ||
        ((attributes[key].type === "Reference" ||
          attributes[key].type === "Select") &&
          attributes[key].multiple === false))
    ) {
      myJoi = myJoi.max(attributes[key].max);
    }
    if (
      attributes[key].required === true &&
      (attributes[key].type === "Reference" ||
        attributes[key].type === "Select")
    ) {
      myJoi = myJoi.min(1);
    }
    if (attributes[key].required === true) {
      myJoi = myJoi.required();
    }
    joiKeys[key] = myJoi;
  }
  return Joi.object().keys(joiKeys);
};

export const validateSchema = (error) => {
  console.log("error", error.details);
  let msg;
  let key = error.details[0].context.label || error.details[0].context.key;
  console.log("erroro==============", key);
  if (key == "images") {
    msg = "Please upload image!";
  } else if (key == "Phone No") {
    if (error.details[0].type.includes("string.min")) {
      msg =
        key.replace(/_/g, " ") +
        " length must be at least " +
        error.details[0].context.limit +
        " digits long!";
      msg = msg.charAt(0).toUpperCase() + msg.slice(1);
    }
    if (error.details[0].type.includes("string.max")) {
      msg =
        key.replace(/_/g, " ") +
        " length must be less than or equal to " +
        error.details[0].context.limit +
        " digits long!";
      msg = msg.charAt(0).toUpperCase() + msg.slice(1);
    }
  } else if (error.details[0].type.includes("empty")) {
    msg = key.replace(/_/g, " ") + " is required!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("string.min")) {
    msg =
      key.replace(/_/g, " ") +
      " length must be at least " +
      error.details[0].context.limit +
      " characters long!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("string.max")) {
    msg =
      key.replace(/_/g, " ") +
      " length must be less than or equal to " +
      error.details[0].context.limit +
      " characters long!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("number.min")) {
    msg =
      key.replace(/_/g, " ") +
      " should be greater than or equal to " +
      error.details[0].context.limit;
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("number.max")) {
    msg =
      key.replace(/_/g, " ") +
      " should be less than or equal to " +
      error.details[0].context.limit;
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("allowOnly")) {
    msg = "Password and confirm password must be same!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("number.base")) {
    msg = key.replace(/_/g, " ") + " is required!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("string.base")) {
    msg = key.replace(/_/g, " ") + " is required!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  }
  // else if(key == 'appointement_video_m3u8'){
  //     msg = 'Please enter a appointement video!';
  // }
  else {
    msg = "Please enter a valid " + key.replace(/_/g, " ") + "!";
  }

  if (msg == "Please enter a valid trailer video!")
    msg = "Please enter a valid trailer video or GIF!";
  let result = { error: msg, errorField: error.details[0].context.key };
  return result;
};

export const setDeep = (obj, path, value, setrecursively = false) => {
  let level = 0;
  path.reduce((a, b) => {
    level++;
    if (
      setrecursively &&
      typeof a[b] === "undefined" &&
      level !== path.length
    ) {
      a[b] = {};
      return a[b];
    }
    if (level === path.length) {
      a[b] = value;
      return value;
    } else {
      return a[b];
    }
  }, obj);
  return obj;
};

export const encrypt = (message) => {
  // encrypt message
  let cipherText = crypto.AES.encrypt(message, config.KEY).toString();
  return cipherText;
};

export const decrypt = (cipherText) => {
  // decrypt cipherText
  let message = crypto.AES.decrypt(cipherText, config.KEY).toString(
    crypto.enc.Utf8
  );
  return message;
};

export const refreshToken = async (
  method,
  url,
  actionType,
  reqData,
  params,
  headers
) => {
  return new Promise((resolve, reject) => {
    apiCall("POST", "refreshToken", Types.REFRESH_TOKEN_SUCCESS)
      .then(async (res) => {
        console.log("tokennn", res);
        await localStorage.setItem("auth_token", res.data.new_token);
        apiCall(method, url, actionType, reqData, params, headers)
          .then((response) => {
            console.log("refresh_tokennn", response);
            resolve(response);
          })
          .catch((error) => {
            console.log("API Call error after refresh token-------", error);
          });
      })
      .catch((e) => {
        console.log("Error in refresh token", e);
      });
  });
};

export const apiCall = (method, url, actionType, reqData, params, headers) => {
  console.log("method", method);
  console.log("url", url);
  console.log("actionType", actionType);

  let user_type = localStorage.getItem("user_type");
  //let store = configureStore();
  return new Promise((resolve, reject) => {
    store.dispatch({
      type: "START_LOADER",
    });
    let reqHeaders;
    if (headers) {
      reqHeaders = headers;
    } else {
      reqHeaders = {
        language: AppConfig.LANGUAGE,
        auth_token: !localStorage.getItem("auth")
          ? config.AUTHORIZATION
          : localStorage.getItem("auth_token"),
      };
    }

    axios({
      method: method,
      url: config.API_BASE_URL + url,
      data: reqData,
      headers: reqHeaders,
      params: params,
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      }),
    })
      .then(async (response) => {
        store.dispatch({
          type: "STOP_LOADER",
        });

        let data = response.data;
        if (data.code === 0) {
          displayLog(data.code, data.message);
        } else {
          store.dispatch({
            type: actionType,
            res: response.data,
          });
          resolve(data);
        }
      })
      .catch(async (error) => {
        if (axios.isCancel(error)) {
          store.dispatch({
            type: Types.STOP_LOADER,
          });
          console.log("im canceled", error);
        } else {
          if (error.response && error.response.status == 401) {
            await refreshToken(
              method,
              url,
              actionType,
              reqData,
              params,
              headers
            )
              .then((response) => {
                store.dispatch({
                  type: actionType,
                  res: response.data,
                });
                resolve(response);
              })
              .catch((error) => {
                console.log(
                  "error while calling refresh token---------",
                  error
                );
              });
          } else {
            console.log("=================error", error);
            history.push(user_type == "1" ? "/login" : "/login");
            localStorage.clear();
            displayLog(0, "Network error!");
            cancel();
            store.dispatch({
              type: Types.STOP_LOADER,
            });
          }
        }
      });
  });
};

export const displayLog = (code, message) => {
  alertify.dismissAll();
  alertify.alert(code === 1 ? "Success" : "Error", message);
  setTimeout(() => {
    alertify.alert(code === 1 ? "Success" : "Error", message).close();
  }, 1000);
};

export const capitalizeFirstLetter = (text) => {
  text = text.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const lowerCaseWithHypen = (text) => {
  return text.toLowerCase().replace(/ /g, "_");
};

export const confirmBox = (title, message) => {
  return new Promise((resolve, reject) => {
    alertify.confirm(
      title,
      message,
      () => {
        resolve(1);
      },
      () => {
        resolve(0);
      }
    );
  });
};

export const numberOnly = (event) => {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
};

export const generatePassword = () => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  console.log("result================", result);
  return result;
};

export const apiCallWithoutLoader = (method, url, reqData, headers) => {
  console.log("METHOD:", method);
  console.log("URL:", url);

  let user_type = localStorage.getItem("user_type");
  //let store = configureStore();
  return new Promise((resolve, reject) => {
    let reqHeaders;
    if (headers) {
      reqHeaders = headers;
    } else {
      reqHeaders = {
        language: AppConfig.LANGUAGE,
        auth_token: !localStorage.getItem("auth")
          ? config.AUTHORIZATION
          : localStorage.getItem("auth_token"),
      };
    }

    axios({
      method: method,
      url: config.API_BASE_URL + url,
      data: reqData,
      headers: reqHeaders,
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      }),
    })
      .then(async (response) => {
        let data = response.data;
        if (data.code === 0) {
          displayLog(data.code, data.message);
        } else {
          resolve(data);
        }
      })
      .catch(async (error) => {
        console.log("=================error", error);
        history.push(user_type == "1" ? "/login" : "/login");
        localStorage.clear();
        displayLog(0, "Network error!");
        cancel();
        store.dispatch({
          type: Types.STOP_LOADER,
        });
      });
  });
};
