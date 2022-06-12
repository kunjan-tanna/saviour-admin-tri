/**
 * Login Page
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Link } from "react-router-dom";
import { Form, FormGroup, Input } from "reactstrap";
import LinearProgress from "@material-ui/core/LinearProgress";
import QueueAnim from "rc-queue-anim";
import joi from "joi-browser";
import * as common from "../../../api/index";
// app config
import AppConfig from "Constants/AppConfig";
import { signInUser } from "../../../actions/AdminAuthAction";
// import { askForPermissionToReceiveNotifications } from '../../../firebase'
import Images from "../../../assets/images";

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        email: "",
        password: "",
      },
      error: "",
      errorField: "",
    };
  }
  componentDidMount() {}
  changeValuesHandler = (e) => {
    var formValues = this.state.formValues;
    var name = e.target.name;
    formValues[name] = e.target.value.replace(/\s/g, "");

    this.setState({ formValues: formValues });
  };
  enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      this.loginHandler();
    }
  };
  loginHandler = async () => {
    console.log("this.state.formValues", this.state.formValues);
    let formValues = this.state.formValues;
    this.setState({ formValues: formValues });
    this.validateFormData(this.state.formValues);
  };
  validateFormData = (body) => {
    let schema = joi.object().keys({
      email: joi
        .string()
        .trim()
        .regex(AppConfig.EMAIL_REGEX)
        .email()
        .required(),
      password: joi.string().trim().required(),
    });
    //  console.log("Body:::::", body);
    joi.validate(body, schema, (error, value) => {
      if (error) {
        if (
          error.details[0].message !== this.state.error ||
          error.details[0].context.key !== this.state.errorField
        ) {
          let errorLog = common.validateSchema(error);
          console.log("errror log");
          this.setState(
            { error: errorLog.error, errorField: errorLog.errorField },
            () => {
              console.log("errror", this.state.error);
              common.displayLog(0, this.state.error);
            }
          );
        }
      } else {
        this.setState({ error: "", errorField: "" }, () => {
          console.log("errror blank");
          this.adminLoginReq(body);
        });
      }
    });
  };
  adminLoginReq = async (reqData) => {
    await this.props.signInUser(reqData);
    if (this.props.signInData && this.props.signInData.code === 1) {
      console.log("this.props.signInData", this.props.signInData);
      await localStorage.clear();
      await localStorage.setItem("auth", true);
      await localStorage.setItem(
        "auth_token",
        this.props.signInData.data.auth_token
      );
      await localStorage.setItem(
        "admin_id",
        this.props.signInData.data.admin_data.admin_id
      );
      await localStorage.setItem(
        "admin_email",
        this.props.signInData.data.admin_data.email
      );
      common.displayLog(1, this.props.signInData.message);
      await this.props.history.push("/app/dashboard");
    }
  };
  render() {
    // const { email, password } = this.state;
    const { loading } = this.props;
    return (
      <QueueAnim type="bottom" duration={2000}>
        <div className="rct-session-wrapper">
          {loading && <LinearProgress />}
          <AppBar position="static" className="session-header">
            <Toolbar>
              <div className="container"></div>
            </Toolbar>
          </AppBar>
          <div className="login-wrapper">
            <div className="session-inner-wrapper">
              <div className="container">
                <div className="d-flex justify-content-center">
                  <div className="col-sm-5 col-md-5 col-lg-6">
                    <div className="session-body text-center">
                      <div className="container">
                        <div className="loginHeader">
                          {" "}
                          <a
                            href="#"
                            className="logo d-flex align-items-center justify-content-center"
                          >
                            {" "}
                            <img
                              className="loginLogo"
                              src={require("Assets/img/Saviour-logo.svg")}
                              alt="logo"
                              title="Saviour"
                            />{" "}
                          </a>{" "}
                        </div>
                      </div>

                      {/* <div className="session-head mb-30">
                                    <h2 className="font-weight-bold">{AppConfig.brandName}</h2>
                                 </div> */}
                      <Form>
                        <FormGroup className="has-wrapper">
                          <Input
                            type="mail"
                            value={this.state.formValues.email}
                            name="email"
                            id="email"
                            className="has-input input-lg"
                            placeholder="Enter Email Address"
                            onChange={(e) => this.changeValuesHandler(e)}
                            onKeyPress={(e) => this.enterPressed(e)}
                          />
                          <span className="has-icon">
                            <i className="ti-email"></i>
                          </span>
                        </FormGroup>
                        <FormGroup className="has-wrapper">
                          <Input
                            value={this.state.formValues.password}
                            type="Password"
                            name="password"
                            id="password"
                            className="has-input input-lg"
                            placeholder="Password"
                            onChange={(e) => this.changeValuesHandler(e)}
                            onKeyPress={(e) => this.enterPressed(e)}
                          />
                          <span className="has-icon">
                            <i className="ti-lock"></i>
                          </span>
                        </FormGroup>
                        <FormGroup className="mb-15">
                          <Button
                            color="primary"
                            className="btn-block text-white w-100"
                            variant="contained"
                            size="large"
                            onClick={this.loginHandler}
                          >
                            Sign In
                          </Button>
                        </FormGroup>
                        <Link to={"/forgot-password"}>
                          {/* to={reset-password/uSw0eX} guid */}
                          <h4 className="forgot-password">Forgot Password ?</h4>
                        </Link>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </QueueAnim>
    );
  }
}

// map state to props
const mapStateToProps = ({ adminAuthReducer }) => {
  const { signInData, loading } = adminAuthReducer;
  return { signInData, loading };
};

export default connect(mapStateToProps, {
  signInUser,
})(Signin);
