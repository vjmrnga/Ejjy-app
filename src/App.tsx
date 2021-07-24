import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, Switch } from 'react-router-dom';
import { CommonRoute, NoAuthRoute } from './components';
import { APP_TITLE } from './global/constants';
import { userTypes } from './global/types';
import Admin from './screens/Admin';
import BranchManager from './screens/BranchManager';
import BranchPersonnel from './screens/BranchPersonnel';
import Login from './screens/Common/Login/Login';
import OfficeManager from './screens/OfficeManager';

const App = () => (
	<>
		<Helmet>
			<title>{APP_TITLE}</title>
		</Helmet>
		<Switch>
			<NoAuthRoute path="/login" exact component={Login} />

			<CommonRoute
				forUserType={userTypes.ADMIN}
				path="/admin"
				render={(props) => <Admin {...props} />}
			/>

			<CommonRoute
				forUserType={userTypes.OFFICE_MANAGER}
				path="/office-manager"
				render={(props) => <OfficeManager {...props} />}
			/>

			<CommonRoute
				forUserType={userTypes.BRANCH_MANAGER}
				path="/branch-manager"
				render={(props) => <BranchManager {...props} />}
			/>

			<CommonRoute
				forUserType={userTypes.BRANCH_PERSONNEL}
				path="/branch-personnel"
				render={(props) => <BranchPersonnel {...props} />}
			/>

			<Redirect from="/" to="/login" />
		</Switch>
	</>
);

export default App;
