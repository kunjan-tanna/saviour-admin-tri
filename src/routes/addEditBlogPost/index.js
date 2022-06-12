import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import joi from "joi-browser";

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
} from "reactstrap";

import {
  addBlogPostDetails,
  getAllBlogPostListById,
  editBlogPostDetails,
} from "../../actions/BlogPostAction";
import { connect } from "react-redux";
import AppConfig from "../../constants/AppConfig";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import IntlMessages from "Util/IntlMessages";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import Tooltip from "@material-ui/core/Tooltip";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import Select from "react-select";
import * as common from "../../api/index";
import Images from "../../assets/images";
import NumberFormat from "react-number-format";
import queryString from "query-string";
import { convertSecondToTime } from "Helpers/helpers";

let doc = [];
let file = [];
let videoThumb;
let videoImg;
let videos = [];
let videoDuration;
class AddEditBlogPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        title: "",
        author_name: "",
        description: "",
      },
      error: "",
      errorField: "",
      idocuments: [],
      vdocuments: [],
      ImageNames: [],
      videoNames: [],
      showForm: false,
      showModal: false,
      images: [],
      videos: [],
    };
    this.params = queryString.parse(this.props.location.search);
  }
  async componentDidMount() {
    if (this.params.blog_post_id) {
      await this.getBlogPostDetails();
    }
  }
  getBlogPostDetails = async () => {
    let reqData = { blog_post_id: this.params.blog_post_id };
    let blog = await this.props.getAllBlogPostListById(reqData);
    if (
      this.props.getAllBlogPostByIdData &&
      this.props.getAllBlogPostByIdData.data
    ) {
      let blogPostData = this.props.getAllBlogPostByIdData.data;
      console.log("blogPostData==========", blogPostData);
      let formData = {
        title: blogPostData.title,
        author_name: blogPostData.author_name,
        description: blogPostData.description,
      };
      console.log("formData==========", formData);
      let doc = blogPostData.image !== "" ? blogPostData.image.split(",") : [];
      console.log("doc=============", doc);
      let documents = this.state.idocuments;
      let videos = this.state.vdocuments;
      let docnames = [];
      doc.length > 0 &&
        doc.map((d) => {
          if (d.includes("jpg") || d.includes("jpeg") || d.includes("png")) {
            let imgs = this.state.images.slice();
            imgs.push(d);
            this.setState({ images: imgs, idocuments: imgs });
          } else {
            docnames.push(d.split("/").pop().split("?")[0]);
          }
          console.log("d.split", d.split("/").pop().split("?")[0]);
        });
      let vid = blogPostData.video !== "" ? blogPostData.video.split(",") : [];
      vid.length > 0 &&
        vid.map((d) => {
          let imgs = this.state.videos.slice();
          imgs.push(d);
          this.setState({ videos: imgs, vdocuments: imgs });
        });
      await this.setState({
        formValues: formData,
        // docNames: docnames,
        // documents: doc,
        // customer_id: loadData.customer_id,
        // load_status: loadData.load_status
      });
    }
  };
  changeValuesHandler = async (e) => {
    console.log("state", this.state.formValues);
    var formValues = this.state.formValues;
    var name = e.target.name;
    formValues[name] = e.target.value.replace(/^\s+/g, "");

    this.setState({ formValues: formValues });
    console.log("state", this.state.formValues);
  };

  editBlogPostHandler = async () => {
    let myData = { ...this.state.formValues };

    this.validateFormData(myData, true);
  };
  addBlogPostHandler = async () => {
    let myData = { ...this.state.formValues };

    console.log("mydata", myData);
    this.validateFormData(myData);
  };

  validateFormData = (body, isOnEdit) => {
    console.log("body========", body);
    isOnEdit ? (body.blog_post_id = +this.params.blog_post_id) : null;
    let schema = joi.object().keys({
      title: joi.string().trim().required(),
      author_name: joi.string().trim().optional().allow("").allow(null),
      description: joi.string().trim().required(),
      // image: joi.string().trim().required(),
      // video: joi.string().trim().required()
    });
    let documents = this.state.idocuments;
    let videos = this.state.vdocuments;
    console.log("documentsdocuments", documents);
    console.log("videosvideosvideos", videos);
    if (documents.length < 1) {
      schema = schema.append({
        image: joi.string().trim().required(),
      });
    }

    if (isOnEdit) {
      schema = schema.append({
        blog_post_id: joi.number().required(),
      });
    }

    console.log(body, schema);
    joi.validate(body, schema, (error, value) => {
      if (error) {
        if (
          error.details[0].message !== this.state.error ||
          error.details[0].context.key !== this.state.errorField
        ) {
          let errorLog = common.validateSchema(error);
          this.setState({
            error: errorLog.error,
            errorField: errorLog.errorField,
          });
        }
      } else {
        this.setState({ error: "", errorField: "" }, () => {
          isOnEdit
            ? this.addEditBlogPostReq(body, true)
            : this.addEditBlogPostReq(body);
        });
      }
    });
  };
  addEditBlogPostReq = async (body, isOnEdit) => {
    console.log("addEditBlogPostReq Body", body);
    let blog_post_id = localStorage.getItem("blog_post_id");

    let formData = new FormData();
    let documents = this.state.idocuments;
    let videos = this.state.vdocuments;
    if (documents.length > 0) {
      for (let doc of documents) {
        formData.append("image", doc);
      }
    }
    if (videos.length > 0) {
      for (let doc of videos) {
        formData.append("video", doc);
        formData.append("videoImg", videoThumb);
      }
    }

    formData.append("title", body.title);
    formData.append("author_name", body.author_name);
    formData.append("description", body.description);
    isOnEdit ? formData.append("blog_post_id", body.blog_post_id) : null;
    if (isOnEdit) {
      await this.props.editBlogPostDetails(formData);
      console.log(
        "editBlogPostDetailsData",
        this.props.editBlogPostDetailsData.message
      );
      if (
        this.props.editBlogPostDetailsData &&
        this.props.editBlogPostDetailsData.code === 1
      ) {
        common.displayLog(1, this.props.editBlogPostDetailsData.message);
        this.props.history.push("/app/blog-post");
      }
    } else {
      await this.props.addBlogPostDetails(formData);
      console.log(
        "this.props.addBlogPostDetailsData",
        this.props.addBlogPostDetailsData
      );
      if (
        this.props.addBlogPostDetailsData &&
        this.props.addBlogPostDetailsData.code === 1
      ) {
        common.displayLog(1, this.props.addBlogPostDetailsData.message);
        this.props.history.push("/app/blog-post");
      }
    }
  };

  enterPressed = async (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
    }
  };
  goBack = async () => {
    await this.props.history.push("/app/blog-post");
  };
  imageSelectHandler = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("e target files===========", e.target.files[0].name);
      console.log("e.target.files[0].type", e.target.files[0].type);

      let doc = this.state.ImageNames.slice();
      let file = this.state.idocuments.slice();
      let images = this.state.images.slice();
      if (file.length >= 1) {
        alert("Please select first image Remove");
        return false;
      }
      if (images.length >= 1) {
        alert("Please select first image Remove");
        return false;
      }
      for (let i = 0; i < e.target.files.length; i++) {
        // if (e.target.files[i].type === 'application/msword' || e.target.files[i].type === 'application/vnd.ms-excel' || e.target.files[i].type === 'application/vnd.ms-powerpoint' || e.target.files[i].type === 'text/plain' || e.target.files[i].type === 'application/pdf' || e.target.files[i].type === 'image/jpg' || e.target.files[i].type === 'image/jpeg' || e.target.files[i].type === 'image/png') {
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
        // fileName = e.target.files[i]
        file.push(e.target.files[i]);
        // }
        // else {
        //     common.displayLog(0, 'Invalid document')
        // }
      }
      // docName !== '' && docName ? doc.push(docName) : null;
      // fileName !== '' && fileName ? file.push(fileName) : null;
      this.setState({ ImageNames: doc, idocuments: file });
    }
  };

  videoSelectHandler = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("e target files===========", e.target.files[0].name);
      console.log("e.target.files[0].type", e.target.files[0].type);
      let doc = this.state.videoNames.slice();
      let file = this.state.vdocuments.slice();
      let videos = this.state.videos.slice();
      if (file.length >= 1) {
        alert("Please select remove first video ");
        return false;
      }
      if (videos.length >= 1) {
        alert("Please select remove first video ");
        return false;
      }
      console.log("docdocdoc", doc);
      console.log("filefilefile", file);
      console.log("e.target.files", e.target.files);
      for (let i = 0; i < e.target.files.length; i++) {
        // if (e.target.files[i].type === 'application/msword' || e.target.files[i].type === 'application/vnd.ms-excel' || e.target.files[i].type === 'application/vnd.ms-powerpoint' || e.target.files[i].type === 'text/plain' || e.target.files[i].type === 'application/pdf' || e.target.files[i].type === 'image/jpg' || e.target.files[i].type === 'image/jpeg' || e.target.files[i].type === 'image/png') {
        if (e.target.files[i].type === "video/mp4") {
          let reader = new FileReader();
          reader.onload = (e) => {
            let videos = this.state.videos.slice();
            videos.push(e.target.result);
            this.setState({ videos: videos });
          };
          reader.readAsDataURL(e.target.files[i]);

          file.push(e.target.files[0]);
          this.setState({ videoNames: doc, vdocuments: file });
        }
      }
    }
    console.log("video is---->>>>", e.target.files[0]);
    let file = e.target.files[0];
    this.setState({
      quiz_video: e.target.files[0],
    });
    var fileReader = new FileReader();
    var img;
    if (e.target.files[0] != undefined) {
      if (file.type.match("image")) {
        fileReader.onload = function () {
          var img = document.createElement("img");
          img.src = fileReader.result;
          videoImg = img;
          // document.getElementsByTagName('div')[0].appendChild(videoImg);
        };

        fileReader.readAsDataURL(file);
      } else {
        console.log("ellelelelelelle");
        fileReader.onload = function () {
          var blob = new Blob([fileReader.result], { type: file.type });
          console.log("blob", blob);
          var url = URL.createObjectURL(blob);
          var video = document.createElement("video");
          var timeupdate = function () {
            if (snapImage()) {
              video.removeEventListener("timeupdate", timeupdate);
              video.pause();
            }
          };
          video.addEventListener("loadeddata", function () {
            let videoDurations = convertSecondToTime(video.duration);
            console.log("duration videoDurations ", videoDurations);
            videoDuration = videoDurations;

            console.log("duration duration ", videoDuration);
            if (snapImage()) {
              video.removeEventListener("timeupdate", timeupdate);
            }
          });
          var snapImage = function () {
            var canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas
              .getContext("2d")
              .drawImage(video, 0, 0, canvas.width, canvas.height);
            var image = canvas.toDataURL();
            var success = image.length > 100000;
            if (success) {
              img = document.createElement("img");
              img.src = image;
              img.id = "videoImg";
              videoImg = img;
              // document.getElementsByName('thumbnaildiv')[0].appendChild(videoImg);

              URL.revokeObjectURL(url);
            }
            videoThumb = image;
            // console.log('videoThumbvideoThumb',videoThumb)
            return success;
          };
          video.addEventListener("timeupdate", timeupdate);
          video.preload = "metadata";
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
        videoImg: img,
      });
    }
  };

  editLoadHandler = async () => {
    let myData = { ...this.state.formValues };
    this.validateFormData(myData, true);
  };

  removeVideo = (index, vid) => {
    // console.log('vidvidvidvidvid',vid)
    // img.includes('https://saviour.s3.amazonaws.com') ? deletedDoc.push(vid) : null;
    let images = [];
    // let images = this.state.images.slice();

    // let file = this.state.documents.slice();
    let file = [];
    // images.splice(index, 1)
    // img.includes('https://saviour.s3.amazonaws.com') ? file.splice(file.findIndex(x => x.includes(img)), 1) : file.splice(file.findIndex(x => x.name == img), 1);
    this.setState({ videos: images, vdocuments: file, videoNames: file });
  };
  removeImage = (index, img) => {
    // console.log('imgfggggggggggggggggggggg',img)
    // img.includes('https://saviour.s3.amazonaws.com') ? idocuments.push(img) : null;
    let images = [];
    // let images = this.state.images.slice();

    // let file = this.state.documents.slice();
    let file = [];
    // images.splice(index, 1)
    // img.includes('https://saviour.s3.amazonaws.com') ? file.splice(file.findIndex(x => x.includes(img)), 1) : file.splice(file.findIndex(x => x.name == img), 1);
    this.setState({ images: images, idocuments: file, ImageNames: file });
  };

  closeForm = () => {
    this.setState({ showForm: false });
  };

  render() {
    console.log("videoThumb", videoThumb);
    return (
      <div className="addCarrierMain">
        <Helmet>
          <title>
            {this.params.blog_post_id ? "Edit Blog Post" : "Add Blog Post"}
          </title>
          <meta name="description" content="Reactify Widgets" />
        </Helmet>
        <PageTitleBar
          title={
            <IntlMessages
              id={
                this.params.blog_post_id
                  ? "sidebar.editBlogPost"
                  : "sidebar.addBlogPost"
              }
            />
          }
          match={this.props.match}
        />
        <RctCollapsibleCard fullBlock>
          <div className="table-responsive">
            <div className="d-flex justify-content-between tableContent">
              <div className="col-sm-12 col-md-12 col-xl-12">
                <Form className="addCarrierForm">
                  <div className="formWrapper">
                    {/* <div className='info-panel d-flex justify-content-center'></div> */}
                    <div className="row align-items-start">
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="title">
                            <span>
                              Title<em>*</em>
                            </span>
                          </Label>
                          <Input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Enter Title"
                            value={this.state.formValues.title}
                            onKeyPress={(e) => this.enterPressed(e)}
                            onChange={(e) => this.changeValuesHandler(e)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="author_name">
                            <span>
                              Author Name<em></em>
                            </span>
                          </Label>
                          <Input
                            type="text"
                            name="author_name"
                            id="author_name"
                            placeholder="Enter Author Name"
                            value={this.state.formValues.author_name}
                            onKeyPress={(e) => this.enterPressed(e)}
                            onChange={(e) => this.changeValuesHandler(e)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="description">
                            <span>
                              Description<em>*</em>
                            </span>
                          </Label>
                          <Input
                            style={{ height: "200px" }}
                            type="textarea"
                            name="description"
                            id="description"
                            placeholder="Enter Description"
                            value={this.state.formValues.description}
                            onKeyPress={(e) => this.enterPressed(e)}
                            onChange={(e) => this.changeValuesHandler(e)}
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label htmlFor="description">
                            <span>
                              Image
                              <em>* (Please upload image size of 320*160)</em>
                            </span>
                          </Label>
                          <label
                            className="upload-doc"
                            htmlFor="upload-attachment"
                          >
                            <img
                              src={require("../../assets/img/upload-file.png")}
                            />
                          </label>
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={(e) => this.imageSelectHandler(e)}
                            id="upload-attachment"
                          />
                        </FormGroup>

                        <FormGroup>
                          <div className="attachFiles">
                            {console.log("Image----", this.state.ImageNames)}
                            {this.state.ImageNames.length > 0 &&
                              this.state.ImageNames.map((document, i) => (
                                <div className="carrierFile" key={i}>
                                  <div className="attacheFileBox d-flex flex-wrap">
                                    <div className="pdfBoxMain mt-2 mb-2">
                                      <div className="pdfBox">
                                        {" "}
                                        <img
                                          className="pdfImage"
                                          src={
                                            document &&
                                            (document.substr(
                                              document.lastIndexOf(".") + 1
                                            ) == "doc" ||
                                            document.substr(
                                              document.lastIndexOf(".") + 1
                                            ) == "docx"
                                              ? Images.svg
                                              : document.substr(
                                                  document.lastIndexOf(".") + 1
                                                ) == "pdf"
                                              ? Images.pdf
                                              : document.substr(
                                                  document.lastIndexOf(".") + 1
                                                ) == "mp4" ||
                                                document.substr(
                                                  document.lastIndexOf(".") + 1
                                                ) == "MP4" ||
                                                document.substr(
                                                  document.lastIndexOf(".") + 1
                                                ) == "mov" ||
                                                document.substr(
                                                  document.lastIndexOf(".") + 1
                                                ) == "MOV"
                                              ? Images.video
                                              : Images.file)
                                          }
                                        />
                                        <div className="fileDetail d-flex justify-content-between">
                                          {" "}
                                          <label>
                                            {document}
                                            <i
                                              onClick={() =>
                                                this.removeDocument(i, document)
                                              }
                                              className="close-icon ti-close ml-2 mr-2"
                                            ></i>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            {this.state.images &&
                              this.state.images.length > 0 &&
                              this.state.images.map((image, i) => (
                                <div key={i}>
                                  <img
                                    className="tag-img"
                                    src={image}
                                    alt=""
                                    title=""
                                  />
                                  <i
                                    onClick={() => this.removeImage(i, image)}
                                    className="close-icon ti-close ml-2 mr-2"
                                  ></i>
                                </div>
                              ))}
                          </div>
                          <div className="info-panel d-flex justify-content-center"></div>
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="description">
                            <span>
                              Video<em> (Please upload max 85MB video)</em>
                            </span>
                          </Label>
                          <label
                            className="upload-doc"
                            htmlFor="upload-vattachment"
                          >
                            <img
                              src={require("../../assets/img/upload-file.png")}
                            />
                          </label>
                          <input
                            type="file"
                            name="video"
                            accept="video/mp4"
                            onChange={(e) => this.videoSelectHandler(e)}
                            id="upload-vattachment"
                          />
                          <span class="mandatory-field">
                            {" "}
                            Only Mp4 video upload
                          </span>
                        </FormGroup>

                        <FormGroup>
                          <div className="attachFiles">
                            {this.state.videoNames.length > 0 &&
                              this.state.videoNames.map((document, i) => (
                                <div className="carrierFile" key={i}>
                                  <div className="attacheFileBox d-flex flex-wrap">
                                    <div className="pdfBoxMain mt-2 mb-2">
                                      <div className="pdfBox">
                                        {" "}
                                        <img
                                          className="pdfImage"
                                          src={
                                            document &&
                                            (document.substr(
                                              document.lastIndexOf(".") + 1
                                            ) == "doc" ||
                                            document.substr(
                                              document.lastIndexOf(".") + 1
                                            ) == "docx"
                                              ? Images.svg
                                              : document.substr(
                                                  document.lastIndexOf(".") + 1
                                                ) == "pdf"
                                              ? Images.pdf
                                              : document.substr(
                                                  document.lastIndexOf(".") + 1
                                                ) == "mp4" ||
                                                document.substr(
                                                  document.lastIndexOf(".") + 1
                                                ) == "MP4" ||
                                                document.substr(
                                                  document.lastIndexOf(".") + 1
                                                ) == "mov" ||
                                                document.substr(
                                                  document.lastIndexOf(".") + 1
                                                ) == "MOV"
                                              ? Images.video
                                              : Images.file)
                                          }
                                        />
                                        <div className="fileDetail d-flex justify-content-between">
                                          {" "}
                                          <label>
                                            {document}
                                            <i
                                              onClick={() =>
                                                this.removeVideo(i, document)
                                              }
                                              className="close-icon ti-close ml-2 mr-2"
                                            ></i>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            {this.state.videos &&
                              this.state.videos.length > 0 &&
                              this.state.videos.map((video, i) => (
                                <div key={i}>
                                  <video className="tag-video" controls>
                                    <source src={video} />
                                  </video>
                                  <i
                                    onClick={() => this.removeVideo(i, video)}
                                    className="close-icon ti-close ml-2 mr-2"
                                  ></i>
                                </div>
                              ))}
                          </div>
                        </FormGroup>

                        {/* <FormGroup>
                                                    <div className="attachFiles">
                                                        {
                                                            this.state.ImageNames.length > 0 && this.state.ImageNames.map((document, i) =>
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
                                                            this.state.images && this.state.images.length > 0 && this.state.images.map((image, i) =>
                                                                <div key={i}>
                                                                    <img className="tag-img" src={image} alt="" title="" />
                                                                    <i onClick={() => this.removeImage(i, image)} className="close-icon ti-close ml-2 mr-2"></i>
                                                                </div>)
                                                        }
                                                    </div>
                                                    <div className='info-panel d-flex justify-content-center'></div>
                                                </FormGroup> */}
                      </Col>
                    </div>
                  </div>

                  {this.state.error !== "" ? (
                    <Alert color="danger">{this.state.error}</Alert>
                  ) : null}
                  <p>
                    <em style={{ color: "#c35151" }}>*</em>
                    <span className="mandatory-field">
                      {" "}
                      SHOWS MANDATORY FIELDS
                    </span>
                  </p>
                  <hr />
                  {this.params.blog_post_id ? (
                    <Button
                      variant="contained"
                      className="text-white btn-primary mr-2"
                      onClick={this.editBlogPostHandler}
                    >
                      Update
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      className="text-white btn-primary mr-2"
                      onClick={this.addBlogPostHandler}
                    >
                      Add
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    className="text-white btn-danger"
                    onClick={this.goBack}
                  >
                    Cancel
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </RctCollapsibleCard>
      </div>
    );
  }
}
// map state to props
const mapStateToProps = ({ blogPostReducer }) => {
  const {
    addBlogPostDetailsData,
    getAllBlogPostByIdData,
    editBlogPostDetailsData,
  } = blogPostReducer;
  return {
    addBlogPostDetailsData,
    getAllBlogPostByIdData,
    editBlogPostDetailsData,
  };
};

export default connect(mapStateToProps, {
  addBlogPostDetails,
  getAllBlogPostListById,
  editBlogPostDetails,
})(AddEditBlogPost);
