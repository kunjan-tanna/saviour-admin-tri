
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import Button from '@material-ui/core/Button';
import { Redirect, Route, Link } from 'react-router-dom';
import { Switch, Tooltip, withStyles } from '@material-ui/core';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Input
} from 'reactstrap';
import { getAllUserFeedback } from '../../actions/FeedbackSupportAction';
import { connect } from 'react-redux';
import AppConfig from '../../constants/AppConfig';
// import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Pagination from "react-js-pagination";
import Modal from 'Components/Model/ChangeLoadStatus';
import moment from 'moment';

class FeedbackSupport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedProgram: null, // selected user to perform operations
            activePage: 1,
            searchText: '',
            totalFeedbackCount: 0,
            error: '',
            feedbackData: [],
            limit: AppConfig.PER_PAGE,
            openViewDetailsDialog: false,
            selectedLoadDetails: null,
            load_status: '',
            showModal: false,
            showCustomStatus: false,
            status: '',
            user_id: '',
            status_name: '',
        }
    }
    componentDidMount = async () => {
        await this.getAllUserFeedback();
    }
    getAllUserFeedback = async () => {
        let reqData = {
            page_no: this.state.activePage,
            limit: this.state.limit
        }
        await this.props.getAllUserFeedback(reqData);
        console.log("data===========", this.props.getAllUserFeedbackData)
        if (this.props.getAllUserFeedbackData && this.props.getAllUserFeedbackData.data) {
            await this.setState({
                feedbackData: this.props.getAllUserFeedbackData.data,
                totalFeedbackCount: this.props.getAllUserFeedbackData.total
            })
            window.history.replaceState(null, '')
        }
    }

    handlePageChange = async (pageNumber) => {
        await this.setState({ activePage: pageNumber, });
        this.getAllUserFeedback()
    }
    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode
            this.getAllUserFeedback()
        }
    };

    render() {
        const { loading } = this.props;
        return (
            <div className="listingMain">
                <Helmet>
                    <title>Feedback and Support</title>
                    <meta name="description" content="Reactify Widgets" />
                </Helmet>
                <PageTitleBar
                    title={<IntlMessages id="sidebar.support_feedback" />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <div className="table-responsive loadTable">
                        <table className="table table-middle table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th className="arrow">User Id</th>
                                    <th>User Profile Pic</th>
                                    <th>Email</th>
                                    <th>Feedback</th>
                                    <th>Feedback Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.feedbackData && this.state.feedbackData.map((post, key) => (
                                    <tr key={key}>
                                        <td>{post.feedback_id}</td>
                                        <td>{post.user_id}</td>
                                        <td><img src={post.profile_pic} alt='profile_pic' className='profile_img' /></td>
                                        <td>{post.email}</td>
                                        <td>{post.feedback}</td>
                                        <td>{moment.unix(post.created_date).format("DD MMM YYYY hh:mm a") || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {loading &&
                        <RctSectionLoader />
                    }
                    {this.state.feedbackData.length == 0 &&
                        <h2 className="text-center p-3">No records found</h2>
                    }
                </RctCollapsibleCard>
                {this.state.totalFeedbackCount > 10 ?
                    <Card>
                        <CardBody>
                            <Row className="align-items-center table-bottom">
                                <Col sm="6" md="6">
                                    <p>Showing {this.state.totalFeedbackCount > 0 ? ((this.state.activePage * AppConfig.PER_PAGE) - AppConfig.PER_PAGE + 1) : 0} to {(AppConfig.PER_PAGE * this.state.activePage) - (AppConfig.PER_PAGE - this.state.feedbackData.length)} of {this.state.totalFeedbackCount} entries</p>
                                </Col>
                                <Col sm="6" md="6">
                                    <Pagination
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={AppConfig.PER_PAGE}
                                        totalItemsCount={this.state.totalFeedbackCount}
                                        pageRangeDisplayed={AppConfig.PAGE_RANGE}
                                        itemClass='page-item'
                                        linkClass='page-link'
                                        onChange={this.handlePageChange}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    : ''}
            </div >
        );
    }
}
// map state to props
const mapStateToProps = ({ FeedbackSupportReducer }) => {
    const { getAllUserFeedbackData } = FeedbackSupportReducer;
    return { getAllUserFeedbackData }
}

export default connect(mapStateToProps, {
    getAllUserFeedback
})(FeedbackSupport);
