
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { Form, Col, FormGroup, Input, Label, Button, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import queryString from 'query-string'
import { withRouter } from 'react-router';
import joi from 'joi-browser';

import Category from './Components/Category'
import * as common from '../../api/index';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import { addProgramCommitmentStage, editProgramCommitmentStage, getProgramCommitmentStage } from '../../actions/CommitmentAction';

const defaultCategoryForm = {
    title: '',
    description: '',
    sub_categories: []
},
    defaultStageForm = {
        stage_name: 'STAGE 1',
        title: '',
        description: '',
        image: ''
    }

class AddEditCpmmitment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            add_category_enabled: true,
            form: { ...defaultStageForm },
            previewImage: '',
            categories: [],
            edit_category_index: null,
            error: '',
            errorField: ''
        }
        this.params = queryString.parse(this.props.location.search)

    }

    getStageDetails = async () => {
        if (this.params.stage_id) {
            await this.setState({ form: { ...defaultStageForm }, categories: [], previewImage: '', edit_category_index: null })
            const reqData = { stage_id: this.params.stage_id }
            await this.props.getProgramCommitmentStage(reqData);
            if (this.props.getProgramStageData && this.props.getProgramStageData.data) {
                console.log("$$$$$$$$")
                console.log(this.props.getProgramStageData.data)
                this.setState({
                    form: {
                        stage_name: this.props.getProgramStageData.data.stage_name,
                        title: this.props.getProgramStageData.data.title,
                        description: this.props.getProgramStageData.data.description,
                        image: {}
                    },
                    previewImage: this.props.getProgramStageData.data.image,
                    categories: this.props.getProgramStageData.data.category_detail.map(category => ({
                        id: category.category_id,
                        title: category.category_name,
                        description: category.category_description,
                        sub_categories: category.sub_cat_detail.map(sub_category => ({
                            id: sub_category.comm_category_id,
                            title: sub_category.title,
                            author: sub_category.author,
                            read_time: sub_category.read_time,
                            image: sub_category.image,
                            type: sub_category.type,
                            audio_text: sub_category.audio_text,
                            audio_b_image: sub_category.audio_b_image,
                            text: sub_category.type === 'text' ? sub_category.type_text : '',
                            file: ['audio', 'video', 'pdf'].includes(sub_category.type) ? sub_category.type_text : '',
                            video_thum: sub_category.thumb_path
                        }))
                    })),
                    add_category_enabled: true,
                    edit_category_index: null
                })
            }
        }
    }
    componentDidMount = () => {
        this.getStageDetails()
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(prevState.categories)
        console.log(this.state.categories)
        if (prevState.categories !== this.state.categories) {
            console.log("LETS CHECK")
            this.setState({ categories: this.state.categories });
        }
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
        this.setState({ form: { ...this.state.form, image: {} }, previewImage: '' })
    }
    saveHandler = () => {
        const data = { ...this.state.form },
            schema = joi.object().keys({
                stage_name: joi.string().trim().required(),
                title: joi.string().trim().required(),
                description: joi.string().trim().required(),
                image: joi.any(),
            })
        joi.validate(data, schema, error => {
            if (error) {
                if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
                    let errorLog = common.validateSchema(error)
                    this.setState({ error: errorLog.error, errorField: errorLog.errorField });
                }
            } else {
                this.setState({ error: '', errorField: '' }, () => {
                    this.addEditStage(data)
                });
            }
        })
    }
    addEditStage = async (data) => {

        // parth 
        console.log("00000000000000000000")
        delete data['image']
        console.log(data)

        const formData = new FormData();
        for (const key in data) {
            formData.append([key], data[key]);
        }
        if (this.params.program_id) {
            formData.append("program_id", this.params.program_id)
            await this.props.addProgramCommitmentStage(formData)
            if (this.props.addProgramCommitmentStageData && this.props.addProgramCommitmentStageData.code === 1) {
                common.displayLog(1, this.props.addProgramCommitmentStageData.message)
                this.props.history.goBack()
            }
        } else if (this.params.stage_id) {
            formData.append("stage_id", this.params.stage_id)
            await this.props.editProgramCommitmentStage(formData)
            if (this.props.editProgramCommitmentStageData && this.props.editProgramCommitmentStageData.code === 1) {
                common.displayLog(1, this.props.editProgramCommitmentStageData.message)
                this.getStageDetails()
            }
        }
    }
    addCategoryHandler = () => {
        this.setState({ categories: [...this.state.categories, { ...defaultCategoryForm }], add_category_enabled: false })
    }
    editCategoryClickHandler = (index) => {
        this.setState({ edit_category_index: index, add_category_enabled: false })
    }
    cancelCategoryHandler = (index) => {
        if (typeof this.state.edit_category_index === 'number') {
            this.setState({ edit_category_index: null, add_category_enabled: true })
            this.getStageDetails()
        } else {
            const categories = [...this.state.categories]
            categories.splice(index, 1)
            this.setState({ categories: [...categories], add_category_enabled: true })
        }
    }
    goBack = async () => {
        await this.props.history.goBack()
    }

    positionHandler = async (index, direction) => {
        console.log("DIRECTION", direction)
        let categories = this.state.categories
        let item1, item2;

        if (direction === 'up') {
            item1 = categories[index - 1]
            item2 = categories[index]

            categories[index] = item1;
            categories[index - 1] = item2;

            await this.setState({ categories: categories });

        } else {
            item1 = categories[index + 1]
            item2 = categories[index]

            categories[index] = item1;
            categories[index + 1] = item2;

            await this.setState({ categories: categories });
        }

        let reqData = {
            id1: item1.id,
            id2: item2.id,
            type: 'category'
        }

        let response = await common.apiCallWithoutLoader('POST', 'swapIndex', reqData)

        console.log("RESPONSE OF SWAP INDEX API:", response)

    }


    render() {
        console.log("STATE: ", this.state)
        return (
            <div className="addCarrierMain">
                <Helmet>
                    <title>{this.params.commitment_id ? "Edit Stage" : "Add Stage"}</title>
                </Helmet>
                <PageTitleBar
                    title={this.params.commitment_id ? "Edit Stage" : "Add Stage"}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <div className="table-responsive">
                        <div className="d-flex justify-content-between border-bottom tableContent">
                            <div className="col-sm-12 col-md-12 col-xl-12">
                                <Form className='addCarrierForm' >
                                    <div className='formWrapper'>
                                        <div className='info-panel d-flex justify-content-center'>Stage</div>
                                        <FormGroup row>
                                            <Label htmlFor="stage_name" sm={4}><span>Stage Name<em>*</em></span></Label>
                                            <Col sm={6}>
                                                <Input type="select" name="stage_name" id="stage_name" value={this.state.form.stage_name} onChange={(e) => this.changeValuesHandler(e)}>
                                                    <option value='STAGE 1'>STAGE 1</option>
                                                    <option value='STAGE 2'>STAGE 2</option>
                                                    <option value='STAGE 3'>STAGE 3</option>
                                                    <option value='STAGE 4'>STAGE 4</option>
                                                    <option value='STAGE 5'>STAGE 5</option>
                                                    <option value='STAGE 6'>STAGE 6</option>
                                                    <option value='STAGE 7'>STAGE 7</option>
                                                    <option value='STAGE 8'>STAGE 8</option>
                                                    <option value='STAGE 9'>STAGE 9</option>
                                                    <option value='STAGE 10'>STAGE 10</option>
                                                </Input>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="title" sm={4}><span>Title<em>*</em></span></Label>
                                            <Col sm={6}>
                                                <Input
                                                    type="text"
                                                    name="title"
                                                    id="title"
                                                    placeholder="Enter Title"
                                                    value={this.state.form.title}
                                                    onChange={(e) => this.changeValuesHandler(e)} />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label htmlFor="description" sm={4}><span>Description<em>*</em></span></Label>
                                            <Col sm={6}>
                                                <Input
                                                    type="textarea"
                                                    name="description"
                                                    id="description"
                                                    placeholder="Enter Description"
                                                    value={this.state.form.description}
                                                    onChange={(e) => this.changeValuesHandler(e)} />
                                            </Col>
                                        </FormGroup>
                                        {/* <FormGroup row>
                                            <Label htmlFor="image-text" sm={4}><span>Image</span></Label>
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
                                        </FormGroup> */}
                                        {/* <div className="attachFiles">
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
                                        </div> */}
                                        {
                                            this.state.error !== '' ?
                                                <Alert color="danger">
                                                    {this.state.error}
                                                </Alert>
                                                : null
                                        }
                                        <div className='pb-1'>
                                            <Button variant="contained" className="text-white btn-primary mr-2" onClick={this.saveHandler}>Save</Button>
                                            <Button variant="contained" className="text-white btn-danger" onClick={this.goBack}>Cancel</Button>
                                        </div>
                                        {
                                            this.state.categories && this.state.categories.map((category, index) =>
                                                <div className="positionParent">
                                                    {
                                                        (this.state.add_category_enabled && this.state.edit_category_index == null) ?
                                                            <div className="positionChanger justify-content-end">

                                                                {index == 0 ? null : <i className="positionArrow fas fa-arrow-alt-circle-up" title={`Move ${category.title} up`} onClick={() => this.positionHandler(index, "up")}></i>}
                                                                {index == (this.state.categories.length - 1) ? null : <i className="positionArrow fas fa-arrow-alt-circle-down" title={`Move ${category.title} down`} onClick={() => this.positionHandler(index, "down")}></i>}
                                                            </div>
                                                            : null
                                                    }
                                                    <Category
                                                        key={index}
                                                        is_add={!this.state.add_category_enabled && typeof this.state.edit_category_index !== 'number' && !category.id}
                                                        is_edit={this.state.edit_category_index === index}
                                                        stage_id={this.params.stage_id}
                                                        category_id={category.id}
                                                        formValues={category}
                                                        getStageDetails={this.getStageDetails}
                                                        editCategoryClickHandler={() => this.editCategoryClickHandler(index)}
                                                        cancelHandler={() => this.cancelCategoryHandler(index)}
                                                    />
                                                </div>
                                            )
                                        }

                                        {/* {
                                            this.showCategories()
                                        } */}
                                        {
                                            this.params.stage_id && this.state.add_category_enabled
                                                ?
                                                <Button variant="contained" className="text-white btn-primary mr-2" onClick={this.addCategoryHandler}>Add Category</Button>
                                                :
                                                null
                                        }
                                    </div >
                                    <p><em style={{ color: '#c35151' }}>*</em><span className='mandatory-field'> SHOWS MANDATORY FIELDS</span></p>
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
    const { getProgramStageData, addProgramCommitmentStageData, editProgramCommitmentStageData } = CommitmentReducer;
    return { getProgramStageData, addProgramCommitmentStageData, editProgramCommitmentStageData }
}

export default connect(mapStateToProps, {
    getProgramCommitmentStage,
    addProgramCommitmentStage,
    editProgramCommitmentStage
})(withRouter(AddEditCpmmitment));
