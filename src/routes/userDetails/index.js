import React, { Component } from "react";
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
  Label,
} from "reactstrap";
import { getAllUserListById } from "../../actions/UsersAction";
import { connect } from "react-redux";
import Images from "../../assets/images";
import Modal from "Components/Model/ChangeLoadStatus";
import ETAModal from "Components/Model/ChangeEta";
import SignModal from "Components/Model/TermsEsign";
import queryString from "query-string";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Rating from "react-rating";
import * as common from "../../api/index";
import moment from "moment";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Datetime from "react-datetime";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";

function TabContainer({ children }) {
  return <Typography component="div">{children}</Typography>;
}
let doc = [];
let file = [];
class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      imageData: [],
      docNames: [],
      showModal: false,
      showEtaModal: false,
      load_status: "",
      status_name: "",
      images: [],
      showSignButton: true,
      showSignModal: false,
    };
    this.params = queryString.parse(this.props.location.search);
    // console.log("paramnssss", this.params);
  }
  componentDidMount = async () => {
    await this.getUserDetails();
  };

  getUserDetails = async () => {
    let reqData = { user_id: this.params.user_id };
    console.log("getUserDetails", reqData);
    let usd = await this.props.getAllUserListById(reqData);
    // console.log("usd  ", usd);
    // console.log("getAllUserByIdData  ", this.props.getAllUserByIdData.data);
    if (this.props.getAllUserByIdData && this.props.getAllUserByIdData.data) {
      await this.setState({
        userData: this.props.getAllUserByIdData.data,
      });
    }
  };

  fileSelectHandler = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("e target files===========", e.target.files[0].name);
      console.log("e.target.files[0].type", e.target.files[0].type);
      let doc = this.state.docNames.slice();
      let file = this.state.documents.slice();
      for (let i = 0; i < e.target.files.length; i++) {
        if (
          e.target.files[i].type === "image/jpg" ||
          e.target.files[i].type === "image/jpeg" ||
          e.target.files[i].type === "image/png"
        ) {
          let reader = new FileReader();
          reader.onload = (e) => {
            let images = this.state.images.slice();
            images.push(e.target.result);
            this.setState({ images: images });
          };
          reader.readAsDataURL(e.target.files[i]);
        } else {
          // docName = e.target.files[i].name;
          doc.push(e.target.files[i].name);
        }
        // doc.push(e.target.files[i].name);
        file.push(e.target.files[i]);
      }
      this.setState({ docNames: doc, documents: file });
    }
  };

  render() {
    const { userData } = this.state;
    console.log("\n\n\n state", userData);
    return (
      <>
        <main>
          <section className="position-relative">
            <div>
              <RctCollapsibleCard fullBlock>
                <div className="table-responsive">
                  <div className="d-flex justify-content-between tableContent">
                    <div className="col-sm-12 col-md-12 col-xl-12 carrierReview">
                      <Form className="addCarrierForm">
                        <div className="formWrapper">
                          <div className="info-panel d-flex justify-content-center">
                            <b>User Info</b>
                          </div>

                          <div className="detailTable">
                            <table>
                              <tr>
                                <td>
                                  <Label htmlFor="firstName">
                                    <b> First Name : </b>
                                  </Label>
                                </td>
                                <td>
                                  <span className="profileTxt">
                                    &nbsp;{userData.firstName}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <Label htmlFor="lastName">
                                    <b>Last Name : </b>
                                  </Label>
                                </td>
                                <td>
                                  <span className="profileTxt">
                                    &nbsp;{userData.lastName}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <Label htmlFor="email">
                                    <b>Email : </b>
                                  </Label>
                                </td>
                                <td>
                                  <span className="profileTxt">
                                    &nbsp;{userData.email}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <Label htmlFor="dot">
                                    <b>Profile Picture : </b>
                                  </Label>
                                </td>
                                <td>
                                  <span className="profileTxt">
                                    <img
                                      className="tag-img"
                                      src={userData.profile_pic}
                                      alt=""
                                      title=""
                                    />
                                    &nbsp;
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td></td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </RctCollapsibleCard>
            </div>
          </section>
        </main>
      </>
    );
  }
}
// map state to props
const mapStateToProps = ({ userReducer }) => {
  const { getAllUserByIdData } = userReducer;
  return { getAllUserByIdData };
};

export default connect(mapStateToProps, {
  getAllUserListById,
})(UserDetails);
