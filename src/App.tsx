import { CommonRoute, NoAuthRoute } from 'components';
import { APP_TITLE, userTypes } from 'global';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, Switch } from 'react-router-dom';
import Admin from 'screens/Admin';
import BranchManager from 'screens/BranchManager';
import BranchPersonnel from 'screens/BranchPersonnel';
import Login from 'screens/Common/Login/Login';
import OfficeManager from 'screens/OfficeManager';
import npmPackage from '../package.json';

const App = () => (
	<>
		<Helmet title={`${APP_TITLE} (v${npmPackage.version})`} />

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
