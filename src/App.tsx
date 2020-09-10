import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CommonRoute from './components/CommonRoute/CommonRoute';
import { OfficeDashboard, OfficeProducts, Login } from './screens';

const App = () => (
	<Router>
		<CommonRoute path={['/', '/login']} exact component={Login} />
		<CommonRoute path={'/dashboard'} exact component={OfficeDashboard} />
		<CommonRoute path={'/products'} exact component={OfficeProducts} />
	</Router>
);

export default App;
