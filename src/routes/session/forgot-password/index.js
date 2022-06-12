import React, { Component } from 'react';
import { Form, FormGroup, Input, Alert } from 'reactstrap';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
// app config
import AppConfig from 'Constants/AppConfig';
import { forgetPassword } from '../../../actions/AdminAuthAction';
import * as common from '../../../api/index';
import joi from 'joi-browser';
import Images from '../../../assets/images';


class Forgotpwd extends Component {
   state = {
      formValues: {
         email: '',
      },
      error: '',
      errorField: '',
   }
   componentDidMount() {
   }
   changeValuesHandler = (e) => {
      var formValues = this.state.formValues;
      var name = e.target.name;
      formValues[name] = e.target.value.replace(/^\s+/g, '');
      this.setState({ formValues: formValues });
   }
   enterPressed = (event) => {
      var code = event.keyCode || event.which;
      if (code === 13) { //13 is the enter keycode
         this.forgotPasswordHandler()
      }
   }
   forgotPasswordHandler = async () => {
      this.validateFormData(this.state.formValues);
   }
   validateFormData = (body) => {
  
      let schema = joi.object().keys({
         email: joi.string().trim().regex(AppConfig.EMAIL_REGEX).email().required(),

      })
      joi.validate(body, schema, (error, value) => {
         if (error) {
            if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
               let errorLog = common.validateSchema(error)
               this.setState({ error: errorLog.error, errorField: errorLog.errorField });
            }
         }
         else {
            this.setState({ error: '', errorField: '' }, () => {
               this.ForgotPasswordReq(body);
            });
         }
      })
   }
   ForgotPasswordReq = async (reqData) => {
      await this.props.forgetPassword(reqData);
      if (this.props.forgetPasswordData && this.props.forgetPasswordData.code === 1) {
         common.displayLog(1, this.props.forgetPasswordData.message)
      } else {
         common.displayLog(0, this.props.forgetPasswordData.message)
      }
   }
   render() {
      const { loading } = this.props;
      console.log('Loading prop----', loading)
      return (
         <QueueAnim type="bottom" duration={2000}>
            <div className="rct-session-wrapper" key="1">
               {loading &&
                  <LinearProgress />
               }
               <AppBar position="static" className="session-header">
                  <Toolbar>
                     <div className="container">
                        <div className="d-flex justify-content-between">
                        </div>
                     </div>
                  </Toolbar>
               </AppBar>
               <div className="session-inner-wrapper forgot p-4  p-md-0">
                  <div className="row">
                     <div className="col-sm-8 col-lg-5 mx-auto">
                        <div className="session-body text-center">
                           {/* <div className="session-head mb-30">
                              <h2>{AppConfig.brandName}</h2>
                           </div> */}
                           <div className="container">
                              <div className="loginHeader"> <a href="#" className="logo d-flex align-items-center justify-content-center"> <img className='loginLogo' src={require('Assets/img/Saviour-logo.svg')} alt="logo" title="Saviour" /> </a> </div>
                           </div>
                           <Form>
                              <FormGroup className="has-wrapper">
                                 <Input placeholder='Enter email address' type="text" name="email" id="email" className="has-input input-lg"
                                    value={this.state.formValues.email} name='email' onChange={(e) => this.changeValuesHandler(e)} onKeyPress={(e) => this.enterPressed(e)} />
                                 <span className="has-icon"><i className="ti-email"></i></span>
                              </FormGroup>
                              {
                                 this.state.error !== '' ?
                                    <Alert color="danger">
                                       {this.state.error}
                                    </Alert>
                                    : null
                              }
                              <FormGroup>
                                 <Button
                                    color='primary'
                                    onClick={this.forgotPasswordHandler} variant="contained"
                                    className=" text-white btn-block btn-large w-100">
                                    Submit
                                    </Button>
                              </FormGroup>
                              <Link to={'/login'}>
                                 <h4 className="forgot-password">Login ?</h4>
                              </Link>
                           </Form>
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
   const { forgetPasswordData, loading } = adminAuthReducer;
   return { forgetPasswordData, loading }
}

export default connect(mapStateToProps, {
   forgetPassword,

})(Forgotpwd);
