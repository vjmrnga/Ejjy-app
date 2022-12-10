import { Button, Divider } from 'antd';
import { AppSettingsModal } from 'components';
import { Box } from 'components/elements';
import { IS_APP_LIVE, request } from 'global';
import { useAuth } from 'hooks';
import React, { useEffect, useState } from 'react';
import {
	getAppType,
	getKeyDownCombination,
	getLocalApiUrl,
	getOnlineApiUrl,
} from 'utils';
import { LoginForm } from './components/LoginForm';
import './style.scss';

const Login = () => {
	// STATES
	const [appSettingsModalVisible, setAppSettingsModalVisible] = useState(false);
	const [isSetupButtonsVisible, setSetupButtonsVisible] = useState(false);

	// CUSTOM HOOKS
	const { login, status, errors } = useAuth();

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

	const handleSubmit = (formData) => {
		login({
			...formData,
			appType: getAppType(),
		});
	};

	return (
		<section className="Login">
			<Box className="container">
				<img
					alt="logo"
					className="logo"
					src={require('assets/images/logo.png')}
				/>

				<LoginForm
					errors={errors}
					loading={status === request.REQUESTING}
					onSubmit={handleSubmit}
				/>

				{isSetupButtonsVisible && (
					<>
						<Divider />

						<Button block onClick={() => setAppSettingsModalVisible(true)}>
							Configure App Settings
						</Button>

						{appSettingsModalVisible && (
							<AppSettingsModal
								onClose={() => setAppSettingsModalVisible(false)}
								onSuccess={() => {
									window.location.reload();
								}}
							/>
						)}
					</>
				)}
			</Box>
		</section>
	);
};

export default Login;
