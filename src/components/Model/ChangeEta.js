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
                Change ETA
						<button type="button" className="close_btn" aria-label="Close" onClick={() => props.toggleModal()}><span aria-hidden="true">×</span></button>
            </ModalHeader>
            <ModalBody>
                <form method="post" autoComplete="off" action="">
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
                </form>
            </ModalBody>
            <ModalFooter>
                <Button style={{ backgroundColor: '#3C16D5' }} className="text-white" variant='contained' color="primary" onClick={props.changeDeliveryEtaReq}>Save</Button>
                <Button variant='contained' className="text-white btn-danger" onClick={props.toggleModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    </React.Fragment>
);
export default ChangeLoadStatus; 