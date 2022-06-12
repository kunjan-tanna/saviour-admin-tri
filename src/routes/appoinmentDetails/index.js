
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import Tooltip from '@material-ui/core/Tooltip';
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
import {getAllAppointementList} from '../../actions/AppointementAction';
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

function TabContainer({ children }) {
    return (
        <Typography component="div" >
            {children}
        </Typography>
    );
}
let doc = []
let file = []
class AppoinmentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValues: {
                appointment_name: '',
                appointement_video: '',
                appointment_description:'',
            },
            programData: {},
            appointementData: {},
            videoNames:'',
            video:'',
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
        }
        this.params = queryString.parse(this.props.location.search)
        console.log("paramnssss", this.params)
    }
    componentDidMount = async () => {
        console.log("paramnssss", this.params)
        await this.getAppointementDetails();
    }



    getAppointementDetails = async () => {
        let reqData = { program_id: this.params.program_id }
        console.log('getProgramDetails',reqData)
        let getAllAppointementList = await this.props.getAllAppointementList(reqData);
        console.log('getAllAppointementLists  ',this.props.getAppointementDetailsData.data)
        if (this.props.getAppointementDetailsData && this.props.getAppointementDetailsData.data) {
            await this.setState({
                appointementData: this.props.getAppointementDetailsData.data
            })
        }
       
    }

    onAdd = () => {
        console.log('program_idddddddd',this.params.program_id)
        this.props.history.push(`/app/appointement/add-appointement?program_id=${this.params.program_id} `)
    }
    

    onEdit= (id) => {
        console.log('edit id',id)
    }


    render() {
        const divStyle = {
            float: 'right',
            padding: "0px 0px 0px 40px",
            margin: "-50px 1px -46px 1px",
          };
        
          
        const { appointementData } = this.state;
        console.log('\n\n\n state', appointementData);
        return (
      
                <div className="addCarrierMain">
                    <Helmet>
                        <title>{this.params.program_id ? "Appointement Detail" : "Appointement Detail"}</title>
                        <meta name="description" content="Reactify Widgets" />
                    </Helmet>
                    <PageTitleBar
                        title={<IntlMessages id={this.params.program_id ? "sidebar.appointementDetail" : "sidebar.appointementDetail"} />}
                        match={this.props.match}
                    />
                    <div className="addCarrierMain">
                            <Button onClick={this.onAdd} color='primary' variant="contained" className="text-white">Create Appointement</Button>
                    </div>
                    <br/>
                    <div></div>

        
            <section className="position-relative">
             <div>
                <RctCollapsibleCard fullBlock>
                    <div className="table-responsive">
                        <div className="d-flex justify-content-between border-bottom tableContent">
                            <div className="col-sm-12 col-md-12 col-xl-12 carrierReview">
                            <div className='info-panel d-flex justify-content-center'><b>Appointement Info</b></div>
                            {
                                this.state.appointementData.length > 0 && this.state.appointementData.map((appointement, i) =>
                                        <Form className='addCarrierForm' >
                                            
                                            <div className='formWrapper'>
                                                
                                               

                                                <div>
                                                    <Label htmlFor="firstName"><b> Appointement Name : </b></Label>
                                                    <span className='profileTxt'>&nbsp;{appointement.appointement_name}</span>
                                                </div>
                                             
                                                <div>
                                                    <Label htmlFor="firstName"><b> Appointement Description : </b></Label>
                                                    <span className='profileTxt'>&nbsp;{appointement.appointement_description}</span>
                                                </div>

                                                
                                                <div>
                                                    <Label htmlFor="dot"><b>Appointement Video : </b></Label>
                                                        <video  className="tag-video"  controls>
                                                                    <source src={appointement.appointement_video} />
                                                        </video>
                                                   
                                                </div>
                                                <Tooltip id="tooltip-fab" title="Edit" style={divStyle}>
                                                    <Link to={{
                                                        pathname: 'appointement/edit-appointement',
                                                        search: `?appointement_id=${appointement.program_appointment_id}`,
                                                    }}><i className="ti-pencil" aria-hidden="true"></i></Link>
                                                </Tooltip>

                                                {/* <div className="col-sm-2 " style={divStyle}>
                                                    <Button onClick={this.onEdit(appointement.program_appointment_id)} color='primary' variant="contained" className="text-white">Edit Appointement</Button>
                                                </div> */}
                                                
   
    
                                            </div>

                                        </Form>
                                         )}
                            </div>
                        </div>
                    </div>
                </RctCollapsibleCard >
            </div >
            </section>
            
             
                </div >
            

        );
    }
}
// map state to props
const mapStateToProps = ({ appointementReducer }) => {
    const { getAppointementDetailsData} = appointementReducer;
    return {getAppointementDetailsData}
}

export default connect(mapStateToProps, {
    getAllAppointementList
})(AppoinmentDetails);
