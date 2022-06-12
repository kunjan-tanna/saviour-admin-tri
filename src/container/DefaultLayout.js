/**
 * App Routes
 */
import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

// app default layout
import RctAppLayout from 'Components/RctAppLayout';

// router service
import routerService from "../services/_routerService";

import CircularProgress from '@material-ui/core/CircularProgress';

import AppConfig from '../constants/AppConfig';

class DefaultLayout extends Component {
	render() {
		const { match, loading } = this.props;
		return (
			<>
				{loading &&
					<div className='loading'>
						<CircularProgress />
					</div>
				}
				
					<RctAppLayout>
						{routerService && routerService.map((route, key) =>
							<Switch>
								<Route key={key} path={`${match.url}/${route.path}`} exact component={route.component} loading={loading} />
							</Switch>
						)}
					</RctAppLayout> 
					
				
			</>
		);
	}
}

export default withRouter(connect(null)(DefaultLayout));
