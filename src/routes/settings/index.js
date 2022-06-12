import React, { Component } from 'react'
import { Helmet } from "react-helmet";
import Button from '@material-ui/core/Button';
import {
    Col,
    FormGroup,
    Form,
    Label,
    Alert,
} from 'reactstrap';
import Datetime from 'react-datetime';
import { connect } from 'react-redux';
import joi from 'joi-browser';
import moment from 'moment'

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import { getSettingsDetails, editSettingsDetail } from '../../actions/SettingsAction';
import * as common from '../../api/index';
import { getTheDate } from "Helpers/helpers";

import "react-datetime/css/react-datetime.css";

class Settings extends Component {
    state = {
        datetime: moment().format('YYYY-MM-DD hh:mm'),
        idocument: '',
        image: '',
        error: '',
        errorField: ''
    }
    componentDidMount = async () => {
        await this.getSettings()
    }
    getSettings = async () => {
        await this.props.getSettingsDetails();
        if (this.props.getSettingsDetailsData && this.props.getSettingsDetailsData.data) {
            console.log("getSettingsDetailsData", this.props.getSettingsDetailsData)
            const settingsData = this.props.getSettingsDetailsData.data
            this.setState({ datetime: getTheDate(settingsData.datetime, 'YYYY-MM-DD hh:mm a'), image: settingsData.activity_image, idocument: settingsData.activity_image })
        }
    }
    imageSelectHandler = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log("e target files===========", e.target.files[0].name)
            console.log("e.target.files[0].type", e.target.files[0].type)
            if (e.target.files[0].type === 'image/jpg' || e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png') {
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.setState({ image: e.target.result });
                };
                reader.readAsDataURL(e.target.files[0]);
            }
            this.setState({ idocument: e.target.files[0] });
        }
    }
    removeImage = () => {
        this.setState({ image: '', idocument: {} })
    }
    changeDateTime = (date) => {
        this.setState({ datetime: date });
    }
    editHandler = async () => {
        let body = {
            datetime: moment(this.state.datetime).format("YYYY-MM-DD HH:mm:ss"),
            image: this.state.image
        },
            schema = joi.object().keys({
                image: joi.string().trim().required(),
                datetime: joi.string().trim().required()
            })
        joi.validate(body, schema, (error, value) => {
            if (error) {
                if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
                    let errorLog = common.validateSchema(error)
                    this.setState({ error: errorLog.error, errorField: errorLog.errorField });
                }
            } else {
                this.setState({ error: '', errorField: '' }, () => { this.editReq(body) });
            }
        })
    }
    editReq = async (body) => {
        let formData = new FormData();
        if (this.state.idocument) {
            formData.append('image', this.state.idocument);
        }
        formData.append('datetime', body.datetime);
        await this.props.editSettingsDetail(formData);
        console.log('editBlogPostDetailsData', this.props.editSettingsDetailData.message)
        if (this.props.editSettingsDetailData && this.props.editSettingsDetailData.code === 1) {
            deletedDoc = []
            common.displayLog(1, this.props.editSettingsDetailData.message)
            this.props.history.push('/app/program')
        }
    }
    render() {
        const { match } = this.props;
        return (
            <div className="addCarrierMain">
                <Helmet>
                    <title>Settings</title>
                    <meta name="description" content="Settings" />
                </Helmet>
                <PageTitleBar title='Settings' match={match} />
                <RctCollapsibleCard fullBlock>
                    <div className="table-responsive">
                        <div className="d-flex justify-content-between tableContent">
                            <div className="col-sm-12 col-md-12 col-xl-12">
                                <Form className='addCarrierForm' >
                                    <div className='formWrapper'>
                                        {/* <div className='info-panel d-flex justify-content-center'></div> */}

                                        <div className="row align-items-start"> 
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label htmlFor="description"><span>Achievements Image<em>*</em></span></Label>                                                    
                                                    <label className='upload-doc' htmlFor="upload-attachment">
                                                        <img src={require('../../assets/img/upload-file.png')} /></label>
                                                    <input
                                                        type="file"
                                                        name="achievements_image"
                                                        accept="image/*"
                                                        onChange={(e) => this.imageSelectHandler(e)}
                                                        id="upload-attachment" />                                                
                                                </FormGroup>
                                                <FormGroup>
                                                    <div className="attachFiles">                                            
                                                        {
                                                            this.state.image
                                                                ?
                                                                <div>
                                                                    <img className="tag-img" src={this.state.image} alt="" title="" />
                                                                    <i onClick={this.removeImage} className="close-icon ti-close ml-2 mr-2"></i>
                                                                </div>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                    <div className='info-panel d-flex justify-content-center'></div>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label htmlFor="program_duration"><span>Date<em>*</em></span></Label>                                                
                                                    <Datetime
                                                        name="datetime"
                                                        id="datetime"
                                                        onChange={this.changeDateTime}
                                                        value={this.state.datetime}
                                                        dateFormat={'YYYY-MM-DD'}
                                                        closeOnSelect={true} />                                                
                                                </FormGroup>
                                            </Col>
                                        </div>
                                        
                                        
                                    </div>
                                    {
                                        this.state.error !== '' ?
                                            <Alert color="danger">
                                                {this.state.error}
                                            </Alert>
                                            : null
                                    }
                                    <hr />
                                    <Button variant="contained" className="text-white btn-primary mr-2" onClick={this.editHandler}>Update</Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </RctCollapsibleCard>
            </div >
        )
    }
}
// map state to props
const mapStateToProps = ({ SettingsReducer }) => {
    const { getSettingsDetailsData, editSettingsDetailsData } = SettingsReducer
    return { getSettingsDetailsData, editSettingsDetailsData }
}

export default connect(mapStateToProps, { getSettingsDetails, editSettingsDetail })(Settings);