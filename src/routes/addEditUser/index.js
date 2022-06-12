
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import Button from '@material-ui/core/Button';
import joi from 'joi-browser';

import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Input,
    Form,
    Label,
    Alert,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
} from 'reactstrap';

import { getAllUsersList} from '../../actions/UsersAction';
import { connect } from 'react-redux';
import AppConfig from '../../constants/AppConfig';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Tooltip from '@material-ui/core/Tooltip';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Select from 'react-select';
import * as common from '../../api/index';
import Images from '../../assets/images';
import NumberFormat from 'react-number-format';
import queryString from 'query-string';


// let file = [];
// let doc = [];
let deletedDoc = []
class AddEditLoad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValues: {
                cus_name: '',
                phone_no: '',
                cus_email: '',
                load_name: '',
                from_address: '',
                from_city: '',
                from_state: '',
                from_country: '',
                from_zipcode: '',
                to_address: '',
                to_city: '',
                to_state: '',
                to_country: '',
                to_zipcode: '',
                profile_notes: '',
                first_email: '',
                first_name: '',
                email: '',
                name: '',
            },
            error: '',
            errorField: '',
            role_data: [],
            selectedRole: [{ value: '', label: 'Select role' }],
            selectedFirstRole: [{ value: '', label: 'Select role' }],
            documents: [],
            docNames: [],
            rolesList: [],
            emailRoleArr: [],
            showForm: false,
            showModal: false,
            role_name: '',
            fir_flag: '',
            load_id: '',
            images: [],
            customer_id: '',
            load_status: ''
        }
        this.params = queryString.parse(this.props.location.search)
    }
    async componentDidMount() {
        this.setState({ load_id: common.generatePassword() })
        await this.getRoleList()
        if (this.params.loadId) {
            await this.getLoadDetails();
            await this.getEmailAndRoleByLoadId()
        }
    }
    getLoadDetails = async () => {

        let reqData = { load_id: this.params.loadId }
        await this.props.getAllLoadListById(reqData);
        if (this.props.getAllLoadByIdData && this.props.getAllLoadByIdData.data) {
            let loadData = this.props.getAllLoadByIdData.data[0]
            console.log("load data==========", loadData)
            let formData = {
                cus_name: loadData.customer_name,
                phone_no: loadData.customer_phone,
                cus_email: loadData.customer_email,
                load_name: loadData.load_name,
                from_address: loadData.from_address,
                from_city: loadData.from_city,
                from_state: loadData.from_state,
                from_country: loadData.from_country,
                from_zipcode: loadData.from_zipcode,
                to_address: loadData.to_address,
                to_city: loadData.to_city,
                to_state: loadData.to_state,
                to_country: loadData.to_country,
                to_zipcode: loadData.to_zipcode,
                profile_notes: loadData.profile_notes,
                email: loadData.email,
                name: loadData.load_name,
            }
            let doc = loadData.attachments !== '' ? loadData.attachments.split(',') : [];
            console.log("doc=============", doc)
            let docnames = [];
            doc.length > 0 && doc.map(d => {
                if (d.includes('jpg') || d.includes('jpeg') || d.includes('png')) {
                    let imgs = this.state.images.slice();
                    imgs.push(d);
                    this.setState({ images: imgs })
                } else {
                    docnames.push(d.split('/').pop().split('?')[0]);
                }
                console.log("d.split", d.split('/').pop().split('?')[0])
            })
            await this.setState({
                formValues: formData,
                docNames: docnames,
                documents: doc,
                customer_id: loadData.customer_id,
                load_status: loadData.load_status
            })
        }

    }
    changeValuesHandler = async (e) => {
        console.log("state", this.state.formValues)
        var formValues = this.state.formValues;
        var name = e.target.name;
        formValues[name] = e.target.value.replace(/^\s+/g, '');
        if (name == 'phone_no') {
            // const re = /^(?=.*[0-9])[- , 0-9]+$/
            const re = /^[- , +()0-9]+$/
            if ((e.target.value === '' || re.test(e.target.value))) {
                this.setState({ formValues: formValues });
            } else {
                return
            }
        }
        this.setState({ formValues: formValues });
        console.log("state", this.state.formValues)
    }
    onChangeRole = async (e) => {
        await this.setState({ role_name: e.target.value })
    }
    addLoadHandler = async () => {
        let myData = { ...this.state.formValues }
        console.log("mydata", myData)
        this.validateFormData(myData);
    }

    getRoleList = async () => {
        await this.props.getAllRoles();
        if (this.props.getAllRolesData && this.props.getAllRolesData.data) {
            console.log(" this.props.getAllRolesData.data", this.props.getAllRolesData.data)
            let role_data = [];
            this.props.getAllRolesData.data.map(async (data) => {
                role_data.push({ value: data.id, label: data.role_name })
            })
            role_data.push({ value: 0, label: 'Add New Role' })
            await this.setState({
                role_data: role_data
            })
        }
    }

    validateFormData = (body, isOnEdit) => {
        console.log("body========", body)
        isOnEdit ? body.id = +this.params.loadId : null
        let schema = joi.object().keys({
            load_name: joi.string().trim().required(),
            from_city: joi.string().trim().required(),
            from_state: joi.string().trim().required(),
            from_country: joi.string().trim().required(),
            from_zipcode: joi.string().trim().required(),
            from_address: joi.string().trim().required(),
            to_address: joi.string().trim().required(),
            to_city: joi.string().trim().required(),
            to_state: joi.string().trim().required(),
            to_country: joi.string().trim().required(),
            to_zipcode: joi.string().trim().required(),
            cus_name: joi.string().trim().required().label('Customer name'),
            cus_email: joi.any().required().label('Customer email'),
            phone_no: joi.string().trim().required(),
            first_email: joi.string().optional().allow('').label('Email'),
            first_name: joi.string().optional().allow('').label('Name'),
            email: joi.string().trim().regex(AppConfig.EMAIL_REGEX).email().optional().allow(''),
            name: joi.string().optional().allow(''),
            profile_notes: joi.string().optional().allow('').label('Load Notes')
        })
        if (isOnEdit) {
            schema = schema.append({
                id: joi.number().required()
            });
        }
        joi.validate(body, schema, (error, value) => {
            if (error) {
                if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
                    let errorLog = common.validateSchema(error)
                    this.setState({ error: errorLog.error, errorField: errorLog.errorField });
                }
            }
            else {
                this.setState({ error: '', errorField: '' }, () => {
                    isOnEdit ? this.addEditLoadReq(body, true) : this.addEditLoadReq(body);
                });
            }
        })
    }
    addEditLoadReq = async (body, isOnEdit) => {
        let carrier_id = localStorage.getItem('carrier_id')
        let email_detail = this.state.emailRoleArr;
        console.log("this.state.formValues.first_email", this.state.formValues.first_email)
        if (this.state.formValues.first_email && this.state.formValues.first_email != '' && this.state.formValues.first_name && this.state.formValues.first_name != '' && this.state.selectedFirstRole[0].label != '') {
            email_detail.unshift({ email: this.state.formValues.first_email, name: this.state.formValues.first_name, role: this.state.selectedFirstRole[0].label });
        }
        console.log("contact detail", email_detail)
        let formData = new FormData();
        let documents = this.state.documents;
        if (documents.length > 0) {
            for (let doc of documents) {
                formData.append('attachments', doc);
            }
        }
        if (email_detail.length > 0) {
            for (let ed of email_detail) {
                formData.append('email_detail', JSON.stringify(ed));
            }
        }
        if (isOnEdit && deletedDoc.length > 0) {
            for (let dd of deletedDoc) {
                formData.append('deleted_doc', dd)
            }
        }
        if (isOnEdit) {
            formData.append('customer_id', this.state.customer_id);
            formData.append('load_status', this.state.load_status);
        }
        formData.append('name', body.cus_name);
        formData.append('phone_no', body.phone_no);
        formData.append('cus_email', body.cus_email);
        formData.append('load_name', body.load_name);
        formData.append('from_country', body.from_country);
        formData.append('from_state', body.from_state);
        formData.append('from_city', body.from_city);
        formData.append('from_address', body.from_address);
        formData.append('from_zipcode', body.from_zipcode);
        formData.append('to_country', body.to_country);
        formData.append('to_state', body.to_state);
        formData.append('to_city', body.to_city);
        formData.append('to_address', body.to_address);
        formData.append('to_zipcode', body.to_zipcode);
        formData.append('profile_notes', body.profile_notes);
        formData.append('carrier_id', carrier_id);
        formData.append('load_id', this.state.load_id);
        isOnEdit ? formData.append('id', body.id) : null
        email_detail = [];
        this.setState({ emailRoleArr: email_detail })
        if (isOnEdit) {
            await this.props.editLoadDetails(formData);
            if (this.props.editLoadDetailsData && this.props.editLoadDetailsData.code === 1) {
                deletedDoc = []
                common.displayLog(1, this.props.editLoadDetailsData.message)
                this.props.history.push('/app/load')
            }
        } else {
            await this.props.addLoadDetails(formData)
            console.log("this.props.addLoadDetailsData", this.props.addLoadDetailsData)
            if (this.props.addLoadDetailsData && this.props.addLoadDetailsData.code === 1) {
                common.displayLog(1, this.props.addLoadDetailsData.message)
                this.props.history.push('/app/load')
            }
        }
    }
    getEmailAndRoleByLoadId = async () => {
        let reqData = {
            load_id: this.params.loadId,
        }
        await this.props.getEmailAndRoleByLoadId(reqData);
        if (this.props.getEmailAndRolesData && this.props.getEmailAndRolesData.data) {
            // await this.setState({
            //     emailRoleArr: this.props.getEmailAndRolesData.data
            // })
            let emailDetails = this.props.getEmailAndRolesData.data
            console.log("emailRoleArr===========", emailDetails)
            // let firstEmailRole = this.props.getEmailAndRolesData.data[0]
            // let formValues = this.state.formValues;
            // formValues.first_email = firstEmailRole.email;
            // formValues.first_name = firstEmailRole.name
            // emailDetails.splice(0, 1);
            await this.setState({ emailRoleArr: emailDetails })
        }
    }
    enterPressed = async (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode
            await this.addCarrierHandler()
        }
    }
    goBack = async () => {
        await this.props.history.push('/app/load')
    }
    fileSelectHandler = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log("e target files===========", e.target.files[0].name)
            console.log("e.target.files[0].type", e.target.files[0].type)
            let doc = this.state.docNames.slice();
            let file = this.state.documents.slice()

            for (let i = 0; i < e.target.files.length; i++) {
                // if (e.target.files[i].type === 'application/msword' || e.target.files[i].type === 'application/vnd.ms-excel' || e.target.files[i].type === 'application/vnd.ms-powerpoint' || e.target.files[i].type === 'text/plain' || e.target.files[i].type === 'application/pdf' || e.target.files[i].type === 'image/jpg' || e.target.files[i].type === 'image/jpeg' || e.target.files[i].type === 'image/png') {
                if (e.target.files[i].type === 'image/jpg' || e.target.files[i].type === 'image/jpeg' || e.target.files[i].type === 'image/png') {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        let images = this.state.images.slice()
                        images.push(e.target.result)
                        this.setState({ images: images });
                    };
                    reader.readAsDataURL(e.target.files[i]);
                } else {
                    // docName = e.target.files[i].name;
                    doc.push(e.target.files[i].name)
                }
                // fileName = e.target.files[i]
                file.push(e.target.files[i])
                // }
                // else {
                //     common.displayLog(0, 'Invalid document')
                // }
            }
            // docName !== '' && docName ? doc.push(docName) : null;
            // fileName !== '' && fileName ? file.push(fileName) : null;
            this.setState({ docNames: doc, documents: file });
        }
    }
    handleRoleChange = async (selectedOption) => {
        let selectedRole = this.state.selectedRole;
        console.log("selected opition", selectedOption)
        if (selectedOption.value == 0) {
            this.setState({ showModal: true, fir_flag: 2 })
        } else {
            selectedRole[0].value = selectedOption.value;
            selectedRole[0].label = selectedOption.label;
            await this.setState({ selectedRole: selectedRole })
        }
    };
    handleFirstRoleChange = async (selectedOption) => {
        let selectedFirstRole = this.state.selectedFirstRole;
        console.log("selected opition", selectedOption)
        if (selectedOption.value == 0) {
            this.setState({ showModal: true, fir_flag: 1 })
        } else {
            selectedFirstRole[0].value = selectedOption.value;
            selectedFirstRole[0].label = selectedOption.label;
            await this.setState({ selectedFirstRole: selectedFirstRole })
        }
    };
    editLoadHandler = async () => {
        let myData = { ...this.state.formValues }
        this.validateFormData(myData, true);
    }
    onAddNewRole = async () => {
        let selectedFirstRole = this.state.selectedFirstRole;
        let selectedRole = this.state.selectedRole;
        if (this.state.fir_flag == 1) {
            selectedFirstRole[0].value = 0;
            selectedFirstRole[0].label = this.state.role_name;
            await this.setState({ selectedFirstRole: selectedFirstRole, showModal: false, role_name: '' })
        } else {
            selectedRole[0].value = 0;
            selectedRole[0].label = this.state.role_name;
            await this.setState({ selectedRole: selectedRole, showModal: false, role_name: '' })
        }
        console.log("selectedFirstRole", this.state.selectedFirstRole);
        console.log("selectedRole", this.state.selectedRole)
    }
    // removeDocument = (index) => {
    //     let docArr = this.state.docNames;
    //     docArr.splice(index, 1);
    //     this.setState({ docNames: docArr })
    // }
    // removeDocument = (index, doc) => {
    //     let docArr = this.state.docNames.slice();
    //     let file = this.state.documents.slice();
    //     docArr.splice(index, 1);
    //     file.splice(file.findIndex(x => x.name == doc), 1);
    //     this.setState({ docNames: docArr, documents: file });
    // }
    // removeImage = (index, img) => {
    //     let images = this.state.images.slice();
    //     let file = this.state.documents.slice();
    //     images.splice(index, 1)
    //     file.splice(file.findIndex(x => x.name == img), 1);
    //     this.setState({ images: images, documents: file })
    // }

    removeDocument = (index, doc) => {
        doc.includes('https://trackmymovers.s3.amazonaws.com') ? deletedDoc.push(doc) : null;
        let docArr = this.state.docNames.slice();
        let file = this.state.documents.slice();
        docArr.splice(index, 1);
        console.log("files======", file)
        doc.includes('https://trackmymovers.s3.amazonaws.com') ? file.splice(file.findIndex(x => x.includes(doc)), 1) : file.splice(file.findIndex(x => x.name == doc), 1);
        this.setState({ docNames: docArr, documents: file });
    }
    removeImage = (index, img) => {
        img.includes('https://trackmymovers.s3.amazonaws.com') ? deletedDoc.push(img) : null;
        let images = this.state.images.slice();
        let file = this.state.documents.slice();
        images.splice(index, 1)
        img.includes('https://trackmymovers.s3.amazonaws.com') ? file.splice(file.findIndex(x => x.includes(img)), 1) : file.splice(file.findIndex(x => x.name == img), 1);
        this.setState({ images: images, documents: file })
    }
    openForm = () => {
        let formValues = this.state.formValues;
        formValues.email = '';
        formValues.name = '';
        if (this.state.emailRoleArr.length > 3) {
            common.displayLog(0, 'you can not add more than 5 email.')
        } else {
            this.setState({ showForm: true, formValues: formValues, selectedRole: [{ value: '', label: 'Select Role' }] })
        }
    }
    closeForm = () => {
        this.setState({ showForm: false })
    }
    addEmailDetail = () => {
        if (this.state.formValues.email === '') {
            common.displayLog(0, 'Please enter email')
        } else if (this.state.formValues.name === '') {
            common.displayLog(0, 'Please enter name')
        } else if (this.state.selectedRole[0].value === '') {
            common.displayLog(0, 'Please select role')
        } else {
            let email_detail = this.state.emailRoleArr;
            email_detail.push({ email: this.state.formValues.email, name: this.state.formValues.name, role: this.state.selectedRole[0].label })
            this.setState({ emailRoleArr: email_detail, showForm: false })
        }
        console.log("contact dxetail===========", this.state.emailRoleArr)
    }
    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal, role_name: ''
        });
    };
    closeEmailDiv = (i) => {
        let emailDetailArr = this.state.emailRoleArr.slice();
        emailDetailArr.splice(i, 1);
        this.setState({ emailRoleArr: emailDetailArr })
    }
    clearEmailForm = () => {
        let formValues = this.state.formValues;
        formValues.first_email = '';
        formValues.first_name = '';
        this.setState({ formValues: formValues, selectedFirstRole: [{ value: '', label: 'Select role' }] })
    }
    addEmailForm = () => {
        return (
            <div className='contact-form mb-3'>
                <Row className='float-right mr-1 mb-1 emailCheck'>
                    {
                        this.state.formValues.name !== '' && this.state.formValues.email !== '' && this.state.selectedRole[0].value !== '' ?
                            <span className="p-2"><span onClick={() => this.addEmailDetail()} className="ti-check"></span></span> : null
                    }
                    <span className="p-2"><span onClick={() => this.closeForm()} className="ti-close"></span></span>
                </Row>
                <FormGroup>
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter Name"
                        value={this.state.formValues.name}
                        onKeyPress={(e) => this.enterPressed(e)}
                        onChange={(e) => this.changeValuesHandler(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Enter Email"
                        value={this.state.formValues.email}
                        onKeyPress={(e) => this.enterPressed(e)}
                        onChange={(e) => this.changeValuesHandler(e)}
                    />
                </FormGroup>

                <FormGroup>
                    <Select
                        value={this.state.selectedRole}
                        placeholder='Select Role'
                        onChange={this.handleRoleChange}
                        options={this.state.role_data}
                    />
                </FormGroup>
            </div>
        )
    }

    render() {
        return (
            <div className="addLoadMain">
                <Helmet>
                    <title>{this.params.loadId ? "Edit User" : "Add User"}</title>
                    <meta name="description" content="Reactify Widgets" />
                </Helmet>
                <PageTitleBar
                    title={<IntlMessages id={this.params.loadId ? "sidebar.editUser" : "sidebar.addUser"} />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <div className="table-responsive">
                        <div className="d-flex justify-content-between border-bottom tableContent">
                            <div className="col-sm-12 col-md-12 col-xl-12">
                                <Form className='addLoadForm'>
                                    {/* <div><b>Load Id : </b><span style={{ color: '#2D7CBF' }}>{this.state.load_id}</span></div>
                                    <hr /> */}
                                    <div className='formWrapper'>
                                        <div className='info-panel d-flex justify-content-center'><b>Load Name</b><em>*</em></div>
                                        <FormGroup row>
                                            <Col sm={12}>
                                                <Input
                                                    type="text"
                                                    name="load_name"
                                                    id="load_name"
                                                    placeholder="Enter Load Name"
                                                    value={this.state.formValues.load_name}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </div>
                                    <div className='formWrapper'>
                                        <div className='info-panel d-flex justify-content-center'><b>Load Info</b><em>*</em></div>

                                        <div className='info-panel-1'><b>Origin</b></div>
                                        <FormGroup row>
                                            <Col sm={12}>
                                                <Input
                                                    type="text"
                                                    name="from_country"
                                                    id="from_country"
                                                    placeholder="Enter Country"
                                                    value={this.state.formValues.from_country}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col sm={12}>
                                                <Input
                                                    type="textarea"
                                                    name="from_address"
                                                    id="from_address"
                                                    placeholder="Enter Address"
                                                    value={this.state.formValues.from_address}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col sm={12}>
                                                <Input
                                                    type="text"
                                                    name="from_city"
                                                    id="from_city"
                                                    placeholder="Enter City"
                                                    value={this.state.formValues.from_city}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col sm={12}>
                                                <Input
                                                    type="text"
                                                    name="from_state"
                                                    id="from_state"
                                                    placeholder="Enter State"
                                                    value={this.state.formValues.from_state}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col sm={6}>
                                                <Input
                                                    type="text"
                                                    name="from_zipcode"
                                                    id="from_zipcode"
                                                    placeholder="Enter Zipcode or Postal code"
                                                    value={this.state.formValues.from_zipcode}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <div className='info-panel-1'><b>Destination</b></div>
                                        <FormGroup row>
                                            <Col sm={12}>
                                                <Input
                                                    type="text"
                                                    name="to_country"
                                                    id="to_country"
                                                    placeholder="Enter Country"
                                                    value={this.state.formValues.to_country}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col sm={12}>
                                                <Input
                                                    type="textarea"
                                                    name="to_address"
                                                    id="to_address"
                                                    placeholder="Enter Address"
                                                    value={this.state.formValues.to_address}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col sm={12}>
                                                <Input
                                                    type="text"
                                                    name="to_city"
                                                    id="to_city"
                                                    placeholder="Enter City"
                                                    value={this.state.formValues.to_city}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col sm={12}>
                                                <Input
                                                    type="text"
                                                    name="to_state"
                                                    id="to_state"
                                                    placeholder="Enter State"
                                                    value={this.state.formValues.to_state}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col sm={6}>
                                                <Input
                                                    type="text"
                                                    name="to_zipcode"
                                                    id="to_zipcode"
                                                    placeholder="Enter Zipcode or Postal code"
                                                    value={this.state.formValues.to_zipcode}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </div>
                                    <div className='formWrapper'>
                                        <div className='info-panel d-flex justify-content-center'><b>Customer Info</b><em>*</em></div>
                                        <FormGroup row>
                                            <Col sm={12}>
                                                <Input
                                                    type="text"
                                                    name="cus_name"
                                                    id="cus_name"
                                                    placeholder="Enter Customer Name"
                                                    value={this.state.formValues.cus_name}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col sm={6}>
                                                <Input
                                                    type="text"
                                                    name="phone_no"
                                                    id="phone_no"
                                                    placeholder="Enter Phone no."
                                                    value={this.state.formValues.phone_no}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                                {/* <NumberFormat
                                                    className='form-control'
                                                    format="### ### ####,### ### ####,"
                                                    name="phone_no"
                                                    placeholder="Enter Phone no."
                                                    value={this.state.formValues.phone_no}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)} /> */}
                                            </Col>
                                        </FormGroup>

                                        <FormGroup row>
                                            <Col sm={12}>
                                                <Input
                                                    type="text"
                                                    name="cus_email"
                                                    id="cus_email"
                                                    placeholder="Enter Email"
                                                    value={this.state.formValues.cus_email}
                                                    onKeyPress={(e) => this.enterPressed(e)}
                                                    onChange={(e) => this.changeValuesHandler(e)}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </div>
                                    <div className='formWrapper'>
                                        <div className='info-panel  d-flex justify-content-center'><b>Additional Load Participants</b></div>
                                        <div className='contact-form mb-3'>
                                            <Row className='float-right mr-2 mb-1'>
                                                <span className="p-2"><span onClick={() => this.clearEmailForm()} style={{ color: 'red' }} className="ti-close"></span></span>
                                            </Row>
                                            <FormGroup>
                                                <Col sm={12}>
                                                    <Input
                                                        type="text"
                                                        name="first_name"
                                                        id="first_name"
                                                        placeholder="Enter Name"
                                                        value={this.state.formValues.first_name}
                                                        onKeyPress={(e) => this.enterPressed(e)}
                                                        onChange={(e) => this.changeValuesHandler(e)}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup>
                                                <Col sm={12}>
                                                    <Input
                                                        type="text"
                                                        name="first_email"
                                                        id="first_email"
                                                        placeholder="Enter Email"
                                                        value={this.state.formValues.first_email}
                                                        onKeyPress={(e) => this.enterPressed(e)}
                                                        onChange={(e) => this.changeValuesHandler(e)}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup>
                                                <Col sm={6}>
                                                    <Select
                                                        value={this.state.selectedFirstRole}
                                                        placeholder='Select Role'
                                                        onChange={this.handleFirstRoleChange}
                                                        options={this.state.role_data}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </div>
                                        {
                                            this.state.emailRoleArr.length > 0 && this.state.emailRoleArr.map((ed, i) =>
                                                <div key={i} className="add_newDetail">
                                                    <Row>
                                                        {
                                                            i == 0 && this.params.loadId ?
                                                                <Col className='mainText mb-3'><h3>Main Load Participant</h3></Col>
                                                                : null
                                                        }
                                                        <Col sm={12} className="detailBox">
                                                            <span><b>Name: </b><span>{ed.name || 'N/A'}</span></span>
                                                        </Col>
                                                        <Col sm={12} className="detailBox">
                                                            <span><b>Email : </b><span>{ed.email || 'N/A'}</span></span>
                                                        </Col>
                                                        <Col sm={12} className="detailBox">
                                                            <span><b>Role: </b><span>{ed.role || 'N/A'}</span></span>
                                                        </Col>

                                                    </Row>
                                                    <span className="p-2 clostBtn"><span onClick={() => this.closeEmailDiv(i)} className="ti-close"></span></span>
                                                </div>

                                            )
                                        }
                                        <Row>
                                            <Button onClick={() => this.openForm()} variant="outlined" color="primary" className='ml-3 mb-3' disabled={this.state.showForm}><i className='ti-plus'></i>&nbsp;&nbsp;  Add Additional</Button>
                                        </Row>
                                        {
                                            this.state.showForm ? this.addEmailForm() : null
                                        }
                                    </div>
                                    <div className='formWrapper'>
                                        <div className='info-panel d-flex justify-content-center'><b>Load Notes</b></div>
                                        <FormGroup>
                                            <span><b>Note : </b> This section is for internal company remarks, any notes or comments you place here will not be visible to anyone else.</span>
                                            <Input
                                                style={{ height: '200px' }}
                                                type="textarea"
                                                name="profile_notes"
                                                id="profile_notes"
                                                placeholder="Enter Profile Note"
                                                value={this.state.formValues.profile_notes}
                                                onKeyPress={(e) => this.enterPressed(e)}
                                                onChange={(e) => this.changeValuesHandler(e)}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className='formWrapper'>
                                        <div className='info-panel d-flex justify-content-center'><b>Attachments</b></div>
                                        <span><b>Note : </b> Internal company attachments and files only, not visible to anyone else. If you wish to share files and attachments with customers or other parties you can do so once the load has been created.</span>
                                        <div className="attachfileBlock">
                                            <div className="file">
                                                <FormGroup >
                                                    <label className='upload-doc' htmlFor="upload-attachment">
                                                        <img src={require('../../assets/img/upload-file.png')} /></label>
                                                    <input type="file"
                                                        name="photo"
                                                        multiple
                                                        accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain,application/pdf,image/*,video/*"
                                                        onChange={(e) => this.fileSelectHandler(e)}
                                                        id="upload-attachment" />
                                                </FormGroup>
                                            </div>
                                            <div className="attachFiles">
                                                {
                                                    this.state.docNames.length > 0 && this.state.docNames.map((document, i) =>
                                                        <div className='carrierFile'>
                                                            <div className="attacheFileBox d-flex flex-wrap">
                                                                <div className="pdfBoxMain mt-2 mb-2">
                                                                    <div className="pdfBox"> <img className='pdfImage' src={document.substr(document.lastIndexOf('.') + 1) == 'doc' || document.substr(document.lastIndexOf('.') + 1) == 'docx' ? Images.svg : (document.substr(document.lastIndexOf('.') + 1) == 'pdf' ? Images.pdf : document.substr(document.lastIndexOf('.') + 1) == 'mp4' || document.substr(document.lastIndexOf('.') + 1) == 'MP4' || document.substr(document.lastIndexOf('.') + 1) == 'mov' || document.substr(document.lastIndexOf('.') + 1) == 'MOV' ? Images.video : Images.file)} />
                                                                        <div className="fileDetail d-flex justify-content-between"> <label>{document}<i onClick={() => this.removeDocument(i, document)} className="close-icon ti-close ml-2"></i></label></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                {
                                                    this.state.images && this.state.images.length > 0 && this.state.images.map((image, i) =>
                                                        <div>
                                                            <img className="tag-img" key={i} src={image} alt="" title="" />
                                                            <i onClick={() => this.removeImage(i, image)} className="close-icon ti-close ml-2 mr-2"></i>
                                                        </div>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        this.state.error !== '' ?
                                            <Alert color="danger">
                                                {this.state.error}
                                            </Alert>
                                            : null
                                    }
                                    <p><em style={{ color: '#c35151' }}>*</em><span className='mandatory-field'> SHOWS MANDATORY FIELDS</span></p>
                                    <hr />
                                    <Row className="btmBtn">
                                        {
                                            this.params.loadId ?
                                                <Button variant="contained" className="text-white btn-primary mr-2" onClick={this.editLoadHandler}>Update</Button> :
                                                <Button variant="contained" className="text-white btn-primary mr-2" onClick={this.addLoadHandler}>Add</Button>
                                        }
                                        <Button variant="contained" className="text-white btn-danger" onClick={this.goBack}>Cancel</Button>
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </div>
                </RctCollapsibleCard>
                <Modal isOpen={this.state.showModal} toggle={() => this.toggleModal()} >
                    <ModalHeader>
                        Add New Role
						<button type="button" className="close_btn" aria-label="Close" onClick={() => this.setState({ showModal: !this.state.showModal })}><span aria-hidden="true">×</span></button>
                    </ModalHeader>
                    <ModalBody>
                        <form method="post" autoComplete="off" action="">
                            <Row>
                                <Col md="12">
                                    <FormGroup>
                                        <Label htmlFor="role_name">Role Name</Label>
                                        <Input type="text" id="role_name" onChange={(e) => this.onChangeRole(e)}
                                            value={this.state.role_name} placeholder='Enter Role Name' name='role_name' />
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
                        <Button style={{ backgroundColor: '#3C16D5' }} className="text-white" variant='contained' /* color="primary" */ onClick={this.onAddNewRole}>Save</Button>
                        <Button variant='contained' className="text-white btn-danger" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div >
        );
    }
}
// map state to props
const mapStateToProps = ({ loadReducer }) => {
    const { getAllLoadByIdData, addLoadDetailsData, getAllCarrierListData, getAllRolesData, loading, getEmailAndRolesData, editLoadDetailsData } = loadReducer;
    return { getAllLoadByIdData, addLoadDetailsData, getAllCarrierListData, getAllRolesData, loading, getEmailAndRolesData, editLoadDetailsData }
}

export default connect(mapStateToProps, {
    getAllUsersList
})(AddEditLoad);
