
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
import { getAllBulletinList, activeDeactiveBulletin, deleteBulletin } from '../../actions/BulletinAction';
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


class Bulletin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBulletin: null, // selected user to perform operations
            activePage: 1,
            searchText: '',
            totalBulletinCount: 0,
            error: '',
            bulletinData: [],
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

        await this.getBulletinDetails();
    }
    getBulletinDetails = async () => {
        let reqData = {
            page_no: this.state.activePage,
            limit: this.state.limit
        }
        this.state.searchText !== '' ? reqData.search = this.state.searchText : null
        this.state.sortFlag !== '' ? reqData.sortFlag = this.state.sortFlag : null
        this.state.sortBy !== '' ? reqData.sortBy = this.state.sortBy : null
        await this.props.getAllBulletinList(reqData);

        if (this.props.getBulletinDetailsData && this.props.getBulletinDetailsData.data) {
            console.log('getBulletinDetailsData data', this.props.getBulletinDetailsData)
            await this.setState({
                bulletinData: this.props.getBulletinDetailsData.data,
                totalBulletinCount: this.props.getBulletinDetailsData.total
            })
            window.history.replaceState(null, '')

        }
        console.log("data===========", this.state)
    }

    handlePageChange = async (pageNumber) => {
        await this.setState({ activePage: pageNumber, });
        this.getBulletinDetails()
    }
    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode
            this.getBulletinDetails()
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
        this.setState({ selectedBulletin: data });
    }

    deleteBulletin = async () => {
        let reqData = {
            bulletin_id: this.state.selectedBulletin
        }
        await this.props.deleteBulletin(reqData)
        this.getBulletinDetails()
        this.refs.deleteConfirmationDialog.close();
    }

    toggleStatus = async (e, bulletin_id) => {
        console.log('checked', e.target.checked)
        let reqData = {
            bulletin_id: bulletin_id,
            is_active: e.target.checked ? '0' : '1'
        }
        await this.props.activeDeactiveBulletin(reqData)
        this.getBulletinDetails()
    }

    onAdd = () => {
        this.props.history.push('/app/bulletin/add-bulletin')
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
        await this.getBulletinDetails()
    }
    render() {
        const { loading } = this.props;
        return (
            <div className="listingMain">
                <Helmet>
                    <title>Bulletin</title>
                    <meta name="description" content="Reactify Widgets" />
                </Helmet>
                <PageTitleBar
                    title={<IntlMessages id="sidebar.bulletin" />}
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
                                placeholder="Search by Title,Author Name..."
                                onKeyPress={(e) => this.enterPressed(e)}
                                onChange={(e) => this.onSearch(e)}
                                value={this.state.searchText}
                            />
                        </div>

                        <div>
                            <Button onClick={this.onAdd} color='primary' variant="contained" className="text-white">Create Bulletin</Button>
                        </div>
                    </div>
                    <div className="table-responsive loadTable">
                        <table className="table table-middle table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th className="arrow">Title <UnfoldMoreIcon onClick={() => this.onToggleSort('title')} /></th>
                                    <th>Author Name</th>
                                    <th>Description</th>
                                    <th>Active/Inactive</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.bulletinData && this.state.bulletinData.map((post, key) => (
                                    <tr key={key}>
                                        <td>{post.bulletin_id}</td>
                                        <td>{post.title}</td>
                                        <td>{post.author_name || 'N/A'}</td>
                                        <td className="ellipsis">{post.description || 'N/A'}</td>
                                        <td className="">
                                            <Switch size='medium'
                                                color={'primary'} checked={post.is_active == "0"} onChange={(e) => this.toggleStatus(e, post.bulletin_id)} />
                                        </td>
                                        <td className="list-action">
                                            <Tooltip id="tooltip-fab" title="View">
                                                <Link to={{
                                                    pathname: 'bulletin/bulletin-details',
                                                    search: `?bulletin_id=${post.bulletin_id}`,
                                                }}><i className="ti-eye" aria-hidden="true"></i></Link>
                                            </Tooltip>
                                            <Tooltip id="tooltip-fab" title="Edit">
                                                <Link to={{
                                                    pathname: 'bulletin/edit-bulletin',
                                                    search: `?bulletin_id=${post.bulletin_id}`,
                                                }}><i className="ti-pencil" aria-hidden="true"></i></Link>
                                            </Tooltip>

                                            <Tooltip id="tooltip-fab" title="Delete">
                                                <button type="button" className="rct-link-btn" onClick={() => this.onDelete(post.bulletin_id)}><i className="ti-close"></i></button>
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
                    {this.state.bulletinData.length == 0 &&
                        <h2 className="text-center p-3">No records found</h2>
                    }
                </RctCollapsibleCard>
                {this.state.totalBulletinCount > 10 ?
                    <Card>
                        <CardBody>
                            <Row className="align-items-center table-bottom">
                                <Col sm="6" md="6">
                                    <p>Showing {this.state.totalBulletinCount > 0 ? ((this.state.activePage * AppConfig.PER_PAGE) - AppConfig.PER_PAGE + 1) : 0} to {(AppConfig.PER_PAGE * this.state.activePage) - (AppConfig.PER_PAGE - this.state.bulletinData.length)} of {this.state.totalBulletinCount} entries</p>
                                </Col>
                                <Col sm="6" md="6">
                                    <Pagination
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={AppConfig.PER_PAGE}
                                        totalItemsCount={this.state.totalBulletinCount}
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
                    title="Are you sure you want to delete this Bulletin?"
                    onConfirm={() => this.deleteBulletin()}
                />
            </div >
        );
    }
}
// map state to props
const mapStateToProps = ({ bulletinReducer }) => {
    const { getBulletinDetailsData } = bulletinReducer;
    return { getBulletinDetailsData }
}

export default connect(mapStateToProps, {
    getAllBulletinList,
    activeDeactiveBulletin,
    deleteBulletin
})(Bulletin);
