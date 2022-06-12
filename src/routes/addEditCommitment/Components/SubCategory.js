import React, { Component } from 'react'
import { Col, FormGroup, Input, Label, Button, Alert } from 'reactstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import joi from 'joi-browser';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import * as common from '../../../api/index';
import { addCommitmentStageDetail, editCommitmentStageDetail, deleteSubCategory } from '../../../actions/CommitmentAction';

import { Editor } from '@tinymce/tinymce-react';
// import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const getHtml = editorState => draftToHtml(convertToRaw(editorState.getCurrentContent())); {/* new */ }

class SubCategory extends Component {
    state = {
        form: {
            title: this.props.formValues.title,
            author: this.props.formValues.author,
            read_time: this.props.formValues.read_time,
            image: this.props.formValues.image,
            type: this.props.formValues.type,
            audio_text: this.props.formValues.audio_text,
            audio_b_image: this.props.formValues.audio_b_image,
            text: this.props.formValues.text,
            file: this.props.formValues.file,
            video_thum: this.props.formValues.video_thum
        },
        previewText: this.props.formValues.type === 'audio' || this.props.formValues.type === 'pdf' ? this.props.formValues.file : '',
        previewImage: this.props.formValues.image || '',
        previewVideo: this.props.formValues.type === 'video' ? this.props.formValues.file : '',
        previewAudioBImage: this.props.formValues.type === 'audio' ? this.props.formValues.audio_b_image : '',
        error: '',
        errorField: '',

        editorState: EditorState.createEmpty(),

    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.setState({
                form: {
                    title: this.props.formValues.title,
                    author: this.props.formValues.author,
                    read_time: this.props.formValues.read_time,
                    image: this.props.formValues.image,
                    type: this.props.formValues.type,
                    audio_text: this.props.formValues.audio_text,
                    audio_b_image: this.props.formValues.audio_b_image,
                    text: this.props.formValues.text,
                    file: this.props.formValues.file,
                    video_thum: this.props.formValues.video_thum
                },
                previewText: this.props.formValues.type === 'audio' || this.props.formValues.type === 'pdf' ? this.props.formValues.file : '',
                previewImage: this.props.formValues.image || '',
                previewVideo: this.props.formValues.type === 'video' ? this.props.formValues.file : '',
                previewAudioBImage: this.props.formValues.type === 'audio' ? this.props.formValues.audio_b_image : '',
                error: '',
                errorField: '',

                // editorState: EditorState.createEmpty(),
            });

            await this.editorHandler(this.props.formValues.text)

        }
    }


    componentDidMount = async () => {
        // const blocksFromHtml = htmlToDraft(this.state.form.text);

        // // Create editor content with HTMl blocks
        // const { contentBlocks, entityMap } = blocksFromHtml;
        // const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

        // // Create final content fro editor
        // const editorState = EditorState.createWithContent(contentState);
        // await this.setState({
        //     editorState: editorState,
        // })

        await this.editorHandler()
    }

    editorHandler = async (text) => {
        const blocksFromHtml = htmlToDraft(text ? text : this.state.form.text);

        // Create editor content with HTMl blocks
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

        // Create final content fro editor
        const editorState = EditorState.createWithContent(contentState);
        await this.setState({
            editorState: editorState,
        })
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
        this.setState({ form: { ...this.state.form, image: '' }, previewImage: '' })
    }
    audioBImageSelectHandler = (event) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.setState({ previewAudioBImage: e.target.result })
        }
        reader.readAsDataURL(event.target.files[0])
        this.setState({ form: { ...this.state.form, [event.target.name]: event.target.files[0] } })
    }
    removeBImageHandler = () => {
        this.setState({ form: { ...this.state.form, audio_b_image: '' }, previewAudioBImage: '' })
    }
    fileSelectHandler = (event) => {
        if (this.state.form.type === 'video') {

            console.log("Event", event.target.file, event.target.files)
            console.log("Selecting Video")
            const reader = new FileReader();

            if (event.target.files && event.target.files[0] && event.target.files[0].size > 89128960) {
                this.setState({
                    error: "Please upload max 85MB video",
                    error_field: "video_thum"

                });
            } else {
                reader.onload = (e) => {
                    console.log("Into Onload Function")
                    console.log(`previewVideo${this.state.form.title.trim()}`)
                    this.setState({ previewVideo: e.target.result, previewText: '', error: '', errorField: '' }, () => {

                        console.log("Into Nested Function")
                        const video = document.getElementById(`previewVideo${this.state.form.title.trim()}`)
                        video.currentTime = 10;
                        video.load()
                        video.addEventListener('loadeddata', async () => {

                            console.log("Into event listner")
                            const canvas = document.createElement('canvas')

                            console.log("VIDE HEIGHT WIDTH", video.width, video.height)
                            canvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height);
                            canvas.toBlob(blob => {
                                console.log("\n\nBlob:", blob)

                                const file = new File([blob], 'abcd.jpg', { type: 'image/jpg' })
                                console.log("CANVAS FILE", blob, file)
                                this.setState({ form: { ...this.state.form, video_thum: file } })
                            })
                        })
                    })
                }
                reader.readAsDataURL(event.target.files[0])
            }

        } else if (this.state.form.type === 'audio' || this.state.form.type === 'pdf') {
            this.setState({ previewText: event.target.files[0].name, previewVideo: '' })
        }
        this.setState({ form: { ...this.state.form, [event.target.name]: event.target.files[0] } })
    }
    removeFileHandler = () => {
        this.setState({
            form: { ...this.state.form, file: {}, video_thum: {} },
            previewVideo: '',
            previewText: ''
        })
    }
    saveHandler = () => {
        const data = {
            stage_id: this.props.stage_id,
            category_id: this.props.category_id,
            title: this.state.form.title,
            author: this.state.form.author,
            read_time: this.state.form.read_time,
            image: this.state.form.image,
            type: this.state.form.type,
            audio_text: this.state.form.type === 'audio' || this.state.form.type === 'video' ? this.state.form.audio_text : '',
            audio_b_image: this.state.form.type === 'audio' ? this.state.form.audio_b_image : '',
            type_text: this.state.form.type === 'text' ? this.state.form.text : null,
            text_file: this.state.form.type !== 'text' ? this.state.form.file : null,
            video_thum: this.state.form.type === 'video' ? this.state.form.video_thum : null
        },
            schema = joi.object().keys({
                stage_id: joi.number().required(),
                category_id: joi.number().required(),
                title: joi.string().trim().required(),
                author: joi.string().trim().optional().allow("").allow(null),
                read_time: joi.string().trim().required(),
                image: joi.any().required(),
                type: joi.string().trim().required(),
                audio_text: joi.string().allow('').when('type', { is: 'audio', then: joi.required(), otherwise: joi.optional() }).when('type', { is: 'video', then: joi.required(), otherwise: joi.optional() }),
                audio_b_image: joi.any().allow('').when('type', { is: 'audio', then: joi.required(), otherwise: joi.optional() }),
                type_text: joi.any().when('type', { is: 'text', then: joi.required(), otherwise: joi.optional() }),
                text_file: joi.any().when('type', {
                    is: 'image',
                    then: joi.any().required(),
                    otherwise: joi.when('type', {
                        is: 'audio',
                        then: joi.any().required(),
                        otherwise: joi.when('type', {
                            is: 'video',
                            then: joi.any().required(),
                            otherwise: joi.when('type', {
                                is: 'pdf',
                                then: joi.any().required(),
                                otherwise: joi.optional()
                            })
                        })
                    })
                }),
                video_thum: joi.any().when('type', { is: 'video', then: joi.required(), otherwise: joi.optional() })
            })
        console.log("DATATATAATAT", data)
        joi.validate(data, schema, error => {
            if (error) {
                if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
                    let errorLog = common.validateSchema(error)
                    this.setState({ error: errorLog.error, errorField: errorLog.errorField });
                }
            } else {
                this.setState({ error: '', errorField: '' }, () => {
                    this.addEditSubCategory(data)
                });
            }
        })
    }
    addEditSubCategory = async (data) => {
        const formData = new FormData();
        for (const key in data) {
            formData.append([key], data[key]);
        }
        console.log("API REQ DATA:", data)
        if (this.props.is_edit && this.props.category_id) {
            formData.append("comm_category_id", this.props.sub_category_id)
            formData.delete('stage_id')
            formData.delete('category_id')

            console.log("Edit Data:", data)

            await this.props.editCommitmentStageDetail(formData)
            if (this.props.editCommitmentStageDetailData && this.props.editCommitmentStageDetailData.code === 1) {
                common.displayLog(1, this.props.editCommitmentStageDetailData.message)
                this.props.getStageDetails()
            }
        } else {
            console.log("Add Data:", data)
            await this.props.addCommitmentStageDetail(formData)
            if (this.props.addCommitmentStageDetailData && this.props.addCommitmentStageDetailData.code === 1) {
                common.displayLog(1, this.props.addCommitmentStageDetailData.message)
                this.props.getStageDetails()
            }
        }
    }
    deleteSubCategoryHandler = () => {
        this.refs.deleteConfirmationDialog.open();
    }
    deleteSubCategory = async () => {
        const reqData = { comm_category_id: this.props.sub_category_id }
        await this.props.deleteSubCategory(reqData);
        console.log('deleteSubCategoryData', this.props.deleteSubCategoryData)
        if (this.props.deleteSubCategoryData && this.props.deleteSubCategoryData.code) {
            this.refs.deleteConfirmationDialog.close();
            this.props.getStageDetails()
        }
    }


    onEditorStateChange = async (editorState) => {
        let editorSourceHTML = await draftToHtml(convertToRaw(editorState.getCurrentContent())),
            editorSourceHTMLRow = convertToRaw(editorState.getCurrentContent()).blocks[0].text
        await this.setState({
            editorState: editorState,
            form: {
                ...this.state.form,
                text: editorSourceHTMLRow === "" ? "" : editorSourceHTML
            }
        });
    };

    editorChangeHandler = async (content) => {

        console.log(content.level.content)

        this.setState({
            form: {
                ...this.state.form,
                text: content.level.content
            }
        });
    }

    render() {
        console.log("this.state, this.props", this.state, this.props)
        console.log(this.state.form.title)
        console.log(this.props.formValues.video_thum)
        return <div className='formWrapper'>
            < div className='info-panel d-flex justify-content-center' > Sub category</div >

            <FormGroup row>
                <Label htmlFor="title" sm={4}><span>Title<em>*</em></span></Label>
                <Col sm={6}>
                    <Input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Enter Title"
                        value={this.state.form.title}
                        disabled={!this.props.is_edit && !this.props.is_add}
                        onChange={(e) => this.changeValuesHandler(e)} />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label htmlFor="author" sm={4}><span>Author<em></em></span></Label>
                <Col sm={6}>
                    <Input
                        type="text"
                        name="author"
                        id="author"
                        placeholder="Enter Author"
                        value={this.state.form.author}
                        disabled={!this.props.is_edit && !this.props.is_add}
                        onChange={(e) => this.changeValuesHandler(e)} />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label htmlFor="read_time" sm={4}><span>Read Time<em>*</em></span></Label>
                <Col sm={6}>
                    <Input
                        type="number"
                        name="read_time"
                        id="read_time"
                        placeholder="Enter Read Time"
                        value={this.state.form.read_time}
                        disabled={!this.props.is_edit && !this.props.is_add}
                        onChange={(e) => this.changeValuesHandler(e)} />
                </Col>
            </FormGroup>
            <FormGroup row >
                <Label htmlFor="sub-category-image-text" sm={4}><span>Image<em>* <br />(Please upload image size of 320*160)</em></span></Label>
                <Col sm={3}>
                    <Label className='upload-doc' htmlFor={"sub-category-image" + (this.props.sub_category_id ? this.props.sub_category_id : '0000')}>
                        <img src={require('../../../assets/img/upload-file.png')} />
                        <Input
                            id={"sub-category-image" + (this.props.sub_category_id ? this.props.sub_category_id : '0000')}
                            type="file"
                            name="image"
                            accept='image/*'
                            onChange={this.imageSelectHandler}
                            disabled={!(this.props.is_edit || this.props.is_add)}
                        />
                    </Label>
                </Col>
            </FormGroup>
            <div className="attachFiles">
                <Col sm={4}>
                </Col>
                {
                    this.state.previewImage
                        ?
                        <Col sm={8}>
                            <img className="tag-video" src={this.state.previewImage} />
                            {
                                this.props.is_edit || this.props.is_add
                                    ?
                                    <i onClick={this.removeImageHandler} className="close-icon ti-close ml-2 mr-2 mb-20"></i>
                                    :
                                    null
                            }
                        </Col>
                        :
                        null
                }
            </div>
            <FormGroup row>
                <Label htmlFor="type" sm={4}><span>Type<em>*</em></span></Label>
                <Col sm={6}>
                    <Input type="select" name="type" id="type" disabled={!this.props.is_edit && !this.props.is_add} value={this.state.form.type} onChange={(e) => this.changeValuesHandler(e)}>
                        <option value='text'>Text</option>
                        <option value='audio'>Audio</option>
                        <option value='video'>Video</option>
                        <option value='pdf'>PDF</option>
                    </Input>
                </Col>
            </FormGroup>
            {
                this.state.form.type === 'audio' || this.state.form.type === 'video'
                    ?
                    <>
                        <FormGroup row>
                            <Label htmlFor="audio_text" sm={4}><span>{this.state.form.type === 'audio' ? "Audio Text" : "Video Text"}<em>*  </em></span></Label>
                            <Col sm={6}>
                                <Input
                                    type="text"
                                    name="audio_text"
                                    id="audio_text"
                                    placeholder={this.state.form.type === 'audio' ? "Enter Audio Text" : "Enter Video Text"}
                                    value={this.state.form.audio_text}
                                    disabled={!this.props.is_edit && !this.props.is_add}
                                    onChange={(e) => this.changeValuesHandler(e)} />
                            </Col>
                        </FormGroup>
                        {
                            this.state.form.type === 'video' ? null : <>
                                <FormGroup row >
                                    <Label htmlFor="audio-background-image-text" sm={4}><span>Audio Background Image<em>* <br />(Please upload background image size of 1125 × 2436)</em></span></Label>
                                    <Col sm={3}>
                                        <Label className='upload-doc' htmlFor={"audio-background-image" + (this.props.sub_category_id ? this.props.sub_category_id : '0000')}>
                                            <img src={require('../../../assets/img/upload-file.png')} />
                                            <Input
                                                id={"audio-background-image" + (this.props.sub_category_id ? this.props.sub_category_id : '0000')}
                                                type="file"
                                                name="audio_b_image"
                                                accept={`image/*`}
                                                onChange={this.audioBImageSelectHandler}
                                                disabled={!(this.props.is_edit || this.props.is_add)}
                                            />
                                        </Label>
                                    </Col>
                                </FormGroup>
                                <div className="attachFiles">
                                    <Col sm={4}>
                                    </Col>
                                    <Col sm={8}>
                                        <img className="tag-video" src={this.state.previewAudioBImage} />
                                        {
                                            this.props.is_edit || this.props.is_add
                                                ?
                                                <i onClick={this.removeBImageHandler} className="close-icon ti-close ml-2 mr-2 mb-20"></i>
                                                :
                                                null
                                        }
                                    </Col>
                                </div>
                            </>
                        }
                    </>
                    :
                    null
            }
            {
                this.state.form.type === 'text'
                    ?
                    <FormGroup row>
                        <Label htmlFor="title" sm={4}><span>Text<em>*</em></span></Label>
                        <Col sm={6} className="CK">
                            <Input
                                type="textarea"
                                name="text"
                                id="text"
                                placeholder="Enter Text"
                                value={this.state.form.text}
                                onKeyPress={(e) => this.enterPressed(e)}
                                onChange={(e) => this.changeValuesHandler(e)} />
                            {/* <CKEditor
                                name="text"
                                editor={ClassicEditor}
                                data={this.state.form.text}
                                disabled={!this.props.is_edit && !this.props.is_add}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    this.changeValuesHandler({ target: { name: 'text', value: data } })
                                }}
                            /> */}


                            {/* <Editor
                                name="text"

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
                                    fontSize: {
                                        //   icon: fontSize,
                                        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],

                                    },
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
                                initialValue={this.state.form.text}
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
                            <Label htmlFor="sub-category-file-text" sm={4}><span>File<em>* <br /> {this.state.form.type == "video" ? "(Please upload max 85MB video)" : null}</em></span></Label>
                            <Col sm={3}>
                                <Label className='upload-doc' htmlFor={"sub-category-file" + (this.props.sub_category_id ? this.props.sub_category_id : '0000')}>
                                    <img src={require('../../../assets/img/upload-file.png')} />
                                    <Input
                                        id={"sub-category-file" + (this.props.sub_category_id ? this.props.sub_category_id : '0000')}
                                        type="file"
                                        name="file"
                                        accept={`${this.state.form.type}/*,application/${this.state.form.type}`}
                                        onChange={this.fileSelectHandler}
                                        disabled={!(this.props.is_edit || this.props.is_add)}
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
                                        <video className="tag-video" height={200} width={300} id={`previewVideo${this.state.form.title.trim()}`} src={this.state.previewVideo} controls>
                                        </video>
                                        {
                                            this.props.is_edit || this.props.is_add
                                                ?
                                                <i onClick={this.removeFileHandler} className="close-icon ti-close ml-2 mr-2 mb-20"></i>
                                                :
                                                null
                                        }
                                    </Col>
                                    :
                                    (this.state.form.type === 'audio' || this.state.form.type === 'pdf') && this.state.previewText
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
            {
                this.props.is_edit || this.props.is_add
                    ?
                    <div className='pb-1'>
                        <Button variant="contained" className="text-white btn-primary mr-2" onClick={this.saveHandler}>Save</Button>
                        <Button variant="contained" className="text-white btn-danger" onClick={this.props.cancelHandler}>Cancel</Button>
                    </div>
                    :
                    this.props.sub_category_id
                        ?
                        <div className='pb-1'>
                            <Button variant="contained" className="text-white btn-primary" onClick={this.props.editSubCategoryClickHandler}>Edit</Button>
                            <Button variant="contained" className="text-white btn-danger ml-2" onClick={this.deleteSubCategoryHandler}>Delete</Button>
                        </div>
                        :
                        null
            }
            <DeleteConfirmationDialog
                ref="deleteConfirmationDialog"
                title="Are you sure you want to delete this Sub Category?"
                onConfirm={this.deleteSubCategory}
            />
        </div >
    }
}

const mapStateToProps = ({ CommitmentReducer }) => {
    const { addCommitmentStageDetailData, editCommitmentStageDetailData, deleteSubCategoryData } = CommitmentReducer;
    return { addCommitmentStageDetailData, editCommitmentStageDetailData, deleteSubCategoryData }
}

export default connect(mapStateToProps, {
    addCommitmentStageDetail, editCommitmentStageDetail, deleteSubCategory
})(withRouter(SubCategory))