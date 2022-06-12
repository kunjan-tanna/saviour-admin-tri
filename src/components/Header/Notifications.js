/**
 * Notification Component
 */
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { Badge } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getNotifications, readNotifications } from '../../actions/AdminAuthAction'
import moment from 'moment';
// api
// import api from 'Api';

// intl messages
import IntlMessages from 'Util/IntlMessages';

class Notifications extends Component {

   state = {
      notifications: [],
      notification_count: ''
   }

   componentDidMount() {
      this.getNotifications();
   }

   // get notifications
   getNotifications = async () => {
      await this.props.getNotifications();
      if (this.props.notificationsData && this.props.notificationsData.data && this.props.notificationsData.code === 1) {
         console.log("this.props.notificationsData", this.props.notificationsData)
         this.setState({ notifications: this.props.notificationsData.data.notifications, notification_count: this.props.notificationsData.data.unreadCounts })
      }
      console.log("this state===========", this.state)
   }
   notificationBellClickHandler = async () => {
      console.log("onClick={this.notificationBellClickHandler}")
      if (this.props.notificationsData.data && this.props.notificationsData.data.unreadCounts > 0) {
         console.log("onClick={this.notificationBellClickHandler}")

         await this.props.readNotifications()
         if (Object.keys(this.props.readNotificationsData).length > 0) {
            this.getNotifications()
         }
      }
   }
   notificationClickHandler = (notification) => {
      console.log("notification", notification)
      document.getElementById("drop_down").click();
      if (notification.load_id) {
         this.props.history.push(`/app/load-details?loadId=${notification.load_id}`)
      }
   }
   render() {
      const { notifications, notification_count } = this.state;
      return (
         <UncontrolledDropdown id='drop_down' onClick={this.notificationBellClickHandler} nav className="list-inline-item notification-dropdown">
            <DropdownToggle nav className="p-0">
               <Tooltip title="Notifications" placement="bottom">
                  <IconButton className="shake" aria-label="bell">
                     <i style={{ color: 'black' }} className="zmdi zmdi-notifications-active"></i>
                     {notification_count > 0 ? <Badge color="danger" className="badge-xs badge-top-right rct-notify">{notification_count}</Badge> : null}
                  </IconButton>
               </Tooltip>
            </DropdownToggle>
            <DropdownMenu right>
               <div className="dropdown-content">
                  <div className="dropdown-top d-flex justify-content-between rounded-top bg-primary">
                     <span className="text-white font-weight-bold">
                        <IntlMessages id="widgets.notifications" />
                     </span>
                     {/* <Badge color="warning">1 NEW</Badge> */}
                  </div>
                  <Scrollbars className="rct-scroll" autoHeight autoHeightMin={100} autoHeightMax={280}>
                     <ul className="list-unstyled dropdown-list">
                        {notifications && notifications.map((notification, key) => (
                           <li style={{ cursor: 'pointer' }} key={key} onClick={() => this.notificationClickHandler(notification)}>
                              <div className="media">
                                 <div className="mr-10">
                                    {/* <img src={notification.userAvatar} alt="user profile" className="media-object rounded-circle" width="50" height="50" /> */}
                                 </div>
                                 <div className="media-body pt-5">
                                    <div className="d-flex justify-content-between">
                                       <h5 className="mb-5 text-primary">{notification.load_name}</h5>
                                       <span className="text-muted fs-12">{moment(new Date(notification.created_date * 1000)).format('MM/DD/YYYY hh:mm a')}</span>
                                    </div>
                                    <span className="text-muted fs-13 d-block"><b>{notification.text.split('has posted')[0]}</b>{'has posted' + ' ' + notification.text.split('has posted')[1]}</span>
                                 </div>
                              </div>
                           </li>
                        ))}
                     </ul>
                  </Scrollbars>
               </div>
            </DropdownMenu>
         </UncontrolledDropdown>
      );
   }
}

// map state to props
const mapStateToProps = ({ adminAuthReducer }) => {
   const { notificationsData, readNotificationsData } = adminAuthReducer;
   return { notificationsData, readNotificationsData }
};

export default withRouter(connect(mapStateToProps, {
   getNotifications,
   readNotifications
})(Notifications));