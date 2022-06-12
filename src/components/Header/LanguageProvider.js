/**
 * Language Select Dropdown
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
	Card,
	CardBody,
	Col,
	Row,
	Table,
	FormGroup,
	Input,
	Label, Alert, DropdownToggle, DropdownMenu, Dropdown, DropdownItem
} from 'reactstrap';
import Button from '@material-ui/core/Button';
import { validateSchema, displayLog } from '../../api/index';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog/DeleteConfirmationDialog';
import Joi from 'joi-browser';
import * as common from '../../api/index'
// actions

import IntlMessages from 'Util/IntlMessages';
import { changePassword } from '../../actions/AdminAuthAction';
import AppConfig from '../../constants/AppConfig'
import { join } from 'bluebird';

class LanguageProvider extends Component {
	state = {
		langDropdownOpen: false,
		show: false,
		formValues: {
			current_password: '',
			new_password: '',
			confirm_password: ''
		},
		error: '',
		errorField: ''
	}

	// function to toggle dropdown menu
	toggle = () => {
		this.setState({
			langDropdownOpen: !this.state.langDropdownOpen
		});
	}
	onChangeHandler = (e) => {

		var formValues = this.state.formValues;
		var name = e.target.name;

		formValues[name] = e.target.value;
		this.setState({ formValues: formValues }, () => {
			// console.log(this.state.formValues);

		});

	}

	onPressChangePwd = () => {
		let obj = {
			current_password: this.state.formValues.current_password,
			new_password: this.state.formValues.new_password,
			confirm_password: this.state.formValues.confirm_password,

		}
		this.validateFormData(obj);

	}

	validateFormData = async (body) => {
		console.log("bosy==============", body)
		let schema = Joi.object().keys({
			current_password: Joi.string().trim().required(),
			new_password: Joi.string().trim().required().min(6),
			confirm_password: Joi.string()
				.valid(this.state.formValues.new_password)
				.required()
				.label('Confirm Password')
				.error(
					errors => 'New Password and Confirm Password must be same!'
				),
		})
		Joi.validate(body, schema, (error, value) => {
			if (error) {
				if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
					let errorLog = validateSchema(error)
					this.setState({ error: errorLog.error, errorField: errorLog.errorField });
				}
			}
			else {
				this.setState({ error: '', errorField: '' }, () => {
					this.changePwd()
				});
			}
		})
	}
	changePwd = async () => {
		let reqData = {
			current_password: this.state.formValues.current_password.trim(),
			new_password: this.state.formValues.new_password.trim(),
			confirm_password: this.state.formValues.confirm_password.trim(),
		}
		console.log("rteq data", reqData)
		await this.props.changePassword(reqData);
		if (this.props.changePasswordData && this.props.changePasswordData.code === 1) {
			console.log("this.props.changePasswordData", this.props.changePasswordData)
			await localStorage.clear();
			common.displayLog(1, this.props.changePasswordData.message)
			await this.props.history.push('/login') 
		}
		this.showModal()
	}
	enterPressed = (event) => {
		var code = event.keyCode || event.which;
		if (code === 13) { //13 is the enter keycode
			this.onPressChangePwd()
		}
	};
	logoutPopup = () => {
		this.refs.deleteConfirmationDialog.open();

	}
	showModal = () => {
		this.setState({
			show: !this.state.show, formValues: {
				current_password: '',
				new_password: '',
				confirm_password: ''
			}, error: ''
		});
	};
	logout = () => {
		const data = {
			device_token: localStorage.getItem('trackmymovers-device-token')
		}
		if (data.device_token) {
			common.apiCall('POST', 'deleteAdminDeviceRelation', '', data, '', '')
		}
		localStorage.getItem('user_type') == AppConfig.superAdminType ? this.props.history.push('/login') : this.props.history.push('/login')
		this.refs.deleteConfirmationDialog.close();
		localStorage.clear()
	}

	render() {
		const { locale, languages, history } = this.props;
		return (
			<div className="mainDiv">
				<Modal isOpen={this.state.show} toggle={() => this.showModal()} >
					<ModalHeader>
						Change Password
						<button type="button" className="close_btn" aria-label="Close" onClick={() => this.setState({ show: !this.state.show })}><span aria-hidden="true">×</span></button>
					</ModalHeader>
					<ModalBody>
						<form method="post" autoComplete="off" action="">
							<Row>
								<Col md="12">

									<FormGroup>
										<Label htmlFor="current_password">Current Password<em>*</em></Label>
										<Input onKeyPress={(e) => this.enterPressed(e)} type="password" id="current_password" onChange={(e) => this.onChangeHandler(e)}
											value={this.state.formValues.current_password} placeholder='Enter Current Password' name='current_password' />
									</FormGroup>
								</Col>
								<Col md="12">
									<FormGroup>
										<Label htmlFor="new_password">New Password<em>*</em></Label>
										<Input onKeyPress={(e) => this.enterPressed(e)} type="password" id="new_password" onChange={(e) => this.onChangeHandler(e)}
											value={this.state.formValues.new_password} placeholder='Enter New Password' name='new_password' />
									</FormGroup>
								</Col> <Col md="12">
									<FormGroup>
										<Label htmlFor="confirm_password">Confirm Password<em>*</em></Label>
										<Input onKeyPress={(e) => this.enterPressed(e)} type="password" id="confirm_password" onChange={(e) => this.onChangeHandler(e)}
											value={this.state.formValues.confirm_password} placeholder='Enter Confirm Password' name='confirm_password' />
									</FormGroup>
								</Col>
							</Row>
						</form>
						{
							this.state.error !== '' ?
								<Col md="12">
									<Alert color="danger" >
										{this.state.error}
									</Alert>
								</Col>
								: null
						}
					</ModalBody>
					<ModalFooter>
						<Button style={{ backgroundColor: '#3C16D5' }} className="text-white" variant='contained' /* color="primary" */ onClick={this.onPressChangePwd}>Save</Button>
						<Button variant='contained' className="text-white btn-danger" onClick={this.showModal}>Cancel</Button>
					</ModalFooter>
				</Modal>
				<Dropdown nav className="list-inline-item" isOpen={this.state.langDropdownOpen} toggle={this.toggle}>
					<DropdownToggle caret nav className="header-icon language-icon" >
						{localStorage.getItem('user_type') == AppConfig.superAdminType ? 'Admin' : 'My Account'}
					</DropdownToggle>

					<DropdownMenu>
						<DropdownItem>
							<a href="#" onClick={this.showModal}>
								<i className="zmdi zmdi-key text-info mr-3"></i>
								<span><IntlMessages id="widgets.changePassword" /></span>
							</a>
						</DropdownItem>
						<DropdownItem onClick={this.logoutPopup}>
							<a href="#" >
								<i className="zmdi zmdi-power text-danger mr-3"></i>
								<span><IntlMessages id="widgets.logOut" /></span>
							</a>
						</DropdownItem>
					</DropdownMenu>
					<DeleteConfirmationDialog
						ref="deleteConfirmationDialog"
						title="Are you sure you want to logout?"
						// message="This will delete user permanently."
						onConfirm={() => this.logout()}
					/>
				</Dropdown>
			</div>
		);
	}
}

// map state to props
const mapStateToProps = ({ settings, adminAuthReducer }) => {
	const { changePasswordData, loading } = adminAuthReducer;
	return { settings, changePasswordData, loading }
};

export default withRouter(connect(mapStateToProps, {
	changePassword

})(LanguageProvider));
