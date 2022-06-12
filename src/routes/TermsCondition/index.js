import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    FormGroup,
    Input,
    Label
} from 'reactstrap';

import { connect } from 'react-redux';
import Images from '../../assets/images';
import Modal from 'Components/Model/ChangeLoadStatus';
import ETAModal from 'Components/Model/ChangeEta';
import SignModal from 'Components/Model/TermsEsign'
import queryString from 'query-string'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Rating from 'react-rating';
import * as common from '../../api/index';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Datetime from 'react-datetime';

class Terms extends React.Component {
    componentDidMount() {
        console.log('\n\n\n HHHHHHHHHHHHHhhhhhhh');
    }
    render() {
        return (
            <div className="TermsCondition">
                <div className="text-center Terms1">
                    <span className="title">Terms & conditions</span>
                </div>
                <div className="content">
                    <ol>
                        <li>I affirm that this review is a truthful account of my experience with the business.</li>
                        <li> I understand I should not include any personally identifiable information in describing my Customer Review and that BBB may edit my Customer Review to protect privacy rights and to remove inappropriate language.</li>
                        <li>I understand that TRACK MY MOVERS may use my contact information for verification purposes, and  share information provided by me and the business with other third parties such as regulatory agencies, law enforcement authorities, and other consumer rating/review websites such as but not limited to GOOGLE, BBB, YELP, ANGIES LIST, YELLOW PAGES, etc.</li>
                        <li>I understand and agree to let TRACK MY MOVERS post my review on my behalf to all other consumer reporting and review/rating websites such as but not limited to GOOGLE, BBB, YELP, ANGIES LIST, YELLOW PAGES, etc.</li>
                        <li>I understand I should not include any personally identifiable information in describing my customer Review and that TRACK MY MOVERS may edit my customer review to protect privacy rights and to remove inappropriate language.</li>
                        <li>I understand that TRACK MY MOVERS reserves the right to not post in accordance with its policy, including if I have a personal or business affiliation with the business or I have been offered or received any incentive or compensation to write this review.</li>
                    </ol>
                    {/* <h2 className="mt-3 mb-3"><b>ELECTRONIC DISCLOSURE AND ELECTRONIC SIGNATURE AGREEMENT.</b></h2>
                    <div>
                        <p>The Electronic Signatures in Global and National Commerce Act (ESIGN) states that an electronic signature is the equivalent of a written signature. Please read this Electronic Records Disclosure, Agreement, and Contract above including all terms and conditions carefully and save or print a copy for your records.
Electronic Signature (E-Signature): You consent and agree that your use of a mouse, key pad or other device to select a button, item, icon or similar action while using any electronic service we offer; or in accessing or making any transactions regarding any agreement, acknowledgement, consent, terms, disclosures or conditions constitutes your signature, acceptance and agreement as if actually signed by you in writing. Furthermore, you agree that no certification authority or third party verification is necessary to validate your electronic signature; and that the lack of such certification or third party verification will not in any way affect the enforce-ability of your signature or resulting contract between you and Track my movers. You understand and agree that your e-Signature executed in conjunction with the electronic submission of your contract shall be legally binding and such transaction shall be considered authorized by you. </p>
                    </div> */}
                </div>
            </div>
        );
    }
}

export default Terms;