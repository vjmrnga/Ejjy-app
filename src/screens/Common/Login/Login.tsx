import { Divider } from 'antd';
import { AppSettingsModal } from 'components';
import { Box, Button } from 'components/elements';
import { IS_APP_LIVE, request } from 'global';
import { useAuth } from 'hooks';
import React, { useEffect, useState } from 'react';
import { getKeyDownCombination, getLocalApiUrl, getOnlineApiUrl } from 'utils';
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

	return (
		<section className="Login">
			<Box className="container">
				<img
					alt="logo"
					className="logo"
					src={require('../../../assets/images/logo.jpg')}
				/>

				<LoginForm
					errors={errors}
					loading={status === request.REQUESTING}
					onSubmit={login}
				/>

				{isSetupButtonsVisible && (
					<>
						<Divider />

						<Button
							text="Set App Settings"
							type="button"
							variant="default"
							block
							onClick={() => setAppSettingsModalVisible(true)}
						/>

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
