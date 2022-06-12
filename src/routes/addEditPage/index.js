import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import Button from '@material-ui/core/Button';
import joi from 'joi-browser';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
// const RICH_TEXT_BOX_OPTIONS = ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history']

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
import { addPageDetails, getAllPageListById, editPageDetails } from '../../actions/PageAction';
import { connect } from 'react-redux';
import AppConfig from '../../constants/AppConfig';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import Tooltip from '@material-ui/core/Tooltip';
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import Select from 'react-select';
import * as common from '../../api/index';
import Images from '../../assets/images';
import NumberFormat from 'react-number-format';
import queryString from 'query-string';

const getHtml = editorState => draftToHtml(convertToRaw(editorState.getCurrentContent())); {/* new */ }

class AddEditPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
            formValues: {
                page_url: '',
                page_name: '',
            },

            description: '',
            error: '',
            errorField: '',
            showForm: false,
            showModal: false,

        }
        this.params = queryString.parse(this.props.location.search)
    }
    async componentDidMount() {

        if (this.params.page_id) {
            await this.getPageDetails();
        }
    }
    getPageDetails = async () => {

        let reqData = { page_id: this.params.page_id }
        let page = await this.props.getAllPageListById(reqData);
        if (this.props.getAllPageByIdData && this.props.getAllPageByIdData.data) {
            let pageData = this.props.getAllPageByIdData.data
            console.log("pageData==========", pageData)
            let formData = {
                page_url: pageData.page_url,
                page_name: pageData.page_name,
                page_id: pageData.page_id,
            }
            // Covert HTMl to JSON block
            const blocksFromHtml = htmlToDraft(pageData.description);

            // Create editor content with HTMl blocks
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

            // Create final content fro editor
            const editorState = EditorState.createWithContent(contentState);
            await this.setState({
                formValues: formData,
                editorState: editorState,
            })
        }

    }
    changeValuesHandler = async (e) => {
        console.log("state", this.state.formValues)
        var formValues = this.state.formValues;
        var name = e.target.name;
        formValues[name] = e.target.value.replace(/^\s+/g, '');

        this.setState({ formValues: formValues });
        console.log("state", this.state.formValues)
    }


    onEditorStateChange = async (editorState) => {
        let editorSourceHTML = await draftToHtml(convertToRaw(editorState.getCurrentContent())),
            editorSourceHTMLRow = convertToRaw(editorState.getCurrentContent()).blocks[0].text
        await this.setState({
            editorState: editorState,
            description: editorSourceHTMLRow === "" ? "" : editorSourceHTML
        });
    };


    editPageHandler = async () => {
        let myData = { ...this.state.formValues }
        this.validateFormData(myData, true);
    }
    addPageHandler = async () => {
        let myData = { ...this.state.formValues }
        console.log("mydata", myData)
        this.validateFormData(myData);
    }


    validateFormData = (body, isOnEdit) => {
        console.log("body========", body)
        isOnEdit ? body.page_id = +this.params.page_id : null
        let schema = joi.object().keys({
            page_url: joi.string().trim().required(),
            page_name: joi.string().trim().required(),
            description: joi.string().trim().required(),
        })
        this.state.description !== '' ? body.description = this.state.description : delete body.description;
        if (isOnEdit) {
            schema = schema.append({
                page_id: joi.number().required()
            });
        }
        joi.validate(body, schema, (error, value) => {
            if (error) {
                if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
                    let errorLog = common.validateSchema(error)
                    this.setState({ error: errorLog.error, errorField: errorLog.errorField });
                }
            }
            else {
                this.setState({ error: '', errorField: '' }, () => {
                    isOnEdit ? this.addEditPageReq(body, true) : this.addEditPageReq(body);
                });
            }
        })
    }
    addEditPageReq = async (body, isOnEdit) => {
        console.log('addEditBlogPostReq Body', body)
        let page_id = localStorage.getItem('page_id')
        let reqData = {
            page_url: body.page_url,
            page_name: body.page_name,
            description: body.description,
        }

        isOnEdit ? reqData.page_id = body.page_id.toString() : null
        if (isOnEdit) {

            await this.props.editPageDetails(reqData);
            console.log('editPageDetailsData', this.props.editPageDetailsData.message)
            if (this.props.editPageDetailsData && this.props.editPageDetailsData.code === 1) {
                // deletedDoc = []
                common.displayLog(1, this.props.editPageDetailsData.message)
                this.props.history.push('/app/pages')
            }
        } else {
            await this.props.addPageDetails(reqData)
            console.log("this.props.addPageDetailsData", this.props.addPageDetailsData)
            if (this.props.addPageDetailsData && this.props.addPageDetailsData.code === 1) {
                common.displayLog(1, this.props.addPageDetailsData.message)
                this.props.history.push('/app/pages')
            }
        }
    }

    enterPressed = async (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode

        }
    }
    goBack = async () => {
        await this.props.history.push('/app/pages')
    }

    editLoadHandler = async () => {
        let myData = { ...this.state.formValues }
        this.validateFormData(myData, true);
    }

    closeForm = () => {
        this.setState({ showForm: false })
    }
    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://api.imgur.com/3/image');
                xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    render() {
        console.log(this.state)
        const { editorState } = this.state;
        return (
            <div className="addCarrierMain">
                <Helmet>
                    <title>{this.params.page_id ? "Edit Page" : "Add Page"}</title>
                    <meta name="description" content="Reactify Widgets" />
                </Helmet>
                <PageTitleBar
                    title={<IntlMessages id={this.params.page_id ? "sidebar.editPage" : "sidebar.addPage"} />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <div className="table-responsive">
                        <div className="d-flex justify-content-between tableContent">
                            <div className="col-sm-12 col-md-12 col-xl-12">
                                <Form className='addCarrierForm' >
                                    <div className='formWrapper'>
                                        {/* <div className='info-panel d-flex justify-content-center'></div> */}
                                        <div className="row align-items-start"> 
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label htmlFor="title"><span>Page Url<em>*</em></span></Label>
                                                        <Input
                                                            type="text"
                                                            name="page_url"
                                                            id="page_url"
                                                            placeholder="Enter Page Url"
                                                            value={this.state.formValues.page_url}
                                                            onKeyPress={(e) => this.enterPressed(e)}
                                                            onChange={(e) => this.changeValuesHandler(e)} />                                                    
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label htmlFor="title"><span>Page Name<em>*</em></span></Label>                                                        
                                                        <Input
                                                            type="text"
                                                            name="page_name"
                                                            id="page_name"
                                                            placeholder="Enter Page Name"
                                                            value={this.state.formValues.page_name}
                                                            onKeyPress={(e) => this.enterPressed(e)}
                                                            onChange={(e) => this.changeValuesHandler(e)} />                                                        
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label htmlFor="description"><span>Description<em>*</em></span></Label>
                                                        
                                                            <RctCollapsibleCard>


                                                                <Editor
                                                                    name="description"

                                                                    toolbar={{
                                                                        inline: {
                                                                            inDropdown: false,
                                                                            className: undefined,
                                                                            component: undefined,
                                                                            dropdownClassName: undefined,
                                                                            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
                                                                            //   bold: { icon: bold, className: undefined },
                                                                            //   italic: { icon: italic, className: undefined },
                                                                            //   underline: { icon: underline, className: undefined },
                                                                            //   strikethrough: { icon: strikethrough, className: undefined },
                                                                            //   monospace: { icon: monospace, className: undefined },
                                                                            //   superscript: { icon: superscript, className: undefined },
                                                                            //   subscript: { icon: subscript, className: undefined },
                                                                        },
                                                                        blockType: {
                                                                            inDropdown: true,
                                                                            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                                                                            className: undefined,
                                                                            component: undefined,
                                                                            dropdownClassName: undefined,
                                                                        },
                                                                        fontSize: {
                                                                            //   icon: fontSize,
                                                                            options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                                                                            className: undefined,
                                                                            component: undefined,
                                                                            dropdownClassName: undefined,
                                                                        },
                                                                        fontFamily: {
                                                                            options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
                                                                            className: undefined,
                                                                            component: undefined,
                                                                            dropdownClassName: undefined,
                                                                        },
                                                                        list: {
                                                                            inDropdown: false,
                                                                            className: undefined,
                                                                            component: undefined,
                                                                            dropdownClassName: undefined,
                                                                            options: ['unordered', 'ordered', 'indent', 'outdent'],
                                                                            //   unordered: { icon: unordered, className: undefined },
                                                                            //   ordered: { icon: ordered, className: undefined },
                                                                            //   indent: { icon: indent, className: undefined },
                                                                            //   outdent: { icon: outdent, className: undefined },
                                                                        },
                                                                        textAlign: {
                                                                            inDropdown: false,
                                                                            className: undefined,
                                                                            component: undefined,
                                                                            dropdownClassName: undefined,
                                                                            options: ['left', 'center', 'right', 'justify'],
                                                                            //   left: { icon: left, className: undefined },
                                                                            //   center: { icon: center, className: undefined },
                                                                            //   right: { icon: right, className: undefined },
                                                                            //   justify: { icon: justify, className: undefined },
                                                                        },
                                                                        colorPicker: {
                                                                            //   icon: color,
                                                                            className: undefined,
                                                                            component: undefined,
                                                                            popupClassName: undefined,
                                                                            colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                                                                                'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                                                                                'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                                                                                'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                                                                                'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                                                                                'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
                                                                        },
                                                                        link: {
                                                                            inDropdown: false,
                                                                            className: undefined,
                                                                            component: undefined,
                                                                            popupClassName: undefined,
                                                                            dropdownClassName: undefined,
                                                                            showOpenOptionOnHover: true,
                                                                            defaultTargetOption: '_self',
                                                                            options: ['link', 'unlink'],
                                                                            //   link: { icon: link, className: undefined },
                                                                            //   unlink: { icon: unlink, className: undefined },
                                                                            linkCallback: undefined
                                                                        },
                                                                        emoji: {
                                                                            //   icon: emoji,
                                                                            className: undefined,
                                                                            component: undefined,
                                                                            popupClassName: undefined,
                                                                            emojis: [
                                                                                '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
                                                                                '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
                                                                                '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
                                                                                '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
                                                                                '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
                                                                                '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
                                                                                '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
                                                                                '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
                                                                                '✅', '❎', '💯',
                                                                            ],
                                                                        },
                                                                        embedded: {
                                                                            //   icon: embedded,
                                                                            className: undefined,
                                                                            component: undefined,
                                                                            popupClassName: undefined,
                                                                            embedCallback: undefined,
                                                                            defaultSize: {
                                                                                height: 'auto',
                                                                                width: 'auto',
                                                                            },
                                                                        },
                                                                        // image: { uploadCallback: this.uploadImageCallBack, inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg', alt: { present: true, mandatory: true } },
                                                                        image: {
                                                                            //   icon: image,
                                                                            className: undefined,
                                                                            component: undefined,
                                                                            popupClassName: undefined,
                                                                            urlEnabled: true,
                                                                            uploadEnabled: true,
                                                                            alignmentEnabled: true,
                                                                            uploadCallback: this.uploadImageCallBack,
                                                                            previewImage: false,
                                                                            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                                                                            alt: { present: false, mandatory: false },
                                                                            defaultSize: {
                                                                                height: 'auto',
                                                                                width: 'auto',
                                                                            },
                                                                        },
                                                                        remove: { className: undefined, component: undefined },
                                                                        history: {
                                                                            inDropdown: false,
                                                                            className: undefined,
                                                                            component: undefined,
                                                                            dropdownClassName: undefined,
                                                                            options: ['undo', 'redo'],
                                                                            //   undo: { icon: undo, className: undefined },
                                                                            //   redo: { icon: redo, className: undefined },
                                                                        },
                                                                    }
                                                                    }
                                                                    // toolbar={{
                                                                    //     inline: { inDropdown: true },
                                                                    //     list: { inDropdown: true },
                                                                    //     textAlign: { inDropdown: true },
                                                                    //     link: { inDropdown: true },
                                                                    //     history: { inDropdown: true },
                                                                    //     image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                                                                    //   }}
                                                                    editorState={this.state.editorState}
                                                                    toolbarClassName="toolbarClassName"
                                                                    wrapperClassName="wrapperClassName"
                                                                    editorClassName="editorClassName"
                                                                    onEditorStateChange={this.onEditorStateChange}
                                                                />



                                                                {/* <div className="html-view">	          
                                                                    {getHtml(editorState)}	        
                                                            </div> */}

                                                            </RctCollapsibleCard>
                                                        
                                                    </FormGroup>
                                                </Col>
                                        </div>


                                        


                                        

                                        {/* toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName" */}




                                    </div>



                                    {
                                        this.state.error !== '' ?
                                            <Alert color="danger">
                                                {this.state.error}
                                            </Alert>
                                            : null
                                    }
                                    <p><em style={{ color: '#c35151' }}>*</em><span className='mandatory-field'> SHOWS MANDATORY FIELDS</span></p>
                                    <hr />
                                    {
                                        this.params.page_id ?
                                            <Button variant="contained" className="text-white btn-primary mr-2" onClick={this.editPageHandler}>Update</Button> :
                                            <Button variant="contained" className="text-white btn-primary mr-2" onClick={this.addPageHandler}>Add</Button>
                                    }
                                    <Button variant="contained" className="text-white btn-danger" onClick={this.goBack}>Cancel</Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </RctCollapsibleCard>
            </div >
        );
    }
}
// map state to props
const mapStateToProps = ({ pageReducer }) => {
    const { addPageDetailsData, getAllPageByIdData, editPageDetailsData } = pageReducer;
    return { addPageDetailsData, getAllPageByIdData, editPageDetailsData }
}

export default connect(mapStateToProps, {
    addPageDetails,
    getAllPageListById,
    editPageDetails
})(AddEditPage);
