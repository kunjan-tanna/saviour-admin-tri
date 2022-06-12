
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {
    Form,
    Label
} from 'reactstrap';
import { getAllBulletinListById } from '../../actions/BulletinAction';
import { connect } from 'react-redux';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import queryString from 'query-string'
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

class BulletinDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bulletinData: {},
        }
        this.params = queryString.parse(this.props.location.search)
    }
    componentDidMount = async () => {
        await this.getBulletinDetails();
    }
    getBulletinDetails = async () => {
        let reqData = { bulletin_id: this.params.bulletin_id }
        let usd = await this.props.getAllBulletinListById(reqData);
        console.log('usd  ', usd)
        console.log('getAllBulletinByIdData  ', this.props.getAllBulletinByIdData.data)
        if (this.props.getAllBulletinByIdData && this.props.getAllBulletinByIdData.data) {
            await this.setState({
                bulletinData: this.props.getAllBulletinByIdData.data
            })
        }
    }
    render() {
        const divStyle = {
            padding: "7px 0px 10px 15px",
            margin: "10px",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 0px 3px 2px",
        };
        const spanStyle = {
            margin: "5px 0px 2px 15px",
        }
        const { bulletinData } = this.state;
        return (
            <>
                <Helmet>
                    <title>Bulletin Detail</title>
                    <meta name="description" content="Reactify Widgets" />
                </Helmet>
                <PageTitleBar
                    title={<IntlMessages id={"sidebar.detailBulletin"} />}
                    match={this.props.match}
                />
                <main>
                    <section className="position-relative">
                        <div>
                            <RctCollapsibleCard fullBlock>
                                <div className="table-responsive">
                                    <div className="d-flex justify-content-between tableContent">
                                        <div className="col-sm-12 col-md-12 col-xl-12 carrierReview">
                                            <Form className='addCarrierForm' >
                                                <div className='formWrapper'>
                                                    <div className='info-panel d-flex justify-content-center'><b>Bulletin Info</b></div>

                                                    <div className="detailTable">
                                                        <table>
                                                            <tr>
                                                                <td><Label htmlFor="title"><b> Title: </b></Label></td>
                                                                <td><span className='profileTxt'>&nbsp;{bulletinData.title}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td><Label htmlFor="author_name"><b>Author Name: </b></Label></td>
                                                                <td><span className='profileTxt'>&nbsp;{bulletinData.author_name}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td><Label htmlFor="description"><b>Description : </b></Label></td>
                                                                <td><span className='profileTxt'>&nbsp;{bulletinData.description}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td><Label htmlFor="dot"><b>Image/video : </b></Label></td>
                                                                <td>
                                                                    {bulletinData.image != '' ?
                                                                        <span className='profileTxt'><img className="tag-img" src={bulletinData.image} alt="" title="" />&nbsp;</span> : <span className='profileTxt'><img className="tag-img" src={bulletinData.video} alt="" title="" />&nbsp;</span>
                                                                    }
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td><Label htmlFor="dot"><b>Feed Like  : </b></Label></td>
                                                                <td><span className='profileTxt'>&nbsp;{bulletinData.liked}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td><Label htmlFor="dot"><b>Feed Comment : </b></Label></td>
                                                                <td><span className='profileTxt'>&nbsp;{bulletinData.comments && bulletinData.comments.length ? bulletinData.comments.length : "0"}</span></td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                    <div>
                                                        <div >
                                                            {bulletinData.comments && bulletinData.comments.map((comment1, i) => (
                                                                <div key={i} style={divStyle}>
                                                                    <span>{comment1.commentDate} Ago By {comment1.firstname != '' && comment1.firstname != null ? comment1.firstname : comment1.username}</span>
                                                                    <div style={spanStyle} ><span>{comment1.comment}</span></div>
                                                                </div>

                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Form>
                                        </div>
                                    </div>
                                </div>
                            </RctCollapsibleCard >
                        </div >
                    </section>
                </main>
            </>
        );
    }
}

const mapStateToProps = ({ bulletinReducer }) => {
    const { getAllBulletinByIdData } = bulletinReducer;
    return { getAllBulletinByIdData }
}

export default connect(mapStateToProps, { getAllBulletinListById })(BulletinDetails);
