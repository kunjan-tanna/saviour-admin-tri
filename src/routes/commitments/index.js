
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { Form, Label } from 'reactstrap';
import { connect } from 'react-redux';
import queryString from 'query-string'
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { getProgramStageList, deleteProgramCommitmentStage, deleteSupportingMaterial } from '../../actions/CommitmentAction';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

class Stagess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stages: {},
            selectedStageId: null,
            selectedMaterialId: null
        }
        this.params = queryString.parse(this.props.location.search)
    }
    getProgramStageList = async () => {
        const reqData = { program_id: this.params.program_id }
        await this.props.getProgramStageList(reqData);
        console.log('getProgramStageList', this.props.getProgramStageListData.data)
        if (this.props.getProgramStageListData && this.props.getProgramStageListData.data) {
            await this.setState({
                stages: this.props.getProgramStageListData.data
            })
        }
    }
    componentDidMount = async () => {
        this.getProgramStageList();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(prevState.stages)
        console.log(this.state.stages)
        if (prevState.stages !== this.state.stages) {
            console.log("LETS CHECK")
            this.setState({ stages: this.state.stages });
        }
    }

    onAdd = () => {
        this.props.history.push(`/app/program/stages/add-stage?program_id=${this.params.program_id} `)
    }
    deleteStageHandler = (stage_id) => {
        this.setState({ selectedStageId: stage_id })
        this.refs.deleteStageConfirmationDialog.open();
    }
    deleteStage = async () => {
        const reqData = { stage_id: this.state.selectedStageId }
        await this.props.deleteProgramCommitmentStage(reqData);
        console.log('deleteProgramStageData', this.props.deleteProgramStageData)
        if (this.props.deleteProgramStageData && this.props.deleteProgramStageData.code) {
            this.refs.deleteConfirmationDialog.close();
            this.setState({ selectedStageId: null })
            this.getProgramStageList()
        }
    }
    deleteMaterialHandler = (material_id) => {
        this.setState({ selectedMaterialId: material_id })
        this.refs.deleteMaterialConfirmationDialog.open();
    }
    deleteMaterial = async () => {
        const reqData = { material_id: this.state.selectedMaterialId }
        await this.props.deleteSupportingMaterial(reqData);
        console.log('deleteSupportingMaterialData', this.props.deleteSupportingMaterialData)
        if (this.props.deleteSupportingMaterialData && this.props.deleteSupportingMaterialData.code) {
            this.refs.deleteMaterialConfirmationDialog.close();
            this.setState({ selectedMaterialId: null })
            this.getProgramStageList()
        }
    }

    positionHandler = async (stage, index, direction) => {
        let stages = this.state.stages
        let item1, item2;

        if (direction === 'up') {
            item1 = stages[index - 1]
            item2 = stages[index]

            stages[index] = item1;
            stages[index - 1] = item2;

            await this.setState({ stages: stages });

        } else {
            item1 = stages[index + 1]
            item2 = stages[index]

            stages[index] = item1;
            stages[index + 1] = item2;

            await this.setState({ stages: stages });
        }
        console.log("Ready to Change the Position")
    }

    render() {
        console.log("INDEX", this.state)
        return <div className="addCarrierMain">
            <Helmet>
                <title>Stages</title>
                <meta name="description" content="Reactify Widgets" />
            </Helmet>
            <PageTitleBar
                title="Stages"
                match={this.props.match}
            />
            <div className="addCarrierMain">
                <Button onClick={this.onAdd} color='primary' variant="contained" className="text-white">Create Stage</Button>
            </div>
            <br />
            <section className="position-relative">
                <div>
                    <RctCollapsibleCard fullBlock>
                        <div className="table-responsive">
                            <div className="d-flex justify-content-between border-bottom tableContent">
                                <div className="col-sm-12 col-md-12 col-xl-12 carrierReview">
                                    <div className='info-panel d-flex justify-content-center'><b>Commitment Info</b></div>
                                    {
                                        this.state.stages.length > 0 && this.state.stages.map((stage, i) =>

                                            <Form className='addCarrierForm smoothSwap' >
                                                <div className='formWrapper'>

                                                    {/* <div className="positionChanger float-right">
                                                        {i == 0 ? null : <i className="positionArrow ti-arrow-circle-up" title="Move Up" onClick={() => this.positionHandler(stage, i, "up")}></i>}
                                                        {i == (this.state.stages.length - 1) ? null : <i className="positionArrow ti-arrow-circle-down" title="Move Down" onClick={() => this.positionHandler(stage, i, "down")}></i>}
                                                    </div> */}
                                                    <div className="detailTable">

                                                        <table>
                                                            <tr>
                                                                <td><Label htmlFor="firstName"><b> Stage Name : </b></Label></td>
                                                                <td className="">
                                                                    <div className='profileTxt'>&nbsp;{stage.stage_name}</div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td><Label htmlFor="firstName"><b> Stage Title : </b></Label></td>
                                                                <td><span className='profileTxt'>&nbsp;{stage.title}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td className="stateDesp"><Label htmlFor="firstName"><b> Stage Description : </b></Label></td>
                                                                <td><span className='profileTxt'>{stage.description}</span></td>
                                                            </tr>
                                                            <tr>
                                                                {/* <td><Label htmlFor="dot"><b>Stage Image : </b></Label></td> */}
                                                                <td><Label htmlFor="dot"><b>Actions : </b></Label></td>
                                                                <td>
                                                                    {/* <img src={stage.image} style={{ maxWidth: '200px' }} /> */}
                                                                    <Link style={{ margin: '5px' }} to={{
                                                                        pathname: 'stages/edit-stage',
                                                                        search: `?stage_id=${stage.stage_id}`,
                                                                    }}><i className="ti-pencil" aria-hidden="true"></i></Link>
                                                                    <Link style={{ margin: '5px' }} to={{
                                                                        pathname: 'stages/add-material',
                                                                        search: `?stage_id=${stage.stage_id}`,
                                                                    }}><i className="ti-plus" aria-hidden="true"></i></Link>
                                                                    <span style={{ margin: '5px', color: 'red', cursor: 'pointer' }} onClick={() => this.deleteStageHandler(stage.stage_id)}><i className="ti-trash" aria-hidden="true"></i></span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td><Label htmlFor="firstName"><b> Materials : </b></Label></td>
                                                                <td></td>
                                                            </tr>

                                                        </table>



                                                        {
                                                            stage.material_detail && stage.material_detail.length > 0
                                                                ?
                                                                <>
                                                                    {
                                                                        stage.material_detail.map(material => {
                                                                            return <div className='formWrapper'>
                                                                                <table>
                                                                                    <tr>
                                                                                        <td><Label htmlFor="firstName"><b> Title : </b></Label></td>
                                                                                        <td><span className='profileTxt'>&nbsp;{material.material_title}</span></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td><Label htmlFor="firstName"><b> Material by : </b></Label></td>
                                                                                        <td><span className='profileTxt'>&nbsp;{material.material_by ? material.material_by : "N/A"}</span></td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td><Label htmlFor="dot"><b>Stage Image : </b></Label></td>
                                                                                        <td>
                                                                                            <img src={material.image} style={{ maxWidth: '200px' }} />
                                                                                            <Link style={{ margin: '5px' }} to={{
                                                                                                pathname: 'stages/edit-material',
                                                                                                search: `?material_id=${material.material_id}`,
                                                                                            }}><i className="ti-pencil" aria-hidden="true"></i></Link>
                                                                                            <span style={{ margin: '5px', color: 'red', cursor: 'pointer' }} onClick={() => this.deleteMaterialHandler(material.material_id)}><i className="ti-trash" aria-hidden="true"></i></span>
                                                                                        </td>
                                                                                    </tr>

                                                                                </table>


                                                                            </div>
                                                                        })
                                                                    }
                                                                </>
                                                                :
                                                                <div>No Materials Found</div>
                                                        }
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                </div>
                            </div>
                        </div>
                    </RctCollapsibleCard >
                </div >
            </section>
            <DeleteConfirmationDialog
                ref="deleteStageConfirmationDialog"
                title="Are you sure you want to delete this Stage?"
                onConfirm={() => this.deleteStage()}
            />
            <DeleteConfirmationDialog
                ref="deleteMaterialConfirmationDialog"
                title="Are you sure you want to delete this Material?"
                onConfirm={() => this.deleteMaterial()}
            />
        </div >
    }
}

const mapStateToProps = ({ CommitmentReducer }) => {
    const { getProgramStageListData, deleteProgramStageData, deleteSupportingMaterialData } = CommitmentReducer;
    return { getProgramStageListData, deleteProgramStageData, deleteSupportingMaterialData }
}

export default connect(mapStateToProps, {
    getProgramStageList,
    deleteProgramCommitmentStage,
    deleteSupportingMaterial
})(Stagess);
