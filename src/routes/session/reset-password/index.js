import React, { Component } from 'react';
import { Form, FormGroup, Input, Alert, CardBody, Card, CardTitle } from 'reactstrap';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'react-redux';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';

// app config
import AppConfig from 'Constants/AppConfig';
import { checkLink, resetPassword } from '../../../actions/AdminAuthAction';
import Images from '../../../assets/images';


class ResetPwd extends Component {
    state = {
        email: "",
        error: '',
        password: '',
        checkLinkData: {},
        loading: false, // loading activity
    }
    componentDidMount = async () => {
        console.log(this.props.match.params.guid);
        let reqData = {
            guid: this.props.match.params.guid,
        }
        await this.props.checkLink(reqData, this.props.history)
        console.log(this.props.checkLinkData);
        this.setState({ checkLinkData: this.props.checkLinkData })

    }
    resetPwdReq = async () => {
        console.log(this.state.password);
        if (this.state.password == '') {
            this.setState({ error: 'Please enter password' })
        }
        else {
            let reqData = {
                password: this.state.password,
                guid: this.props.match.params.guid
            }
            await this.props.resetPassword(reqData);
            this.props.history.push('/login');
            this.setState({ error: '' })
        }
    }
    render() {
        const { loading } = this.props;
        return (
            // <QueueAnim type="bottom" duration={2000}>
            <div className="rct-session-wrapper" key="1">
                <AppBar position="static" className="session-header">
                    <Toolbar>
                        <div className="container">
                            <div className="d-flex justify-content-between">
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
                <div className="session-inner-wrapper forgot p-4  p-md-0">
                    {this.state.checkLinkData.code == 203 &&
                        <div className="row">
                            <div className="col-sm-8 col-lg-5 mx-auto">
                                <div className="session-body text-center"><Card color="danger">
                                    <CardBody>
                                        <CardTitle className="cardTitle">{this.props.checkLinkData.message}</CardTitle>
                                        <Button component={Link} to="/signin" className="btn-primary btn-block btn-large text-white h-50 w-50">back to Login</Button>
                                    </CardBody>
                                </Card></div></div></div>}
                    {this.state.checkLinkData.code == 1 &&
                        <div className="row">
                            <div className="col-sm-8 col-lg-5 mx-auto">
                                <div className="session-body text-center">
                                    <Form>
                                        <FormGroup className="has-wrapper">
                                            <Input
                                                value={this.state.password}
                                                type="Password"
                                                name="user-pwd"
                                                id="pwd"
                                                className="has-input input-lg"
                                                placeholder="Password"
                                                onChange={(event) => this.setState({ password: event.target.value })}
                                            />
                                            <span className="has-icon"><i className="ti-lock"></i></span>
                                        </FormGroup>
                                        {
                                            this.state.error !== '' ?
                                                <Alert color="danger">
                                                    {this.state.error}
                                                </Alert>
                                                : null
                                        }
                                        <FormGroup>
                                            <Button onClick={this.resetPwdReq} variant="contained" className="btn-info text-white btn-block btn-large w-100">
                                                Reset Password
                                    </Button>
                                        </FormGroup>
                                        <Button component={Link} to={"/login"} className="btn-dark btn-block btn-large text-white w-100">Already having account?  Login</Button>
                                    </Form>
                                </div>
                            </div>

                        </div>
                    }
                </div>
                {loading &&
                    <RctSectionLoader />
                }
            </div>
            // </QueueAnim>
        );
    }
}
// map state to props
const mapStateToProps = ({ adminAuthReducer }) => {
    const { resetPasswordData, checkLinkData, loading } = adminAuthReducer;
    return { resetPasswordData, checkLinkData, loading }
}

export default connect(mapStateToProps, {
    checkLink,
    resetPassword
})(ResetPwd);
