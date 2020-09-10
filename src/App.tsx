import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CommonRoute from './components/CommonRoute/CommonRoute';
import {
	OfficeDashboard,
	OfficeProducts,
	Login,
	OfficeBranches,
	OfficePurchaseRequests,
	OfficeUsers,
	OfficeNotifications,
} from './screens';

const App = () => (
	<Router>
		<CommonRoute path={['/', '/login']} exact component={Login} />
		<CommonRoute path={'/dashboard'} exact component={OfficeDashboard} />
		<CommonRoute path={'/products'} exact component={OfficeProducts} />
		<CommonRoute path={'/branches'} exact component={OfficeBranches} />
		<CommonRoute path={'/purchase-requests'} exact component={OfficePurchaseRequests} />
		<CommonRoute path={'/users'} exact component={OfficeUsers} />
		<CommonRoute path={'/notifications'} exact component={OfficeNotifications} />
	</Router>
);

export default App;
