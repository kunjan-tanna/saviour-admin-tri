
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
import {getAllBlogPostListById} from '../../actions/BlogPostAction';
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
class BlogPostDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogPostData: {},
    
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
        await this.getBlogPostDetails();
    }



    getBlogPostDetails = async () => {
        let reqData = { blog_post_id: this.params.blog_post_id }
        console.log('getBlogPostDetails',reqData)
        let usd = await this.props.getAllBlogPostListById(reqData);
        console.log('usd  ',usd)
        console.log('getAllBlogPostByIdData  ',this.props.getAllBlogPostByIdData.data )
        if (this.props.getAllBlogPostByIdData && this.props.getAllBlogPostByIdData.data) {
            await this.setState({
                blogPostData: this.props.getAllBlogPostByIdData.data
            })
        }
       
    }




    render() {
        const divStyle = {
            padding: "7px 0px 10px 15px",
            margin: "20px 0",
            'box-shadow': "0 1px 6px #b7b7b7",
            'border-radius': "5px",
          };
        const spanStyle= {
            margin: "5px 0px 2px 15px",
        }

        
      
        const { blogPostData } = this.state;
        console.log('\n\n\n state', blogPostData);
        return (
            <>
              <Helmet>
                    <title>Blog Post Detail</title>
                    <meta name="description" content="Reactify Widgets" />
                </Helmet>
                <PageTitleBar
                    title={<IntlMessages id={"sidebar.detailBlogPost"} />}
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
                                                <div className='info-panel d-flex justify-content-center'><b>Blog Post Info</b></div>
                                                <div className="detailTable">
                                                    <table>
                                                        <tr>
                                                            <td><Label htmlFor="title"><b> Title: </b></Label></td>
                                                            <td><span className='profileTxt'>&nbsp;{blogPostData.title}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td><Label htmlFor="author_name"><b>Author Name: </b></Label></td>
                                                            <td><span className='profileTxt'>&nbsp;{blogPostData.author_name}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td><Label htmlFor="description"><b>Description : </b></Label></td>
                                                            <td><span className='profileTxt'>&nbsp;{blogPostData.description}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td><Label htmlFor="dot"><b>Image/Video : </b></Label></td>
                                                            <td>
                                                            {blogPostData.image != ''?
                                                                <span className='profileTxt'><img className="tag-img" src={blogPostData.image} alt="" title="" />&nbsp;</span> : <span className='profileTxt'><video  className="tag-video"  controls><source src={blogPostData.video} /></video>&nbsp;</span>
                                                            }

                                                            {/* <span className='profileTxt'><img className="tag-img" src={blogPostData.profile_pic} alt="" title="" />&nbsp;</span> */}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><Label htmlFor="dot"><b>Feed Like  : </b></Label></td>
                                                            <td><span className='profileTxt'>&nbsp;{blogPostData.liked}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td><Label htmlFor="dot"><b>Feed Comment : </b></Label></td>
                                                            <td><span className='profileTxt'>&nbsp;{blogPostData.commentcount}</span></td>
                                                        </tr>
                                                    </table>
                                                </div>                                                
                                                
                                                <div>
                                                    
                                                    
                                                    
                                                    <div >
                                                    {blogPostData.comments  && blogPostData.comments.map((comment1, i) =>(
                                                        
                                                         <div style={divStyle}>
                                                             
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
// map state to props
const mapStateToProps = ({ blogPostReducer }) => {
    const { getAllBlogPostByIdData} = blogPostReducer;
    return {getAllBlogPostByIdData}
}

export default connect(mapStateToProps, {
    getAllBlogPostListById
})(BlogPostDetails);
