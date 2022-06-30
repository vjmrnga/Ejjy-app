import { Divider } from 'antd';
import { AppSettingsModal } from 'components';
import { Box, Button } from 'components/elements';
import { IS_APP_LIVE, MAX_PAGE_SIZE, request } from 'global';
import { useUsers } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { getKeyDownCombination, getLocalApiUrl, getOnlineApiUrl } from 'utils';
import { LoginForm } from './components/LoginForm';
import './style.scss';

const Login = () => {
	// STATES
	const [appSettingsModalVisible, setAppSettingsModalVisible] = useState(false);
	const [isSetupButtonsVisible, setSetupButtonsVisible] = useState(false);
	const [isUserAPIEnabled, setIsUserAPIersEnabled] = useState(false);

	// CUSTOM HOOKS
	const { login, status, errors } = useAuth();
	useUsers({
		params: {
			pageSize: MAX_PAGE_SIZE,
		},
		options: {
			notifyOnChangeProps: [],
			enabled: isUserAPIEnabled,
		},
	});

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	useEffect(() => {
		if (!getLocalApiUrl() || !getOnlineApiUrl()) {
			setAppSettingsModalVisible(true);
			setSetupButtonsVisible(true);
		}
	}, []);

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (['meta+s', 'ctrl+s'].includes(key) && !IS_APP_LIVE) {
			event.preventDefault();
			setSetupButtonsVisible((value) => !value);
		}
	};

	return (
		<section className="Login">
			<Box className="container">
				<img
					src={require('../../../assets/images/logo.jpg')}
					alt="logo"
					className="logo"
				/>

				<LoginForm
					onSubmit={login}
					errors={errors}
					loading={status === request.REQUESTING}
				/>

				{isSetupButtonsVisible && (
					<>
						<Divider />

						<Button
							type="button"
							text="Set App Settings"
							variant="default"
							onClick={() => setAppSettingsModalVisible(true)}
							block
						/>

						{appSettingsModalVisible && (
							<AppSettingsModal
								onSuccess={() => {
									window.location.reload();
								}}
								onClose={() => setAppSettingsModalVisible(false)}
							/>
						)}
					</>
				)}
			</Box>
		</section>
	);
};

export default Login;
