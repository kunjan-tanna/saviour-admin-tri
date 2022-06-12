
import React, { Component } from 'react';
import { Helmet } from "react-helmet";

import {
    Row,
    Col,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
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
import {addAppointementDetails,getAllAppointementListById,editAppointementDetails} from '../../actions/AppointementAction';
import { connect } from 'react-redux';
import Images from '../../assets/images';
import ETAModal from 'Components/Model/ChangeEta';
import SignModal from 'Components/Model/TermsEsign';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import queryString from 'query-string'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Rating from 'react-rating';
import * as common from '../../api/index';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Datetime from 'react-datetime';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import joi from 'joi-browser';
import { convertSecondToTime} from "Helpers/helpers";

let doc = []
let file = []
let videoThumb;
let videoImg;
let videos = [];
let videoDuration;
class AddEditAppointement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValues: {
                appointement_name: '',
                appointement_description:''
            },
            programData: {},
            blogPostData: {},
            appointementData: {},
            vdocuments: [],
            videoNames: [],
            videoImg:'',
            videoThumb:'',
            videos: [],
            error: '',
            is_carrier: '',
            imageData: [],
            docNames: [],
            showModal: false,
            showEtaModal: false,
            load_status: '',
            status_name: '',
            images: [],
            showSignButton: true,
            showSignModal: false,
            videoDuration:''
        }
        this.params = queryString.parse(this.props.location.search)
        console.log("paramnssssddddd", this.params)
    }
    componentDidMount = async () => {
        console.log("paramnssss", this.params)
        await this.getAppointementDetails();
    }

    videoSelectHandler = (e) => {

        if (e.target.files && e.target.files.length > 0) {
            console.log("e target files===========", e.target.files[0].name)
            console.log("e.target.files[0].type", e.target.files[0].type)
            let doc = this.state.videoNames.slice();
            let file = this.state.vdocuments.slice()
            let videos = this.state.videos.slice()
            if (file.length >= 1) {
                alert('Please select remove first video ')
                return false;
            }
            if (videos.length >= 1) {
                alert('Please select remove first video ')
                return false;
            }
            console.log('docdocdoc',doc)
            console.log('filefilefile',file)
            console.log('e.target.files',e.target.files)
            for (let i = 0; i < e.target.files.length; i++) {
                // if (e.target.files[i].type === 'application/msword' || e.target.files[i].type === 'application/vnd.ms-excel' || e.target.files[i].type === 'application/vnd.ms-powerpoint' || e.target.files[i].type === 'text/plain' || e.target.files[i].type === 'application/pdf' || e.target.files[i].type === 'image/jpg' || e.target.files[i].type === 'image/jpeg' || e.target.files[i].type === 'image/png') {
                if (e.target.files[i].type === 'video/mp4') {
                    let reader = new FileReader();
                    reader.onload = (e) => {
     
                        let videos = this.state.videos.slice()
                        videos.push(e.target.result)
                        this.setState({ videos: videos });
                    };
                    reader.readAsDataURL(e.target.files[i]);
                    
                    file.push(e.target.files[0])
                    this.setState({ videoNames: doc, vdocuments: file });
                } 
             
            }
            
        }
        console.log('video is---->>>>', e.target.files[0]);
         let file = e.target.files[0];
        this.setState({
            quiz_video: e.target.files[0]
        });
        var fileReader = new FileReader();
        var img
        if (e.target.files[0] != undefined) {
          if (file.type.match('image')) {
            fileReader.onload = function () {
              var img = document.createElement('img');
              img.src = fileReader.result;
              videoImg = img
              // document.getElementsByTagName('div')[0].appendChild(videoImg);
            };
            
            fileReader.readAsDataURL(file);
          } else {
              console.log('ellelelelelelle')
            fileReader.onload = function () {
              var blob = new Blob([fileReader.result], { type: file.type });
              console.log('blob',blob)
              var url = URL.createObjectURL(blob);
              var video = document.createElement('video');
              var timeupdate = function () {
                if (snapImage()) {
                  video.removeEventListener('timeupdate', timeupdate);
                  video.pause();
                }
              };
              video.addEventListener('loadeddata', function () {

                let videoDurations = convertSecondToTime(video.duration)
                console.log('duration videoDurations ',videoDurations)
                videoDuration =videoDurations
    
                console.log('duration duration ',videoDuration)
                if (snapImage()) {
                  video.removeEventListener('timeupdate', timeupdate);
                }
              });
              var snapImage = function () {
                var canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                var image = canvas.toDataURL();
                var success = image.length > 100000;
                if (success) {
                  img = document.createElement('img');
                  img.src = image;
                  img.id = "videoImg";
                  videoImg = img
                  // document.getElementsByName('thumbnaildiv')[0].appendChild(videoImg);
    
                  URL.revokeObjectURL(url);
                }
                videoThumb = image
                // console.log('videoThumbvideoThumb',videoThumb)
                return success;
              };
              video.addEventListener('timeupdate', timeupdate);
              video.preload = 'metadata';
              video.src = url;
              // Load video in Safari / IE11
              video.muted = true;
              video.playsInline = true;
              video.play();
            };
            // console.log('file----->>>', file);
            fileReader.readAsArrayBuffer(file);
          }
       
          this.setState({
            videoImg: img
          })
        }
    }

    getAppointementDetails = async () => {
        let reqData = { appointement_id: this.params.appointement_id }
        console.log('this.params.appointement_id',this.params.appointement_id)
        if(this.params.appointement_id != '' && this.params.appointement_id !== undefined){
            console.log('reqData',reqData)
            let usd = await this.props.getAllAppointementListById(reqData);
            console.log('getAllAppointementByIdData  ',this.props.getAllAppointementByIdData.data )
            let appointementData = this.props.getAllAppointementByIdData.data;
    
            let vid = appointementData.appointement_video !== '' ? appointementData.appointement_video.split(',') : [];
            vid.length > 0 && vid.map(d => {
               
                let imgs = this.state.videos.slice();
                imgs.push(d);
                this.setState({ videos: imgs })
            })
            if (this.props.getAllAppointementByIdData && this.props.getAllAppointementByIdData.data) {
                await this.setState({
                    formValues: this.props.getAllAppointementByIdData.data
                })
            }
        }    
    }

    editAppointementHandler = async () => {
        let myData = { ...this.state.formValues }
        myData.videoImg =videoThumb;
        myData.video_durations ='';
        myData.video_durations =videoDuration;
        myData.appointement_id =this.params.appointement_id;
        console.log("mydata", myData)
        this.validateFormData(myData, true);
    }
    addAppointementHandler = async () => {
        let myData = { ...this.state.formValues }
    
        myData.videoImg =videoThumb;
        myData.video_durations =videoDuration;
        myData.program_id =this.params.program_id;
        this.validateFormData(myData);
    }


    validateFormData = (body, isOnEdit) => {
        console.log("body========", body)
        isOnEdit ? body.program_appointment_id = +this.params.program_appointment_id : null
        let schema = joi.object().keys({
            appointement_name: joi.string().trim().required(),
            appointement_description: joi.string().trim().required(),
            program_appointment_id:joi.any(),
            appointement_video_m3u8:joi.any(),
            appointement_video:joi.any(),
            appointement_video_thumb_path:joi.any(),
            video_durations:joi.any(),
            is_active:joi.any(),
            created_date:joi.any(),
            modified_date:joi.any(),
            program_id:joi.any(),
            videoImg: joi.any(),
            VideoImg : joi.any(),

            
        })
        console.log("schemaschema========", schema)
        let videos = this.state.vdocuments;
        console.log('videosvideosvideos', videos)
        if (videos.length < 1) {
            schema = schema.append({
                video: joi.string().required(),
            });
        }
        if (isOnEdit) {
            schema = schema.append({
                appointement_id: joi.number().required()
            });
        }else{
            schema = schema.append({
                program_id: joi.number().required()
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
                    isOnEdit ? this.addEditAppointementReq(body, true) : this.addEditAppointementReq(body);
                });
            }
        })
    }
    addEditAppointementReq = async (body, isOnEdit) => {
        console.log('addEditBlogPostReq Body',body)
       
       
        let formData = new FormData();
        let videos = this.state.vdocuments;

        console.log('videos',videos)
       
        if (videos.length > 0) {
            for (let video of videos) {
                formData.append('appointement_video', video);
            }
        }

        formData.append('appointment_name', body.appointement_name);
        formData.append('videoDuration', body.video_durations);
        formData.append('appointement_description', body.appointement_description);
        formData.append('program_id', body.program_id);
        formData.append('videoThumb', body.videoImg);

        isOnEdit ? formData.append('appointement_id', body.appointement_id) : null
        
        if (isOnEdit) {
           
            await this.props.editAppointementDetails(formData);
            console.log('editAppointementDetailsData',this.props.editAppointementDetailsData.message)
            console.log('dddddddd',this.props.editAppointementDetailsData.code)
            if (this.props.editAppointementDetailsData && this.props.editAppointementDetailsData.code === 1) {

                common.displayLog(1, this.props.editAppointementDetailsData.message)

                this.props.history.push('/app/program')
            }
        } else {
            console.log('formData',formData)
            await this.props.addAppointementDetails(formData)
            console.log("this.props.addProgramDetailsData", this.props.addAppointementDetailsData)
            if (this.props.addAppointementDetailsData && this.props.addAppointementDetailsData.code === 1) {
                common.displayLog(1, this.props.addAppointementDetailsData.message)
                this.props.history.push('/app/program')
            }
        }
    }

    removeVideo = (index, vid) => {
        // console.log('vidvidvidvidvid',vid)
        // img.includes('https://saviour.s3.amazonaws.com') ? deletedDoc.push(vid) : null;
        let images = [];
        // let images = this.state.images.slice();

        // let file = this.state.documents.slice();
        let file = [];
        // images.splice(index, 1)
        // img.includes('https://saviour.s3.amazonaws.com') ? file.splice(file.findIndex(x => x.includes(img)), 1) : file.splice(file.findIndex(x => x.name == img), 1);
        this.setState({ videos: images, vdocuments: file ,videoNames: file})
    }

    closeForm = () => {
        this.setState({ showForm: false })
    }
    enterPressed = async (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode
            // await this.addCarrierHandler()
        }
    }
    changeValuesHandler = async (e) => {
        console.log(e)
        console.log("state", this.state.formValues)
        var formValues = this.state.formValues;
        var name = e.target.name;
        console.log(name)
        formValues[name] = e.target.value.replace(/^\s+/g, '');
       
        this.setState({ formValues: formValues });
        console.log("state", this.state.formValues)
    }
    goBack = async () => {
        await this.props.history.push('/app/appointement')
    }
    render() {

        const { blogPostData } = this.state;
        console.log('\n\n\n state', blogPostData);
        return (
      
                <div className="addCarrierMain">
                    <Helmet>
                        <title>{this.params.appointement_id ? "Edit Appointement" : "Add Appointement"}</title>
                        <meta name="description" content="Reactify Widgets" />
                    </Helmet>
                    <PageTitleBar
                        title={<IntlMessages id={this.params.appointement_id ? "sidebar.editAppointement" : "sidebar.addAppointement"} />}
                        match={this.props.match}
                    />
                    <RctCollapsibleCard fullBlock>
                        <div className="table-responsive">
                            <div className="d-flex justify-content-between border-bottom tableContent">
                                <div className="col-sm-12 col-md-12 col-xl-12">
                                    <Form className='addCarrierForm' >
                                        <div className='formWrapper'>
                                        <div className='info-panel d-flex justify-content-center'></div>
                                           
                                            <FormGroup row>
                                                <Label htmlFor="appointment_name" sm={4}><span>Appointment Name<em>*</em></span></Label>
                                                <Col sm={6}>
                                                    <Input
                                                        type="text"
                                                        name="appointement_name"
                                                        id="appointement_name"
                                                        placeholder="Enter Appointment Name"
                                                        value={this.state.formValues.appointement_name}
                                                        onKeyPress={(e) => this.enterPressed(e)}
                                                        onChange={(e) => this.changeValuesHandler(e)} />
                                                </Col>
                                            </FormGroup>
    
                                            
                                        
                                           
                                            
                                            <FormGroup row>
                                                <Label htmlFor="instructor_description" sm={4}><span>Appointement Description<em>*</em></span></Label>
                                                <Col sm={6}>
                                                    <Input
                                                        type="textarea"
                                                        name="appointement_description"
                                                        id="appointement_description"
                                                        placeholder="Enter Appointement Description"
                                                        value={this.state.formValues.appointement_description}
                                                        onKeyPress={(e) => this.enterPressed(e)}
                                                        onChange={(e) => this.changeValuesHandler(e)} />
                                                </Col>
                                            </FormGroup>
                                            
                                            <FormGroup row >
                                                <Label htmlFor="description" sm={4}><span>Appointement Video<em>* (Please upload max 85MB video)</em></span></Label>
                                                <Col sm={3}>
                                                    <label className='upload-doc' htmlFor="upload-vattachment">
                                                        <img src={require('../../assets/img/upload-file.png')} /></label>
                                                    <input
                                                        type="file"
                                                        name="appointement_video"
                                                        accept="video/*"
                                                        onChange={(e) => this.videoSelectHandler(e)}
                                                        id="upload-vattachment" />
                                                </Col>
                                            </FormGroup>   
                                            <div className="attachFiles">
                                                <Col sm={4}>
                                                </Col>
                                                    {
                                                        this.state.videoNames.length > 0 && this.state.videoNames.map((document, i) =>
                                                            <div className='carrierFile' key={i}>
                                                                <div className="attacheFileBox d-flex flex-wrap">
                                                                    <div className="pdfBoxMain mt-2 mb-2">
                                                                        <div className="pdfBox"> <img className='pdfImage' src={document && (document.substr(document.lastIndexOf('.') + 1) == 'doc' || document.substr(document.lastIndexOf('.') + 1) == 'docx' ? Images.svg : (document.substr(document.lastIndexOf('.') + 1) == 'pdf' ? Images.pdf : document.substr(document.lastIndexOf('.') + 1) == 'mp4' || document.substr(document.lastIndexOf('.') + 1) == 'MP4' || document.substr(document.lastIndexOf('.') + 1) == 'mov' || document.substr(document.lastIndexOf('.') + 1) == 'MOV' ? Images.video : Images.file))} />
                                                                            <div className="fileDetail d-flex justify-content-between"> <label>{document}<i onClick={() => this.removeDocument(i, document)} className="close-icon ti-close ml-2 mr-2"></i></label></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    {
                                                        this.state.videos && this.state.videos.length > 0 && this.state.videos.map((video, i) =>
                                                            <div key={i}>
                                                                <video  className="tag-video"  controls>
                                                                    <source src={video} />
                                                                </video>
                                                                <i onClick={() => this.removeVideo(i, video)} className="close-icon ti-close ml-2 mr-2"></i>
                                                            </div>)
                                                    }
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
                                        {
                                            this.params.appointement_id ?
                                                <Button variant="contained" className="text-white btn-primary mr-2" onClick={this.editAppointementHandler}>Update</Button> :
                                                <Button variant="contained" className="text-white btn-primary mr-2" onClick={this.addAppointementHandler}>Add</Button>
                                        }
                                        <Button variant="contained" className="text-white btn-danger" onClick={this.goBack}>Cancel</Button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </RctCollapsibleCard>
                </div >
            

        );
    }
}
// map state to props
const mapStateToProps = ({ appointementReducer }) => {
    const { addAppointementDetailsData,getAllAppointementByIdData,editAppointementDetailsData } = appointementReducer;
    return { addAppointementDetailsData,getAllAppointementByIdData,editAppointementDetailsData}
}

export default connect(mapStateToProps, {
    addAppointementDetails,
    getAllAppointementListById,
    editAppointementDetails
})(AddEditAppointement);
