import React from 'react';
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Input,
    FormGroup,
    Button,
    Row,
    Col,
    Label
} from 'reactstrap';
import 'react-datetime/css/react-datetime.css';
import Datetime from 'react-datetime';
import moment from 'moment';



const ChangeLoadStatus = (props) => (
    <React.Fragment>
        <Modal isOpen={props.showModal} toggle={() => props.toggleModal()} >
            <ModalHeader>
                Change Load Status
						<button type="button" className="close_btn" aria-label="Close" onClick={() => props.toggleModal()}><span aria-hidden="true">×</span></button>
            </ModalHeader>
            <ModalBody>
                <form method="post" autoComplete="off" action="">
                    <Row>
                        <Col md="12">
                            <FormGroup>
                                <Label htmlFor="load_status">Load Status</Label>
                                <Input type="select" name='load_status' onChange={props.changeStatusValueHandler} value={props.load_status}>
                                    <option value=''>Select Load Status</option>
                                    <option value='Picked up'>Picked up</option>
                                    <option value='In storage'>In storage</option>
                                    <option value='Pending Truck Assignment'>Pending Truck Assignment</option>
                                    <option value='In transit'>In transit</option>
                                    <option value='Delivered'>Delievered</option>
                                    {/* <option value='shipped'>Shipped</option> */}
                                    <option value='custom'>Custom</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    {
                        props.load_status == 'custom' ? <div className="contact-form">
                            <Row>
                                <Col md="12">
                                    <FormGroup>
                                        <Label htmlFor="status_name">Load Status</Label>
                                        <Input type="text" id="status_name" onChange={(e) => props.onChangeCustomStatus(e)}
                                            value={props.status_name} placeholder='Enter Load Status' name='status_name' />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                            : null
                    }
                    {
                        props.load_status == 'In transit' ?
                            <div className="contact-form">
                                <Row>
                                    <Col md="12">
                                        <FormGroup>
                                            <Label htmlFor="eta_from">Delivery ETA From</Label>
                                            <Datetime
                                                timeFormat={false}
                                                onChange={(e) => props.changeFromDateTime(e)}
                                                value={props.eta_from}
                                                closeOnSelect={true}
                                                isValidDate={props.startDateValidation}
                                                inputProps={{ placeholder: 'From' }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12">
                                        <FormGroup>
                                            <Label htmlFor="eta_to">Delivery ETA To</Label>
                                            <Datetime
                                                timeFormat={false}
                                                onChange={(e) => props.changeToDateTime(e)}
                                                value={props.eta_to}
                                                closeOnSelect={true}
                                                isValidDate={props.endDateValidation}
                                                inputProps={{ placeholder: 'To' }}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                            : null
                    }
                </form>
            </ModalBody>
            <ModalFooter>
                <Button style={{ backgroundColor: '#3C16D5' }} className="text-white" variant='contained' color="primary" onClick={props.changeLoadStatusReq}>Save</Button>
                <Button variant='contained' className="text-white btn-danger" onClick={props.toggleModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    </React.Fragment>
);
export default ChangeLoadStatus; 