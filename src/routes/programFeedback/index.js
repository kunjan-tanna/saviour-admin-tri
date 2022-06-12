
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    FormGroup,
    Input,
    Form,
    Label
} from 'reactstrap';
import { getAllProgramFeedback } from '../../actions/ProgramAction';
import { connect } from 'react-redux';
import Images from '../../assets/images';
import Modal from 'Components/Model/ChangeLoadStatus';
import ETAModal from 'Components/Model/ChangeEta';
import SignModal from 'Components/Model/TermsEsign'
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import queryString from 'query-string'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

function TabContainer({ children }) {
    return (
        <Typography component="div" >
            {children}
        </Typography>
    );
}
class ProgramFeedback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            endFeedbackData: [],
            leaveFeedbackData: [],
            imageData: [],
            docNames: [],
            showModal: false,
            showEtaModal: false,
            load_status: '',
            status_name: '',
            images: [],
            showSignButton: true,
            showSignModal: false,
            activeIndex: 0,
        }
        this.params = queryString.parse(this.props.location.search)
        console.log("paramnssss", this.params)
    }
    componentDidMount = async () => {
        console.log("paramnssss", this.params)
        await this.getBlogPostDetails();
    }

    getBlogPostDetails = async () => {
        let reqData = { program_id: this.params.program_id, page_no: 1, limit: 10 }
        console.log('getBlogPostDetails', reqData)
        let usd = await this.props.getAllProgramFeedback(reqData);
        console.log('usd  ', usd)
        if (this.props.getProgramFeedback && this.props.getProgramFeedback.data) {
            await this.setState({
                endFeedbackData: this.props.getProgramFeedback.data.end_feedback.data,
                leaveFeedbackData: this.props.getProgramFeedback.data.leave_feedback.data
            })
        }
    }
    handleChange = async (event, value) => {
        this.setState({ activeIndex: value });
        console.log("value================", value)
    }
    feedbackDataCard = (feedbackData) => {
        const divStyle = {
            padding: "7px 0px 10px 15px",
            margin: "20px 0px",
            boxShadow: "rgb(183 183 183) 0px 1px 6px",
            borderRadius: "5px",
        };
        const spanStyle = {
            margin: "5px 0px 2px 15px",
        }
        return (
            <div className='formWrapper'>
                <div>
                    {feedbackData && feedbackData.length > 0 ?
                        <div >
                            {feedbackData && feedbackData.map((feedback, i) => (
                                <div key={i} style={divStyle}>
                                    <span><b>Feelings : </b>
                                        {feedback.feelings == 1 ? <span>😃</span> : (feedback.feelings == 2 ? <span>🙂</span> : (feedback.feelings == 3 ? <span>😐</span> : (feedback.feelings == 4 ? <span>😔</span> : <span>😩</span>)))}
                                    </span>
                                    <br />
                                    <span><b>Feedback : </b> {feedback.feedback}</span><br />
                                    <span><b>UserName : </b> {feedback.firstName + ' ' + feedback.lastName}</span><br />
                                    <span><b>Date : </b> {feedback.created_date}</span>
                                </div>
                            ))}
                        </div> : <span>No Records Found</span>
                    }
                </div>
            </div>
        )
    }
    render() {
        const { endFeedbackData, leaveFeedbackData, activeIndex } = this.state;
        return (
            <>
                <Helmet>
                    <title>Program Feedback</title>
                    <meta name="description" content="Reactify Widgets" />
                </Helmet>
                <PageTitleBar
                    title={<IntlMessages id={"sidebar.programFeedback"} />}
                    match={this.props.match}
                />
                <main>
                    <section className="position-relative">
                        <div>
                            <RctCollapsibleCard fullBlock>
                                <AppBar position="static" color="#ccc">
                                    <Tabs style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }} TabIndicatorProps={{
                                        style: {
                                            backgroundColor: "#2D7CBF",
                                        }
                                    }} value={activeIndex}
                                        onChange={(e, value) => this.handleChange(e, value)}>
                                        <Tab label={<span className='tab-img'><span className={activeIndex === 0 ? 'ml-2 active-tab-txt tab-txt' : 'ml-2 tab-txt'}>End Feedback</span></span>} />
                                        <Tab label={<span className='tab-img'><span className={activeIndex === 1 ? 'ml-2 active-tab-txt tab-txt' : 'ml-2 tab-txt'}>Leave Feedback</span></span>} />
                                    </Tabs>
                                </AppBar>
                                {activeIndex === 0 && <TabContainer>{this.feedbackDataCard(endFeedbackData)}</TabContainer>}
                                {activeIndex === 1 && <TabContainer>{this.feedbackDataCard(leaveFeedbackData)}</TabContainer>}
                            </RctCollapsibleCard >
                        </div >
                    </section>
                </main>


            </>
        );
    }
}
// map state to props
const mapStateToProps = ({ programReducer }) => {
    const { getProgramFeedback } = programReducer;
    return { getProgramFeedback }
}

export default connect(mapStateToProps, {
    getAllProgramFeedback
})(ProgramFeedback);
