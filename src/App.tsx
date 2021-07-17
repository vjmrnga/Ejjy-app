/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, Route, Switch } from 'react-router-dom';
import { CommonRoute, NoAuthRoute } from './components';
import { APP_TITLE } from './global/constants';
import { userTypes } from './global/types';
import { Error404, Login } from './screens';
import Admin from './screens/Admin';

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
			{/* <CommonRoute path="/landing" exact component={Landing} /> */}
			{/* <CommonRoute path="/dashboard" exact component={DashboardScreens} />
			<CommonRoute
				path="/pending-transactions"
				exact
				component={PendingTransactionsScreens}
			/>
			<CommonRoute path="/products" exact component={ProductsScreens} />
			<CommonRoute path="/branches" exact component={BranchesScreens} />
			<CommonRoute path="/branches/:id" exact component={ViewBranchScreens} />
			<CommonRoute
				path="/requisition-slips"
				exact
				component={RequisitionSlipsScreens}
			/>
			<CommonRoute
				path="/requisition-slips/:id"
				exact
				component={ViewRequisitionSlipScreens}
			/>
			<CommonRoute
				path="/requisition-slips/delivery-receipt/:id"
				exact
				component={ViewDeliveryReceiptScreens}
			/>
			<CommonRoute path="/users" exact component={UsersScreens} />
			<CommonRoute
				path="/users/assign/:id"
				exact
				component={AssignUserScreens}
			/>
			<CommonRoute
				path="/notifications"
				exact
				component={NotificationsScreens}
			/>
			<CommonRoute path="/order-slips" exact component={OrderSlipsScreens} />
			<CommonRoute
				path="/preparation-slips"
				exact
				component={PreparationSlipsScreens}
			/>
			<CommonRoute
				path="/preparation-slips/:id"
				exact
				component={FulfillPreparationSlipScreens}
			/>
			<CommonRoute path="/checking" exact component={CheckingScreens} />
			<CommonRoute path="/logs" exact component={LogsScreens} />
			<CommonRoute path="/reports" exact component={ReportsScreens} />
			<CommonRoute path="/sales" exact component={SalesScreens} /> */}

			<Redirect from="/" to="/login" />
			<Route path="/404" exact component={Error404} />
			<Route path="" render={() => <Redirect to="/404" />} />
		</Switch>
	</>
);

export default App;
