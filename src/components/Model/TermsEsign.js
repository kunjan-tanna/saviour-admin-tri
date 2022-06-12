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
    Form,
    Label
} from 'reactstrap';
import 'react-datetime/css/react-datetime.css';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Link } from 'react-router-dom'

const TermsEsign = (props) => (
    <React.Fragment>
        <Modal isOpen={props.showModal} toggle={() => props.toggleModal()} >
            <ModalHeader>
                Terms and Conditions
						<button type="button" className="close_btn" aria-label="Close" onClick={() => props.toggleModal()}><span aria-hidden="true">×</span></button>
            </ModalHeader>
            <ModalBody>
                <div>
                    <p>
                        The Electronic Signatures in Global and National Commerce Act (ESIGN) states that an electronic signature is the equivalent of a written
                        signature. Please read this Electronic Records Disclosure, Agreement, and Contract above including all terms and conditions carefully and
                        save or print a copy for your records.
                        Electronic Signature (E-Signature): You consent and agree that your use of a mouse, key pad or other device to select a button, item, icon or
                        similar action while using any electronic service we offer; or in accessing or making any transactions regarding any agreement,
                        acknowledgement, consent, terms, disclosures or conditions constitutes your signature, acceptance and agreement as if actually signed by you
                        in writing. Furthermore, you agree that no certification authority or third party verification is necessary to validate your electronic signature;
                        and that the lack of such certification or third party verification will not in any way affect the enforce-ability of your signature or resulting
                        contract between you and Track my movers. You understand and agree that your e-Signature executed in conjunction with the electronic
                        submission of your contract shall be legally binding and such transaction shall be considered authorized by you.
                    </p>
                </div>
                <hr />
                <Form method="post" autoComplete="off" action="">
                    <Row>
                        <Col>
                            <FormGroup className="d-flex">
                                <FormControlLabel
                                    value={props.acceptTerm}
                                    name="acceptTerm"
                                    control={<Checkbox color="primary" />}
                                    label={<span>I agree and accept the customer review</span>}
                                    labelPlacement="end"
                                    onChange={(e) => props.onChangeSignValues(e)}
                                />
                                {/* <Link to="/terms-conditions" className="Terms" target="_blank">Terms and Conditions</Link> */}
                                <Link className="Terms" to={{
                                    pathname: '/terms-conditions',
                                    search: ``,
                                }} target="_blank">Terms and Conditions</Link>
                            </FormGroup>
                        </Col>
                    </Row>
                    {
                        props.showSignButton ?
                            <>
                                <Row>
                                    <Col md="9">
                                        <FormGroup row>
                                            <Label htmlFor="name" sm={4}><span>Name</span></Label>
                                            <Col sm={8}>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    placeholder="Enter Name"
                                                    value={props.name}
                                                    onChange={(e) => props.onChangeSignValues(e)} />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="9">
                                        <FormGroup row>
                                            <Label htmlFor="email" sm={4}><span>Email</span></Label>
                                            <Col sm={8}>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    placeholder="Enter Email"
                                                    value={props.email}
                                                    onChange={(e) => props.onChangeSignValues(e)} />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="2">
                                        <FormGroup>
                                            <Button className="text-white disable-btn" variant='contained' color="primary" disabled={props.name == '' || props.email == ''} onClick={props.signReq}>Sign</Button>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </>
                            :
                            <div>
                                <h3><b>Name : </b>{props.name}</h3>
                                <h3><b>Email : </b>{props.email}</h3>
                                <h3><b>Date : </b>{props.date}</h3>
                                <h3><b>IP Address : </b>{props.Ip}</h3>
                            </div>
                    }
                </Form>
            </ModalBody>
            <ModalFooter>
                {/* {
                    !props.showSignButton && props.acceptTerm ? */}
                <div className="FooterDiv">
                    <Button variant='contained' className="text-white btn-danger float-left" onClick={props.toggleModal}>Cancel</Button>
                    <Button style={{ backgroundColor: '#3C16D5' }} className="text-white disable-btn float-right" variant='contained' color="primary" onClick={props.sendReviewsAndRatings} disabled={props.showSignButton || !props.acceptTerm}>Submit</Button>
                </div>
            </ModalFooter>
        </Modal>
    </React.Fragment>
);
export default TermsEsign; 