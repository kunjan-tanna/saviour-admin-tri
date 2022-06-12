import React, { Component } from "react"
import { Col, FormGroup, Input, Label, Button, Alert } from 'reactstrap';
import { withRouter } from 'react-router';
import joi from 'joi-browser';
import { connect } from 'react-redux';

import SubCategory from './SubCategory'
import { addStageCategory, editStageCategory, deleteStageCategory } from '../../../actions/CommitmentAction';
import * as common from '../../../api/index';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

const defaultSubCategoryForm = {
    title: '',
    author: '',
    read_time: '',
    type: 'text',
    text: '',
    file: ''
}

class Category extends Component {

    state = {
        add_sub_category_enabled: true,
        form: {
            title: this.props.formValues.title,
            description: this.props.formValues.description
        },
        sub_categories: this.props.formValues.sub_categories || [],
        edit_sub_category_index: null,
        error: '',
        errorField: ''
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.setState({
                add_sub_category_enabled: true,
                form: {
                    title: this.props.formValues.title,
                    description: this.props.formValues.description
                },
                sub_categories: this.props.formValues.sub_categories || [],
                edit_sub_category_index: null,
                error: '',
                errorField: ''
            })
        }
    }

    changeValuesHandler = async (event) => {
        this.setState({ form: { ...this.state.form, [event.target.name]: event.target.value } });
    }
    saveHandler = () => {
        const data = {
            stage_id: this.props.stage_id,
            category_name: this.state.form.title,
            category_description: this.state.form.description
        },
            schema = joi.object().keys({
                stage_id: joi.string().required(),
                category_name: joi.string().trim().required(),
                category_description: joi.string().trim().required()
            })
        joi.validate(data, schema, error => {
            if (error) {
                if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
                    let errorLog = common.validateSchema(error)
                    this.setState({ error: errorLog.error, errorField: errorLog.errorField });
                }
            } else {
                this.setState({ error: '', errorField: '' }, () => {
                    this.addEditCategory(data)
                });
            }
        })
    }
    addEditCategory = async (data) => {
        if (this.props.is_edit && this.props.category_id) {
            await this.props.editStageCategory({ ...data, category_id: String(this.props.category_id), stage_id: undefined })
            if (this.props.editStageCategoryData && this.props.editStageCategoryData.code === 1) {
                common.displayLog(1, this.props.editStageCategoryData.message)
                this.props.getStageDetails()
            }
        } else {
            await this.props.addStageCategory(data)
            if (this.props.addStageCategoryData && this.props.addStageCategoryData.code === 1) {
                common.displayLog(1, this.props.addStageCategoryData.message)
                this.props.getStageDetails()
            }
        }
    }
    addSubCategoryHandler = () => {
        this.setState({ sub_categories: [...this.state.sub_categories, { ...defaultSubCategoryForm }], add_sub_category_enabled: false })
    }
    editSubCategoryClickHandler = (index) => {
        this.setState({ edit_sub_category_index: index, add_sub_category_enabled: false })
    }
    cancelSubCategoryHandler = (index) => {
        if (typeof this.state.edit_sub_category_index === 'number') {
            this.setState({ edit_sub_category_index: null, add_sub_category_enabled: true })
            this.props.getStageDetails()
        } else {
            const sub_categories = [...this.state.sub_categories]
            sub_categories.splice(index, 1)
            this.setState({ sub_categories: [...sub_categories], add_sub_category_enabled: true })
        }
    }
    deleteCategoryHandler = () => {
        this.refs.deleteConfirmationDialog.open();
    }
    deleteCategory = async () => {
        const reqData = { category_id: this.props.category_id }
        await this.props.deleteStageCategory(reqData);
        console.log('deleteStageCategoryData', this.props.deleteStageCategoryData)
        if (this.props.deleteStageCategoryData && this.props.deleteStageCategoryData.code) {
            this.refs.deleteConfirmationDialog.close();
            this.props.getStageDetails()
        }
    }

    positionHandler = async (index, direction) => {
        let sub_categories = this.state.sub_categories
        let item1, item2;

        if (direction === 'up') {
            item1 = sub_categories[index - 1]
            item2 = sub_categories[index]

            sub_categories[index] = item1;
            sub_categories[index - 1] = item2;

            await this.setState({ sub_categories: sub_categories });

        } else {
            item1 = sub_categories[index + 1]
            item2 = sub_categories[index]

            sub_categories[index] = item1;
            sub_categories[index + 1] = item2;

            await this.setState({ sub_categories: sub_categories });
        }

        let reqData = {
            id1: item1.id,
            id2: item2.id,
            type: 'sub_category'
        }

        let response = await common.apiCallWithoutLoader('POST', 'swapIndex', reqData)

        console.log("RESPONSE OF SWAP INDEX API:", response)
    }


    render() {
        return <div className='formWrapper'>
            <div className='info-panel d-flex justify-content-center smoothSwap'>Category</div>

            <FormGroup row>
                <Label htmlFor="appointment_name" sm={4}><span>Title<em>*</em></span></Label>
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
                <Label htmlFor="instructor_description" sm={4}><span>Description<em>*</em></span></Label>
                <Col sm={6}>
                    <Input
                        type="textarea"
                        name="description"
                        id="description"
                        placeholder="Enter Description"
                        value={this.state.form.description}
                        disabled={!this.props.is_edit && !this.props.is_add}
                        onChange={(e) => this.changeValuesHandler(e)} />
                </Col>
            </FormGroup>
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
                    this.props.category_id
                        ?
                        <div className='pb-1'>
                            <Button variant="contained" className="text-white btn-primary" onClick={this.props.editCategoryClickHandler}>Edit</Button>
                            <Button variant="contained" className="text-white btn-danger ml-2" onClick={this.deleteCategoryHandler}>Delete</Button>
                        </div>
                        :
                        null
            }
            {
                this.state.sub_categories && this.state.sub_categories.map((sub_category, index) =>
                    <div className="positionParent">
                        {
                            this.state.add_sub_category_enabled && this.state.edit_sub_category_index == null ?
                                < div className="positionChanger justify-content-end">
                                    {index == 0 ? null : <i className="positionArrow fas fa-arrow-alt-circle-up" title={`Move ${sub_category.title} up`} onClick={() => this.positionHandler(index, "up")}></i>}
                                    {index == (this.state.sub_categories.length - 1) ? null : <i className="positionArrow fas fa-arrow-alt-circle-down" title={`Move ${sub_category.title} down`} onClick={() => this.positionHandler(index, "down")}></i>}
                                </div>
                                : null
                        }
                        <SubCategory
                            key={index}
                            is_add={!this.state.add_sub_category_enabled && typeof this.state.edit_sub_category_index !== 'number' && !sub_category.id}
                            is_edit={this.state.edit_sub_category_index === index}
                            stage_id={this.props.stage_id}
                            category_id={this.props.category_id}
                            sub_category_id={sub_category.id}
                            formValues={sub_category}
                            getStageDetails={this.props.getStageDetails}
                            editSubCategoryClickHandler={() => this.editSubCategoryClickHandler(index)}
                            cancelHandler={() => this.cancelSubCategoryHandler(index)}
                        />
                    </div>
                )
            }
            <br />
            {
                !this.props.is_edit && this.props.category_id && this.state.add_sub_category_enabled
                    ?
                    <Button variant="contained" className="text-white btn-primary mr-2" onClick={this.addSubCategoryHandler}>Add Sub Category</Button>
                    :
                    null
            }
            <DeleteConfirmationDialog
                ref="deleteConfirmationDialog"
                title="Are you sure you want to delete this Category?"
                onConfirm={this.deleteCategory}
            />
        </div >
    }
}

const mapStateToProps = ({ CommitmentReducer }) => {
    const { addStageCategoryData, editStageCategoryData, deleteStageCategoryData } = CommitmentReducer;
    return { addStageCategoryData, editStageCategoryData, deleteStageCategoryData }
}

export default connect(mapStateToProps, {
    addStageCategory, editStageCategory, deleteStageCategory
})(withRouter(Category))