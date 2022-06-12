import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import Button from '@material-ui/core/Button';
import { Redirect, Route, Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Input
} from 'reactstrap';
import { getAllPageList, deletePage, activeDeactivePage } from '../../actions/PageAction';
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


class Pages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLoad: null, // selected user to perform operations
            activePage: 1,
            searchText: '',
            totalUserCount: 0,
            error: '',
            pageData: [],
            limit: AppConfig.PER_PAGE,
            openViewDetailsDialog: false,
            selectedLoadDetails: null,
            load_status: '',
            showModal: false,
            showCustomStatus: false,
            status: '',
            user_id: '',
            eta_from: moment().format("MM/DD/YYYY"),
            eta_to: moment().format("MM/DD/YYYY"),
            status_name: '',
            sortFlag: 'ASC',
            sortBy: ''
        }
        this.props.location.state ? this.state.load_status = this.props.location.state.params.load_status : null
    }
    componentDidMount = async () => {

        await this.getPageDetails();
    }
    getPageDetails = async () => {
        let reqData = {
            page_no: this.state.activePage,
            limit: this.state.limit
        }
        this.state.load_status !== '' ? reqData.load_status = this.state.load_status : null
        this.state.searchText !== '' ? reqData.search = this.state.searchText : null
        this.state.sortFlag !== '' ? reqData.sortFlag = this.state.sortFlag : null
        this.state.sortBy !== '' ? reqData.sortBy = this.state.sortBy : null
        await this.props.getAllPageList(reqData);

        if (this.props.getPageDetailsData && this.props.getPageDetailsData.data) {
            await this.setState({
                pageData: this.props.getPageDetailsData.data,
                totalPageCount: this.props.getPageDetailsData.total
            })
            window.history.replaceState(null, '')

        }
        console.log("data===========", this.state)
    }

    handlePageChange = async (pageNumber) => {
        await this.setState({ activePage: pageNumber, });
        this.getPageDetails()
    }
    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode
            this.getPageDetails()
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
        this.setState({ selectedPage: data });
    }

    deletePage = async () => {
        let reqData = {
            page_id: this.state.selectedPage
        }
        await this.props.deletePage(reqData)
        this.getPageDetails()
        this.refs.deleteConfirmationDialog.close();
    }

    toggleStatus = async (e, user_id) => {
        console.log('checked', e.target.checked)
        let reqData = {
            user_id: user_id,
            is_active: e.target.checked ? '0' : '1'
        }
        await this.props.activeDeactivePage(reqData)
        this.getPageDetails()
    }

    onAdd = () => {
        this.props.history.push('/app/pages/add-page')
    }
    viewPageDetail = async (page) => {
        await this.props.history.push({
            pathname: 'page/edit-page',
            search: `?PageId=${page.page_id}`,
        })
    }
    changeStatusHandler = async (e) => {
        await this.setState({ load_status: e.target.value })
        await this.getPageDetails()
    }

    endDateValidation = (currentDate, startDate) => {
        var yesterday = Datetime.moment(startDate, "MM/DD/YYYY").subtract(1, 'day');
        console.log("yesterdaya", yesterday)
        return currentDate.isAfter(yesterday);
    }
    startDateValidation = () => {
        return moment()
    }
    toggleModal = (id, status, eta_from, eta_to) => {
        if (status != 'Pending Truck Assignment' && status != 'In storage' && status != 'Picked up' && status != 'Shipped' && status != 'In transit' && status != 'Delivered') {
            this.setState({
                showModal: !this.state.showModal,
                status: 'custom',
                status_name: status,
                load_id: id,
                eta_from: eta_from,
                eta_to: eta_to
            })
        } else {
            this.setState({
                showModal: !this.state.showModal,
                status: status,
                load_id: id,
                eta_from: eta_from,
                eta_to: eta_to
            });
        }
    };
    changeStatusValueHandler = (e) => {
        if (e.target.value == 'custom') {
            this.setState({ showCustomStatus: true, status: e.target.value })
        } else {
            this.setState({ status: e.target.value })
        }
    }
    changeFromDateTimeHandler = async (e) => {
        await this.setState({ eta_from: moment(e).format("MM/DD/YYYY") })
        console.log("from dtae", this.state.eta_from)
    }
    changeToDateTimeHandler = async (e) => {
        await this.setState({ eta_to: moment(e).format("MM/DD/YYYY") })
        console.log("to dtae", this.state.eta_to)
    }
    changeCustomStatusValue = (e) => {
        this.setState({ status_name: e.target.value })
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
        await this.getPageDetails()
    }
    render() {
        const { loading } = this.props;
        return (
            <div className="listingMain">
                <Helmet>
                    <title>Pages</title>
                    <meta name="description" content="Reactify Widgets" />
                </Helmet>
                <PageTitleBar
                    title={<IntlMessages id="sidebar.pages" />}
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
                                placeholder="Search by Name"
                                onKeyPress={(e) => this.enterPressed(e)}
                                onChange={(e) => this.onSearch(e)}
                                value={this.state.searchText}
                            />
                        </div>

                        <div>
                            <Button onClick={this.onAdd} color='primary' variant="contained" className="text-white">Create New Page</Button>
                        </div>
                    </div>
                    <div className="table-responsive loadTable">
                        <table className="table table-middle table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th className="arrow">Page Name <UnfoldMoreIcon onClick={() => this.onToggleSort('page_name')} /></th>
                                    <th>Page Url</th>
                                    {/* <th>Status</th> */}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.pageData && this.state.pageData.map((page, key) => (
                                    <tr key={key}>
                                        <td>{page.page_id}</td>
                                        <td>{page.page_name || 'N/A'}</td>
                                        <td>{page.page_url || 'N/A'}</td>
                                        {/* <td className="d-flex justify-content-start">
                                            <Switch size='medium'
                                                color={'primary'} checked={user.is_active == "0"} onChange={(e) => this.toggleStatus(e, user.user_id)} />
                                        </td> */}
                                        <td className="list-action">
                                            {/* <Tooltip id="tooltip-fab" title="View">
                                                <Link to={{
                                                    pathname: 'page-details',
                                                    search: `?page_id=${page.page_id}`,
                                                }}><i className="ti-eye" aria-hidden="true"></i></Link>
                                            </Tooltip> */}
                                            <Tooltip id="tooltip-fab" title="Edit">
                                                <Link to={{
                                                    pathname: 'pages/edit-page',
                                                    search: `?page_id=${page.page_id}`,
                                                }}><i className="ti-pencil" aria-hidden="true"></i></Link>
                                            </Tooltip>

                                            <Tooltip id="tooltip-fab" title="Delete">
                                                <button type="button" className="rct-link-btn" onClick={() => this.onDelete(page.page_id)}><i className="ti-close"></i></button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {loading &&
                        <RctSectionLoader />
                    }
                    {this.state.pageData.length == 0 &&
                        <h2 className="text-center p-3">No records found</h2>
                    }
                </RctCollapsibleCard>
                {this.state.totalPageCount > 10 ?
                    <Card>
                        <CardBody>
                            <Row className="align-items-center table-bottom">
                                <Col sm="6" md="6">
                                    <p>Showing {this.state.totalPageCount > 0 ? ((this.state.activePage * AppConfig.PER_PAGE) - AppConfig.PER_PAGE + 1) : 0} to {(AppConfig.PER_PAGE * this.state.activePage) - (AppConfig.PER_PAGE - this.state.pageData.length)} of {this.state.totalPageCount} entries</p>
                                </Col>
                                <Col sm="6" md="6">
                                    <Pagination
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={AppConfig.PER_PAGE}
                                        totalItemsCount={this.state.totalPageCount}
                                        pageRangeDisplayed={AppConfig.PAGE_RANGE}
                                        itemClass='page-item'
                                        linkClass='page-link'
                                        onChange={this.handlePageChange}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    :
                    ''
                }
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
                    title="Are you sure you want to delete this page?"
                    onConfirm={() => this.deletePage()}
                />
            </div >
        );
    }
}
// map state to props
const mapStateToProps = ({ pageReducer }) => {
    const { getPageDetailsData, activeDeactivePageData } = pageReducer;
    return { getPageDetailsData, activeDeactivePageData }
}


export default connect(mapStateToProps, {
    getAllPageList,
    deletePage,
    activeDeactivePage
})(Pages);
