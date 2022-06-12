
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { Form, Col, FormGroup, Input, Label, Button, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import queryString from 'query-string'
import { withRouter } from 'react-router';
import joi from 'joi-browser';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import * as common from '../../api/index';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { addSupportingMaterial, editSupportingMaterial, getSupportingMaterial } from '../../actions/CommitmentAction';

import { Editor } from '@tinymce/tinymce-react';

// import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const getHtml = editorState => draftToHtml(convertToRaw(editorState.getCurrentContent())); {/* new */ }

class AddEditCpmmitment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                material_title: '',
                material_by: '',
                image: '',
                type: 'text',
                type_text: '',
                video_thum: ''
            },
            previewImage: '',
            previewText: '',
            previewVideo: '',
            error: '',
            errorField: '',
            editorState: EditorState.createEmpty(),
        }
        this.params = queryString.parse(this.props.location.search)
    }
    getMaterialDetails = async () => {
        const reqData = { material_id: this.params.material_id }
        await this.props.getSupportingMaterial(reqData);
        console.log('getSupportingMaterialData', this.props.getSupportingMaterialData)
        if (this.props.getSupportingMaterialData && this.props.getSupportingMaterialData.data) {
            this.setState({
                form: {
                    ...this.state.form,
                    material_title: this.props.getSupportingMaterialData.data[0].material_title,
                    material_by: this.props.getSupportingMaterialData.data[0].material_by,
                    image: this.props.getSupportingMaterialData.data[0].image,
                    type: this.props.getSupportingMaterialData.data[0].type,
                    type_text: this.props.getSupportingMaterialData.data[0].type_text,
                },
                previewImage: this.props.getSupportingMaterialData.data[0].image,
                previewText: this.props.getSupportingMaterialData.data[0].type === 'pdf' ? this.props.getSupportingMaterialData.data[0].type_text : '',
                previewVideo: this.props.getSupportingMaterialData.data[0].type === 'video' ? this.props.getSupportingMaterialData.data[0].type_text : ''
            })
        }
    }
    componentDidMount = async () => {
        if (this.params.material_id) {
            await this.getMaterialDetails();
        }

        console.log("TYPE TEXT", this.state.form.type_text)

        const blocksFromHtml = htmlToDraft(this.state.form.type_text);

        // Create editor content with HTMl blocks
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

        // Create final content fro editor
        const editorState = EditorState.createWithContent(contentState);
        await this.setState({
            editorState: editorState,
        })

    }


    onEditorStateChange = async (editorState) => {


        let editorSourceHTML = draftToHtml(convertToRaw(editorState.getCurrentContent())),
            editorSourceHTMLRow = convertToRaw(editorState.getCurrentContent()).blocks[0].text

        console.log(editorSourceHTML)

        await this.setState({
            editorState: editorState,
            form: {
                ...this.state.form,
                type_text: editorSourceHTMLRow === "" ? "" : editorSourceHTML
            }
        });
    };

    editorChangeHandler = async (content) => {

        console.log(content.level.content)

        this.setState({
            form: {
                ...this.state.form,
                type_text: content.level.content
            }
        });
    }


    changeValuesHandler = async (event) => {
        this.setState({ form: { ...this.state.form, [event.target.name]: event.target.value } });
    }
    imageSelectHandler = (event) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.setState({ previewImage: e.target.result })
        }
        reader.readAsDataURL(event.target.files[0])
        this.setState({ form: { ...this.state.form, [event.target.name]: event.target.files[0] } })
    }
    removeImageHandler = () => {
        this.setState({ form: { ...this.state.form, image: undefined }, previewImage: '' })
    }
    fileSelectHandler = (event) => {
        if (this.state.form.type === 'video') {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.setState({ previewVideo: e.target.result, previewText: '' }, () => {
                    const video = document.getElementById('previewVideo')
                    video.currentTime = 10;
                    video.addEventListener('loadeddata', async () => {
                        const canvas = document.createElement('canvas')
                        canvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height);
                        canvas.toBlob(blob => {
                            const file = new File([blob], 'abcd.jpg', { type: 'image/jpg' })
                            console.log("CANVAS FILE", blob, file)
                            this.setState({ form: { ...this.state.form, video_thum: file } })
                        })
                    })
                })
            }
            reader.readAsDataURL(event.target.files[0])
        } else if (this.state.form.type === 'pdf') {
            this.setState({ previewText: event.target.files[0].name, previewVideo: '', form: { ...this.state.form, video_thum: '' } })
        }
        this.setState({ form: { ...this.state.form, [event.target.name]: event.target.files[0] } })
    }
    removeFileHandler = () => {
        this.setState({
            form: { ...this.state.form, file: '', video_thum: '' },
            previewVideo: '',
            previewText: ''
        })
    }
    saveHandler = () => {
        const data = {
            ...this.state.form
        },
            schema = joi.object().keys({
                material_title: joi.string().trim().required(),
                material_by: joi.string().trim().optional().allow("").allow(null),
                image: joi.any().required(),
                type: joi.string().trim().required(),
                type_text: joi.any().when('type', {
                    is: 'video',
                    then: joi.any().required(),
                    otherwise: joi.when('type', {
                        is: 'pdf',
                        then: joi.any().required(),
                        otherwise: joi.optional()
                    })
                }),
                video_thum: joi.any().when('type', { is: 'video', then: joi.required(), otherwise: joi.optional().allow("") })
            })
        joi.validate(data, schema, error => {
            if (error) {
                if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
                    let errorLog = common.validateSchema(error)
                    this.setState({ error: errorLog.error, errorField: errorLog.errorField });
                }
            } else {
                this.setState({ error: '', errorField: '' }, () => {
                    this.addEditMateiral(data)
                });
            }
        })
    }
    addEditMateiral = async (data) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append([key], data[key]);
        }
        if (this.params.material_id) {
            formData.append("material_id", this.params.material_id)
            await this.props.editSupportingMaterial(formData)
            if (this.props.editSupportingMaterialData && this.props.editSupportingMaterialData.code === 1) {
                common.displayLog(1, this.props.editSupportingMaterialData.message)
                this.goBack()
            }
        } else {
            formData.append("stage_id", this.params.stage_id)
            await this.props.addSupportingMaterial(formData)
            if (this.props.addSupportingMaterialData && this.props.addSupportingMaterialData.code === 1) {
                common.displayLog(1, this.props.addSupportingMaterialData.message)
                this.goBack()
            }
        }
    }
    goBack = async () => {
        await this.props.history.goBack()
    }
    render() {
        console.log("STATE", this.state)
        return (
            <div className="addCarrierMain">
                <Helmet>
                    <title>{this.params.commitment_id ? "Edit Material" : "Add Material"}</title>
                </Helmet>
                <PageTitleBar
                    title={this.params.commitment_id ? "Edit Material" : "Add Material"}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <div className="table-responsive">
                        <div className="d-flex justify-content-between border-bottom tableContent">
                            <div className="col-sm-12 col-md-12 col-xl-12">
                                <Form className='addCarrierForm' >
                                    <div className='formWrapper'>
                                        <div className='info-panel d-flex justify-content-center'>Material</div>
                                        <FormGroup row>
                                            <Label htmlFor="material_title" sm={4}><span>Material Titile<em>*</em></span></Label>
                                            <Col sm={6}>
                                                <Input
                                                    type="text"
                                                    name="material_title"
                                                    id="material_title"
                                                    placeholder="Enter Material Title"
                                                    value={this.state.form.material_title}
                                                    onChange={(e) => this.changeValuesHandler(e)} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="material_by" sm={4}><span>Material By<em></em></span></Label>
                                            <Col sm={6}>
                                                <Input
                                                    type="textarea"
                                                    name="material_by"
                                                    id="material_by"
                                                    placeholder="Enter Material By"
                                                    value={this.state.form.material_by}
                                                    onChange={(e) => this.changeValuesHandler(e)} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="image" sm={4}><span>Image<em>* <br />(Please upload image size of 220*220)</em></span></Label>
                                            <Col sm={3}>
                                                <label className='upload-doc' htmlFor="image">
                                                    <img src={require('../../assets/img/upload-file.png')} /></label>
                                                <input
                                                    type="file"
                                                    name="image"
                                                    accept="image/*"
                                                    onChange={this.imageSelectHandler}
                                                    id="image" />
                                            </Col>
                                        </FormGroup>
                                        <div className="attachFiles">
                                            <Col sm={4}>
                                            </Col>
                                            {
                                                this.state.previewImage
                                                    ?
                                                    <div>
                                                        <img className="tag-video" src={this.state.previewImage} />
                                                        <i onClick={this.removeImageHandler} className="close-icon ti-close ml-2 mr-2"></i>
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <FormGroup row>
                                            <Label htmlFor="type" sm={4}><span>Type<em>*</em></span></Label>
                                            <Col sm={6}>
                                                <Input type="select" name="type" id="type" value={this.state.form.type} onChange={this.changeValuesHandler}>
                                                    <option value='text'>Text</option>
                                                    <option value='video'>Video</option>
                                                    <option value='pdf'>PDF</option>
                                                </Input>
                                            </Col>
                                        </FormGroup>
                                        {
                                            this.state.form.type === 'text'
                                                ?
                                                <FormGroup row>
                                                    <Label htmlFor="title" sm={4}><span>Text<em>*</em></span></Label>
                                                    <Col sm={6} className="CK">
                                                        <Input
                                                            type="textarea"
                                                            name="type_text"
                                                            id="type_text"
                                                            placeholder="Enter Text"
                                                            value={this.state.form.type_text}
                                                            onKeyPress={(e) => this.enterPressed(e)}
                                                            onChange={(e) => this.changeValuesHandler(e)} />
                                                        {/* <CKEditor
                                                            name="type_text"
                                                            editor={ClassicEditor}
                                                            data={this.state.form.type_text}
                                                            onChange={(event, editor) => {
                                                                const data = editor.getData();
                                                                this.changeValuesHandler({ target: { name: 'type_text', value: data } })
                                                            }}
                                                        /> */}

                                                        {/* <Editor
                                                            name="type_text"

                                                            toolbar={{

                                                                options: ['inline', 'blockType', 'list', 'textAlign', 'fontFamily'],

                                                                inline: {
                                                                    inDropdown: true,
                                                                    options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],

                                                                },
                                                                blockType: {
                                                                    inDropdown: true,
                                                                    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],

                                                                },
                                                                // fontSize: {
                                                                //     //   icon: fontSize,
                                                                //     options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],

                                                                // },
                                                                fontFamily: {
                                                                    options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
                                                                    className: undefined,
                                                                    component: undefined,
                                                                    dropdownClassName: undefined,
                                                                },
                                                                list: {
                                                                    inDropdown: true,
                                                                    options: ['unordered', 'ordered'],

                                                                },
                                                                textAlign: {
                                                                    inDropdown: true,
                                                                    options: ['left', 'center', 'right', 'justify'],

                                                                },

                                                            }
                                                            }

                                                            editorState={this.state.editorState}
                                                            // toolbarClassName="toolbarClassName"
                                                            // wrapperClassName="wrapperClassName"
                                                            // editorClassName="editorClassName"
                                                            onEditorStateChange={this.onEditorStateChange}
                                                        /> */}

                                                        {/* <Editor
                                                            onChange={this.editorChangeHandler}
                                                            initialValue={this.state.form.type_text}
                                                            init={{
                                                                height: 200,
                                                                menubar: false,
                                                                plugins: [
                                                                    'advlist autolink lists link image charmap print preview anchor',
                                                                    'searchreplace visualblocks code fullscreen',
                                                                    'insertdatetime media table paste code help wordcount fontfamily'
                                                                ],
                                                                toolbar: 'undo redo | formatselect fontselect | ' +
                                                                    'bold italic backcolor | alignleft aligncenter ' +
                                                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                                                    'removeformat | help fontfamily',
                                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                                            }}
                                                        /> */}

                                                    </Col>
                                                </FormGroup>
                                                :
                                                <>
                                                    <FormGroup row >
                                                        <Label htmlFor="sub-category-file-text" sm={4}><span>File<em>*</em></span></Label>
                                                        <Col sm={3}>
                                                            <Label className='upload-doc' htmlFor="type_text">
                                                                <img src={require('../../assets/img/upload-file.png')} />
                                                                <Input
                                                                    id="type_text"
                                                                    type="file"
                                                                    name="type_text"
                                                                    accept={`${this.state.form.type}/*,application/${this.state.form.type}`}
                                                                    onChange={this.fileSelectHandler}
                                                                />
                                                            </Label>
                                                        </Col>
                                                    </FormGroup>
                                                    <div className="attachFiles">
                                                        <Col sm={4}>
                                                        </Col>
                                                        {
                                                            this.state.form.type === 'video' && this.state.previewVideo
                                                                ?
                                                                <Col sm={8}>
                                                                    <video className="tag-video" height={200} width={300} id="previewVideo" src={this.state.previewVideo} controls>
                                                                    </video>
                                                                    <i onClick={this.removeFileHandler} className="close-icon ti-close ml-2 mr-2"></i>
                                                                </Col>
                                                                :
                                                                this.state.form.type === 'pdf' && this.state.previewText
                                                                    ?
                                                                    <Col sm={8}>
                                                                        <p>{this.state.previewText}</p>
                                                                    </Col>
                                                                    :
                                                                    null
                                                        }
                                                    </div>
                                                </>
                                        }
                                        {
                                            this.state.error !== '' ?
                                                <Alert color="danger">
                                                    {this.state.error}
                                                </Alert>
                                                : null
                                        }
                                    </div >
                                    <p><em style={{ color: '#c35151' }}>*</em><span className='mandatory-field'> SHOWS MANDATORY FIELDS</span></p>
                                    <hr />
                                    <div className='pb-1'>
                                        <Button variant="contained" className="text-white btn-primary mr-2" onClick={this.saveHandler}>Save</Button>
                                        <Button variant="contained" className="text-white btn-danger" onClick={this.goBack}>Cancel</Button>
                                    </div>
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
const mapStateToProps = ({ CommitmentReducer }) => {
    const { addSupportingMaterialData, getSupportingMaterialData, editSupportingMaterialData } = CommitmentReducer;
    return { addSupportingMaterialData, getSupportingMaterialData, editSupportingMaterialData }
}

export default connect(mapStateToProps, {
    getSupportingMaterial,
    addSupportingMaterial,
    editSupportingMaterial
})(withRouter(AddEditCpmmitment));
