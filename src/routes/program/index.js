
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
import { getAllProgramList, activeDeactiveProgram, deleteProgram } from '../../actions/ProgramAction';
import { connect } from 'react-redux';
import AppConfig from '../../constants/AppConfig';
// import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Pagination from "react-js-pagination";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import * as common from '../../api/index';
import Modal from 'Components/Model/ChangeLoadStatus';
import moment from 'moment';
import Datetime from 'react-datetime';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';

const CustomTooltip = withStyles((theme) => ({
    tooltip: {
        fontSize: 13,
    }
}))(Tooltip);

class Program extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedProgram: null, // selected user to perform operations
            activePage: 1,
            searchText: '',
            totalProgramCount: 0,
            error: '',
            programData: [],
            limit: AppConfig.PER_PAGE,
            openViewDetailsDialog: false,
            selectedLoadDetails: null,
            load_status: '',
            showModal: false,
            showCustomStatus: false,
            status: '',
            user_id: '',
            status_name: '',
            sortFlag: 'ASC',
            sortBy: ''
        }
        this.props.location.state ? this.state.load_status = this.props.location.state.params.load_status : null
    }
    componentDidMount = async () => {

        await this.getProgramDetails();
    }
    getProgramDetails = async () => {
        let reqData = {
            page_no: this.state.activePage,
            limit: this.state.limit
        }
        this.state.searchText !== '' ? reqData.search = this.state.searchText : null
        this.state.sortFlag !== '' ? reqData.sortFlag = this.state.sortFlag : null
        this.state.sortBy !== '' ? reqData.sortBy = this.state.sortBy : null
        await this.props.getAllProgramList(reqData);

        if (this.props.getProgramDetailsData && this.props.getProgramDetailsData.data) {
            await this.setState({
                programData: this.props.getProgramDetailsData.data,
                totalProgramCount: this.props.getProgramDetailsData.total
            })
            window.history.replaceState(null, '')

        }
        console.log("data===========", this.state)
    }

    handlePageChange = async (pageNumber) => {
        await this.setState({ activePage: pageNumber, });
        this.getProgramDetails()
    }
    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode
            this.getProgramDetails()
        }
    };

    onSearch = (e) => {
        // let reg = /^[a-z\d\-_\s]*$/i;
        // if (reg.test(e.target.value) == true) {
        this.setState({ searchText: e.target.value.trimStart(), activePage: 1 })
        // }
    }
    onDelete(data) {
        this.refs.deleteConfirmationDialog.open();
        this.setState({ selectedProgram: data });
    }

    deleteProgram = async () => {
        let reqData = {
            program_id: this.state.selectedProgram
        }
        await this.props.deleteProgram(reqData)
        this.getProgramDetails()
        this.refs.deleteConfirmationDialog.close();
    }

    toggleStatus = async (e, program_id) => {
        console.log('checked', e.target.checked)
        let reqData = {
            program_id: program_id,
            is_active: e.target.checked ? '0' : '1'
        }
        await this.props.activeDeactiveProgram(reqData)
        this.getProgramDetails()
    }

    onAdd = () => {
        this.props.history.push('/app/program/add-program')
    }





    onToggleSort = async (field) => {
        let sortFlag = '';
        if (this.state.sortFlag == 'ASC') {
            sortFlag = 'DESC'
        } else {
            sortFlag = 'ASC'
        }
        await this.setState({
            sortBy: field,
            sortFlag: sortFlag
        })
        await this.getProgramDetails()
    }
    render() {
        const { classes } = this.props;
        const { loading } = this.props;
        return (
            <div className="listingMain">
                <Helmet>
                    <title>Program</title>
                    <meta name="description" content="Reactify Widgets" />
                </Helmet>
                <PageTitleBar
                    title={<IntlMessages id="sidebar.program" />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <div className="d-flex justify-content-between align-items-center py-10 px-10">
                        <div className='searchInput position-relative'>
                            <i className="ti-search position-absolute"></i>
                            <Input
                                type="text"
                                name="search"
                                id="search-todo"
                                placeholder="Search by Name..."
                                onKeyPress={(e) => this.enterPressed(e)}
                                onChange={(e) => this.onSearch(e)}
                                value={this.state.searchText}
                            />
                        </div>

                        <div>
                            <Button onClick={this.onAdd} color='primary' variant="contained" className="text-white">Create Program</Button>
                        </div>
                    </div>
                    <div className="table-responsive loadTable">
                        <table className="table table-middle table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th className="arrow">Program Name <UnfoldMoreIcon onClick={() => this.onToggleSort('title')} /></th>
                                    <th>Instructor Name</th>
                                    <th>Program Level</th>
                                    <th>Program Duration</th>
                                    <th>Active/Inactive</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.programData && this.state.programData.map((post, key) => (


                                    <tr key={key}>
                                        <td>{post.program_id}</td>
                                        <td>{post.program_name}</td>
                                        <td>{post.instructor_name || 'N/A'}</td>
                                        <td>{(() => {
                                            switch (post.program_level) {
                                                case "1": return "Beginner";
                                                case "2": return "Intermediate ";
                                                case "3": return "High";
                                            }
                                        })()} </td>
                                        <td>{post.program_duration || 'N/A'}</td>
                                        <td className="">
                                            <Switch size='medium'
                                                color={'primary'} checked={post.is_active == "0"} onChange={(e) => this.toggleStatus(e, post.program_id)} />
                                        </td>
                                        <td className="list-action">
                                            <CustomTooltip id="tooltip-fab" title="Feedback">
                                                <Link to={{
                                                    pathname: 'program/feedback',
                                                    search: `?program_id=${post.program_id}`,
                                                }}><i className="ti-write" aria-hidden="true"></i></Link>
                                            </CustomTooltip>
                                            <CustomTooltip id="tooltip-fab" title="Stages">
                                                <Link to={{
                                                    pathname: 'program/stages',
                                                    search: `?program_id=${post.program_id}`,
                                                }}><i className="ti-calendar" aria-hidden="true"></i></Link>
                                            </CustomTooltip>
                                            <CustomTooltip id="tooltip-fab" title="Edit">
                                                <Link to={{
                                                    pathname: 'program/edit-program',
                                                    search: `?program_id=${post.program_id}`,
                                                }}><i className="ti-pencil" aria-hidden="true"></i></Link>
                                            </CustomTooltip>

                                            <CustomTooltip id="tooltip-fab" title="Delete">
                                                <button type="button" className="rct-link-btn" onClick={() => this.onDelete(post.program_id)}><i className="ti-close"></i></button>
                                            </CustomTooltip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {loading &&
                        <RctSectionLoader />
                    }
                    {this.state.programData.length == 0 &&
                        <h2 className="text-center p-3">No records found</h2>
                    }
                </RctCollapsibleCard>
                {this.state.totalProgramCount > 10 ?
                    <Card>
                        <CardBody>
                            <Row className="align-items-center table-bottom">
                                <Col sm="6" md="6">
                                    <p>Showing {this.state.totalProgramCount > 0 ? ((this.state.activePage * AppConfig.PER_PAGE) - AppConfig.PER_PAGE + 1) : 0} to {(AppConfig.PER_PAGE * this.state.activePage) - (AppConfig.PER_PAGE - this.state.programData.length)} of {this.state.totalProgramCount} entries</p>
                                </Col>
                                <Col sm="6" md="6">
                                    <Pagination
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={AppConfig.PER_PAGE}
                                        totalItemsCount={this.state.totalProgramCount}
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
                <Modal showModal={this.state.showModal}
                    load_status={this.state.status}
                    toggleModal={this.toggleModal}
                    changeStatusValueHandler={(e) => this.changeStatusValueHandler(e)}
                    changeLoadStatusReq={this.changeLoadStatusReq}
                    changeFromDateTime={(e) => this.changeFromDateTimeHandler(e)}
                    changeToDateTime={(e) => this.changeToDateTimeHandler(e)}
                    eta_from={this.state.eta_from}
                    eta_to={this.state.eta_to}
                    endDateValidation={(date) => this.endDateValidation(date, this.state.eta_from)}
                    startDateValidation={this.startDateValidation}
                    showCustomStatus={this.state.showCustomStatus}
                    onChangeCustomStatus={this.changeCustomStatusValue}
                    status_name={this.state.status_name}
                />

                <DeleteConfirmationDialog
                    ref="deleteConfirmationDialog"
                    title="Are you sure you want to delete this Program?"
                    onConfirm={() => this.deleteProgram()}
                />
            </div >
        );
    }
}
// map state to props
const mapStateToProps = ({ programReducer }) => {
    const { getProgramDetailsData } = programReducer;
    return { getProgramDetailsData }
}

export default connect(mapStateToProps, {
    getAllProgramList,
    activeDeactiveProgram,
    deleteProgram
})(Program);
