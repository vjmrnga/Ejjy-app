import { Spin } from 'antd';
import { CommonRoute, NoAuthRoute } from 'components';
import { APP_TITLE, userTypes } from 'global';
import { useInitializeData, useNetwork } from 'hooks';
import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Redirect, Switch, useHistory } from 'react-router-dom';
import Admin from 'screens/Admin';
import BranchManager from 'screens/BranchManager';
import BranchPersonnel from 'screens/BranchPersonnel';
import Login from 'screens/Common/Login/Login';
import NetworkError from 'screens/Common/NetworkError';
import OfficeManager from 'screens/OfficeManager';
import { getBranchId, getLocalApiUrl, getOnlineApiUrl } from 'utils';
import npmPackage from '../package.json';

const NETWORK_RETRY = 10;
const NETWORK_RETRY_DELAY_MS = 1000;

const App = () => {
	const history = useHistory();

	const { isFetching: isConnectingNetwork, isSuccess: isNetworkSuccess } =
		useNetwork({
			options: {
				retry: NETWORK_RETRY,
				retryDelay: NETWORK_RETRY_DELAY_MS,
				enabled: !!getLocalApiUrl() && !!getOnlineApiUrl(),
				onError: () => {
					history.replace({
						pathname: '/error',
						state: true,
					});
				},
			},
		});

	const { isLoading: isInitializingData } = useInitializeData({
		params: {
			branchId: getBranchId(),
		},
		options: {
			enabled: isNetworkSuccess,
		},
	});

	const getLoadingMessage = useCallback(() => {
		let message = '';
		if (isInitializingData) {
			message = 'Please wait while we set things up for you!';
		} else if (isConnectingNetwork) {
			message = 'Connecting to server...';
		}

		return message;
	}, [isConnectingNetwork, isInitializingData]);

	const isLoading = isConnectingNetwork || isInitializingData;

	return (
		<>
			<Helmet title={`${APP_TITLE} (v${npmPackage.version})`} />

			<Spin
				className="GlobalSpinner"
				size="large"
				spinning={isLoading}
				style={{ width: '100vw', height: '100vh' }}
				tip={getLoadingMessage()}
			>
				<Switch>
					<NoAuthRoute component={Login} path="/login" exact />

					<NoAuthRoute
						component={NetworkError}
						path="/error"
						exact
						noRedirects
					/>

					<CommonRoute
						forUserType={userTypes.ADMIN}
						isLoading={isLoading}
						path="/admin"
						render={(props) => <Admin {...props} />}
					/>

					<CommonRoute
						forUserType={userTypes.OFFICE_MANAGER}
						isLoading={isLoading}
						path="/office-manager"
						render={(props) => <OfficeManager {...props} />}
					/>

					<CommonRoute
						forUserType={userTypes.BRANCH_MANAGER}
						isLoading={isLoading}
						path="/branch-manager"
						render={(props) => <BranchManager {...props} />}
					/>

					<CommonRoute
						forUserType={userTypes.BRANCH_PERSONNEL}
						isLoading={isLoading}
						path="/branch-personnel"
						render={(props) => <BranchPersonnel {...props} />}
					/>

					<Redirect from="/" to="/login" />
				</Switch>
			</Spin>
		</>
	);
};

export default App;
